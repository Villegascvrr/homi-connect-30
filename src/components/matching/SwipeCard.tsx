
import { useState, useRef, useEffect } from 'react';
import CompatibilityBadge from '@/components/ui/CompatibilityBadge';
import { Heart, X, MessageSquare, User, DollarSign, Calendar, Home, ShieldCheck, Clock, Undo2, Sparkles } from 'lucide-react';
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
  const [showLike, setShowLike] = useState(false);
  const [showDislike, setShowDislike] = useState(false);
  const [isButtonHovering, setIsButtonHovering] = useState<'like' | 'pass' | 'none'>('none');
  const [confetti, setConfetti] = useState(false);
  
  // Show confetti effect when liking a profile with high compatibility
  useEffect(() => {
    if (confetti) {
      const timer = setTimeout(() => {
        setConfetti(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [confetti]);
  
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
      if (compatibility >= 80) {
        setConfetti(true);
      }
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
    }, 600); // Match animation duration in CSS
  };
  
  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX;
    setOffsetX(diff);
    
    // Show like/dislike indicators based on swipe direction with more dynamic thresholds
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
    // Threshold for swipe (pixels)
    const threshold = 100;
    
    if (offsetX > threshold) {
      handleSwipe('right');
    } else if (offsetX < -threshold) {
      handleSwipe('left');
    } else {
      // Reset if swipe wasn't decisive
      setOffsetX(0);
      setShowLike(false);
      setShowDislike(false);
    }
  };
  
  // Calculate rotation and opacity based on swipe
  const rotation = offsetX / 15; // More rotation for stronger visual effect
  const opacity = Math.min(Math.abs(offsetX) / 100, 1);
  
  // Determine border color based on swipe direction
  const borderColor = offsetX > 50 
    ? 'border-homi-purple shadow-lg shadow-homi-purple/20' 
    : offsetX < -50 
      ? 'border-red-500 shadow-lg shadow-red-500/20' 
      : 'border-transparent';

  // Create confetti elements if needed
  const renderConfetti = () => {
    if (!confetti) return null;
    
    return Array.from({ length: 50 }).map((_, i) => {
      const size = Math.random() * 10 + 5;
      const left = Math.random() * 100;
      const delay = Math.random() * 2;
      const color = [
        'bg-homi-purple', 'bg-pink-500', 'bg-blue-400', 'bg-yellow-400', 
        'bg-green-400', 'bg-orange-400'
      ][Math.floor(Math.random() * 6)];
      
      return (
        <div
          key={i}
          className={`confetti ${color} rounded-full fixed z-50`}
          style={{
            left: `${left}%`,
            width: `${size}px`,
            height: `${size}px`,
            animationDelay: `${delay}s`,
          }}
        />
      );
    });
  };
  
  return (
    <div className="h-full flex flex-col items-center justify-center py-4">
      {renderConfetti()}
      
      <div 
        ref={cardRef}
        className={cn(
          "relative w-full max-w-xs mx-auto glass-card overflow-hidden rounded-xl shadow-lg transition-all duration-300 border-2",
          borderColor,
          swipeDirection === 'right' ? 'animate-swipe-right' : 
          swipeDirection === 'left' ? 'animate-swipe-left' : '',
          offsetX === 0 && !swipeDirection ? 'card-pulse shimmer-bg' : '',
          compatibility >= 80 ? 'bg-highlight' : ''
        )}
        style={{
          transform: `translateX(${offsetX}px) rotate(${rotation}deg)`,
          touchAction: 'pan-y'
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Like/Dislike Enhanced Indicators */}
        {showLike && (
          <div className={`absolute top-1/4 left-4 z-10 transform border-4 border-homi-purple rounded-lg px-3 py-1.5 animate-like`}>
            <span className="text-homi-purple text-2xl font-bold flex items-center">
              <Sparkles className="mr-1 h-5 w-5" />
              LIKE
            </span>
          </div>
        )}
        {showDislike && (
          <div className={`absolute top-1/4 right-4 z-10 transform border-4 border-red-500 rounded-lg px-3 py-1.5 animate-dislike`}>
            <span className="text-red-500 text-2xl font-bold flex items-center">
              NOPE
              <X className="ml-1 h-5 w-5" />
            </span>
          </div>
        )}
        
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
          <img
            src={imgUrl}
            alt={name}
            className={cn(
              "w-full h-full object-cover transition-all duration-300",
              offsetX > 50 ? 'brightness-110 scale-105' : 
              offsetX < -50 ? 'brightness-90 scale-105' : ''
            )}
          />
          <div 
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 text-white"
          >
            <h3 className="text-xl font-bold flex items-center gap-2">
              {name}, {age}
              {compatibility >= 80 && (
                <Sparkles className="h-4 w-4 text-yellow-400 animate-pulse" />
              )}
            </h3>
            <p className="text-sm opacity-90 flex items-center gap-1">
              <Home size={14} className="shrink-0" />
              {location}
            </p>
          </div>
          <div className="absolute top-3 right-3 transition-transform duration-300 hover:scale-110">
            <CompatibilityBadge percentage={compatibility} />
          </div>
          
          {/* Enhanced verified badge */}
          <div className="absolute top-3 left-3">
            <span className="flex items-center gap-1 bg-white/90 text-homi-purple text-xs px-2 py-1 rounded-full shadow-md backdrop-blur-sm transition-all hover:bg-white">
              <ShieldCheck size={12} />
              Verificado
            </span>
          </div>
        </div>
        
        <div className="p-4">
          <div className="flex justify-between items-center mb-3">
            <button 
              onClick={() => setShowDetails(!showDetails)}
              className="text-sm font-medium text-homi-purple flex items-center gap-1 hover:underline transition-all hover:text-homi-purple/80"
            >
              {showDetails ? 'Mostrar menos' : 'Ver detalles'}
              <span className="transition-transform duration-300" style={{ transform: showDetails ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
            </button>
            
            <div className="flex gap-2">
              {budget && (
                <span className="flex items-center text-xs gap-1 bg-homi-ultraLightPurple text-homi-purple px-2 py-1 rounded-full transition-all hover:bg-homi-ultraLightPurple/80">
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
                className="px-2 py-0.5 text-xs rounded-full bg-homi-ultraLightPurple text-homi-purple transition-all hover:bg-homi-purple hover:text-white"
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
          
          {/* Enhanced additional details */}
          {showDetails && lifestyle && (
            <div className="mb-4 animate-fade-in">
              <h4 className="font-medium mb-2 text-sm">Estilo de vida</h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2 text-sm">
                  <span className="w-7 h-7 rounded-full bg-homi-ultraLightPurple flex items-center justify-center text-homi-purple transition-all hover:bg-homi-purple hover:text-white">
                    <Clock size={14} />
                  </span>
                  <div>
                    <span className="text-xs text-muted-foreground block">Horario</span>
                    <span className="text-xs">{lifestyle.schedule}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="w-7 h-7 rounded-full bg-homi-ultraLightPurple flex items-center justify-center text-homi-purple transition-all hover:bg-homi-purple hover:text-white">
                    <User size={14} />
                  </span>
                  <div>
                    <span className="text-xs text-muted-foreground block">Limpieza</span>
                    <span className="text-xs">{lifestyle.cleanliness}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="w-7 h-7 rounded-full bg-homi-ultraLightPurple flex items-center justify-center text-homi-purple transition-all hover:bg-homi-purple hover:text-white">
                    <MessageSquare size={14} />
                  </span>
                  <div>
                    <span className="text-xs text-muted-foreground block">Invitados</span>
                    <span className="text-xs">{lifestyle.guests}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="w-7 h-7 rounded-full bg-homi-ultraLightPurple flex items-center justify-center text-homi-purple transition-all hover:bg-homi-purple hover:text-white">
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
      
      {/* Enhanced control buttons with animations */}
      <div className="flex justify-center items-center gap-3 mt-6">
        <Button 
          variant="outline"
          size="icon"
          className={cn(
            "w-12 h-12 rounded-full border-2 border-red-500 text-red-500 flex items-center justify-center shadow-md transition-all hover:bg-red-500 hover:text-white transform hover:scale-110 active:scale-95",
            isButtonHovering === 'pass' ? 'dislike-button-pulse' : ''
          )}
          onClick={() => handleSwipe('left')}
          onMouseEnter={() => setIsButtonHovering('pass')}
          onMouseLeave={() => setIsButtonHovering('none')}
        >
          <X size={24} className={isButtonHovering === 'pass' ? 'animate-pulse' : ''} />
        </Button>
        
        {onUndo && (
          <Button 
            variant="outline"
            size="icon"
            className="w-10 h-10 rounded-full border-2 border-gray-400 text-gray-500 flex items-center justify-center shadow-md transition-all hover:bg-gray-100 active:scale-95 hover:shadow-lg"
            onClick={onUndo}
          >
            <Undo2 size={20} />
          </Button>
        )}
        
        <Button 
          variant="outline"
          size="icon"
          className="w-10 h-10 rounded-full border-2 border-gray-400 text-gray-500 flex items-center justify-center shadow-md transition-all hover:bg-gray-100 active:scale-95 hover:shadow-lg"
          onClick={() => onView(id)}
        >
          <User size={20} />
        </Button>
        
        <Button 
          variant="outline"
          size="icon"
          className={cn(
            "w-12 h-12 rounded-full border-2 border-homi-purple text-homi-purple flex items-center justify-center shadow-md transition-all hover:bg-homi-purple hover:text-white transform hover:scale-110 active:scale-95",
            isButtonHovering === 'like' ? 'like-button-pulse' : ''
          )}
          onClick={() => handleSwipe('right')}
          onMouseEnter={() => setIsButtonHovering('like')}
          onMouseLeave={() => setIsButtonHovering('none')}
        >
          <Heart size={24} className={isButtonHovering === 'like' ? 'animate-pulse' : ''} />
        </Button>
      </div>
    </div>
  );
};

export default SwipeCard;
