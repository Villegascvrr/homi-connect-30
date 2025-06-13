import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import HowItWorks from '@/components/home/HowItWorks';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ProfileCard from '@/components/profiles/ProfileCard';
import { useAuth } from '@/context/AuthContext';
import MatchCard from '@/components/matching/MatchCard';
import { Check, Crown, Star, Zap } from 'lucide-react';

const Index = () => {
  const {
    user
  } = useAuth();
  const navigate = useNavigate();
  const featuredProfiles = [{
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
  }];
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
  const handlePlanSelect = (planId: string) => {
    if (planId === 'free') {
      if (user) {
        navigate('/matching');
      } else {
        navigate('/register');
      }
    } else {
      navigate('/suscripcion');
    }
  };

  const plans = [
    {
      id: 'free',
      name: 'Plan Gratuito',
      price: 'Gratis',
      period: '',
      icon: <Zap className="w-6 h-6 text-green-500" />,
      description: 'Perfecto para empezar',
      features: [
        'Hasta 20 swipes diarios',
        'Hasta 10 matches diarios',
        'Sin filtros personalizados'
      ],
      buttonText: 'Usar gratis',
      buttonVariant: 'outline' as const,
      popular: false,
      urgent: false
    },
    {
      id: 'pro',
      name: 'Plan PRO',
      price: '4,99€',
      period: '/mes',
      icon: <Star className="w-6 h-6 text-homi-purple" />,
      description: 'La experiencia completa',
      features: [
        'Swipes y matches ilimitados',
        'Filtros personalizados',
        'Visibilidad prioritaria'
      ],
      buttonText: 'Hazte PRO',
      buttonVariant: 'default' as const,
      popular: true,
      urgent: false
    },
    {
      id: 'founder',
      name: 'Plan Fundador',
      price: '24,99€',
      period: '/año',
      icon: <Crown className="w-6 h-6 text-yellow-500" />,
      description: 'Acceso exclusivo',
      features: [
        'Todas las ventajas PRO',
        'Más del 50% de descuento',
        'Distintivo especial',
        'Acceso anticipado',
        'Soporte prioritario'
      ],
      buttonText: 'Quiero ser Fundador',
      buttonVariant: 'default' as const,
      popular: false,
      urgent: true,
      urgentText: 'Solo para los 50 primeros usuarios'
    }
  ];

  return <div className="min-h-screen flex flex-col overflow-x-hidden w-full">
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
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 mb-12">
              {featuredProfiles.map(profile => <div key={profile.id} className="animate-on-scroll">
                  <MatchCard {...profile} compact={true} onLike={id => console.log('Liked:', id)} onPass={id => console.log('Passed:', id)} onView={id => navigate('/profile')} />
                </div>)}
            </div>
            
            <div className="text-center">
              {user ? <Link to="/matching">
                  <Button size="lg" className="rounded-full bg-homi-purple hover:bg-homi-purple/90 px-8">
                    Explorar perfiles
                  </Button>
                </Link> : <Button size="lg" className="rounded-full bg-homi-purple hover:bg-homi-purple/90 px-8" onClick={handleRegisterClick}>
                  Crear mi cuenta
                </Button>}
            </div>
          </div>
        </section>

        {/* Sección de precios con planes visibles */}
        <section className="py-16 md:py-20 bg-gradient-to-br from-homi-ultraLightPurple to-purple-50 overflow-x-hidden w-full">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16 animate-on-scroll">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Planes diseñados <span className="homi-gradient-text">para ti</span>
              </h2>
              <p className="text-muted-foreground text-lg">
                Desde gratuito hasta funcionalidades premium. Elige el plan que mejor se adapte a tus necesidades.
              </p>
            </div>
            
            {/* Mostrar los planes directamente */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto mb-8">
              {plans.map((plan) => (
                <Card 
                  key={plan.id} 
                  className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg ${
                    plan.popular ? 'border-homi-purple shadow-lg scale-105' : ''
                  } ${plan.urgent ? 'border-yellow-400 shadow-yellow-100' : ''}`}
                >
                  {plan.popular && (
                    <div className="absolute top-0 left-0 right-0 bg-homi-purple text-white text-center py-2 text-sm font-medium">
                      ✨ Más Popular
                    </div>
                  )}
                  
                  {plan.urgent && (
                    <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-yellow-400 to-orange-400 text-black text-center py-2 text-xs font-bold">
                      ⚠️ {plan.urgentText}
                    </div>
                  )}

                  <CardHeader className={`text-center ${plan.popular || plan.urgent ? 'pt-12' : 'pt-6'}`}>
                    <div className="flex justify-center mb-3">
                      {plan.icon}
                    </div>
                    <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
                    <CardDescription className="text-muted-foreground text-sm">
                      {plan.description}
                    </CardDescription>
                    <div className="mt-3">
                      <span className="text-3xl font-bold">{plan.price}</span>
                      {plan.period && <span className="text-muted-foreground text-sm">{plan.period}</span>}
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button 
                      className={`w-full mt-4 ${
                        plan.id === 'pro' 
                          ? 'bg-homi-purple hover:bg-homi-purple/90' 
                          : plan.id === 'founder'
                          ? 'bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-black font-bold'
                          : ''
                      }`}
                      variant={plan.buttonVariant}
                      onClick={() => handlePlanSelect(plan.id)}
                    >
                      {plan.buttonText}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <Link to="/precios">
                <Button variant="outline" className="rounded-full px-6">
                  Ver detalles completos
                </Button>
              </Link>
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
              <Button size="lg" variant="secondary" className="rounded-full bg-white text-homi-purple hover:bg-white/90 px-8" onClick={() => navigate('/register')}>
                Crear mi cuenta
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>;
};
export default Index;
