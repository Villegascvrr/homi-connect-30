
import { useState, useEffect } from 'react';
import SwipeCard from './SwipeCard';
import { Button } from '@/components/ui/button';
import { RefreshCw, Heart } from 'lucide-react';

interface Tag {
  id: number;
  name: string;
}

interface SwipeProfile {
  id: string;
  name: string;
  age: number;
  location: string;
  bio: string;
  imgUrl: string;
  tags: Tag[];
  compatibility: number;
  lifestyle?: {
    cleanliness: string;
    noise: string;
    schedule: string;
    guests: string;
    smoking: string;
  };
  budget?: {
    min: number;
    max: number;
  };
  moveInDate?: string;
}

interface SwipeInterfaceProps {
  profiles: SwipeProfile[];
  onLike: (id: string) => void;
  onPass: (id: string) => void;
  onView: (id: string) => void;
}

const SwipeInterface = ({ profiles, onLike, onPass, onView }: SwipeInterfaceProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [history, setHistory] = useState<string[]>([]);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showMatch, setShowMatch] = useState<SwipeProfile | null>(null);
  
  const currentProfile = profiles[currentIndex];
  const hasMoreProfiles = currentIndex < profiles.length;
  
  // Reset animation state when profile changes
  useEffect(() => {
    setDirection(null);
  }, [currentIndex]);
  
  const handleSwipeAction = (action: 'like' | 'pass', id: string) => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setDirection(action === 'like' ? 'right' : 'left');
    
    // Add to history
    setHistory(prev => [...prev, id]);
    
    // Move to next profile
    setTimeout(() => {
      if (action === 'like') {
        // If it's a high compatibility match (over 85%), show match animation
        const matchedProfile = profiles.find(p => p.id === id);
        if (matchedProfile && matchedProfile.compatibility > 85) {
          setShowMatch(matchedProfile);
          
          // Hide match animation after 2.5 seconds
          setTimeout(() => {
            setShowMatch(null);
          }, 2500);
        }
        
        onLike(id);
      } else {
        onPass(id);
      }
      
      setCurrentIndex(prev => prev + 1);
      setDirection(null);
      setIsTransitioning(false);
    }, 600); // Slightly longer than the animation duration
  };
  
  const handleUndo = () => {
    if (history.length === 0 || currentIndex === 0 || isTransitioning) return;
    
    setIsTransitioning(true);
    
    setTimeout(() => {
      setCurrentIndex(prev => prev - 1);
      // Remove the last action from history
      setHistory(prev => prev.slice(0, -1));
      setIsTransitioning(false);
    }, 300);
  };
  
  const handleReset = () => {
    setCurrentIndex(0);
    setHistory([]);
    setDirection(null);
  };
  
  if (!hasMoreProfiles || !currentProfile) {
    return (
      <div className="h-full flex flex-col items-center justify-center py-12 px-4">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-3">No hay más perfiles</h2>
          <p className="text-muted-foreground mb-6">
            Has visto todos los perfiles disponibles con tus criterios actuales.
          </p>
          
          {currentIndex > 0 && (
            <Button 
              className="rounded-full bg-homi-purple hover:bg-homi-purple/90 button-glow"
              onClick={handleReset}
            >
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Ver perfiles de nuevo
            </Button>
          )}
        </div>
      </div>
    );
  }
  
  return (
    <div className="h-full relative">
      {/* Match animation overlay */}
      {showMatch && (
        <div className="fixed inset-0 bg-black/70 flex flex-col items-center justify-center z-50 animate-fade-in">
          <div className="text-center p-6 max-w-sm">
            <div className="mb-6 relative">
              <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-4 border-white">
                <img 
                  src={showMatch.imgUrl} 
                  alt={showMatch.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
                <Heart className="h-32 w-32 text-homi-purple fill-homi-purple animate-pulse opacity-70" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-2">¡Es un match!</h2>
            <p className="text-white/90 mb-6">
              ¡Tú y {showMatch.name} han demostrado interés mutuo! 
              ¿Por qué no iniciar una conversación?
            </p>
            
            <div className="space-y-3">
              <Button 
                className="w-full bg-homi-purple hover:bg-homi-purple/90"
                onClick={() => {
                  // In a real app, this would navigate to chat
                  setShowMatch(null);
                }}
              >
                Enviar mensaje
              </Button>
              <Button 
                variant="outline" 
                className="w-full text-white border-white hover:bg-white/20"
                onClick={() => setShowMatch(null)}
              >
                Seguir buscando
              </Button>
            </div>
          </div>
        </div>
      )}

      <SwipeCard
        {...currentProfile}
        onLike={(id) => handleSwipeAction('like', id)}
        onPass={(id) => handleSwipeAction('pass', id)}
        onView={onView}
        onUndo={history.length > 0 ? handleUndo : undefined}
      />
      
      <div className="text-center mt-4 animate-fade-in">
        <p className="text-sm text-muted-foreground">
          Perfil {currentIndex + 1} de {profiles.length}
        </p>
      </div>
    </div>
  );
};

export default SwipeInterface;
