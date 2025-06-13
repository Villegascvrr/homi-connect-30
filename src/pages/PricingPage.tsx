
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Crown, Star, Zap, Users, Filter, Eye, HeadphonesIcon, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';

const PricingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const plans = [
    {
      id: 'free',
      name: 'Plan Gratuito',
      price: 'Gratis',
      period: '',
      icon: <Zap className="w-8 h-8 text-green-500" />,
      description: 'Perfecto para empezar a conectar',
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
      icon: <Star className="w-8 h-8 text-homi-purple" />,
      description: 'La experiencia completa de HomiMatch',
      features: [
        'Swipes y matches ilimitados',
        'Filtros personalizados (zona, edad, género, presupuesto...)',
        'Visibilidad prioritaria en los resultados de búsqueda'
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
      originalPrice: '59,99€',
      period: '/año',
      icon: <Crown className="w-8 h-8 text-yellow-500" />,
      description: 'Acceso exclusivo para los primeros usuarios',
      features: [
        'Incluye todas las ventajas del Plan PRO',
        'Distintivo visual especial en el perfil',
        'Acceso anticipado a funcionalidades futuras',
        'Prioridad en soporte y feedback directo con el equipo'
      ],
      buttonText: 'Quiero ser Fundador',
      buttonVariant: 'default' as const,
      popular: false,
      urgent: true,
      urgentText: 'Solo para los 50 primeros usuarios'
    }
  ];

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
    
    if (planId === 'free') {
      if (user) {
        navigate('/matching');
      } else {
        navigate('/register');
      }
    } else {
      // Por ahora redirigir a una página de suscripción placeholder
      navigate('/suscripcion');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="pt-16">
        <Navbar />
      </div>
      
      <main className="flex-grow py-16 md:py-20">
        <div className="container mx-auto px-4 md:px-6">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
            <h1 className="text-3xl md:text-5xl font-bold mb-6">
              Elige el plan perfecto para <span className="homi-gradient-text">encontrar tu hogar</span>
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl">
              Encuentra compañeros de piso compatibles con el plan que mejor se adapte a tus necesidades
            </p>
          </div>

          {/* Planes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
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
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-yellow-400 to-orange-400 text-black text-center py-2 text-sm font-bold">
                    ⚠️ {plan.urgentText}
                  </div>
                )}

                <CardHeader className={`text-center ${plan.popular || plan.urgent ? 'pt-12' : 'pt-6'}`}>
                  <div className="flex justify-center mb-4">
                    {plan.icon}
                  </div>
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {plan.description}
                  </CardDescription>
                  <div className="mt-4">
                    {plan.originalPrice ? (
                      <div className="flex flex-col items-center gap-1">
                        <div className="flex items-baseline justify-center gap-1 text-muted-foreground">
                          <span className="text-lg line-through">
                            {plan.originalPrice}
                          </span>
                          <span className="text-sm">{plan.period}</span>
                        </div>
                        <div className="flex items-baseline justify-center gap-1">
                          <span className="text-4xl font-bold">{plan.price}</span>
                          <span className="text-muted-foreground">{plan.period}</span>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <span className="text-4xl font-bold">{plan.price}</span>
                        {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    className={`w-full mt-6 ${
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

          {/* FAQ Section */}
          <div className="mt-16 md:mt-20 max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
              Preguntas frecuentes
            </h2>
            <div className="space-y-6">
              <div className="p-6 rounded-lg bg-muted">
                <h3 className="font-semibold mb-2">¿Puedo cambiar de plan en cualquier momento?</h3>
                <p className="text-muted-foreground">
                  Sí, puedes actualizar o cancelar tu plan en cualquier momento desde tu perfil.
                </p>
              </div>
              <div className="p-6 rounded-lg bg-muted">
                <h3 className="font-semibold mb-2">¿Qué incluyen los filtros personalizados?</h3>
                <p className="text-muted-foreground">
                  Puedes filtrar por zona de Sevilla, rango de edad, género, presupuesto máximo, tipo de vivienda y preferencias de convivencia.
                </p>
              </div>
              <div className="p-6 rounded-lg bg-muted">
                <h3 className="font-semibold mb-2">¿El Plan Fundador es realmente limitado?</h3>
                <p className="text-muted-foreground">
                  El Plan Fundador ofrece condiciones especiales para los primeros usuarios que confían en HomiMatch desde el principio.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PricingPage;
