
import { BrainCircuit, Home, ShieldCheck, FileText, PackageOpen, Rocket, BarChart3, Globe } from 'lucide-react';

const HowItWorks = () => {
  const steps = [{
    icon: <BrainCircuit className="w-8 h-8 text-white" />,
    title: "Matching entre compañeros",
    description: "IA que conecta compañeros compatibles según intereses y estilo de vida."
  }, {
    icon: <Home className="w-8 h-8 text-white" />,
    title: "Propiedades sugeridas",
    description: "Sugerencias inteligentes según preferencias grupales."
  }, {
    icon: <ShieldCheck className="w-8 h-8 text-white" />,
    title: "Intermediación segura",
    description: "Validación de perfiles y mediación con propietarios."
  }, {
    icon: <FileText className="w-8 h-8 text-white" />,
    title: "Contrato digital",
    description: "Smart Contracts para firmas y pagos automatizados."
  }, {
    icon: <PackageOpen className="w-8 h-8 text-white" />,
    title: "Servicios adicionales",
    description: "Mudanzas, limpieza, internet y seguros para el hogar."
  }];
  
  const gradients = [
    "from-purple-600 to-indigo-600",
    "from-violet-600 to-purple-600",
    "from-fuchsia-600 to-pink-600",
    "from-pink-600 to-rose-600",
    "from-indigo-600 to-blue-600"
  ];

  const roadmap = [
    {
      phase: "Fase 1: 0-12 meses",
      title: "Consolidación",
      icon: <Rocket className="w-6 h-6 text-white" />,
      color: "from-indigo-500 to-blue-500",
      goals: [
        "10,000 usuarios en ciudades clave",
        "Validación del algoritmo de matching",
        "Primeras colaboraciones con universidades"
      ]
    },
    {
      phase: "Fase 2: 12-24 meses",
      title: "Expansión",
      icon: <BarChart3 className="w-6 h-6 text-white" />,
      color: "from-fuchsia-500 to-pink-500",
      goals: [
        "50,000 usuarios activos",
        "Automatización de procesos",
        "Marketplace de servicios"
      ]
    },
    {
      phase: "Fase 3: 24-36 meses",
      title: "Liderazgo",
      icon: <Globe className="w-6 h-6 text-white" />,
      color: "from-emerald-500 to-teal-500",
      goals: [
        "Expansión internacional",
        "Lanzamiento HomiNet y HomiWare",
        "Integración con blockchain"
      ]
    }
  ];
  
  return <section className="py-20 bg-gradient-to-b from-homi-ultraLightPurple/20 to-white dark:from-homi-dark/90 dark:to-homi-dark">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-homi-purple to-homi-lightPurple bg-clip-text text-transparent">¿Cómo funciona</span> Homi?
          </h2>
          <p className="text-muted-foreground text-lg">
            Un proceso impulsado por IA y Smart Contracts para encontrar compañeros 
            compatibles y el lugar perfecto para vivir.
          </p>
        </div>

        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center text-center relative z-10 transform transition-all duration-300 hover:scale-105">
                <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${gradients[index]} flex items-center justify-center mb-6 shadow-lg hover:shadow-xl transition-all duration-300`}>
                  {step.icon}
                </div>
                <span className="absolute top-6 bg-white text-homi-purple text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center -right-1 md:right-auto md:-right-3 shadow-md border border-homi-purple/20">
                  {index + 1}
                </span>
                <h3 className="text-xl font-semibold mb-3 bg-gradient-to-r from-homi-purple to-homi-lightPurple bg-clip-text text-transparent">{step.title}</h3>
                <p className="text-muted-foreground bg-white/50 dark:bg-black/20 p-3 rounded-lg shadow-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Roadmap Visual Section */}
        <div className="mt-24 mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
            <span className="bg-gradient-to-r from-homi-purple to-homi-lightPurple bg-clip-text text-transparent">Roadmap</span> Homi
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {roadmap.map((item, index) => (
              <div 
                key={index} 
                className={`glass-card p-6 hover:shadow-lg transition-all duration-300 hover:scale-105 relative overflow-hidden`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-10 rounded-xl`}></div>
                <div className={`absolute top-0 left-0 w-2 h-full bg-gradient-to-b ${item.color}`}></div>
                
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center mb-4 shadow-md`}>
                  {item.icon}
                </div>
                
                <h3 className="text-sm font-bold text-muted-foreground mb-1">{item.phase}</h3>
                <h4 className="text-xl font-bold mb-4 homi-gradient-text">{item.title}</h4>
                
                <ul className="space-y-2 ml-1">
                  {item.goals.map((goal, idx) => (
                    <li key={idx} className="flex items-start text-sm">
                      <span className={`inline-block w-2 h-2 rounded-full mt-1.5 mr-2 bg-gradient-to-br ${item.color}`}></span>
                      {goal}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="hidden md:block">
          <div className="absolute top-40 left-10 w-6 h-6 rounded-full bg-purple-200 animate-pulse opacity-30"></div>
          <div className="absolute bottom-20 right-10 w-8 h-8 rounded-full bg-indigo-300 animate-pulse opacity-40"></div>
          <div className="absolute top-60 right-20 w-4 h-4 rounded-full bg-violet-400 animate-pulse opacity-30"></div>
        </div>
      </div>
    </section>;
};

export default HowItWorks;
