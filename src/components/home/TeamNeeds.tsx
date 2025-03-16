
import { Briefcase, Code } from 'lucide-react';

const TeamNeeds = () => {
  const needs = [
    {
      icon: <Briefcase className="w-10 h-10 text-white" />,
      title: "Cofundador Experto en el Sector Inmobiliario",
      description: "Buscamos un especialista en el mercado del alquiler y gestión de propiedades que ayude a fortalecer la estrategia de Homi en la captación de propietarios y optimización de procesos."
    },
    {
      icon: <Code className="w-10 h-10 text-white" />,
      title: "Desarrollador Web/App",
      description: "Un programador con experiencia en desarrollo de plataformas digitales para liderar la construcción de la aplicación web y móvil de Homi."
    }
  ];
  
  return (
    <section className="py-20 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            ¿Qué <span className="text-homi-purple">necesitamos?</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Estamos construyendo un equipo de profesionales apasionados por transformar 
            la forma de compartir vivienda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {needs.map((need, index) => (
            <div 
              key={index} 
              className="p-6 border border-homi-ultraLightPurple rounded-lg transition-all duration-300"
            >
              <div className="w-16 h-16 rounded-full bg-homi-purple flex items-center justify-center mb-5">
                {need.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{need.title}</h3>
              <p className="text-muted-foreground">{need.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamNeeds;
