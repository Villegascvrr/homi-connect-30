import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import HowItWorks from '@/components/home/HowItWorks';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import ProfileCard from '@/components/profiles/ProfileCard';
import { useAuth } from '@/context/AuthContext';
import MatchCard from '@/components/matching/MatchCard';
import { Check, Crown, Star, Zap, Sparkles, Users, Home, Quote, Heart } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  const {
    user
  } = useAuth();
  const navigate = useNavigate();
  const {
    createCheckout
  } = useSubscription();
  
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
    compatibility: 92
  }, {
    id: '2',
    name: 'Carlos',
    age: 25,
    location: 'Barcelona',
    bio: 'Desarrollador web, amante de la tecnología y los videojuegos. Busco un ambiente relajado donde pueda trabajar y descansar.',
    imgUrl: 'https://images.unsplash.com/photo-1500648741775-53994a69daeb?q=80&w=1000',
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
    compatibility: 88
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
    compatibility: 95
  }];

  const successStories = [
    {
      id: 1,
      couple: {
        person1: {
          name: 'Ana',
          age: 24,
          image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1000'
        },
        person2: {
          name: 'María',
          age: 23,
          image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000'
        }
      },
      location: 'Madrid',
      rating: 5,
      testimonial: 'HomiMatch cambió mi vida completamente. No solo encontré una compañera de piso, sino una hermana. Vivimos en armonía total y nos apoyamos en todo.',
      author: 'Ana'
    },
    {
      id: 2,
      couple: {
        person1: {
          name: 'Diego',
          age: 26,
          image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000'
        },
        person2: {
          name: 'Alex',
          age: 25,
          image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1000'
        }
      },
      location: 'Barcelona',
      rating: 5,
      testimonial: 'El algoritmo de HomiMatch es increíble. Diego y yo tenemos estilos de vida muy compatibles, trabajamos desde casa y respetamos nuestros espacios. ¡Perfecto!',
      author: 'Alex'
    },
    {
      id: 3,
      couple: {
        person1: {
          name: 'Carmen',
          age: 22,
          image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1000'
        },
        person2: {
          name: 'Laura',
          age: 21,
          image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1000'
        }
      },
      location: 'Valencia',
      rating: 5,
      testimonial: 'Como estudiantes de medicina, necesitábamos compañeras que entendieran nuestros horarios de estudio. Carmen es la compañera perfecta, estudiamos juntas y nos motivamos.',
      author: 'Laura'
    },
    {
      id: 4,
      couple: {
        person1: {
          name: 'Roberto',
          age: 27,
          image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1000'
        },
        person2: {
          name: 'Miguel',
          age: 24,
          image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1000'
        }
      },
      location: 'Sevilla',
      rating: 5,
      testimonial: 'Me mudé a Sevilla por trabajo sin conocer a nadie. Gracias a HomiMatch encontré a Miguel, ahora somos como hermanos y Sevilla se siente como hogar.',
      author: 'Roberto'
    },
    {
      id: 5,
      couple: {
        person1: {
          name: 'Sofia',
          age: 23,
          image: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?q=80&w=1000'
        },
        person2: {
          name: 'Natalia',
          age: 25,
          image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000'
        }
      },
      location: 'Bilbao',
      rating: 5,
      testimonial: 'Nunca pensé que una app para encontrar piso me daría una amiga para toda la vida. Sofía y yo conectamos desde el primer día, compartimos todo.',
      author: 'Natalia'
    },
    {
      id: 6,
      couple: {
        person1: {
          name: 'Javier',
          age: 25,
          image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000'
        },
        person2: {
          name: 'Alejandro',
          age: 26,
          image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1000'
        }
      },
      location: 'Zaragoza',
      rating: 5,
      testimonial: 'Encontrar a Javier fue como ganar la lotería. Compartimos la pasión por la programación, trabajamos juntos en proyectos y vivimos en perfecta armonía.',
      author: 'Alejandro'
    },
    {
      id: 7,
      couple: {
        person1: {
          name: 'Elena',
          age: 22,
          image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1000'
        },
        person2: {
          name: 'Cristina',
          age: 24,
          image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1000'
        }
      },
      location: 'Granada',
      rating: 5,
      testimonial: 'Cristina y yo somos almas gemelas creativas. Nuestro piso es nuestro santuario artístico donde creamos, inspiramos y vivimos nuestros sueños juntas.',
      author: 'Elena'
    },
    {
      id: 8,
      couple: {
        person1: {
          name: 'Pablo',
          age: 26,
          image: 'https://images.unsplash.com/photo-1500648741775-53994a69daeb?q=80&w=1000'
        },
        person2: {
          name: 'Marcos',
          age: 28,
          image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1000'
        }
      },
      location: 'Málaga',
      rating: 5,
      testimonial: 'Marcos es el compañero de piso ideal. Entrenamos juntos, cocinamos saludable y nos motivamos mutuamente. HomiMatch acertó al 100% con nosotros.',
      author: 'Pablo'
    }
  ];

  const testimonials = [
    {
      id: 1,
      name: 'Laura S.',
      age: 22,
      location: 'Sevilla',
      rating: 5,
      comment: 'HomiMatch me ayudó a encontrar a mi compañera de piso ideal. El algoritmo realmente funciona, tenemos gustos muy similares.',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1000'
    },
    {
      id: 2,
      name: 'Miguel R.',
      age: 24,
      location: 'Valencia',
      rating: 5,
      comment: 'Increíble app. En una semana ya tenía varios matches y ahora vivo con dos personas geniales que conocí aquí.',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1000'
    },
    {
      id: 3,
      name: 'Carmen M.',
      age: 23,
      location: 'Madrid',
      rating: 5,
      comment: 'Lo que más me gusta es que puedes filtrar por estilo de vida. Encontré compañeros que respetan mis horarios de estudio.',
      image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1000'
    },
    {
      id: 4,
      name: 'Alejandro T.',
      age: 26,
      location: 'Bilbao',
      rating: 5,
      comment: 'La mejor decisión que tomé fue usar HomiMatch. No solo encontré piso, sino que hice amigos para toda la vida.',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1000'
    },
    {
      id: 5,
      name: 'Sofia K.',
      age: 21,
      location: 'Granada',
      rating: 5,
      comment: 'Perfecta para estudiantes como yo. La interfaz es súper intuitiva y encontré compañeros de piso en pocos días.',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000'
    },
    {
      id: 6,
      name: 'Javier M.',
      age: 28,
      location: 'Zaragoza',
      rating: 5,
      comment: 'Como profesional que se mudó por trabajo, HomiMatch me facilitó muchísimo encontrar un hogar en una ciudad nueva.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000'
    },
    {
      id: 7,
      name: 'Natalia P.',
      age: 25,
      location: 'Murcia',
      rating: 5,
      comment: 'Me encanta lo segura que me siento usando la app. Todos los perfiles están verificados y la comunidad es increíble.',
      image: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?q=80&w=1000'
    },
    {
      id: 8,
      name: 'Roberto L.',
      age: 23,
      location: 'Salamanca',
      rating: 5,
      comment: 'La función de compatibilidad es genial. Mi compañero de piso y yo tenemos estilos de vida muy parecidos.',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1000'
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
  const handlePlanSelect = async (planId: string) => {
    if (planId === 'free') {
      if (user) {
        navigate('/matching');
      } else {
        navigate('/register');
      }
    } else {
      // For premium plans, create checkout session directly if logged in, otherwise go to register
      if (user) {
        await createCheckout(planId);
      } else {
        navigate('/register');
      }
    }
  };
  const plans = [{
    id: 'free',
    name: 'Plan Gratuito',
    price: 'Gratis',
    period: '',
    icon: <Zap className="w-6 h-6 text-green-500" />,
    description: 'Perfecto para empezar',
    features: ['Hasta 20 swipes diarios', 'Hasta 10 matches diarios', 'Sin filtros personalizados'],
    buttonText: 'Usar gratis',
    buttonVariant: 'outline' as const,
    popular: false,
    urgent: false,
    bgGradient: 'from-green-50 to-emerald-50',
    borderColor: 'border-green-200 hover:border-green-300'
  }, {
    id: 'pro',
    name: 'Plan PRO',
    price: '4,99€',
    period: '/mes',
    icon: <Star className="w-6 h-6 text-homi-purple" />,
    description: 'La experiencia completa',
    features: ['Swipes y matches ilimitados', 'Filtros personalizados', 'Visibilidad prioritaria'],
    buttonText: 'Hazte PRO',
    buttonVariant: 'default' as const,
    popular: true,
    urgent: false,
    bgGradient: 'from-purple-50 to-violet-50',
    borderColor: 'border-homi-purple hover:border-homi-purple/80'
  }, {
    id: 'founder',
    name: 'Plan Fundador',
    price: '24,99€',
    originalPrice: '59,99€',
    period: '/año',
    icon: <Crown className="w-6 h-6 text-yellow-500" />,
    description: 'Acceso exclusivo',
    features: ['Todas las ventajas PRO', 'Distintivo especial', 'Acceso anticipado a nuevas funciones', 'Soporte prioritario'],
    buttonText: 'Quiero ser Fundador',
    buttonVariant: 'default' as const,
    popular: false,
    urgent: true,
    urgentText: 'Solo para los 50 primeros usuarios',
    bgGradient: 'from-yellow-50 to-orange-50',
    borderColor: 'border-yellow-400 hover:border-yellow-500'
  }];

  return <div className="min-h-screen flex flex-col overflow-x-hidden w-full">
      <div className="pt-16 w-full">
        <Navbar />
      </div>
      
      <main className="flex-grow overflow-x-hidden w-full">
        <Hero />
        
        <div id="how-it-works" className="overflow-x-hidden w-full">
          <HowItWorks />
        </div>
        
        <section className="py-16 md:py-20 overflow-x-hidden w-full">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16 animate-on-scroll">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Para <span className="homi-gradient-text">todo tipo de personas</span>
              </h2>
              <p className="text-muted-foreground text-lg mb-6">
                HomiMatch está diseñado para conectar a estudiantes y jóvenes profesionales, 
                sin importar tu situación actual de vivienda.
              </p>
              
              {/* New section explaining who HomiMatch is for */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4 mx-auto">
                    <Home className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2 text-blue-900">¿Tienes piso?</h3>
                  <p className="text-blue-700 text-sm">
                    Si ya tienes un piso y buscas compañeros compatibles para compartir gastos y experiencias
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-100">
                  <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-4 mx-auto">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2 text-purple-900">¿Buscas piso?</h3>
                  <p className="text-purple-700 text-sm">
                    Si necesitas encontrar tanto piso como compañeros de habitación para empezar esta nueva etapa
                  </p>
                </div>
              </div>
            </div>
            
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-4">
                Conoce a algunos de nuestros <span className="homi-gradient-text">usuarios</span>
              </h3>
              <p className="text-muted-foreground">
                Perfiles reales de personas que ya están usando HomiMatch para encontrar su hogar ideal
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 mb-16">
              {featuredProfiles.map(profile => <div key={profile.id} className="animate-on-scroll">
                  <MatchCard {...profile} compact={true} onLike={id => console.log('Liked:', id)} onPass={id => console.log('Passed:', id)} onView={id => navigate('/profile')} />
                </div>)}
            </div>

            {/* Enhanced Success Stories Section */}
            <div className="mb-16">
              <div className="text-center mb-12">
                <h3 className="text-3xl font-bold mb-4">
                  <span className="homi-gradient-text">Historias de éxito</span>
                </h3>
                <p className="text-muted-foreground text-lg">
                  Usuarios reales que se conocieron en HomiMatch y ahora comparten hogar
                </p>
              </div>
              
              <div className="relative max-w-6xl mx-auto">
                <Carousel
                  opts={{
                    align: "start",
                    loop: true,
                  }}
                  className="w-full"
                >
                  <CarouselContent className="-ml-2 md:-ml-4">
                    {successStories.map(story => (
                      <CarouselItem key={story.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                        <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-pink-50 to-purple-50 border-pink-200 h-full">
                          <CardContent className="p-6 flex flex-col h-full">
                            <div className="flex items-center gap-4 mb-4">
                              <div className="flex -space-x-2">
                                <img 
                                  src={story.couple.person1.image} 
                                  alt={story.couple.person1.name}
                                  className="w-12 h-12 rounded-full border-2 border-white object-cover"
                                />
                                <img 
                                  src={story.couple.person2.image} 
                                  alt={story.couple.person2.name}
                                  className="w-12 h-12 rounded-full border-2 border-white object-cover"
                                />
                              </div>
                              <div className="flex-grow">
                                <h4 className="font-semibold text-lg">
                                  {story.couple.person1.name} & {story.couple.person2.name}
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  {story.location}
                                </p>
                              </div>
                              <Heart className="w-5 h-5 text-pink-500" />
                            </div>
                            
                            <div className="flex gap-1 mb-4">
                              {[...Array(story.rating)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              ))}
                            </div>
                            
                            <div className="mt-auto">
                              <blockquote className="text-muted-foreground italic mb-2">
                                "{story.testimonial}"
                              </blockquote>
                              <p className="text-sm text-muted-foreground font-medium">- {story.author}</p>
                            </div>
                          </CardContent>
                        </Card>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="hidden md:flex" />
                  <CarouselNext className="hidden md:flex" />
                </Carousel>
              </div>
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

        {/* Pricing section */}
        <section className="py-12 md:py-16 bg-gradient-to-br from-slate-50 via-white to-purple-50 overflow-x-hidden w-full relative">
          {/* Decorative elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{
            animationDelay: '2s'
          }}></div>
          </div>
          
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="text-center max-w-4xl mx-auto mb-10 md:mb-12 animate-on-scroll">
              <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-purple-200 mb-4">
                <Sparkles className="w-4 h-4 text-homi-purple" />
                <span className="text-sm font-medium text-homi-purple">Planes diseñados para ti</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight py-1 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Elige tu plan perfecto
              </h2>
              <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
                Desde gratuito hasta funcionalidades premium. Encuentra compañeros compatibles con el plan que mejor se adapte a ti.
              </p>
            </div>
            
            {/* Grid de planes más compacto */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-8">
              {plans.map((plan, index) => <Card key={plan.id} className={`relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-purple-100/50 group ${plan.popular ? 'scale-105 shadow-xl border-2 border-homi-purple' : 'hover:scale-105'} ${plan.urgent ? 'border-2 border-yellow-400 shadow-lg shadow-yellow-100' : plan.borderColor} bg-gradient-to-br ${plan.bgGradient} backdrop-blur-sm`} style={{
              animationDelay: `${index * 100}ms`
            }}>
                  {/* Popular badge */}
                  {plan.popular && <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-homi-purple to-purple-600 text-white text-center py-2 text-sm font-semibold shadow-lg">
                      <div className="flex items-center justify-center gap-2">
                        <Star className="w-4 h-4 fill-current" />
                        Más Popular
                        <Star className="w-4 h-4 fill-current" />
                      </div>
                    </div>}
                  
                  {/* Urgent badge */}
                  {plan.urgent && <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 text-black text-center py-2 text-sm font-bold shadow-lg animate-pulse">
                      <div className="flex items-center justify-center gap-1">
                        ⚡ {plan.urgentText} ⚡
                      </div>
                    </div>}

                  <CardHeader className={`text-center relative ${plan.popular || plan.urgent ? 'pt-12' : 'pt-6'} pb-4`}>
                    {/* Icon con efecto de glow */}
                    <div className="flex justify-center mb-3">
                      <div className="p-2.5 rounded-full bg-white/80 backdrop-blur-sm shadow-lg group-hover:shadow-xl transition-all duration-300">
                        {plan.icon}
                      </div>
                    </div>
                    
                    <CardTitle className="text-xl font-bold mb-2 group-hover:text-homi-purple transition-colors duration-300">
                      {plan.name}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground mb-3 text-sm">
                      {plan.description}
                    </CardDescription>
                    
                    {/* Precio con mejor styling */}
                    <div className="mb-4">
                      {plan.originalPrice ? <div className="flex flex-col items-center gap-1">
                          <div className="flex items-baseline justify-center gap-1 text-muted-foreground">
                            <span className="text-base line-through">
                              {plan.originalPrice}
                            </span>
                            <span className="text-sm">{plan.period}</span>
                          </div>
                          <div className="flex items-baseline justify-center gap-1">
                            <span className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                              {plan.price}
                            </span>
                            <span className="text-muted-foreground text-base">{plan.period}</span>
                          </div>
                        </div> : <div className="flex items-baseline justify-center gap-1">
                          <span className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                            {plan.price}
                          </span>
                          {plan.period && <span className="text-muted-foreground text-base">{plan.period}</span>}
                        </div>}
                    </div>
                  </CardHeader>

                  <CardContent className="px-5 pb-6">
                    {/* Lista de características más compacta */}
                    <ul className="space-y-2.5 mb-6">
                      {plan.features.map((feature, index) => <li key={index} className="flex items-start gap-2.5 group/item">
                          <div className="flex-shrink-0 w-4 h-4 rounded-full bg-green-100 flex items-center justify-center mt-0.5 group-hover/item:bg-green-200 transition-colors duration-200">
                            <Check className="w-2.5 h-2.5 text-green-600" />
                          </div>
                          <span className="text-sm leading-relaxed group-hover/item:text-slate-700 transition-colors duration-200">
                            {feature}
                          </span>
                        </li>)}
                    </ul>

                    {/* Botón */}
                    <Button className={`w-full py-2.5 font-semibold text-sm transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl ${plan.id === 'pro' ? 'bg-gradient-to-r from-homi-purple to-purple-600 hover:from-purple-600 hover:to-homi-purple text-white' : plan.id === 'founder' ? 'bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 hover:from-yellow-500 hover:via-orange-500 hover:to-red-500 text-black font-bold shadow-yellow-200' : 'bg-white border-2 border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300'}`} variant={plan.buttonVariant} onClick={() => handlePlanSelect(plan.id)}>
                      {plan.buttonText}
                    </Button>
                  </CardContent>
                </Card>)}
            </div>

            {/* Call to action más compacto */}
            <div className="text-center">
              <div className="inline-flex flex-col items-center gap-3">
                <p className="text-muted-foreground text-sm">
                  ¿Necesitas más información?
                </p>
                <Link to="/precios">
                  <Button variant="outline" className="rounded-full px-6 py-2 bg-white/80 backdrop-blur-sm border-purple-200 text-homi-purple hover:bg-purple-50 hover:border-homi-purple transition-all duration-300 shadow-lg hover:shadow-xl text-sm">
                    Ver detalles completos
                  </Button>
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
