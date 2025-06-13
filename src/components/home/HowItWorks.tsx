
import { User, Users, MessageSquare, Home } from 'lucide-react';

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
    <section className="py-20 bg-gradient-to-br from-slate-50 via-white to-homi-ultraLightPurple/30 relative overflow-hidden">
      {/* Subtle geometric background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-homi-purple/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-homi-lightPurple/8 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-40 h-40 bg-purple-200/10 rounded-full blur-2xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            Cómo funciona <span className="homi-gradient-text">HomiMatch</span>
          </h2>
          <p className="text-gray-600 text-lg md:text-xl leading-relaxed">
            Un proceso simple y efectivo para encontrar compañeros de piso compatibles
            con tus preferencias y estilo de vida.
          </p>
        </div>

        <div className="relative">
          {/* Modern connection line */}
          <div className="absolute top-28 left-1/2 h-2/3 w-px bg-gradient-to-b from-homi-purple/20 via-homi-purple/40 to-homi-purple/20 -translate-x-1/2 hidden lg:block"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center text-center relative group">
                {/* Modern card container */}
                <div className="w-full max-w-sm p-8 rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:transform group-hover:scale-105">
                  {/* Icon container */}
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-homi-ultraLightPurple to-white flex items-center justify-center mb-6 mx-auto shadow-md border border-homi-purple/10">
                    {step.icon}
                  </div>
                  
                  {/* Step number */}
                  <div className="absolute -top-3 -right-3 bg-homi-purple text-white text-sm font-bold w-8 h-8 rounded-full flex items-center justify-center shadow-lg">
                    {index + 1}
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-4 text-gray-900">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
