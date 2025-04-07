
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
  const isMobile = useIsMobile();
  const {
    user,
    isEmailVerified,
    signInWithGoogle
  } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSigningWithGoogle, setIsSigningWithGoogle] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const isRegistered = urlParams.get('registered') === 'true';
    console.log("Verificando estado de registro:", {
      isRegistered,
      userExists: !!user,
      isEmailVerified,
      currentJustRegistered: justRegistered,
      searchParams: urlParams.toString(),
      rawURL: window.location.href
    });
    
    const error = urlParams.get('error');
    const errorDescription = urlParams.get('error_description');
    
    if (error || errorDescription) {
      console.error("Auth error detected in URL:", error, errorDescription);
      toast({
        title: "Error de autenticación",
        description: errorDescription || error || "Hubo un problema con la autenticación",
        variant: "destructive",
      });
    }
    
    // Only set justRegistered if user is authenticated AND registered parameter is true
    if (isRegistered && user) {
      console.log("Usuario recién registrado con email verificado, mostrando mensaje de bienvenida");
      setJustRegistered(true);
      // Clean up URL parameters after processing
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      console.log("Estado del usuario:", user ? "conectado" : "no conectado", "Recién registrado:", justRegistered);
    }
  }, [user, location.search, isEmailVerified, justRegistered, toast]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Subscribed with email:', email);
    setEmail('');
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  const handleGoogleSignIn = async () => {
    setIsSigningWithGoogle(true);
    try {
      console.log("Iniciando autenticación con Google desde Hero component");
      await signInWithGoogle();
      console.log("Google auth inicializado correctamente");
    } catch (error) {
      console.error("Error durante la autenticación con Google:", error);
      toast({
        title: "Error de autenticación",
        description: "No se pudo iniciar sesión con Google. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      });
      setIsSigningWithGoogle(false);
    } finally {
      // Reset state after a certain time even if successful (prevents UI getting stuck)
      setTimeout(() => setIsSigningWithGoogle(false), 5000);
    }
  };

  return <section className="relative overflow-hidden w-full lg:py-[30px] py-[5px]">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-64 md:w-96 h-64 md:h-96 bg-homi-ultraLightPurple rounded-full opacity-50 blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-homi-ultraLightPurple rounded-full opacity-50 blur-3xl translate-x-1/3 translate-y-1/3"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {!user && !justRegistered ? <>
              <div className="inline-block px-4 py-1.5 mb-1 md:mb-2 rounded-full bg-homi-ultraLightPurple text-homi-purple text-xs md:text-sm font-medium animate-pulse-soft">
                ¡Ayúdanos a alcanzar los primeros 1000 usuarios!
              </div>
              
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 animate-slide-up leading-tight px-2 my-0">
                ¡Bienvenido a <span className="homi-gradient-text">HomiMatch</span>!
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
                <Button size={isMobile ? "default" : "lg"} variant="outline" className="rounded-full w-full sm:w-auto flex items-center gap-2" onClick={handleGoogleSignIn} disabled={isSigningWithGoogle}>
                  {isSigningWithGoogle ? <>
                      <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-homi-purple"></div>
                      <span>Conectando...</span>
                    </> : <>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                      </svg>
                      <span>Continuar con Google</span>
                    </>}
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
            </> : justRegistered && user ? <WelcomeMessage firstName={user?.user_metadata?.firstName || user?.user_metadata?.first_name || user?.user_metadata?.name || user?.user_metadata?.full_name} /> : <>
              <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-green-100 text-green-700 text-xs md:text-sm font-medium">
                <Check className="inline-block mr-1 h-4 w-4" /> Usuario registrado
              </div>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 animate-slide-up leading-tight px-2">
                ¡Bienvenido a <span className="homi-gradient-text">HomiMatch</span>!
              </h1>
              
              <p className="text-base md:text-lg text-muted-foreground mb-6 max-w-2xl mx-auto px-2">
                Gracias por registrarte. Te notificaremos cuando la aplicación esté completamente funcional.
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
            </>}
        </div>
      </div>
    </section>;
};
export default Hero;
