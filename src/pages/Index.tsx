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
import { Check, Crown, Star, Zap, Sparkles } from 'lucide-react';

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
      navigate(`/precios?plan=${planId}`);
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
      urgent: false,
      bgGradient: 'from-green-50 to-emerald-50',
      borderColor: 'border-green-200 hover:border-green-300'
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
      urgent: false,
      bgGradient: 'from-purple-50 to-violet-50',
      borderColor: 'border-homi-purple hover:border-homi-purple/80'
    },
    {
      id: 'founder',
      name: 'Plan Fundador',
      price: '24,99€',
      originalPrice: '59,99€',
      period: '/año',
      icon: <Crown className="w-6 h-6 text-yellow-500" />,
      description: 'Acceso exclusivo',
      features: [
        'Todas las ventajas PRO',
        'Distintivo especial',
        'Acceso anticipado',
        'Soporte prioritario'
      ],
      buttonText: 'Quiero ser Fundador',
      buttonVariant: 'default' as const,
      popular: false,
      urgent: true,
      urgentText: 'Solo para los 50 primeros usuarios',
      bgGradient: 'from-yellow-50 to-orange-50',
      borderColor: 'border-yellow-400 hover:border-yellow-500'
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

        {/* Sección de precios optimizada y más compacta */}
        <section className="py-12 md:py-16 bg-gradient-to-br from-slate-50 via-white to-purple-50 overflow-x-hidden w-full relative">
          {/* Decorative elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{animationDelay: '2s'}}></div>
          </div>
          
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="text-center max-w-4xl mx-auto mb-10 md:mb-12 animate-on-scroll">
              <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-purple-200 mb-4">
                <Sparkles className="w-4 h-4 text-homi-purple" />
                <span className="text-sm font-medium text-homi-purple">Planes diseñados para ti</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Elige tu plan perfecto
              </h2>
              <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
                Desde gratuito hasta funcionalidades premium. Encuentra compañeros compatibles con el plan que mejor se adapte a ti.
              </p>
            </div>
            
            {/* Grid de planes más compacto */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-8">
              {plans.map((plan, index) => (
                <Card 
                  key={plan.id} 
                  className={`relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-purple-100/50 group ${
                    plan.popular ? 'scale-105 shadow-xl border-2 border-homi-purple' : 'hover:scale-105'
                  } ${plan.urgent ? 'border-2 border-yellow-400 shadow-lg shadow-yellow-100' : plan.borderColor} bg-gradient-to-br ${plan.bgGradient} backdrop-blur-sm`}
                  style={{
                    animationDelay: `${index * 100}ms`
                  }}
                >
                  {/* Popular badge */}
                  {plan.popular && (
                    <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-homi-purple to-purple-600 text-white text-center py-2 text-sm font-semibold shadow-lg">
                      <div className="flex items-center justify-center gap-2">
                        <Star className="w-4 h-4 fill-current" />
                        Más Popular
                        <Star className="w-4 h-4 fill-current" />
                      </div>
                    </div>
                  )}
                  
                  {/* Urgent badge */}
                  {plan.urgent && (
                    <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 text-black text-center py-2 text-sm font-bold shadow-lg animate-pulse">
                      <div className="flex items-center justify-center gap-1">
                        ⚡ {plan.urgentText} ⚡
                      </div>
                    </div>
                  )}

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
                      {plan.originalPrice ? (
                        <div className="flex flex-col items-center gap-1">
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
                        </div>
                      ) : (
                        <div className="flex items-baseline justify-center gap-1">
                          <span className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                            {plan.price}
                          </span>
                          {plan.period && (
                            <span className="text-muted-foreground text-base">{plan.period}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="px-5 pb-6">
                    {/* Lista de características más compacta */}
                    <ul className="space-y-2.5 mb-6">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2.5 group/item">
                          <div className="flex-shrink-0 w-4 h-4 rounded-full bg-green-100 flex items-center justify-center mt-0.5 group-hover/item:bg-green-200 transition-colors duration-200">
                            <Check className="w-2.5 h-2.5 text-green-600" />
                          </div>
                          <span className="text-sm leading-relaxed group-hover/item:text-slate-700 transition-colors duration-200">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {/* Botón */}
                    <Button 
                      className={`w-full py-2.5 font-semibold text-sm transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl ${
                        plan.id === 'pro' 
                          ? 'bg-gradient-to-r from-homi-purple to-purple-600 hover:from-purple-600 hover:to-homi-purple text-white' 
                          : plan.id === 'founder'
                          ? 'bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 hover:from-yellow-500 hover:via-orange-500 hover:to-red-500 text-black font-bold shadow-yellow-200'
                          : 'bg-white border-2 border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300'
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

            {/* Call to action más compacto */}
            <div className="text-center">
              <div className="inline-flex flex-col items-center gap-3">
                <p className="text-muted-foreground text-sm">
                  ¿Necesitas más información?
                </p>
                <Link to="/precios">
                  <Button 
                    variant="outline" 
                    className="rounded-full px-6 py-2 bg-white/80 backdrop-blur-sm border-purple-200 text-homi-purple hover:bg-purple-50 hover:border-homi-purple transition-all duration-300 shadow-lg hover:shadow-xl text-sm"
                  >
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
