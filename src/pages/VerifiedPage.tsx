
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Clock } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

const VerifiedPage = () => {
  const [isVerifying, setIsVerifying] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const { refreshUser, isEmailVerified, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkVerification = async () => {
      try {
        // Refrescar los datos del usuario para obtener el estado de verificación actualizado
        await refreshUser();
        setIsVerifying(false);
        setIsSuccess(isEmailVerified);
      } catch (error) {
        console.error("Error checking verification status:", error);
        setIsVerifying(false);
        setIsSuccess(false);
      }
    };

    // Esperar un momento para permitir que la sesión se actualice
    const timer = setTimeout(() => {
      checkVerification();
    }, 1500);

    return () => clearTimeout(timer);
  }, [refreshUser, isEmailVerified]);

  const handleGoToProfile = () => {
    navigate('/profile');
  };

  const handleGoToHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20 pb-12 flex items-center justify-center">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto glass-card p-8 rounded-xl text-center">
            {isVerifying ? (
              <div className="flex flex-col items-center">
                <Clock className="w-16 h-16 text-homi-purple animate-pulse mb-4" />
                <h1 className="text-2xl font-bold mb-4">Verificando tu correo electrónico...</h1>
                <p className="text-muted-foreground">Estamos comprobando el estado de verificación de tu cuenta.</p>
              </div>
            ) : isSuccess ? (
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
                  <Check className="w-8 h-8 text-green-500" />
                </div>
                <h1 className="text-2xl font-bold mb-4">¡Correo verificado con éxito!</h1>
                <p className="text-muted-foreground mb-8">
                  Tu dirección de correo electrónico ha sido verificada correctamente. 
                  Ahora puedes disfrutar de todas las funcionalidades de Homi.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 w-full">
                  <Button onClick={handleGoToProfile} className="flex-1 rounded-full">
                    Completar mi perfil
                  </Button>
                  <Button onClick={handleGoToHome} variant="outline" className="flex-1 rounded-full">
                    Ir al inicio
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
                  <Check className="w-8 h-8 text-red-500" />
                </div>
                <h1 className="text-2xl font-bold mb-4">Verificación pendiente</h1>
                <p className="text-muted-foreground mb-8">
                  Parece que tu correo electrónico aún no ha sido verificado. 
                  Por favor, revisa tu bandeja de entrada y haz clic en el enlace 
                  de verificación que te hemos enviado.
                </p>
                <Button onClick={handleGoToHome} className="rounded-full">
                  Volver al inicio
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default VerifiedPage;
