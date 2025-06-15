import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import Navbar from "../layout/Navbar";
import Footer from "../layout/Footer";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { AtSign, MapPin, GraduationCap, Briefcase, Edit, User, Heart, Tag, Clock, Trash2, Cigarette, PawPrint, Users, Crown, CreditCard, Home } from 'lucide-react';
import ProfileForm from "./ProfileForm";
import ProfileAuthGate from '../auth/ProfileAuthGate';
import ProfileStatusToggle from './ProfileStatusToggle';
import { useSubscription } from '@/hooks/useSubscription';

const ProfilePage = () => {
  const { user, session, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profileLoading, setProfileLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { subscriptionInfo, createCheckout, openCustomerPortal } = useSubscription();
  
  // Early return if not authenticated and not loading
  if (!loading && !user && !session) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-20 pb-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <ProfileAuthGate />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user?.id) {
        console.log("No user ID available for profile fetch");
        setProfileLoading(false);
        return;
      }

      try {
        console.log("Fetching profile data for user ID:", user.id);
        setProfileLoading(true);
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
        if (!data) {
          navigate('/profile/create');
          return;
        }
        
        setProfile(data);
      } catch (err) {
        console.error("Error in fetchProfileData:", err);
      } finally {
        setProfileLoading(false);
      }
    };

    if (user) {
      fetchProfileData();
    } else if (!loading) {
      setProfileLoading(false);
    }
  }, [user, navigate, loading]);

  const handleEditClick = () => {
    navigate('/profile/edit');
  };

  const handleSubscriptionClick = async () => {
    if (subscriptionInfo.subscribed) {
      await openCustomerPortal();
    } else {
      navigate('/precios');
    }
  };

  const handleProfileVisibilityToggle = async (isActive: boolean) => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_profile_active: isActive })
        .eq('id', user.id);

      if (error) {
        console.error('Error updating profile visibility:', error);
        toast({
          title: "Error",
          description: "No se pudo actualizar la visibilidad del perfil",
          variant: "destructive"
        });
        return;
      }

      // Update local state
      setProfile((prev: any) => ({
        ...prev,
        is_profile_active: isActive
      }));

    } catch (error) {
      console.error('Error updating profile visibility:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la visibilidad del perfil",
        variant: "destructive"
      });
    }
  };

  if (loading || profileLoading) {
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
  
  if (isEditing) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-20 pb-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
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

  // Helper function to get apartment status and location display
  const getLocationAndStatusDisplay = () => {
    const lifestyleData = typeof profile.lifestyle === 'object' && profile.lifestyle !== null
      ? profile.lifestyle
      : {};
    
    let status = 'Estoy buscando piso';
    let location = 'No especificado';
    
    // Determine apartment status
    if (profile.sevilla_zona === 'tengo_piso') {
      status = 'Ya tengo piso';
    }
    
    // Get location information
    if (lifestyleData.ciudad) {
      location = lifestyleData.ciudad;
      // If it's Sevilla and has zones, show them
      if (lifestyleData.ciudad === 'Sevilla' && lifestyleData.sevilla_zonas && Array.isArray(lifestyleData.sevilla_zonas) && lifestyleData.sevilla_zonas.length > 0) {
        location += ` (${lifestyleData.sevilla_zonas.join(', ')})`;
      }
    } else if (profile.sevilla_zona && profile.sevilla_zona !== 'tengo_piso') {
      // Backwards compatibility: check sevilla_zona field
      const sevillaZones = [
        "Casco Antiguo", "Triana", "Los Remedios", "Nervión", 
        "San Pablo - Santa Justa", "Este - Alcosa - Torreblanca", 
        "Cerro - Amate", "Sur", "Bellavista - La Palmera", 
        "Macarena", "Norte", "Viapol", "El Plantinar", "El Juncal", 
        "Gran Plaza", "Otro/Alrededores"
      ];
      
      if (sevillaZones.includes(profile.sevilla_zona)) {
        location = `Sevilla (${profile.sevilla_zona})`;
      } else {
        location = profile.sevilla_zona;
      }
    }
    
    return { status, location };
  };

  const { status: apartmentStatus, location } = getLocationAndStatusDisplay();
  const hasApartment = profile.sevilla_zona === 'tengo_piso';

  const requiredFields = ['first_name', 'edad', 'profile_image', 'interests', 'lifestyle'];
  const completedFields = requiredFields.filter(field => {
    if (field === 'interests') {
      return profile.interests && Array.isArray(profile.interests) && profile.interests.length > 0;
    }
    return profile[field] && String(profile[field]).trim() !== '';
  });
  const completionPercentage = Math.round((completedFields.length / requiredFields.length) * 100);

  // Parse lifestyle data
  const lifestyleData = typeof profile.lifestyle === 'object' && profile.lifestyle !== null
    ? profile.lifestyle
    : {};

  // Map lifestyle values to human-readable text
  const getLifestyleText = (key: string, value: string | undefined) => {
    if (!value) return "No especificado";
    
    const lifestyleLabels: Record<string, Record<string, string>> = {
      schedule: {
        'morning_person': 'Soy madrugador/a',
        'night_owl': 'Soy noctámbulo/a',
        'flexible': 'Tengo horario flexible'
      },
      cleanliness: {
        'very_clean': 'Soy muy limpio/a',
        'clean': 'Soy limpio/a',
        'moderate': 'Soy moderadamente limpio/a',
        'relaxed': 'Soy relajado/a con la limpieza'
      },
      smoking: {
        'non_smoker': 'No fumo',
        'outdoor_only': 'Solo fumo en exteriores',
        'smoker': 'Fumo'
      },
      pets: {
        'no_pets': 'No tengo mascotas',
        'has_pets': 'Tengo mascotas',
        'pets_welcome': 'Acepto mascotas',
        'no_pets_allowed': 'No acepto mascotas'
      },
      guests: {
        'rarely': 'Raramente recibo invitados',
        'occasionally': 'Ocasionalmente recibo invitados',
        'frequently': 'Frecuentemente recibo invitados',
        'no_problem': 'No tengo problema con invitados'
      }
    };
    
    return lifestyleLabels[key]?.[value] || value;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-5 pb-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
                <h1 className="text-2xl md:text-3xl font-bold">Mi Perfil</h1>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    onClick={handleSubscriptionClick}
                    className={`rounded-full ${
                      subscriptionInfo.subscribed 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700' 
                        : 'bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 hover:from-yellow-500 hover:via-orange-500 hover:to-red-500 text-black font-bold'
                    }`}
                  >
                    {subscriptionInfo.subscribed ? (
                      <>
                        <CreditCard className="mr-2 h-4 w-4" />
                        Gestionar Suscripción
                      </>
                    ) : (
                      <>
                        <Crown className="mr-2 h-4 w-4" />
                        ¡Hazte Premium!
                      </>
                    )}
                  </Button>
                  <Button 
                    onClick={handleEditClick}
                    className="rounded-full bg-homi-purple hover:bg-homi-purple/90"
                  >
                    <Edit className="mr-2 h-4 w-4" /> Editar Perfil
                  </Button>
                </div>
              </div>
              
              {/* Profile Status Toggle */}
              <div className="mb-4">
                <ProfileStatusToggle
                  isActive={profile.is_profile_active}
                  onToggle={handleProfileVisibilityToggle}
                />
              </div>
              
              {/* Subscription Status Display */}
              {subscriptionInfo.subscribed && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Crown className="h-5 w-5 text-green-600" />
                    <span className="font-semibold text-green-800">
                      Plan {subscriptionInfo.subscription_tier || 'Premium'}
                    </span>
                  </div>
                  {subscriptionInfo.subscription_end && (
                    <p className="text-sm text-green-700 mt-1">
                      Activo hasta: {new Date(subscriptionInfo.subscription_end).toLocaleDateString('es-ES')}
                    </p>
                  )}
                </div>
              )}
              
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

              <p className="text-sm text-muted-foreground mt-2">
               Es necesario añadir foto de <span className="font-medium"> perfil, nombre, edad, intereses y estilo de vida </span> para que tu perfil sea visible para otros usuarios.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <Card className="overflow-hidden">
                  <div className="relative aspect-square bg-gradient-to-br from-purple-100 to-pink-50">
                    <img
                      src={profile.profile_image || "https://via.placeholder.com/300?text=Añade+tu+foto"}
                      alt="Mi foto de perfil"
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
                        Mi perfil está actualmente oculto
                      </div>
                    )}
                  </div>
                </Card>

                <Card className="mt-4 p-4">
                  <h3 className="font-medium text-sm mb-3 flex items-center gap-1">
                    <Heart size={16} className="text-homi-purple" /> Mi estado de búsqueda
                  </h3>
                  <div className="text-sm space-y-2">
                    <div>
                      <span className="text-muted-foreground">Estado:</span>
                      <p className="font-medium">{apartmentStatus}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        {hasApartment ? 'Ubicación de mi piso:' : 'Ubicación preferida:'}
                      </span>
                      <p className="font-medium">{location}</p>
                    </div>
                    {profile.companeros_count && (
                      <div>
                        <span className="text-muted-foreground">
                          {hasApartment ? 'Compañeros que busco:' : 'Compañeros que busco:'}
                        </span>
                        <p className="font-medium">{profile.companeros_count}</p>
                      </div>
                    )}
                    {lifestyleData.budget && !hasApartment && (
                      <div>
                        <span className="text-muted-foreground">Mi presupuesto:</span>
                        <p className="font-medium">{lifestyleData.budget}</p>
                      </div>
                    )}
                  </div>
                </Card>

                {/* Apartment details for users who have a flat */}
                {hasApartment && (
                  <Card className="mt-4 p-4">
                    <h3 className="font-medium text-sm mb-3 flex items-center gap-1">
                      <Home size={16} className="text-homi-purple" /> Mi piso
                    </h3>
                    <div className="text-sm space-y-2">
                      {lifestyleData.room_count && (
                        <div>
                          <span className="text-muted-foreground">Habitaciones:</span>
                          <p className="font-medium">{lifestyleData.room_count}</p>
                        </div>
                      )}
                      {lifestyleData.room_price && (
                        <div>
                          <span className="text-muted-foreground">Precio por habitación:</span>
                          <p className="font-medium">{lifestyleData.room_price}</p>
                        </div>
                      )}
                      {lifestyleData.apartment_description && (
                        <div>
                          <span className="text-muted-foreground">Descripción:</span>
                          <p className="font-medium text-xs bg-gray-50 p-2 rounded-md mt-1">{lifestyleData.apartment_description}</p>
                        </div>
                      )}
                    </div>
                  </Card>
                )}
              </div>
              
              <div className="md:col-span-2">
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Mi información personal</h2>
                  
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
                        <GraduationCap size={18} />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Universidad</p>
                        <p className="font-medium">{profile.universidad || 'No especificado'}</p>
                        {lifestyleData.field_of_study && (
                          <p className="text-sm text-muted-foreground mt-1">
                            Estudio: {lifestyleData.field_of_study}
                          </p>
                        )}
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
                    <h3 className="font-medium mb-2">Sobre mí</h3>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-md">
                      {profile.bio || 'Añade una descripción para que los demás te conozcan mejor.'}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2 flex items-center gap-1">
                      <Tag size={16} className="text-homi-purple" /> Mis intereses
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
                  <h2 className="text-xl font-semibold mb-4">Mi estilo de vida</h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                    {lifestyleData.schedule && (
                      <div className="flex items-start gap-2">
                        <Clock size={16} className="text-homi-purple mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Horario</p>
                          <p className="font-medium">{getLifestyleText('schedule', lifestyleData.schedule)}</p>
                        </div>
                      </div>
                    )}
                    
                    {lifestyleData.cleanliness && (
                      <div className="flex items-start gap-2">
                        <Trash2 size={16} className="text-homi-purple mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Limpieza</p>
                          <p className="font-medium">{getLifestyleText('cleanliness', lifestyleData.cleanliness)}</p>
                        </div>
                      </div>
                    )}
                    
                    {lifestyleData.smoking && (
                      <div className="flex items-start gap-2">
                        <Cigarette size={16} className="text-homi-purple mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Fumar</p>
                          <p className="font-medium">{getLifestyleText('smoking', lifestyleData.smoking)}</p>
                        </div>
                      </div>
                    )}
                    
                    {lifestyleData.pets && (
                      <div className="flex items-start gap-2">
                        <PawPrint size={16} className="text-homi-purple mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Mascotas</p>
                          <p className="font-medium">{getLifestyleText('pets', lifestyleData.pets)}</p>
                        </div>
                      </div>
                    )}
                    
                    {lifestyleData.guests && (
                      <div className="flex items-start gap-2">
                        <Users size={16} className="text-homi-purple mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Invitados</p>
                          <p className="font-medium">{getLifestyleText('guests', lifestyleData.guests)}</p>
                        </div>
                      </div>
                    )}

                    {!lifestyleData.schedule && 
                     !lifestyleData.cleanliness && 
                     !lifestyleData.smoking && 
                     !lifestyleData.pets && 
                     !lifestyleData.guests && (
                      <p className="text-gray-500 italic text-sm col-span-2">
                        No has especificado preferencias de estilo de vida. Edita tu perfil para añadirlas.
                      </p>
                    )}
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
