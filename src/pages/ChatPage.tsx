import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ChatList from '@/components/chat/ChatList';
import ChatWindow from '@/components/chat/ChatWindow';
import { useAuth } from '@/context/AuthContext';
import { useMessages } from '@/hooks/use-messages';
import { useMatches } from '@/hooks/use-matches';
import { useIsMobile } from '@/hooks/use-mobile';


interface ChatPageProps {
  isPreview?: boolean;
}

const ChatPage = ({ isPreview = false }: ChatPageProps) => {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();
  
  const { data: matches, isLoading: matchesLoading, error: matchesError } = useMatches(user?.id);
  //console.log("matches", matches);
 console.log("matchesLoading", matches);
  const { data: messages, isLoading: messagesLoading, error: messagesError } = useMessages(matches);
  //console.log("messages", messages);
  console.log("messagesLoading", messages);
  const parsedMatches = matches?.flatMap((match) => { 
    const matchMessages = messages?.filter((message) => message.match_id === match.id)
    const lastMessage = matchMessages && matchMessages.length > 0 ? matchMessages[matchMessages.length - 1] : null
    return [{
      id: match.id,
      name: match.name,
      imgUrl: match.imgUrl,
      online: false,
      typing: false,
      lastMessage: lastMessage?.content || "No hay mensajes aún",
      timestamp: match.matchDate,
      unread: 0
    }]
  });
  useEffect(() => {
    // Set initial selected chat
    if (parsedMatches && parsedMatches.length > 0 && !selectedChatId) {
      //setSelectedChatId(parsedMatches[0].id);
    }
    
    // Force loading to complete after a short delay
    const timer = setTimeout(() => {
      setIsLoading(false);
      console.log("Chat page loaded successfully");
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [selectedChatId]);
  
  const handleSelectChat = (id: string) => {
    if (id === selectedChatId) return; // Skip if already selected
    setSelectedChatId(id);
    console.log("Selected chat changed to:", id);
  };
  console.log("parsedMatches", parsedMatches);
  // Find the currently selected chat
  const selectedChat = useMemo(() => parsedMatches && parsedMatches.length > 0 ? parsedMatches?.find(match => match.id === selectedChatId) || parsedMatches[0] : null, [parsedMatches, selectedChatId]);
  //console.log("selectedChat", selectedChat);
  // Show a more visible loading indicator
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-homi-purple border-t-transparent"></div>
            <p className="text-muted-foreground">Cargando chat...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }


  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      {/* Content container with proper spacing */}
      <main className="flex-grow flex flex-col">
        <div className="h-full flex flex-col">
          <div className="flex h-[calc(100vh-8rem)]">
            {/* Lista de chats - visible en móvil */}
            <div className={`${selectedChatId && isMobile ? 'hidden' : 'block'} w-full sm:w-1/3 md:w-1/4 border-r overflow-y-auto`}>
              <ChatList 
                matches={parsedMatches} 
                selectedChatId={selectedChatId} 
                onSelectChat={handleSelectChat}
              />
            </div>
            {/* Ventana de chat - visible en móvil cuando hay un chat seleccionado */}
            <div className={`${!selectedChatId && isMobile ? 'hidden' : 'block'} w-full sm:w-2/3 md:w-3/4`}>
              {selectedChat ? (
                <ChatWindow 
                  chat={{
                    id: selectedChat.id,
                    name: selectedChat.name,
                    imgUrl: selectedChat.imgUrl,
                    online: selectedChat.online,
                    typing: selectedChat.typing
                  }} 
                  initialMessages={messages?.filter((message) => message.match_id === selectedChat.id).sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()) || []}
                  user_id={user?.id}
                  isMobile={isMobile}
                  onSelectChat={(chat) => setSelectedChatId(chat?.id || null)}
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">Selecciona un chat para comenzar</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ChatPage;
