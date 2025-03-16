
import { UserSearch, Home, Shield, FileCheck, PackageOpen } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: <UserSearch className="w-8 h-8 text-homi-purple" />,
      title: "Matching entre compañeros",
      description: "Conectamos estudiantes y jóvenes profesionales basándonos en sus intereses y estilos de vida para encontrar compañeros ideales."
    },
    {
      icon: <Home className="w-8 h-8 text-homi-purple" />,
      title: "Propiedades sugeridas",
      description: "Buscamos y sugerimos propiedades según las preferencias del grupo, para que encuentren el lugar perfecto para todos."
    },
    {
      icon: <Shield className="w-8 h-8 text-homi-purple" />,
      title: "Intermediación segura",
      description: "Validamos los perfiles y mediamos con propietarios para garantizar seguridad y confianza en todo el proceso."
    },
    {
      icon: <FileCheck className="w-8 h-8 text-homi-purple" />,
      title: "Contrato digital",
      description: "Facilitamos la firma de contratos digitales y automatizamos los pagos mensuales para mayor comodidad."
    },
    {
      icon: <PackageOpen className="w-8 h-8 text-homi-purple" />,
      title: "Servicios adicionales",
      description: "Ofrecemos acceso a servicios complementarios como mudanzas, limpieza, internet y seguros para el hogar."
    }
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="homi-gradient-text">¿Cómo funciona</span> Homi?
          </h2>
          <p className="text-muted-foreground text-lg">
            Un proceso completo para encontrar compañeros compatibles y
            el lugar perfecto para vivir, todo en una sola plataforma.
          </p>
        </div>

        <div className="relative">
          {/* Connection line for desktop */}
          <div className="absolute top-24 left-1/2 h-4/5 w-0.5 bg-homi-ultraLightPurple -translate-x-1/2 hidden md:block"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative">
            {steps.map((step, index) => (
              <div 
                key={index} 
                className="flex flex-col items-center text-center relative z-10"
              >
                <div className="w-20 h-20 rounded-full glass-card flex items-center justify-center mb-6 shadow-lg border border-homi-purple/10">
                  {step.icon}
                </div>
                <span className="absolute top-6 bg-purple-gradient text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center -right-1 md:right-auto md:-right-3">
                  {index + 1}
                </span>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
