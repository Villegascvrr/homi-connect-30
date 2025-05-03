
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ChatList from '@/components/chat/ChatList';
import ChatWindow from '@/components/chat/ChatWindow';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import DemoBanner from '@/components/layout/DemoBanner';
import { X } from 'lucide-react';

// Mock data for chat matches
const mockMatches = [
  {
    id: "1",
    name: "Laura García",
    lastMessage: "¿Has visto el piso de Chamberí?",
    timestamp: "2025-05-02T14:30:00Z",
    unread: 2,
    online: true,
    typing: false,
    imgUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3"
  },
  {
    id: "2",
    name: "Carlos Martínez",
    lastMessage: "Perfecto, hablamos mañana entonces",
    timestamp: "2025-05-02T10:15:00Z",
    unread: 0,
    online: true,
    typing: true,
    imgUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3"
  },
  {
    id: "3",
    name: "Ana López",
    lastMessage: "Me interesa compartir piso contigo",
    timestamp: "2025-05-01T18:45:00Z",
    unread: 1,
    online: false,
    typing: false,
    imgUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop&ixlib=rb-4.0.3"
  },
  {
    id: "4",
    name: "Miguel Sánchez",
    lastMessage: "¿Tienes mascotas?",
    timestamp: "2025-04-30T09:20:00Z",
    unread: 0,
    online: false,
    typing: false,
    imgUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3"
  }
];

// Mock messages for chats
const mockMessages = {
  "1": [
    {
      id: "1-1",
      senderId: "other",
      text: "Hola! Vi tu perfil y creo que seríamos buenos compañeros de piso. ¿Has visto el piso de Chamberí?",
      timestamp: "2025-05-02T14:28:00Z",
      read: true
    },
    {
      id: "1-2",
      senderId: "me",
      text: "Hola Laura! Sí, me parece muy interesante. ¿Te gustaría quedar para verlo juntos?",
      timestamp: "2025-05-02T14:30:00Z",
      read: false
    }
  ],
  "2": [
    {
      id: "2-1",
      senderId: "me",
      text: "Hola Carlos, me interesa tu anuncio. ¿El piso está disponible desde junio?",
      timestamp: "2025-05-02T10:10:00Z",
      read: true
    },
    {
      id: "2-2",
      senderId: "other",
      text: "Hola! Sí, está disponible desde el 1 de junio. ¿Te gustaría verlo?",
      timestamp: "2025-05-02T10:12:00Z",
      read: true
    },
    {
      id: "2-3",
      senderId: "me",
      text: "Genial, ¿podríamos quedar el miércoles?",
      timestamp: "2025-05-02T10:13:00Z",
      read: true
    },
    {
      id: "2-4",
      senderId: "other",
      text: "Perfecto, hablamos mañana entonces",
      timestamp: "2025-05-02T10:15:00Z",
      read: true
    }
  ],
  "3": [
    {
      id: "3-1",
      senderId: "other",
      text: "Hola! Me ha gustado mucho tu perfil",
      timestamp: "2025-05-01T18:40:00Z",
      read: true
    },
    {
      id: "3-2",
      senderId: "other",
      text: "Me interesa compartir piso contigo",
      timestamp: "2025-05-01T18:45:00Z",
      read: false
    }
  ],
  "4": [
    {
      id: "4-1",
      senderId: "other",
      text: "Hola! He visto que buscas compañero en Madrid centro",
      timestamp: "2025-04-30T09:15:00Z",
      read: true
    },
    {
      id: "4-2",
      senderId: "me",
      text: "Hola Miguel, sí, estoy buscando. ¿Tienes alguna preferencia de zona?",
      timestamp: "2025-04-30T09:18:00Z",
      read: true
    },
    {
      id: "4-3",
      senderId: "other",
      text: "¿Tienes mascotas?",
      timestamp: "2025-04-30T09:20:00Z",
      read: true
    }
  ]
};

interface ChatPageProps {
  isPreview?: boolean;
}

const ChatPage = ({ isPreview = false }: ChatPageProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [matches, setMatches] = useState(mockMatches);
  const [showMobileChat, setShowMobileChat] = useState(false);
  
  // Select first chat by default on desktop
  useEffect(() => {
    if (!isMobile && matches.length > 0 && !selectedChatId) {
      setSelectedChatId(matches[0].id);
    }
  }, [isMobile, matches, selectedChatId]);
  
  const handleSelectChat = (id: string) => {
    setSelectedChatId(id);
    
    // Mark messages as read
    setMatches(prevMatches => 
      prevMatches.map(match => 
        match.id === id ? { ...match, unread: 0 } : match
      )
    );
    
    // Show chat window on mobile
    if (isMobile) {
      setShowMobileChat(true);
    }
  };
  
  const handleBackToList = () => {
    setShowMobileChat(false);
  };
  
  // Get selected chat data
  const selectedChat = matches.find(match => match.id === selectedChatId);
  const selectedChatMessages = selectedChatId ? mockMessages[selectedChatId as keyof typeof mockMessages] : [];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {isPreview && <DemoBanner />}
      
      <main className="flex-grow bg-background">
        <div className="container mx-auto px-0 md:px-4 h-[calc(100vh-10rem)] max-h-[calc(100vh-10rem)]">
          <div className="mb-6 px-4">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              <span className="homi-gradient-text">Mensajes</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Conecta con tus matches y organiza tu búsqueda de piso compartido.
            </p>
          </div>
          
          <div className="bg-card border rounded-lg overflow-hidden h-[calc(100vh-15rem)]">
            {/* For desktop: two-column layout */}
            <div className="flex h-full">
              {/* Chat list - hidden on mobile when a chat is selected */}
              <div 
                className={`border-r ${
                  isMobile && showMobileChat ? 'hidden' : 'flex'
                } flex-col w-full md:w-1/3 h-full`}
              >
                {matches.length > 0 ? (
                  <ChatList 
                    matches={matches} 
                    selectedChatId={selectedChatId} 
                    onSelectChat={handleSelectChat}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                    <div className="mb-4 p-3 rounded-full bg-muted">
                      {/* Icon for empty state */}
                    </div>
                    <h3 className="text-lg font-medium mb-2">No tienes mensajes</h3>
                    <p className="text-muted-foreground mb-4">
                      Da like a perfiles para hacer match y comenzar a chatear
                    </p>
                    <button
                      onClick={() => navigate('/matching')}
                      className="text-homi-purple hover:text-homi-purple/80"
                    >
                      Ir a explorar perfiles
                    </button>
                  </div>
                )}
              </div>
              
              {/* Chat window - shown on desktop or on mobile when chat is selected */}
              <div 
                className={`${
                  isMobile && !showMobileChat ? 'hidden' : 'flex'
                } flex-col w-full md:w-2/3 h-full`}
              >
                {selectedChat ? (
                  <>
                    {/* Mobile back button */}
                    {isMobile && (
                      <button 
                        onClick={handleBackToList}
                        className="flex items-center p-2 bg-background/80 backdrop-blur sticky top-0 z-10 md:hidden"
                      >
                        <X size={18} className="mr-2" />
                        <span>Volver</span>
                      </button>
                    )}
                    
                    <ChatWindow 
                      chat={{
                        id: selectedChat.id,
                        name: selectedChat.name,
                        imgUrl: selectedChat.imgUrl,
                        online: selectedChat.online,
                        typing: selectedChat.typing
                      }} 
                      initialMessages={selectedChatMessages}
                    />
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                    <p className="text-muted-foreground">
                      Selecciona una conversación para comenzar a chatear
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ChatPage;
