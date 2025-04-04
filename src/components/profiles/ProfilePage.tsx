import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MessageSquare, Share, Heart, Home, Briefcase, GraduationCap, UserCheck, AtSign, Camera, ChevronLeft, ChevronRight, Search, Check, X, DollarSign, Calendar, MapPin, Users, Save, Pencil, Download, QrCode } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from '@/context/AuthContext';
import { type Json } from '@/integrations/supabase/types';
import { FormImageUpload } from "@/components/ui/form-image-upload";
import { QRCodeSVG } from 'qrcode.react';
import { useIsMobile } from '@/hooks/use-mobile';
import { ensureImageString, ensureImageArray } from '@/utils/image-helpers';

interface Tag {
  id: number;
  name: string;
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
  tags: Tag[];
  verified: boolean;
  preferences: {
    budget: string;
    location: string;
    roommates: string;
    moveInDate: string;
  };
  lifestyle: {
    cleanliness: string;
    guests: string;
    smoking: string;
    pets: string;
    schedule: string;
  };
  lookingFor: {
    hasApartment: boolean;
    roommatesCount: string;
    genderPreference: string;
    smokingPreference: string;
    occupationPreference: string;
    minAge: string;
    maxAge: string;
    budgetRange: number[];
    exactPrice: number;
  };
}

const defaultProfile: ProfileData = {
  id: '',
  name: '',
  username: '',
  age: 0,
  location: '',
  university: '',
  occupation: '',
  bio: '',
  imgUrl: '',
  galleryImgs: [],
  tags: [],
  verified: false,
  preferences: {
    budget: '',
    location: '',
    roommates: '',
    moveInDate: ''
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
    roommatesCount: '1',
    genderPreference: 'any',
    smokingPreference: 'any',
    occupationPreference: 'any',
    minAge: '18',
    maxAge: '99',
    budgetRange: [300, 1500],
    exactPrice: 0
  }
};

const ProfilePage = () => {
  const { toast } = useToast();
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState('info');
  const [activeGalleryImage, setActiveGalleryImage] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showQrDialog, setShowQrDialog] = useState(false);
  const [showAddImageDialog, setShowAddImageDialog] = useState(false);
  const [tempImageUrl, setTempImageUrl] = useState("");
  
  const [profile, setProfile] = useState<ProfileData>({
    id: '',
    name: '',
    username: '',
    age: 0,
    location: '',
    university: '',
    occupation: '',
    bio: '',
    imgUrl: '',
    galleryImgs: [],
    tags: [],
    verified: false,
    preferences: {
      budget: '',
      location: '',
      roommates: '',
      moveInDate: ''
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
      roommatesCount: '1',
      genderPreference: 'any',
      smokingPreference: 'any',
      occupationPreference: 'any',
      minAge: '18',
      maxAge: '99',
      budgetRange: [300, 1500],
      exactPrice: 0
    }
  });

  const handleSaveProfileImage = async (imageValue: string | string[]) => {
    if (!user) return;
    setIsSaving(true);
    try {
      const imageUrl = ensureImageString(imageValue);
      
      const { error } = await supabase
        .from('profiles')
        .update({
          profile_image: imageUrl
        })
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
  
  const handleAddToGallery = async (imageValue: string | string[]) => {
    if (!user) return;
    setIsSaving(true);
    try {
      const imageUrl = ensureImageString(imageValue);
      
      const newGallery = [...(profile.galleryImgs || []), imageUrl];
      const { error } = await supabase
        .from('profiles')
        .update({
          gallery_images: newGallery
        })
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

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (error) throw error;
        
        if (data) {
          setProfile({
            id: data.id,
            name: data.first_name + ' ' + data.last_name,
            username: data.username || '',
            age: data.age || 18,
            location: data.location || '',
            university: data.university || '',
            occupation: data.occupation || '',
            bio: data.bio || '',
            imgUrl: data.profile_image || '',
            galleryImgs: data.gallery_images || [],
            tags: data.tags || [],
            verified: data.verified || false,
            preferences: data.preferences || defaultProfile.preferences,
            lifestyle: data.lifestyle || defaultProfile.lifestyle,
            lookingFor: data.lookingFor || defaultProfile.lookingFor
          });
        } else {
          // If no profile data, redirect to create profile page
          navigate('/profile/create');
        }
      } catch (error: any) {
        console.error("Error fetching profile:", error);
        toast({
          title: "Error al cargar el perfil",
          description: error.message || "No se pudo cargar la información del perfil",
          variant: "destructive"
        });
      }
    };
    
    fetchProfile();
  }, [user, navigate, toast]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleToggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleSubmitProfile = async (values: any) => {
    if (!user) return;
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          ...values,
          first_name: values.name.split(' ')[0],
          last_name: values.name.split(' ').slice(1).join(' '),
        })
        .eq('id', user.id);
        
      if (error) throw error;
      
      setProfile(prev => ({
        ...prev,
        ...values,
        name: values.name
      }));
      
      setIsEditing(false);
      
      toast({
        title: "Perfil actualizado",
        description: "Tu perfil ha sido actualizado correctamente"
      });
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error al guardar",
        description: error.message || "No se pudo actualizar el perfil",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto py-10">
        <Card className="w-full max-w-4xl mx-auto">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Mi Perfil</h2>
              <Button onClick={handleToggleEdit} disabled={isSaving}>
                {isEditing ? 'Cancelar' : 'Editar Perfil'}
              </Button>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <div className="md:w-1/3">
                <Avatar className="w-32 h-32 mx-auto">
                  <AvatarImage src={profile.imgUrl} alt={profile.name} />
                  <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <FormImageUpload
                  name="profile_image"
                  label="Foto de perfil"
                  onChange={handleSaveProfileImage}
                />
                <h3 className="text-xl font-semibold mt-4 text-center">{profile.name}</h3>
                <p className="text-center text-muted-foreground">@{profile.username}</p>
              </div>

              <div className="md:w-2/3">
                <div className="flex border-b">
                  <Button
                    variant="ghost"
                    className={`py-2 px-4 font-medium ${activeTab === 'info' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}
                    onClick={() => handleTabChange('info')}
                  >
                    Información
                  </Button>
                  <Button
                    variant="ghost"
                    className={`py-2 px-4 font-medium ${activeTab === 'gallery' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}
                    onClick={() => handleTabChange('gallery')}
                  >
                    Galería
                  </Button>
                  <Button
                    variant="ghost"
                    className={`py-2 px-4 font-medium ${activeTab === 'preferences' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}
                    onClick={() => handleTabChange('preferences')}
                  >
                    Preferencias
                  </Button>
                </div>

                <div className="mt-4">
                  {activeTab === 'info' && (
                    <div>
                      <p><strong>Nombre:</strong> {profile.name}</p>
                      <p><strong>Edad:</strong> {profile.age}</p>
                      <p><strong>Ubicación:</strong> {profile.location}</p>
                      <p><strong>Universidad:</strong> {profile.university}</p>
                      <p><strong>Ocupación:</strong> {profile.occupation}</p>
                      <p><strong>Bio:</strong> {profile.bio}</p>
                    </div>
                  )}

                  {activeTab === 'gallery' && (
                    <div>
                      {profile.galleryImgs.length > 0 ? (
                        <div className="relative">
                          <img
                            src={profile.galleryImgs[activeGalleryImage]}
                            alt={`Imagen de galería ${activeGalleryImage + 1}`}
                            className="w-full h-64 object-cover rounded-md"
                          />
                          <div className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full cursor-pointer" onClick={() => setActiveGalleryImage(activeGalleryImage === 0 ? profile.galleryImgs.length - 1 : activeGalleryImage - 1)}>
                            <ChevronLeft size={20} />
                          </div>
                          <div className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full cursor-pointer" onClick={() => setActiveGalleryImage((activeGalleryImage + 1) % profile.galleryImgs.length)}>
                            <ChevronRight size={20} />
                          </div>
                        </div>
                      ) : (
                        <p>No hay imágenes en la galería.</p>
                      )}
                      <Button onClick={() => setShowAddImageDialog(true)}>Añadir imagen</Button>
                    </div>
                  )}

                  {activeTab === 'preferences' && (
                    <div>
                      <p><strong>Presupuesto:</strong> {profile.preferences.budget}</p>
                      <p><strong>Ubicación preferida:</strong> {profile.preferences.location}</p>
                      <p><strong>Compañeros de cuarto:</strong> {profile.preferences.roommates}</p>
                      <p><strong>Fecha de mudanza:</strong> {profile.preferences.moveInDate}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showAddImageDialog} onOpenChange={setShowAddImageDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Añadir imagen a la galería</DialogTitle>
          </DialogHeader>
          <FormImageUpload
            name="gallery_image"
            label="Imagen de galería"
            onChange={(value) => setTempImageUrl(ensureImageString(value))}
          />
          <Button onClick={() => handleAddToGallery(tempImageUrl)}>Guardar</Button>
        </DialogContent>
      </Dialog>
      <Footer />
    </div>
  );
};

export default ProfilePage;
