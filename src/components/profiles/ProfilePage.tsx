import React from 'react';
import { useState, useRef, ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { MessageSquare, Share, Heart, Home, Briefcase, GraduationCap, UserCheck, Pencil, Download, QrCode, Camera, ChevronLeft, ChevronRight, Search, Check, X, DollarSign, Calendar, MapPin, Users } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import html2canvas from 'html2canvas';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Slider } from '@/components/ui/slider';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ProfilePage = () => {
  const [liked, setLiked] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);
  const [isEditingLookingFor, setIsEditingLookingFor] = useState(false);
  const isMobile = useIsMobile();
  const {
    toast
  } = useToast();
  const qrCodeRef = useRef<HTMLDivElement>(null);
  const profileCardRef = useRef<HTMLDivElement>(null);
  const [profile, setProfile] = useState({
    id: '1',
    name: 'Elena García',
    age: 23,
    location: 'Madrid',
    university: 'Universidad Complutense de Madrid',
    occupation: 'Estudiante de Arquitectura',
    bio: 'Soy una estudiante apasionada por el diseño y la arquitectura. Me gusta leer, visitar museos y disfrutar de noches tranquilas en casa. Soy ordenada y respetuosa con los espacios compartidos. Busco un piso cerca de la universidad con personas afines a mi estilo de vida.',
    imgUrl: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7',
    galleryImgs: ['https://images.unsplash.com/photo-1649972904349-6e44c42644a7', 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158', 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158'],
    tags: [{
      id: 1,
      name: 'Ordenada'
    }, {
      id: 2,
      name: 'Tranquila'
    }, {
      id: 3,
      name: 'Estudiante'
    }, {
      id: 4,
      name: 'Lectora'
    }, {
      id: 5,
      name: 'Madrugadora'
    }],
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
    lookingFor: {
      hasApartment: true,
      roommatesCount: "2",
      genderPreference: "mujeres",
      smokingPreference: "no",
      occupationPreference: "estudiantes",
      minAge: "18",
      maxAge: "25",
      budgetRange: [400, 600],
      exactPrice: 450
    }
  });

  const handleLike = () => {
    setLiked(!liked);
    toast({
      title: liked ? 'Ya no te gusta este perfil' : '¡Te gusta este perfil!',
      description: liked ? 'Eliminado de tus favoritos' : 'Añadido a tus favoritos',
      variant: liked ? 'destructive' : 'default'
    });
  };

  const handleMessage = () => {
    toast({
      title: 'Enviando mensaje',
      description: `Iniciando chat con ${profile.name}`
    });
  };

  const handleShare = () => {
    setShowShareDialog(true);
  };

  const handleEditProfile = () => {
    setIsEditing(true);
    toast({
      title: 'Editar perfil',
      description: 'Redirigiendo al editor de perfil'
    });
  };

  const handleDownloadCard = async () => {
    if (profileCardRef.current) {
      try {
        toast({
          title: 'Descargando tarjeta',
          description: 'Preparando tu tarjeta de perfil...'
        });
        const canvas = await html2canvas(profileCardRef.current, {
          scale: 2,
          logging: false,
          useCORS: true,
          allowTaint: true
        });
        const link = document.createElement('a');
        link.download = `perfil-${profile.name.toLowerCase().replace(/\s+/g, '-')}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        toast({
          title: 'Tarjeta descargada',
          description: 'Tu tarjeta se ha descargado con éxito',
          variant: 'default'
        });
      } catch (error) {
        console.error('Error downloading card:', error);
        toast({
          title: 'Error',
          description: 'No se pudo descargar la tarjeta',
          variant: 'destructive'
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
          description: 'Preparando tu código QR...'
        });
        const canvas = await html2canvas(qrCodeRef.current, {
          scale: 2,
          backgroundColor: '#FFFFFF'
        });
        const link = document.createElement('a');
        link.download = `qr-${profile.name.toLowerCase().replace(/\s+/g, '-')}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        toast({
          title: 'QR descargado',
          description: 'Tu código QR se ha descargado con éxito',
          variant: 'default'
        });
      } catch (error) {
        console.error('Error downloading QR:', error);
        toast({
          title: 'Error',
          description: 'No se pudo descargar el código QR',
          variant: 'destructive'
        });
      }
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(getProfileUrl());
    toast({
      title: 'Enlace copiado',
      description: 'El enlace a tu perfil se ha copiado al portapapeles'
    });
    setTimeout(() => setShowShareDialog(false), 1000);
  };

  const handleNextGalleryImage = () => {
    setActiveGalleryIndex(prevIndex => prevIndex === profile.galleryImgs.length - 1 ? 0 : prevIndex + 1);
  };

  const handlePrevGalleryImage = () => {
    setActiveGalleryIndex(prevIndex => prevIndex === 0 ? profile.galleryImgs.length - 1 : prevIndex - 1);
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

  const handleEditLookingFor = () => {
    setIsEditingLookingFor(true);
  };

  const handleSaveLookingFor = () => {
    setIsEditingLookingFor(false);
    toast({
      title: 'Preferencias guardadas',
      description: 'Tus preferencias de búsqueda han sido actualizadas'
    });
  };

  const handleCancelEditLookingFor = () => {
    setIsEditingLookingFor(false);
  };

  const handleLookingForChange = (field: string, value: any) => {
    setProfile(prev => ({
      ...prev,
      lookingFor: {
        ...prev.lookingFor,
        [field]: value
      }
    }));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 md:pt-28 pb-16 md:pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="glass-card overflow-hidden">
              <div className="relative p-6 pt-16 md:pt-20 pb-6 md:pb-8">
                <div className="absolute top-6 left-6">
                  <Avatar className={`${isMobile ? 'w-24 h-24' : 'w-32 h-32'} border-4 border-white shadow-lg`}>
                    <AvatarImage src={profile.imgUrl} alt={profile.name} />
                    <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {profile.verified && (
                    <div className="absolute bottom-0 right-0 bg-homi-purple text-white p-1 rounded-full">
                      <UserCheck size={isMobile ? 14 : 16} />
                    </div>
                  )}
                </div>
                
                <Link to="/profile/edit">
                  <Button variant="outline" size="sm" className="absolute top-6 right-6 rounded-full bg-white/80 hover:bg-white">
                    {isMobile ? <Pencil size={16} /> : <><Pencil size={16} className="mr-2" />Editar Perfil</>}
                  </Button>
                </Link>
                
                <div className={isMobile ? 'mt-28 ml-2' : 'ml-44'}>
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
                    <div className={`flex ${isMobile ? 'justify-between' : 'gap-2'} mt-4 md:mt-0`}>
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
                      <Button variant="outline" size={isMobile ? "icon" : "sm"} className="rounded-full" onClick={handleShare}>
                        <Share size={18} />
                      </Button>
                      <Button size={isMobile ? "icon" : "sm"} className="rounded-full bg-homi-purple hover:bg-homi-purple/90" onClick={handleMessage}>
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
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mt-6 md:mt-8">
              <div className="md:col-span-2 space-y-6 md:space-y-8">
                <div className="glass-card p-5 md:p-7">
                  <h2 className="text-lg md:text-xl font-semibold mb-4 md:mb-5">Sobre mí</h2>
                  <p className="text-sm md:text-base">{profile.bio}</p>
                  
                  <div className="mt-5 md:mt-7">
                    <h3 className="font-medium mb-3">Datos personales</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
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
                  
                  <div className="mt-5 md:mt-7">
                    <h3 className="font-medium mb-3">Intereses</h3>
                    <div className="flex flex-wrap gap-2">
                      {profile.tags.map(tag => (
                        <span key={tag.id} className="px-2 md:px-3 py-1 text-xs md:text-sm rounded-full bg-homi-ultraLightPurple text-homi-purple">
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="glass-card p-5 md:p-7">
                  <h2 className="text-lg md:text-xl font-semibold mb-4 md:mb-5">Galería</h2>
                  
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
                
                {!isMobile && (
                  <div className="glass-card p-7">
                    <h2 className="text-xl font-semibold mb-5 flex items-center gap-2">
                      <QrCode size={20} className="text-homi-purple" />
                      Tarjeta de presentación
                    </h2>
                    <p className="text-muted-foreground mb-5">
                      Comparte tu perfil en redes sociales o descarga tu tarjeta de presentación con código QR.
                    </p>
                    
                    <div className="mt-6 flex flex-col items-center">
                      <div 
                        id="profile-card" 
                        ref={profileCardRef} 
                        className="w-[360px] h-[640px] bg-gradient-to-br from-purple-600 to-pink-500 rounded-xl shadow-xl overflow-hidden relative mx-auto mb-8"
                      >
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/90 to-purple-600/60 p-6 flex flex-col justify-end">
                          <div className="mb-5 flex items-center gap-3">
                            <div className="w-16 h-16 rounded-full border-2 border-white overflow-hidden">
                              <img src={profile.imgUrl} alt={profile.name} className="w-full h-full object-cover" />
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
                              {profile.tags.slice(0, 3).map(tag => (
                                <span key={tag.id} className="px-3 py-1 text-xs rounded-full bg-white/20 text-white">
                                  {tag.name}
                                </span>
                              ))}
                            </div>
                            
                            <p className="text-white/90 text-sm line-clamp-2">
                              {profile.bio}
                            </p>
                          </div>
                          
                          <div className="mb-4 text-white/90">
                            <h4 className="text-xs font-medium text-white/70 mb-2 flex items-center gap-1">
                              <Search size={12} />
                              Lo que estoy buscando:
                            </h4>
                            <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs">
                              <div>
                                <span className="text-white/60">Presupuesto:</span>
                                <p>€{profile.lookingFor.budgetRange[0]} - €{profile.lookingFor.budgetRange[1]}</p>
                              </div>
                              <div>
                                <span className="text-white/60">Género:</span>
                                <p>
                                  {profile.lookingFor.genderPreference === 'mujeres' 
                                    ? 'Solo mujeres' 
                                    : profile.lookingFor.genderPreference === 'hombres' 
                                      ? 'Solo hombres' 
                                      : 'Cualquier género'}
                                </p>
                              </div>
                              <div>
                                <span className="text-white/60">Edad:</span>
                                <p>{profile.lookingFor.minAge} - {profile.lookingFor.maxAge} años</p>
                              </div>
                              <div>
                                <span className="text-white/60">Compañeros:</span>
                                <p>{profile.lookingFor.roommatesCount}</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center bg-white/10 p-3 rounded-lg backdrop-blur-sm mx-0 px-[12px] py-[12px] mb-10">
                            <div>
                              <h4 className="text-xs text-white/60 mb-1">Escanea para conectar</h4>
                              <p className="text-sm font-medium text-white">homi-connect.app</p>
                            </div>
                            <div className="bg-white p-2 rounded-lg">
                              <QRCodeSVG value={getProfileUrl()} size={64} bgColor="#FFFFFF" fgColor="#6E59A5" />
                            </div>
                          </div>
                          
                          <div className="absolute bottom-4 left-0 w-full text-center text-white/80 text-xs px-6">
                            <p>Descárgate Homi para encontrar tu compañero de piso ideal. Escanea mi código o búscame por mi nombre de usuario en Homi para conectar</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                        <Button onClick={handleDownloadCard} className="bg-homi-purple hover:bg-homi-purple/90">
                          <Download size={16} className="mr-2" />
                          Descargar Tarjeta
                        </Button>
                        
                        <Button variant="outline" onClick={handleShare}>
                          <Share size={16} className="mr-2" />
                          Compartir Perfil
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="space-y-6 md:space-y-8">
                <div className="glass-card p-5 md:p-7">
                  <div className="flex justify-between items-center mb-4 md:mb-5">
                    <h2 className="text-lg md:text-xl font-semibold flex items-center gap-2">
                      <Search size={20} className="text-homi-purple" />
                      Preferencias y búsqueda
                    </h2>
                    
                    {!isEditingLookingFor ? (
                      <Button variant="outline" size="sm" onClick={handleEditLookingFor} className="rounded-full h-8 w-8 p-0">
                        <Pencil size={15} />
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={handleCancelEditLookingFor} className="rounded-full h-8 w-8 p-0 border-red-400 text-red-500">
                          <X size={15} />
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleSaveLookingFor} className="rounded-full h-8 w-8 p-0 border-green-400 text-green-500">
                          <Check size={15} />
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-5">
                    {!isEditingLookingFor ? (
                      <div className="space-y-6">
                        <div className="flex items-center gap-2 text-sm md:text-base">
                          <div className="bg-homi-ultraLightPurple text-homi-purple p-1.5 rounded-full">
                            <Home size={16} />
                          </div>
                          <span>
                            {profile.lookingFor.hasApartment ? 'Ya tengo piso y busco compañeros' : 'Busco piso compartido'}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="md:col-span-2">
                            <div className="flex items-center gap-2 mb-2">
                              <DollarSign size={16} className="text-homi-purple" />
                              <span className="font-medium">
                                {profile.lookingFor.hasApartment ? 'Precio por habitación' : 'Presupuesto'}
                              </span>
                            </div>
                            <p className="text-sm md:text-base font-bold">
                              €{profile.lookingFor.exactPrice}/mes
                            </p>
                          </div>
                          
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <MapPin size={16} className="text-homi-purple" />
                              <span className="font-medium">Ubicación</span>
                            </div>
                            <p className="text-sm md:text-base">{profile.preferences.location}</p>
                          </div>
                          
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Users size={16} className="text-homi-purple" />
                              <span className="font-medium">Compañeros</span>
                            </div>
                            <p className="text-sm md:text-base">{profile.lookingFor.roommatesCount}</p>
                          </div>
                          
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Calendar size={16} className="text-homi-purple" />
                              <span className="font-medium">Fecha de entrada</span>
                            </div>
                            <p className="text-sm md:text-base">{profile.preferences.moveInDate}</p>
                          </div>
                          
                          <div>
                            <span className="font-medium">Preferencia de género</span>
                            <p className="text-sm md:text-base mt-2">
                              {profile.lookingFor.genderPreference === 'mujeres' && 'Solo mujeres'}
                              {profile.lookingFor.genderPreference === 'hombres' && 'Solo hombres'}
                              {profile.lookingFor.genderPreference === 'cualquiera' && 'Cualquier género'}
                            </p>
                          </div>
                          
                          <div>
                            <span className="font-medium">Preferencia tabaco</span>
                            <p className="text-sm md:text-base mt-2">
                              {profile.lookingFor.smokingPreference === 'no' && 'No fumadores'}
                              {profile.lookingFor.smokingPreference === 'ocasional' && 'Fumador ocasional'}
                              {profile.lookingFor.smokingPreference === 'si' && 'Fumadores permitidos'}
                            </p>
                          </div>
                          
                          <div>
                            <span className="font-medium">Ocupación</span>
                            <p className="text-sm md:text-base mt-2">
                              {profile.lookingFor.occupationPreference === 'estudiantes' && 'Estudiantes'}
                              {profile.lookingFor.occupationPreference === 'trabajadores' && 'Trabajadores'}
                              {profile.lookingFor.occupationPreference === 'cualquiera' && 'Cualquier ocupación'}
                            </p>
                          </div>
                          
                          <div>
                            <span className="font-medium">Rango de edad</span>
                            <p className="text-sm md:text-base mt-2">
                              {profile.lookingFor.minAge} - {profile.lookingFor.maxAge} años
                            </p>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="font-medium mb-3">Estilo de vida preferido</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <span className="text-xs md:text-sm text-muted-foreground">Limpieza:</span>
                              <p className="font-medium text-sm md:text-base">{profile.lifestyle.cleanliness}</p>
                            </div>
                            <div>
                              <span className="text-xs md:text-sm text-muted-foreground">Visitas:</span>
                              <p className="font-medium text-sm md:text-base">{profile.lifestyle.guests}</p>
                            </div>
                            <div>
                              <span className="text-xs md:text-sm text-muted-foreground">Tabaco:</span>
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
                      </div>
                    ) : (
                      <div className="space-y-5">
                        <div className="flex items-center justify-between gap-2 p-3 border border-input rounded-md bg-background/50">
                          <div className="flex items-center gap-2">
                            <div className="bg-homi-ultraLightPurple text-homi-purple p-1.5 rounded-full">
                              <Home size={16} />
                            </div>
                            <span className="text-sm md:text-base">
                              {profile.lookingFor.hasApartment ? 'Ya tengo piso y busco compañeros' : 'Busco piso compartido'}
                            </span>
                          </div>
                          <Switch 
                            checked={profile.lookingFor.hasApartment} 
                            onCheckedChange={checked => handleLookingForChange('hasApartment', checked)} 
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-xs md:text-sm text-muted-foreground">
                              Número de compañeros:
                            </label>
                            <select 
                              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm" 
                              value={profile.lookingFor.roommatesCount} 
                              onChange={e => handleLookingForChange('roommatesCount', e.target.value)}
                            >
                              <option value="1">1</option>
                              <option value="2">2</option>
                              <option value="3">3</option>
                              <option value="4+">4 o más</option>
                            </select>
                          </div>
                          
                          <div className="space-y-2">
                            <label className="text-xs md:text-sm text-muted-foreground">
                              Preferencia de género:
                            </label>
                            <select 
                              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm" 
                              value={profile.lookingFor.genderPreference} 
                              onChange={e => handleLookingForChange('genderPreference', e.target.value)}
                            >
                              <option value="mujeres">Solo mujeres</option>
                              <option value="hombres">Solo hombres</option>
                              <option value="cualquiera">Cualquier género</option>
                            </select>
                          </div>
                          
                          <div className="space-y-2">
                            <label className="text-xs md:text-sm text-muted-foreground">
                              Preferencia tabaco:
                            </label>
                            <select 
                              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm" 
                              value={profile.lookingFor.smokingPreference} 
                              onChange={e => handleLookingForChange('smokingPreference', e.target.value)}
                            >
                              <option value="no">No fumadores</option>
                              <option value="ocasional">Fumador ocasional</option>
                              <option value="si">Fumadores permitidos</option>
                            </select>
                          </div>
                          
                          <div className="space-y-2">
                            <label className="text-xs md:text-sm text-muted-foreground">
                              Ocupación:
                            </label>
                            <select 
                              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm" 
                              value={profile.lookingFor.occupationPreference} 
                              onChange={e => handleLookingForChange('occupationPreference', e.target.value)}
                            >
                              <option value="estudiantes">Estudiantes</option>
                              <option value="trabajadores">Trabajadores</option>
