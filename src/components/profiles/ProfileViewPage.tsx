import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MessageSquare, Share, Heart, Home, Briefcase, GraduationCap, UserCheck, AtSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Define interfaces for our lifestyle data to help with TypeScript
interface LifestylePreferences {
  budget?: string;
  location?: string;
  roommates?: string;
  moveInDate?: string;
}

interface LifestyleDetails {
  cleanliness?: string;
  guests?: string;
  smoking?: string;
  pets?: string;
  schedule?: string;
}

interface ProfileLifestyle {
  preferences?: LifestylePreferences;
  details?: LifestyleDetails;
}

const ProfileViewPage = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState<any>(null);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        
        if (!id) {
          setLoading(false);
          return;
        }
        
        // Fetch the profile data from Supabase
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) {
          console.error('Error fetching profile:', error);
          setLoading(false);
          return;
        }
        
        // Log the raw data from the database
        console.log("Raw profile data from Supabase:", data);
        
        // Transform the data to match the expected structure
        if (data) {
          // Parse lifestyle JSON if it exists
          let lifestyleObj: ProfileLifestyle = {};
          
          if (data.lifestyle) {
            // Handle the case when lifestyle is a string or JSON object
            if (typeof data.lifestyle === 'string') {
              try {
                lifestyleObj = JSON.parse(data.lifestyle);
              } catch (e) {
                console.error('Error parsing lifestyle JSON:', e);
              }
            } else {
              // If it's already an object, use it directly
              lifestyleObj = data.lifestyle as ProfileLifestyle;
            }
          }
          
          console.log("Parsed lifestyle object:", lifestyleObj);
          
          const formattedProfile = {
            id: data.id,
            name: `${data.first_name || ''} ${data.last_name || ''}`.trim(),
            username: data.username || '',
            age: data.edad || 'No especificado',
            location: data.ubicacion || 'No especificado',
            university: data.universidad || 'No especificado',
            occupation: data.ocupacion || 'No especificado',
            bio: data.bio || 'Sin descripción disponible',
            imgUrl: data.profile_image || 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7',
            galleryImgs: data.gallery_images || [],
            tags: data.interests ? data.interests.map((interest: string, index: number) => ({
              id: index + 1,
              name: interest
            })) : [],
            verified: true,
            preferences: {
              budget: lifestyleObj?.preferences?.budget || 'No especificado',
              location: data.sevilla_zona || 'No especificado',
              roommates: data.companeros_count || 'No especificado',
              moveInDate: lifestyleObj?.preferences?.moveInDate || 'No especificado'
            },
            lifestyle: {
              cleanliness: lifestyleObj?.details?.cleanliness || 'No especificado',
              guests: lifestyleObj?.details?.guests || 'No especificado',
              smoking: lifestyleObj?.details?.smoking || 'No especificado',
              pets: lifestyleObj?.details?.pets || 'No especificado',
              schedule: lifestyleObj?.details?.schedule || 'No especificado'
            }
          };
          
          console.log("Formatted profile:", formattedProfile);
          setProfile(formattedProfile);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error in fetchProfile:', error);
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [id]);

  const handleLike = () => {
    setLiked(!liked);
    toast({
      title: liked ? "Eliminado de favoritos" : "Añadido a favoritos",
      description: liked ? "Has eliminado este perfil de tus favoritos" : "Has añadido este perfil a tus favoritos",
    });
  };

  const handleMessage = () => {
    toast({
      title: "Mensaje enviado",
      description: "Tu solicitud para conectar ha sido enviada. Te notificaremos cuando respondan.",
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Perfil de ${profile?.name || 'usuario'} en Homi`,
        text: `¡Echa un vistazo a este perfil en Homi!`,
        url: window.location.href,
      })
      .catch(error => console.log('Error sharing', error));
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Enlace copiado",
        description: "El enlace al perfil ha sido copiado al portapapeles",
      });
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

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Perfil no encontrado</h1>
            <p className="text-muted-foreground mb-6">No hemos podido encontrar el perfil que buscas.</p>
            <Button onClick={() => navigate(-1)}>Volver atrás</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Aseguramos que galleryImgs siempre tenga al menos una imagen
  const galleryImages = profile.galleryImgs && profile.galleryImgs.length > 0
    ? profile.galleryImgs
    : profile.imgUrl ? [profile.imgUrl] : ['https://images.unsplash.com/photo-1649972904349-6e44c42644a7'];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-20 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="glass-card overflow-hidden">
              <div className="relative h-64 bg-homi-ultraLightPurple">
                <img
                  src={profile.imgUrl}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="relative px-6 py-8">
                <div className="absolute -top-16 left-6 w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                  <img
                    src={profile.imgUrl}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                  {profile.verified && (
                    <div className="absolute bottom-0 right-0 bg-homi-purple text-white p-1 rounded-full">
                      <UserCheck size={16} />
                    </div>
                  )}
                </div>
                
                <div className="ml-36">
                  <div className="flex justify-between">
                    <div>
                      <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                        {profile.name}{profile.age && profile.age !== 'No especificado' ? `, ${profile.age}` : ''}
                      </h1>
                      {profile.username && (
                        <p className="text-muted-foreground flex items-center gap-1 mt-1">
                          <AtSign size={16} className="text-homi-purple" />
                          <span className="font-medium">{profile.username}</span>
                        </p>
                      )}
                      {profile.location && profile.location !== 'No especificado' && (
                        <p className="text-muted-foreground flex items-center gap-1 mt-1">
                          <Home size={16} />
                          {profile.location}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant={liked ? "default" : "outline"}
                        size="sm"
                        className={`rounded-full ${liked ? 'bg-homi-purple hover:bg-homi-purple/90' : ''}`}
                        onClick={handleLike}
                      >
                        <Heart size={18} className={liked ? 'mr-2 fill-white' : 'mr-2'} />
                        {liked ? 'Te gusta' : 'Me gusta'}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="rounded-full"
                        onClick={handleShare}
                      >
                        <Share size={18} />
                      </Button>
                      <Button 
                        size="sm" 
                        className="rounded-full bg-homi-purple hover:bg-homi-purple/90"
                        onClick={handleMessage}
                      >
                        <MessageSquare size={18} className="mr-2" />
                        Mensaje
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div className="md:col-span-2 space-y-6">
                <div className="glass-card p-6">
                  <h2 className="text-xl font-semibold mb-4">Sobre mí</h2>
                  <p>{profile.bio}</p>
                  
                  <div className="mt-6">
                    <h3 className="font-medium mb-2">Datos personales</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {profile.university && profile.university !== 'No especificado' && (
                        <div className="flex items-center gap-2">
                          <GraduationCap size={18} className="text-homi-purple" />
                          <span>{profile.university}</span>
                        </div>
                      )}
                      {profile.occupation && profile.occupation !== 'No especificado' && (
                        <div className="flex items-center gap-2">
                          <Briefcase size={18} className="text-homi-purple" />
                          <span>{profile.occupation}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {profile.tags && profile.tags.length > 0 && (
                    <div className="mt-6">
                      <h3 className="font-medium mb-2">Intereses</h3>
                      <div className="flex flex-wrap gap-2">
                        {profile.tags.map((tag: any) => (
                          <span 
                            key={tag.id} 
                            className="px-3 py-1 text-sm rounded-full bg-homi-ultraLightPurple text-homi-purple"
                          >
                            {tag.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                {galleryImages && galleryImages.length > 0 && (
                  <div className="glass-card p-6">
                    <h2 className="text-xl font-semibold mb-4">Galería</h2>
                    <div className="grid grid-cols-3 gap-4">
                      {galleryImages.map((img: string, index: number) => (
                        <div key={index} className="aspect-square rounded-lg overflow-hidden bg-muted">
                          <img
                            src={img}
                            alt={`Imagen ${index + 1}`}
                            className="w-full h-full object-cover transition-transform hover:scale-105"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="space-y-6">
                <div className="glass-card p-6">
                  <h2 className="text-xl font-semibold mb-4">Preferencias de vivienda</h2>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-muted-foreground">Presupuesto:</span>
                      <p className="font-medium">{profile.preferences.budget}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Ubicación:</span>
                      <p className="font-medium">{profile.preferences.location}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Compañeros:</span>
                      <p className="font-medium">{profile.preferences.roommates}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Fecha de mudanza:</span>
                      <p className="font-medium">{profile.preferences.moveInDate}</p>
                    </div>
                  </div>
                </div>
                
                <div className="glass-card p-6">
                  <h2 className="text-xl font-semibold mb-4">Estilo de vida</h2>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-muted-foreground">Limpieza:</span>
                      <p className="font-medium">{profile.lifestyle.cleanliness}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Invitados:</span>
                      <p className="font-medium">{profile.lifestyle.guests}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Fumar:</span>
                      <p className="font-medium">{profile.lifestyle.smoking}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Mascotas:</span>
                      <p className="font-medium">{profile.lifestyle.pets}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Horario:</span>
                      <p className="font-medium">{profile.lifestyle.schedule}</p>
                    </div>
                  </div>
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

export default ProfileViewPage;
