import { useState, useEffect } from 'react';
import SwipeCard from './SwipeCard';
import { Button } from '@/components/ui/button';
import { RefreshCw, Heart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Tag {
  id: number;
  name: string;
}

interface SwipeProfile {
  id: string;
  name: string;
  first_name: string;
  last_name: string;
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
  budget?: string;
  moveInDate?: string;
  sevilla_zona: string;
  has_apartment: boolean;
  companeros_count: number;
}

interface SwipeInterfaceProps {
  profiles: SwipeProfile[];
  onLike: (id: string) => void;
  onPass: (id: string) => void;
  onView: (id: string) => void;
  refetch: () => void;
}

const   SwipeInterface = ({ profiles, onLike, onPass, onView, refetch }: SwipeInterfaceProps) => {
  const { toast } = useToast();
  const updatedProfiles = profiles.map(profile => {
    const profileId = parseInt(profile.id) || Math.floor(Math.random() * 1000);
    //console.log(profile)
    return {
      profileId,
      ...profile,
    };
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [history, setHistory] = useState<string[]>([]);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showMatch, setShowMatch] = useState<SwipeProfile | null>(null);
  const [nextCardReady, setNextCardReady] = useState(false);
  const [removedProfiles, setRemovedProfiles] = useState<Set<string>>(new Set());
  
  // Filter available profiles using removedProfiles set
  const availableProfiles = profiles.filter(profile => !removedProfiles.has(profile.id));
  const currentProfile = availableProfiles.length > currentIndex ? availableProfiles[currentIndex] : null;
  const nextProfile = availableProfiles.length > currentIndex + 1 ? availableProfiles[currentIndex + 1] : null;
  
  const hasMoreProfiles = availableProfiles.length > 0 && currentProfile !== null;
  
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
    if (isTransitioning || !currentProfile) return;
    
    setIsTransitioning(true);
    setDirection(action === 'like' ? 'right' : 'left');
    
    // Add to history before removing
    setHistory(prev => [...prev, id]);
    
    // Mark this profile as removed
    setRemovedProfiles(prev => {
      const newSet = new Set(prev);
      newSet.add(id);
      return newSet;
    });
    
    // Process the swipe after animation
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
        toast({
          title: "¡Te gusta este perfil!",
          description: "Se ha añadido a tus matches potenciales."
        });
      } else {
        onPass(id);
        toast({
          title: "Has pasado este perfil",
          description: "No te preocupes, hay más perfiles por descubrir."
        });
      }
      
      // Don't change currentIndex - just let the filter handle it
      setIsTransitioning(false);
    }, 400);
  };
  
  const handleUndo = () => {
    if (history.length === 0 || isTransitioning) return;
    
    setIsTransitioning(true);
    
    const lastId = history[history.length - 1];
    
    setRemovedProfiles(prev => {
      const newSet = new Set(prev);
      newSet.delete(lastId);
      return newSet;
    });
    
    setHistory(prev => prev.slice(0, -1));
    setIsTransitioning(false);
    
    toast({
      title: "Acción deshecha",
      description: "Has recuperado el último perfil."
    });
  };
  
  const handleReset = () => {
    setCurrentIndex(0);
    setHistory([]);
    setDirection(null);
    setRemovedProfiles(new Set());
    setNextCardReady(false);
    
    toast({
      title: "Perfiles reiniciados",
      description: "Puedes ver todos los perfiles de nuevo."
    });
  };
  
  if (!hasMoreProfiles) {
    refetch();
    return (
      <div className="h-full flex flex-col items-center justify-center py-8 px-4">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-3">No hay más perfiles</h2>
          <p className="text-muted-foreground mb-6">
            Has visto todos los perfiles disponibles con tus criterios actuales.
          </p>
          
          {updatedProfiles.length > 0 && (
            <Button 
              className="rounded-full bg-homi-purple hover:bg-homi-purple/90 button-glow"
              onClick={refetch}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Buscar más perfiles
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
                className="w-full bg-transparent text-white border-white hover:bg-white/20 hover:text-white focus:text-white"
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

        {currentProfile && (
          <SwipeCard
            key={currentProfile.id}
            {...currentProfile}
            onLike={(id) => handleSwipeAction('like', id)}
            onPass={(id) => handleSwipeAction('pass', id)}
            onView={onView}
            onUndo={history.length > 0 ? handleUndo : undefined}
          />
        )}
      </div>
      
    </div>
  );
};

export default SwipeInterface;
