import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle2, ArrowRight, User, Mail, AtSign, Lock } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const formSchema = z.object({
  firstName: z.string().min(2, {
    message: 'El nombre debe tener al menos 2 caracteres'
  }),
  lastName: z.string().min(2, {
    message: 'Los apellidos deben tener al menos 2 caracteres'
  }),
  username: z.string().min(3, {
    message: 'El nombre de usuario debe tener al menos 3 caracteres'
  }).max(20, {
    message: 'El nombre de usuario no puede tener más de 20 caracteres'
  }).regex(/^[a-z0-9_]+$/, {
    message: 'El nombre de usuario solo puede contener letras minúsculas, números y guiones bajos'
  }),
  email: z.string().email({
    message: 'Email inválido'
  }),
  password: z.string().min(6, {
    message: 'La contraseña debe tener al menos 6 caracteres'
  })
});

const EmailSignup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSigningWithGoogle, setIsSigningWithGoogle] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const formContainerRef = useRef<HTMLDivElement>(null);
  const { signUp } = useAuth();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: '',
    }
  });

  useEffect(() => {
    if (formContainerRef.current) {
      window.scrollTo(0, 0);
      setTimeout(() => {
        if (formContainerRef.current) {
          const headerOffset = 100;
          const formTop = formContainerRef.current.getBoundingClientRect().top;
          const offsetPosition = formTop + window.pageYOffset - headerOffset;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 50);
    }
  }, []);

  const handleGoogleSignIn = () => {
    setIsSigningWithGoogle(true);
    setTimeout(() => {
      const mockGoogleData = {
        firstName: "Usuario",
        lastName: "Google",
        email: "usuario@gmail.com"
      };
      form.setValue("firstName", mockGoogleData.firstName);
      form.setValue("lastName", mockGoogleData.lastName);
      form.setValue("email", mockGoogleData.email);

      form.trigger(["firstName", "lastName", "email"]);
      setIsSigningWithGoogle(false);
      toast({
        title: "Cuenta de Google conectada",
        description: "Tu información básica se ha completado automáticamente. Por favor, completa el resto de datos.",
        variant: "default"
      });
    }, 1000);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    
    try {
      const result = await signUp({
        email: values.email,
        password: values.password,
        firstName: values.firstName,
        lastName: values.lastName,
        username: values.username
      });
      
      if (result.success) {
        console.log("Registration successful, session should be established");
        
        setIsSubmitted(true);
        
        const { data: sessionData } = await supabase.auth.getSession();
        console.log("Current session after signup:", sessionData?.session ? "Session exists" : "No session");
        
        setTimeout(() => {
          window.location.replace("/?registered=true");
        }, 300);
      } else {
        toast({
          title: "Error",
          description: result.error?.message || "Ha ocurrido un error al crear tu cuenta. Inténtalo de nuevo.",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "Ha ocurrido un error al crear tu cuenta. Inténtalo de nuevo.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return <div className="flex flex-col items-center justify-center p-8 bg-gradient-to-br from-homi-ultraLightPurple to-white dark:from-homi-purple/20 dark:to-background rounded-xl border border-homi-purple/20 shadow-md animate-fade-in">
        <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
        <h3 className="text-2xl font-bold mb-3">¡Gracias por registrarte!</h3>
        <p className="text-center text-lg mb-4">
          Hemos creado tu cuenta en Homi. Ahora puedes completar tu perfil.
        </p>
        <div className="text-sm text-muted-foreground">
          <p>Hemos enviado un correo de confirmación a <span className="font-semibold">{form.getValues('email')}</span></p>
        </div>
      </div>;
  }

  return <div className="w-full max-w-3xl mx-auto" ref={formContainerRef}>
      <div className="mb-6 text-center">
        <h3 className="text-xl font-semibold mb-2">Crea tu cuenta en Homi</h3>
        <p className="text-muted-foreground">
          Regístrate para encontrar compañeros de piso compatibles con tu estilo de vida.
        </p>
      </div>

      <div className="bg-white dark:bg-card border border-border shadow-sm rounded-xl p-6 md:p-8 animate-fade-in">
        <div className="mb-6">
          <Button type="button" variant="outline" onClick={handleGoogleSignIn} disabled={isSigningWithGoogle} className="w-full flex items-center justify-center gap-2 py-5 border-2 relative rounded-full">
            {isSigningWithGoogle ? <>
                <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-homi-purple"></div>
                <span>Conectando con Google...</span>
              </> : <>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <span>Continuar con Google</span>
              </>}
          </Button>
        </div>
        
        <div className="relative flex items-center gap-4 py-2">
          <div className="flex-grow border-t"></div>
          <span className="text-muted-foreground text-sm">o completar manualmente</span>
          <div className="flex-grow border-t"></div>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField control={form.control} name="firstName" render={({
                field
              }) => <FormItem>
                    <FormLabel>Nombre *</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input id="firstName" placeholder="Tu nombre" className="pl-10 rounded-full" {...field} />
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>} />
              
              <FormField control={form.control} name="lastName" render={({
                field
              }) => <FormItem>
                    <FormLabel>Apellidos *</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input id="lastName" placeholder="Tus apellidos" className="pl-10 rounded-full" {...field} />
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>} />
            </div>
            
            <FormField control={form.control} name="username" render={({
              field
            }) => <FormItem>
                  <FormLabel>Nombre de usuario *</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input id="username" placeholder="tu_usuario" className="pl-10 rounded-full" {...field} />
                      <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>} />
            
            <FormField control={form.control} name="email" render={({
              field
            }) => <FormItem>
                  <FormLabel>Email *</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input id="email" type="email" placeholder="tu@email.com" className="pl-10 rounded-full" {...field} />
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>} />
            
            <FormField control={form.control} name="password" render={({
              field
            }) => <FormItem>
                  <FormLabel>Contraseña *</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input id="password" type="password" placeholder="••••••••" className="pl-10 rounded-full" {...field} />
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>} />
            
            <Button type="submit" disabled={isLoading} className="w-full mt-6 rounded-full">
              {isLoading ? "Creando cuenta..." : "Crear cuenta"}
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </form>
        </Form>
      </div>
      
      <div className="mt-4 text-center text-xs text-muted-foreground">
        Al crear tu perfil, aceptas nuestros términos y condiciones.
      </div>
    </div>;
};

export default EmailSignup;
