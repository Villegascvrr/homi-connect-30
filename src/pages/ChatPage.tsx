
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ChatList from '@/components/chat/ChatList';
import ChatWindow from '@/components/chat/ChatWindow';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import DemoBanner from '@/components/layout/DemoBanner';
import { X } from 'lucide-react';
import { useProfileMatches, MatchProfile } from '@/hooks/use-profiles';

// Mapeamos perfiles reales a los chats
const mapProfileToChat = (profile: MatchProfile) => {
  return {
    id: profile.id,
    name: profile.name,
    lastMessage: "Hola! ¿Cómo estás?",
    timestamp: new Date().toISOString(),
    unread: Math.round(Math.random()), // 0 o 1
    online: Math.random() > 0.5, // 50% probabilidad
    typing: Math.random() > 0.8, // 20% probabilidad
    imgUrl: profile.profileImage
  };
};

// Mock messages para cada chat (usamos IDs reales)
const createMockMessagesForChat = (chatId: string) => {
  const messageCount = Math.floor(Math.random() * 5) + 1; // 1-5 mensajes
  const messages = [];
  
  let timestamp = new Date();
  timestamp.setMinutes(timestamp.getMinutes() - messageCount * 5); // Espaciamos los mensajes
  
  for (let i = 0; i < messageCount; i++) {
    const isUserMessage = i % 2 === 0;
    
    messages.push({
      id: `${chatId}-${i}`,
      senderId: isUserMessage ? "me" : "other",
      text: isUserMessage ? 
        "Hola! Me interesa tu perfil. ¿Podríamos hablar sobre compartir piso?" :
        "¡Hola! Claro, me encantaría. Cuéntame más sobre ti y lo que buscas.",
      timestamp: timestamp.toISOString(),
      read: true
    });
    
    timestamp.setMinutes(timestamp.getMinutes() + 5);
  }
  
  return messages;
};

interface ChatPageProps {
  isPreview?: boolean;
}

const ChatPage = ({ isPreview = false }: ChatPageProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const { matches: profileMatches, loading: matchesLoading } = useProfileMatches();
  
  const [matches, setMatches] = useState<any[]>([]);
  const [mockMessages, setMockMessages] = useState<{[key: string]: any[]}>({});
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [showMobileChat, setShowMobileChat] = useState(false);
  
  // Convertimos perfiles reales a formato de chat
  useEffect(() => {
    if (!matchesLoading && profileMatches.length > 0) {
      // Tomamos los primeros 4 perfiles para simular chats activos
      const chatMatches = profileMatches.slice(0, 4).map(mapProfileToChat);
      setMatches(chatMatches);
      
      // Generamos mensajes mock para cada chat
      const messagesMap: {[key: string]: any[]} = {};
      chatMatches.forEach(chat => {
        messagesMap[chat.id] = createMockMessagesForChat(chat.id);
      });
      setMockMessages(messagesMap);
    }
  }, [profileMatches, matchesLoading]);
  
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
  const selectedChatMessages = selectedChatId ? mockMessages[selectedChatId] || [] : [];

  if (matchesLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-t-2 border-homi-purple rounded-full mx-auto mb-4"></div>
            <p>Cargando conversaciones...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

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
