
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
import { signInWithGoogleOAuth } from '@/integrations/supabase/client';

const formSchema = z.object({
  email: z.string().email({
    message: 'Email inválido',
  }),
  password: z.string().min(1, {
    message: 'La contraseña es obligatoria',
  }),
});

const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

const SignInPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showEmailVerificationAlert, setShowEmailVerificationAlert] = useState(false);
  const [loginError, setLoginError] = useState('');
  
  const { user, signIn, loading: authLoading } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Handle URL parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const emailVerified = params.get('email_verified');
    const needsVerification = params.get('needs_verification');
    
    if (emailVerified === 'true') {
      toast({
        title: "Email verificado",
        description: "Tu correo electrónico ha sido verificado correctamente.",
        variant: "default",
      });
      // Clean URL
      window.history.replaceState({}, '', '/signin');
    }
    
    if (needsVerification === 'true') {
      setShowEmailVerificationAlert(true);
    }

    setLoginError('');
  }, [location.search, toast]);
  
  // Redirect if user is already logged in
  useEffect(() => {
    if (user && !authLoading) {
      console.log('User is logged in, redirecting to home');
      navigate('/', { replace: true });
    }
  }, [user, authLoading, navigate]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (isLoading) return;
    
    setIsLoading(true);
    setLoginError('');
    
    try {
      console.log('Attempting sign in with:', values.email);
      await signIn(values.email, values.password);
      // Don't manually redirect here - let the useEffect handle it
    } catch (error: any) {
      console.error("Error during sign in:", error);
      setLoginError(error.message || 'Error al iniciar sesión. Verifica tus credenciales.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (isGoogleLoading) return;
    
    try {
      setIsGoogleLoading(true);
      setLoginError('');
      console.log('Attempting Google sign in');
      await signInWithGoogleOAuth();
    } catch (error: any) {
      console.error("Error durante la autenticación con Google:", error);
      setLoginError(error.message || 'Error al iniciar sesión con Google.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // Show loading while checking auth state
  if (authLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-dotted border-homi-purple"></div>
        <p className="text-sm text-muted-foreground mt-4">Verificando sesión...</p>
      </div>
    );
  }

  // Don't render if user is already logged in
  if (user) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-dotted border-homi-purple"></div>
        <p className="text-sm text-muted-foreground mt-4">Redirigiendo...</p>
      </div>
    );
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
                  <span className="homi-gradient-text">Acceder a tu cuenta</span>
                </h1>
                <p className="text-muted-foreground">
                  Accede a HomiMatch y conecta con compañeros ideales
                </p>
              </div>
              
              {showEmailVerificationAlert && (
                <Alert className="mb-6 bg-amber-50 text-amber-800 border border-amber-200">
                  <AlertDescription>
                    Por favor, verifica tu correo electrónico antes de acceder. Revisa tu bandeja de entrada y spam.
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

              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleSignIn}
                disabled={isGoogleLoading || isLoading}
                className="w-full flex items-center justify-center gap-2 py-5 border-2 relative rounded-full mb-6"
              >
                {isGoogleLoading ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-homi-purple"></div>
                    <span>Conectando con Google...</span>
                  </>
                ) : (
                  <>
                    <GoogleIcon />
                    <span>Acceder con Google</span>
                  </>
                )}
              </Button>

              <div className="relative flex items-center gap-4 py-2 mb-6">
                <div className="flex-grow border-t"></div>
                <span className="text-muted-foreground text-sm">o con email</span>
                <div className="flex-grow border-t"></div>
              </div>
              
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
                              disabled={isLoading}
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
                              disabled={isLoading}
                              {...field} 
                            />
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                              disabled={isLoading}
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
                        Accediendo...
                      </>
                    ) : (
                      <>
                        Acceder a HomiMatch
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </>
                    )}
                  </Button>
                  
                  <div className="mt-6 pt-6 border-t text-center">
                    <p>
                      ¿No tienes cuenta?{' '}
                      <Link to="/register" className="text-homi-purple hover:underline font-medium">
                        Crear cuenta ahora
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
