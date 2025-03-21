
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import EmailSignup from './EmailSignup';
import { useIsMobile } from '@/hooks/use-mobile';

const Hero = () => {
  const [email, setEmail] = useState('');
  const [showSignupForm, setShowSignupForm] = useState(false);
  const isMobile = useIsMobile();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log('Subscribed with email:', email);
    setEmail('');
  };

  const handleRegisterClick = () => {
    setShowSignupForm(true);
    // Scroll to the form after it's shown
    setTimeout(() => {
      const formElement = document.getElementById('signup-form');
      if (formElement) {
        formElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    }, 100);
  };

  return (
    <section className="relative overflow-hidden py-12 md:py-16 lg:py-20">
      {/* Enhanced gradient background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-64 md:w-96 h-64 md:h-96 bg-gradient-to-br from-homi-ultraLightPurple to-white/80 rounded-full opacity-50 blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-gradient-to-tl from-homi-ultraLightPurple to-white/80 rounded-full opacity-50 blur-3xl translate-x-1/3 translate-y-1/3"></div>
      </div>

      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto text-center">
          {/* Status badge with refined styling */}
          <div className="inline-block px-4 py-1.5 mb-4 md:mb-5 rounded-full bg-homi-ultraLightPurple text-homi-purple text-xs md:text-sm font-medium animate-pulse-soft shadow-sm">
            ¡Ayúdanos a alcanzar los 1000 usuarios!
          </div>
          
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 animate-slide-up leading-tight">
            Conecta con compañeros de piso <span className="homi-gradient-text">compatibles</span>
          </h1>
          
          <p className="text-base md:text-xl text-muted-foreground mb-6 md:mb-8 max-w-3xl mx-auto">
            Homi utiliza un sistema de matching inteligente para conectarte con compañeros 
            de piso que comparten tus intereses, hábitos y estilo de vida.
          </p>

          {/* Enhanced info box with subtle shadow */}
          <div className="bg-gradient-to-r from-homi-ultraLightPurple/40 to-homi-ultraLightPurple/60 p-4 md:p-5 rounded-xl mb-8 md:mb-10 max-w-3xl mx-auto shadow-sm">
            <p className="text-sm md:text-lg font-medium text-homi-purple">
              Homi estará disponible próximamente - ¡Regístrate ahora para ser de los primeros en usarlo!
              <br />
              <span className="text-xs md:text-sm font-normal mt-2 inline-block">
                Necesitamos alcanzar 1000 usuarios registrados para lanzar oficialmente la app.
              </span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-5 mb-8">
            {/* Primary button with refined design */}
            <div className="relative w-full sm:w-auto moving-border-container shadow-md">
              <Button 
                size={isMobile ? "default" : "lg"} 
                className="rounded-full bg-gradient-to-r from-homi-purple to-homi-lightPurple hover:from-homi-lightPurple hover:to-homi-purple text-white font-bold shadow-md shadow-purple-500/20 transform hover:scale-105 transition-all duration-300 w-full z-10 relative"
                onClick={handleRegisterClick}
              >
                ¡Regístrate ahora!
              </Button>
            </div>
            <Button 
              size={isMobile ? "default" : "lg"} 
              variant="outline" 
              className="rounded-full w-full sm:w-auto mt-2 sm:mt-0 border-homi-purple/30 hover:bg-homi-ultraLightPurple/30 transition-all duration-300" 
              asChild
            >
              <Link to="/how-it-works">Cómo Funciona</Link>
            </Button>
          </div>
          
          {showSignupForm && (
            <div 
              id="signup-form" 
              className="mt-4 md:mt-6 bg-white dark:bg-background border border-border rounded-xl p-5 md:p-6 shadow-md mb-4 relative z-10 animate-fade-in"
            >
              <EmailSignup />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;
