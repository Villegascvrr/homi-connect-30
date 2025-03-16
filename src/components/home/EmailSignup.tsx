
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle2, Send, Mail } from 'lucide-react';

const EmailSignup = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast({
        title: "Error",
        description: "Por favor, introduce un email válido.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // In a real application, this would call an API endpoint to store the email
    // For now, we'll simulate a successful subscription after a short delay
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      setIsSubscribed(true);
      toast({
        title: "¡Registro exitoso!",
        description: "Te notificaremos cuando Homi esté disponible.",
      });
      setEmail('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Ha ocurrido un error. Por favor, inténtalo de nuevo más tarde.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-6 text-center">
        <div className="mb-3 inline-flex items-center justify-center p-2 bg-homi-ultraLightPurple rounded-full">
          <Mail className="h-6 w-6 text-homi-purple" />
        </div>
        <h3 className="text-xl font-bold mb-2 text-homi-purple">¿Quieres ser de los primeros?</h3>
        <p className="text-muted-foreground">
          Déjanos tu email y te avisaremos cuando la plataforma esté lista para usar.
        </p>
      </div>

      {isSubscribed ? (
        <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-2xl border border-green-200 dark:border-green-800 shadow-md">
          <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center mb-3">
            <CheckCircle2 className="h-8 w-8 text-green-500" />
          </div>
          <h4 className="text-lg font-semibold mb-2 text-green-700 dark:text-green-400">¡Gracias por suscribirte!</h4>
          <p className="text-center text-green-600 dark:text-green-300">Te notificaremos cuando Homi esté disponible para que seas de los primeros en probarlo.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-background shadow-lg border border-border rounded-2xl p-5">
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-2">
            <div className="relative flex-grow">
              <Input
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pr-10 h-12 bg-muted/50 focus:ring-2 focus:ring-homi-purple focus:border-transparent"
                disabled={isLoading}
              />
            </div>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="h-12 rounded-xl bg-gradient-to-r from-homi-purple to-homi-lightPurple hover:opacity-90 transition-all shadow-md hover:shadow-lg hover:shadow-homi-purple/20"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Enviando...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  Notifícame
                </span>
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default EmailSignup;
