
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Check, Instagram, MessageCircle } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import EmailSignup from './EmailSignup';
import WelcomeMessage from './WelcomeMessage';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Hero = () => {
  const [email, setEmail] = useState('');
  const [showSignupForm, setShowSignupForm] = useState(false);
  const [justRegistered, setJustRegistered] = useState(false);
  const [justLoggedIn, setJustLoggedIn] = useState(false);
  const isMobile = useIsMobile();
  const {
    user,
    isEmailVerified
  } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      const urlParams = new URLSearchParams(window.location.search);
      const isRegistered = urlParams.get('registered') === 'true';
      const isLoggedIn = urlParams.get('loggedIn') === 'true';
      
      if (isRegistered) {
        console.log("Usuario recién registrado, mostrando mensaje de bienvenida");
        setJustRegistered(true);
        setJustLoggedIn(false);
        
        // Limpiar parámetros URL después de procesarlos
        window.history.replaceState({}, document.title, window.location.pathname);
      } else if (isLoggedIn) {
        console.log("Usuario recién conectado, mostrando mensaje de bienvenida");
        setJustLoggedIn(true);
        setJustRegistered(false);
        
        // Limpiar parámetros URL después de procesarlos
        window.history.replaceState({}, document.title, window.location.pathname);
      } else {
        setJustRegistered(false);
        setJustLoggedIn(false);
      }
    } else {
      setJustRegistered(false);
      setJustLoggedIn(false);
    }
  }, [user, location.search]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Subscribed with email:', email);
    setEmail('');
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  const renderContent = () => {
    if (user && (justRegistered || justLoggedIn)) {
      return <WelcomeMessage 
        firstName={user?.user_metadata?.firstName || user?.user_metadata?.first_name || user?.user_metadata?.name || user?.user_metadata?.full_name}
        showWelcomeToast={true}
        isNewUser={justRegistered}
      />;
    }
    
    if (user && !justRegistered && !justLoggedIn) {
      return (
        <>
          <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-green-100 text-green-700 text-xs md:text-sm font-medium">
            <Check className="inline-block mr-1 h-4 w-4" /> Usuario conectado
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 animate-slide-up leading-tight px-2">
            ¡Bienvenido a <span className="homi-gradient-text">HomiMatch</span>!
          </h1>
          
          <p className="text-base md:text-lg text-muted-foreground mb-6 max-w-2xl mx-auto px-2">
            Gracias por iniciar sesión. Te notificaremos cuando la aplicación esté completamente funcional.
            Mientras tanto, puedes explorar algunas de las características disponibles o completar tu perfil.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 mb-8">
            <Button size={isMobile ? "default" : "lg"} className="rounded-full bg-gradient-to-r from-homi-purple to-homi-lightPurple hover:from-homi-lightPurple hover:to-homi-purple text-white font-bold shadow-lg shadow-purple-500/30 transform hover:scale-105 transition-all duration-300 w-full sm:w-auto" asChild>
              <Link to="/profile">Completar mi perfil</Link>
            </Button>
            <Button size={isMobile ? "default" : "lg"} variant="outline" className="rounded-full w-full sm:w-auto" asChild>
              <Link to="/matching">Explorar perfiles</Link>
            </Button>
          </div>
          
          <div className="mt-6 flex flex-wrap justify-center gap-8">
            <div>
              <p className="text-sm text-muted-foreground mb-3">
                Entérate de las últimas novedades:
              </p>
              <Button variant="outline" className="rounded-full gap-2 bg-purple-50 text-purple-600 border-purple-200 hover:bg-purple-100 hover:text-purple-700" onClick={() => window.open('https://instagram.com/homimatch', '_blank')}>
                <Instagram size={18} />
                @homimatch
              </Button>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-3">
                Busca compañeros y piso en nuestro grupo:
              </p>
              <Button variant="outline" className="rounded-full gap-2 bg-green-50 text-green-600 border-green-200 hover:bg-green-100 hover:text-green-700" onClick={() => window.open('https://chat.whatsapp.com/FPqg8M2kGdm9G49j4YIAMB', '_blank')}>
                <MessageCircle size={18} />
                Grupo de WhatsApp
              </Button>
            </div>
          </div>
        </>
      );
    }
    
    return (
      <>
        <div className="inline-block px-4 py-1.5 mb-1 md:mb-2 rounded-full bg-homi-ultraLightPurple text-homi-purple text-xs md:text-sm font-medium animate-pulse-soft">
          ¡Ayúdanos a alcanzar los primeros 1000 usuarios!
        </div>
        
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 animate-slide-up leading-tight px-2 my-0">
          Conecta con <span className="homi-gradient-text">compañeros de piso</span> compatibles
        </h1>
        
        <p className="text-base md:text-xl text-muted-foreground mb-6 max-w-2xl mx-auto px-2">HomiMatch utiliza un sistema de matching inteligente para conectarte con compañeros de piso que comparten tus intereses y estilo de vida.</p>

        <div className="bg-homi-ultraLightPurple/50 p-4 md:p-5 rounded-xl mb-6 max-w-2xl mx-auto">
          <p className="text-sm md:text-base font-medium text-homi-purple">
            HomiMatch estará disponible próximamente - ¡Regístrate ahora para ser de los primeros en usarlo!
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 mt-6">
          <Button size={isMobile ? "default" : "lg"} className="rounded-full bg-gradient-to-r from-homi-purple to-homi-lightPurple hover:from-homi-lightPurple hover:to-homi-purple text-white font-bold shadow-lg shadow-purple-500/30 transform hover:scale-105 transition-all duration-300 w-full sm:w-auto" onClick={handleRegisterClick}>
            ¡Regístrate ahora!
          </Button>
        </div>

        <div className="mt-6 pt-6 border-t border-border/30">
          <p className="text-sm font-medium mb-3 text-muted-foreground">Mientras tanto,</p>
          <div className="flex flex-wrap justify-center gap-8">
            <div>
              <p className="text-sm font-medium mb-3 text-muted-foreground">
                Busca compañeros y piso en nuestro grupo:
              </p>
              <Button variant="outline" className="rounded-full gap-2 bg-green-50 text-green-600 border-green-200 hover:bg-green-100 hover:text-green-700" onClick={() => window.open('https://chat.whatsapp.com/FPqg8M2kGdm9G49j4YIAMB', '_blank')}>
                <MessageCircle size={18} />
                Unirse al grupo de WhatsApp
              </Button>
            </div>
            <div>
              <p className="text-sm font-medium mb-3 text-muted-foreground">
                Entérate de las últimas novedades:
              </p>
              <Button variant="outline" className="rounded-full gap-2 bg-purple-50 text-purple-600 border-purple-200 hover:bg-purple-100 hover:text-purple-700" onClick={() => window.open('https://instagram.com/homimatch', '_blank')}>
                <Instagram size={18} />
                Síguenos en Instagram
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <section className="relative overflow-hidden w-full lg:py-[30px] py-[5px]">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-64 md:w-96 h-64 md:h-96 bg-homi-ultraLightPurple rounded-full opacity-50 blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-homi-ultraLightPurple rounded-full opacity-50 blur-3xl translate-x-1/3 translate-y-1/3"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {renderContent()}
        </div>
      </div>
    </section>
  );
};

export default Hero;
