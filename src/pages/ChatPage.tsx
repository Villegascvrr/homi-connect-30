
import { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import ChatList from '@/components/chat/ChatList';
import ChatWindow from '@/components/chat/ChatWindow';
import { MessageCircle } from 'lucide-react';

const ChatPage = () => {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [matches, setMatches] = useState([
    {
      id: '1',
      name: 'Elena',
      lastMessage: 'Hola, ¿qué tal? Me gustaría saber más sobre tus preferencias de convivencia.',
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
      unread: 2,
      online: true,
      typing: false,
      imgUrl: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7'
    },
    {
      id: '2',
      name: 'Carlos',
      lastMessage: 'Perfecto, hablamos pronto entonces.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      unread: 0,
      online: false,
      typing: false,
      imgUrl: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952'
    },
    {
      id: '3',
      name: 'Laura',
      lastMessage: 'Me interesa mucho tu oferta, ¿podríamos hablar más?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
      unread: 1,
      online: true,
      typing: true,
      imgUrl: 'https://images.unsplash.com/photo-1472396961693-142e6e269027'
    }
  ]);

  // Handle chat selection
  const selectChat = (chatId: string) => {
    setSelectedChat(chatId);
    // Mark messages as read when chat is opened
    setMatches(
      matches.map(match => 
        match.id === chatId 
          ? { ...match, unread: 0 } 
          : match
      )
    );
  };

  // Get the selected chat data
  const currentChat = matches.find(match => match.id === selectedChat);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-20 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold mb-8 flex items-center">
              <MessageCircle className="mr-2 text-homi-purple" />
              Mensajes
            </h1>
            
            {matches.length > 0 ? (
              <div className="glass-card overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-3">
                  {/* Chat list */}
                  <div className="md:col-span-1 border-r border-border">
                    <ChatList 
                      matches={matches} 
                      selectedChatId={selectedChat} 
                      onSelectChat={selectChat} 
                    />
                  </div>
                  
                  {/* Chat window */}
                  <div className="md:col-span-2">
                    {currentChat ? (
                      <ChatWindow chat={currentChat} />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-96 p-6 text-center">
                        <MessageCircle className="w-16 h-16 text-muted-foreground mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Selecciona un chat</h3>
                        <p className="text-muted-foreground mb-6">
                          Elige una conversación de la lista para comenzar a chatear
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="glass-card p-8 text-center">
                <MessageCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No tienes mensajes aún</h3>
                <p className="text-muted-foreground mb-6">
                  Encuentra matches en la sección de compatibilidad para comenzar a chatear con posibles compañeros
                </p>
                <Button 
                  className="rounded-full bg-homi-purple hover:bg-homi-purple/90"
                  onClick={() => window.location.href = '/matching'}
                >
                  Buscar compañeros
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ChatPage;
