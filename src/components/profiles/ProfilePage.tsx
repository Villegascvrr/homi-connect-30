
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
import { ensureImageString, ensureImageArray } from "@/utils/image-helpers";

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
  const { user } = useAuth();
  const { toast } = useToast();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingProfile, setEditingProfile] = useState(false);
  const [editingPreferences, setEditingPreferences] = useState(false);
  const [editingLifestyle, setEditingLifestyle] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [imageUploading, setImageUploading] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const qrCodeRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  // Form states for editing
  const [name, setName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [university, setUniversity] = useState<string>("");
  const [occupation, setOccupation] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [sevillaZona, setSevillaZona] = useState<string>("");
  const [companeros, setCompaneros] = useState<string>("");
  
  // Lifestyle states
  const [lifestyleCleaniness, setLifestyleCleaniness] = useState<string>("Normal");
  const [lifestyleGuests, setLifestyleGuests] = useState<string>("Ocasionalmente");
  const [lifestyleSmoking, setLifestyleSmoking] = useState<string>("No permitido");
  const [lifestylePets, setLifestylePets] = useState<string>("No permitido");
  const [lifestyleSchedule, setLifestyleSchedule] = useState<string>("Normal");

  // Preferences states
  const [budget, setBudget] = useState<string>("300€ - 500€");
  const [moveInDate, setMoveInDate] = useState<string>("Lo antes posible");
    
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        
        if (!user) {
          setLoading(false);
          return;
        }
        
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (error) {
          console.error('Error fetching profile:', error);
          setLoading(false);
          return;
        }
        
        console.log("Raw profile data from Supabase:", data);
        
        if (data) {
          // Parse lifestyle from JSON if exists
          let lifestyleData: any = {};
          
          if (data.lifestyle) {
            if (typeof data.lifestyle === 'string') {
              try {
                lifestyleData = JSON.parse(data.lifestyle);
              } catch (e) {
                console.error('Error parsing lifestyle JSON:', e);
              }
            } else {
              lifestyleData = data.lifestyle;
            }
          }
          
          // Set individual form states from data
          setName(`${data.first_name || ''} ${data.last_name || ''}`.trim());
          setUsername(data.username || '');
          setAge(data.edad || '');
          setLocation(data.ubicacion || '');
          setUniversity(data.universidad || '');
          setOccupation(data.ocupacion || '');
          setBio(data.bio || '');
          setSevillaZona(data.sevilla_zona || '');
          setCompaneros(data.companeros_count || '');
          
          // Set lifestyle states
          setLifestyleCleaniness(lifestyleData?.cleanliness || "Normal");
          setLifestyleGuests(lifestyleData?.guests || "Ocasionalmente");
          setLifestyleSmoking(lifestyleData?.smoking || "No permitido");
          setLifestylePets(lifestyleData?.pets || "No permitido");
          setLifestyleSchedule(lifestyleData?.schedule || "Normal");
          
          // Set preferences states
          setBudget(lifestyleData?.preferences?.budget || "300€ - 500€");
          setMoveInDate(lifestyleData?.preferences?.moveInDate || "Lo antes posible");
          
          // Set selected interests
          setSelectedInterests(data.interests || []);
          
          // Format data for the profile display
          const formattedProfile = {
            id: data.id,
            name: `${data.first_name || ''} ${data.last_name || ''}`.trim(),
            username: data.username || '',
            age: parseInt(data.edad || '0', 10) || 0,
            location: data.ubicacion || 'No especificado',
            university: data.universidad || 'No especificado',
            occupation: data.ocupacion || 'No especificado',
            bio: data.bio || 'Sin descripción disponible',
            imgUrl: data.profile_image || 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7',
            galleryImgs: ensureImageArray(data.gallery_images || []),
            tags: data.interests ? data.interests.map((interest: string, index: number) => ({
              id: index + 1,
              name: interest
            })) : [],
            verified: true,
            preferences: {
              budget: lifestyleData?.preferences?.budget || "300€ - 500€",
              location: data.sevilla_zona || 'No especificado',
              roommates: data.companeros_count || 'No especificado',
              moveInDate: lifestyleData?.preferences?.moveInDate || "Lo antes posible"
            },
            lifestyle: {
              cleanliness: lifestyleData?.cleanliness || "Normal",
              guests: lifestyleData?.guests || "Ocasionalmente",
              smoking: lifestyleData?.smoking || "No permitido",
              pets: lifestyleData?.pets || "No permitido",
              schedule: lifestyleData?.schedule || "Normal"
            },
            lookingFor: {
              hasApartment: false,
              roommatesCount: data.companeros_count || "1",
              genderPreference: "Cualquiera",
              smokingPreference: "No",
              occupationPreference: "Cualquiera",
              minAge: "18",
              maxAge: "40",
              budgetRange: [300, 500],
              exactPrice: 400
            }
          };
          
          console.log("Formatted profile:", formattedProfile);
          setProfileData(formattedProfile);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error in fetchProfile:', error);
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [user]);

  const handleSaveProfile = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "Debes iniciar sesión para guardar tu perfil",
        variant: "destructive",
      });
      return;
    }

    try {
      // Split name into first_name and last_name
      const nameParts = name.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      // Create lifestyle object
      const lifestyle = {
        cleanliness: lifestyleCleaniness,
        guests: lifestyleGuests,
        smoking: lifestyleSmoking,
        pets: lifestylePets,
        schedule: lifestyleSchedule,
        preferences: {
          budget: budget,
          moveInDate: moveInDate
        }
      };

      // Update profile in Supabase
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: firstName,
          last_name: lastName,
          username: username,
          edad: age,
          ubicacion: location,
          universidad: university,
          ocupacion: occupation,
          bio: bio,
          sevilla_zona: sevillaZona,
          companeros_count: companeros,
          interests: selectedInterests,
          lifestyle: lifestyle
        })
        .eq('id', user.id);

      if (error) {
        console.error('Error updating profile:', error);
        toast({
          title: "Error",
          description: "No se pudo guardar el perfil",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Perfil actualizado",
        description: "Tu perfil ha sido actualizado correctamente",
      });

      // Refresh profile data
      if (editingProfile) setEditingProfile(false);
      if (editingPreferences) setEditingPreferences(false);
      if (editingLifestyle) setEditingLifestyle(false);

      // Update local profile data
      if (profileData) {
        setProfileData({
          ...profileData,
          name: name,
          username: username,
          age: parseInt(age || '0', 10) || 0,
          location: location || 'No especificado',
          university: university || 'No especificado',
          occupation: occupation || 'No especificado',
          bio: bio || 'Sin descripción disponible',
          tags: selectedInterests.map((interest, index) => ({
            id: index + 1,
            name: interest
          })),
          preferences: {
            ...profileData.preferences,
            budget: budget,
            location: sevillaZona || 'No especificado',
            roommates: companeros || 'No especificado',
            moveInDate: moveInDate
          },
          lifestyle: {
            cleanliness: lifestyleCleaniness,
            guests: lifestyleGuests,
            smoking: lifestyleSmoking,
            pets: lifestylePets,
            schedule: lifestyleSchedule
          }
        });
      }
    } catch (error) {
      console.error('Error in handleSaveProfile:', error);
      toast({
        title: "Error",
        description: "Ha ocurrido un error al guardar el perfil",
        variant: "destructive",
      });
    }
  };

  const handleSaveProfileImage = async (value: string | string[]) => {
    if (!user) return;
    
    try {
      setImageUploading(true);
      
      // Ensure we're working with a string (not an array)
      const imageUrl = ensureImageString(value);
      
      // Update profile in Supabase
      const { error } = await supabase
        .from('profiles')
        .update({ profile_image: imageUrl })
        .eq('id', user.id);
      
      if (error) {
        console.error('Error updating profile image:', error);
        toast({
          title: "Error",
          description: "No se pudo actualizar la foto de perfil",
          variant: "destructive",
        });
        return;
      }
      
      toast({
        title: "Foto actualizada",
        description: "Tu foto de perfil ha sido actualizada correctamente",
      });
      
      // Update local state
      if (profileData) {
        setProfileData({
          ...profileData,
          imgUrl: imageUrl
        });
      }
    } catch (error) {
      console.error('Error in handleSaveProfileImage:', error);
      toast({
        title: "Error",
        description: "Ha ocurrido un error al actualizar la foto de perfil",
        variant: "destructive",
      });
    } finally {
      setImageUploading(false);
    }
  };

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const downloadQR = async () => {
    if (qrCodeRef.current) {
      try {
        const canvas = await html2canvas(qrCodeRef.current);
        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `homi-qr-${profileData?.username || 'perfil'}.png`;
        link.click();
        
        toast({
          title: "QR descargado",
          description: "El código QR ha sido descargado correctamente",
        });
      } catch (error) {
        console.error('Error downloading QR code:', error);
        toast({
          title: "Error",
          description: "No se pudo descargar el código QR",
          variant: "destructive",
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-pulse">
            <div className="h-8 w-64 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 w-44 bg-gray-200 rounded"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Acceso denegado</h1>
            <p className="text-muted-foreground mb-6">Debes iniciar sesión para ver tu perfil.</p>
            <Link to="/signin">
              <Button>Iniciar sesión</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Perfil no encontrado</h1>
            <p className="text-muted-foreground mb-6">Parece que aún no tienes un perfil. ¿Quieres crear uno?</p>
            <Link to="/profile/create">
              <Button>Crear perfil</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-20 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Profile Header */}
            <div className="glass-card overflow-hidden">
              <div className="relative h-64 bg-homi-ultraLightPurple">
                <img
                  src={profileData.imgUrl}
                  alt={profileData.name}
                  className="w-full h-full object-cover"
                />
                
                <div className="absolute top-4 right-4 flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="secondary" size="sm" className="rounded-full">
                        <QrCode size={18} />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Tu código QR de Homi</DialogTitle>
                      </DialogHeader>
                      <div className="flex flex-col items-center justify-center py-6">
                        <div 
                          ref={qrCodeRef} 
                          className="p-6 bg-white rounded-xl shadow-sm"
                        >
                          <QRCodeSVG 
                            value={`${window.location.origin}/profile/${profileData.id}`} 
                            size={200} 
                          />
                        </div>
                        <p className="text-sm text-muted-foreground mt-4 mb-6 text-center">
                          Comparte tu código QR para conectar rápidamente con otros usuarios.
                        </p>
                        <Button onClick={downloadQR}>
                          <Download size={18} className="mr-2" />
                          Descargar QR
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  <Button 
                    variant="secondary" 
                    size="sm"
                    className="rounded-full"
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: `Perfil de ${profileData.name} en Homi`,
                          text: `¡Echa un vistazo a mi perfil en Homi!`,
                          url: `${window.location.origin}/profile/${profileData.id}`,
                        })
                        .catch(error => console.log('Error sharing', error));
                      } else {
                        navigator.clipboard.writeText(`${window.location.origin}/profile/${profileData.id}`);
                        toast({
                          title: "Enlace copiado",
                          description: "El enlace a tu perfil ha sido copiado al portapapeles",
                        });
                      }
                    }}
                  >
                    <Share size={18} />
                  </Button>
                </div>
              </div>
              
              <div className="relative px-6 py-8">
                <div className="absolute -top-16 left-6">
                  <div className="relative w-32 h-32">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                      <img
                        src={profileData.imgUrl}
                        alt={profileData.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute bottom-0 right-0">
                      <FormImageUpload 
                        name="profileImage"
                        hideLabel
                        multiple={false}
                        onChange={handleSaveProfileImage}
                        className="bg-white rounded-full shadow-md p-1"
                      />
                    </div>
                    {profileData.verified && (
                      <div className="absolute bottom-0 left-0 bg-homi-purple text-white p-1 rounded-full">
                        <UserCheck size={16} />
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="ml-36">
                  {!editingProfile ? (
                    <div className="flex justify-between">
                      <div>
                        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                          {profileData.name}{profileData.age ? `, ${profileData.age}` : ''}
                        </h1>
                        
                        {profileData.username && (
                          <p className="text-muted-foreground flex items-center gap-1 mt-1">
                            <AtSign size={16} className="text-homi-purple" />
                            <span className="font-medium">{profileData.username}</span>
                          </p>
                        )}
                        
                        {profileData.location && profileData.location !== 'No especificado' && (
                          <p className="text-muted-foreground flex items-center gap-1 mt-1">
                            <Home size={16} />
                            {profileData.location}
                          </p>
                        )}
                      </div>
                      <Button 
                        onClick={() => setEditingProfile(true)}
                        variant="outline" 
                        size="sm" 
                        className="h-9"
                      >
                        <Pencil size={16} className="mr-2" />
                        Editar perfil
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium mb-1">
                            Nombre completo
                          </label>
                          <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Tu nombre completo"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="username" className="block text-sm font-medium mb-1">
                            Nombre de usuario
                          </label>
                          <Input
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Tu nombre de usuario"
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="age" className="block text-sm font-medium mb-1">
                              Edad
                            </label>
                            <Input
                              id="age"
                              type="number"
                              value={age}
                              onChange={(e) => setAge(e.target.value)}
                              placeholder="Tu edad"
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="location" className="block text-sm font-medium mb-1">
                              Ubicación
                            </label>
                            <Input
                              id="location"
                              value={location}
                              onChange={(e) => setLocation(e.target.value)}
                              placeholder="Tu ubicación"
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="university" className="block text-sm font-medium mb-1">
                              Universidad
                            </label>
                            <Input
                              id="university"
                              value={university}
                              onChange={(e) => setUniversity(e.target.value)}
                              placeholder="Tu universidad"
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="occupation" className="block text-sm font-medium mb-1">
                              Ocupación
                            </label>
                            <Input
                              id="occupation"
                              value={occupation}
                              onChange={(e) => setOccupation(e.target.value)}
                              placeholder="Tu ocupación"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-end mt-4 gap-2">
                        <Button 
                          variant="outline" 
                          onClick={() => setEditingProfile(false)}
                        >
                          Cancelar
                        </Button>
                        <Button onClick={handleSaveProfile}>
                          <Save size={16} className="mr-2" />
                          Guardar cambios
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              {/* Left Column */}
              <div className="md:col-span-2 space-y-6">
                {/* Bio Section */}
                <div className="glass-card p-6">
                  {!editingProfile ? (
                    <>
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Sobre mí</h2>
                        <Button 
                          onClick={() => setEditingProfile(true)}
                          variant="ghost" 
                          size="sm"
                        >
                          <Pencil size={16} className="mr-2" />
                          Editar
                        </Button>
                      </div>
                      <p>{profileData.bio}</p>
                      
                      <div className="mt-6">
                        <h3 className="font-medium mb-2">Datos personales</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {profileData.university && profileData.university !== 'No especificado' && (
                            <div className="flex items-center gap-2">
                              <GraduationCap size={18} className="text-homi-purple" />
                              <span>{profileData.university}</span>
                            </div>
                          )}
                          {profileData.occupation && profileData.occupation !== 'No especificado' && (
                            <div className="flex items-center gap-2">
                              <Briefcase size={18} className="text-homi-purple" />
                              <span>{profileData.occupation}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <h2 className="text-xl font-semibold mb-4">Sobre mí</h2>
                      <div>
                        <label htmlFor="bio" className="block text-sm font-medium mb-1">
                          Biografía
                        </label>
                        <Textarea
                          id="bio"
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          placeholder="Escribe algo sobre ti..."
                          className="min-h-[120px]"
                        />
                      </div>
                    </>
                  )}
                </div>

                {/* Interests Section */}
                <div className="glass-card p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Intereses</h2>
                    <Button 
                      onClick={() => setEditingProfile(!editingProfile)}
                      variant="ghost" 
                      size="sm"
                    >
                      <Pencil size={16} className="mr-2" />
                      Editar
                    </Button>
                  </div>
                  
                  {!editingProfile ? (
                    <div className="flex flex-wrap gap-2">
                      {profileData.tags.map((tag) => (
                        <span 
                          key={tag.id} 
                          className="px-3 py-1 text-sm rounded-full bg-homi-ultraLightPurple text-homi-purple"
                        >
                          {tag.name}
                        </span>
                      ))}
                      {profileData.tags.length === 0 && (
                        <p className="text-muted-foreground">No has añadido intereses todavía.</p>
                      )}
                    </div>
                  ) : (
                    <div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {selectedInterests.map((interest) => (
                          <span 
                            key={interest} 
                            className="px-3 py-1 text-sm rounded-full bg-homi-purple text-white flex items-center gap-1"
                          >
                            {interest}
                            <button 
                              onClick={() => toggleInterest(interest)}
                              className="w-4 h-4 rounded-full bg-white text-homi-purple flex items-center justify-center"
                            >
                              <X size={10} />
                            </button>
                          </span>
                        ))}
                      </div>
                      
                      <div className="mt-4">
                        <p className="text-sm font-medium mb-2">Intereses populares:</p>
                        <div className="flex flex-wrap gap-2">
                          {predefinedInterests.filter(interest => !selectedInterests.includes(interest)).map((interest) => (
                            <button
                              key={interest}
                              onClick={() => toggleInterest(interest)}
                              className="px-3 py-1 text-sm rounded-full border border-muted-foreground/30 hover:bg-homi-ultraLightPurple hover:text-homi-purple transition-colors"
                            >
                              {interest}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Right Column */}
              <div className="space-y-6">
                {/* Preferences Section */}
                <div className="glass-card p-6">
                  {!editingPreferences ? (
                    <>
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Preferencias de vivienda</h2>
                        <Button 
                          onClick={() => setEditingPreferences(true)}
                          variant="ghost" 
                          size="sm"
                        >
                          <Pencil size={16} className="mr-2" />
                          Editar
                        </Button>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <span className="text-sm text-muted-foreground">Presupuesto:</span>
                          <p className="font-medium">{profileData.preferences.budget}</p>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">Zona de Sevilla:</span>
                          <p className="font-medium">{profileData.preferences.location}</p>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">Compañeros:</span>
                          <p className="font-medium">{profileData.preferences.roommates}</p>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">Fecha de mudanza:</span>
                          <p className="font-medium">{profileData.preferences.moveInDate}</p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <h2 className="text-xl font-semibold mb-4">Preferencias de vivienda</h2>
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="budget" className="block text-sm font-medium mb-1">
                            Presupuesto mensual
                          </label>
                          <Select value={budget} onValueChange={setBudget}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona tu presupuesto" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Menos de 300€">Menos de 300€</SelectItem>
                              <SelectItem value="300€ - 500€">300€ - 500€</SelectItem>
                              <SelectItem value="500€ - 700€">500€ - 700€</SelectItem>
                              <SelectItem value="Más de 700€">Más de 700€</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <label htmlFor="location" className="block text-sm font-medium mb-1">
                            Zona preferida de Sevilla
                          </label>
                          <Select value={sevillaZona} onValueChange={setSevillaZona}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona una zona" />
                            </SelectTrigger>
                            <SelectContent>
                              {sevillaZones.map((zone) => (
                                <SelectItem key={zone} value={zone}>{zone}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <label htmlFor="roommates" className="block text-sm font-medium mb-1">
                            Número de compañeros
                          </label>
                          <Select value={companeros} onValueChange={setCompaneros}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona número de compañeros" />
                            </SelectTrigger>
                            <SelectContent>
                              {companeroOptions.map((option) => (
                                <SelectItem key={option} value={option}>{option}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <label htmlFor="moveInDate" className="block text-sm font-medium mb-1">
                            Fecha de mudanza
                          </label>
                          <Select value={moveInDate} onValueChange={setMoveInDate}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona fecha aproximada" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Lo antes posible">Lo antes posible</SelectItem>
                              <SelectItem value="En las próximas semanas">En las próximas semanas</SelectItem>
                              <SelectItem value="En 1-2 meses">En 1-2 meses</SelectItem>
                              <SelectItem value="En 3-6 meses">En 3-6 meses</SelectItem>
                              <SelectItem value="Más de 6 meses">Más de 6 meses</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="flex justify-end mt-6">
                        <Button 
                          variant="outline" 
                          onClick={() => setEditingPreferences(false)}
                          className="mr-2"
                        >
                          Cancelar
                        </Button>
                        <Button onClick={handleSaveProfile}>
                          <Save size={16} className="mr-2" />
                          Guardar cambios
                        </Button>
                      </div>
                    </>
                  )}
                </div>
                
                {/* Lifestyle Section */}
                <div className="glass-card p-6">
                  {!editingLifestyle ? (
                    <>
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Estilo de vida</h2>
                        <Button 
                          onClick={() => setEditingLifestyle(true)}
                          variant="ghost" 
                          size="sm"
                        >
                          <Pencil size={16} className="mr-2" />
                          Editar
                        </Button>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <span className="text-sm text-muted-foreground">Limpieza:</span>
                          <p className="font-medium">{profileData.lifestyle.cleanliness}</p>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">Invitados:</span>
                          <p className="font-medium">{profileData.lifestyle.guests}</p>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">Fumar:</span>
                          <p className="font-medium">{profileData.lifestyle.smoking}</p>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">Mascotas:</span>
                          <p className="font-medium">{profileData.lifestyle.pets}</p>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">Horario:</span>
                          <p className="font-medium">{profileData.lifestyle.schedule}</p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <h2 className="text-xl font-semibold mb-4">Estilo de vida</h2>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Limpieza
                          </label>
                          <Select value={lifestyleCleaniness} onValueChange={setLifestyleCleaniness}>
                            <SelectTrigger>
                              <SelectValue placeholder="Preferencia de limpieza" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Muy ordenado">Muy ordenado</SelectItem>
                              <SelectItem value="Ordenado">Ordenado</SelectItem>
                              <SelectItem value="Normal">Normal</SelectItem>
                              <SelectItem value="Relajado">Relajado</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Invitados
                          </label>
                          <Select value={lifestyleGuests} onValueChange={setLifestyleGuests}>
                            <SelectTrigger>
                              <SelectValue placeholder="Preferencia sobre visitas" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Frecuentemente">Frecuentemente</SelectItem>
                              <SelectItem value="Ocasionalmente">Ocasionalmente</SelectItem>
                              <SelectItem value="Raramente">Raramente</SelectItem>
                              <SelectItem value="Prefiero no tener visitas">Prefiero no tener visitas</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Fumar
                          </label>
                          <Select value={lifestyleSmoking} onValueChange={setLifestyleSmoking}>
                            <SelectTrigger>
                              <SelectValue placeholder="Preferencia sobre fumar" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Permitido en toda la casa">Permitido en toda la casa</SelectItem>
                              <SelectItem value="Permitido solo en áreas designadas">Permitido solo en áreas designadas</SelectItem>
                              <SelectItem value="Solo en balcón/terraza">Solo en balcón/terraza</SelectItem>
                              <SelectItem value="No permitido">No permitido</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Mascotas
                          </label>
                          <Select value={lifestylePets} onValueChange={setLifestylePets}>
                            <SelectTrigger>
                              <SelectValue placeholder="Preferencia sobre mascotas" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Me encantan, tengo mascota">Me encantan, tengo mascota</SelectItem>
                              <SelectItem value="Me gustan, no tengo mascota">Me gustan, no tengo mascota</SelectItem>
                              <SelectItem value="Indiferente">Indiferente</SelectItem>
                              <SelectItem value="Prefiero no convivir con mascotas">Prefiero no convivir con mascotas</SelectItem>
                              <SelectItem value="No permitido">No permitido</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Horario
                          </label>
                          <Select value={lifestyleSchedule} onValueChange={setLifestyleSchedule}>
                            <SelectTrigger>
                              <SelectValue placeholder="Tu horario habitual" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Madrugador">Madrugador</SelectItem>
                              <SelectItem value="Normal">Normal</SelectItem>
                              <SelectItem value="Nocturno">Nocturno</SelectItem>
                              <SelectItem value="Horarios variables">Horarios variables</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="flex justify-end mt-6">
                        <Button 
                          variant="outline" 
                          onClick={() => setEditingLifestyle(false)}
                          className="mr-2"
                        >
                          Cancelar
                        </Button>
                        <Button onClick={handleSaveProfile}>
                          <Save size={16} className="mr-2" />
                          Guardar cambios
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProfilePage;

