
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
    <section className="py-[27px] bg-gradient-to-br from-purple-600 via-homi-purple to-purple-800 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-purple-300/20 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-purple-200/15 rounded-full blur-lg"></div>
      </div>
      
      <div className="container mx-auto px-4 overflow-hidden relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            <span className="text-purple-100">Cómo funciona</span> HomiMatch
          </h2>
          <p className="text-purple-100 text-lg opacity-90">
            Un proceso simple y efectivo para encontrar compañeros de piso compatibles
            con tus preferencias y estilo de vida.
          </p>
        </div>

        <div className="relative">
          {/* Connection line */}
          <div className="absolute top-24 left-1/2 h-2/3 w-0.5 bg-purple-200/30 -translate-x-1/2 hidden md:block"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center text-center relative z-10">
                <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-6 shadow-lg border border-white/30">
                  {step.icon}
                </div>
                <span className="absolute top-6 bg-white text-homi-purple text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center -right-1 md:right-auto md:-right-3">
                  {index + 1}
                </span>
                <h3 className="text-xl font-semibold mb-3 text-white">{step.title}</h3>
                <p className="text-purple-100 opacity-90">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
