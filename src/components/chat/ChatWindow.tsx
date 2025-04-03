
import { useState, useRef, useEffect } from 'react';
import { Send, Image, Mic, Paperclip, Smile } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChatMatch {
  id: string;
  name: string;
  imgUrl: string;
  online: boolean;
  typing: boolean;
}

interface ChatWindowProps {
  chat: ChatMatch;
}

// Sample messages for demonstration
const SAMPLE_MESSAGES = [
  {
    id: '1',
    senderId: 'other',
    text: '¡Hola! Vi tu perfil y creo que podríamos ser buenos compañeros de piso. ¿Buscas algo cerca de la universidad?',
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    read: true
  },
  {
    id: '2',
    senderId: 'me',
    text: 'Hola, sí! Estoy buscando algo cerca del campus, máximo a 15 minutos en transporte público.',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    read: true
  },
  {
    id: '3',
    senderId: 'other',
    text: 'Perfecto, yo estoy igual. Tengo visto un piso a 10 minutos del campus que se ajusta a nuestro presupuesto. ¿Te interesaría verlo?',
    timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    read: true
  },
  {
    id: '4',
    senderId: 'me',
    text: '¡Claro que sí! Me gustaría saber más detalles. ¿Cuánto sería por persona?',
    timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    read: true
  },
  {
    id: '5',
    senderId: 'other',
    text: 'Estaríamos hablando de unos 450€ por persona, con todos los gastos incluidos. Es un piso de 3 habitaciones, con cocina equipada y sala de estar.',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    read: true
  }
];

const ChatWindow = ({ chat }: ChatWindowProps) => {
  const [messages, setMessages] = useState(SAMPLE_MESSAGES);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;
    
    const message = {
      id: Date.now().toString(),
      senderId: 'me',
      text: newMessage,
      timestamp: new Date().toISOString(),
      read: false
    };
    
    setMessages([...messages, message]);
    setNewMessage('');
    
    // Simulate reply from the other person
    setTimeout(() => {
      const replyMessage = {
        id: (Date.now() + 1).toString(),
        senderId: 'other',
        text: 'Gracias por tu mensaje! Te responderé lo antes posible.',
        timestamp: new Date().toISOString(),
        read: false
      };
      setMessages(prevMessages => [...prevMessages, replyMessage]);
    }, 3000);
  };

  // Format timestamp to human-readable time
  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat header - reduced padding */}
      <div className="py-2 px-3 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="w-8 h-8 rounded-full overflow-hidden">
              <img 
                src={chat.imgUrl} 
                alt={chat.name}
                className="w-full h-full object-cover" 
              />
            </div>
            {chat.online && (
              <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border-2 border-white"></span>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-sm">{chat.name}</h3>
            <p className="text-xs text-muted-foreground">
              {chat.online ? (
                chat.typing ? 'Escribiendo...' : 'En línea'
              ) : (
                'Desconectado'
              )}
            </p>
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
      
      {/* Messages area - further reduced height */}
      <div className="flex-1 py-2 px-3 overflow-y-auto max-h-[calc(100vh-16rem)]">
        <div className="space-y-2">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`flex ${message.senderId === 'me' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] rounded-xl p-2 ${
                  message.senderId === 'me' 
                    ? 'bg-homi-purple text-white rounded-tr-none' 
                    : 'bg-gray-100 dark:bg-gray-800 rounded-tl-none'
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <div className={`text-xs mt-1 flex items-center ${
                  message.senderId === 'me' ? 'justify-end text-white/70' : 'text-muted-foreground'
                }`}>
                  {formatMessageTime(message.timestamp)}
                  {message.senderId === 'me' && (
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
      </div>
      
      {/* Message input - increased padding for keyboard space */}
      <div className="py-4 px-3 border-t border-border mt-auto">
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
            <Smile size={16} />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
            <Paperclip size={16} />
          </Button>
          
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Escribe un mensaje..."
              className="w-full p-2.5 pr-10 rounded-full border border-border bg-background focus:outline-none focus:ring-2 focus:ring-homi-purple text-sm"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendMessage();
              }}
            />
            {newMessage.trim() === '' ? (
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute right-1 top-1/2 transform -translate-y-1/2 rounded-full h-6 w-6"
              >
                <Mic size={16} className="text-muted-foreground" />
              </Button>
            ) : (
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute right-1 top-1/2 transform -translate-y-1/2 rounded-full text-homi-purple hover:text-homi-purple hover:bg-homi-ultraLightPurple h-6 w-6"
                onClick={handleSendMessage}
              >
                <Send size={16} />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
