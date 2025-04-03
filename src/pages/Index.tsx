import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import HowItWorks from '@/components/home/HowItWorks';
import { Button } from '@/components/ui/button';
import ProfileCard from '@/components/profiles/ProfileCard';
import { useAuth } from '@/context/AuthContext';

const Index = () => {
  const { user } = useAuth();
  const featuredProfiles = [
    {
      id: '1',
      name: 'Elena',
      age: 23,
      location: 'Madrid',
      bio: 'Estudiante de Arquitectura. Me gusta leer, el arte y las noches tranquilas. Busco piso cerca de la universidad.',
      imgUrl: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7',
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
      imgUrl: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952',
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
      name: 'Laura',
      age: 22,
      location: 'Valencia',
      bio: 'Estudiante de Medicina. Me encanta cocinar y compartir momentos con amigos. Busco compañeros con intereses similares.',
      imgUrl: 'https://images.unsplash.com/photo-1472396961693-142e6e269027',
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

  return (
    <div className="min-h-screen flex flex-col">
      <div className="pt-16">
        <Navbar />
      </div>
      
      <main className="flex-grow">
        <Hero />
        
        <div id="features">
          <Features />
        </div>
        
        <div id="how-it-works">
          <HowItWorks />
        </div>
        
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16 animate-on-scroll">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Encuentra tu <span className="homi-gradient-text">compañero ideal</span>
              </h2>
              <p className="text-muted-foreground text-lg">
                Miles de estudiantes y jóvenes profesionales ya están utilizando Homi
                para encontrar compañeros de piso compatibles.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {featuredProfiles.map(profile => <div key={profile.id} className="animate-on-scroll">
                  <ProfileCard {...profile} onLike={id => console.log('Liked:', id)} onMessage={id => window.location.href = '/chat'} onView={id => window.location.href = '/profile'} />
                </div>)}
            </div>
            
            <div className="text-center">
              <Link to="/matching">
                <Button size="lg" className="rounded-full bg-homi-purple hover:bg-homi-purple/90 px-8">
                  Ver más perfiles
                </Button>
              </Link>
            </div>
          </div>
        </section>
        
        <section className="py-20 bg-muted">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16 animate-on-scroll">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Conecta de <span className="homi-gradient-text">forma inteligente</span>
              </h2>
              <p className="text-muted-foreground text-lg">
                Nuestro algoritmo de matching inteligente te ayuda a encontrar compañeros de piso compatibles con tu estilo de vida.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="glass-card p-6 animate-on-scroll">
                <div className="w-12 h-12 rounded-full bg-homi-ultraLightPurple flex items-center justify-center text-homi-purple mb-4">
                  <span className="text-xl">🧠</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Matching inteligente</h3>
                <p className="text-muted-foreground mb-4">
                  Nuestro algoritmo analiza tu perfil y preferencias para encontrar las mejores coincidencias.
                </p>
                <Link to="/matching" className="text-homi-purple font-medium hover:underline inline-flex items-center">
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
                <Link to="/chat" className="text-homi-purple font-medium hover:underline inline-flex items-center">
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
                <Link to="/profile" className="text-homi-purple font-medium hover:underline inline-flex items-center">
                  Ver mi perfil <span className="ml-1">→</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-20 bg-homi-purple text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center animate-on-scroll">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                ¿Listo para encontrar a tu compañero ideal?
              </h2>
              <p className="text-xl mb-8 text-white/80">
                Únete a Homi y comienza a conectar con personas compatibles con tu estilo de vida.
              </p>
              <Link to="/matching">
                <Button size="lg" variant="secondary" className="rounded-full bg-white text-homi-purple hover:bg-white/90 px-8">
                  Comenzar Ahora
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
