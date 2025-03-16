
import { useState, useRef } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  MessageSquare, 
  Share, 
  Heart, 
  Home, 
  Briefcase, 
  GraduationCap, 
  UserCheck, 
  Pencil, 
  Download, 
  QrCode, 
  Camera,
  ChevronLeft,
  ChevronRight 
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import html2canvas from 'html2canvas';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';

const ProfilePage = () => {
  const [liked, setLiked] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const qrCodeRef = useRef<HTMLDivElement>(null);
  const profileCardRef = useRef<HTMLDivElement>(null);
  
  const profile = {
    id: '1',
    name: 'Elena García',
    age: 23,
    location: 'Madrid',
    university: 'Universidad Complutense de Madrid',
    occupation: 'Estudiante de Arquitectura',
    bio: 'Soy una estudiante apasionada por el diseño y la arquitectura. Me gusta leer, visitar museos y disfrutar de noches tranquilas en casa. Soy ordenada y respetuosa con los espacios compartidos. Busco un piso cerca de la universidad con personas afines a mi estilo de vida.',
    imgUrl: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7',
    galleryImgs: [
      'https://images.unsplash.com/photo-1649972904349-6e44c42644a7',
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158'
    ],
    tags: [
      { id: 1, name: 'Ordenada' },
      { id: 2, name: 'Tranquila' },
      { id: 3, name: 'Estudiante' },
      { id: 4, name: 'Lectora' },
      { id: 5, name: 'Madrugadora' }
    ],
    verified: true,
    preferences: {
      budget: '€400-€600',
      location: 'Cerca de Universidad Complutense',
      roommates: '2-3 personas',
      moveInDate: 'Septiembre 2023'
    },
    lifestyle: {
      cleanliness: 'Alta',
      guests: 'Ocasionalmente',
      smoking: 'No',
      pets: 'Me gustan, pero no tengo',
      schedule: 'Madrugadora'
    }
  };

  const handleLike = () => {
    setLiked(!liked);
    toast({
      title: liked ? 'Ya no te gusta este perfil' : '¡Te gusta este perfil!',
      description: liked ? 'Eliminado de tus favoritos' : 'Añadido a tus favoritos',
      variant: liked ? 'destructive' : 'default',
    });
  };

  const handleMessage = () => {
    toast({
      title: 'Enviando mensaje',
      description: `Iniciando chat con ${profile.name}`,
    });
  };

  const handleShare = () => {
    setShowShareDialog(true);
  };

  const handleEditProfile = () => {
    setIsEditing(true);
    toast({
      title: 'Editar perfil',
      description: 'Redirigiendo al editor de perfil',
    });
  };

  const handleDownloadCard = async () => {
    if (profileCardRef.current) {
      try {
        toast({
          title: 'Descargando tarjeta',
          description: 'Preparando tu tarjeta de perfil...',
        });
        
        const canvas = await html2canvas(profileCardRef.current, {
          scale: 2,
          logging: false,
          useCORS: true,
          allowTaint: true,
        });
        
        const link = document.createElement('a');
        link.download = `perfil-${profile.name.toLowerCase().replace(/\s+/g, '-')}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        
        toast({
          title: 'Tarjeta descargada',
          description: 'Tu tarjeta se ha descargado con éxito',
          variant: 'success',
        });
      } catch (error) {
        console.error('Error downloading card:', error);
        toast({
          title: 'Error',
          description: 'No se pudo descargar la tarjeta',
          variant: 'destructive',
        });
      }
    }
  };

  const getCurrentUrl = () => {
    return window.location.href;
  };

  const getProfileUrl = () => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/profile/${profile.id}`;
  };

  const handleDownloadQR = async () => {
    if (qrCodeRef.current) {
      try {
        toast({
          title: 'Descargando QR',
          description: 'Preparando tu código QR...',
        });
        
        const canvas = await html2canvas(qrCodeRef.current, {
          scale: 2,
          backgroundColor: '#FFFFFF',
        });
        
        const link = document.createElement('a');
        link.download = `qr-${profile.name.toLowerCase().replace(/\s+/g, '-')}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        
        toast({
          title: 'QR descargado',
          description: 'Tu código QR se ha descargado con éxito',
          variant: 'success',
        });
      } catch (error) {
        console.error('Error downloading QR:', error);
        toast({
          title: 'Error',
          description: 'No se pudo descargar el código QR',
          variant: 'destructive',
        });
      }
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(getProfileUrl());
    toast({
      title: 'Enlace copiado',
      description: 'El enlace a tu perfil se ha copiado al portapapeles',
    });
    setTimeout(() => setShowShareDialog(false), 1000);
  };

  const handleNextGalleryImage = () => {
    setActiveGalleryIndex((prevIndex) => 
      prevIndex === profile.galleryImgs.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrevGalleryImage = () => {
    setActiveGalleryIndex((prevIndex) => 
      prevIndex === 0 ? profile.galleryImgs.length - 1 : prevIndex - 1
    );
  };

  const shareToSocialMedia = (platform: string) => {
    const profileUrl = getProfileUrl();
    let shareUrl = '';
    
    switch (platform) {
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(`¡Hola! Mira mi perfil en Homi: ${profileUrl}`)}`;
        break;
      case 'telegram':
        shareUrl = `https://telegram.me/share/url?url=${encodeURIComponent(profileUrl)}&text=${encodeURIComponent('¡Mira mi perfil en Homi!')}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(profileUrl)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent('¡Comparto mi perfil en Homi! ' + profileUrl)}`;
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank');
      setTimeout(() => setShowShareDialog(false), 500);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-16 md:pt-20 pb-8 md:pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="glass-card overflow-hidden">
              {/* Profile Cover & Avatar Section */}
              <div className="relative h-48 md:h-64 bg-homi-ultraLightPurple">
                <img
                  src={profile.imgUrl}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="absolute top-4 right-4 rounded-full bg-white/80 hover:bg-white"
                  onClick={handleEditProfile}
                >
                  {isMobile ? <Pencil size={16} /> : <><Pencil size={16} className="mr-2" />Editar Perfil</>}
                </Button>
              </div>
              
              {/* Profile Info Section */}
              <div className="relative px-4 md:px-6 py-6 md:py-8">
                <div className={`${isMobile ? 'absolute -top-12 left-4' : 'absolute -top-16 left-6'} ${isMobile ? 'w-24 h-24' : 'w-32 h-32'} rounded-full overflow-hidden border-4 border-white shadow-lg`}>
                  <img
                    src={profile.imgUrl}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                  {profile.verified && (
                    <div className="absolute bottom-0 right-0 bg-homi-purple text-white p-1 rounded-full">
                      <UserCheck size={isMobile ? 14 : 16} />
                    </div>
                  )}
                </div>
                
                <div className={isMobile ? 'mt-16' : 'ml-36'}>
                  <div className={`flex ${isMobile ? 'flex-col gap-3' : 'justify-between'}`}>
                    <div>
                      <h1 className="text-xl md:text-3xl font-bold flex items-center gap-2">
                        {profile.name}, {profile.age}
                      </h1>
                      <p className="text-muted-foreground flex items-center gap-1 mt-1">
                        <Home size={16} />
                        {profile.location}
                      </p>
                    </div>
                    <div className={`flex ${isMobile ? 'justify-between' : 'gap-2'} mt-2 md:mt-0`}>
                      <Button 
                        variant={liked ? "default" : "outline"}
                        size={isMobile ? "icon" : "sm"}
                        className={`rounded-full ${liked ? 'bg-homi-purple hover:bg-homi-purple/90' : ''}`}
                        onClick={handleLike}
                      >
                        {isMobile ? (
                          <Heart size={18} className={liked ? 'fill-white' : ''} />
                        ) : (
                          <>
                            <Heart size={18} className={liked ? 'mr-2 fill-white' : 'mr-2'} />
                            {liked ? 'Te gusta' : 'Me gusta'}
                          </>
                        )}
                      </Button>
                      <Button 
                        variant="outline" 
                        size={isMobile ? "icon" : "sm"}
                        className="rounded-full"
                        onClick={handleShare}
                      >
                        <Share size={18} />
                      </Button>
                      <Button 
                        size={isMobile ? "icon" : "sm"}
                        className="rounded-full bg-homi-purple hover:bg-homi-purple/90"
                        onClick={handleMessage}
                      >
                        {isMobile ? (
                          <MessageSquare size={18} />
                        ) : (
                          <>
                            <MessageSquare size={18} className="mr-2" />
                            Mensaje
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Main content grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-4 md:mt-6">
              <div className="md:col-span-2 space-y-4 md:space-y-6">
                {/* Bio section */}
                <div className="glass-card p-4 md:p-6">
                  <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">Sobre mí</h2>
                  <p className="text-sm md:text-base">{profile.bio}</p>
                  
                  <div className="mt-4 md:mt-6">
                    <h3 className="font-medium mb-2">Datos personales</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-4">
                      <div className="flex items-center gap-2">
                        <GraduationCap size={18} className="text-homi-purple" />
                        <span className="text-sm md:text-base">{profile.university}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Briefcase size={18} className="text-homi-purple" />
                        <span className="text-sm md:text-base">{profile.occupation}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 md:mt-6">
                    <h3 className="font-medium mb-2">Intereses</h3>
                    <div className="flex flex-wrap gap-2">
                      {profile.tags.map((tag) => (
                        <span 
                          key={tag.id} 
                          className="px-2 md:px-3 py-1 text-xs md:text-sm rounded-full bg-homi-ultraLightPurple text-homi-purple"
                        >
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Gallery section */}
                <div className="glass-card p-4 md:p-6">
                  <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">Galería</h2>
                  
                  {/* Mobile carousel view */}
                  {isMobile ? (
                    <div className="relative">
                      <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                        <img
                          src={profile.galleryImgs[activeGalleryIndex]}
                          alt={`Imagen ${activeGalleryIndex + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/80"
                        onClick={handlePrevGalleryImage}
                      >
                        <ChevronLeft size={16} />
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/80"
                        onClick={handleNextGalleryImage}
                      >
                        <ChevronRight size={16} />
                      </Button>
                      
                      <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                        {profile.galleryImgs.map((_, index) => (
                          <span 
                            key={index} 
                            className={`h-2 w-2 rounded-full ${activeGalleryIndex === index ? 'bg-white' : 'bg-white/50'}`}
                            onClick={() => setActiveGalleryIndex(index)}
                          />
                        ))}
                      </div>
                    </div>
                  ) : (
                    // Desktop grid view
                    <div className="grid grid-cols-3 gap-4">
                      {profile.galleryImgs.map((img, index) => (
                        <div key={index} className="aspect-square rounded-lg overflow-hidden bg-muted">
                          <img
                            src={img}
                            alt={`Imagen ${index + 1}`}
                            className="w-full h-full object-cover transition-transform hover:scale-105"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* QR Card section */}
                {!isMobile && (
                  <div className="glass-card p-6">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <QrCode size={20} className="text-homi-purple" />
                      Tarjeta de presentación
                    </h2>
                    <p className="text-muted-foreground mb-4">
                      Comparte tu perfil en redes sociales o descarga tu tarjeta de presentación con código QR.
                    </p>
                    
                    <div className="mt-4 flex flex-col items-center">
                      {/* Instagram story-style profile card */}
                      <div 
                        id="profile-card" 
                        ref={profileCardRef}
                        className="w-[360px] h-[640px] bg-gradient-to-br from-purple-600 to-pink-500 rounded-xl shadow-xl overflow-hidden relative mx-auto mb-6"
                      >
                        {/* Profile header */}
                        <div className="absolute top-0 left-0 w-full h-1/2 overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-purple-800/70"></div>
                          <img
                            src={profile.imgUrl}
                            alt={profile.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        {/* Profile content */}
                        <div className="absolute bottom-0 left-0 w-full h-2/3 bg-gradient-to-t from-purple-900/90 to-transparent p-6 flex flex-col justify-end">
                          <div className="mb-4 flex items-center gap-3">
                            <div className="w-16 h-16 rounded-full border-2 border-white overflow-hidden">
                              <img
                                src={profile.imgUrl}
                                alt={profile.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-white flex items-center gap-1">
                                {profile.name}, {profile.age}
                                {profile.verified && (
                                  <div className="bg-white text-purple-600 p-0.5 rounded-full">
                                    <UserCheck size={14} />
                                  </div>
                                )}
                              </h3>
                              <p className="text-sm text-white/80">{profile.location} · {profile.occupation}</p>
                            </div>
                          </div>
                          
                          <div className="mb-4">
                            <div className="flex flex-wrap gap-2 mb-3">
                              {profile.tags.slice(0, 5).map((tag) => (
                                <span 
                                  key={tag.id} 
                                  className="px-3 py-1 text-xs rounded-full bg-white/20 text-white"
                                >
                                  {tag.name}
                                </span>
                              ))}
                            </div>
                            
                            <p className="text-white/90 text-sm line-clamp-3 mb-6">
                              {profile.bio}
                            </p>
                          </div>
                          
                          <div className="flex justify-between items-center bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                            <div>
                              <h4 className="text-xs text-white/60 mb-1">Escanea para conectar</h4>
                              <p className="text-sm font-medium text-white">homi-connect.app</p>
                            </div>
                            <div className="bg-white p-2 rounded-lg">
                              <QRCodeSVG value={getProfileUrl()} size={64} bgColor="#FFFFFF" fgColor="#6E59A5" />
                            </div>
                          </div>
                          
                          <div className="absolute bottom-2 left-0 w-full text-center text-white/80 text-xs px-6">
                            <p>Descárgate Homi para encontrar tu compañero de piso ideal. Escanea mi código o búscame por mi nombre de usuario en Homi para conectar</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                        <Button 
                          onClick={handleDownloadCard}
                          className="bg-homi-purple hover:bg-homi-purple/90"
                        >
                          <Download size={16} className="mr-2" />
                          Descargar Tarjeta
                        </Button>
                        
                        <Button 
                          variant="outline"
                          onClick={handleShare}
                        >
                          <Share size={16} className="mr-2" />
                          Compartir Perfil
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Sidebar */}
              <div className="space-y-4 md:space-y-6">
                {/* Preferences */}
                <div className="glass-card p-4 md:p-6">
                  <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">Preferencias de vivienda</h2>
                  <div className="space-y-3">
                    <div>
                      <span className="text-xs md:text-sm text-muted-foreground">Presupuesto:</span>
                      <p className="font-medium text-sm md:text-base">{profile.preferences.budget}</p>
                    </div>
                    <div>
                      <span className="text-xs md:text-sm text-muted-foreground">Ubicación:</span>
                      <p className="font-medium text-sm md:text-base">{profile.preferences.location}</p>
                    </div>
                    <div>
                      <span className="text-xs md:text-sm text-muted-foreground">Compañeros:</span>
                      <p className="font-medium text-sm md:text-base">{profile.preferences.roommates}</p>
                    </div>
                    <div>
                      <span className="text-xs md:text-sm text-muted-foreground">Fecha de mudanza:</span>
                      <p className="font-medium text-sm md:text-base">{profile.preferences.moveInDate}</p>
                    </div>
                  </div>
                </div>
                
                {/* Lifestyle */}
                <div className="glass-card p-4 md:p-6">
                  <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">Estilo de vida</h2>
                  <div className="space-y-3">
                    <div>
                      <span className="text-xs md:text-sm text-muted-foreground">Limpieza:</span>
                      <p className="font-medium text-sm md:text-base">{profile.lifestyle.cleanliness}</p>
                    </div>
                    <div>
                      <span className="text-xs md:text-sm text-muted-foreground">Invitados:</span>
                      <p className="font-medium text-sm md:text-base">{profile.lifestyle.guests}</p>
                    </div>
                    <div>
                      <span className="text-xs md:text-sm text-muted-foreground">Fumar:</span>
                      <p className="font-medium text-sm md:text-base">{profile.lifestyle.smoking}</p>
                    </div>
                    <div>
                      <span className="text-xs md:text-sm text-muted-foreground">Mascotas:</span>
                      <p className="font-medium text-sm md:text-base">{profile.lifestyle.pets}</p>
                    </div>
                    <div>
                      <span className="text-xs md:text-sm text-muted-foreground">Horario:</span>
                      <p className="font-medium text-sm md:text-base">{profile.lifestyle.schedule}</p>
                    </div>
                  </div>
                </div>

                {/* QR Code */}
                <div className="glass-card p-4 md:p-6">
                  <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 flex items-center gap-2">
                    <QrCode size={20} className="text-homi-purple" />
                    Código QR de mi perfil
                  </h2>
                  <div className="flex flex-col items-center">
                    <div id="profile-qr" ref={qrCodeRef} className="bg-white p-4 rounded-xl mb-3 w-40 h-40 md:w-auto md:h-auto">
                      <QRCodeSVG value={getProfileUrl()} size={isMobile ? 132 : 150} />
                    </div>
                    <p className="text-xs md:text-sm text-center text-muted-foreground mb-3">
                      Escanea este código para compartir tu perfil con posibles compañeros de piso
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleDownloadQR}
                      className="w-full"
                    >
                      <Download size={16} className="mr-2" />
                      Descargar QR
                    </Button>
                  </div>
                </div>
                
                {/* Mobile Profile Card */}
                {isMobile && (
                  <div className="glass-card p-4">
                    <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <QrCode size={18} className="text-homi-purple" />
                      Tarjeta de presentación
                    </h2>
                    <Button 
                      className="w-full bg-homi-purple hover:bg-homi-purple/90 mb-2"
                      onClick={handleShare}
                    >
                      <Share size={16} className="mr-2" />
                      Compartir mi perfil
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Share Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="sm:max-w-md mx-4">
          <DialogHeader>
            <DialogTitle>Compartir mi perfil</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex items-center space-x-2 pb-2">
              <div className="grid flex-1 gap-2">
                <p className="text-sm text-muted-foreground">
                  Enlace a tu perfil:
                </p>
                <div className="flex">
                  <input
                    className="flex h-10 w-full rounded-l-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={getProfileUrl()}
                    readOnly
                  />
                  <Button 
                    className="rounded-l-none bg-homi-purple hover:bg-homi-purple/90"
                    onClick={handleCopyLink}
                  >
                    Copiar
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Social media sharing buttons */}
            <div className="grid grid-cols-4 gap-2">
              <Button 
                variant="outline" 
                className="flex flex-col h-auto p-2 md:p-3 items-center justify-center"
                onClick={() => shareToSocialMedia('whatsapp')}
              >
                <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-green-500 flex items-center justify-center mb-1">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19.1131 4.96331C15.2938 1.07156 8.95542 1.07156 5.13615 4.96331C1.9246 8.23331 1.31688 13.2791 3.44764 17.1158L2.25605 22L7.2333 20.8084C8.91444 21.7458 10.7062 22.21 12.5062 22.21C17.8396 22.21 22.2119 17.7458 22.2119 12.3042C22.1208 9.61331 21.0219 7.0975 19.1131 4.96331ZM12.4242 20.4042C10.8065 20.4042 9.18915 19.94 7.7521 19.0937L7.42187 18.9116L4.54644 19.6284L5.2271 16.7033L5.04498 16.3302C2.32498 12.7684 3.35035 7.8253 7.00873 5.10586C10.6671 2.38642 15.4923 3.41165 18.2123 7.06998C20.9323 10.7283 19.9069 15.5534 16.2485 18.2733C14.8115 19.6284 13.6562 20.4042 12.4242 20.4042ZM16.8562 14.7233L16.221 14.3958C16.221 14.3958 15.2938 13.9772 14.6946 13.6402C14.6035 13.6402 14.5125 13.5491 14.4215 13.5491C14.2394 13.5491 14.1483 13.6402 14.0573 13.6402C14.0573 13.6402 14.0573 13.7312 13.5477 14.3958C13.4567 14.5778 13.2746 14.5778 13.1835 14.4958C13.0923 14.4958 12.0846 14.0772 11.0767 13.1538C10.2598 12.4369 9.71654 11.5588 9.53442 11.2958C9.53442 11.2047 9.44338 11.1136 9.44338 11.0228V10.85C9.44338 10.759 9.53442 10.6679 9.53442 10.6679C9.53442 10.6679 9.80209 10.3947 9.98421 10.2126C10.0752 10.1214 10.1663 9.93937 10.2573 9.84833C10.3483 9.6662 10.2573 9.48411 10.1663 9.39307C10.1663 9.39307 9.53442 8.01307 9.35231 7.74543C9.17019 7.47779 8.89795 7.47779 8.71584 7.47779C8.71584 7.47779 8.34348 7.47779 8.06246 7.47779C7.97142 7.47779 7.88038 7.56884 7.78934 7.56884L7.7521 7.60607C7.7521 7.60607 7.2427 7.74543 6.88372 8.19142C6.5248 8.57301 6.0696 9.39307 6.0696 10.6679C6.0696 11.8516 6.70773 12.9441 6.88372 13.2118C6.97476 13.3028 8.8 16.1298 11.5404 17.3136C13.0923 17.9872 13.7304 18.0782 14.55 17.8961C15.0685 17.805 15.8483 17.296 16.0304 16.618C16.2125 15.9491 16.2123 15.3689 16.1213 15.2869C16.221 15.296 16.7667 15.0598 16.8562 14.7233Z" fill="white"/>
                  </svg>
                </div>
                <span className="text-xs">WhatsApp</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="flex flex-col h-auto p-2 md:p-3 items-center justify-center"
                onClick={() => shareToSocialMedia('telegram')}
              >
                <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-blue-500 flex items-center justify-center mb-1">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="#229ED9"/>
                    <path d="M17.28 8.32L15.3733 17.1067C15.3733 17.1067 15.1067 17.76 14.4133 17.4933L9.94667 13.7867L8.53334 13.12L5.81334 12.24C5.81334 12.24 5.41334 12.1067 5.38667 11.84C5.36 11.5733 5.84 11.4133 5.84 11.4133L16.56 7.45332C16.56 7.45332 17.28 7.12 17.28 7.68V8.32Z" fill="white"/>
                    <path d="M9.76001 16.88C9.76001 16.88 9.57335 16.8533 9.41335 16.48C9.25335 16.1067 8.53335 13.7867 8.53335 13.7867L14.1467 10.16C14.1467 10.16 14.48 9.94666 14.4667 10.16C14.4667 10.16 14.5333 10.1867 14.32 10.3733C14.1067 10.56 9.97335 13.84 9.97335 13.84" fill="#D2E5F1"/>
                    <path d="M11.7867 15.0133L9.89333 16.84C9.89333 16.84 9.78667 16.92 9.76 16.88L9.96 13.9067" fill="#B5CFE4"/>
                  </svg>
                </div>
                <span className="text-xs">Telegram</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="flex flex-col h-auto p-2 md:p-3 items-center justify-center"
                onClick={() => shareToSocialMedia('facebook')}
              >
                <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-blue-600 flex items-center justify-center mb-1">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13.397 20.997V12.801H16.162L16.573 9.59201H13.397V7.54801C13.397 6.62201 13.655 5.98801 14.984 5.98801H16.668V3.12701C16.3704 3.08774 15.1609 3.00001 13.7745 3.00001C10.8954 3.00001 8.9079 4.65701 8.9079 7.22301V9.59201H6.33203V12.801H8.9079V20.997H13.397Z" fill="white"/>
                  </svg>
                </div>
                <span className="text-xs">Facebook</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="flex flex-col h-auto p-2 md:p-3 items-center justify-center"
                onClick={() => shareToSocialMedia('twitter')}
              >
                <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-black flex items-center justify-center mb-1">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14.2832 10.7144L19.9395 4H18.5254L13.6543 9.71429L9.75977 4H4L10.0254 12.5714L4 19.7143H5.41406L10.6543 13.5714L14.8008 19.7143H20.5605L14.2832 10.7144ZM11.377 12.6857L10.7051 11.7286L6.0625 5.07143H8.95996L12.6152 10.4L13.2871 11.3571L18.1836 18.4286H15.2861L11.377 12.6857Z" fill="white"/>
                  </svg>
                </div>
                <span className="text-xs">Twitter</span>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default ProfilePage;
