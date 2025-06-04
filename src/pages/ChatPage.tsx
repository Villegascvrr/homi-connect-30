import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ChatList from '@/components/chat/ChatList';
import ChatWindow from '@/components/chat/ChatWindow';
import { useAuth } from '@/context/AuthContext';
import { useMessages } from '@/hooks/use-messages';
import { useMatches } from '@/hooks/use-matches';

// Define a mock chat match for demo purposes
const mockChatMatches = [
  {
    id: "1",
    name: "Laura García",
    lastMessage: "¡Hola! Vi tu perfil y creo que podríamos ser buenos compañeros de piso.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    unread: 2,
    online: true,
    typing: false,
    imgUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3"
  },
  {
    id: "2",
    name: "Carlos Martínez",
    lastMessage: "Me interesa el piso que comentaste cerca de la universidad.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    unread: 0,
    online: true,
    typing: true,
    imgUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3"
  },
  {
    id: "3",
    name: "Ana López",
    lastMessage: "¿Cuándo podríamos quedar para ver el piso?",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    unread: 0,
    online: false,
    typing: false,
    imgUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop&ixlib=rb-4.0.3"
  },
  {
    id: "4",
    name: "Miguel Sánchez",
    lastMessage: "Perfecto, entonces nos vemos mañana a las 6.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    unread: 1,
    online: false,
    typing: false,
    imgUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3"
  }
];

// Define sample messages for each chat
const mockMessages = {
  "1": [
    {
      id: '1-1',
      senderId: 'other',
      text: '¡Hola! Vi tu perfil y creo que podríamos ser buenos compañeros de piso. ¿Buscas algo cerca de la universidad?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      read: true
    }, 
    {
      id: '1-2',
      senderId: 'me',
      text: 'Hola Laura, sí estoy buscando cerca del campus. Me encantaría hablar más sobre ello.',
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      read: true
    },
    {
      id: '1-3',
      senderId: 'other',
      text: '¡Genial! Tengo un piso compartido a 10 minutos de la facultad. Es amplio y luminoso.',
      timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
      read: false
    }
  ],
  "2": [
    {
      id: '2-1',
      senderId: 'other',
      text: 'Me interesa el piso que comentaste cerca de la universidad. ¿Sigue disponible?',
      timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
      read: true
    },
    {
      id: '2-2',
      senderId: 'me',
      text: 'Sí, aún está disponible. ¿Te gustaría verlo esta semana?',
      timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      read: true
    }
  ],
  "3": [
    {
      id: '3-1',
      senderId: 'me',
      text: 'Hola Ana, vi que estás buscando compañeros de piso en la zona centro.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 13).toISOString(),
      read: true
    },
    {
      id: '3-2',
      senderId: 'other',
      text: 'Sí, estoy buscando en esa zona. ¿Cuándo podríamos quedar para ver el piso?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
      read: true
    }
  ],
  "4": [
    {
      id: '4-1',
      senderId: 'other',
      text: '¿Te parece bien quedar mañana para ver el piso?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 25).toISOString(),
      read: true
    },
    {
      id: '4-2',
      senderId: 'me',
      text: 'Sí, perfecto. ¿A las 6 de la tarde?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24.5).toISOString(),
      read: true
    },
    {
      id: '4-3',
      senderId: 'other',
      text: 'Perfecto, entonces nos vemos mañana a las 6.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      read: false
    }
  ]
};

interface ChatPageProps {
  isPreview?: boolean;
}

const ChatPage = ({ isPreview = false }: ChatPageProps) => {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  
  const { data: matches, isLoading: matchesLoading, error: matchesError } = useMatches(user?.id);
  //console.log("matches", matches);
 
  const { data: messages, isLoading: messagesLoading, error: messagesError } = useMessages(matches);
  //console.log("messages", messages);
  
  const parsedMatches = matches?.map((match) => ({
    id: match.id,
    name: match.name,
    imgUrl: match.imgUrl,
    online: false,
    typing: false,
    lastMessage: "No hay mensajes aún",
    timestamp: match.matchDate,
    unread: 0
  }));
  useEffect(() => {
    // Set initial selected chat
    if (parsedMatches && parsedMatches.length > 0 && !selectedChatId) {
      setSelectedChatId(parsedMatches[0].id);
    }
    
    // Force loading to complete after a short delay
    const timer = setTimeout(() => {
      setIsLoading(false);
      console.log("Chat page loaded successfully");
    }, 300);
    
    return () => clearTimeout(timer);
  }, [selectedChatId]);
  
  const handleSelectChat = (id: string) => {
    if (id === selectedChatId) return; // Skip if already selected
    setSelectedChatId(id);
    console.log("Selected chat changed to:", id);
  };
  
  // Find the currently selected chat
  const selectedChat = useMemo(() => parsedMatches ? parsedMatches?.find(match => match.id === selectedChatId) || parsedMatches[0] : null, [parsedMatches, selectedChatId]);
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
            <div className="w-full sm:w-1/3 md:w-1/4 border-r overflow-y-auto">
              <ChatList 
                matches={parsedMatches} 
                selectedChatId={selectedChatId} 
                onSelectChat={handleSelectChat}
              />
            </div>
            <div className="hidden sm:block sm:w-2/3 md:w-3/4">
              {selectedChat && (
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
                />
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
