
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
  const updatedProfiles = profiles.map(profile => {
    const profileId = parseInt(profile.id) || Math.floor(Math.random() * 10);
    
    const imageIndex = profileId % 10;
    
    const imageUrls = [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1000',
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1000',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000',
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1000',
      'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=1000',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1000',
      'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=1000',
      'https://images.unsplash.com/photo-1542327897-d73f4005b533?q=80&w=1000',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1000',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000'
    ];
    
    return {
      ...profile,
      imgUrl: imageUrls[imageIndex]
    };
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [history, setHistory] = useState<string[]>([]);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showMatch, setShowMatch] = useState<SwipeProfile | null>(null);
  const [nextCardReady, setNextCardReady] = useState(false);
  const [removedProfiles, setRemovedProfiles] = useState<Set<string>>(new Set());
  
  const filteredProfiles = updatedProfiles.filter(profile => !removedProfiles.has(profile.id));
  const currentProfile = filteredProfiles[currentIndex];
  const nextProfile = filteredProfiles[currentIndex + 1]; // Pre-load next profile
  const hasMoreProfiles = currentIndex < filteredProfiles.length;
  
  useEffect(() => {
    if (nextProfile) {
      const img = new Image();
      img.src = nextProfile.imgUrl;
      img.onload = () => setNextCardReady(true);
    }
  }, [currentIndex, nextProfile]);
  
  useEffect(() => {
    setDirection(null);
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [currentIndex]);
  
  const handleSwipeAction = (action: 'like' | 'pass', id: string) => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setDirection(action === 'like' ? 'right' : 'left');
    
    setHistory(prev => [...prev, id]);
    setRemovedProfiles(prev => new Set([...prev, id]));
    
    setTimeout(() => {
      if (action === 'like') {
        const matchedProfile = updatedProfiles.find(p => p.id === id);
        if (matchedProfile && matchedProfile.compatibility > 85) {
          setShowMatch(matchedProfile);
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
    }, 400);
  };
  
  const handleUndo = () => {
    if (history.length === 0 || currentIndex === 0 || isTransitioning) return;
    
    setIsTransitioning(true);
    
    const lastId = history[history.length - 1];
    
    setTimeout(() => {
      setRemovedProfiles(prev => {
        const newSet = new Set(prev);
        newSet.delete(lastId);
        return newSet;
      });
      
      setCurrentIndex(prev => prev - 1);
      setHistory(prev => prev.slice(0, -1));
      setIsTransitioning(false);
    }, 300);
  };
  
  const handleReset = () => {
    setCurrentIndex(0);
    setHistory([]);
    setDirection(null);
    setRemovedProfiles(new Set());
  };
  
  if (!hasMoreProfiles || !currentProfile) {
    return (
      <div className="h-full flex flex-col items-center justify-center py-8 px-4">
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
    <div className="max-h-[85vh] relative mt-2">
      {showMatch && (
        <div className="fixed inset-0 bg-black/70 flex flex-col items-center justify-center z-50 animate-fade-in">
          <div className="text-center p-6 max-w-sm animate-scale-in">
            <div className="mb-6 relative">
              <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-4 border-white animate-pulse">
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
                  setShowMatch(null);
                }}
              >
                Enviar mensaje
              </Button>
              <Button 
                variant="outline" 
                className="w-full text-white border-white hover:bg-white/20 hover:text-white focus:text-white"
                onClick={() => setShowMatch(null)}
              >
                Seguir buscando
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="relative">
        {nextProfile && nextCardReady && !isTransitioning && (
          <div className="absolute inset-0 transform scale-[0.92] -translate-y-6 opacity-40 blur-sm pointer-events-none">
            <div className="w-full max-w-xs mx-auto glass-card rounded-xl overflow-hidden">
              <div className="aspect-[3/2] bg-gray-100">
                <img 
                  src={nextProfile.imgUrl} 
                  alt="Next profile" 
                  className="w-full h-full object-cover"
                />
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
      </div>
      
      <div className="text-center mt-4 animate-fade-in">
        <p className="text-sm text-muted-foreground">
          Perfil {currentIndex + 1} de {updatedProfiles.length - removedProfiles.size + currentIndex}
        </p>
      </div>
    </div>
  );
};

export default SwipeInterface;
