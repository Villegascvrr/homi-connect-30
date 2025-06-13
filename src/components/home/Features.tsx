import { MessageSquare, Users, Search, Filter } from 'lucide-react';
const Features = () => {
  const features = [{
    icon: <Users className="w-10 h-10 text-white" />,
    title: "Matching Inteligente",
    description: "Nuestro algoritmo encuentra compañeros compatibles basándose en intereses, hábitos de convivencia y preferencias de vivienda."
  }, {
    icon: <MessageSquare className="w-10 h-10 text-white" />,
    title: "Chat en Tiempo Real",
    description: "Comunícate instantáneamente con tus matches a través de nuestro sistema de mensajería integrado."
  }, {
    icon: <Search className="w-10 h-10 text-white" />,
    title: "Búsqueda Avanzada",
    description: "Utiliza filtros personalizados para encontrar al compañero ideal según ubicación, presupuesto y preferencias."
  }, {
    icon: <Filter className="w-10 h-10 text-white" />,
    title: "Perfiles Verificados",
    description: "Garantizamos la seguridad con verificación opcional de identidad para crear un entorno de confianza."
  }];
  return <section className="bg-muted features-section my-[21px] py-[12px]">
      
    </section>;
};
export default Features;