
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Message {
  id: string;
  matchId: string;
  senderId: string;
  content: string;
  createdAt: string;
  read: boolean;
}

/**
 * Sends a message in a match chat
 */
export const sendMessage = async (
  matchId: string,
  senderId: string,
  content: string
): Promise<Message | null> => {
  try {
    // Temporarily cast to any to bypass TypeScript issues with new tables
    const supabaseAny = supabase as any;
    
    const { data, error } = await supabaseAny
      .from('messages')
      .insert({
        match_id: matchId,
        sender_id: senderId,
        content,
        created_at: new Date().toISOString(),
        read: false
      })
      .select('*')
      .single();

    if (error) throw error;

    // Also update the match's updated_at timestamp
    await supabaseAny
      .from('matches')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', matchId);

    return mapToMessage(data);
  } catch (error) {
    console.error('Error sending message:', error);
    toast({
      title: 'Error',
      description: 'No se pudo enviar el mensaje',
      variant: 'destructive'
    });
    return null;
  }
};

/**
 * Gets all messages in a match chat
 */
export const getMessages = async (matchId: string): Promise<Message[]> => {
  try {
    // Temporarily cast to any to bypass TypeScript issues with new tables
    const supabaseAny = supabase as any;
    
    const { data, error } = await supabaseAny
      .from('messages')
      .select('*')
      .eq('match_id', matchId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    return (data || []).map(mapToMessage);
  } catch (error) {
    console.error('Error getting messages:', error);
    return [];
  }
};

/**
 * Marks messages as read
 */
export const markMessagesAsRead = async (matchId: string, userId: string): Promise<void> => {
  try {
    // Temporarily cast to any to bypass TypeScript issues with new tables
    const supabaseAny = supabase as any;
    
    const { error } = await supabaseAny
      .from('messages')
      .update({ read: true })
      .eq('match_id', matchId)
      .neq('sender_id', userId);

    if (error) throw error;
  } catch (error) {
    console.error('Error marking messages as read:', error);
  }
};

/**
 * Sets up a real-time subscription for new messages
 */
export const subscribeToMessages = (
  matchId: string,
  onNewMessage: (message: Message) => void
) => {
  const channel = supabase
    .channel(`match_${matchId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `match_id=eq.${matchId}`
      },
      (payload) => {
        const newMessage = mapToMessage(payload.new);
        onNewMessage(newMessage);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};

/**
 * Gets unread message counts by match
 */
export const getUnreadMessageCounts = async (userId: string): Promise<Record<string, number>> => {
  try {
    // Temporarily cast to any to bypass TypeScript issues with new tables
    const supabaseAny = supabase as any;
    
    const { data: matches } = await supabaseAny
      .from('matches')
      .select('id')
      .or(`profile_one_id.eq.${userId},profile_two_id.eq.${userId}`);

    if (!matches) return {};

    const counts: Record<string, number> = {};
    
    await Promise.all(
      matches.map(async (match: any) => {
        const { data, error } = await supabaseAny
          .from('messages')
          .select('id', { count: 'exact' })
          .eq('match_id', match.id)
          .eq('read', false)
          .neq('sender_id', userId);

        if (!error && data) {
          counts[match.id] = data.length;
        }
      })
    );

    return counts;
  } catch (error) {
    console.error('Error getting unread counts:', error);
    return {};
  }
};

/**
 * Maps the database record to a Message type
 */
const mapToMessage = (data: any): Message => {
  return {
    id: data.id,
    matchId: data.match_id,
    senderId: data.sender_id,
    content: data.content,
    createdAt: data.created_at,
    read: data.read
  };
};
