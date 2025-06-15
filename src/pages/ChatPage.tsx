import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ChatList from '@/components/chat/ChatList';
import ChatWindow from '@/components/chat/ChatWindow';
import { useAuth } from '@/context/AuthContext';
import { useMessages } from '@/hooks/use-messages';
import { useMatches } from '@/hooks/use-matches';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Heart, Mail } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { signInWithGoogleOAuth } from '@/integrations/supabase/client';


interface ChatPageProps {
  isPreview?: boolean;
}

const ChatPage = ({ isPreview = false }: ChatPageProps) => {
  const navigate = useNavigate();
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

  if(!user){
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-20 pb-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Card className="max-w-md mx-auto p-8 shadow-md">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold mb-2">Acceso requerido</h2>
                  <p className="text-muted-foreground">
                    Para ver tus chats, necesitas iniciar sesión o registrarte
                  </p>
                </div>
          
                <div className="space-y-4">
                  <Button 
                    className="w-full bg-homi-purple hover:bg-homi-purple/90 flex items-center justify-center gap-2 rounded-full"
                    onClick={() => signInWithGoogleOAuth()}
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                      <path d="M1 1h22v22H1z" fill="none" />
                    </svg>
                    Continuar con Google
                  </Button>
          
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-muted-foreground">O</span>
                    </div>
                  </div>
                  
                  <Link to="/signin" className="w-full block">
                    <Button 
                      variant="outline" 
                      className="w-full flex items-center justify-center gap-2 rounded-full"
                    >
                      <Mail className="h-4 w-4" />
                      Iniciar sesión con email
                    </Button>
                  </Link>
          
                  <div className="text-center mt-6 text-sm text-muted-foreground">
                    <span>¿No tienes cuenta?</span>{' '}
                    <Link to="/register" className="text-homi-purple hover:underline font-medium">
                      Regístrate
                    </Link>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );  

    
  }

  if(!(parsedMatches && parsedMatches.length > 0)){
    return (
      <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      {/* Content container with proper spacing */}
      <main className="flex-grow flex flex-col">
        <div className="h-full flex flex-col">
          <div className="flex">
          <div className="text-center py-16 w-full">
            <div className="mb-6">
              <div className="inline-block p-4 rounded-full bg-muted mb-4">
                <Heart className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No tienes matches aún</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                ¡Sigue explorando perfiles y encontrarás compañeros de piso compatibles!
              </p>
            </div>
            <Button 
              onClick={() => navigate('/matching')}
              className="rounded-full bg-homi-purple hover:bg-homi-purple/90"
            >
              Explorar perfiles
            </Button>
          </div>
            
          </div>
        </div>
      </main>
      
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
