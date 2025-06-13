
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const SubscriptionPage = () => {
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
                  <CreditCard className="w-16 h-16 text-homi-purple" />
                </div>
                <CardTitle className="text-3xl font-bold mb-4">
                  Próximamente disponible
                </CardTitle>
                <CardDescription className="text-lg">
                  Estamos trabajando en integrar la pasarela de pagos para que puedas disfrutar de todos los beneficios de HomiMatch PRO y Fundador.
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="p-6 bg-homi-ultraLightPurple rounded-lg">
                  <h3 className="font-semibold text-homi-purple mb-2">
                    ¿Quieres ser notificado cuando esté listo?
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Mientras tanto, puedes disfrutar de todas las funcionalidades gratuitas de HomiMatch.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild variant="outline">
                    <Link to="/precios" className="flex items-center gap-2">
                      <ArrowLeft className="w-4 h-4" />
                      Volver a precios
                    </Link>
                  </Button>
                  <Button asChild className="bg-homi-purple hover:bg-homi-purple/90">
                    <Link to="/matching">
                      Explorar gratis
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SubscriptionPage;
