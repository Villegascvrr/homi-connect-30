
import { useState } from 'react';
import CompatibilityBadge from '@/components/ui/CompatibilityBadge';
import { Button } from '@/components/ui/button';
import { MessageSquare, User, Heart, MapPin, Search, QrCode } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { QRCodeSVG } from 'qrcode.react';
import { Input } from '@/components/ui/input';

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
  const [showQrDialog, setShowQrDialog] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
    if (onLike) onLike(id);
  };

  const getProfileUrl = () => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/profile/${id}`;
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(getProfileUrl());
  };

  return (
    <>
      <div className="glass-card overflow-hidden transition-all duration-300 hover:shadow-hover">
        <div className="relative">
          {/* Logo en la parte superior */}
          <div className="absolute top-0 left-0 w-full h-8 flex justify-center items-center z-10 pt-2">
            <div className="bg-white/90 rounded-full px-4 py-1 shadow-sm">
              <span className="text-homi-purple font-bold text-sm">homi</span>
            </div>
          </div>
          
          <div className="aspect-[4/5] overflow-hidden bg-gradient-to-br from-purple-100 to-pink-50 relative">
            <img
              src={imgUrl}
              alt={name}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
            <div className="absolute top-3 right-3">
              <CompatibilityBadge percentage={compatibility} />
            </div>
            
            {/* Banner indicating roommate search - completely opaque and higher z-index */}
            <div className="absolute bottom-0 left-0 right-0 w-full bg-homi-purple text-white py-2 px-3 text-center z-50 shadow-md">
              <div className="flex items-center justify-center gap-1.5 text-sm font-medium">
                <Search size={14} className="flex-shrink-0" />
                <span className="whitespace-nowrap">Buscando compañero de piso</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Banner added again as a separate element in case the previous one is somehow hidden */}
        <div className="w-full bg-homi-purple text-white py-2 px-3 text-center">
          <div className="flex items-center justify-center gap-1.5 text-sm font-medium">
            <Search size={14} className="flex-shrink-0" />
            <span>Buscando compañero de piso</span>
          </div>
        </div>
        
        <div className="p-5">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-xl font-semibold">{name}, {age}</h3>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <MapPin size={14} className="text-homi-purple" />
                {location}
              </p>
            </div>
          </div>
          
          <p className="my-3 text-sm line-clamp-2">{bio}</p>
          
          <div className="flex flex-wrap gap-1.5 my-3">
            {tags.slice(0, 4).map((tag) => (
              <span 
                key={tag.id} 
                className="px-2.5 py-0.5 text-xs rounded-full bg-homi-ultraLightPurple text-homi-purple"
              >
                {tag.name}
              </span>
            ))}
            {tags.length > 4 && (
              <span className="px-2.5 py-0.5 text-xs rounded-full bg-homi-ultraLightPurple text-homi-purple">
                +{tags.length - 4}
              </span>
            )}
          </div>
          
          <div className="flex gap-2 mt-4">
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
              variant="outline" 
              size="sm" 
              className="rounded-full"
              onClick={() => setShowQrDialog(true)}
            >
              <QrCode size={16} />
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

      {/* QR Code Dialog */}
      <Dialog open={showQrDialog} onOpenChange={setShowQrDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Comparte tu código QR</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 p-4">
            <div className="bg-white p-5 rounded-lg border">
              <QRCodeSVG value={getProfileUrl()} size={200} bgColor="#FFFFFF" fgColor="#6E59A5" />
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Perfil de {name}</p>
              <p className="text-xs text-muted-foreground">Escanea este código para conectar</p>
            </div>
            <div className="flex items-center space-x-2 w-full mt-2">
              <Input value={getProfileUrl()} readOnly className="flex-1" />
              <Button size="sm" onClick={handleCopyLink}>
                Copiar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProfileCard;
