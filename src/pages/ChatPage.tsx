import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ChatList from '@/components/chat/ChatList';
import ChatWindow from '@/components/chat/ChatWindow';
import { useAuth } from '@/context/AuthContext';

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

interface ChatPageProps {
  isPreview?: boolean;
}

const ChatPage = ({ isPreview = false }: ChatPageProps) => {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Set initial selected chat
    if (mockChatMatches.length > 0 && !selectedChatId) {
      setSelectedChatId(mockChatMatches[0].id);
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
  };
  
  // Find the currently selected chat
  const selectedChat = mockChatMatches.find(match => match.id === selectedChatId) || mockChatMatches[0];

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
      <main className="flex-grow flex flex-col pt-16">
        <div className="h-full flex flex-col">
          <div className="flex h-[calc(100vh-8rem)]">
            <div className="w-full sm:w-1/3 md:w-1/4 border-r overflow-y-auto">
              <ChatList 
                matches={mockChatMatches} 
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
