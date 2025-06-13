
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import HowItWorks from '@/components/home/HowItWorks';
import { Button } from '@/components/ui/button';
import ProfileCard from '@/components/profiles/ProfileCard';
import { useAuth } from '@/context/AuthContext';
import MatchCard from '@/components/matching/MatchCard'; // Import MatchCard instead of ProfileCard

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const featuredProfiles = [
    {
      id: '1',
      name: 'Elenita',
      age: 23,
      location: 'Madrid',
      bio: 'Estudiante de Arquitectura. Me gusta leer, el arte y las noches tranquilas. Busco piso cerca de la universidad.',
      imgUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1000',
      tags: [{
        id: 1,
        name: 'Ordenada'
      }, {
        id: 2,
        name: 'Tranquila'
      }, {
        id: 3,
        name: 'Estudiante'
      }],
      compatibility: 87
    }, {
      id: '2',
      name: 'Carlos',
      age: 25,
      location: 'Barcelona',
      bio: 'Desarrollador web, amante de la tecnología y los videojuegos. Busco un ambiente relajado donde pueda trabajar y descansar.',
      imgUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1000',
      tags: [{
        id: 1,
        name: 'Tecnología'
      }, {
        id: 4,
        name: 'Deportista'
      }, {
        id: 5,
        name: 'Profesional'
      }],
      compatibility: 75
    }, {
      id: '3',
      name: 'Laurita',
      age: 22,
      location: 'Valencia',
      bio: 'Estudiante de Medicina. Me encanta cocinar y compartir momentos con amigos. Busco compañeros con intereses similares.',
      imgUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1000',
      tags: [{
        id: 6,
        name: 'Sociable'
      }, {
        id: 7,
        name: 'Cocinera'
      }, {
        id: 3,
        name: 'Estudiante'
      }],
      compatibility: 92
    }
  ];

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

  const handleRegisterClick = () => {
    navigate('/register');
  };

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden w-full">
      <div className="pt-16 w-full">
        <Navbar />
      </div>
      
      <main className="flex-grow overflow-x-hidden w-full">
        <Hero />
        
        <div id="features" className="overflow-x-hidden w-full">
          <Features />
        </div>
        
        <div id="how-it-works" className="overflow-x-hidden w-full">
          <HowItWorks />
        </div>
        
        <section className="py-16 md:py-20 overflow-x-hidden w-full">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16 animate-on-scroll">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Encuentra tu <span className="homi-gradient-text">compañero ideal</span>
              </h2>
              <p className="text-muted-foreground text-lg">
                HomiMatch está activo y ayudando a estudiantes y jóvenes profesionales a encontrar 
                compañeros de piso compatibles en Sevilla. ¡Únete ahora!
              </p>
            </div>
            
            {/* Replace ProfileCard with MatchCard and use compact prop */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 mb-12">
              {featuredProfiles.map(profile => (
                <div key={profile.id} className="animate-on-scroll">
                  <MatchCard 
                    {...profile}
                    compact={true}
                    onLike={id => console.log('Liked:', id)} 
                    onPass={id => console.log('Passed:', id)}
                    onView={id => navigate('/profile')} 
                  />
                </div>
              ))}
            </div>
            
            <div className="text-center">
              {user ? (
                <Link to="/matching">
                  <Button size="lg" className="rounded-full bg-homi-purple hover:bg-homi-purple/90 px-8">
                    Explorar perfiles
                  </Button>
                </Link>
              ) : (
                <Button 
                  size="lg" 
                  className="rounded-full bg-homi-purple hover:bg-homi-purple/90 px-8"
                  onClick={handleRegisterClick}
                >
                  Crear mi cuenta
                </Button>
              )}
            </div>
          </div>
        </section>
        
        <section className="py-16 md:py-20 bg-muted overflow-x-hidden w-full">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16 animate-on-scroll">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Conecta de <span className="homi-gradient-text">forma inteligente</span>
              </h2>
              <p className="text-muted-foreground text-lg">
                Nuestro algoritmo de matching inteligente te ayuda a encontrar compañeros de piso compatibles con tu estilo de vida.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              <div className="glass-card p-6 animate-on-scroll">
                <div className="w-12 h-12 rounded-full bg-homi-ultraLightPurple flex items-center justify-center text-homi-purple mb-4">
                  <span className="text-xl">🧠</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Matching inteligente</h3>
                <p className="text-muted-foreground mb-4">
                  Nuestro algoritmo analiza tu perfil y preferencias para encontrar las mejores coincidencias.
                </p>
                <Link to={user ? "/matching" : "/register"} className="text-homi-purple font-medium hover:underline inline-flex items-center">
                  Encontrar matches <span className="ml-1">→</span>
                </Link>
              </div>
              
              <div className="glass-card p-6 animate-on-scroll">
                <div className="w-12 h-12 rounded-full bg-homi-ultraLightPurple flex items-center justify-center text-homi-purple mb-4">
                  <span className="text-xl">💬</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Chat en tiempo real</h3>
                <p className="text-muted-foreground mb-4">
                  Comunícate directamente con tus matches para conocerlos mejor antes de tomar una decisión.
                </p>
                <Link to={user ? "/chat" : "/register"} className="text-homi-purple font-medium hover:underline inline-flex items-center">
                  Ir al chat <span className="ml-1">→</span>
                </Link>
              </div>
              
              <div className="glass-card p-6 animate-on-scroll">
                <div className="w-12 h-12 rounded-full bg-homi-ultraLightPurple flex items-center justify-center text-homi-purple mb-4">
                  <span className="text-xl">👤</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Perfiles detallados</h3>
                <p className="text-muted-foreground mb-4">
                  Crea tu perfil personalizado con tus preferencias de convivencia y encuentra compañeros afines.
                </p>
                <Link to={user ? "/profile" : "/register"} className="text-homi-purple font-medium hover:underline inline-flex items-center">
                  Ver mi perfil <span className="ml-1">→</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-16 md:py-20 bg-homi-purple text-white overflow-x-hidden w-full">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center animate-on-scroll">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                ¿Listo para encontrar a tu compañero ideal?
              </h2>
              <p className="text-xl mb-8 text-white/80">
                Únete a HomiMatch y comienza a conectar con personas compatibles con tu estilo de vida.
              </p>
              <Button 
                size="lg" 
                variant="secondary" 
                className="rounded-full bg-white text-homi-purple hover:bg-white/90 px-8"
                onClick={() => navigate('/register')}
              >
                Crear mi cuenta
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
