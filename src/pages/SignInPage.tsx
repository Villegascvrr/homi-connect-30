
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Eye, EyeOff, Lock, Mail, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/context/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';

const formSchema = z.object({
  email: z.string().email({
    message: 'Email inválido',
  }),
  password: z.string().min(1, {
    message: 'La contraseña es obligatoria',
  }),
});

const SignInPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = useState(false);
  const { user, signIn } = useAuth();
  const [showEmailVerificationAlert, setShowEmailVerificationAlert] = useState(false);
  const [loginError, setLoginError] = useState('');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const emailVerified = params.get('email_verified');
    
    if (emailVerified === 'true') {
      toast({
        title: "Email verificado",
        description: "Tu correo electrónico ha sido verificado correctamente.",
        variant: "default",
      });
      
      navigate('/signin', { replace: true });
    }
    
    const needsVerification = params.get('needs_verification');
    if (needsVerification === 'true') {
      setShowEmailVerificationAlert(true);
    }

    // Clear any previous login errors when the component mounts
    setLoginError('');
  }, [location, navigate, toast]);
  
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setLoginError('');
    
    try {
      await signIn(values.email, values.password);
      // The redirect is now handled in the AuthContext
    } catch (error: any) {
      console.error("Error during sign in:", error);
      setLoginError(error.message || 'Error al iniciar sesión. Verifica tus credenciales.');
    } finally {
      setIsLoading(false);
    }
  };

  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-20 pb-12">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto">
            <div className="glass-card p-4 md:p-8 rounded-xl mb-20">
              <div className="text-center mb-8">
                <h1 className="text-2xl md:text-3xl font-bold mb-2">
                  <span className="homi-gradient-text">Iniciar sesión</span>
                </h1>
                <p className="text-muted-foreground">
                  Accede a tu cuenta para conectar con compañeros ideales
                </p>
              </div>
              
              {showEmailVerificationAlert && (
                <Alert className="mb-6 bg-amber-50 text-amber-800 border border-amber-200">
                  <AlertDescription>
                    Por favor, verifica tu correo electrónico antes de iniciar sesión. Revisa tu bandeja de entrada y spam.
                  </AlertDescription>
                </Alert>
              )}

              {loginError && (
                <Alert className="mb-6 bg-red-50 text-red-800 border border-red-200">
                  <AlertDescription>
                    {loginError}
                  </AlertDescription>
                </Alert>
              )}
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              placeholder="tu@email.com" 
                              type="email" 
                              className="pl-10 rounded-full" 
                              {...field} 
                            />
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between">
                          <FormLabel>Contraseña</FormLabel>
                          <Link to="/forgot-password" className="text-xs text-homi-purple hover:underline">
                            ¿Olvidaste tu contraseña?
                          </Link>
                        </div>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              placeholder="••••••••" 
                              type={showPassword ? "text" : "password"} 
                              className="pl-10 rounded-full" 
                              {...field} 
                            />
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                            >
                              {showPassword ? (
                                <EyeOff className="h-5 w-5" />
                              ) : (
                                <Eye className="h-5 w-5" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit"
                    className="rounded-full bg-homi-purple hover:bg-homi-purple/90 w-full mt-4 flex items-center gap-1"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></div>
                        Iniciando sesión...
                      </>
                    ) : (
                      <>
                        Iniciar sesión
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </>
                    )}
                  </Button>
                  
                  <div className="mt-6 pt-6 border-t text-center">
                    <p>
                      ¿No tienes cuenta?{' '}
                      <Link to="/register" className="text-homi-purple hover:underline font-medium">
                        Regístrate ahora
                      </Link>
                    </p>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SignInPage;
