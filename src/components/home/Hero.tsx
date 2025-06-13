import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Check, Instagram, CreditCard } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import EmailSignup from './EmailSignup';
import WelcomeMessage from './WelcomeMessage';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { signInWithGoogleOAuth } from '@/integrations/supabase/client';
const Hero = () => {
  const [email, setEmail] = useState('');
  const [showSignupForm, setShowSignupForm] = useState(false);
  const [justRegistered, setJustRegistered] = useState(false);
  const [justLoggedIn, setJustLoggedIn] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const isMobile = useIsMobile();
  const {
    user,
    isEmailVerified
  } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    toast
  } = useToast();
  useEffect(() => {
    if (user) {
      const urlParams = new URLSearchParams(window.location.search);
      const isRegistered = urlParams.get('registered') === 'true';
      const isLoggedIn = urlParams.get('loggedIn') === 'true';
      if (isRegistered) {
        setJustRegistered(true);
        setJustLoggedIn(false);

        // Limpiar parámetros URL después de procesarlos
        window.history.replaceState({}, document.title, window.location.pathname);
      } else if (isLoggedIn) {
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
  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleLoading(true);
      await signInWithGoogleOAuth();
    } catch (error: any) {
      console.error("Error durante la autenticación con Google:", error);
      toast({
        title: "Error",
        description: error.message || "Ha ocurrido un error con la autenticación de Google",
        variant: "destructive"
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };
  const renderContent = () => {
    if (user && (justRegistered || justLoggedIn)) {
      return <WelcomeMessage firstName={user?.user_metadata?.firstName || user?.user_metadata?.first_name || user?.user_metadata?.name || user?.user_metadata?.full_name} showWelcomeToast={true} isNewUser={justRegistered} />;
    }
    if (user && !justRegistered && !justLoggedIn) {
      return <>
          <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-green-100 text-green-700 text-xs md:text-sm font-medium">
            <Check className="inline-block mr-1 h-4 w-4" /> Usuario conectado
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 animate-slide-up leading-tight px-2">
            ¡Bienvenido a <span className="homi-gradient-text">HomiMatch</span>!
          </h1>
          
          <p className="text-base md:text-lg text-muted-foreground mb-6 max-w-2xl mx-auto px-2">Completa tu perfil y empieza a encontrar compañeros de piso compatibles (tanto si tienes piso o no)</p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 mb-8">
            <Button size={isMobile ? "default" : "lg"} className="rounded-full bg-gradient-to-r from-homi-purple to-homi-lightPurple hover:from-homi-lightPurple hover:to-homi-purple text-white font-bold shadow-lg shadow-purple-500/30 transform hover:scale-105 transition-all duration-300 w-full sm:w-auto" asChild>
              <Link to="/profile">Completar mi perfil</Link>
            </Button>
            <Button size={isMobile ? "default" : "lg"} variant="outline" className="rounded-full w-full sm:w-auto" asChild>
              <Link to="/matching">Explorar perfiles</Link>
            </Button>
            <Button size={isMobile ? "default" : "lg"} variant="outline" className="rounded-full w-full sm:w-auto flex items-center gap-2" asChild>
              <Link to="/precios">
                <CreditCard size={18} />
                Ver planes
              </Link>
            </Button>
          </div>
        </>;
    }
    return <>
        <div className="inline-block px-4 py-1.5 mb-1 md:mb-2 rounded-full bg-homi-ultraLightPurple text-homi-purple text-xs md:text-sm font-medium animate-pulse-soft">
          ¡Ya disponible en todas las ciudades universitarias!
        </div>
        
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 animate-slide-up leading-tight px-2 my-0">
          Conecta con <span className="homi-gradient-text">compañeros de piso</span> compatibles
        </h1>
        
        <p className="text-base md:text-xl text-muted-foreground mb-6 max-w-2xl mx-auto px-2">HomiMatch utiliza un sistema de matching para conectarte con compañeros de piso que comparten tus intereses y estilo de vida.</p>

        

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 mt-6">
          <Button size={isMobile ? "default" : "lg"} className="rounded-full bg-gradient-to-r from-homi-purple to-homi-lightPurple hover:from-homi-lightPurple hover:to-homi-purple text-white font-bold shadow-lg shadow-purple-500/30 transform hover:scale-105 transition-all duration-300 w-full sm:w-auto" onClick={handleRegisterClick}>
            ¡Crear cuenta ahora!
          </Button>
          <Button type="button" size={isMobile ? "default" : "lg"} variant="outline" className="rounded-full w-full sm:w-auto flex items-center justify-center gap-2" onClick={handleGoogleSignIn} disabled={isGoogleLoading}>
            {isGoogleLoading ? <>
                <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-homi-purple"></div>
                <span>Conectando...</span>
              </> : <>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" className="mr-1">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Acceder con Google
              </>}
          </Button>
        </div>

        
      </>;
  };
  return <section className="relative overflow-hidden w-full lg:py-[30px] py-[5px]">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-64 md:w-96 h-64 md:h-96 bg-homi-ultraLightPurple rounded-full opacity-50 blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-homi-ultraLightPurple rounded-full opacity-50 blur-3xl translate-x-1/3 translate-y-1/3"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {renderContent()}
          
          <div className="mt-6 flex justify-center">
            <div>
              <p className="text-sm text-muted-foreground mb-3">
                Síguenos para las últimas novedades:
              </p>
              <Button variant="outline" className="rounded-full gap-2 bg-purple-50 text-purple-600 border-purple-200 hover:bg-purple-100 hover:text-purple-700" onClick={() => window.open('https://instagram.com/homimatch', '_blank')}>
                <Instagram size={18} />
                @homimatch
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default Hero;