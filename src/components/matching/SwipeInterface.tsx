
import { useState } from 'react';
import SwipeCard from './SwipeCard';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

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
  
  const currentProfile = profiles[currentIndex];
  const hasMoreProfiles = currentIndex < profiles.length;
  
  const handleSwipeAction = (action: 'like' | 'pass', id: string) => {
    setDirection(action === 'like' ? 'right' : 'left');
    
    // Add to history
    setHistory(prev => [...prev, id]);
    
    // Move to next profile
    setTimeout(() => {
      if (action === 'like') {
        onLike(id);
      } else {
        onPass(id);
      }
      
      setCurrentIndex(prev => prev + 1);
      setDirection(null);
    }, 300);
  };
  
  const handleUndo = () => {
    if (history.length === 0 || currentIndex === 0) return;
    
    setCurrentIndex(prev => prev - 1);
    
    // Remove the last action from history
    setHistory(prev => prev.slice(0, -1));
  };
  
  const handleReset = () => {
    setCurrentIndex(0);
    setHistory([]);
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
              className="rounded-full bg-homi-purple hover:bg-homi-purple/90"
              onClick={handleReset}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Ver perfiles de nuevo
            </Button>
          )}
        </div>
      </div>
    );
  }
  
  return (
    <div className="h-full">
      <SwipeCard
        {...currentProfile}
        onLike={(id) => handleSwipeAction('like', id)}
        onPass={(id) => handleSwipeAction('pass', id)}
        onView={onView}
        onUndo={history.length > 0 ? handleUndo : undefined}
      />
      
      <div className="text-center mt-4">
        <p className="text-sm text-muted-foreground">
          Perfil {currentIndex + 1} de {profiles.length}
        </p>
      </div>
    </div>
  );
};

export default SwipeInterface;
