import React from 'react';
import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { MessageSquare, Share, Heart, Home, Briefcase, GraduationCap, UserCheck, Pencil, Download, QrCode, Camera, ChevronLeft, ChevronRight, Search, Check, X, DollarSign, Calendar, MapPin, Users, AtSign } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import html2canvas from 'html2canvas';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Slider } from '@/components/ui/slider';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { type Json } from '@/integrations/supabase/types';

interface LifestyleDetail {
  cleanliness?: string;
  guests?: string;
  smoking?: string;
  pets?: string;
  schedule?: string;
}

interface LookingForPreferences {
  hasApartment: boolean;
  roommatesCount: string;
  genderPreference: string;
  smokingPreference: string;
  occupationPreference: string;
  minAge: string;
  maxAge: string;
  budgetRange: number[];
  exactPrice: number;
}

interface ProfilePreferences {
  budget: string;
  location: string;
  roommates: string;
  moveInDate: string;
}

interface ProfileData {
  id: string;
  name: string;
  username: string;
  age: number;
  location: string;
  university: string;
  occupation: string;
  bio: string;
  imgUrl: string;
  galleryImgs: string[];
  tags: { id: number; name: string }[];
  verified: boolean;
  preferences: ProfilePreferences;
  lifestyle: LifestyleDetail;
  lookingFor: LookingForPreferences;
}

interface SupabaseProfileData {
  id: string;
  bio: string | null;
  companeros_count: string | null;
  created_at: string;
  edad: string | null;
  email: string;
  first_name: string;
  gallery_images: string[] | null;
  interests: string[] | null;
  is_profile_active: boolean | null;
  last_name: string;
  lifestyle: Json | null;
  ocupacion: string | null;
  profile_image: string | null;
  sevilla_zona: string | null;
  ubicacion: string | null;
  universidad: string | null;
  updated_at: string;
  username: string;
  hasApartment?: boolean;
  genderPreference?: string;
  smokingPreference?: string;
  occupationPreference?: string;
  minAge?: string;
  maxAge?: string;
  exactPrice?: number;
}

const ProfilePage = () => {
  const [liked, setLiked] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);
  const [isEditingLookingFor, setIsEditingLookingFor] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const qrCodeRef = useRef<HTMLDivElement>(null);
  const profileCardRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  
  const defaultProfile: ProfileData = {
    id: '1',
    name: 'Usuario',
    username: 'usuario',
    age: 0,
    location: '-',
    university: '-',
    occupation: '-',
    bio: '-',
    imgUrl: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7',
    galleryImgs: ['https://images.unsplash.com/photo-1649972904349-6e44c42644a7'],
    tags: [],
    verified: false,
    preferences: {
      budget: '-',
      location: '-',
      roommates: '-',
      moveInDate: '-'
    },
    lifestyle: {
      cleanliness: '-',
      guests: '-',
      smoking: '-',
      pets: '-',
      schedule: '-'
    },
    lookingFor: {
      hasApartment: false,
      roommatesCount: "-",
      genderPreference: "-",
      smokingPreference: "-",
      occupationPreference: "-",
      minAge: "-",
      maxAge: "-",
      budgetRange: [400, 600],
      exactPrice: 0
    }
  };
  
  const [profile, setProfile] = useState<ProfileData>(defaultProfile);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;
      
      setIsLoading(true);
      
      try {
        console.log("Fetching profile for user ID:", user.id);
        
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (error) {
          console.error("Error fetching profile:", error);
          throw error;
        }
        
        console.log("Raw profile data from Supabase:", data);
        
        const profileData = data as SupabaseProfileData;
        
        let lifestyleObj: LifestyleDetail = {
          cleanliness: '-',
          guests: '-',
          smoking: '-',
          pets: '-',
          schedule: '-'
        };
        
        if (profileData.lifestyle) {
          if (typeof profileData.lifestyle === 'string') {
            try {
              lifestyleObj = JSON.parse(profileData.lifestyle);
            } catch (e) {
              console.error('Error parsing lifestyle JSON:', e);
            }
          } else if (typeof profileData.lifestyle === 'object' && profileData.lifestyle !== null) {
            const parsedLifestyle = profileData.lifestyle as Record<string, any>;
            
            lifestyleObj = {
              cleanliness: typeof parsedLifestyle.cleanliness === 'string' ? parsedLifestyle.cleanliness : '-',
              guests: typeof parsedLifestyle.guests === 'string' ? parsedLifestyle.guests : '-',
              smoking: typeof parsedLifestyle.smoking === 'string' ? parsedLifestyle.smoking : '-',
              pets: typeof parsedLifestyle.pets === 'string' ? parsedLifestyle.pets : '-',
              schedule: typeof parsedLifestyle.schedule === 'string' ? parsedLifestyle.schedule : '-'
            };
          }
        }
        
        console.log("Parsed lifestyle object:", lifestyleObj);
        
        const lookingForObj: LookingForPreferences = {
          hasApartment: profileData.hasApartment === true,
          roommatesCount: profileData.companeros_count || "-",
          genderPreference: profileData.genderPreference || "-",
          smokingPreference: profileData.smokingPreference || "-",
          occupationPreference: profileData.occupationPreference || "-",
          minAge: profileData.minAge || "-",
          maxAge: profileData.maxAge || "-",
          budgetRange: [400, 600],
          exactPrice: profileData.exactPrice || 0
        };
        
        const userProfile: ProfileData = {
          id: user.id,
          name: `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim() || 'Usuario',
          username: profileData.username || 'usuario',
          age: profileData.edad ? parseInt(profileData.edad) : 0,
          location: profileData.ubicacion || '-',
          university: profileData.universidad || '-',
          occupation: profileData.ocupacion || '-',
          bio: profileData.bio || '-',
          imgUrl: profileData.profile_image || defaultProfile.imgUrl,
          galleryImgs: profileData.gallery_images?.length ? profileData.gallery_images : [defaultProfile.imgUrl],
          tags: Array.isArray(profileData.interests) ? profileData.interests.map((tag: string, index: number) => ({ id: index + 1, name: tag })) : [],
          verified: true,
          preferences: {
            budget: lookingForObj.exactPrice ? `€${lookingForObj.exactPrice}` : '-',
            location: profileData.sevilla_zona || '-',
            roommates: profileData.companeros_count || '-',
            moveInDate: '-'
          },
          lifestyle: lifestyleObj,
          lookingFor: lookingForObj
        };
        
        console.log("Processed profile data:", userProfile);
        setProfile(userProfile);
      } catch (error) {
        console.error("Error loading profile:", error);
        toast({
          title: "Error al cargar perfil",
          description: "No se pudo cargar tu información de perfil",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserProfile();
  }, [user, toast]);

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

  const handleSaveLookingFor = async () => {
    if (!user) return;
    
    try {
      const lifestyleObject: Record<string, string> = {
        cleanliness: profile.lifestyle.cleanliness || '-',
        guests: profile.lifestyle.guests || '-',
        smoking: profile.lifestyle.smoking || '-',
        pets: profile.lifestyle.pets || '-',
        schedule: profile.lifestyle.schedule || '-'
      };
      
      const updateData: Record<string, any> = {
        companeros_count: profile.lookingFor.roommatesCount,
        hasApartment: profile.lookingFor.hasApartment,
        genderPreference: profile.lookingFor.genderPreference,
        smokingPreference: profile.lookingFor.smokingPreference,
        occupationPreference: profile.lookingFor.occupationPreference,
        minAge: profile.lookingFor.minAge,
        maxAge: profile.lookingFor.maxAge,
        exactPrice: profile.lookingFor.budgetRange[1],
        lifestyle: lifestyleObject
      };
      
      console.log("Saving profile updates:", updateData);
      
      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id);
        
      if (error) throw error;
      
      setIsEditingLookingFor(false);
      
      toast({
        title: 'Preferencias guardadas',
        description: 'Tus preferencias de búsqueda han sido actualizadas'
      });
    } catch (error) {
      console.error("Error saving preferences:", error);
      toast({
        title: 'Error al guardar',
        description: 'No se pudieron guardar tus preferencias',
        variant: 'destructive'
      });
    }
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-20 md:pt-24 pb-16 md:pb-20 flex items-center justify-center">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-64 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 w-44 bg-gray-200 rounded"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-20 md:pt-24 pb-16 md:pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="glass-card overflow-hidden">
              <div className="relative p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  <div className="relative">
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
                  
                  <div className="flex-grow space-y-2">
                    <h1 className="text-xl md:text-3xl font-bold flex items-center gap-2">
                      {profile.name}, {profile.age}
                    </h1>
                    <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                      <AtSign size={16} className="text-homi-purple flex-shrink-0" />
                      {profile.username || "usuario"}
                    </p>
                    <p className="text-muted-foreground flex items-center gap-1.5">
                      <Home size={16} className="flex-shrink-0" />
                      {profile.location}
                    </p>
                    <div className="flex items-center gap-1.5 pt-1">
                      <GraduationCap size={16} className="text-homi-purple flex-shrink-0" />
                      <span className="text-sm">{profile.university}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Briefcase size={16} className="text-homi-purple flex-shrink-0" />
                      <span className="text-sm">{profile.occupation}</span>
                    </div>
                  </div>
                  
                  <div className="absolute top-6 right-6 flex flex-col gap-3">
                    <Link to="/profile/edit">
                      <Button variant="outline" size="sm" className="rounded-full bg-white/80 hover:bg-white">
                        {isMobile ? <Pencil size={16} /> : <><Pencil size={16} className="mr-2" />Editar Perfil</>}
                      </Button>
                    </Link>
                    {!isMobile && (
                      <div className="flex flex-col gap-2 mt-2">
                        <Button 
                          variant={liked ? "default" : "outline"} 
                          size="sm" 
                          className={`rounded-full ${liked ? 'bg-homi-purple hover:bg-homi-purple/90' : ''}`} 
                          onClick={handleLike}
                        >
                          <Heart size={18} className={liked ? 'mr-2 fill-white' : 'mr-2'} />
                          {liked ? 'Te gusta' : 'Me gusta'}
                        </Button>
                        <Button size="sm" className="rounded-full bg-homi-purple hover:bg-homi-purple/90" onClick={handleMessage}>
                          <MessageSquare size={18} className="mr-2" />
                          Mensaje
                        </Button>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="rounded-full flex-1" onClick={handleShare}>
                            <Share size={18} />
                          </Button>
                          <Button variant="outline" size="sm" className="rounded-full flex-1" onClick={() => setShowShareDialog(true)}>
                            <QrCode size={18} />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {isMobile && (
                  <div className="flex justify-between mt-6 pt-4 border-t border-gray-100">
                    <Button 
                      variant={liked ? "default" : "outline"} 
                      size="icon" 
                      className={`rounded-full ${liked ? 'bg-homi-purple hover:bg-homi-purple/90' : ''}`} 
                      onClick={handleLike}
                    >
                      <Heart size={18} className={liked ? 'fill-white' : ''} />
                    </Button>
                    <Button variant="outline" size="icon" className="rounded-full" onClick={handleShare}>
                      <Share size={18} />
                    </Button>
                    <Button variant="outline" size="icon" className="rounded-full" onClick={() => setShowShareDialog(true)}>
                      <QrCode size={18} />
                    </Button>
                    <Button size="icon" className="rounded-full bg-homi-purple hover:bg-homi-purple/90" onClick={handleMessage}>
                      <MessageSquare size={18} />
                    </Button>
                  </div>
                )}
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
                        <div className="absolute top-4 left-0 w-full flex justify-center z-10">
                          <div className="bg-white rounded-full px-6 py-2 shadow-lg">
                            <span className="text-homi-purple font-bold text-xl">homi</span>
                          </div>
                        </div>
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/90 to-purple-600/60 p-6 flex flex-col justify-end">
                          <div className="absolute top-16 right-0 max-w-[85%] z-20">
                            <div className="bg-gradient-to-r from-orange-500/90 to-pink-500/90 text-white font-bold py-2 px-4 shadow-lg rounded-l-full backdrop-blur-sm border-l-4 border-white/30">
                              <div className="flex items-center justify-end gap-2 text-sm">
                                <Search size={16} className="flex-shrink-0" strokeWidth={2.5} />
                                <span className="tracking-wide">¡Buscando compañero de piso!</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mb-8 flex items-center gap-3 mt-8">
                            <div className="w-20 h-20 rounded-full border-2 border-white overflow-hidden">
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
                              <p className="text-sm text-white/80 mt-1">{profile.location} · {profile.occupation}</p>
                            </div>
                          </div>
                          
                          <div className="mb-6">
                            <div className="flex flex-wrap gap-2 mb-4">
                              {profile.tags.slice(0, 3).map(tag => (
                                <span key={tag.id} className="px-3 py-1 text-xs rounded-full bg-white/20 text-white">
                                  {tag.name}
                                </span>
                              ))}
                            </div>
                            
                            <p className="text-white/90 text-sm line-clamp-2 mb-2">
                              {profile.bio}
                            </p>
                          </div>
                          
                          <div className="mb-6 text-white/90">
                            <h4 className="text-xs font-medium text-white/70 mb-3 flex items-center gap-1">
                              <Search size={12} />
                              Lo que estoy buscando:
                            </h4>
                            <div className="grid grid-cols-2 gap-x-3 gap-y-2.5 text-xs">
                              <div>
                                <span className="text-white/60">Presupuesto:</span>
                                <p className="mt-1">€{profile.lookingFor.budgetRange[0]} - €{profile.lookingFor.budgetRange[1]}</p>
                              </div>
                              <div>
                                <span className="text-white/60">Género:</span>
                                <p className="mt-1">
                                  {profile.lookingFor.genderPreference === 'mujeres' 
                                    ? 'Solo mujeres' 
                                    : profile.lookingFor.genderPreference === 'hombres' 
                                      ? 'Solo hombres' 
                                      : 'Cualquier género'}
                                </p>
                              </div>
                              <div>
                                <span className="text-white/60">Edad:</span>
                                <p className="mt-1">{profile.lookingFor.minAge} - {profile.lookingFor.maxAge} años</p>
                              </div>
                              <div>
                                <span className="text-white/60">Compañeros:</span>
                                <p className="mt-1">{profile.lookingFor.roommatesCount}</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center bg-white/10 p-3 rounded-lg backdrop-blur-sm mx-0 px-[12px] py-[12px] mb-12">
                            <div>
                              <h4 className="text-xs text-white/60 mb-1.5">Escanea para conectar</h4>
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
                  
                  {isEditingLookingFor ? (
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">¿Tienes apartamento?</label>
                        <div className="flex items-center">
                          <Switch 
                            checked={profile.lookingFor.hasApartment} 
                            onCheckedChange={(checked) => handleLookingForChange('hasApartment', checked)} 
                          />
                          <span className="ml-2 text-sm">
                            {profile.lookingFor.hasApartment ? 'Sí, tengo apartamento' : 'No, estoy buscando'}
                          </span>
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">Número de compañeros</label>
                        <Select
                          value={profile.lookingFor.roommatesCount}
                          onValueChange={(value) => handleLookingForChange('roommatesCount', value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecciona cuántos compañeros buscas" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 compañero</SelectItem>
                            <SelectItem value="2">2 compañeros</SelectItem>
                            <SelectItem value="3">3 compañeros</SelectItem>
                            <SelectItem value="4+">4 o más compañeros</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">Preferencia de género</label>
                        <Select
                          value={profile.lookingFor.genderPreference}
                          onValueChange={(value) => handleLookingForChange('genderPreference', value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecciona tu preferencia de género" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cualquiera">Sin preferencia</SelectItem>
                            <SelectItem value="mujeres">Solo mujeres</SelectItem>
                            <SelectItem value="hombres">Solo hombres</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">Preferencia de fumadores</label>
                        <Select
                          value={profile.lookingFor.smokingPreference}
                          onValueChange={(value) => handleLookingForChange('smokingPreference', value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecciona tu preferencia sobre fumar" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cualquiera">Sin preferencia</SelectItem>
                            <SelectItem value="no-fumadores">No fumadores</SelectItem>
                            <SelectItem value="fumadores">Fumadores</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">Preferencia de ocupación</label>
                        <Select
                          value={profile.lookingFor.occupationPreference}
                          onValueChange={(value) => handleLookingForChange('occupationPreference', value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecciona tu preferencia de ocupación" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cualquiera">Sin preferencia</SelectItem>
                            <SelectItem value="estudiantes">Estudiantes</SelectItem>
                            <SelectItem value="trabajadores">Trabajadores</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">Rango de presupuesto (€ al mes)</label>
                        <Slider
                          value={profile.lookingFor.budgetRange}
                          min={200}
                          max={1500}
                          step={50}
                          onValueChange={(value) => handleLookingForChange('budgetRange', value)}
                          className="my-6"
                        />
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>€{profile.lookingFor.budgetRange[0]}</span>
                          <span>€{profile.lookingFor.budgetRange[1]}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      {profile.lookingFor.hasApartment === false && 
                       profile.lookingFor.roommatesCount === "-" && 
                       profile.lookingFor.genderPreference === "-" && 
                       profile.lookingFor.smokingPreference === "-" && 
                       profile.lookingFor.occupationPreference === "-" ? (
                        <div className="p-4 text-center bg-gray-50 rounded-lg border border-gray-100">
                          <p className="text-sm text-muted-foreground">
                            No has configurado tus preferencias de búsqueda aún.
                          </p>
                          <Button onClick={handleEditLookingFor} variant="outline" size="sm" className="mt-3">
                            <Pencil size={14} className="mr-1.5" />
                            Configurar ahora
                          </Button>
                        </div>
                      ) : (
                        <dl className="space-y-3 text-sm">
                          <div>
                            <dt className="text-muted-foreground mb-1">¿Tienes apartamento?</dt>
                            <dd className="font-medium">
                              {profile.lookingFor.hasApartment ? 'Sí, tengo apartamento' : 'No, estoy buscando'}
                            </dd>
                          </div>
                          
                          {profile.lookingFor.roommatesCount !== "-" && (
                            <div>
                              <dt className="text-muted-foreground mb-1">Compañeros de piso</dt>
                              <dd className="font-medium">{profile.lookingFor.roommatesCount} compañeros</dd>
                            </div>
                          )}
                          
                          {profile.lookingFor.genderPreference !== "-" && (
                            <div>
                              <dt className="text-muted-foreground mb-1">Preferencia de género</dt>
                              <dd className="font-medium">
                                {profile.lookingFor.genderPreference === 'mujeres' 
                                  ? 'Solo mujeres' 
                                  : profile.lookingFor.genderPreference === 'hombres' 
                                    ? 'Solo hombres' 
                                    : 'Sin preferencia'}
                              </dd>
                            </div>
                          )}
                          
                          {profile.lookingFor.smokingPreference !== "-" && (
                            <div>
                              <dt className="text-muted-foreground mb-1">Fumadores</dt>
                              <dd className="font-medium">
                                {profile.lookingFor.smokingPreference === 'no-fumadores' 
                                  ? 'Prefiero no fumadores' 
                                  : profile.lookingFor.smokingPreference === 'fumadores' 
                                    ? 'Acepto fumadores' 
                                    : 'Sin preferencia'}
                              </dd>
                            </div>
                          )}
                          
                          {profile.lookingFor.occupationPreference !== "-" && (
                            <div>
                              <dt className="text-muted-foreground mb-1">Ocupación</dt>
                              <dd className="font-medium">
                                {profile.lookingFor.occupationPreference === 'estudiantes' 
                                  ? 'Preferiblemente estudiantes' 
                                  : profile.lookingFor.occupationPreference === 'trabajadores' 
                                    ? 'Preferiblemente trabajadores' 
                                    : 'Sin preferencia'}
                              </dd>
                            </div>
                          )}
                          
                          <div>
                            <dt className="text-muted-foreground mb-1">Presupuesto</dt>
                            <dd className="font-medium">€{profile.lookingFor.budgetRange[0]} - €{profile.lookingFor.budgetRange[1]} / mes</dd>
                          </div>
                        </dl>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Compartir perfil</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="flex justify-center mb-2">
              <div className="p-2 bg-white rounded-lg border" ref={qrCodeRef}>
                <QRCodeSVG value={getProfileUrl()} size={180} bgColor="#FFFFFF" fgColor="#6E59A5" />
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <Button onClick={handleCopyLink} className="bg-homi-purple hover:bg-homi-purple/90 w-full">
                Copiar enlace
              </Button>
              <Button onClick={handleDownloadQR} variant="outline" className="w-full">
                Descargar código QR
              </Button>
            </div>
            
            <div className="pt-2">
              <p className="text-sm font-medium mb-3">Compartir en redes sociales</p>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" onClick={() => shareToSocialMedia('whatsapp')} className="justify-start">
                  <span className="w-5 h-5 mr-2 text-green-500">
                    {/* WhatsApp icon would go here */}
                  </span>
                  WhatsApp
                </Button>
                <Button variant="outline" onClick={() => shareToSocialMedia('telegram')} className="justify-start">
                  <span className="w-5 h-5 mr-2 text-blue-500">
                    {/* Telegram icon would go here */}
                  </span>
                  Telegram
                </Button>
                <Button variant="outline" onClick={() => shareToSocialMedia('facebook')} className="justify-start">
                  <span className="w-5 h-5 mr-2 text-blue-700">
                    {/* Facebook icon would go here */}
                  </span>
                  Facebook
                </Button>
                <Button variant="outline" onClick={() => shareToSocialMedia('twitter')} className="justify-start">
                  <span className="w-5 h-5 mr-2 text-blue-400">
                    {/* Twitter icon would go here */}
                  </span>
                  Twitter
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfilePage;
