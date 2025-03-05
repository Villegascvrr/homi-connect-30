
import { useState } from 'react';
import CompatibilityBadge from '@/components/ui/CompatibilityBadge';
import { Heart, X, MessageSquare, User } from 'lucide-react';

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
  onLike,
  onPass,
  onView
}: MatchCardProps) => {
  const [swiping, setSwiping] = useState<'left' | 'right' | null>(null);

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
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
        <img
          src={imgUrl || "/placeholder.svg"}
          alt={name}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            console.log('Image failed to load:', target.src);
            target.src = "/placeholder.svg";
          }}
        />
        <div 
          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6 text-white"
        >
          <h3 className="text-2xl font-bold">{name}, {age}</h3>
          <p className="text-sm opacity-90">{location}</p>
        </div>
        <div className="absolute top-4 right-4">
          <CompatibilityBadge percentage={compatibility} size="lg" />
        </div>
      </div>
      
      <div className="p-6">
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
