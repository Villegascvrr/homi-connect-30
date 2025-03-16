
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle2 } from 'lucide-react';

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
        <h3 className="text-lg font-semibold mb-2">¿Quieres ser de los primeros en usar Homi?</h3>
        <p className="text-muted-foreground">
          Déjanos tu email y te avisaremos cuando la plataforma esté lista para usar.
        </p>
      </div>

      {isSubscribed ? (
        <div className="flex flex-col items-center justify-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <CheckCircle2 className="h-8 w-8 text-green-500 mb-2" />
          <p className="text-center">¡Gracias por suscribirte! Te notificaremos cuando Homi esté disponible.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-2">
          <Input
            type="email"
            placeholder="tu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-grow"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            disabled={isLoading}
            className="bg-homi-purple hover:bg-homi-purple/90"
          >
            {isLoading ? "Enviando..." : "Notifícame"}
          </Button>
        </form>
      )}
    </div>
  );
};

export default EmailSignup;
