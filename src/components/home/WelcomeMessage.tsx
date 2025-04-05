
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { Instagram, UserRound } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WelcomeMessageProps {
  firstName?: string;
}

const WelcomeMessage = ({ firstName }: WelcomeMessageProps) => {
  const [followed, setFollowed] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

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
    navigate('/profile');
  }

  return (
    <div className="bg-white dark:bg-card border border-border rounded-xl p-6 shadow-md animate-fade-in max-w-3xl mx-auto">
      <div className="flex items-center justify-center mb-4">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
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
      
      <h2 className="text-2xl font-bold text-center mb-2">
        ¡Gracias por registrarte{firstName ? `, ${firstName}` : ''}!
      </h2>
      
      <p className="text-center text-muted-foreground mb-4">
        Te avisaremos cuando la aplicación esté completamente disponible.
        Mientras tanto, puedes completar tu perfil para estar listo cuando lancemos.
      </p>
      
      <div className="bg-homi-ultraLightPurple/50 p-3 rounded-xl mb-4 text-center">
        <p className="text-sm font-medium text-homi-purple">
          Homi estará disponible próximamente - ¡Te notificaremos cuando esté listo!
        </p>
      </div>
      
      <div className="flex flex-col gap-4 mt-6">
        <Button 
          onClick={handleProfileClick} 
          className="w-full bg-gradient-to-r from-homi-purple to-homi-lightPurple hover:from-homi-lightPurple hover:to-homi-purple text-white font-bold shadow-lg shadow-purple-500/30 transform hover:scale-105 transition-all duration-300 rounded-full"
        >
          <UserRound className="mr-2 h-4 w-4" />
          Completar mi perfil
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
