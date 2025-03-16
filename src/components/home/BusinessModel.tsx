
import { Wallet, BarChart3, ShieldCheck, BadgeDollarSign } from 'lucide-react';

const BusinessModel = () => {
  const revenue = [
    {
      icon: <Wallet className="w-8 h-8 text-homi-purple" />,
      title: "Servicio de agencia",
      description: "Comisión por búsqueda y gestión del alquiler de pisos, simplificando el proceso para inquilinos y propietarios.",
      highlight: true,
      price: "Aprox. 250€ por estudiante"
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
    <section className="py-20 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Modelo de <span className="text-homi-purple">Negocio</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Generamos valor para todos los actores del ecosistema mientras construimos
            una plataforma sostenible y escalable.
          </p>
          <div className="mt-4 inline-block border border-homi-purple/30 bg-homi-ultraLightPurple/30 px-4 py-2 rounded-lg">
            <p className="text-homi-purple font-medium">
              Mercado potencial: millones de estudiantes y jóvenes profesionales
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {revenue.map((item, index) => (
              <div 
                key={index} 
                className={`glass-card p-6 transition-all duration-300 animate-on-scroll ${item.highlight ? "border-2 border-homi-purple ring-2 ring-homi-purple/20" : ""}`}
              >
                <div className="w-14 h-14 rounded-full bg-homi-ultraLightPurple flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                  {item.highlight && (
                    <span className="bg-homi-purple text-white text-xs font-medium px-2.5 py-0.5 rounded-full">
                      Principal
                    </span>
                  )}
                </div>
                <p className="text-muted-foreground">{item.description}</p>
                {item.price && (
                  <div className="mt-3 bg-homi-purple/10 p-2 rounded-md">
                    <p className="text-homi-purple font-medium text-sm">{item.price}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BusinessModel;
