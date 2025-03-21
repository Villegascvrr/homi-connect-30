import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
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
  return <section className="relative pt-20 md:pt-32 pb-16 md:pb-20 overflow-hidden py-0 md:py-[18px]">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-64 md:w-96 h-64 md:h-96 bg-homi-ultraLightPurple rounded-full opacity-50 blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-homi-ultraLightPurple rounded-full opacity-50 blur-3xl translate-x-1/3 translate-y-1/3"></div>
      </div>

      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto text-center py-[31px]">
          <div className="inline-block px-4 py-1.5 mb-4 md:mb-6 rounded-full bg-homi-ultraLightPurple text-homi-purple text-xs md:text-sm font-medium animate-pulse-soft">
            ¡Ayúdanos a alcanzar los 1000 usuarios!
          </div>
          
          <h1 className="text-3xl md:text-6xl font-bold mb-4 md:mb-6 animate-slide-up leading-tight">
            Conecta con compañeros de piso <span className="homi-gradient-text">compatibles</span>
          </h1>
          
          <p className="text-base md:text-xl text-muted-foreground mb-4 md:mb-6 max-w-3xl mx-auto">
            Homi utiliza un sistema de matching inteligente para conectarte con compañeros 
            de piso que comparten tus intereses, hábitos y estilo de vida.
          </p>

          <div className="bg-homi-ultraLightPurple/50 p-3 md:p-4 rounded-xl mb-6 md:mb-8 max-w-3xl mx-auto">
            <p className="text-sm md:text-lg font-medium text-homi-purple">
              Homi estará disponible próximamente - ¡Regístrate ahora para ser de los primeros en usarlo!
              <br />
              <span className="text-xs md:text-sm font-normal mt-1 inline-block">
                Necesitamos alcanzar 1000 usuarios registrados para lanzar oficialmente la app.
              </span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 mb-6">
            <Button size={isMobile ? "default" : "lg"} className="rounded-full bg-homi-purple hover:bg-homi-purple/90 w-full sm:w-auto" onClick={handleRegisterClick}>
              ¡Regístrate ahora!
            </Button>
            <Button size={isMobile ? "default" : "lg"} variant="outline" className="rounded-full w-full sm:w-auto mt-2 sm:mt-0" asChild>
              <Link to="/how-it-works">Cómo Funciona</Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 md:gap-6 max-w-3xl mx-auto mb-10 md:mb-16">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <Check className="text-homi-purple" size={16} />
              <span className="text-sm md:text-base">Matching inteligente</span>
            </div>
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <Check className="text-homi-purple" size={16} />
              <span className="text-sm md:text-base">Chat integrado</span>
            </div>
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <Check className="text-homi-purple" size={16} />
              <span className="text-sm md:text-base">Perfiles verificados</span>
            </div>
          </div>
          
          {/* Email Signup Component - conditionally rendered */}
          {showSignupForm && <div id="signup-form" className="mt-6 md:mt-8 bg-white dark:bg-background border border-border rounded-xl p-4 md:p-6 shadow-sm my-[15px]">
              <EmailSignup />
            </div>}
        </div>
      </div>
    </section>;
};
export default Hero;