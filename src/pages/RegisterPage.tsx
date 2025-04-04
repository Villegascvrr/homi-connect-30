
import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { 
  Eye, 
  EyeOff, 
  Lock, 
  Mail, 
  User,
  AtSign,
  ArrowRight,
} from 'lucide-react';
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
  FormDescription,
} from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/context/AuthContext';

const formSchema = z.object({
  firstName: z.string().min(2, { message: 'El nombre debe tener al menos 2 caracteres' }),
  lastName: z.string().min(2, { message: 'Los apellidos deben tener al menos 2 caracteres' }),
  username: z.string()
    .min(3, { message: 'El nombre de usuario debe tener al menos 3 caracteres' })
    .max(20, { message: 'El nombre de usuario no puede tener más de 20 caracteres' })
    .regex(/^[a-z0-9_]+$/, { message: 'El nombre de usuario solo puede contener letras minúsculas, números y guiones bajos' }),
  email: z.string().email({ message: 'Email inválido' }),
  password: z.string().min(6, { message: 'La contraseña debe tener al menos 6 caracteres' }),
  confirmPassword: z.string(),
  terms: z.boolean().refine(val => val === true, {
    message: 'Debes aceptar los términos y condiciones',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSigningWithGoogle, setIsSigningWithGoogle] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const formContainerRef = useRef<HTMLDivElement>(null);
  const { signUp } = useAuth();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      terms: false,
    },
    mode: "onChange"
  });

  const handleGoogleSignIn = () => {
    setIsSigningWithGoogle(true);
    
    setTimeout(() => {
      const mockGoogleData = {
        firstName: "Usuario",
        lastName: "Google",
        email: "usuario@gmail.com",
      };
      
      form.setValue("firstName", mockGoogleData.firstName);
      form.setValue("lastName", mockGoogleData.lastName);
      form.setValue("email", mockGoogleData.email);
      
      form.trigger(["firstName", "lastName", "email"]);
      
      setIsSigningWithGoogle(false);
      
      toast({
        title: "Cuenta de Google conectada",
        description: "Tu información básica se ha completado automáticamente. Por favor, completa el resto de datos.",
        variant: "default",
      });
    }, 1000);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log('Form submitted:', values);
    setIsSubmitting(true);
    
    try {
      await signUp({
        email: values.email,
        password: values.password,
        firstName: values.firstName,
        lastName: values.lastName,
        username: values.username
      });
      
      toast({
        title: "Registro exitoso",
        description: "¡Tu perfil ha sido creado! Ahora puedes encontrar tu compañero de piso ideal.",
        variant: "default",
      });
      
      navigate('/?registered=true');
    } catch (error) {
      toast({
        title: "Error",
        description: "Ocurrió un error al procesar tu registro. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-20 pb-12">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto" ref={formContainerRef}>
            <div className="glass-card p-4 md:p-8 rounded-xl mb-20">
              <div className="text-center mb-8">
                <h1 className="text-2xl md:text-3xl font-bold mb-2">
                  <span className="homi-gradient-text">Crear tu cuenta</span>
                </h1>
                <p className="text-muted-foreground">
                  Regístrate para encontrar tu compañero de piso ideal
                </p>
              </div>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-4 sm:space-y-6">
                    <div className="mb-6">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleGoogleSignIn}
                        disabled={isSigningWithGoogle}
                        className="w-full flex items-center justify-center gap-2 py-5 border-2 relative rounded-full"
                      >
                        {isSigningWithGoogle ? (
                          <>
                            <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-homi-purple"></div>
                            <span>Conectando con Google...</span>
                          </>
                        ) : (
                          <>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            <span>Continuar con Google</span>
                          </>
                        )}
                      </Button>
                    </div>
                    
                    <div className="relative flex items-center gap-4 py-2">
                      <div className="flex-grow border-t"></div>
                      <span className="text-muted-foreground text-sm">o registrarse con email</span>
                      <div className="flex-grow border-t"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nombre</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input 
                                  placeholder="Tu nombre" 
                                  className="pl-10 rounded-full" 
                                  {...field} 
                                />
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Apellidos</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input 
                                  placeholder="Tus apellidos" 
                                  className="pl-10 rounded-full" 
                                  {...field} 
                                />
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre de usuario</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input 
                                placeholder="tu_usuario" 
                                className="pl-10 rounded-full" 
                                {...field} 
                              />
                              <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            </div>
                          </FormControl>
                          <FormDescription>
                            Tu identificador único en la plataforma. Solo puede contener letras minúsculas, números y guiones bajos.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Correo electrónico</FormLabel>
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
                          <FormLabel>Contraseña</FormLabel>
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
                    
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirmar contraseña</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input 
                                placeholder="••••••••" 
                                type={showConfirmPassword ? "text" : "password"} 
                                className="pl-10 rounded-full" 
                                {...field} 
                              />
                              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                              <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                              >
                                {showConfirmPassword ? (
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
                    
                    <FormField
                      control={form.control}
                      name="terms"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-sm font-normal">
                              Acepto los <Link to="/terms" className="text-homi-purple hover:underline">términos y condiciones</Link> y la <Link to="/privacy" className="text-homi-purple hover:underline">política de privacidad</Link>
                            </FormLabel>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit"
                      className="rounded-full bg-homi-purple hover:bg-homi-purple/90 w-full mt-4 flex items-center gap-1"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></div>
                          Creando cuenta...
                        </>
                      ) : (
                        <>
                          Crear cuenta
                          <ArrowRight className="ml-1 h-4 w-4" />
                        </>
                      )}
                    </Button>
                    
                    <div className="mt-6 pt-6 border-t text-center">
                      <p>
                        ¿Ya tienes una cuenta?{' '}
                        <Link to="/signin" className="text-homi-purple hover:underline font-medium">
                          Iniciar sesión
                        </Link>
                      </p>
                    </div>
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

export default RegisterPage;
