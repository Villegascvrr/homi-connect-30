
import { User, Users, MessageSquare, Home } from 'lucide-react';

const HowItWorks = () => {
  const steps = [{
    icon: <User className="w-8 h-8 text-white" />,
    title: "Crea tu perfil",
    description: "Registra tus preferencias, hábitos de convivencia y lo que buscas en un compañero de piso."
  }, {
    icon: <Users className="w-8 h-8 text-white" />,
    title: "Encuentra matches",
    description: "Nuestro algoritmo te mostrará posibles compañeros ordenados por porcentaje de compatibilidad."
  }, {
    icon: <MessageSquare className="w-8 h-8 text-white" />,
    title: "Conecta y conversa",
    description: "Inicia una conversación con tus matches para conocerse mejor a través del chat integrado."
  }, {
    icon: <Home className="w-8 h-8 text-white" />,
    title: "Forma tu hogar",
    description: "Decide con quién quieres compartir piso y comienza esta nueva etapa juntos."
  }];
  
  return (
    <section className="py-[27px] bg-gradient-to-br from-purple-100 via-purple-50 to-homi-ultraLightPurple relative overflow-hidden">
      {/* Modern decorative background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-40 h-40 bg-gradient-to-br from-homi-purple/5 to-purple-200/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-56 h-56 bg-gradient-to-br from-blue-100/20 to-homi-lightPurple/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-gradient-to-br from-homi-ultraLightPurple/30 to-purple-100/20 rounded-full blur-2xl"></div>
        <div className="absolute top-10 right-1/4 w-24 h-24 bg-gradient-to-br from-slate-100/40 to-gray-100/30 rounded-full blur-xl"></div>
      </div>
      
      <div className="container mx-auto px-4 overflow-hidden relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-800">
            <span className="text-slate-700">Cómo funciona</span> <span className="homi-gradient-text">HomiMatch</span>
          </h2>
          <p className="text-slate-600 text-lg">
            Un proceso simple y efectivo para encontrar compañeros de piso compatibles
            con tus preferencias y estilo de vida.
          </p>
        </div>

        <div className="relative">
          {/* Modern connection line */}
          <div className="absolute top-24 left-1/2 h-2/3 w-px bg-gradient-to-b from-homi-purple/20 via-homi-lightPurple/30 to-homi-purple/20 -translate-x-1/2 hidden md:block"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center text-center relative z-10">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-homi-purple to-homi-lightPurple flex items-center justify-center mb-6 shadow-xl border-4 border-white/50 backdrop-blur-sm hover:scale-105 transition-all duration-300">
                  {step.icon}
                </div>
                <span className="absolute top-6 bg-white text-homi-purple text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-lg border-2 border-homi-purple/20 -right-1 md:right-auto md:-right-3">
                  {index + 1}
                </span>
                <h3 className="text-xl font-semibold mb-3 text-slate-800">{step.title}</h3>
                <p className="text-slate-600 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
