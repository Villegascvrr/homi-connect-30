
import { useState } from 'react';
import CompatibilityBadge from '@/components/ui/CompatibilityBadge';
import { Button } from '@/components/ui/button';
import { MessageSquare, User, Heart } from 'lucide-react';

interface Tag {
  id: number;
  name: string;
}

interface ProfileCardProps {
  id: string;
  name: string;
  age: number;
  location: string;
  bio: string;
  imgUrl: string;
  tags: Tag[];
  compatibility: number;
  onLike?: (id: string) => void;
  onMessage?: (id: string) => void;
  onView?: (id: string) => void;
}

const ProfileCard = ({
  id,
  name,
  age,
  location,
  bio,
  imgUrl,
  tags,
  compatibility,
  onLike,
  onMessage,
  onView
}: ProfileCardProps) => {
  const [liked, setLiked] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
    if (onLike) onLike(id);
  };

  return (
    <div className="glass-card overflow-hidden transition-all duration-300 hover:shadow-hover">
      <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-tr from-homi-purple/10 to-purple-200/20">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-10">
          <svg width="120" height="120" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M30 0C13.4315 0 0 13.4315 0 30C0 46.5685 13.4315 60 30 60C46.5685 60 60 46.5685 60 30C60 13.4315 46.5685 0 30 0Z" fill="#6E59A5"/>
            <path d="M30.74 15.64C32.46 15.64 33.88 17.06 33.88 18.8C33.88 20.54 32.46 21.94 30.74 21.94C29.02 21.94 27.6 20.54 27.6 18.8C27.6 17.06 29.02 15.64 30.74 15.64Z" fill="white"/>
            <path d="M19.78 21.94C21.5 21.94 22.92 23.36 22.92 25.1C22.92 26.84 21.5 28.24 19.78 28.24C18.06 28.24 16.64 26.84 16.64 25.1C16.64 23.36 18.06 21.94 19.78 21.94Z" fill="white"/>
            <path d="M41.7 21.94C43.42 21.94 44.84 23.36 44.84 25.1C44.84 26.84 43.42 28.24 41.7 28.24C39.98 28.24 38.56 26.84 38.56 25.1C38.56 23.36 39.98 21.94 41.7 21.94Z" fill="white"/>
            <path d="M30.74 28.24C32.46 28.24 33.88 29.66 33.88 31.4C33.88 33.14 32.46 34.54 30.74 34.54C29.02 34.54 27.6 33.14 27.6 31.4C27.6 29.66 29.02 28.24 30.74 28.24Z" fill="white"/>
            <path d="M19.78 34.54C21.5 34.54 22.92 35.96 22.92 37.7C22.92 39.44 21.5 40.84 19.78 40.84C18.06 40.84 16.64 39.44 16.64 37.7C16.64 35.96 18.06 34.54 19.78 34.54Z" fill="white"/>
            <path d="M41.7 34.54C43.42 34.54 44.84 35.96 44.84 37.7C44.84 39.44 43.42 40.84 41.7 40.84C39.98 40.84 38.56 39.44 38.56 37.7C38.56 35.96 39.98 34.54 41.7 34.54Z" fill="white"/>
            <path d="M30.74 40.84C32.46 40.84 33.88 42.26 33.88 44C33.88 45.74 32.46 47.14 30.74 47.14C29.02 47.14 27.6 45.74 27.6 44C27.6 42.26 29.02 40.84 30.74 40.84Z" fill="white"/>
          </svg>
        </div>
        
        <img
          src={imgUrl}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute top-3 right-3">
          <CompatibilityBadge percentage={compatibility} />
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold">{name}, {age}</h3>
            <p className="text-sm text-muted-foreground">{location}</p>
          </div>
        </div>
        
        <p className="my-4 text-sm line-clamp-3">{bio}</p>
        
        <div className="flex flex-wrap gap-2 my-4">
          {tags.map((tag) => (
            <span 
              key={tag.id} 
              className="px-3 py-1 text-xs rounded-full bg-homi-ultraLightPurple text-homi-purple"
            >
              {tag.name}
            </span>
          ))}
        </div>
        
        <div className="flex gap-2 mt-6">
          <Button 
            variant="outline" 
            size="sm" 
            className="rounded-full flex-1"
            onClick={() => onView && onView(id)}
          >
            <User size={16} className="mr-1" /> Ver Perfil
          </Button>
          <Button 
            variant={liked ? "default" : "outline"} 
            size="sm" 
            className={`rounded-full ${liked ? 'bg-homi-purple hover:bg-homi-purple/90' : ''}`}
            onClick={handleLike}
          >
            <Heart size={16} className={liked ? 'fill-white' : ''} />
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            className="rounded-full bg-homi-purple hover:bg-homi-purple/90"
            onClick={() => onMessage && onMessage(id)}
          >
            <MessageSquare size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
