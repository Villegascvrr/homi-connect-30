
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log('Subscribed with email:', email);
    setEmail('');
  };

  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-homi-ultraLightPurple rounded-full opacity-50 blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-homi-ultraLightPurple rounded-full opacity-50 blur-3xl translate-x-1/3 translate-y-1/3"></div>
      </div>

      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-homi-ultraLightPurple text-homi-purple text-sm font-medium animate-pulse-soft">
            ¡Encuentra al compañero de piso ideal!
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-slide-up">
            Conecta con compañeros de piso <span className="homi-gradient-text">compatibles</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Homi utiliza un sistema de matching inteligente para conectarte con compañeros 
            de piso que comparten tus intereses, hábitos y estilo de vida.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button 
              size="lg" 
              className="rounded-full bg-homi-purple hover:bg-homi-purple/90 px-8 w-full sm:w-auto"
              asChild
            >
              <Link to="/matching">Comenzar Ahora</Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="rounded-full w-full sm:w-auto"
              onClick={() => {
                const howItWorksSection = document.getElementById('how-it-works');
                if (howItWorksSection) {
                  howItWorksSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              Cómo Funciona
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="flex items-center gap-2">
              <Check className="text-homi-purple" size={20} />
              <span>Matching inteligente</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="text-homi-purple" size={20} />
              <span>Chat integrado</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="text-homi-purple" size={20} />
              <span>Perfiles verificados</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
