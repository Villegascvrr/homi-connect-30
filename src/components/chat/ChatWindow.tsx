
import React, { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Skeleton } from '@/components/ui/skeleton';

interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  read: boolean;
}

interface ChatWindowProps {
  messages: ChatMessage[];
  currentUserId: string;
  isLoading?: boolean;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ 
  messages, 
  currentUserId,
  isLoading = false
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current && messages.length > 0) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  // Format message timestamp
  const formatMessageTime = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return format(date, 'HH:mm', { locale: es });
    } catch (error) {
      return '';
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {Array(5).fill(0).map((_, i) => (
          <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
            <Skeleton className={`h-10 max-w-[80%] ${i % 2 === 0 ? 'rounded-l-lg rounded-tr-lg' : 'rounded-r-lg rounded-tl-lg'}`} style={{ width: `${100 + Math.random() * 200}px` }} />
          </div>
        ))}
      </div>
    );
  }
  
  // Group messages by date
  const groupedMessages: { [date: string]: ChatMessage[] } = {};
  
  messages.forEach(message => {
    try {
      const date = new Date(message.timestamp);
      const dateKey = format(date, 'yyyy-MM-dd');
      
      if (!groupedMessages[dateKey]) {
        groupedMessages[dateKey] = [];
      }
      
      groupedMessages[dateKey].push(message);
    } catch (error) {
      // Handle invalid dates
      const fallbackKey = 'unknown-date';
      if (!groupedMessages[fallbackKey]) {
        groupedMessages[fallbackKey] = [];
      }
      
      groupedMessages[fallbackKey].push(message);
    }
  });
  
  // Format date for display
  const formatDateHeader = (dateKey: string) => {
    if (dateKey === 'unknown-date') return 'Fecha desconocida';
    
    try {
      const date = new Date(dateKey);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (date.toDateString() === today.toDateString()) {
        return 'Hoy';
      } else if (date.toDateString() === yesterday.toDateString()) {
        return 'Ayer';
      } else {
        return format(date, 'd MMMM, yyyy', { locale: es });
      }
    } catch (error) {
      return dateKey;
    }
  };
  
  return (
    <div className="flex-1 overflow-y-auto p-4">
      {messages.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center text-center p-4">
          <p className="text-muted-foreground mb-2">No hay mensajes aún</p>
          <p className="text-xs text-muted-foreground">¡Envía el primer mensaje para comenzar la conversación!</p>
        </div>
      ) : (
        <>
          {Object.keys(groupedMessages).map(dateKey => (
            <div key={dateKey} className="mb-6">
              <div className="flex justify-center mb-4">
                <span className="text-xs px-3 py-1 bg-muted rounded-full">
                  {formatDateHeader(dateKey)}
                </span>
              </div>
              
              <div className="space-y-3">
                {groupedMessages[dateKey].map(message => {
                  const isSentByMe = message.senderId === currentUserId;
                  
                  return (
                    <div key={message.id} className={cn(
                      "flex",
                      isSentByMe ? "justify-end" : "justify-start"
                    )}>
                      <div className={cn(
                        "max-w-[80%] px-4 py-2 rounded-lg",
                        isSentByMe 
                          ? "bg-homi-purple text-white rounded-bl-lg rounded-br-sm rounded-tr-lg" 
                          : "bg-muted rounded-bl-sm rounded-br-lg rounded-tl-lg"
                      )}>
                        <p className="text-sm break-words">{message.text}</p>
                        <div className={cn(
                          "flex justify-end items-center gap-1 mt-1",
                          isSentByMe ? "text-white/70" : "text-muted-foreground"
                        )}>
                          <span className="text-[10px]">{formatMessageTime(message.timestamp)}</span>
                          {isSentByMe && (
                            <span className="text-[10px]">
                              {message.read ? '• Leído' : ''}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  );
};

export default ChatWindow;
