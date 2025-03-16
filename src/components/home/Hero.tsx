
import { Button } from '@/components/ui/button';
import { Check, ChevronDown, Mail, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import PreRegisterForm from './PreRegisterForm';

const Hero = () => {
  return (
    <section className="relative pt-36 pb-24 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-homi-ultraLightPurple rounded-full opacity-50 blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-homi-ultraLightPurple rounded-full opacity-50 blur-3xl translate-x-1/3 translate-y-1/3"></div>
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-homi-lightPurple/20 rounded-full opacity-30 blur-2xl"></div>
      </div>

      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto text-center mb-16">
          <div className="inline-block px-6 py-2 mb-8 rounded-full bg-gradient-to-r from-homi-ultraLightPurple to-homi-lightPurple/20 text-homi-purple text-sm font-semibold border border-homi-purple/10 shadow-sm animate-pulse-soft">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-homi-lightPurple" />
              <span>¡Encuentra al compañero de piso ideal!</span>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 animate-slide-up bg-clip-text text-transparent bg-gradient-to-r from-homi-purple via-homi-lightPurple to-homi-purple leading-tight">
            Conecta con compañeros <br className="hidden sm:block" />
            <span className="relative">
              compatibles
              <svg className="absolute -bottom-1 left-0 w-full h-3 text-homi-purple/20" viewBox="0 0 100 12" preserveAspectRatio="none">
                <path d="M0,0 Q50,12 100,0" stroke="currentColor" strokeWidth="8" fill="none" />
              </svg>
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-3xl mx-auto">
            Homi utiliza un sistema de matching inteligente para conectarte con compañeros 
            de piso que comparten tus intereses, hábitos y estilo de vida.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button 
              size="lg" 
              className="rounded-full bg-gradient-to-r from-homi-purple to-homi-lightPurple hover:shadow-xl hover:shadow-homi-purple/25 transition-all duration-300 px-8 w-full sm:w-auto"
              asChild
            >
              <Link to="/matching">Comenzar Ahora</Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="rounded-full border-homi-purple/20 hover:bg-homi-ultraLightPurple/50 w-full sm:w-auto"
              onClick={() => {
                const howItWorksSection = document.getElementById('how-it-works');
                if (howItWorksSection) {
                  howItWorksSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              Cómo Funciona
              <ChevronDown size={16} />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-16">
            <div className="flex items-center gap-3 bg-white/50 dark:bg-white/5 border border-homi-purple/10 rounded-xl px-4 py-3 shadow-sm">
              <div className="rounded-full bg-homi-ultraLightPurple p-1.5">
                <Check className="text-homi-purple" size={16} />
              </div>
              <span className="font-medium">Matching inteligente</span>
            </div>
            <div className="flex items-center gap-3 bg-white/50 dark:bg-white/5 border border-homi-purple/10 rounded-xl px-4 py-3 shadow-sm">
              <div className="rounded-full bg-homi-ultraLightPurple p-1.5">
                <Check className="text-homi-purple" size={16} />
              </div>
              <span className="font-medium">Chat integrado</span>
            </div>
            <div className="flex items-center gap-3 bg-white/50 dark:bg-white/5 border border-homi-purple/10 rounded-xl px-4 py-3 shadow-sm">
              <div className="rounded-full bg-homi-ultraLightPurple p-1.5">
                <Check className="text-homi-purple" size={16} />
              </div>
              <span className="font-medium">Perfiles verificados</span>
            </div>
          </div>
        </div>
          
        {/* Pre-registration Form */}
        <div className="max-w-xl mx-auto relative">
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-gradient-to-r from-homi-purple to-homi-lightPurple flex items-center justify-center shadow-lg">
            <Mail className="text-white" size={20} />
          </div>
          <PreRegisterForm />
        </div>
      </div>
    </section>
  );
};

export default Hero;
