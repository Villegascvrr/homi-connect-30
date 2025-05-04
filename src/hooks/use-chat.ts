
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  sendMessage, 
  getMessages, 
  markMessagesAsRead, 
  subscribeToMessages,
  getUnreadMessageCounts,
  Message
} from '@/services/ChatService';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  read: boolean;
}

export function useChat(matchId?: string) {
  const { user } = useAuth();
  const userId = user?.id;
  const queryClient = useQueryClient();
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Get messages for the current match
  const { 
    data: fetchedMessages = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['messages', matchId],
    queryFn: async () => {
      if (!matchId) return [];
      
      const messages = await getMessages(matchId);
      return messages.map(mapToChatMessage);
    },
    enabled: !!matchId && !!userId,
  });

  // Update local messages when fetched messages change
  useEffect(() => {
    if (fetchedMessages.length > 0) {
      setMessages(fetchedMessages);
    }
  }, [fetchedMessages]);

  // Mark messages as read when match is viewed
  useEffect(() => {
    if (matchId && userId) {
      markMessagesAsRead(matchId, userId);
    }
  }, [matchId, userId]);

  // Set up real-time subscription for new messages
  useEffect(() => {
    if (!matchId) return;
    
    const unsubscribe = subscribeToMessages(matchId, (newMessage) => {
      const chatMessage = mapToChatMessage(newMessage);
      
      setMessages(prev => [...prev, chatMessage]);
      
      // If the message is from the other user, mark it as read
      if (newMessage.senderId !== userId) {
        markMessagesAsRead(matchId, userId!);
      }
      
      // Invalidate unread counts
      queryClient.invalidateQueries({ queryKey: ['unreadCounts'] });
    });
    
    return () => {
      unsubscribe();
    };
  }, [matchId, userId, queryClient]);

  // Get unread message counts for all matches
  const {
    data: unreadCounts = {},
    isLoading: isLoadingCounts,
    refetch: refetchCounts
  } = useQuery({
    queryKey: ['unreadCounts', userId],
    queryFn: async () => {
      if (!userId) return {};
      return await getUnreadMessageCounts(userId);
    },
    enabled: !!userId,
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async ({ content }: { content: string }) => {
      if (!matchId || !userId) throw new Error('Missing match ID or user ID');
      
      return await sendMessage(matchId, userId, content);
    },
    onSuccess: (newMessage) => {
      if (newMessage) {
        const chatMessage = mapToChatMessage(newMessage);
        setMessages(prev => [...prev, chatMessage]);
      }
    },
  });

  // Handle send message
  const handleSendMessage = (content: string) => {
    if (!content.trim()) return;
    
    sendMessageMutation.mutate({ content });
  };

  // Map service message to chat message format
  const mapToChatMessage = (message: Message): ChatMessage => {
    return {
      id: message.id,
      senderId: message.senderId,
      text: message.content,
      timestamp: message.createdAt,
      read: message.read
    };
  };

  return {
    messages,
    isLoading,
    error,
    sendMessage: handleSendMessage,
    isSending: sendMessageMutation.isPending,
    refetch,
    unreadCounts,
    isLoadingCounts,
    refetchCounts
  };
}
