import { useState, useRef, useEffect } from 'react';
import { Send, Image, Mic, Paperclip, Smile, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';

interface ChatMatch {
  id: string;
  name: string;
  imgUrl: string;
  online: boolean;
  typing: boolean;
}

interface Message {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
  read: boolean;
}

interface ChatWindowProps {
  chat: ChatMatch;
  initialMessages?: Message[];
  user_id: string;
  isMobile: boolean;
  onSelectChat: (chat: ChatMatch | null) => void;
}

const ChatWindow = ({
  chat,
  initialMessages = [],
  user_id,
  isMobile,
  onSelectChat
}: ChatWindowProps) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(false);
  
  // Reset messages when chat changes
  useEffect(() => {
    setMessages(initialMessages);
  }, [chat.id, initialMessages]);

  // Complete disable of initial autoscroll but enable for new messages
  useEffect(() => {
    // Disable initial auto scroll on component mount
    const timer = setTimeout(() => {
      setShouldAutoScroll(true);
    }, 1000); // Longer delay to ensure page is fully rendered

    return () => clearTimeout(timer);
  }, []);

  // Only scroll on new messages, not on initial load
  useEffect(() => {
    if (shouldAutoScroll && messagesEndRef.current) {
      // Don't scroll on initial render of messages
      if (messages.length >= initialMessages.length) {
        messagesEndRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'end'
        });
      }
    }
  }, [messages, shouldAutoScroll, initialMessages.length]);
  
  const handleSendMessage = async () => {
    if (newMessage.trim() === '') return;
    
    const message: Message = {
      id: Date.now().toString(),
      sender_id: user_id,
      content: newMessage,
      created_at: new Date().toISOString(),
      read: false
    };

    // Send message to supabase
    const { data, error } = await supabase.from('messages').insert({
      match_id: chat.id,
      sender_id: user_id,
      content: newMessage,
    });
    
    setMessages([...messages, message]);
    setNewMessage('');

  };

  // Format timestamp to human-readable time
  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <div className="flex flex-col h-full">
      {/* Chat header - reduced padding */}
      <div className="py-2 px-3 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isMobile && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-full mr-1"
              onClick={() => onSelectChat && onSelectChat(null)}
            >
              <ChevronLeft size={16} />
            </Button>
          )}
          <div className="relative">
            <div className="w-8 h-8 rounded-full overflow-hidden">
              <img src={chat.imgUrl} alt={chat.name} className="w-full h-full object-cover" />
            </div>
            {chat.online && <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border-2 border-white"></span>}
          </div>
          <div>
            <h3 className="font-semibold text-sm">{chat.name}</h3>
            {/*<p className="text-xs text-muted-foreground">
              {chat.online ? chat.typing ? 'Escribiendo...' : 'En línea' : 'Desconectado'}
            </p>*/}
          </div>
        </div>
        
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
            <Paperclip size={16} />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
            <Image size={16} />
          </Button>
        </div>
      </div>
      
      {/* Messages area with improved ScrollArea container */}
      <ScrollArea className="flex-1 py-2 px-3 max-h-[calc(100vh-16rem)] my-[30px]">
        <div className="space-y-2">
          {messages.map(message => (
            <div key={message.id} className={`flex ${message.sender_id === user_id ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-xl p-2 ${message.sender_id === user_id ? 'bg-homi-purple text-white rounded-tr-none' : 'bg-gray-100 dark:bg-gray-800 rounded-tl-none'}`}>
                <p className="text-sm">{message.content}</p>
                <div className={`text-xs mt-1 flex items-center ${message.sender_id === user_id ? 'justify-end text-white/70' : 'text-muted-foreground'}`}>
                  {formatMessageTime(message.created_at)}
                  {message.sender_id === user_id && (
                    <span className="ml-1">
                      {message.read ? '✓✓' : '✓'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      
      {/* Message input - improved button distribution */}
      <div className="py-4 px-3 border-t border-border mt-auto">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
            <Smile size={18} />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
            <Paperclip size={18} />
          </Button>
          
          <div className="flex-1 relative">
            <input 
              type="text" 
              placeholder="Escribe un mensaje..." 
              className="w-full p-2.5 pr-10 rounded-full border border-border bg-background focus:outline-none focus:ring-2 focus:ring-homi-purple text-sm" 
              value={newMessage} 
              onChange={e => setNewMessage(e.target.value)} 
              onKeyDown={e => {
                if (e.key === 'Enter') handleSendMessage();
              }} 
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
              {newMessage.trim() === '' ? (
                <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                  <Mic size={18} className="text-muted-foreground" />
                </Button>
              ) : (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full text-homi-purple hover:text-homi-purple hover:bg-homi-ultraLightPurple h-8 w-8" 
                  onClick={handleSendMessage}
                >
                  <Send size={18} />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
