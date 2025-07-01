import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Crown, Star, Zap, Users, Filter, Eye, HeadphonesIcon, Sparkles, Loader2 } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';
import { useSubscription } from '@/hooks/useSubscription';
import { useToast } from '@/hooks/use-toast';

const PricingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { subscriptionInfo, loading, createCheckout, openCustomerPortal } = useSubscription();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const selectedPlan = searchParams.get('plan');

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
        'Chat integrado'
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
      price: '2,99€',
      period: '/mes',
      icon: <Star className="w-6 h-6 text-homi-purple" />,
      description: 'La experiencia completa',
      features: [
        'Swipes y matches ilimitados',
        'Filtros avanzados (zona, edad, género, presupuesto...)',
        'Visibilidad prioritaria en los resultados de búsqueda',
        'Chat integrado'
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
      price: '17,99€',
      originalPrice: '35,88€',
      period: '/año',
      icon: <Crown className="w-6 h-6 text-yellow-500" />,
      description: 'Acceso exclusivo',
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
      urgentText: 'Solo para los 50 primeros usuarios',
      bgGradient: 'from-yellow-50 to-orange-50',
      borderColor: 'border-yellow-400 hover:border-yellow-500'
    }
  ];

  const handlePlanSelect = async (planId: string) => {
    if (planId === 'free') {
      if (user) {
        navigate('/matching');
      } else {
        navigate('/register');
      }
      return;
    }

    if (!user) {
      toast({
        title: "Inicia sesión",
        description: "Necesitas una cuenta para suscribirte a un plan premium"
      });
      navigate('/register');
      return;
    }

    await createCheckout(planId);
  };

  const isCurrentPlan = (planId: string) => {
    if (planId === 'free') return !subscriptionInfo.subscribed;
    if (planId === 'pro') return subscriptionInfo.subscription_tier === 'PRO';
    if (planId === 'founder') return subscriptionInfo.subscription_tier === 'Fundador';
    return false;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="pt-0">
        <Navbar />
      </div>
      
      <main className="flex-grow py-16 md:py-20">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          {/* Header */}
          <div className="text-center max-w-4xl mx-auto mb-12 md:mb-16">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-purple-200 mb-4">
              <Sparkles className="w-4 h-4 text-homi-purple" />
              <span className="text-sm font-medium text-homi-purple">Planes diseñados para ti</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight py-1 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Elige el plan perfecto para <span className="homi-gradient-text">encontrar lo que buscas</span>
            </h1>
            <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
              Encuentra compañeros de piso compatibles con el plan que mejor se adapte a tus necesidades
            </p>
          </div>

          {/* Subscription Status */}
          {user && subscriptionInfo.subscribed && (
            <div className="max-w-md mx-auto mb-8 p-4 bg-green-50 border border-green-200 rounded-lg text-center">
              <div className="text-green-700 font-medium">
                Plan actual: {subscriptionInfo.subscription_tier}
              </div>
              {subscriptionInfo.subscription_end && (
                <div className="text-green-600 text-sm mt-1">
                  Válido hasta: {new Date(subscriptionInfo.subscription_end).toLocaleDateString('es-ES')}
                </div>
              )}
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2" 
                onClick={openCustomerPortal} 
                disabled={loading}
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Gestionar suscripción"}
              </Button>
            </div>
          )}

          {/* Plans Grid with modern design */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
            {plans.map((plan, index) => (
              <Card 
                key={plan.id} 
                className={`relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-purple-100/50 group ${
                  plan.popular ? 'scale-105 shadow-xl border-2 border-homi-purple' : 'hover:scale-105'
                } ${
                  plan.urgent ? 'border-2 border-yellow-400 shadow-lg shadow-yellow-100' : plan.borderColor
                } ${
                  isCurrentPlan(plan.id) ? 'ring-2 ring-green-500' : ''
                } bg-gradient-to-br ${plan.bgGradient} backdrop-blur-sm`}
                style={{ animationDelay: `${index * 100}ms` }}
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

                {/* Current plan badge */}
                {isCurrentPlan(plan.id) && (
                  <div className="absolute top-0 left-0 right-0 bg-green-500 text-white text-center py-2 text-sm font-medium">
                    ✅ Tu Plan Actual
                  </div>
                )}

                <CardHeader className={`text-center relative ${plan.popular || plan.urgent || isCurrentPlan(plan.id) ? 'pt-12' : 'pt-6'} pb-4`}>
                  {/* Icon with glow effect */}
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
                  
                  {/* Price with better styling */}
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
                        {plan.period && <span className="text-muted-foreground text-base">{plan.period}</span>}
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="px-5 pb-6">
                  {/* Features list with modern styling */}
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

                  {/* Button */}
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
                    disabled={loading || isCurrentPlan(plan.id)}
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    {isCurrentPlan(plan.id) ? 'Plan Actual' : plan.buttonText}
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
              <div className="p-6 rounded-lg bg-white/80 backdrop-blur-sm border border-purple-100 shadow-lg">
                <h3 className="font-semibold mb-2">¿Puedo cambiar de plan en cualquier momento?</h3>
                <p className="text-muted-foreground">
                  Sí, puedes actualizar o cancelar tu plan en cualquier momento desde tu perfil o el portal de gestión de Stripe.
                </p>
              </div>
              <div className="p-6 rounded-lg bg-white/80 backdrop-blur-sm border border-purple-100 shadow-lg">
                <h3 className="font-semibold mb-2">¿Qué incluyen los filtros avanzados?</h3>
                <p className="text-muted-foreground">
                  Puedes filtrar por zona de Sevilla, rango de edad, género, presupuesto máximo, tipo de vivienda y preferencias de convivencia.
                </p>
              </div>
              <div className="p-6 rounded-lg bg-white/80 backdrop-blur-sm border border-purple-100 shadow-lg">
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
