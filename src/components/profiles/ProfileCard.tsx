
import { useState } from 'react';
import CompatibilityBadge from '@/components/ui/CompatibilityBadge';
import { Button } from '@/components/ui/button';
import { MessageSquare, User, Heart, MapPin, Search, QrCode, AtSign } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { QRCodeSVG } from 'qrcode.react';
import { Input } from '@/components/ui/input';
import { useIsMobile } from '@/hooks/use-mobile';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';

interface Tag {
  id: number;
  name: string;
}
interface ProfileCardProps {
  id: string;
  name: string;
  username?: string; // Added username as optional property
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
  username,
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
  const isMobile = useIsMobile();
  
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
  
  const QrCodeContent = () => (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="bg-white p-4 rounded-lg border">
        <QRCodeSVG value={getProfileUrl()} size={isMobile ? 150 : 200} bgColor="#FFFFFF" fgColor="#6E59A5" />
      </div>
      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-2">Perfil de {name}</p>
        <p className="text-xs text-muted-foreground">Escanea este código para conectar</p>
      </div>
      <div className="flex items-center space-x-2 w-full mt-2">
        <Input value={getProfileUrl()} readOnly className="flex-1 text-xs md:text-sm" />
        <Button size="sm" onClick={handleCopyLink}>
          Copiar
        </Button>
      </div>
    </div>
  );
  
  return <>
      <div className="glass-card overflow-hidden transition-all duration-300 hover:shadow-hover h-full">
        <div className="relative">
          {/* Logo en la parte superior */}
          <div className="absolute top-0 left-0 w-full h-8 flex justify-center items-center z-10 pt-2">
            <div className="bg-white/90 rounded-full px-4 py-1 shadow-sm">
              <span className="text-homi-purple font-bold text-sm">homi</span>
            </div>
          </div>
          
          <div className="aspect-[4/5] overflow-hidden bg-gradient-to-br from-purple-100 to-pink-50 relative">
            <img src={imgUrl} alt={name} className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
            <div className="absolute top-3 right-3">
              <CompatibilityBadge percentage={compatibility} />
            </div>
          </div>
        </div>
        
        <div className="p-3 md:p-5">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-lg md:text-xl font-semibold">{name}, {age}</h3>
              {username && <p className="text-xs md:text-sm text-muted-foreground flex items-center gap-1 mb-1">
                  <AtSign size={14} className="text-homi-purple" />
                  {username}
                </p>}
              <p className="text-xs md:text-sm text-muted-foreground flex items-center gap-1">
                <MapPin size={14} className="text-homi-purple" />
                {location}
              </p>
            </div>
          </div>
          
          <p className="my-2 md:my-3 text-xs md:text-sm line-clamp-2">{bio}</p>
          
          <div className="flex flex-wrap gap-1 md:gap-1.5 my-2 md:my-3">
            {tags.slice(0, 3).map(tag => <span key={tag.id} className="px-2 py-0.5 text-xs rounded-full bg-homi-ultraLightPurple text-homi-purple">
                {tag.name}
              </span>)}
            {tags.length > 3 && <span className="px-2 py-0.5 text-xs rounded-full bg-homi-ultraLightPurple text-homi-purple">
                +{tags.length - 3}
              </span>}
          </div>
          
          <div className="flex gap-1 md:gap-2 mt-2 md:mt-4">
            <Button variant="outline" size="sm" className="rounded-full flex-1 text-xs md:text-sm px-2 md:px-3" onClick={() => onView && onView(id)}>
              <User size={14} className={isMobile ? "" : "mr-1"} /> {!isMobile && "Ver Perfil"}
            </Button>
            <Button variant={liked ? "default" : "outline"} size="sm" className={`rounded-full ${liked ? 'bg-homi-purple hover:bg-homi-purple/90' : ''}`} onClick={handleLike}>
              <Heart size={14} className={liked ? 'fill-white' : ''} />
            </Button>
            <Button variant="outline" size="sm" className="rounded-full" onClick={() => setShowQrDialog(true)}>
              <QrCode size={14} />
            </Button>
            <Button variant="default" size="sm" className="rounded-full bg-homi-purple hover:bg-homi-purple/90" onClick={() => onMessage && onMessage(id)}>
              <MessageSquare size={14} />
            </Button>
          </div>
        </div>
      </div>

      {/* QR Code Dialog - Desktop */}
      {!isMobile && (
        <Dialog open={showQrDialog} onOpenChange={setShowQrDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Comparte tu código QR</DialogTitle>
            </DialogHeader>
            <QrCodeContent />
          </DialogContent>
        </Dialog>
      )}
      
      {/* QR Code Drawer - Mobile */}
      {isMobile && (
        <Drawer open={showQrDialog} onOpenChange={setShowQrDialog}>
          <DrawerContent>
            <DrawerHeader className="text-center">
              <DrawerTitle>Comparte tu código QR</DrawerTitle>
            </DrawerHeader>
            <QrCodeContent />
          </DrawerContent>
        </Drawer>
      )}
    </>;
};

export default ProfileCard;
