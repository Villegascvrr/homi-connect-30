
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Instagram, UserRound } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface WelcomeMessageProps {
  firstName?: string;
}

const WelcomeMessage = ({ firstName }: WelcomeMessageProps) => {
  const [followed, setFollowed] = useState(false);

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
      
      <div className="flex flex-col gap-4 mt-6">
        <Button asChild className="w-full bg-gradient-to-r from-homi-purple to-homi-lightPurple hover:from-homi-lightPurple hover:to-homi-purple text-white font-bold shadow-lg shadow-purple-500/30 transform hover:scale-105 transition-all duration-300 rounded-full">
          <Link to="/profile">
            <UserRound className="mr-2 h-4 w-4" />
            Completar mi perfil
          </Link>
        </Button>
        
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-2">
            Síguenos en redes sociales para enterarte de las últimas novedades:
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
