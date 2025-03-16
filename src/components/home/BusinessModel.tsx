
import { Wallet, Coins, BarChart3, PiggyBank, HandCoins } from 'lucide-react';

const BusinessModel = () => {
  const revenue = [
    {
      icon: <Wallet className="w-8 h-8 text-homi-purple" />,
      title: "Comisión por contrato",
      description: "Pequeña comisión al completar exitosamente el contrato entre inquilinos y propietarios."
    },
    {
      icon: <Coins className="w-8 h-8 text-homi-purple" />,
      title: "Modelo freemium",
      description: "Funcionalidades básicas gratuitas y plan premium con acceso a herramientas avanzadas de búsqueda y matching."
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-homi-purple" />,
      title: "Servicios adicionales",
      description: "Comisiones por referir servicios complementarios como seguros, mudanzas, limpieza e internet."
    },
    {
      icon: <PiggyBank className="w-8 h-8 text-homi-purple" />,
      title: "Gestión de pagos",
      description: "Pequeña tarifa por la gestión automatizada de pagos mensuales entre inquilinos y propietarios."
    },
    {
      icon: <HandCoins className="w-8 h-8 text-homi-purple" />,
      title: "Propiedades destacadas",
      description: "Los propietarios pueden pagar para destacar sus propiedades en los resultados de búsqueda."
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {revenue.map((item, index) => (
            <div key={index} className="glass-card p-6 hover:shadow-hover transition-shadow duration-300 animate-on-scroll">
              <div className="w-14 h-14 rounded-full bg-homi-ultraLightPurple flex items-center justify-center mb-4">
                {item.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
              <p className="text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BusinessModel;
