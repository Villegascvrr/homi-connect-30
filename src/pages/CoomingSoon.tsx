import { useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Users, Home, Headphones, MessageSquare, Bell, Lightbulb, ArrowRight } from 'lucide-react';
const ProximamentePage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const handleScroll = () => {
      const elements = document.querySelectorAll('.animate-on-scroll');
      elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight * 0.8;
        if (isVisible) {
          el.classList.add('active');
        }
      });
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return <div className="min-h-screen flex flex-col overflow-x-hidden w-full">
      <Navbar />
      
      <main className="flex-grow overflow-x-hidden w-full">
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 overflow-x-hidden w-full relative">
          {/* Decorative elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-10 left-10 w-24 h-24 bg-violet-200/30 rounded-full blur-xl animate-float"></div>
            <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-200/30 rounded-full blur-xl animate-float" style={{
            animationDelay: '1s'
          }}></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-indigo-200/20 rounded-full blur-2xl animate-float" style={{
            animationDelay: '3s'
          }}></div>
          </div>

          <div className="container mx-auto px-4 md:px-6 relative z-10 w-full">
            {/* Header */}
            <div className="text-center max-w-4xl mx-auto mb-16 animate-on-scroll">
              <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full border border-violet-200 mb-8">
                <Lightbulb className="w-5 h-5 text-homi-purple animate-pulse" />
                <span className="font-medium text-homi-purple">Próximamente en HomiMatch</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight">
                El futuro de la <span className="homi-gradient-text">convivencia</span>
              </h1>
              
              <p className="text-lg text-gray-600 mb-6 leading-relaxed max-w-3xl mx-auto">
                Encontrar compañero de piso es solo el primer paso, pero la convivencia no acaba ahí, es solo cuando empieza
              </p>
              <p className="text-purple-600 font-medium text-lg">
                ¡Disponible muy pronto!
              </p>
            </div>

            {/* Feature grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-20">
              
              {/* Comunidad */}
              <Card className="group hover:shadow-2xl transition-all duration-500 bg-white/95 backdrop-blur-sm border-0 shadow-lg hover:scale-[1.02] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <CardHeader className="pb-6 relative z-10 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl flex items-center justify-center mb-6 group-hover:from-blue-200 group-hover:to-indigo-200 transition-all duration-300 mx-auto group-hover:scale-110">
                    <Users className="w-10 h-10 text-blue-600" />
                  </div>
                  <CardTitle className="text-2xl mb-4 group-hover:text-homi-purple transition-colors">
                    Comunidad
                  </CardTitle>
                  <CardDescription className="text-lg leading-relaxed">
                    Conecta con compañeros compatibles y construye relaciones duraderas
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0 relative z-10">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl">
                      <div className="w-4 h-4 bg-blue-500 rounded-full flex-shrink-0"></div>
                      <span className="text-blue-700 font-medium">Sistema de compatibilidad avanzada</span>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-indigo-50 rounded-xl">
                      <div className="w-4 h-4 bg-indigo-500 rounded-full flex-shrink-0"></div>
                      <span className="text-indigo-700 font-medium">Eventos y actividades grupales</span>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-xl">
                      <div className="w-4 h-4 bg-purple-500 rounded-full flex-shrink-0"></div>
                      <span className="text-purple-700 font-medium">Red de referencias y valoraciones</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Organización del Hogar */}
              <Card className="group hover:shadow-2xl transition-all duration-500 bg-white/95 backdrop-blur-sm border-0 shadow-lg hover:scale-[1.02] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <CardHeader className="pb-6 relative z-10 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-3xl flex items-center justify-center mb-6 group-hover:from-green-200 group-hover:to-emerald-200 transition-all duration-300 mx-auto group-hover:scale-110">
                    <Home className="w-10 h-10 text-green-600" />
                  </div>
                  <CardTitle className="text-2xl mb-4 group-hover:text-homi-purple transition-colors">
                    Organización del Hogar
                  </CardTitle>
                  <CardDescription className="text-lg leading-relaxed">
                    Gestiona tareas, gastos y la vida doméstica de forma inteligente
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0 relative z-10">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl">
                      <div className="w-4 h-4 bg-green-500 rounded-full flex-shrink-0"></div>
                      <span className="text-green-700 font-medium">División automática de gastos</span>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-xl">
                      <div className="w-4 h-4 bg-emerald-500 rounded-full flex-shrink-0"></div>
                      <span className="text-emerald-700 font-medium">Calendario de tareas compartidas</span>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-teal-50 rounded-xl">
                      <div className="w-4 h-4 bg-teal-500 rounded-full flex-shrink-0"></div>
                      <span className="text-teal-700 font-medium">Lista de compras inteligente</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Servicios */}
              <Card className="group hover:shadow-2xl transition-all duration-500 bg-white/95 backdrop-blur-sm border-0 shadow-lg hover:scale-[1.02] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <CardHeader className="pb-6 relative z-10 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-red-100 rounded-3xl flex items-center justify-center mb-6 group-hover:from-orange-200 group-hover:to-red-200 transition-all duration-300 mx-auto group-hover:scale-110">
                    <Headphones className="w-10 h-10 text-orange-600" />
                  </div>
                  <CardTitle className="text-2xl mb-4 group-hover:text-homi-purple transition-colors">
                    Servicios
                  </CardTitle>
                  <CardDescription className="text-lg leading-relaxed">
                    Accede a servicios especializados para mejorar tu experiencia
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0 relative z-10">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-orange-50 rounded-xl">
                      <div className="w-4 h-4 bg-orange-500 rounded-full flex-shrink-0"></div>
                      <span className="text-orange-700 font-medium">Mediación de conflictos</span>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-red-50 rounded-xl">
                      <div className="w-4 h-4 bg-red-500 rounded-full flex-shrink-0"></div>
                      <span className="text-red-700 font-medium">Asesoría legal para inquilinos</span>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-pink-50 rounded-xl">
                      <div className="w-4 h-4 bg-pink-500 rounded-full flex-shrink-0"></div>
                      <span className="text-pink-700 font-medium">Servicios de limpieza y mantenimiento</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Comunicación */}
              <Card className="group hover:shadow-2xl transition-all duration-500 bg-white/95 backdrop-blur-sm border-0 shadow-lg hover:scale-[1.02] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <CardHeader className="pb-6 relative z-10 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl flex items-center justify-center mb-6 group-hover:from-purple-200 group-hover:to-pink-200 transition-all duration-300 mx-auto group-hover:scale-110">
                    <MessageSquare className="w-10 h-10 text-purple-600" />
                  </div>
                  <CardTitle className="text-2xl mb-4 group-hover:text-homi-purple transition-colors">
                    Comunicación
                  </CardTitle>
                  <CardDescription className="text-lg leading-relaxed">
                    Mantente conectado con herramientas de comunicación avanzadas
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0 relative z-10">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-xl">
                      <div className="w-4 h-4 bg-purple-500 rounded-full flex-shrink-0"></div>
                      <span className="text-purple-700 font-medium">Chat grupal con moderación IA</span>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-pink-50 rounded-xl">
                      <div className="w-4 h-4 bg-pink-500 rounded-full flex-shrink-0"></div>
                      <span className="text-pink-700 font-medium">Notificaciones inteligentes</span>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-violet-50 rounded-xl">
                      <div className="w-4 h-4 bg-violet-500 rounded-full flex-shrink-0"></div>
                      <span className="text-violet-700 font-medium">Tablón de anuncios digital</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Call to action */}
            <div className="text-center max-w-3xl mx-auto mb-10">
              <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-purple-100 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5"></div>
                <div className="relative z-10">
                  <h3 className="text-3xl font-bold mb-6">
                    ¿Quieres ser de los primeros?
                  </h3>
                  <p className="text-muted-foreground text-xl mb-10 leading-relaxed">
                    Regístrate ahora y te notificaremos cuando estas herramientas estén disponibles
                  </p>
                  <div className="flex flex-col sm:flex-row gap-6 justify-center">
                    <Button size="lg" className="rounded-full bg-gradient-to-r from-homi-purple to-purple-600 hover:from-purple-600 hover:to-homi-purple px-10 py-4 text-lg h-14" onClick={() => navigate('/register')}>
                      <Bell className="w-6 h-6 mr-3" />
                      Notificarme
                    </Button>
                    <Button size="lg" variant="outline" className="rounded-full border-purple-200 text-purple-700 hover:bg-purple-50 px-10 py-4 text-lg h-14" onClick={() => navigate('/matching')}>
                      Empezar ahora
                      <ArrowRight className="w-6 h-6 ml-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>;
};
export default ProximamentePage;