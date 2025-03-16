
import { Wallet, BarChart3, ShieldCheck, BadgeDollarSign } from 'lucide-react';

const BusinessModel = () => {
  const revenue = [
    {
      icon: <Wallet className="w-8 h-8 text-homi-purple" />,
      title: "Servicio de agencia",
      description: "Comisión por búsqueda y gestión del alquiler de pisos, simplificando el proceso para inquilinos y propietarios."
    },
    {
      icon: <BadgeDollarSign className="w-8 h-8 text-homi-purple" />,
      title: "Suscripciones premium",
      description: "Planes con mayor visibilidad en el sistema de matching y herramientas avanzadas de búsqueda."
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-homi-purple" />,
      title: "Servicios adicionales",
      description: "Comisiones por referir servicios complementarios como seguros, mudanzas, limpieza e internet."
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-homi-purple" />,
      title: "Publicidad segmentada",
      description: "Espacios publicitarios para empresas con target estudiantil y de jóvenes profesionales."
    }
  ];
  
  return (
    <section className="py-20 bg-gradient-to-b from-white to-homi-ultraLightPurple/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Modelo de <span className="homi-gradient-text">Negocio</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Generamos valor para todos los actores del ecosistema mientras construimos
            una plataforma sostenible y escalable.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {revenue.slice(0, 2).map((item, index) => (
              <div key={index} className="glass-card p-6 hover:shadow-hover transition-shadow duration-300 animate-on-scroll">
                <div className="w-14 h-14 rounded-full bg-homi-ultraLightPurple flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
            {revenue.slice(2, 4).map((item, index) => (
              <div key={index + 2} className="glass-card p-6 hover:shadow-hover transition-shadow duration-300 animate-on-scroll">
                <div className="w-14 h-14 rounded-full bg-homi-ultraLightPurple flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BusinessModel;
