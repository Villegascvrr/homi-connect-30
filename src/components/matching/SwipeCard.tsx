
import { useState, useRef, useEffect } from 'react';
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
  first_name: string;
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
  first_name: name,
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
  const [showLike, setShowLike] = useState(false);
  const [showDislike, setShowDislike] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  // Reset indicators when swiping stops
  useEffect(() => {
    if (offsetX === 0) {
      setShowLike(false);
      setShowDislike(false);
    }
  }, [offsetX]);
  
  const handleSwipe = (direction: 'left' | 'right') => {
    setSwipeDirection(direction);
    
    if (direction === 'right') {
      setShowLike(true);
      setShowDislike(false);
    } else {
      setShowLike(false);
      setShowDislike(true);
    }
    
    setTimeout(() => {
      if (direction === 'right') {
        onLike(id);
      } else {
        onPass(id);
      }
      
      // Reset for next card
      setSwipeDirection(null);
      setOffsetX(0);
      setShowLike(false);
      setShowDislike(false);
      setIsDragging(false);
    }, 400); // Match animation duration in CSS
  };
  
  // Touch handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
    setIsDragging(true);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX;
    setOffsetX(diff);
    
    // Show like/dislike indicators based on swipe direction
    if (diff > 50) {
      setShowLike(true);
      setShowDislike(false);
    } else if (diff < -50) {
      setShowLike(false);
      setShowDislike(true);
    } else {
      setShowLike(false);
      setShowDislike(false);
    }
  };
  
  const handleTouchEnd = () => {
    setIsDragging(false);
    // Threshold for swipe (pixels)
    const threshold = 100;
    
    if (offsetX > threshold) {
      handleSwipe('right');
    } else if (offsetX < -threshold) {
      handleSwipe('left');
    } else {
      // Reset if swipe wasn't decisive with a smooth animation
      setOffsetX(0);
      setShowLike(false);
      setShowDislike(false);
    }
  };
  
  // Mouse handlers for desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    setStartX(e.clientX);
    setIsDragging(true);
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const currentX = e.clientX;
    const diff = currentX - startX;
    setOffsetX(diff);
    
    if (diff > 50) {
      setShowLike(true);
      setShowDislike(false);
    } else if (diff < -50) {
      setShowLike(false);
      setShowDislike(true);
    } else {
      setShowLike(false);
      setShowDislike(false);
    }
  };
  
  const handleMouseUp = () => {
    if (!isDragging) return;
    
    const threshold = 100;
    
    if (offsetX > threshold) {
      handleSwipe('right');
    } else if (offsetX < -threshold) {
      handleSwipe('left');
    } else {
      // Reset with smooth animation
      setOffsetX(0);
      setIsDragging(false);
      setShowLike(false);
      setShowDislike(false);
    }
  };
  
  // Handle mouse leaving the document while dragging
  useEffect(() => {
    const handleMouseLeave = () => {
      if (isDragging) {
        setIsDragging(false);
        setOffsetX(0);
        setShowLike(false);
        setShowDislike(false);
      }
    };
    
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);
  
  // Calculate rotation and opacity based on swipe
  const rotation = offsetX / 20; // Less rotation for smoother effect
  const opacity = Math.min(Math.abs(offsetX) / 100, 1);
  
  // Determine border color based on swipe direction
  const borderColor = offsetX > 50 
    ? 'border-homi-purple' 
    : offsetX < -50 
      ? 'border-red-500' 
      : 'border-transparent';
  
  // Calculate transform with spring-like effect for smoother feel
  const getTransform = () => {
    if (swipeDirection) {
      return swipeDirection === 'right' 
        ? 'translateX(120%) rotate(15deg)' 
        : 'translateX(-120%) rotate(-15deg)';
    }
    return `translateX(${offsetX}px) rotate(${rotation}deg)`;
  };
  
  return (
    <div className="h-full flex flex-col items-center justify-center py-2">
      <div 
        ref={cardRef}
        className={cn(
          "relative w-full max-w-xs mx-auto glass-card overflow-hidden rounded-xl shadow-lg border-2 transition-all",
          borderColor,
          swipeDirection ? "duration-400 ease-out" : "duration-300 ease-out",
          offsetX === 0 && !swipeDirection ? 'card-pulse' : ''
        )}
        style={{
          transform: getTransform(),
          touchAction: 'pan-y',
          transition: isDragging ? 'none' : 'transform 0.3s ease-out',
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
      >
        {/* Like/Dislike Indicators */}
        {showLike && (
          <div className="absolute top-1/4 left-4 z-10 transform -rotate-12 border-4 border-homi-purple rounded-lg px-2 py-1 bg-white/80 transition-opacity duration-200" style={{ opacity: opacity }}>
            <span className="text-homi-purple text-2xl font-bold">LIKE</span>
          </div>
        )}
        {showDislike && (
          <div className="absolute top-1/4 right-4 z-10 transform rotate-12 border-4 border-red-500 rounded-lg px-2 py-1 bg-white/80 transition-opacity duration-200" style={{ opacity: opacity }}>
            <span className="text-red-500 text-2xl font-bold">NOPE</span>
          </div>
        )}
        
        {/* Profile Image Section - updated with rounded corners */}
        <div className="relative aspect-[3/2] overflow-hidden bg-gray-100 rounded-t-xl">
          <img
            src={imgUrl}
            alt={name}
            className={cn(
              "w-full h-full object-cover transition-transform",
              showLike ? "scale-[1.02]" : showDislike ? "scale-[0.98]" : ""
            )}
          />
          <div 
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 text-white"
          >
            <h3 className="text-xl font-bold">{age && age !== 0 ? name+", "+age : name}</h3>
            <p className="text-sm opacity-90 flex items-center gap-1">
              <Home size={14} className="shrink-0" />
              {location}
            </p>
          </div>
          
          
          {/* Verified badge */}
          <div className="absolute top-2 left-2">
            <span className="flex items-center gap-1 bg-white/90 text-homi-purple text-xs px-2 py-1 rounded-full">
              <ShieldCheck size={12} />
              Verificado
            </span>
          </div>
        </div>
        
        {/* Profile Details Section - more compact */}
        <div className="p-3">
          <div className="flex justify-between items-center mb-2">
            <button 
              onClick={() => setShowDetails(!showDetails)}
              className="text-sm font-medium text-homi-purple flex items-center gap-1 hover:underline"
            >
              {showDetails ? 'Mostrar menos' : 'Ver detalles'}
              <span className="transition-transform duration-300" style={{ transform: showDetails ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
            </button>
            
            <div className="flex gap-1">
              {budget && (
                <span className="flex items-center text-xs gap-1 bg-homi-ultraLightPurple text-homi-purple px-2 py-0.5 rounded-full">
                  <DollarSign size={12} />
                  {budget.min}€-{budget.max}€
                </span>
              )}
            </div>
          </div>
          
          <p className={`${showDetails ? '' : 'line-clamp-2'} text-sm mb-2`}>{bio}</p>
          
          <div className="flex flex-wrap gap-1 mb-2">
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
            <div className="mb-3 animate-fade-in">
              <h4 className="font-medium mb-1 text-xs">Estilo de vida</h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-1 text-xs">
                  <span className="w-6 h-6 rounded-full bg-homi-ultraLightPurple flex items-center justify-center text-homi-purple">
                    <Clock size={14} />
                  </span>
                  <div>
                    <span className="text-xs text-muted-foreground block">Horario</span>
                    <span className="text-xs">{lifestyle.schedule}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <span className="w-6 h-6 rounded-full bg-homi-ultraLightPurple flex items-center justify-center text-homi-purple">
                    <User size={14} />
                  </span>
                  <div>
                    <span className="text-xs text-muted-foreground block">Limpieza</span>
                    <span className="text-xs">{lifestyle.cleanliness}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <span className="w-6 h-6 rounded-full bg-homi-ultraLightPurple flex items-center justify-center text-homi-purple">
                    <MessageSquare size={14} />
                  </span>
                  <div>
                    <span className="text-xs text-muted-foreground block">Invitados</span>
                    <span className="text-xs">{lifestyle.guests}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <span className="w-6 h-6 rounded-full bg-homi-ultraLightPurple flex items-center justify-center text-homi-purple">
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
      <div className="flex justify-center items-center gap-3 mt-3">
        <Button 
          variant="outline"
          size="icon"
          className="w-10 h-10 rounded-full border-2 border-red-500 text-red-500 flex items-center justify-center shadow-md transition-all hover:bg-red-500 hover:text-white transform hover:scale-110 active:scale-95"
          onClick={() => handleSwipe('left')}
        >
          <X size={20} />
        </Button>
        
        {onUndo && (
          <Button 
            variant="outline"
            size="icon"
            className="w-8 h-8 rounded-full border-2 border-gray-400 text-gray-500 flex items-center justify-center shadow-md transition-all hover:bg-gray-100 active:scale-95"
            onClick={onUndo}
          >
            <Undo2 size={16} />
          </Button>
        )}
        
        <Button 
          variant="outline"
          size="icon"
          className="w-8 h-8 rounded-full border-2 border-gray-400 text-gray-500 flex items-center justify-center shadow-md transition-all hover:bg-gray-100 active:scale-95"
          onClick={() => onView(id)}
        >
          <User size={16} />
        </Button>
        
        <Button 
          variant="outline"
          size="icon"
          className="w-10 h-10 rounded-full border-2 border-homi-purple text-homi-purple flex items-center justify-center shadow-md transition-all hover:bg-homi-purple hover:text-white transform hover:scale-110 active:scale-95"
          onClick={() => handleSwipe('right')}
        >
          <Heart size={20} />
        </Button>
      </div>
    </div>
  );
};

export default SwipeCard;
