
import { BrainCircuit, Home, ShieldCheck, FileText, PackageOpen } from 'lucide-react';

const HowItWorks = () => {
  const steps = [{
    icon: <BrainCircuit className="w-8 h-8 text-homi-purple" />,
    title: "Matching entre compañeros",
    description: "IA que conecta compañeros compatibles según intereses y estilo de vida."
  }, {
    icon: <Home className="w-8 h-8 text-homi-purple" />,
    title: "Propiedades sugeridas",
    description: "Sugerencias inteligentes según preferencias grupales."
  }, {
    icon: <ShieldCheck className="w-8 h-8 text-homi-purple" />,
    title: "Intermediación segura",
    description: "Validación de perfiles y mediación con propietarios."
  }, {
    icon: <FileText className="w-8 h-8 text-homi-purple" />,
    title: "Contrato digital",
    description: "Smart Contracts para firmas y pagos automatizados."
  }, {
    icon: <PackageOpen className="w-8 h-8 text-homi-purple" />,
    title: "Servicios adicionales",
    description: "Mudanzas, limpieza, internet y seguros para el hogar."
  }];
  
  return <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="homi-gradient-text">¿Cómo funciona</span> Homi?
          </h2>
          <p className="text-muted-foreground text-lg">
            Un proceso impulsado por IA y Smart Contracts para encontrar compañeros 
            compatibles y el lugar perfecto para vivir.
          </p>
        </div>

        <div className="relative">
          {/* Removing the connection line for desktop */}
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative">
            {steps.map((step, index) => <div key={index} className="flex flex-col items-center text-center relative z-10">
                <div className="w-20 h-20 rounded-full glass-card flex items-center justify-center mb-6 shadow-lg border border-homi-purple/10">
                  {step.icon}
                </div>
                <span className="absolute top-6 bg-purple-gradient text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center -right-1 md:right-auto md:-right-3">
                  {index + 1}
                </span>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>)}
          </div>
        </div>
      </div>
    </section>;
};

export default HowItWorks;
