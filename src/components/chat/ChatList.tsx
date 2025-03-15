
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface ChatMatch {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  online: boolean;
  typing: boolean;
  imgUrl: string;
}

interface ChatListProps {
  matches: ChatMatch[];
  selectedChatId: string | null;
  onSelectChat: (id: string) => void;
}

const ChatList = ({ matches, selectedChatId, onSelectChat }: ChatListProps) => {
  // Sort chats with unread messages first, then by timestamp
  const sortedMatches = [...matches].sort((a, b) => {
    if (a.unread > 0 && b.unread === 0) return -1;
    if (a.unread === 0 && b.unread > 0) return 1;
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  return (
    <div className="h-[600px] overflow-y-auto">
      {sortedMatches.map((match) => (
        <div
          key={match.id}
          className={`p-4 cursor-pointer transition-colors flex items-start gap-3 ${
            selectedChatId === match.id 
              ? 'bg-homi-ultraLightPurple' 
              : 'hover:bg-muted'
          }`}
          onClick={() => onSelectChat(match.id)}
        >
          <div className="relative">
            <div className="w-12 h-12 rounded-full overflow-hidden">
              <img 
                src={match.imgUrl} 
                alt={match.name}
                className="w-full h-full object-cover" 
              />
            </div>
            {match.online && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <h3 className="font-semibold truncate">{match.name}</h3>
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {formatDistanceToNow(new Date(match.timestamp), { 
                  addSuffix: true,
                  locale: es 
                })}
              </span>
            </div>
            
            <div className="flex justify-between items-center mt-1">
              <p className="text-sm text-muted-foreground truncate">
                {match.typing ? (
                  <span className="text-homi-purple font-medium">Escribiendo...</span>
                ) : (
                  match.lastMessage
                )}
              </p>
              {match.unread > 0 && (
                <span className="w-5 h-5 rounded-full bg-homi-purple text-white text-xs flex items-center justify-center font-medium">
                  {match.unread}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatList;
