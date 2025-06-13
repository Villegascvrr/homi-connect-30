
import { useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, ArrowRight } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useSubscription } from '@/hooks/useSubscription';

const SuccessPage = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { checkSubscription } = useSubscription();

  useEffect(() => {
    // Check subscription status when user lands on success page
    if (sessionId) {
      // Wait a moment for Stripe to process, then check subscription
      setTimeout(() => {
        checkSubscription();
      }, 2000);
    }
  }, [sessionId, checkSubscription]);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="pt-16">
        <Navbar />
      </div>
      
      <main className="flex-grow py-16 md:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-2xl mx-auto text-center">
            <Card className="p-8">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <CheckCircle className="w-16 h-16 text-green-500" />
                </div>
                <CardTitle className="text-3xl font-bold mb-4 text-green-700">
                  ¡Pago exitoso!
                </CardTitle>
                <CardDescription className="text-lg">
                  Tu suscripción se ha activado correctamente. Ya puedes disfrutar de todas las funcionalidades premium de HomiMatch.
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="p-6 bg-green-50 rounded-lg border border-green-200">
                  <h3 className="font-semibold text-green-700 mb-2">
                    ¿Qué puedes hacer ahora?
                  </h3>
                  <ul className="text-sm text-green-600 space-y-1 text-left">
                    <li>• Swipes y matches ilimitados</li>
                    <li>• Usar filtros personalizados</li>
                    <li>• Mayor visibilidad en búsquedas</li>
                    <li>• Acceso a funcionalidades premium</li>
                  </ul>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild className="bg-homi-purple hover:bg-homi-purple/90">
                    <Link to="/matching" className="flex items-center gap-2">
                      Explorar perfiles
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link to="/precios">
                      Ver mi suscripción
                    </Link>
                  </Button>
                </div>

                {sessionId && (
                  <div className="text-xs text-muted-foreground">
                    ID de sesión: {sessionId}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SuccessPage;
