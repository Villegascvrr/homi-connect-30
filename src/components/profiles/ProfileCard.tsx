
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
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
        <img
          src={imgUrl || "/placeholder.svg"}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          loading="lazy"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            console.log('Image failed to load:', target.src);
            target.src = "/placeholder.svg";
          }}
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
