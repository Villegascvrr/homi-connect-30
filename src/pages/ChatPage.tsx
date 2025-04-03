
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ChatList from '@/components/chat/ChatList';
import ChatWindow from '@/components/chat/ChatWindow';
import DemoBanner from '@/components/layout/DemoBanner';
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
  const [selectedChatId, setSelectedChatId] = useState<string | null>(mockChatMatches[0]?.id || null);
  const { user } = useAuth();
  
  const handleSelectChat = (id: string) => {
    setSelectedChatId(id);
  };
  
  // Find the currently selected chat
  const selectedChat = mockChatMatches.find(match => match.id === selectedChatId) || mockChatMatches[0];

  return (
    <div className="min-h-screen flex flex-col">
      {isPreview && (
        <DemoBanner 
          customMessage={user 
            ? "Estás viendo una demostración de la función de chat" 
            : "Estás viendo una demostración de la función de chat"
          }
        />
      )}
      
      <Navbar />
      
      <main className="flex-grow flex flex-col pt-1">
        <div className="flex w-full h-[calc(100vh-11rem)]">
          <div className="w-full sm:w-1/3 md:w-1/4 border-r">
            <ChatList 
              matches={mockChatMatches} 
              selectedChatId={selectedChatId} 
              onSelectChat={handleSelectChat}
            />
          </div>
          <div className="hidden sm:block sm:w-2/3 md:w-3/4">
            <ChatWindow 
              chat={{
                id: selectedChat.id,
                name: selectedChat.name,
                imgUrl: selectedChat.imgUrl,
                online: selectedChat.online,
                typing: selectedChat.typing
              }} 
            />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ChatPage;
