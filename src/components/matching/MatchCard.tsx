
import { useState } from 'react';
import CompatibilityBadge from '@/components/ui/CompatibilityBadge';
import { Heart, X, MessageSquare, User, DollarSign, Calendar, Home, ShieldCheck, Clock } from 'lucide-react';

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
  onView
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
    }, 300);
  };

  return (
    <div 
      className={`relative max-w-md w-full mx-auto glass-card overflow-hidden transition-all duration-300 shadow-lg ${
        swiping === 'right' ? 'animate-swipe-right' : 
        swiping === 'left' ? 'animate-swipe-left' : ''
      }`}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
        <img
          src={imgUrl}
          alt={name}
          className="w-full h-full object-cover"
        />
        <div 
          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6 text-white"
        >
          <h3 className="text-2xl font-bold">{name}, {age}</h3>
          <p className="text-sm opacity-90 flex items-center gap-1">
            <Home size={14} />
            {location}
          </p>
        </div>
        <div className="absolute top-4 right-4">
          <CompatibilityBadge percentage={compatibility} size="lg" />
        </div>
        
        {/* Verified badge */}
        <div className="absolute top-4 left-4">
          <span className="flex items-center gap-1 bg-white/90 text-homi-purple text-xs px-2 py-1 rounded-full">
            <ShieldCheck size={12} />
            Verificado
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
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
        
        <p className="mb-4">{bio}</p>
        
        <div className="flex flex-wrap gap-2 mb-6">
          {tags.map((tag) => (
            <span 
              key={tag.id} 
              className="px-3 py-1 text-xs rounded-full bg-homi-ultraLightPurple text-homi-purple"
            >
              {tag.name}
            </span>
          ))}
        </div>
        
        {/* Additional details */}
        {showDetails && lifestyle && (
          <div className="mb-6 animate-fade-in">
            <h4 className="font-medium mb-2 text-sm">Estilo de vida</h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2 text-sm">
                <span className="w-8 h-8 rounded-full bg-homi-ultraLightPurple flex items-center justify-center text-homi-purple">
                  <Clock size={16} />
                </span>
                <div>
                  <span className="text-xs text-muted-foreground block">Horario</span>
                  <span>{lifestyle.schedule}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="w-8 h-8 rounded-full bg-homi-ultraLightPurple flex items-center justify-center text-homi-purple">
                  <User size={16} />
                </span>
                <div>
                  <span className="text-xs text-muted-foreground block">Limpieza</span>
                  <span>{lifestyle.cleanliness}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="w-8 h-8 rounded-full bg-homi-ultraLightPurple flex items-center justify-center text-homi-purple">
                  <MessageSquare size={16} />
                </span>
                <div>
                  <span className="text-xs text-muted-foreground block">Invitados</span>
                  <span>{lifestyle.guests}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="w-8 h-8 rounded-full bg-homi-ultraLightPurple flex items-center justify-center text-homi-purple">
                  <span className="text-xs">🚬</span>
                </span>
                <div>
                  <span className="text-xs text-muted-foreground block">Fumar</span>
                  <span>{lifestyle.smoking}</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex justify-between gap-3 mt-4">
          <button 
            className="w-16 h-16 rounded-full bg-white border border-red-500 text-red-500 flex items-center justify-center shadow-md transition-all hover:bg-red-500 hover:text-white"
            onClick={() => handleSwipe('left')}
          >
            <X size={28} />
          </button>
          
          <button 
            className="w-12 h-12 rounded-full bg-white border border-gray-300 text-gray-500 flex items-center justify-center shadow-md transition-all hover:bg-gray-100"
            onClick={() => onView(id)}
          >
            <User size={20} />
          </button>
          
          <button 
            className="w-16 h-16 rounded-full bg-white border border-homi-purple text-homi-purple flex items-center justify-center shadow-md transition-all hover:bg-homi-purple hover:text-white"
            onClick={() => handleSwipe('right')}
          >
            <Heart size={28} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MatchCard;
