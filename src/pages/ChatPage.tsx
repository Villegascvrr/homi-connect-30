
import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useChat } from '@/hooks/use-chat';
import { useMatching } from '@/hooks/use-matching';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ChevronLeft, Send } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ChatList from '@/components/chat/ChatList';
import ChatWindow from '@/components/chat/ChatWindow';

const ChatPage: React.FC = () => {
  const { matchId } = useParams<{ matchId: string }>();
  const location = useLocation();
  const { user } = useAuth();
  const { matches, isLoadingMatches } = useMatching();
  const { messages, sendMessage, isSending, unreadCounts } = useChat(matchId);
  const [newMessage, setNewMessage] = useState('');
  const [selectedMatchId, setSelectedMatchId] = useState<string | undefined>(matchId);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 768);
  
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Set selected match based on URL parameter
  useEffect(() => {
    if (matchId) {
      setSelectedMatchId(matchId);
    }
  }, [matchId]);
  
  // Get current match details
  const currentMatch = matches.find(match => match.id === selectedMatchId);
  
  // Handle sending a message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedMatchId) return;
    
    sendMessage(newMessage);
    setNewMessage('');
  };
  
  // Handle selecting a match from the sidebar
  const handleSelectMatch = (id: string) => {
    setSelectedMatchId(id);
  };
  
  // Determine if we should show the chat list or the chat window
  const showChatList = !isSmallScreen || !selectedMatchId;
  const showChatWindow = !isSmallScreen || (isSmallScreen && selectedMatchId);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-4 pb-12 bg-transparent">
        <div className="container mx-auto px-4 h-full">
          <div className="flex flex-col h-full">
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                <span className="homi-gradient-text">Mensajes</span>
              </h1>
              <p className="text-muted-foreground max-w-2xl font-normal text-left">
                Chatea con tus matches y conoce mejor a tus futuros compañeros de piso.
              </p>
            </div>
            
            <div className="flex flex-1 gap-4 h-[70vh] min-h-[500px] lg:min-h-[600px]">
              {/* Chat list / sidebar */}
              {showChatList && (
                <div className={`${isSmallScreen ? 'w-full' : 'w-1/3'} border rounded-lg overflow-hidden`}>
                  <ChatList 
                    matches={matches}
                    selectedMatchId={selectedMatchId}
                    onSelectMatch={handleSelectMatch}
                    isLoading={isLoadingMatches}
                    unreadCounts={unreadCounts}
                  />
                </div>
              )}
              
              {/* Chat window */}
              {showChatWindow && (
                <div className={`${isSmallScreen ? 'w-full' : 'w-2/3'} border rounded-lg overflow-hidden flex flex-col`}>
                  {selectedMatchId ? (
                    <>
                      {/* Chat header */}
                      <div className="border-b p-3 flex items-center gap-3 bg-muted/30">
                        {isSmallScreen && (
                          <Link to="/chat">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <ChevronLeft className="h-4 w-4" />
                            </Button>
                          </Link>
                        )}
                        
                        {currentMatch ? (
                          <>
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={currentMatch.imgUrl} alt={currentMatch.name} />
                              <AvatarFallback>{currentMatch.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-medium text-sm">{currentMatch.name}</h3>
                              <p className="text-xs text-muted-foreground">{currentMatch.location}</p>
                            </div>
                          </>
                        ) : (
                          <div className="flex items-center gap-3">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <div>
                              <Skeleton className="h-4 w-24 mb-1" />
                              <Skeleton className="h-3 w-16" />
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Messages */}
                      <ChatWindow 
                        messages={messages} 
                        currentUserId={user?.id || ''}
                      />
                      
                      {/* Message input */}
                      <form onSubmit={handleSendMessage} className="border-t p-3 flex gap-2">
                        <Input
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Escribir mensaje..."
                          className="flex-1"
                          disabled={isSending}
                        />
                        <Button type="submit" disabled={isSending || !newMessage.trim()}>
                          <Send className="h-4 w-4" />
                        </Button>
                      </form>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                      <div className="rounded-full bg-muted p-6 mb-4">
                        <Send className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">Selecciona un chat</h3>
                      <p className="text-muted-foreground max-w-xs">
                        Elige una conversación de la lista o encuentra nuevos matches para comenzar a chatear.
                      </p>
                    </div>
                  )}
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
