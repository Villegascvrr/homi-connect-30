
import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
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
  ChevronRight,
  Search
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
    },
    // New property for roommate preferences
    lookingFor: {
      hasApartment: true,
      roommatesCount: "2",
      genderPreference: "mujeres",
      smokingPreference: "no",
      occupationPreference: "estudiantes",
      minAge: "18",
      maxAge: "25"
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
          // Fixed TypeScript error by using valid variant
          variant: 'default',
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
          // Fixed TypeScript error by using valid variant
          variant: 'default',
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
                
                <Link to="/profile/edit">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="absolute top-4 right-4 rounded-full bg-white/80 hover:bg-white"
                  >
                    {isMobile ? <Pencil size={16} /> : <><Pencil size={16} className="mr-2" />Editar Perfil</>}
                  </Button>
                </Link>
              </div>
              
              {/* Profile Info Section - Improved mobile spacing */}
              <div className="relative px-4 md:px-6 py-6 md:py-8">
                <div className={`${isMobile ? 'absolute -top-14 left-4' : 'absolute -top-16 left-6'} ${isMobile ? 'w-24 h-24' : 'w-32 h-32'} rounded-full overflow-hidden border-4 border-white shadow-lg`}>
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
                
                <div className={isMobile ? 'mt-14' : 'ml-36'}>
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
            
            {/* Main content grid - Improved mobile spacing */}
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
                
                {/* Gallery section - Improved mobile view */}
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
                      
                      {/* Improved mobile indicators */}
                      <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2">
                        {profile.galleryImgs.map((_, index) => (
                          <button 
                            key={index} 
                            className={`h-2.5 w-2.5 rounded-full ${activeGalleryIndex === index ? 'bg-white' : 'bg-white/50'}`}
                            onClick={() => setActiveGalleryIndex(index)}
                            aria-label={`Ver imagen ${index + 1}`}
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
                
                {/* NEW - Looking For section */}
                <div className="glass-card p-4 md:p-6">
                  <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 flex items-center gap-2">
                    <Search size={20} className="text-homi-purple" />
                    Lo que estoy buscando
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm md:text-base">
                      <div className="bg-homi-ultraLightPurple text-homi-purple p-1.5 rounded-full">
                        <Home size={16} />
                      </div>
                      <span>
                        {profile.lookingFor.hasApartment 
                          ? 'Ya tengo piso y busco compañeros' 
                          : 'Busco piso compartido'}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-xs md:text-sm text-muted-foreground">Número de compañeros:</span>
                        <p className="font-medium text-sm md:text-base">{profile.lookingFor.roommatesCount}</p>
                      </div>
                      
                      <div>
                        <span className="text-xs md:text-sm text-muted-foreground">Preferencia de género:</span>
                        <p className="font-medium text-sm md:text-base">
                          {profile.lookingFor.genderPreference === 'mujeres' && 'Solo mujeres'}
                          {profile.lookingFor.genderPreference === 'hombres' && 'Solo hombres'}
                          {profile.lookingFor.genderPreference === 'cualquiera' && 'Cualquier género'}
                        </p>
                      </div>
                      
                      <div>
                        <span className="text-xs md:text-sm text-muted-foreground">Preferencia tabaco:</span>
                        <p className="font-medium text-sm md:text-base">
                          {profile.lookingFor.smokingPreference === 'no' && 'No fumadores'}
                          {profile.lookingFor.smokingPreference === 'ocasional' && 'Fumador ocasional'}
                          {profile.lookingFor.smokingPreference === 'si' && 'Fumadores permitidos'}
                        </p>
                      </div>
                      
                      <div>
                        <span className="text-xs md:text-sm text-muted-foreground">Ocupación:</span>
                        <p className="font-medium text-sm md:text-base">
                          {profile.lookingFor.occupationPreference === 'estudiantes' && 'Estudiantes'}
                          {profile.lookingFor.occupationPreference === 'trabajadores' && 'Trabajadores'}
                          {profile.lookingFor.occupationPreference === 'cualquiera' && 'Cualquier ocupación'}
                        </p>
                      </div>
                      
                      <div>
                        <span className="text-xs md:text-sm text-muted-foreground">Rango de edad:</span>
                        <p className="font-medium text-sm md:text-base">
                          {profile.lookingFor.minAge} - {profile.lookingFor.maxAge} años
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Sidebar - Improved for mobile */}
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

                {/* QR Code - Improved for mobile */}
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
      
      {/* Share Dialog - Improved for mobile */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="sm:max-w-md mx-auto p-4 md:p-6">
          <DialogHeader>
            <DialogTitle>Compartir mi perfil</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex items-center space-x-2 pb-2">
              <div className="grid flex-1 gap-2">
                <p className="text-sm text-muted-foreground">
                  Enlace a tu perfil:
                </p>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-0">
                  <input
                    className="flex h-10 w-full sm:rounded-r-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={getProfileUrl()}
                    readOnly
                  />
                  <Button 
                    className="sm:rounded-l-none rounded-md bg-homi-purple hover:bg-homi-purple/90"
                    onClick={handleCopyLink}
                  >
                    Copiar
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Social media sharing buttons - Improved for mobile */}
            <div className="grid grid-cols-4 gap-2">
              <Button 
                variant="outline" 
                className="flex flex-col h-auto p-2 items-center justify-center"
                onClick={() => shareToSocialMedia('whatsapp')}
              >
                <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center mb-1">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19.1131 4.96331C15.2938 1.07156 8.95542 1.07156 5.13615 4.96331C1.9246 8.23331 1.31688 13.2791 3.44764 17.1158L2.25605 22L7.2333 20.8084C8.91444 21.7458 10.7062 22.21 12.5062 22.21C17.8396 22.21 22.2119 17.7458 22.2119 12.3042C22.1208 9.61331 21.0219 7.0975 19.1131 4.96331ZM12.4242 20.4042C10.8065 20.4042 9.18915 19.94 7.7521 19.0937L7.42187 18.91L4.25397 19.6233L4.97897 16.545L4.76668 16.2146C3.8396 14.7233 3.35522 12.9688 3.35522 11.1231C3.35522 5.9975 7.32187 1.94834 12.4333 1.94834C16.0698 1.94834 19.3385 4.1425 20.7756 7.3425C22.2127 10.5425 21.4877 14.381 18.8756 16.9478C16.2635 19.5146 12.4333 20.4042 12.4242 20.4042Z" fill="white"/>
                    <path d="M17.9852 14.5171L15.8451 13.9108C15.5787 13.8379 15.3031 13.8652 15.0577 13.9992C14.8128 14.1336 14.6207 14.3663 14.4195 14.6083C14.1729 14.8958 13.9171 15.1742 13.6523 15.4437C13.3965 15.7221 13.0935 15.7313 12.792 15.5513C12.4906 15.3713 11.422 15.0106 10.1703 13.9196C9.18732 13.0392 8.52551 11.96 8.27868 11.6267C8.03186 11.2933 8.25916 11.0692 8.47603 10.8633C8.67832 10.6756 8.92416 10.3792 9.1514 10.136C9.37769 9.89295 9.45395 9.60461 9.52927 9.36794C9.60458 9.13127 9.53947 8.84378 9.47499 8.63711C9.41051 8.43044 8.67832 6.64711 8.37624 6.04711C8.07416 5.44711 7.77207 5.54836 7.52499 5.54836C7.28066 5.54836 7.03374 5.53753 6.78645 5.53753C6.45478 5.53753 5.99145 5.73336 5.66478 6.0667C5.33811 6.40003 4.48761 7.11586 4.48761 8.88961C4.48761 10.6633 5.80561 12.4738 5.99749 12.7021C6.18936 12.9304 8.52551 16.9217 12.227 18.3029C12.9592 18.6225 13.5397 18.8058 13.992 18.9433C14.7427 19.1708 15.4244 19.14 15.9638 19.0742C16.5671 18.9996 18.0653 18.3758 18.3674 17.6692C18.6695 16.9625 18.6695 16.3625 18.605 16.2238C18.5406 16.085 18.292 16.0083 17.9852 15.8742C17.6784 15.74 17.9946 14.6444 17.9852 14.5171Z" fill="white"/>
                  </svg>
                </div>
                <span className="text-xs">WhatsApp</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="flex flex-col h-auto p-2 items-center justify-center"
                onClick={() => shareToSocialMedia('telegram')}
              >
                <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center mb-1">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19.2 4.4L2.9 10.7C1.8 11.1 1.8 11.6 2.7 11.9L6.8 13.1L16.9 7C17.4 6.8 17.8 6.9 17.5 7.2L9.4 14.4L9 18.2C9.4 18.2 9.6 18 9.9 17.8L11.9 15.8L16.1 18.8C17 19.3 17.6 19 17.8 18L20.9 5.3C21.2 4.2 20.4 3.7 19.2 4.4Z" fill="white"/>
                  </svg>
                </div>
                <span className="text-xs">Telegram</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="flex flex-col h-auto p-2 items-center justify-center"
                onClick={() => shareToSocialMedia('facebook')}
              >
                <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center mb-1">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 13.5H16.5L17.5 9.5H14V7.5C14 6.47 14 5.5 16 5.5H17.5V2.14C17.174 2.097 15.943 2 14.643 2C11.928 2 10 3.657 10 6.7V9.5H7V13.5H10V22H14V13.5Z" fill="white"/>
                  </svg>
                </div>
                <span className="text-xs">Facebook</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="flex flex-col h-auto p-2 items-center justify-center"
                onClick={() => shareToSocialMedia('twitter')}
              >
                <div className="h-10 w-10 rounded-full bg-sky-500 flex items-center justify-center mb-1">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 5.8C21.2 6.1 20.4 6.3 19.5 6.4C20.4 5.9 21.1 5.1 21.4 4.1C20.6 4.6 19.7 4.9 18.8 5.1C18 4.3 16.9 3.8 15.7 3.8C13.5 3.8 11.7 5.6 11.7 7.8C11.7 8.1 11.7 8.4 11.8 8.6C8.3 8.5 5.1 6.9 3 4.4C2.6 4.9 2.4 5.6 2.4 6.3C2.4 7.6 3.1 8.8 4.2 9.5C3.5 9.5 2.8 9.3 2.2 9C2.2 9 2.2 9 2.2 9.1C2.2 11 3.6 12.6 5.5 13C5.1 13.1 4.8 13.1 4.4 13.1C4.1 13.1 3.8 13.1 3.5 13C4.1 14.6 5.6 15.7 7.4 15.7C6 16.7 4.2 17.3 2.3 17.3C1.9 17.3 1.6 17.3 1.2 17.2C3 18.3 5.2 18.9 7.5 18.9C15.7 18.9 20.1 12.2 20.1 6.4C20.1 6.2 20.1 6.1 20.1 5.9C21 5.3 21.7 4.6 22.2 3.7C21.5 4 20.7 4.2 20 4.3C20.6 4.2 21.4 3.6 22 5.8Z" fill="white"/>
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
