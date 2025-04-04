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
import { ensureImageString } from "@/utils/image-helpers";

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

const companeroOptions = ["1", "2", "3", "4", "5+"];

const predefinedInterests = [
  "Deportes", "Música", "Cine", "Lectura", "Viajes", 
  "Cocina", "Arte", "Tecnología", "Fotografía", "Naturaleza",
  "Gaming", "Fitness", "Yoga", "Idiomas", "Historia",
  "Moda", "Voluntariado", "Mascotas", "Gastronomía", "Festivales"
];

const ProfilePage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const [profileImage, setProfileImage] = useState<string>('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [age, setAge] = useState('');
  const [location, setLocation] = useState('');
  const [university, setUniversity] = useState('');
  const [occupation, setOccupation] = useState('');
  const [sevillaZone, setSevillaZone] = useState('');
  const [companeros, setCompaneros] = useState('');
  
  const [cleanliness, setCleanliness] = useState('');
  const [guests, setGuests] = useState('');
  const [smoking, setSmoking] = useState('');
  const [pets, setPets] = useState('');
  const [schedule, setSchedule] = useState('');
  
  const [interests, setInterests] = useState<string[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [customInterest, setCustomInterest] = useState('');
  
  const [hasApartment, setHasApartment] = useState(false);
  const [genderPreference, setGenderPreference] = useState('');
  const [smokingPreference, setSmokingPreference] = useState('');
  const [occupationPreference, setOccupationPreference] = useState('');
  const [minAge, setMinAge] = useState('');
  const [maxAge, setMaxAge] = useState('');
  const [budgetRange, setBudgetRange] = useState<number[]>([300, 800]);
  const [exactPrice, setExactPrice] = useState<number>(500);
  
  const [activeSection, setActiveSection] = useState('profile');
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  
  const profileCardRef = useRef<HTMLDivElement>(null);

  const handleSaveProfileImage = async (value: string | string[]) => {
    if (!user) return;

    try {
      setIsSaving(true);
      
      const profileImageValue = ensureImageString(value);
      
      const { error } = await supabase
        .from('profiles')
        .update({
          profile_image: profileImageValue,
        })
        .eq('id', user.id);
        
      if (error) {
        throw error;
      }
      
      setProfileImage(profileImageValue);
      
      toast({
        title: "Imagen de perfil actualizada",
        description: "Tu imagen de perfil ha sido actualizada correctamente",
      });
    } catch (error) {
      console.error('Error saving profile image:', error);
      toast({
        title: "Error al actualizar la imagen de perfil",
        description: "Ha ocurrido un error al actualizar tu imagen de perfil. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [user]);
  
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Acceso restringido</h1>
            <p className="text-muted-foreground mb-6">Inicia sesión para ver tu perfil.</p>
            <Button asChild>
              <Link to="/signin">Iniciar sesión</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-20 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div ref={profileCardRef} className="glass-card overflow-hidden mb-6">
              <div className="relative h-40 bg-homi-ultraLightPurple">
                <img
                  src={profileImage || "https://images.unsplash.com/photo-1554189097-ffe88e998e2b"}
                  alt="Cover"
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="relative px-6 py-8">
                <div className="absolute -top-16 left-6 w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                  {editMode ? (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <FormImageUpload
                        name="profileImage"
                        hideLabel
                        onChange={handleSaveProfileImage}
                        className="w-full h-full"
                      />
                    </div>
                  ) : (
                    <img
                      src={profileImage || "https://images.unsplash.com/photo-1649972904349-6e44c42644a7"}
                      alt={firstName}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                
                <div className="ml-36">
                  <div className="flex justify-between">
                    <div>
                      <h1 className="text-2xl md:text-3xl font-bold">{firstName} {lastName}</h1>
                      <p className="text-muted-foreground flex items-center gap-1 mt-1">
                        <AtSign size={16} className="text-homi-purple" />
                        <span className="font-medium">{username}</span>
                      </p>
                      {location && (
                        <p className="text-muted-foreground flex items-center gap-1 mt-1">
                          <MapPin size={16} />
                          {location}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button
                        size="sm"
                        variant={editMode ? "default" : "outline"}
                        className={editMode ? "bg-homi-purple hover:bg-homi-purple/90" : ""}
                        onClick={() => setEditMode(!editMode)}
                      >
                        {editMode ? (
                          <>
                            <Save size={16} className="mr-1" />
                            Guardar cambios
                          </>
                        ) : (
                          <>
                            <Pencil size={16} className="mr-1" />
                            Editar perfil
                          </>
                        )}
                      </Button>
                      <Dialog open={showQRCode} onOpenChange={setShowQRCode}>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline">
                            <QrCode size={16} className="mr-1" />
                            Compartir perfil
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Comparte tu perfil</DialogTitle>
                          </DialogHeader>
                          <div className="flex flex-col items-center p-4">
                            <div className="bg-white p-4 rounded-lg">
                              <QRCodeSVG
                                value={`${window.location.origin}/profile/view/${user.id}`}
                                size={200}
                                bgColor={"#ffffff"}
                                fgColor={"#000000"}
                                level={"L"}
                                includeMargin={false}
                              />
                            </div>
                            <p className="text-center text-sm text-muted-foreground mt-4">
                              Escanea este código QR para compartir tu perfil
                            </p>
                            <Button
                              className="mt-4"
                              onClick={async () => {
                                const qrElement = document.querySelector('[role="dialog"] .bg-white');
                                if (qrElement) {
                                  try {
                                    const canvas = await html2canvas(qrElement as HTMLElement);
                                    const dataUrl = canvas.toDataURL("image/png");
                                    const link = document.createElement("a");
                                    link.download = "homi-profile-qr.png";
                                    link.href = dataUrl;
                                    link.click();
                                    toast({
                                      title: "QR descargado",
                                      description: "El código QR ha sido descargado correctamente",
                                    });
                                  } catch (err) {
                                    console.error("Error downloading QR", err);
                                    toast({
                                      title: "Error al descargar QR",
                                      description: "Ha ocurrido un error al descargar el código QR",
                                      variant: "destructive",
                                    });
                                  }
                                }
                              }}
                            >
                              <Download size={16} className="mr-1" />
                              Descargar QR
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <ToggleGroup 
                type="single" 
                value={activeSection}
                onValueChange={(value) => {
                  if (value) setActiveSection(value);
                }}
                className="justify-start flex-wrap"
              >
                <ToggleGroupItem value="profile" className="data-[state=on]:bg-homi-ultraLightPurple data-[state=on]:text-homi-purple">
                  Sobre mí
                </ToggleGroupItem>
                <ToggleGroupItem value="lifestyle" className="data-[state=on]:bg-homi-ultraLightPurple data-[state=on]:text-homi-purple">
                  Estilo de vida
                </ToggleGroupItem>
                <ToggleGroupItem value="preferences" className="data-[state=on]:bg-homi-ultraLightPurple data-[state=on]:text-homi-purple">
                  Busco
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
            
            {activeSection === 'profile' && (
              <>
                <Card className="mb-6">
                  <CardContent className="pt-6">
                    <h2 className="text-xl font-semibold mb-4">Información personal</h2>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                          {editMode ? (
                            <Input
                              value={firstName}
                              onChange={(e) => setFirstName(e.target.value)}
                              placeholder="Nombre"
                            />
                          ) : (
                            <p>{firstName || "No especificado"}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Apellidos</label>
                          {editMode ? (
                            <Input
                              value={lastName}
                              onChange={(e) => setLastName(e.target.value)}
                              placeholder="Apellidos"
                            />
                          ) : (
                            <p>{lastName || "No especificado"}</p>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Edad</label>
                          {editMode ? (
                            <Input
                              value={age}
                              onChange={(e) => setAge(e.target.value)}
                              placeholder="Edad"
                            />
                          ) : (
                            <p>{age || "No especificado"}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
                          {editMode ? (
                            <Input
                              value={location}
                              onChange={(e) => setLocation(e.target.value)}
                              placeholder="Ciudad, País"
                            />
                          ) : (
                            <p>{location || "No especificado"}</p>
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Universidad</label>
                        {editMode ? (
                          <Input
                            value={university}
                            onChange={(e) => setUniversity(e.target.value)}
                            placeholder="Universidad"
                          />
                        ) : (
                          <p>{university || "No especificado"}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ocupación</label>
                        {editMode ? (
                          <Input
                            value={occupation}
                            onChange={(e) => setOccupation(e.target.value)}
                            placeholder="Ocupación"
                          />
                        ) : (
                          <p>{occupation || "No especificado"}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="mb-6">
                  <CardContent className="pt-6">
                    <h2 className="text-xl font-semibold mb-4">Sobre mí</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Biografía</label>
                        {editMode ? (
                          <Textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder="Cuéntanos sobre ti..."
                            className="min-h-[120px]"
                          />
                        ) : (
                          <p className="whitespace-pre-wrap">{bio || "Sin descripción"}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <h2 className="text-xl font-semibold mb-4">Intereses</h2>
                    {editMode ? (
                      <div className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                          {predefinedInterests.map((interest) => (
                            <Button
                              key={interest}
                              type="button"
                              variant="outline"
                              size="sm"
                              className={`rounded-full ${
                                selectedInterests.includes(interest)
                                  ? "bg-homi-ultraLightPurple text-homi-purple border-homi-purple"
                                  : ""
                              }`}
                              onClick={() => {
                                if (selectedInterests.includes(interest)) {
                                  setSelectedInterests(selectedInterests.filter((i) => i !== interest));
                                } else {
                                  setSelectedInterests([...selectedInterests, interest]);
                                }
                              }}
                            >
                              {interest}
                              {selectedInterests.includes(interest) && (
                                <Check size={14} className="ml-1 text-homi-purple" />
                              )}
                            </Button>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <Input
                            value={customInterest}
                            onChange={(e) => setCustomInterest(e.target.value)}
                            placeholder="Añadir interés personalizado"
                          />
                          <Button
                            type="button"
                            onClick={() => {
                              if (customInterest.trim() && !selectedInterests.includes(customInterest.trim())) {
                                setSelectedInterests([...selectedInterests, customInterest.trim()]);
                                setCustomInterest("");
                              }
                            }}
                            disabled={!customInterest.trim() || selectedInterests.includes(customInterest.trim())}
                          >
                            Añadir
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {interests.length > 0 ? (
                          interests.map((interest, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 text-sm rounded-full bg-homi-ultraLightPurple text-homi-purple"
                            >
                              {interest}
                            </span>
                          ))
                        ) : (
                          <p className="text-muted-foreground">No hay intereses seleccionados</p>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            )}
            
            {activeSection === 'lifestyle' && (
              <>
                <Card className="mb-6">
                  <CardContent className="pt-6">
                    <h2 className="text-xl font-semibold mb-4">Estilo de vida</h2>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Limpieza</label>
                          {editMode ? (
                            <Input
                              value={cleanliness}
                              onChange={(e) => setCleanliness(e.target.value)}
                              placeholder="Limpieza"
                            />
                          ) : (
                            <p>{cleanliness || "No especificado"}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Habitantes</label>
                          {editMode ? (
                            <Input
                              value={guests}
                              onChange={(e) => setGuests(e.target.value)}
                              placeholder="Habitantes"
                            />
                          ) : (
                            <p>{guests || "No especificado"}</p>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Fumadores</label>
                          {editMode ? (
                            <Input
                              value={smoking}
                              onChange={(e) => setSmoking(e.target.value)}
                              placeholder="Fumadores"
                            />
                          ) : (
                            <p>{smoking || "No especificado"}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Mascotas</label>
                          {editMode ? (
                            <Input
                              value={pets}
                              onChange={(e) => setPets(e.target.value)}
                              placeholder="Mascotas"
                            />
                          ) : (
                            <p>{pets || "No especificado"}</p>
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Horario</label>
                        {editMode ? (
                          <Input
                            value={schedule}
                            onChange={(e) => setSchedule(e.target.value)}
                            placeholder="Horario"
                          />
                        ) : (
                          <p>{schedule || "No especificado"}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
            
            {activeSection === 'preferences' && (
              <>
                <Card className="mb-6">
                  <CardContent className="pt-6">
                    <h2 className="text-xl font-semibold mb-4">Busco</h2>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Apartamento</label>
                          {editMode ? (
                            <Switch
                              checked={hasApartment}
                              onCheckedChange={setHasApartment}
                            />
                          ) : (
                            <p>{hasApartment ? "Sí" : "No"}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Compañeros</label>
                          {editMode ? (
                            <Select
                              value={companeros}
                              onValueChange={setCompaneros}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Número de compañeros" />
                              </SelectTrigger>
                              <SelectContent>
                                {companeroOptions.map((option) => (
                                  <SelectItem value={option}>{option}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <p>{companeros || "No especificado"}</p>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Género</label>
                          {editMode ? (
                            <Select
                              value={genderPreference}
                              onValueChange={setGenderPreference}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Género" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="male">Masculino</SelectItem>
                                <SelectItem value="female">Femenino</SelectItem>
                                <SelectItem value="other">Otro</SelectItem>
                              </SelectContent>
                            </Select>
                          ) : (
                            <p>{genderPreference || "No especificado"}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Fumadores</label>
                          {editMode ? (
                            <Select
                              value={smokingPreference}
                              onValueChange={setSmokingPreference}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Fumadores" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="yes">Sí</SelectItem>
                                <SelectItem value="no">No</SelectItem>
                              </SelectContent>
                            </Select>
                          ) : (
                            <p>{smokingPreference || "No especificado"}</p>
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ocupación</label>
                        {editMode ? (
                          <Input
                            value={occupationPreference}
                            onChange={(e) => setOccupationPreference(e.target.value)}
                            placeholder="Ocupación"
                          />
                        ) : (
                          <p>{occupationPreference || "No especificado"}</p>
                        )}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Edad mínima</label>
                          {editMode ? (
                            <Input
                              value={minAge}
                              onChange={(e) => setMinAge(e.target.value)}
                              placeholder="Edad mínima"
                            />
                          ) : (
                            <p>{minAge || "No especificado"}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Edad máxima</label>
                          {editMode ? (
                            <Input
                              value={maxAge}
                              onChange={(e) => setMaxAge(e.target.value)}
                              placeholder="Edad máxima"
                            />
                          ) : (
                            <p>{maxAge || "No especificado"}</p>
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Rango de presupuesto</label>
                        {editMode ? (
                          <Slider
                            min={300}
                            max={800}
                            value={budgetRange}
                            onValueChange={setBudgetRange}
                          />
                        ) : (
                          <p>{budgetRange.join(' - ')}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Precio exacto</label>
                        {editMode ? (
                          <Input
                            value={exactPrice}
                            onChange={(e) => setExactPrice(Number(e.target.value))}
                            placeholder="Precio exacto"
                          />
                        ) : (
                          <p>{exactPrice || "No especificado"}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProfilePage;
