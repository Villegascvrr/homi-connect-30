
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Instagram, UserRound } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

interface WelcomeMessageProps {
  firstName?: string;
  showWelcomeToast?: boolean;
}

const WelcomeMessage = ({ firstName, showWelcomeToast = false }: WelcomeMessageProps) => {
  const [followed, setFollowed] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Solo muestra el toast de bienvenida si se solicita explícitamente a través de props Y el usuario está autenticado
  useEffect(() => {
    if (showWelcomeToast && user) {
      // Usar un pequeño timeout para asegurar que el componente esté completamente montado
      const timer = setTimeout(() => {
        toast({
          title: "¡Bienvenido a HomiMatch!",
          description: "Tu cuenta ha sido creada correctamente.",
          duration: 6000,
        });
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [user, toast, showWelcomeToast]);
  
  // Usa el nombre de pila de props o del usuario si está disponible
  const displayName = firstName || (user?.user_metadata?.firstName || user?.user_metadata?.first_name || '');

  const handleInstagramClick = () => {
    window.open('https://instagram.com/homimatch', '_blank');
    if (!followed) {
      setFollowed(true);
      toast({
        title: "¡Gracias por seguirnos!",
        description: "Te mantendremos informado de todas las novedades",
      });
    }
  };

  const handleProfileClick = () => {
    // Navega a la página de edición de perfil con una bandera en la URL para indicar que es un nuevo usuario
    navigate('/profile/edit?new=true');
    
    toast({
      title: "Completa tu perfil",
      description: "Completa tu información para encontrar compañeros compatibles",
      duration: 5000, // Mayor duración para nuevos usuarios
    });
  }

  return (
    <div className="bg-white dark:bg-card border border-border rounded-xl p-6 shadow-md animate-fade-in max-w-3xl mx-auto">
      <div className="flex items-center justify-center mb-4">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 animate-bounce">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="32" 
            height="32" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
      </div>
      
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-4 homi-gradient-text">
        ¡Bienvenido a HomiMatch{displayName ? `, ${displayName}` : ''}!
      </h2>
      
      <p className="text-center text-muted-foreground mb-6">
        Te avisaremos cuando la aplicación esté completamente disponible.
        Mientras tanto, completa tu perfil para estar listo cuando lancemos.
      </p>
      
      <div className="bg-homi-ultraLightPurple/50 p-4 rounded-xl mb-6 text-center border border-homi-purple/20">
        <p className="text-sm font-medium text-homi-purple">
          Homi estará disponible próximamente - ¡Te notificaremos cuando esté listo!
        </p>
      </div>
      
      <div className="flex flex-col gap-4 mt-6">
        <Button 
          onClick={handleProfileClick} 
          className="w-full bg-gradient-to-r from-homi-purple to-homi-lightPurple hover:from-homi-lightPurple hover:to-homi-purple text-white font-bold shadow-lg shadow-purple-500/30 transform hover:scale-105 transition-all duration-300 rounded-full py-6"
        >
          <UserRound className="mr-2 h-5 w-5" />
          Completar mi perfil ahora
        </Button>
        
        <div className="text-center mt-4">
          <p className="text-sm text-muted-foreground mb-2">
            Síguenos en Instagram para enterarte de las últimas novedades:
          </p>
          <Button 
            variant="outline" 
            onClick={handleInstagramClick} 
            className="gap-2 rounded-full"
          >
            <Instagram size={18} />
            @homimatch
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeMessage;
