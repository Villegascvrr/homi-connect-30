
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, X, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

interface Tag {
  id: number;
  name: string;
}

interface MatchProfile {
  id: string;
  name: string;
  age: number;
  location: string;
  imgUrl: string;
  compatibility: number;
  matchDate: string;
  messageCount?: number;
  tags: Tag[];
}

interface MatchesListProps {
  matches: MatchProfile[];
  onMessage: (id: string) => void;
  onUnmatch: (id: string) => void;
  onViewProfile: (id: string) => void;
}

const MatchesList = ({ matches, onMessage, onUnmatch, onViewProfile }: MatchesListProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [animatingCards, setAnimatingCards] = useState<Record<string, string>>({});

  // Sort matches by most recent
  const sortedMatches = [...matches].sort((a, b) => 
    new Date(b.matchDate).getTime() - new Date(a.matchDate).getTime()
  );

  const handleUnmatch = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Add animation before unmatch
    setAnimatingCards(prev => ({ ...prev, [id]: 'unmatch' }));
    
    // Remove after animation completes
    setTimeout(() => {
      onUnmatch(id);
      toast({
        title: "Match eliminado",
        description: "Has eliminado este match de tu lista",
        variant: "default"
      });
    }, 500);
  };

  const handleMessage = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Add animation before redirecting
    setAnimatingCards(prev => ({ ...prev, [id]: 'message' }));
    
    // Navigate after animation completes
    setTimeout(() => {
      onMessage(id);
    }, 300);
  };

  const calculateDaysAgo = (dateString: string) => {
    const matchDate = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - matchDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Hoy";
    if (diffDays === 1) return "Ayer";
    return `Hace ${diffDays} días`;
  };

  if (matches.length === 0) {
    return (
      <div className="text-center py-12 px-4">
        <div className="mb-6">
          <div className="inline-block p-4 rounded-full bg-muted mb-4">
            <Heart className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No tienes matches aún</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            ¡Sigue explorando perfiles y encontrarás compañeros de piso compatibles!
          </p>
        </div>
        
        <div className="bg-homi-ultraLightPurple/50 p-3 rounded-lg mb-6 max-w-md mx-auto">
          <p className="text-sm font-medium text-homi-purple">
            Estás viendo una demostración de la función de matching. Pronto podrás conectar con compañeros reales.
          </p>
        </div>

        <Button 
          onClick={() => navigate('/matching')}
          className="rounded-full bg-homi-purple hover:bg-homi-purple/90"
        >
          Explorar perfiles
        </Button>
      </div>
    );
  }

  return (
    <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2 lg:grid-cols-3'} gap-4`}>
      <div className="col-span-full mb-4">
        <div className="bg-homi-ultraLightPurple/50 p-3 rounded-lg">
          <p className="text-sm font-medium text-homi-purple text-center">
            Estás viendo una demostración de la función de matching. Pronto podrás conectar con compañeros reales.
          </p>
        </div>
      </div>
      
      {sortedMatches.map(match => (
        <Card 
          key={match.id}
          className={`overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 ${
            animatingCards[match.id] === 'unmatch' ? 'animate-swipe-left' : 
            animatingCards[match.id] === 'message' ? 'animate-swipe-right' : ''
          }`}
          onClick={() => onViewProfile(match.id)}
        >
          <div className="relative">
            <div className="aspect-[4/3] overflow-hidden">
              <img 
                src={match.imgUrl} 
                alt={match.name}
                className="w-full h-full object-cover transition-transform hover:scale-105 duration-300" 
              />
            </div>
            
            <div className="absolute top-3 right-3 bg-white/90 text-homi-purple px-2 py-1 rounded-full text-xs font-semibold">
              {match.compatibility}% compatible
            </div>

            <div className="absolute top-3 left-3 bg-homi-purple/90 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
              <Heart size={12} className="fill-white" />
              Match
            </div>
          </div>
          
          <div className="p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold text-lg">{match.name}, {match.age}</h3>
                <p className="text-sm text-muted-foreground">{match.location}</p>
              </div>
              <div className="text-xs text-muted-foreground">
                {calculateDaysAgo(match.matchDate)}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-3">
              {match.tags.slice(0, 3).map(tag => (
                <span 
                  key={tag.id} 
                  className="px-2 py-0.5 text-xs rounded-full bg-homi-ultraLightPurple text-homi-purple"
                >
                  {tag.name}
                </span>
              ))}
            </div>
            
            <div className="flex justify-between gap-2 mt-3">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 text-red-500 hover:text-white hover:bg-red-500 border-red-500"
                onClick={(e) => handleUnmatch(match.id, e)}
              >
                <X size={16} className="mr-1" />
                Eliminar
              </Button>
              
              <Button 
                variant="default" 
                size="sm" 
                className="flex-1 bg-homi-purple hover:bg-homi-purple/90"
                onClick={(e) => handleMessage(match.id, e)}
              >
                <MessageSquare size={16} className="mr-1" />
                {match.messageCount && match.messageCount > 0 ? (
                  <span>Mensajes ({match.messageCount})</span>
                ) : (
                  <span>Mensaje</span>
                )}
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default MatchesList;
