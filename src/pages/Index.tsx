
import { useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import HowItWorks from '@/components/home/HowItWorks';
import { Button } from '@/components/ui/button';
import ProfileCard from '@/components/profiles/ProfileCard';

const Index = () => {
  // Sample data for demonstration
  const featuredProfiles = [
    {
      id: '1',
      name: 'Elena',
      age: 23,
      location: 'Madrid',
      bio: 'Estudiante de Arquitectura. Me gusta leer, el arte y las noches tranquilas. Busco piso cerca de la universidad.',
      imgUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
      tags: [
        { id: 1, name: 'Ordenada' },
        { id: 2, name: 'Tranquila' },
        { id: 3, name: 'Estudiante' }
      ],
      compatibility: 87
    },
    {
      id: '2',
      name: 'Carlos',
      age: 25,
      location: 'Barcelona',
      bio: 'Desarrollador web, amante de la tecnología y los videojuegos. Busco un ambiente relajado donde pueda trabajar y descansar.',
      imgUrl: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
      tags: [
        { id: 1, name: 'Tecnología' },
        { id: 4, name: 'Deportista' },
        { id: 5, name: 'Profesional' }
      ],
      compatibility: 75
    },
    {
      id: '3',
      name: 'Laura',
      age: 22,
      location: 'Valencia',
      bio: 'Estudiante de Medicina. Me encanta cocinar y compartir momentos con amigos. Busco compañeros con intereses similares.',
      imgUrl: 'https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b',
      tags: [
        { id: 6, name: 'Sociable' },
        { id: 7, name: 'Cocinera' },
        { id: 3, name: 'Estudiante' }
      ],
      compatibility: 92
    }
  ];

  // Animation on scroll
  useEffect(() => {
    const handleScroll = () => {
      const elements = document.querySelectorAll('.animate-on-scroll');
      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight * 0.8;
        if (isVisible) {
          el.classList.add('active');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    // Trigger once on load
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <Hero />
        <Features />
        <HowItWorks />
        
        {/* Featured Profiles Section */}
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
              {featuredProfiles.map((profile) => (
                <div key={profile.id} className="animate-on-scroll">
                  <ProfileCard 
                    {...profile}
                    onLike={(id) => console.log('Liked:', id)}
                    onMessage={(id) => console.log('Message:', id)}
                    onView={(id) => console.log('View profile:', id)}
                  />
                </div>
              ))}
            </div>
            
            <div className="text-center">
              <Button 
                size="lg" 
                className="rounded-full bg-homi-purple hover:bg-homi-purple/90 px-8"
              >
                Ver más perfiles
              </Button>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 bg-homi-purple text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center animate-on-scroll">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                ¿Listo para encontrar a tu compañero ideal?
              </h2>
              <p className="text-xl mb-8 text-white/80">
                Únete a Homi y comienza a conectar con personas compatibles con tu estilo de vida.
              </p>
              <Button 
                size="lg" 
                variant="secondary" 
                className="rounded-full bg-white text-homi-purple hover:bg-white/90 px-8"
              >
                Comenzar Ahora
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
