
import { MessageSquare, Users, Search, Filter } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: <Users className="w-10 h-10 text-white" />,
      title: "Matching Inteligente",
      description: "Nuestro algoritmo encuentra compañeros compatibles basándose en intereses, hábitos de convivencia y preferencias de vivienda."
    },
    {
      icon: <MessageSquare className="w-10 h-10 text-white" />,
      title: "Chat en Tiempo Real",
      description: "Comunícate instantáneamente con tus matches a través de nuestro sistema de mensajería integrado."
    },
    {
      icon: <Search className="w-10 h-10 text-white" />,
      title: "Búsqueda Avanzada",
      description: "Utiliza filtros personalizados para encontrar al compañero ideal según ubicación, presupuesto y preferencias."
    },
    {
      icon: <Filter className="w-10 h-10 text-white" />,
      title: "Perfiles Verificados",
      description: "Garantizamos la seguridad con verificación opcional de identidad para crear un entorno de confianza."
    }
  ];
  
  return (
    <section className="bg-muted" style={{ paddingTop: '10px', paddingBottom: '10px' }}>
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Todo lo que necesitas para encontrar 
            <span className="homi-gradient-text"> al compañero ideal</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Homi ofrece todas las herramientas necesarias para hacer de la búsqueda
            de compañeros de piso una experiencia sencilla y efectiva.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="glass-card p-6 transition-all duration-300 hover:shadow-hover"
            >
              <div className="w-16 h-16 rounded-full bg-purple-gradient flex items-center justify-center mb-5">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
