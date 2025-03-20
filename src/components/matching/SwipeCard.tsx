
import { useState, useRef } from 'react';
import CompatibilityBadge from '@/components/ui/CompatibilityBadge';
import { Heart, X, MessageSquare, User, DollarSign, Calendar, Home, ShieldCheck, Clock, Undo2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface Tag {
  id: number;
  name: string;
}

interface SwipeCardProps {
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
  onLike: (id: string) => void;
  onPass: (id: string) => void;
  onView: (id: string) => void;
  onUndo?: () => void;
}

const SwipeCard = ({
  id,
  name,
  age,
  location,
  bio,
  imgUrl,
  tags,
  compatibility,
  lifestyle,
  budget,
  moveInDate,
  onLike,
  onPass,
  onView,
  onUndo
}: SwipeCardProps) => {
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [startX, setStartX] = useState(0);
  const [offsetX, setOffsetX] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  
  const handleSwipe = (direction: 'left' | 'right') => {
    setSwipeDirection(direction);
    
    setTimeout(() => {
      if (direction === 'right') {
        onLike(id);
      } else {
        onPass(id);
      }
      
      // Reset for next card
      setSwipeDirection(null);
      setOffsetX(0);
    }, 300);
  };
  
  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX;
    setOffsetX(diff);
  };
  
  const handleTouchEnd = () => {
    // Threshold for swipe (pixels)
    const threshold = 100;
    
    if (offsetX > threshold) {
      handleSwipe('right');
    } else if (offsetX < -threshold) {
      handleSwipe('left');
    } else {
      // Reset if swipe wasn't decisive
      setOffsetX(0);
    }
  };
  
  // Calculate rotation and opacity based on swipe
  const rotation = offsetX / 20; // Less rotation for smoother effect
  const opacity = Math.min(Math.abs(offsetX) / 100, 1);
  
  // Determine border color based on swipe direction
  const borderColor = offsetX > 50 
    ? 'border-homi-purple' 
    : offsetX < -50 
      ? 'border-red-500' 
      : 'border-transparent';
  
  return (
    <div className="h-full flex flex-col items-center justify-center py-4">
      <div 
        ref={cardRef}
        className={cn(
          "relative w-full max-w-xs mx-auto glass-card overflow-hidden rounded-xl shadow-lg transition-all duration-300 border-2",
          borderColor,
          swipeDirection === 'right' ? 'animate-swipe-right' : 
          swipeDirection === 'left' ? 'animate-swipe-left' : ''
        )}
        style={{
          transform: `translateX(${offsetX}px) rotate(${rotation}deg)`,
          touchAction: 'pan-y'
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Like/Dislike Indicators */}
        {offsetX > 50 && (
          <div className="absolute top-1/4 left-4 z-10 transform -rotate-12 border-4 border-homi-purple rounded-lg px-2 py-1">
            <span className="text-homi-purple text-2xl font-bold">LIKE</span>
          </div>
        )}
        {offsetX < -50 && (
          <div className="absolute top-1/4 right-4 z-10 transform rotate-12 border-4 border-red-500 rounded-lg px-2 py-1">
            <span className="text-red-500 text-2xl font-bold">NOPE</span>
          </div>
        )}
        
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
          <img
            src={imgUrl}
            alt={name}
            className="w-full h-full object-cover"
          />
          <div 
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 text-white"
          >
            <h3 className="text-xl font-bold">{name}, {age}</h3>
            <p className="text-sm opacity-90 flex items-center gap-1">
              <Home size={14} className="shrink-0" />
              {location}
            </p>
          </div>
          <div className="absolute top-3 right-3">
            <CompatibilityBadge percentage={compatibility} />
          </div>
          
          {/* Verified badge */}
          <div className="absolute top-3 left-3">
            <span className="flex items-center gap-1 bg-white/90 text-homi-purple text-xs px-2 py-1 rounded-full">
              <ShieldCheck size={12} />
              Verificado
            </span>
          </div>
        </div>
        
        <div className="p-4">
          <div className="flex justify-between items-center mb-3">
            <button 
              onClick={() => setShowDetails(!showDetails)}
              className="text-sm font-medium text-homi-purple flex items-center gap-1 hover:underline"
            >
              {showDetails ? 'Mostrar menos' : 'Ver detalles'}
              <span className="transition-transform duration-300" style={{ transform: showDetails ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
            </button>
            
            <div className="flex gap-2">
              {budget && (
                <span className="flex items-center text-xs gap-1 bg-homi-ultraLightPurple text-homi-purple px-2 py-1 rounded-full">
                  <DollarSign size={12} />
                  {budget.min}€-{budget.max}€
                </span>
              )}
            </div>
          </div>
          
          <p className={`${showDetails ? '' : 'line-clamp-2'} text-sm mb-3`}>{bio}</p>
          
          <div className="flex flex-wrap gap-1.5 mb-3">
            {tags.slice(0, showDetails ? tags.length : 3).map((tag) => (
              <span 
                key={tag.id} 
                className="px-2 py-0.5 text-xs rounded-full bg-homi-ultraLightPurple text-homi-purple"
              >
                {tag.name}
              </span>
            ))}
            {!showDetails && tags.length > 3 && (
              <span className="px-2 py-0.5 text-xs rounded-full bg-muted text-muted-foreground">
                +{tags.length - 3}
              </span>
            )}
          </div>
          
          {/* Additional details */}
          {showDetails && lifestyle && (
            <div className="mb-4 animate-fade-in">
              <h4 className="font-medium mb-2 text-sm">Estilo de vida</h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2 text-sm">
                  <span className="w-7 h-7 rounded-full bg-homi-ultraLightPurple flex items-center justify-center text-homi-purple">
                    <Clock size={14} />
                  </span>
                  <div>
                    <span className="text-xs text-muted-foreground block">Horario</span>
                    <span className="text-xs">{lifestyle.schedule}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="w-7 h-7 rounded-full bg-homi-ultraLightPurple flex items-center justify-center text-homi-purple">
                    <User size={14} />
                  </span>
                  <div>
                    <span className="text-xs text-muted-foreground block">Limpieza</span>
                    <span className="text-xs">{lifestyle.cleanliness}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="w-7 h-7 rounded-full bg-homi-ultraLightPurple flex items-center justify-center text-homi-purple">
                    <MessageSquare size={14} />
                  </span>
                  <div>
                    <span className="text-xs text-muted-foreground block">Invitados</span>
                    <span className="text-xs">{lifestyle.guests}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="w-7 h-7 rounded-full bg-homi-ultraLightPurple flex items-center justify-center text-homi-purple">
                    <span className="text-xs">🚬</span>
                  </span>
                  <div>
                    <span className="text-xs text-muted-foreground block">Fumar</span>
                    <span className="text-xs">{lifestyle.smoking}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Control buttons below the card */}
      <div className="flex justify-center items-center gap-3 mt-6">
        <Button 
          variant="outline"
          size="icon"
          className="w-12 h-12 rounded-full border-2 border-red-500 text-red-500 flex items-center justify-center shadow-md transition-all hover:bg-red-500 hover:text-white"
          onClick={() => handleSwipe('left')}
        >
          <X size={24} />
        </Button>
        
        {onUndo && (
          <Button 
            variant="outline"
            size="icon"
            className="w-10 h-10 rounded-full border-2 border-gray-400 text-gray-500 flex items-center justify-center shadow-md transition-all hover:bg-gray-100"
            onClick={onUndo}
          >
            <Undo2 size={20} />
          </Button>
        )}
        
        <Button 
          variant="outline"
          size="icon"
          className="w-10 h-10 rounded-full border-2 border-gray-400 text-gray-500 flex items-center justify-center shadow-md transition-all hover:bg-gray-100"
          onClick={() => onView(id)}
        >
          <User size={20} />
        </Button>
        
        <Button 
          variant="outline"
          size="icon"
          className="w-12 h-12 rounded-full border-2 border-homi-purple text-homi-purple flex items-center justify-center shadow-md transition-all hover:bg-homi-purple hover:text-white"
          onClick={() => handleSwipe('right')}
        >
          <Heart size={24} />
        </Button>
      </div>
    </div>
  );
};

export default SwipeCard;
