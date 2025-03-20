
import { useState, useEffect } from 'react';
import SwipeCard from './SwipeCard';
import { Button } from '@/components/ui/button';
import { RefreshCw, Sparkles, ThumbsUp } from 'lucide-react';

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
  const [showMessage, setShowMessage] = useState(false);
  const [messageType, setMessageType] = useState<'like' | 'pass' | null>(null);
  
  const currentProfile = profiles[currentIndex];
  const hasMoreProfiles = currentIndex < profiles.length;
  
  // Reset animation state when profile changes
  useEffect(() => {
    setDirection(null);
  }, [currentIndex]);
  
  // Handle temporary feedback messages
  useEffect(() => {
    if (showMessage) {
      const timer = setTimeout(() => {
        setShowMessage(false);
        setMessageType(null);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [showMessage]);
  
  const handleSwipeAction = (action: 'like' | 'pass', id: string) => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setDirection(action === 'like' ? 'right' : 'left');
    setShowMessage(true);
    setMessageType(action);
    
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
      <div className="h-full flex flex-col items-center justify-center py-12 px-4 animate-fade-in">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-6 bg-homi-ultraLightPurple rounded-full flex items-center justify-center text-homi-purple">
            <ThumbsUp size={32} />
          </div>
          
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
      {/* Floating status messages */}
      {showMessage && messageType && (
        <div 
          className={`fixed top-1/4 left-1/2 transform -translate-x-1/2 z-50 py-2 px-4 rounded-full text-white font-bold animate-fade-in ${
            messageType === 'like' ? 'bg-homi-purple' : 'bg-red-500'
          }`}
        >
          {messageType === 'like' ? (
            <span className="flex items-center gap-1">
              <Sparkles size={16} />
              ¡Me interesa!
            </span>
          ) : (
            <span className="flex items-center gap-1">
              Siguiente
            </span>
          )}
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
        <p className="text-sm font-medium">
          <span className="inline-block px-3 py-1 bg-homi-ultraLightPurple text-homi-purple rounded-full">
            Perfil {currentIndex + 1} de {profiles.length}
          </span>
        </p>
      </div>
    </div>
  );
};

export default SwipeInterface;
