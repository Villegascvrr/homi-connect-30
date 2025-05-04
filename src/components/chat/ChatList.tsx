
import React from 'react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface Match {
  id: string;
  name: string;
  imgUrl: string;
  lastMessage?: string;
  lastMessageTime?: string;
}

interface ChatListProps {
  matches: Match[];
  selectedMatchId?: string;
  onSelectMatch: (id: string) => void;
  isLoading: boolean;
  unreadCounts: Record<string, number>;
}

const ChatList: React.FC<ChatListProps> = ({
  matches,
  selectedMatchId,
  onSelectMatch,
  isLoading,
  unreadCounts
}) => {
  // Format message time
  const formatMessageTime = (timestamp?: string) => {
    if (!timestamp) return '';
    
    try {
      const date = new Date(timestamp);
      return formatDistanceToNow(date, { addSuffix: true, locale: es });
    } catch (error) {
      return '';
    }
  };

  if (isLoading) {
    return (
      <div className="h-full flex flex-col">
        <div className="p-3 border-b">
          <h2 className="font-semibold text-sm">Conversaciones</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {Array(5).fill(0).map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-2 rounded-md">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-4 w-24 mb-1" />
                <Skeleton className="h-3 w-40" />
              </div>
              <Skeleton className="h-3 w-12" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="h-full flex flex-col">
        <div className="p-3 border-b">
          <h2 className="font-semibold text-sm">Conversaciones</h2>
        </div>
        
        <div className="flex-1 flex items-center justify-center p-4 text-center">
          <div>
            <p className="text-muted-foreground mb-4">No tienes conversaciones activas</p>
            <Link to="/matching" className="text-sm text-homi-purple hover:underline">
              Encuentra matches para comenzar a chatear
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b">
        <h2 className="font-semibold text-sm">Conversaciones</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {matches.map(match => {
          const isSelected = match.id === selectedMatchId;
          const unreadCount = unreadCounts[match.id] || 0;
          
          return (
            <button
              key={match.id}
              className={cn(
                "w-full text-left flex items-center gap-3 p-3 border-b hover:bg-muted/50 transition-colors",
                isSelected && "bg-muted/80"
              )}
              onClick={() => onSelectMatch(match.id)}
            >
              <Avatar className="h-10 w-10">
                <AvatarImage src={match.imgUrl} alt={match.name} />
                <AvatarFallback>{match.name.charAt(0)}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-sm truncate">{match.name}</h3>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatMessageTime(match.lastMessageTime)}
                  </span>
                </div>
                
                <div className="flex items-center">
                  <p className={cn(
                    "text-xs truncate",
                    unreadCount > 0 ? "font-medium text-foreground" : "text-muted-foreground"
                  )}>
                    {match.lastMessage || 'Nuevo match'}
                  </p>
                  
                  {unreadCount > 0 && (
                    <span className="ml-2 bg-homi-purple text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ChatList;
