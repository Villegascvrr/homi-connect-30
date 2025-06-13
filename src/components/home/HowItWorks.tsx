
import { User, Users, MessageSquare, Home } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const HowItWorks = () => {
  const steps = [{
    icon: <User className="w-8 h-8 text-homi-purple" />,
    title: "Crea tu perfil",
    description: "Registra tus preferencias, hábitos de convivencia y lo que buscas en un compañero de piso."
  }, {
    icon: <Users className="w-8 h-8 text-homi-purple" />,
    title: "Encuentra matches",
    description: "Nuestro algoritmo te mostrará posibles compañeros ordenados por porcentaje de compatibilidad."
  }, {
    icon: <MessageSquare className="w-8 h-8 text-homi-purple" />,
    title: "Conecta y conversa",
    description: "Inicia una conversación con tus matches para conocerse mejor a través del chat integrado."
  }, {
    icon: <Home className="w-8 h-8 text-homi-purple" />,
    title: "Forma tu hogar",
    description: "Decide con quién quieres compartir piso y comienza esta nueva etapa juntos."
  }];
  
  return (
    <>
      {/* Top Separator */}
      <div className="relative">
        <Separator className="bg-gradient-to-r from-transparent via-homi-purple/20 to-transparent" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-4">
          <div className="w-2 h-2 rounded-full bg-homi-purple animate-pulse"></div>
        </div>
      </div>

      <section className="py-[27px] bg-gradient-to-br from-slate-50/50 via-purple-50/30 to-blue-50/20 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-homi-purple/5 to-transparent rounded-full blur-xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-br from-blue-500/5 to-transparent rounded-full blur-xl"></div>
          <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-br from-purple-300/10 to-transparent rounded-full blur-lg"></div>
        </div>

        <div className="container mx-auto px-4 overflow-hidden relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-homi-purple/20 mb-4 shadow-sm">
              <div className="w-2 h-2 rounded-full bg-homi-purple animate-pulse"></div>
              <span className="text-sm font-medium text-homi-purple">Proceso simple</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="homi-gradient-text">Cómo funciona</span> HomiMatch
            </h2>
            <p className="text-muted-foreground text-lg">
              Un proceso simple y efectivo para encontrar compañeros de piso compatibles
              con tus preferencias y estilo de vida.
            </p>
          </div>

          <div className="relative">
            {/* Enhanced connection line with gradient */}
            <div className="absolute top-24 left-1/2 h-2/3 w-1 bg-gradient-to-b from-homi-purple via-homi-lightPurple to-homi-ultraLightPurple -translate-x-1/2 hidden md:block rounded-full shadow-sm"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
              {steps.map((step, index) => (
                <div key={index} className="flex flex-col items-center text-center relative z-10 group">
                  <div className="w-20 h-20 rounded-full glass-card flex items-center justify-center mb-6 shadow-lg border border-homi-purple/10 group-hover:shadow-xl group-hover:scale-105 transition-all duration-300 bg-white/90 backdrop-blur-sm">
                    {step.icon}
                  </div>
                  <span className="absolute top-6 bg-gradient-to-r from-homi-purple to-homi-lightPurple text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center -right-1 md:right-auto md:-right-3 shadow-lg">
                    {index + 1}
                  </span>
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-homi-purple transition-colors duration-300">{step.title}</h3>
                  <p className="text-muted-foreground group-hover:text-slate-600 transition-colors duration-300">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Separator */}
      <div className="relative">
        <Separator className="bg-gradient-to-r from-transparent via-homi-purple/20 to-transparent" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-4">
          <div className="w-2 h-2 rounded-full bg-homi-purple animate-pulse"></div>
        </div>
      </div>
    </>
  );
};

export default HowItWorks;
