
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HowItWorks from '@/components/home/HowItWorks';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Check, Home, MessageSquare, Users } from 'lucide-react';

const HowItWorksPage = () => {
  const benefits = [
    "Algoritmo de compatibilidad avanzado que considera tus preferencias",
    "Verificación de perfiles para mayor seguridad",
    "Chat en tiempo real con tus matches",
    "Búsqueda por zonas y presupuesto",
    "Filtros personalizados según tus necesidades",
    "Sistema de referencias y valoraciones",
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-20">
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-homi-ultraLightPurple/30 to-transparent">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Descubre <span className="homi-gradient-text">cómo funciona</span> Homi
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
              Homi es la plataforma que te ayuda a encontrar compañeros de piso 
              que encajan perfectamente con tu estilo de vida y preferencias en múltiples ciudades.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="rounded-full bg-homi-purple hover:bg-homi-purple/90">
                <Link to="/register">Crear cuenta</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full">
                <Link to="/matching">Ver compañeros</Link>
              </Button>
            </div>
          </div>
        </section>
        
        {/* Process Steps */}
        <HowItWorks />
        
        {/* Detailed Explanation */}
        <section className="py-20 bg-accent/30">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
              <div className="glass-card p-8">
                <div className="w-16 h-16 rounded-full bg-homi-purple/10 flex items-center justify-center mb-6">
                  <Users className="w-8 h-8 text-homi-purple" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Sistema de Matching</h3>
                <p className="text-muted-foreground mb-4">
                  Nuestro algoritmo analiza más de 20 factores diferentes para encontrar 
                  compatibilidades reales entre usuarios, desde hábitos diarios hasta 
                  presupuestos y zonas preferidas.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <Check className="mt-1 w-4 h-4 text-homi-purple" />
                    <span>Compatibilidad basada en personalidad y estilo de vida</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-1 w-4 h-4 text-homi-purple" />
                    <span>Filtros por presupuesto y ubicación</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-1 w-4 h-4 text-homi-purple" />
                    <span>Verificación de usuarios para mayor seguridad</span>
                  </li>
                </ul>
              </div>
              
              <div className="glass-card p-8">
                <div className="w-16 h-16 rounded-full bg-homi-purple/10 flex items-center justify-center mb-6">
                  <MessageSquare className="w-8 h-8 text-homi-purple" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Chat en Tiempo Real</h3>
                <p className="text-muted-foreground mb-4">
                  Una vez que encuentres un match, podrás comunicarte directamente 
                  a través de nuestro sistema de mensajería en tiempo real, seguro y fácil de usar.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <Check className="mt-1 w-4 h-4 text-homi-purple" />
                    <span>Mensajes instantáneos con notificaciones</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-1 w-4 h-4 text-homi-purple" />
                    <span>Compartir fotos e información importante</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-1 w-4 h-4 text-homi-purple" />
                    <span>Indicadores de estado (online, escribiendo)</span>
                  </li>
                </ul>
              </div>
              
              <div className="glass-card p-8">
                <div className="w-16 h-16 rounded-full bg-homi-purple/10 flex items-center justify-center mb-6">
                  <Home className="w-8 h-8 text-homi-purple" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Encuentra tu Hogar</h3>
                <p className="text-muted-foreground mb-4">
                  Después de conectar con compañeros compatibles, podrás coordinar 
                  para buscar piso juntos o unirte a una vivienda ya existente.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <Check className="mt-1 w-4 h-4 text-homi-purple" />
                    <span>Coordinación para visitas a pisos</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-1 w-4 h-4 text-homi-purple" />
                    <span>Acuerdos de convivencia personalizables</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-1 w-4 h-4 text-homi-purple" />
                    <span>Creación de un hogar con compañeros compatibles</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        
        {/* Benefits */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                <span className="homi-gradient-text">Ventajas</span> de usar Homi
              </h2>
              <p className="text-lg text-muted-foreground">
                Nuestra plataforma ofrece múltiples beneficios para hacer que la 
                búsqueda de compañeros de piso sea una experiencia positiva.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="bg-background border border-border rounded-xl p-6 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 w-6 h-6 rounded-full bg-homi-ultraLightPurple flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-homi-purple" />
                    </div>
                    <p className="text-foreground">{benefit}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA */}
        <section className="py-16 bg-homi-purple text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              ¿Listo para encontrar tu compañero ideal?
            </h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto mb-8">
              Únete a Homi hoy y comienza a conectar con personas compatibles 
              para compartir un hogar.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="rounded-full bg-white text-homi-purple hover:bg-white/90">
                <Link to="/register">Crear cuenta gratis</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full border-white text-white hover:bg-white/10">
                <Link to="/signin">Iniciar sesión</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default HowItWorksPage;
