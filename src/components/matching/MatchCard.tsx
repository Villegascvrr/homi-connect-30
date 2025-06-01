
import { useState } from 'react';
import CompatibilityBadge from '@/components/ui/CompatibilityBadge';
import { Heart, X, MessageSquare, User, DollarSign, Calendar, Home, ShieldCheck, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Tag {
  id: number;
  name: string;
}

interface MatchCardProps {
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
  compact?: boolean;
}

const MatchCard = ({
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
  compact = false
}: MatchCardProps) => {
  const [swiping, setSwiping] = useState<'left' | 'right' | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const handleSwipe = (direction: 'left' | 'right') => {
    setSwiping(direction);
    setTimeout(() => {
      if (direction === 'right') {
        onLike(id);
      } else {
        onPass(id);
      }
      setSwiping(null);
    }, 300);
  };

  // If compact mode is enabled, show a simplified card design
  if (compact) {
    return (
      <div 
        className="relative glass-card overflow-hidden transition-all duration-300 hover:shadow-md cursor-pointer h-full rounded-xl"
        onClick={() => onView(id)}
      >
        <div className="relative aspect-square overflow-hidden bg-gray-100 rounded-t-xl">
          <img
            src={imgUrl}
            alt={name}
            className="w-full h-full object-cover"
          />
          <div 
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 text-white"
          >
            <h3 className="text-base font-bold">{age && age !== 0 ? name+", "+age : name}</h3>
            <p className="text-xs opacity-90 flex items-center gap-1">
              <Home size={10} />
              {location}
            </p>
          </div>
          <div className="absolute top-2 right-2">
            <CompatibilityBadge percentage={compatibility} size="sm" />
          </div>
        </div>
        
        <div className="p-3">
          <p className="text-xs mb-2 line-clamp-2">{bio}</p>
          
          <div className="flex flex-wrap gap-1 mb-2">
            {tags.slice(0, 2).map((tag) => (
              <span 
                key={tag.id} 
                className="px-1.5 py-0.5 text-xs rounded-full bg-homi-ultraLightPurple text-homi-purple"
              >
                {tag.name}
              </span>
            ))}
            {tags.length > 2 && (
              <span className="px-1.5 py-0.5 text-xs rounded-full bg-muted text-muted-foreground">
                +{tags.length - 2}
              </span>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            {budget && (
              <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
                <DollarSign size={10} />
                {budget.min}-{budget.max}€
              </span>
            )}
            
            <div className="flex gap-1">
              <button 
                className="w-6 h-6 rounded-full bg-white border border-red-500 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  onPass(id);
                }}
              >
                <X size={12} />
              </button>
              <button 
                className="w-6 h-6 rounded-full bg-white border border-homi-purple text-homi-purple flex items-center justify-center hover:bg-homi-purple hover:text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  onLike(id);
                }}
              >
                <Heart size={12} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Original full-size card design - now with increased rounded corners
  return (
    <div 
      className={`relative max-w-md w-full mx-auto glass-card overflow-hidden transition-all duration-300 shadow-lg rounded-xl ${
        swiping === 'right' ? 'animate-swipe-right' : 
        swiping === 'left' ? 'animate-swipe-left' : ''
      }`}
    >
      <div className="relative aspect-[3/2] overflow-hidden bg-gray-100 rounded-t-xl">
        <img
          src={imgUrl}
          alt={name}
          className="w-full h-full object-cover"
        />
        <div 
          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 text-white"
        >
          <h3 className="text-xl font-bold">{age && age !== 0 ? name+", "+age : name}</h3>
          <p className="text-sm opacity-90 flex items-center gap-1">
            <Home size={14} />
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
      
      <div className="p-3">
        <div className="flex justify-between items-center mb-2">
          <button 
            onClick={() => setShowDetails(!showDetails)}
            className="text-sm font-medium text-homi-purple flex items-center gap-1 hover:underline"
          >
            {showDetails ? 'Mostrar menos' : 'Ver más detalles'}
            <span className="transition-transform duration-300" style={{ transform: showDetails ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
          </button>
          
          <div className="flex gap-2">
            {budget && (
              <span className="flex items-center text-xs gap-1 bg-homi-ultraLightPurple text-homi-purple px-2 py-1 rounded-full">
                <DollarSign size={12} />
                {budget.min}€-{budget.max}€
              </span>
            )}
            {moveInDate && (
              <span className="flex items-center text-xs gap-1 bg-homi-ultraLightPurple text-homi-purple px-2 py-1 rounded-full">
                <Calendar size={12} />
                {moveInDate}
              </span>
            )}
          </div>
        </div>
        
        <p className={`${showDetails ? '' : 'line-clamp-2'} mb-3 text-sm`}>{bio}</p>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {tags.map((tag) => (
            <span 
              key={tag.id} 
              className="px-2 py-0.5 text-xs rounded-full bg-homi-ultraLightPurple text-homi-purple"
            >
              {tag.name}
            </span>
          ))}
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
                  <span className="text-xs text-muted-foreground">Horario</span>
                  <span className="block">{lifestyle.schedule}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs">
                <span className="w-6 h-6 rounded-full bg-homi-ultraLightPurple flex items-center justify-center text-homi-purple">
                  <User size={14} />
                </span>
                <div>
                  <span className="text-xs text-muted-foreground">Limpieza</span>
                  <span className="block">{lifestyle.cleanliness}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs">
                <span className="w-6 h-6 rounded-full bg-homi-ultraLightPurple flex items-center justify-center text-homi-purple">
                  <MessageSquare size={14} />
                </span>
                <div>
                  <span className="text-xs text-muted-foreground">Invitados</span>
                  <span className="block">{lifestyle.guests}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs">
                <span className="w-6 h-6 rounded-full bg-homi-ultraLightPurple flex items-center justify-center text-homi-purple">
                  <span className="text-xs">🚬</span>
                </span>
                <div>
                  <span className="text-xs text-muted-foreground">Fumar</span>
                  <span className="block">{lifestyle.smoking}</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex justify-between gap-2 mt-2">
          <button 
            className="w-10 h-10 rounded-full bg-white border border-red-500 text-red-500 flex items-center justify-center shadow-md transition-all hover:bg-red-500 hover:text-white"
            onClick={() => handleSwipe('left')}
          >
            <X size={20} />
          </button>
          
          <button 
            className="w-8 h-8 rounded-full bg-white border border-gray-300 text-gray-500 flex items-center justify-center shadow-md transition-all hover:bg-gray-100"
            onClick={() => onView(id)}
          >
            <User size={16} />
          </button>
          
          <button 
            className="w-10 h-10 rounded-full bg-white border border-homi-purple text-homi-purple flex items-center justify-center shadow-md transition-all hover:bg-homi-purple hover:text-white"
            onClick={() => handleSwipe('right')}
          >
            <Heart size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MatchCard;
