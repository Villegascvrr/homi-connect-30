
import React from 'react';
import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  MessageSquare, Share, Heart, Home, Briefcase, GraduationCap, UserCheck, 
  Pencil, Download, QrCode, Camera, ChevronLeft, ChevronRight, Search, 
  Check, X, DollarSign, Calendar, MapPin, Users, AtSign, Save 
} from 'lucide-react';
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
import { FormImageUpload } from "@/components/ui/form-image-upload";

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

// Zonas de Sevilla
const sevillaZones = [
  "Casco Antiguo",
  "Triana",
  "Los Remedios",
  "Nervión",
  "San Pablo - Santa Justa",
  "Este - Alcosa - Torreblanca",
  "Cerro - Amate",
  "Sur",
  "Bellavista - La Palmera",
  "Macarena",
  "Norte",
  "Otro/Alrededores"
];

// Número de compañeros options
const companeroOptions = ["1", "2", "3", "4", "5+"];

// Intereses predefinidos
const predefinedInterests = [
  "Deportes", "Música", "Cine", "Lectura", "Viajes", 
  "Cocina", "Arte", "Tecnología", "Fotografía", "Naturaleza",
  "Gaming", "Fitness", "Yoga", "Idiomas", "Historia",
  "Moda", "Voluntariado", "Mascotas", "Gastronomía", "Festivales"
];

const ProfilePage = () => {
  const [liked, setLiked] = useState(false);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showAddImageDialog, setShowAddImageDialog] = useState(false);
  const [newInterest, setNewInterest] = useState("");
  
  // Campos editables
  const [isEditingBasic, setIsEditingBasic] = useState(false);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [isEditingInterests, setIsEditingInterests] = useState(false);
  const [isEditingLifestyle, setIsEditingLifestyle] = useState(false);
  const [isEditingLookingFor, setIsEditingLookingFor] = useState(false);
  const [tempImageUrl, setTempImageUrl] = useState("");
  
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const qrCodeRef = useRef<HTMLDivElement>(null);
  const profileCardRef = useRef<HTMLDivElement>(null);
  const { user, refreshUser } = useAuth();
  
  const defaultProfile: ProfileData = {
    id: '1',
    name: 'Usuario',
    username: 'usuario',
    age: 0,
    location: '-',
    university: '-',
    occupation: '-',
    bio: '-',
    imgUrl: '',
    galleryImgs: [],
    tags: [],
    verified: false,
    preferences: {
      budget: '-',
      location: '-',
      roommates: '-',
      moveInDate: '-'
    },
    lifestyle: {
      cleanliness: '',
      guests: '',
      smoking: '',
      pets: '',
      schedule: ''
    },
    lookingFor: {
      hasApartment: false,
      roommatesCount: "",
      genderPreference: "",
      smokingPreference: "",
      occupationPreference: "",
      minAge: "",
      maxAge: "",
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
          cleanliness: '',
          guests: '',
          smoking: '',
          pets: '',
          schedule: ''
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
              cleanliness: typeof parsedLifestyle.cleanliness === 'string' ? parsedLifestyle.cleanliness : '',
              guests: typeof parsedLifestyle.guests === 'string' ? parsedLifestyle.guests : '',
              smoking: typeof parsedLifestyle.smoking === 'string' ? parsedLifestyle.smoking : '',
              pets: typeof parsedLifestyle.pets === 'string' ? parsedLifestyle.pets : '',
              schedule: typeof parsedLifestyle.schedule === 'string' ? parsedLifestyle.schedule : ''
            };
          }
        }
        
        console.log("Parsed lifestyle object:", lifestyleObj);
        
        const lookingForObj: LookingForPreferences = {
          hasApartment: profileData.hasApartment === true,
          roommatesCount: profileData.companeros_count || "",
          genderPreference: profileData.genderPreference || "",
          smokingPreference: profileData.smokingPreference || "",
          occupationPreference: profileData.occupationPreference || "",
          minAge: profileData.minAge || "",
          maxAge: profileData.maxAge || "",
          budgetRange: [400, 600],
          exactPrice: profileData.exactPrice || 0
        };
        
        const userProfile: ProfileData = {
          id: user.id,
          name: `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim() || 'Usuario',
          username: profileData.username || 'usuario',
          age: profileData.edad ? parseInt(profileData.edad) : 0,
          location: profileData.ubicacion || '',
          university: profileData.universidad || '',
          occupation: profileData.ocupacion || '',
          bio: profileData.bio || '',
          imgUrl: profileData.profile_image || '',
          galleryImgs: profileData.gallery_images?.length ? profileData.gallery_images : [],
          tags: Array.isArray(profileData.interests) ? profileData.interests.map((tag: string, index: number) => ({ id: index + 1, name: tag })) : [],
          verified: true,
          preferences: {
            budget: lookingForObj.exactPrice ? `€${lookingForObj.exactPrice}` : '',
            location: profileData.sevilla_zona || '',
            roommates: profileData.companeros_count || '',
            moveInDate: ''
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
    if (profile.galleryImgs.length > 0) {
      setActiveGalleryIndex(prevIndex => prevIndex === profile.galleryImgs.length - 1 ? 0 : prevIndex + 1);
    }
  };

  const handlePrevGalleryImage = () => {
    if (profile.galleryImgs.length > 0) {
      setActiveGalleryIndex(prevIndex => prevIndex === 0 ? profile.galleryImgs.length - 1 : prevIndex - 1);
    }
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

  // Funciones para la edición directa de perfil
  const handleSaveBasicInfo = async () => {
    if (!user) return;
    
    setIsSaving(true);
    
    try {
      const nameParts = profile.name.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      const updateData = {
        first_name: firstName,
        last_name: lastName,
        edad: profile.age.toString(),
        ubicacion: profile.location,
        universidad: profile.university,
        ocupacion: profile.occupation
      };
      
      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id);
        
      if (error) throw error;
      
      await refreshUser();
      
      setIsEditingBasic(false);
      
      toast({
        title: "Información básica actualizada",
        description: "Tus datos personales han sido guardados"
      });
    } catch (error: any) {
      console.error("Error saving basic info:", error);
      toast({
        title: "Error al guardar",
        description: error.message || "No se pudieron guardar los cambios",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleSaveBio = async () => {
    if (!user) return;
    
    setIsSaving(true);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ bio: profile.bio })
        .eq('id', user.id);
        
      if (error) throw error;
      
      setIsEditingBio(false);
      
      toast({
        title: "Biografía actualizada",
        description: "Tu biografía ha sido guardada correctamente"
      });
    } catch (error: any) {
      console.error("Error saving bio:", error);
      toast({
        title: "Error al guardar",
        description: error.message || "No se pudo guardar tu biografía",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleSaveLifestyle = async () => {
    if (!user) return;
    
    setIsSaving(true);
    
    try {
      const lifestyleObject: Record<string, string> = {
        cleanliness: profile.lifestyle.cleanliness || '',
        guests: profile.lifestyle.guests || '',
        smoking: profile.lifestyle.smoking || '',
        pets: profile.lifestyle.pets || '',
        schedule: profile.lifestyle.schedule || ''
      };
      
      const { error } = await supabase
        .from('profiles')
        .update({ lifestyle: lifestyleObject })
        .eq('id', user.id);
        
      if (error) throw error;
      
      setIsEditingLifestyle(false);
      
      toast({
        title: "Estilo de vida actualizado",
        description: "Tus preferencias de estilo de vida han sido guardadas"
      });
    } catch (error: any) {
      console.error("Error saving lifestyle:", error);
      toast({
        title: "Error al guardar",
        description: error.message || "No se pudieron guardar las preferencias",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveProfileImage = async (imageUrl: string) => {
    if (!user) return;
    
    setIsSaving(true);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ profile_image: imageUrl })
        .eq('id', user.id);
        
      if (error) throw error;
      
      setProfile(prev => ({
        ...prev,
        imgUrl: imageUrl
      }));
      
      await refreshUser();
      
      toast({
        title: "Imagen actualizada",
        description: "Tu foto de perfil ha sido actualizada correctamente"
      });
    } catch (error: any) {
      console.error("Error saving profile image:", error);
      toast({
        title: "Error al guardar",
        description: error.message || "No se pudo actualizar la imagen de perfil",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddToGallery = async (imageUrl: string) => {
    if (!user) return;
    
    setIsSaving(true);
    
    try {
      const newGallery = [...(profile.galleryImgs || []), imageUrl];
      
      const { error } = await supabase
        .from('profiles')
        .update({ gallery_images: newGallery })
        .eq('id', user.id);
        
      if (error) throw error;
      
      setProfile(prev => ({
        ...prev,
        galleryImgs: newGallery
      }));
      
      setShowAddImageDialog(false);
      setTempImageUrl("");
      
      toast({
        title: "Imagen añadida",
        description: "La imagen ha sido añadida a tu galería"
      });
    } catch (error: any) {
      console.error("Error adding gallery image:", error);
      toast({
        title: "Error al añadir imagen",
        description: error.message || "No se pudo añadir la imagen a la galería",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveGalleryImage = async (index: number) => {
    if (!user || profile.galleryImgs.length === 0) return;
    
    setIsSaving(true);
    
    try {
      const newGallery = [...profile.galleryImgs];
      newGallery.splice(index, 1);
      
      const { error } = await supabase
        .from('profiles')
        .update({ gallery_images: newGallery })
        .eq('id', user.id);
        
      if (error) throw error;
      
      setProfile(prev => ({
        ...prev,
        galleryImgs: newGallery
      }));
      
      if (activeGalleryIndex >= newGallery.length) {
        setActiveGalleryIndex(Math.max(0, newGallery.length - 1));
      }
      
      toast({
        title: "Imagen eliminada",
        description: "La imagen ha sido eliminada de tu galería"
      });
    } catch (error: any) {
      console.error("Error removing gallery image:", error);
      toast({
        title: "Error al eliminar imagen",
        description: error.message || "No se pudo eliminar la imagen de la galería",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleAddInterest = async () => {
    if (!user || !newInterest.trim()) return;
    
    const interestToAdd = newInterest.trim();
    
    // Check if interest already exists
    if (profile.tags.some(tag => tag.name.toLowerCase() === interestToAdd.toLowerCase())) {
      toast({
        title: "Interés ya existe",
        description: "Ya tienes este interés añadido en tu perfil",
        variant: "destructive"
      });
      return;
    }
    
    setIsSaving(true);
    
    try {
      const newTags = [...profile.tags, { id: profile.tags.length + 1, name: interestToAdd }];
      const interests = newTags.map(tag => tag.name);
      
      const { error } = await supabase
        .from('profiles')
        .update({ interests })
        .eq('id', user.id);
        
      if (error) throw error;
      
      setProfile(prev => ({
        ...prev,
        tags: newTags
      }));
      
      setNewInterest("");
      
      toast({
        title: "Interés añadido",
        description: `Se ha añadido "${interestToAdd}" a tus intereses`
      });
    } catch (error: any) {
      console.error("Error adding interest:", error);
      toast({
        title: "Error al añadir interés",
        description: error.message || "No se pudo añadir el interés",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleRemoveInterest = async (id: number) => {
    if (!user) return;
    
    setIsSaving(true);
    
    try {
      const newTags = profile.tags.filter(tag => tag.id !== id);
      const interests = newTags.map(tag => tag.name);
      
      const { error } = await supabase
        .from('profiles')
        .update({ interests })
        .eq('id', user.id);
        
      if (error) throw error;
      
      setProfile(prev => ({
        ...prev,
        tags: newTags
      }));
      
      toast({
        title: "Interés eliminado",
        description: "El interés ha sido eliminado de tu perfil"
      });
    } catch (error: any) {
      console.error("Error removing interest:", error);
      toast({
        title: "Error al eliminar interés",
        description: error.message || "No se pudo eliminar el interés",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleSelectPredefinedInterest = async (interest: string) => {
    if (!user) return;
    
    // Check if interest already exists
    if (profile.tags.some(tag => tag.name.toLowerCase() === interest.toLowerCase())) {
      toast({
        title: "Interés ya existe",
        description: "Ya tienes este interés añadido en tu perfil",
        variant: "destructive"
      });
      return;
    }
    
    setIsSaving(true);
    
    try {
      const newTags = [...profile.tags, { id: profile.tags.length + 1, name: interest }];
      const interests = newTags.map(tag => tag.name);
      
      const { error } = await supabase
        .from('profiles')
        .update({ interests })
        .eq('id', user.id);
        
      if (error) throw error;
      
      setProfile(prev => ({
        ...prev,
        tags: newTags
      }));
      
      toast({
        title: "Interés añadido",
        description: `Se ha añadido "${interest}" a tus intereses`
      });
    } catch (error: any) {
      console.error("Error adding interest:", error);
      toast({
        title: "Error al añadir interés",
        description: error.message || "No se pudo añadir el interés",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleSaveLookingFor = async () => {
    if (!user) return;
    
    setIsSaving(true);
    
    try {
      const lifestyleObject: Record<string, string> = {
        cleanliness: profile.lifestyle.cleanliness || '',
        guests: profile.lifestyle.guests || '',
        smoking: profile.lifestyle.smoking || '',
        pets: profile.lifestyle.pets || '',
        schedule: profile.lifestyle.schedule || ''
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
        sevilla_zona: profile.preferences.location,
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
    } finally {
      setIsSaving(false);
    }
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
  
  const handleLocationChange = (value: string) => {
    setProfile(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        location: value
      }
    }));
  };
  
  const handleLifestyleChange = (field: string, value: string) => {
    setProfile(prev => ({
      ...prev,
      lifestyle: {
        ...prev.lifestyle,
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
                    <div className="relative group">
                      <Avatar className={`${isMobile ? 'w-24 h-24' : 'w-32 h-32'} border-4 border-white shadow-lg cursor-pointer group-hover:opacity-80 transition-opacity`} onClick={() => document.getElementById('profile-image-input')?.click()}>
                        {profile.imgUrl ? (
                          <AvatarImage src={profile.imgUrl} alt={profile.name} />
                        ) : (
                          <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
                        )}
                      </Avatar>
                      
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-black/50 rounded-full p-2">
                          <Camera size={24} className="text-white" />
                        </div>
                      </div>
                      
                      <FormImageUpload
                        name="profileImage"
                        onChange={handleSaveProfileImage}
                        hideLabel
                      />
                    </div>
                    
                    {profile.verified && (
                      <div className="absolute bottom-0 right-0 bg-homi-purple text-white p-1 rounded-full">
                        <UserCheck size={isMobile ? 14 : 16} />
                      </div>
                    )}
                  </div>
                  
                  {isEditingBasic ? (
                    <div className="flex-grow space-y-3">
                      <Input
                        placeholder="Tu nombre"
                        value={profile.name}
                        onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                        className="mb-2"
                      />
                      
                      <div className="flex items-center gap-2 mb-2">
                        <AtSign size={16} className="text-homi-purple" />
                        <Input
                          placeholder="Nombre de usuario"
                          value={profile.username}
                          onChange={(e) => setProfile(prev => ({ ...prev, username: e.target.value }))}
                          className="flex-grow"
                        />
                      </div>
                      
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin size={16} className="text-homi-purple" />
                        <Input
                          placeholder="Ubicación"
                          value={profile.location}
                          onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
                          className="flex-grow"
                        />
                      </div>
                      
                      <div className="flex gap-3">
                        <div className="flex-1">
                          <label className="text-xs text-muted-foreground">Edad</label>
                          <Input
                            type="number"
                            placeholder="Edad"
                            value={profile.age || ''}
                            onChange={(e) => setProfile(prev => ({ ...prev, age: parseInt(e.target.value) || 0 }))}
                            className="mt-1"
                          />
                        </div>
                        
                        <div className="flex-1">
                          <label className="text-xs text-muted-foreground">Universidad</label>
                          <Input
                            placeholder="Universidad"
                            value={profile.university}
                            onChange={(e) => setProfile(prev => ({ ...prev, university: e.target.value }))}
                            className="mt-1"
                          />
                        </div>
                      </div>
                      
                      <div className="w-full">
                        <label className="text-xs text-muted-foreground">Ocupación</label>
                        <Input
                          placeholder="Ocupación"
                          value={profile.occupation}
                          onChange={(e) => setProfile(prev => ({ ...prev, occupation: e.target.value }))}
                          className="mt-1"
                        />
                      </div>
                      
                      <div className="flex justify-end gap-2 pt-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setIsEditingBasic(false)}
                          disabled={isSaving}
                        >
                          Cancelar
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={handleSaveBasicInfo} 
                          disabled={isSaving}
                        >
                          {isSaving ? "Guardando..." : "Guardar"}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-grow space-y-2">
                      <div className="flex justify-between items-start">
                        <h1 className="text-xl md:text-3xl font-bold flex items-center gap-2">
                          {profile.name || "Usuario"}{profile.age ? `, ${profile.age}` : ""}
                        </h1>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => setIsEditingBasic(true)} 
                          className="h-8 w-8"
                        >
                          <Pencil size={16} />
                        </Button>
                      </div>
                      
                      <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                        <AtSign size={16} className="text-homi-purple flex-shrink-0" />
                        {profile.username || "usuario"}
                      </p>
                      
                      <p className={`text-muted-foreground flex items-center gap-1.5 ${!profile.location ? "opacity-50 italic" : ""}`}>
                        <MapPin size={16} className="flex-shrink-0" />
                        {profile.location || "Añade tu ubicación"}
                      </p>
                      
                      <div className={`flex items-center gap-1.5 pt-1 ${!profile.university ? "opacity-50 italic" : ""}`}>
                        <GraduationCap size={16} className="text-homi-purple flex-shrink-0" />
                        <span className="text-sm">{profile.university || "Añade tu universidad"}</span>
                      </div>
                      
                      <div className={`flex items-center gap-1.5 ${!profile.occupation ? "opacity-50 italic" : ""}`}>
                        <Briefcase size={16} className="text-homi-purple flex-shrink-0" />
                        <span className="text-sm">{profile.occupation || "Añade tu ocupación"}</span>
                      </div>
                    </div>
                  )}
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
                {/* Sobre mí */}
                <div className="glass-card p-5 md:p-7">
                  <div className="flex justify-between items-center mb-4 md:mb-5">
                    <h2 className="text-lg md:text-xl font-semibold">Sobre mí</h2>
                    {!isEditingBio && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => setIsEditingBio(true)} 
                        className="h-8 w-8"
                      >
                        <Pencil size={16} />
                      </Button>
                    )}
                  </div>
                  
                  {isEditingBio ? (
                    <div className="space-y-4">
                      <Textarea 
                        placeholder="Cuéntanos sobre ti..."
                        value={profile.bio}
                        onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                        className="min-h-[100px]"
                      />
                      
                      <div className="flex justify-end gap-2 pt-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setIsEditingBio(false)}
                          disabled={isSaving}
                        >
                          Cancelar
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={handleSaveBio} 
                          disabled={isSaving}
                        >
                          {isSaving ? "Guardando..." : "Guardar"}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      {profile.bio ? (
                        <p className="text-sm md:text-base">{profile.bio}</p>
                      ) : (
                        <p className="text-sm md:text-base italic text-muted-foreground">
                          Añade una descripción sobre ti para que los demás usuarios te conozcan mejor.
                        </p>
                      )}
                    </div>
                  )}
                  
                  {/* Intereses */}
                  <div className="mt-5 md:mt-7">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-medium">Intereses</h3>
                      {!isEditingInterests && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => setIsEditingInterests(true)} 
                          className="h-7 w-7"
                        >
                          <Pencil size={14} />
                        </Button>
                      )}
                    </div>
                    
                    {isEditingInterests ? (
                      <div className="space-y-3">
                        <div className="flex flex-wrap gap-2 mb-2">
                          {profile.tags.length > 0 ? profile.tags.map(tag => (
                            <div key={tag.id} className="flex items-center px-2 md:px-3 py-1 text-xs md:text-sm rounded-full bg-homi-ultraLightPurple text-homi-purple">
                              {tag.name}
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => handleRemoveInterest(tag.id)} 
                                className="h-4 w-4 ml-1 hover:bg-homi-purple/20"
                              >
                                <X size={10} />
                              </Button>
                            </div>
                          )) : (
                            <p className="text-sm text-muted-foreground italic">
                              No has añadido intereses. Añádelos para conectar con personas afines.
                            </p>
                          )}
                        </div>
                        
                        <div className="flex gap-2">
                          <Input
                            placeholder="Añadir nuevo interés"
                            value={newInterest}
                            onChange={(e) => setNewInterest(e.target.value)}
                            className="flex-grow"
                          />
                          <Button 
                            variant="outline"
                            size="sm"
                            onClick={handleAddInterest}
                            disabled={!newInterest.trim() || isSaving}
                            className="whitespace-nowrap"
                          >
                            Añadir
                          </Button>
                        </div>
                        
                        <div className="pt-2">
                          <h4 className="text-xs font-medium text-muted-foreground mb-2">Intereses populares:</h4>
                          <div className="flex flex-wrap gap-1">
                            {predefinedInterests
                              .filter(interest => !profile.tags.some(tag => tag.name === interest))
                              .slice(0, 12)
                              .map((interest, index) => (
                                <Button
                                  key={index}
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleSelectPredefinedInterest(interest)}
                                  className="text-xs py-1 h-auto"
                                >
                                  {interest}
                                </Button>
                              ))}
                          </div>
                        </div>
                        
                        <div className="flex justify-end gap-2 pt-3">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setIsEditingInterests(false)}
                            disabled={isSaving}
                          >
                            Cancelar
                          </Button>
                          <Button 
                            size="sm" 
                            onClick={() => setIsEditingInterests(false)} 
                            disabled={isSaving}
                          >
                            Listo
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {profile.tags.length > 0 ? profile.tags.map(tag => (
                          <span key={tag.id} className="px-2 md:px-3 py-1 text-xs md:text-sm rounded-full bg-homi-ultraLightPurple text-homi-purple">
                            {tag.name}
                          </span>
                        )) : (
                          <p className="text-sm text-muted-foreground italic">
                            No has añadido intereses. Añádelos para conectar con personas afines.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Estilo de vida */}
                <div className="glass-card p-5 md:p-7">
                  <div className="flex justify-between items-center mb-4 md:mb-5">
                    <h2 className="text-lg md:text-xl font-semibold flex items-center gap-2">
                      <Home size={20} className="text-homi-purple" />
                      Estilo de vida
                    </h2>
                    {!isEditingLifestyle && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => setIsEditingLifestyle(true)} 
                        className="h-8 w-8"
                      >
                        <Pencil size={16} />
                      </Button>
                    )}
                  </div>
                  
                  {isEditingLifestyle ? (
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">Limpieza</label>
                        <Select
                          value={profile.lifestyle.cleanliness}
                          onValueChange={(value) => handleLifestyleChange('cleanliness', value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="¿Cómo eres con la limpieza?" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="muy-ordenado">Muy ordenado/a</SelectItem>
                            <SelectItem value="ordenado">Ordenado/a</SelectItem>
                            <SelectItem value="normal">Normal</SelectItem>
                            <SelectItem value="relajado">Relajado/a con la limpieza</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">Invitados</label>
                        <Select
                          value={profile.lifestyle.guests}
                          onValueChange={(value) => handleLifestyleChange('guests', value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="¿Cómo te sientes con los invitados?" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="frecuentes">Me gusta tener invitados frecuentemente</SelectItem>
                            <SelectItem value="ocasionales">Invitados ocasionales está bien</SelectItem>
                            <SelectItem value="pocos">Prefiero pocos invitados</SelectItem>
                            <SelectItem value="ninguno">Prefiero no tener invitados</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">Fumadores</label>
                        <Select
                          value={profile.lifestyle.smoking}
                          onValueChange={(value) => handleLifestyleChange('smoking', value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="¿Cómo te sientes con respecto a fumar?" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="fumador">Soy fumador/a</SelectItem>
                            <SelectItem value="fumo-ocasionalmente">Fumo ocasionalmente</SelectItem>
                            <SelectItem value="no-fumo">No fumo pero no me importa</SelectItem>
                            <SelectItem value="no-fumadores">Prefiero ambiente sin humo</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">Mascotas</label>
                        <Select
                          value={profile.lifestyle.pets}
                          onValueChange={(value) => handleLifestyleChange('pets', value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="¿Tienes o te gustan las mascotas?" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="tengo-mascota">Tengo mascota</SelectItem>
                            <SelectItem value="me-encantan">Me encantan las mascotas</SelectItem>
                            <SelectItem value="no-tengo">No tengo pero me gustan</SelectItem>
                            <SelectItem value="prefiero-sin">Prefiero vivir sin mascotas</SelectItem>
                            <SelectItem value="alergia">Tengo alergia a las mascotas</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">Horarios</label>
                        <Select
                          value={profile.lifestyle.schedule}
                          onValueChange={(value) => handleLifestyleChange('schedule', value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="¿Cuáles son tus horarios habituales?" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="madrugador">Madrugador/a</SelectItem>
                            <SelectItem value="nocturno">Nocturno/a</SelectItem>
                            <SelectItem value="variable">Horarios variables</SelectItem>
                            <SelectItem value="regular">Horarios regulares</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex justify-end gap-2 pt-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setIsEditingLifestyle(false)}
                          disabled={isSaving}
                        >
                          Cancelar
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={handleSaveLifestyle} 
                          disabled={isSaving}
                        >
                          {isSaving ? "Guardando..." : "Guardar"}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <dl className="space-y-3 text-sm">
                      <div>
                        <dt className="text-muted-foreground mb-1">Limpieza</dt>
                        <dd className={`font-medium ${!profile.lifestyle.cleanliness ? "italic text-muted-foreground" : ""}`}>
                          {profile.lifestyle.cleanliness ? (
                            profile.lifestyle.cleanliness === 'muy-ordenado' ? 'Muy ordenado/a' :
                            profile.lifestyle.cleanliness === 'ordenado' ? 'Ordenado/a' :
                            profile.lifestyle.cleanliness === 'normal' ? 'Normal' :
                            profile.lifestyle.cleanliness === 'relajado' ? 'Relajado/a con la limpieza' : ''
                          ) : "Por definir"}
                        </dd>
                      </div>
                      
                      <div>
                        <dt className="text-muted-foreground mb-1">Invitados</dt>
                        <dd className={`font-medium ${!profile.lifestyle.guests ? "italic text-muted-foreground" : ""}`}>
                          {profile.lifestyle.guests ? (
                            profile.lifestyle.guests === 'frecuentes' ? 'Me gusta tener invitados frecuentemente' :
                            profile.lifestyle.guests === 'ocasionales' ? 'Invitados ocasionales está bien' :
                            profile.lifestyle.guests === 'pocos' ? 'Prefiero pocos invitados' :
                            profile.lifestyle.guests === 'ninguno' ? 'Prefiero no tener invitados' : ''
                          ) : "Por definir"}
                        </dd>
                      </div>
                      
                      <div>
                        <dt className="text-muted-foreground mb-1">Fumadores</dt>
                        <dd className={`font-medium ${!profile.lifestyle.smoking ? "italic text-muted-foreground" : ""}`}>
                          {profile.lifestyle.smoking ? (
                            profile.lifestyle.smoking === 'fumador' ? 'Soy fumador/a' :
                            profile.lifestyle.smoking === 'fumo-ocasionalmente' ? 'Fumo ocasionalmente' :
                            profile.lifestyle.smoking === 'no-fumo' ? 'No fumo pero no me importa' :
                            profile.lifestyle.smoking === 'no-fumadores' ? 'Prefiero ambiente sin humo' : ''
                          ) : "Por definir"}
                        </dd>
                      </div>
                      
                      <div>
                        <dt className="text-muted-foreground mb-1">Mascotas</dt>
                        <dd className={`font-medium ${!profile.lifestyle.pets ? "italic text-muted-foreground" : ""}`}>
                          {profile.lifestyle.pets ? (
                            profile.lifestyle.pets === 'tengo-mascota' ? 'Tengo mascota' :
                            profile.lifestyle.pets === 'me-encantan' ? 'Me encantan las mascotas' :
                            profile.lifestyle.pets === 'no-tengo' ? 'No tengo pero me gustan' :
                            profile.lifestyle.pets === 'prefiero-sin' ? 'Prefiero vivir sin mascotas' :
                            profile.lifestyle.pets === 'alergia' ? 'Tengo alergia a las mascotas' : ''
                          ) : "Por definir"}
                        </dd>
                      </div>
                      
                      <div>
                        <dt className="text-muted-foreground mb-1">Horarios</dt>
                        <dd className={`font-medium ${!profile.lifestyle.schedule ? "italic text-muted-foreground" : ""}`}>
                          {profile.lifestyle.schedule ? (
                            profile.lifestyle.schedule === 'madrugador' ? 'Madrugador/a' :
                            profile.lifestyle.schedule === 'nocturno' ? 'Nocturno/a' :
                            profile.lifestyle.schedule === 'variable' ? 'Horarios variables' :
                            profile.lifestyle.schedule === 'regular' ? 'Horarios regulares' : ''
                          ) : "Por definir"}
                        </dd>
                      </div>
                    </dl>
                  )}
                </div>
                
                {/* Galería */}
                <div className="glass-card p-5 md:p-7">
                  <div className="flex justify-between items-center mb-4 md:mb-5">
                    <h2 className="text-lg md:text-xl font-semibold">Galería</h2>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowAddImageDialog(true)}
                      className="rounded-full flex items-center gap-2"
                    >
                      <Camera size={16} />
                      <span className="hidden sm:inline">Añadir imagen</span>
                    </Button>
                  </div>
                  
                  {isMobile ? (
                    profile.galleryImgs.length > 0 ? (
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
                        
                        <div className="absolute top-2 right-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleRemoveGalleryImage(activeGalleryIndex)}
                            className="h-8 w-8 rounded-full bg-white/80"
                          >
                            <X size={16} />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center p-8 border border-dashed rounded-lg">
                        <Camera size={40} className="mx-auto mb-2 text-muted-foreground" />
                        <p className="text-muted-foreground">Añade fotos a tu galería para mostrar más sobre ti</p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowAddImageDialog(true)}
                          className="mt-4"
                        >
                          Subir imagen
                        </Button>
                      </div>
                    )
                  ) : (
                    <div className="grid grid-cols-3 gap-4">
                      {profile.galleryImgs.map((img, index) => (
                        <div key={index} className="aspect-square rounded-lg overflow-hidden bg-muted relative group">
                          <img 
                            src={img} 
                            alt={`Imagen ${index + 1}`} 
                            className="w-full h-full object-cover transition-transform hover:scale-105" 
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleRemoveGalleryImage(index)}
                              className="h-8 w-8 rounded-full bg-white/80"
                            >
                              <X size={16} />
                            </Button>
                          </div>
                        </div>
                      ))}
                      
                      {profile.galleryImgs.length === 0 && (
                        <div className="col-span-3 text-center p-12 border border-dashed rounded-lg">
                          <Camera size={48} className="mx-auto mb-3 text-muted-foreground" />
                          <p className="text-muted-foreground mb-2">Añade fotos a tu galería para mostrar más sobre ti</p>
                          <Button
                            variant="outline"
                            onClick={() => setShowAddImageDialog(true)}
                          >
                            Subir imágenes
                          </Button>
                        </div>
                      )}
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
                              {profile.imgUrl ? (
                                <img src={profile.imgUrl} alt={profile.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-purple-400 text-white text-2xl font-bold">
                                  {profile.name.charAt(0)}
                                </div>
                              )}
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-white flex items-center gap-1">
                                {profile.name}, {profile.age || "?"}
                                {profile.verified && (
                                  <div className="bg-white text-purple-600 p-0.5 rounded-full">
                                    <UserCheck size={14} />
                                  </div>
                                )}
                              </h3>
                              <p className="text-sm text-white/80 mt-1">{profile.location || "Sin ubicación"} · {profile.occupation || "Sin ocupación"}</p>
                            </div>
                          </div>
                          
                          <div className="mb-6">
                            <div className="flex flex-wrap gap-2 mb-4">
                              {profile.tags.slice(0, 3).map(tag => (
                                <span key={tag.id} className="px-3 py-1 text-xs rounded-full bg-white/20 text-white">
                                  {tag.name}
                                </span>
                              ))}
                              {profile.tags.length === 0 && (
                                <span className="px-3 py-1 text-xs rounded-full bg-white/20 text-white">
                                  Sin intereses
                                </span>
                              )}
                            </div>
                            
                            <p className="text-white/90 text-sm line-clamp-2 mb-2">
                              {profile.bio || "Sin descripción"}
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
                                <p className="mt-1">{profile.lookingFor.minAge || "?"} - {profile.lookingFor.maxAge || "?"} años</p>
                              </div>
                              <div>
                                <span className="text-white/60">Compañeros:</span>
                                <p className="mt-1">{profile.lookingFor.roommatesCount || "No definido"}</p>
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
                    
                    {!isEditingLookingFor && (
                      <Button variant="ghost" size="icon" onClick={() => setIsEditingLookingFor(true)} className="h-8 w-8">
                        <Pencil size={15} />
                      </Button>
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
                        <label className="text-sm font-medium mb-1.5 block">Zona en Sevilla</label>
                        <Select
                          value={profile.preferences.location}
                          onValueChange={handleLocationChange}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecciona una zona de Sevilla" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="no_busco">No estoy buscando en Sevilla</SelectItem>
                            {sevillaZones.map((zone) => (
                              <SelectItem key={zone} value={zone}>{zone}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium mb-1.5 block">Edad mínima</label>
                          <Input 
                            type="number" 
                            placeholder="Edad mínima" 
                            value={profile.lookingFor.minAge || ''} 
                            onChange={(e) => handleLookingForChange('minAge', e.target.value)} 
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-1.5 block">Edad máxima</label>
                          <Input 
                            type="number" 
                            placeholder="Edad máxima" 
                            value={profile.lookingFor.maxAge || ''} 
                            onChange={(e) => handleLookingForChange('maxAge', e.target.value)} 
                          />
                        </div>
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
                      
                      <div className="flex justify-end gap-2 pt-4">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setIsEditingLookingFor(false)}
                          disabled={isSaving}
                        >
                          Cancelar
                        </Button>
                        <Button 
                          className="bg-homi-purple hover:bg-homi-purple/90" 
                          size="sm" 
                          onClick={handleSaveLookingFor} 
                          disabled={isSaving}
                        >
                          {isSaving ? "Guardando..." : (
                            <>
                              <Save size={14} className="mr-1" /> Guardar
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      {!profile.lookingFor.hasApartment && 
                       profile.lookingFor.roommatesCount === "" && 
                       profile.lookingFor.genderPreference === "" && 
                       profile.lookingFor.smokingPreference === "" && 
                       profile.lookingFor.occupationPreference === "" &&
                       profile.preferences.location === "" ? (
                        <div className="p-4 text-center bg-gray-50 rounded-lg border border-gray-100">
                          <p className="text-sm text-muted-foreground">
                            No has configurado tus preferencias de búsqueda aún.
                          </p>
                          <Button onClick={() => setIsEditingLookingFor(true)} variant="outline" size="sm" className="mt-3">
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
                          
                          {profile.preferences.location && profile.preferences.location !== 'no_busco' && (
                            <div>
                              <dt className="text-muted-foreground mb-1">Zona en Sevilla</dt>
                              <dd className="font-medium">{profile.preferences.location}</dd>
                            </div>
                          )}
                          
                          {profile.lookingFor.roommatesCount && (
                            <div>
                              <dt className="text-muted-foreground mb-1">Compañeros de piso</dt>
                              <dd className="font-medium">{profile.lookingFor.roommatesCount} compañeros</dd>
                            </div>
                          )}
                          
                          {profile.lookingFor.genderPreference && (
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
                          
                          {profile.lookingFor.smokingPreference && (
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
                          
                          {profile.lookingFor.occupationPreference && (
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
                          
                          {(profile.lookingFor.minAge || profile.lookingFor.maxAge) && (
                            <div>
                              <dt className="text-muted-foreground mb-1">Rango de edad</dt>
                              <dd className="font-medium">
                                {profile.lookingFor.minAge || "?"} - {profile.lookingFor.maxAge || "?"} años
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
      
      {/* Dialogs y Drawers */}
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
      
      <Dialog open={showAddImageDialog} onOpenChange={setShowAddImageDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Añadir imagen a la galería</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <FormImageUpload
              name="galleryImage"
              label="Imagen para la galería"
              description="Añade una imagen a tu galería para mostrar más sobre ti"
              onChange={(url) => handleAddToGallery(url)}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfilePage;

