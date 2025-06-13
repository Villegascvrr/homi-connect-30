
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
    <section className="py-20 bg-gradient-to-br from-slate-900 via-purple-900 to-violet-800 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        {/* Large floating orbs with glow effects */}
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-r from-purple-400/30 to-pink-400/30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-20 -right-20 w-64 h-64 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-2xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute -bottom-32 left-1/4 w-72 h-72 bg-gradient-to-r from-violet-400/25 to-purple-400/25 rounded-full blur-3xl animate-float" style={{animationDelay: '4s'}}></div>
        
        {/* Geometric shapes */}
        <div className="absolute top-32 left-1/3 w-2 h-2 bg-white/40 rounded-full animate-pulse"></div>
        <div className="absolute bottom-40 right-1/4 w-1 h-1 bg-purple-300/60 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-pink-300/50 rounded-full animate-pulse" style={{animationDelay: '3s'}}></div>
        
        {/* Gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/5 to-black/10"></div>
      </div>
      
      <div className="container mx-auto px-4 overflow-hidden relative z-10">
        <div className="text-center max-w-4xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 mb-6">
            <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse"></div>
            <span className="text-purple-200 text-sm font-medium">Proceso simple en 4 pasos</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white leading-tight">
            <span className="bg-gradient-to-r from-purple-200 via-white to-purple-200 bg-clip-text text-transparent">
              Cómo funciona
            </span>
            <br />
            <span className="text-3xl md:text-4xl bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
              HomiMatch
            </span>
          </h2>
          <p className="text-purple-100/90 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
            Un proceso simple y efectivo para encontrar compañeros de piso compatibles
            con tus preferencias y estilo de vida.
          </p>
        </div>

        <div className="relative">
          {/* Modern connection line with gradient */}
          <div className="absolute top-28 left-1/2 h-2/3 w-px bg-gradient-to-b from-purple-300/50 via-white/30 to-purple-300/50 -translate-x-1/2 hidden md:block"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12 relative">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center text-center relative z-10 group">
                {/* Modern card container */}
                <div className="relative mb-8">
                  {/* Glow effect behind the card */}
                  <div className="absolute inset-0 w-24 h-24 bg-gradient-to-r from-purple-400/30 to-pink-400/30 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                  
                  {/* Main icon container */}
                  <div className="relative w-20 h-20 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-2xl group-hover:scale-110 group-hover:bg-white/20 transition-all duration-500">
                    {step.icon}
                    
                    {/* Step number badge */}
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 text-white text-sm font-bold rounded-full flex items-center justify-center shadow-lg border-2 border-white/20">
                      {index + 1}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-xl md:text-2xl font-bold text-white group-hover:text-purple-200 transition-colors duration-300">
                    {step.title}
                  </h3>
                  <p className="text-purple-100/80 leading-relaxed max-w-xs mx-auto group-hover:text-purple-100 transition-colors duration-300">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Bottom decorative element */}
        <div className="mt-16 flex justify-center">
          <div className="flex items-center gap-2">
            <div className="w-12 h-px bg-gradient-to-r from-transparent via-purple-300/50 to-transparent"></div>
            <div className="w-2 h-2 bg-purple-400/60 rounded-full"></div>
            <div className="w-12 h-px bg-gradient-to-r from-transparent via-purple-300/50 to-transparent"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
