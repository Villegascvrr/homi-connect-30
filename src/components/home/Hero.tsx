
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import EmailSignup from './EmailSignup';
import WelcomeMessage from './WelcomeMessage';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/context/AuthContext';

const Hero = () => {
  const [email, setEmail] = useState('');
  const [showSignupForm, setShowSignupForm] = useState(false);
  const [justRegistered, setJustRegistered] = useState(false);
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('registered') === 'true' && user) {
      setJustRegistered(true);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [user, location]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Subscribed with email:', email);
    setEmail('');
  };

  const handleRegisterClick = () => {
    // Navigate to the register page instead of showing the form
    navigate('/register');
  };

  return (
    <section 
      style={{
        paddingTop: '25px',
        paddingBottom: '25px', 
        minHeight: showSignupForm ? 'auto' : '60vh'
      }} 
      className="relative overflow-visible py-[20px] my-0"
    >
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-64 md:w-96 h-64 md:h-96 bg-homi-ultraLightPurple rounded-full opacity-50 blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-homi-ultraLightPurple rounded-full opacity-50 blur-3xl translate-x-1/3 translate-y-1/3"></div>
      </div>

      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto text-center" style={{
          paddingTop: '25px',
          paddingBottom: '15px'
        }}>
          {!user ? (
            <>
              <div className="inline-block px-4 py-1.5 mb-3 md:mb-4 rounded-full bg-homi-ultraLightPurple text-homi-purple text-xs md:text-sm font-medium animate-pulse-soft">
                ¡Ayúdanos a alcanzar los 1000 usuarios!
              </div>
              
              <h1 className="text-3xl md:text-6xl font-bold mb-3 md:mb-4 animate-slide-up leading-tight">
                Conecta con compañeros de piso <span className="homi-gradient-text">compatibles</span>
              </h1>
              
              <p className="text-base md:text-xl text-muted-foreground mb-3 md:mb-4 max-w-3xl mx-auto my-[34px]">
                Homi utiliza un sistema de matching inteligente para conectarte con compañeros 
                de piso que comparten tus intereses, hábitos y estilo de vida.
              </p>

              <div className="bg-homi-ultraLightPurple/50 p-3 md:p-4 rounded-xl mb-4 md:mb-6 max-w-3xl mx-auto my-[34px]">
                <p className="text-sm md:text-lg font-medium text-homi-purple">
                  Homi estará disponible próximamente - ¡Regístrate ahora para ser de los primeros en usarlo!
                  <br />
                  <span className="text-xs md:text-sm font-normal mt-1 inline-block">
                    Necesitamos alcanzar 1000 usuarios registrados para lanzar oficialmente la app.
                  </span>
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 mb-6">
                <div className="relative w-full sm:w-auto moving-border-container">
                  <Button 
                    size={isMobile ? "default" : "lg"} 
                    className="rounded-full bg-gradient-to-r from-homi-purple to-homi-lightPurple hover:from-homi-lightPurple hover:to-homi-purple text-white font-bold shadow-lg shadow-purple-500/30 transform hover:scale-105 transition-all duration-300 w-full z-10 relative" 
                    onClick={handleRegisterClick}
                  >
                    ¡Regístrate ahora!
                  </Button>
                </div>
              </div>
            </>
          ) : justRegistered ? (
            <WelcomeMessage firstName={user?.user_metadata?.firstName || user?.user_metadata?.first_name} />
          ) : (
            <>
              <div className="inline-block px-4 py-1.5 mb-3 md:mb-4 rounded-full bg-green-100 text-green-700 text-xs md:text-sm font-medium">
                <Check className="inline-block mr-1 h-4 w-4" /> Usuario registrado
              </div>
              
              <h1 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4 animate-slide-up leading-tight">
                ¡Bienvenido a <span className="homi-gradient-text">Homi</span>!
              </h1>
              
              <p className="text-base md:text-xl text-muted-foreground mb-6 max-w-3xl mx-auto">
                Gracias por registrarte. Te notificaremos cuando la aplicación esté completamente funcional.
                Mientras tanto, puedes explorar algunas de las características disponibles o completar tu perfil.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 mb-6">
                <Button 
                  size={isMobile ? "default" : "lg"} 
                  className="rounded-full bg-gradient-to-r from-homi-purple to-homi-lightPurple hover:from-homi-lightPurple hover:to-homi-purple text-white font-bold shadow-lg shadow-purple-500/30 transform hover:scale-105 transition-all duration-300 w-full sm:w-auto" 
                  asChild
                >
                  <Link to="/profile">Completar mi perfil</Link>
                </Button>
                <Button 
                  size={isMobile ? "default" : "lg"} 
                  variant="outline" 
                  className="rounded-full w-full sm:w-auto mt-2 sm:mt-0" 
                  asChild
                >
                  <Link to="/matching">Explorar perfiles</Link>
                </Button>
              </div>
              
              <div className="mt-4 text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  Síguenos en Instagram para enterarte de las últimas novedades:
                </p>
                <Button 
                  variant="outline" 
                  className="rounded-full gap-2"
                  onClick={() => window.open('https://instagram.com/homimatch', '_blank')}
                >
                  <Instagram size={18} />
                  @homimatch
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;
