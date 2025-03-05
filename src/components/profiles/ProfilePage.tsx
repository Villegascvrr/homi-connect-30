
import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CompatibilityBadge from '@/components/ui/CompatibilityBadge';
import { Button } from '@/components/ui/button';
import { MessageSquare, Share, Heart, Home, Briefcase, GraduationCap, UserCheck } from 'lucide-react';

const ProfilePage = () => {
  const [liked, setLiked] = useState(false);
  
  // Sample profile data
  const profile = {
    id: '1',
    name: 'Elena García',
    age: 23,
    location: 'Madrid',
    university: 'Universidad Complutense de Madrid',
    occupation: 'Estudiante de Arquitectura',
    bio: 'Soy una estudiante apasionada por el diseño y la arquitectura. Me gusta leer, visitar museos y disfrutar de noches tranquilas en casa. Soy ordenada y respetuosa con los espacios compartidos. Busco un piso cerca de la universidad con personas afines a mi estilo de vida.',
    imgUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
    galleryImgs: [
      'https://images.unsplash.com/photo-1461749280684-dccba630e2f6',
      'https://images.unsplash.com/photo-1518770660439-4636190af475',
      'https://images.unsplash.com/photo-1649972904349-6e44c42644a7'
    ],
    tags: [
      { id: 1, name: 'Ordenada' },
      { id: 2, name: 'Tranquila' },
      { id: 3, name: 'Estudiante' },
      { id: 4, name: 'Lectora' },
      { id: 5, name: 'Madrugadora' }
    ],
    compatibility: 87,
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
    }
  };

  const handleLike = () => {
    setLiked(!liked);
    console.log('Liked profile:', profile.id);
  };

  const handleMessage = () => {
    console.log('Message to:', profile.id);
  };

  const handleShare = () => {
    console.log('Share profile:', profile.id);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-20 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Profile header */}
            <div className="glass-card overflow-hidden">
              <div className="relative h-64 bg-homi-ultraLightPurple">
                <img
                  src={profile.imgUrl}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 right-4">
                  <CompatibilityBadge percentage={profile.compatibility} size="lg" />
                </div>
              </div>
              
              <div className="relative px-6 py-8">
                {/* Profile avatar */}
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
                        {profile.name}, {profile.age}
                      </h1>
                      <p className="text-muted-foreground flex items-center gap-1 mt-1">
                        <Home size={16} />
                        {profile.location}
                      </p>
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
              {/* Left column */}
              <div className="md:col-span-2 space-y-6">
                {/* Bio section */}
                <div className="glass-card p-6">
                  <h2 className="text-xl font-semibold mb-4">Sobre mí</h2>
                  <p>{profile.bio}</p>
                  
                  <div className="mt-6">
                    <h3 className="font-medium mb-2">Datos personales</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <GraduationCap size={18} className="text-homi-purple" />
                        <span>{profile.university}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Briefcase size={18} className="text-homi-purple" />
                        <span>{profile.occupation}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="font-medium mb-2">Intereses</h3>
                    <div className="flex flex-wrap gap-2">
                      {profile.tags.map((tag) => (
                        <span 
                          key={tag.id} 
                          className="px-3 py-1 text-sm rounded-full bg-homi-ultraLightPurple text-homi-purple"
                        >
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Gallery */}
                <div className="glass-card p-6">
                  <h2 className="text-xl font-semibold mb-4">Galería</h2>
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
                </div>
              </div>
              
              {/* Right column */}
              <div className="space-y-6">
                {/* Preferences */}
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
                
                {/* Lifestyle */}
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

export default ProfilePage;
