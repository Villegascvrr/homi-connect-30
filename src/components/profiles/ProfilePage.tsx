
import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  MessageSquare, 
  Share, 
  Heart, 
  Home, 
  Briefcase, 
  GraduationCap, 
  UserCheck, 
  Pencil, 
  Download, 
  QrCode, 
  Camera 
} from 'lucide-react';
import QRCode from 'qrcode.react';
import html2canvas from 'html2canvas';

const ProfilePage = () => {
  const [liked, setLiked] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  
  // Sample profile data - in a real app, this would come from your backend
  const profile = {
    id: '1',
    name: 'Elena García',
    age: 23,
    location: 'Madrid',
    university: 'Universidad Complutense de Madrid',
    occupation: 'Estudiante de Arquitectura',
    bio: 'Soy una estudiante apasionada por el diseño y la arquitectura. Me gusta leer, visitar museos y disfrutar de noches tranquilas en casa. Soy ordenada y respetuosa con los espacios compartidos. Busco un piso cerca de la universidad con personas afines a mi estilo de vida.',
    imgUrl: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7',
    galleryImgs: [
      'https://images.unsplash.com/photo-1649972904349-6e44c42644a7',
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158'
    ],
    tags: [
      { id: 1, name: 'Ordenada' },
      { id: 2, name: 'Tranquila' },
      { id: 3, name: 'Estudiante' },
      { id: 4, name: 'Lectora' },
      { id: 5, name: 'Madrugadora' }
    ],
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
    setShowShareDialog(true);
    console.log('Share profile:', profile.id);
  };

  const handleEditProfile = () => {
    setIsEditing(true);
    console.log('Edit profile:', profile.id);
    // In a real implementation, this would navigate to the edit form
  };

  const handleDownloadCard = () => {
    const card = document.getElementById('profile-card');
    if (card) {
      html2canvas(card).then(canvas => {
        const link = document.createElement('a');
        link.download = `perfil-${profile.name.toLowerCase().replace(/\s+/g, '-')}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      });
    }
  };

  // Generate the profile URL - in a real app, use your actual domain
  const profileUrl = `https://homi-connect.app/profile/${profile.id}`;

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
                
                {/* Edit profile button */}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="absolute top-4 right-4 rounded-full bg-white/80 hover:bg-white"
                  onClick={handleEditProfile}
                >
                  <Pencil size={16} className="mr-2" />
                  Editar Perfil
                </Button>
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

                {/* Profile presentation card */}
                <div className="glass-card p-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <QrCode size={20} className="text-homi-purple" />
                    Tarjeta de presentación
                  </h2>
                  <p className="text-muted-foreground mb-4">
                    Comparte tu perfil en redes sociales o descarga tu tarjeta de presentación con código QR.
                  </p>
                  
                  <div className="mt-4 flex flex-col items-center">
                    <div 
                      id="profile-card" 
                      className="w-full max-w-md p-6 bg-white rounded-xl shadow-md mb-4 relative overflow-hidden"
                    >
                      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-homi-purple to-pink-500"></div>
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-homi-purple">
                          <img
                            src={profile.imgUrl}
                            alt={profile.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold">{profile.name}, {profile.age}</h3>
                          <p className="text-sm text-muted-foreground">{profile.location}</p>
                          <p className="text-sm">{profile.occupation}</p>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center mt-4">
                        <div className="flex-1">
                          <div className="flex flex-wrap gap-1 mb-2">
                            {profile.tags.slice(0, 3).map((tag) => (
                              <span 
                                key={tag.id} 
                                className="px-2 py-0.5 text-xs rounded-full bg-homi-ultraLightPurple text-homi-purple"
                              >
                                {tag.name}
                              </span>
                            ))}
                          </div>
                          <p className="text-xs line-clamp-2">{profile.bio}</p>
                        </div>
                        <div className="ml-4">
                          <QRCode value={profileUrl} size={80} />
                        </div>
                      </div>
                      
                      <div className="mt-3 text-center text-xs text-muted-foreground">
                        <p>¡Escanea el código para ver mi perfil completo en Homi!</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <Button 
                        onClick={handleDownloadCard}
                        className="bg-homi-purple hover:bg-homi-purple/90"
                      >
                        <Download size={16} className="mr-2" />
                        Descargar Tarjeta
                      </Button>
                      
                      <Button 
                        variant="outline"
                        onClick={handleShare}
                      >
                        <Share size={16} className="mr-2" />
                        Compartir Perfil
                      </Button>
                    </div>
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

                {/* QR Code */}
                <div className="glass-card p-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <QrCode size={20} className="text-homi-purple" />
                    Código QR de mi perfil
                  </h2>
                  <div className="flex flex-col items-center">
                    <div className="bg-white p-4 rounded-xl mb-3">
                      <QRCode value={profileUrl} size={150} />
                    </div>
                    <p className="text-sm text-center text-muted-foreground mb-3">
                      Escanea este código para compartir tu perfil con posibles compañeros de piso
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleDownloadCard}
                      className="w-full"
                    >
                      <Download size={16} className="mr-2" />
                      Descargar QR
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Share dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Compartir mi perfil</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex items-center space-x-2 pb-2">
              <div className="grid flex-1 gap-2">
                <p className="text-sm text-muted-foreground">
                  Enlace a tu perfil:
                </p>
                <div className="flex">
                  <input
                    className="flex h-10 w-full rounded-l-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={profileUrl}
                    readOnly
                  />
                  <Button 
                    className="rounded-l-none bg-homi-purple hover:bg-homi-purple/90"
                    onClick={() => {
                      navigator.clipboard.writeText(profileUrl);
                      alert('¡Enlace copiado!');
                    }}
                  >
                    Copiar
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-4 gap-2">
              <Button 
                variant="outline" 
                className="flex flex-col h-auto p-3 items-center justify-center"
                onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`¡Hola! Mira mi perfil en Homi: ${profileUrl}`)}`, '_blank')}
              >
                <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center mb-1">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19.1131 4.96331C15.2938 1.07156 8.95542 1.07156 5.13615 4.96331C1.9246 8.23331 1.31688 13.2791 3.44764 17.1158L2.25605 22L7.2333 20.8084C8.91444 21.7458 10.7062 22.21 12.5062 22.21C17.8396 22.21 22.2119 17.7458 22.2119 12.3042C22.1208 9.61331 21.0219 7.0975 19.1131 4.96331ZM12.4242 20.4042C10.8065 20.4042 9.18915 19.94 7.7521 19.0937L7.42187 18.9116L4.54644 19.6284L5.2271 16.7033L5.04498 16.3302C2.32498 12.7684 3.35035 7.8253 7.00873 5.10586C10.6671 2.38642 15.4923 3.41165 18.2123 7.06998C20.9323 10.7283 19.9069 15.5534 16.2485 18.2733C14.8115 19.6284 13.6562 20.4042 12.4242 20.4042ZM16.8562 14.7233L16.221 14.3958C16.221 14.3958 15.2938 13.9772 14.6946 13.6402C14.6035 13.6402 14.5125 13.5491 14.4215 13.5491C14.2394 13.5491 14.1483 13.6402 14.0573 13.6402C14.0573 13.6402 14.0573 13.7312 13.5477 14.3958C13.4567 14.5778 13.2746 14.5778 13.1835 14.4958C13.0923 14.4958 12.0846 14.0772 11.0767 13.1538C10.2598 12.4369 9.71654 11.5588 9.53442 11.2958C9.53442 11.2047 9.44338 11.1136 9.44338 11.0228V10.85C9.44338 10.759 9.53442 10.6679 9.53442 10.6679C9.53442 10.6679 9.80209 10.3947 9.98421 10.2126C10.0752 10.1214 10.1663 9.93937 10.2573 9.84833C10.3483 9.6662 10.2573 9.48411 10.1663 9.39307C10.1663 9.39307 9.53442 8.01307 9.35231 7.74543C9.17019 7.47779 8.89795 7.47779 8.71584 7.47779C8.71584 7.47779 8.34348 7.47779 8.06246 7.47779C7.97142 7.47779 7.88038 7.56884 7.78934 7.56884L7.7521 7.60607C7.7521 7.60607 7.2427 7.74543 6.88372 8.19142C6.5248 8.57301 6.0696 9.39307 6.0696 10.6679C6.0696 11.8516 6.70773 12.9441 6.88372 13.2118C6.97476 13.3028 8.8 16.1298 11.5404 17.3136C13.0923 17.9872 13.7304 18.0782 14.55 17.8961C15.0685 17.805 15.8483 17.296 16.0304 16.618C16.2125 15.9491 16.2123 15.3689 16.1213 15.2869C16.221 15.296 16.7667 15.0598 16.8562 14.7233Z" fill="white"/>
                  </svg>
                </div>
                <span className="text-xs">WhatsApp</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="flex flex-col h-auto p-3 items-center justify-center"
                onClick={() => window.open(`https://telegram.me/share/url?url=${encodeURIComponent(profileUrl)}&text=${encodeURIComponent('¡Mira mi perfil en Homi!')}`, '_blank')}
              >
                <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center mb-1">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="#229ED9"/>
                    <path d="M17.28 8.32L15.3733 17.1067C15.3733 17.1067 15.1067 17.76 14.4133 17.4933L9.94667 13.7867L8.53334 13.12L5.81334 12.24C5.81334 12.24 5.41334 12.1067 5.38667 11.84C5.36 11.5733 5.84 11.4133 5.84 11.4133L16.56 7.45332C16.56 7.45332 17.28 7.12 17.28 7.68V8.32Z" fill="white"/>
                    <path d="M9.76001 16.88C9.76001 16.88 9.57335 16.8533 9.41335 16.48C9.25335 16.1067 8.53335 13.7867 8.53335 13.7867L14.1467 10.16C14.1467 10.16 14.48 9.94666 14.4667 10.16C14.4667 10.16 14.5333 10.1867 14.32 10.3733C14.1067 10.56 9.97335 13.84 9.97335 13.84" fill="#D2E5F1"/>
                    <path d="M11.7867 15.0133L9.89333 16.84C9.89333 16.84 9.78667 16.92 9.76 16.88L9.96 13.9067" fill="#B5CFE4"/>
                  </svg>
                </div>
                <span className="text-xs">Telegram</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="flex flex-col h-auto p-3 items-center justify-center"
                onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(profileUrl)}`, '_blank')}
              >
                <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center mb-1">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13.397 20.997V12.801H16.162L16.573 9.59201H13.397V7.54801C13.397 6.62201 13.655 5.98801 14.984 5.98801H16.668V3.12701C16.3704 3.08774 15.1609 3.00001 13.7745 3.00001C10.8954 3.00001 8.9079 4.65701 8.9079 7.22301V9.59201H6.33203V12.801H8.9079V20.997H13.397Z" fill="white"/>
                  </svg>
                </div>
                <span className="text-xs">Facebook</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="flex flex-col h-auto p-3 items-center justify-center"
                onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent('¡Comparto mi perfil en Homi! ' + profileUrl)}`, '_blank')}
              >
                <div className="h-10 w-10 rounded-full bg-black flex items-center justify-center mb-1">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14.2832 10.7144L19.9395 4H18.5254L13.6543 9.71429L9.75977 4H4L10.0254 12.5714L4 19.7143H5.41406L10.6543 13.5714L14.8008 19.7143H20.5605L14.2832 10.7144ZM11.377 12.6857L10.7051 11.7286L6.0625 5.07143H8.95996L12.6152 10.4L13.2871 11.3571L18.1836 18.4286H15.2861L11.377 12.6857Z" fill="white"/>
                  </svg>
                </div>
                <span className="text-xs">Twitter</span>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default ProfilePage;
