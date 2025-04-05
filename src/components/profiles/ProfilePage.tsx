
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import Navbar from "../layout/Navbar";
import Footer from "../layout/Footer";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { AtSign, MapPin, GraduationCap, Briefcase, Edit, User, Heart, Tag } from 'lucide-react';
import ProfileForm from "./ProfileForm";

const ProfilePage = () => {
  const { user, session } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user?.id) {
        console.log("No user ID available for profile fetch");
        setLoading(false);
        return;
      }

      try {
        console.log("Fetching profile data for user ID:", user.id);
        setLoading(true);
        setError(null);
        
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();
        
        if (error) {
          console.error("Error fetching profile:", error.message);
          setError("No se pudo cargar el perfil. Por favor, inténtalo de nuevo.");
          throw error;
        }

        console.log("Profile data fetched:", data);
        
        if (!data) {
          console.log("No profile data found, redirecting to profile creation");
          navigate('/profile/create');
          return;
        }
        
        setProfile(data);
      } catch (err) {
        console.error("Error in fetchProfileData:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProfileData();
    } else {
      setLoading(false);
    }
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-homi-purple border-t-transparent mb-4"></div>
            <p className="text-sm text-muted-foreground">Cargando perfil...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center max-w-md px-4">
            <h1 className="text-2xl font-bold mb-4">Error al cargar el perfil</h1>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button onClick={() => window.location.reload()}>Reintentar</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center max-w-md px-4">
            <h1 className="text-2xl font-bold mb-4">Perfil no encontrado</h1>
            <p className="text-muted-foreground mb-6">No hemos podido encontrar tu perfil.</p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => navigate('/profile/create')}>Crear perfil</Button>
              <Button variant="outline" onClick={() => navigate('/')}>Ir a inicio</Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  // If in edit mode, show the form
  if (isEditing) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-20 pb-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {/* Header for edit mode */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                  <h1 className="text-2xl md:text-3xl font-bold">Editar Perfil</h1>
                  <Button 
                    onClick={() => setIsEditing(false)}
                    variant="outline"
                    className="text-sm text-homi-purple hover:text-homi-purple/80"
                  >
                    Cancelar edición
                  </Button>
                </div>
              </div>
              
              {/* ProfileForm for editing */}
              <ProfileForm 
                onSaved={() => {
                  setIsEditing(false);
                  toast({
                    title: "Perfil actualizado",
                    description: "Tu información de perfil ha sido guardada."
                  });
                }}
                cancelEdit={() => setIsEditing(false)}
              />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Calculate profile completion percentage
  const requiredFields = ['first_name', 'last_name', 'username', 'bio', 'edad', 'ubicacion', 'universidad', 'ocupacion', 'profile_image', 'interests'];
  const completedFields = requiredFields.filter(field => {
    if (field === 'interests') {
      return profile.interests && Array.isArray(profile.interests) && profile.interests.length > 0;
    }
    return profile[field] && String(profile[field]).trim() !== '';
  });
  const completionPercentage = Math.round((completedFields.length / requiredFields.length) * 100);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20 pb-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Profile header with completion status */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
                <h1 className="text-2xl md:text-3xl font-bold">Tu Perfil</h1>
                <Button 
                  onClick={() => setIsEditing(true)}
                  className="rounded-full bg-homi-purple hover:bg-homi-purple/90"
                >
                  <Edit className="mr-2 h-4 w-4" /> Editar Perfil
                </Button>
              </div>
              
              <div className="bg-gray-100 h-4 w-full rounded-full mb-2">
                <div 
                  className="bg-gradient-to-r from-homi-purple to-homi-lightPurple h-4 rounded-full transition-all duration-500 ease-in-out"
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
              
              <p className="text-sm text-muted-foreground">
                Perfil completado: <span className="font-medium">{completionPercentage}%</span>
                {completionPercentage < 100 && (
                  <span className="ml-2">
                    - Completa tu perfil para mejorar tus coincidencias
                  </span>
                )}
              </p>
            </div>
            
            {/* Main profile content */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left column - profile image and basic info */}
              <div className="md:col-span-1">
                <Card className="overflow-hidden">
                  <div className="relative aspect-square bg-gradient-to-br from-purple-100 to-pink-50">
                    <img
                      src={profile.profile_image || "https://via.placeholder.com/300?text=Añade+tu+foto"}
                      alt="Foto de perfil"
                      className="w-full h-full object-cover"
                    />
                    
                    {!profile.profile_image && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 bg-opacity-80">
                        <User size={40} className="text-gray-400 mb-2" />
                        <p className="text-sm text-center text-gray-500 px-4">
                          Añade una foto para completar tu perfil
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <h2 className="text-xl font-semibold text-center">
                      {profile.first_name} {profile.last_name}
                    </h2>
                    {profile.username && (
                      <p className="text-gray-600 text-center flex items-center justify-center gap-1 mt-1">
                        <AtSign size={14} className="text-homi-purple" />
                        {profile.username}
                      </p>
                    )}
                    {!profile.is_profile_active && (
                      <div className="mt-2 bg-amber-50 text-amber-600 p-2 rounded-md text-xs text-center">
                        Tu perfil está actualmente oculto
                      </div>
                    )}
                  </div>
                </Card>

                {/* Status card */}
                {profile.sevilla_zona && (
                  <Card className="mt-4 p-4">
                    <h3 className="font-medium text-sm mb-2 flex items-center gap-1">
                      <Heart size={16} className="text-homi-purple" /> Estado de búsqueda
                    </h3>
                    {profile.sevilla_zona === 'no_busco' ? (
                      <p className="text-sm">No estás buscando piso actualmente</p>
                    ) : (
                      <div className="text-sm">
                        <p className="mb-1">Buscando en: <span className="font-medium">{profile.sevilla_zona}</span></p>
                        {profile.companeros_count && (
                          <p>Compañeros: <span className="font-medium">{profile.companeros_count}</span></p>
                        )}
                      </div>
                    )}
                  </Card>
                )}
              </div>
              
              {/* Right column - detailed information */}
              <div className="md:col-span-2">
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Información Personal</h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div className="flex items-start gap-3">
                      <div className="bg-homi-ultraLightPurple p-2 rounded-md text-homi-purple mt-1">
                        <User size={18} />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Edad</p>
                        <p className="font-medium">{profile.edad || 'No especificado'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="bg-homi-ultraLightPurple p-2 rounded-md text-homi-purple mt-1">
                        <MapPin size={18} />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Ubicación</p>
                        <p className="font-medium">{profile.ubicacion || 'No especificado'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="bg-homi-ultraLightPurple p-2 rounded-md text-homi-purple mt-1">
                        <GraduationCap size={18} />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Universidad</p>
                        <p className="font-medium">{profile.universidad || 'No especificado'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="bg-homi-ultraLightPurple p-2 rounded-md text-homi-purple mt-1">
                        <Briefcase size={18} />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Ocupación</p>
                        <p className="font-medium">{profile.ocupacion || 'No especificado'}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="font-medium mb-2">Bio</h3>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-md">
                      {profile.bio || 'Añade una descripción para que los demás te conozcan mejor.'}
                    </p>
                  </div>
                  
                  {/* Interests/tags section */}
                  <div>
                    <h3 className="font-medium mb-2 flex items-center gap-1">
                      <Tag size={16} className="text-homi-purple" /> Intereses
                    </h3>
                    {profile.interests && profile.interests.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {profile.interests.map((interest: string, index: number) => (
                          <span 
                            key={index} 
                            className="px-3 py-1 text-sm rounded-full bg-homi-ultraLightPurple text-homi-purple"
                          >
                            {interest}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 italic text-sm">
                        No has añadido intereses. Edita tu perfil para añadir tus intereses.
                      </p>
                    )}
                  </div>
                </Card>
                
                <Card className="p-6 mt-6">
                  <h2 className="text-xl font-semibold mb-4">Preferencias de vivienda</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Zona preferida en Sevilla</p>
                      <p className="font-medium">{profile.sevilla_zona && profile.sevilla_zona !== 'no_busco' 
                        ? profile.sevilla_zona 
                        : 'No especificado'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Número de compañeros</p>
                      <p className="font-medium">{profile.companeros_count || 'No especificado'}</p>
                    </div>
                  </div>
                </Card>
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
