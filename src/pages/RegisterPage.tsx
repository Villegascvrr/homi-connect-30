
import { useState } from 'react';
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
  Heart, 
  BookOpen, 
  Music, 
  Users, 
  Film, 
  Utensils, 
  Globe, 
  Moon, 
  Sun,
  AtSign
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from '@/hooks/use-mobile';

const formSchema = z.object({
  name: z.string().min(2, { message: 'El nombre debe tener al menos 2 caracteres' }),
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
  
  age: z.string().refine((val) => {
    const num = parseInt(val);
    return !isNaN(num) && num >= 18 && num <= 99;
  }, {
    message: "La edad debe ser un número entre 18 y 99.",
  }),
  location: z.string().min(2, {
    message: "La ubicación es requerida.",
  }),
  occupation: z.string().optional(),
  university: z.string().optional(),
  bio: z.string().min(10, {
    message: "La bio debe tener al menos 10 caracteres.",
  }).max(500, {
    message: "La bio no puede tener más de 500 caracteres.",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

type InterestCategory = {
  id: string;
  name: string;
  icon: JSX.Element;
  interests: string[];
};

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("cuenta");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [lifestylePreferences, setLifestylePreferences] = useState({
    morningPerson: false,
    nightPerson: false,
    socializing: "moderado",
    cleanliness: "moderado",
    noise: "moderado",
  });
  const [isSigningWithGoogle, setIsSigningWithGoogle] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      terms: false,
      age: '',
      location: '',
      occupation: '',
      university: '',
      bio: '',
    },
    mode: "onChange"
  });

  const handleGoogleSignIn = () => {
    setIsSigningWithGoogle(true);
    
    setTimeout(() => {
      const mockGoogleData = {
        name: "Usuario Google",
        email: "usuario@gmail.com",
      };
      
      form.setValue("name", mockGoogleData.name);
      form.setValue("email", mockGoogleData.email);
      
      form.trigger(["name", "email"]);
      
      setIsSigningWithGoogle(false);
      
      toast({
        title: "Cuenta de Google conectada",
        description: "Tu información básica se ha completado automáticamente. Por favor, completa el resto de datos.",
        variant: "default",
      });
    }, 1000);
  };

  const interestCategories: InterestCategory[] = [
    {
      id: "reading",
      name: "Lectura y cultura",
      icon: <BookOpen size={18} />,
      interests: [
        "Ficción", "No-ficción", "Poesía", "Audiolibros", 
        "Clubs de lectura", "Museos", "Teatro", "Arte"
      ]
    },
    {
      id: "music",
      name: "Música",
      icon: <Music size={18} />,
      interests: [
        "Pop", "Rock", "Clásica", "Electrónica", "Jazz", "Hip-hop", 
        "Indie", "Folk", "Conciertos", "Tocar instrumentos"
      ]
    },
    {
      id: "social",
      name: "Social",
      icon: <Users size={18} />,
      interests: [
        "Fiestas", "Cenas", "Eventos", "Voluntariado", 
        "Deportes en equipo", "Juegos de mesa", "Debates"
      ]
    },
    {
      id: "food",
      name: "Gastronomía",
      icon: <Utensils size={18} />,
      interests: [
        "Cocinar", "Repostería", "Salir a comer", "Comida internacional", 
        "Vegetariano/Vegano", "Vino", "Cafeterías", "Food trucks"
      ]
    },
    {
      id: "entertainment",
      name: "Entretenimiento",
      icon: <Film size={18} />,
      interests: [
        "Cine", "Series", "Documentales", "Videojuegos", 
        "Realidad virtual", "Podcast", "Fotografía"
      ]
    },
    {
      id: "travel",
      name: "Viajes",
      icon: <Globe size={18} />,
      interests: [
        "Mochilero", "Viajes culturales", "Ecoturismo", "Camping", 
        "Playa", "Montaña", "Ciudades", "Idiomas"
      ]
    }
  ];

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev => 
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const handleLifestyleChange = (field: string, value: any) => {
    setLifestylePreferences(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const userData = {
      ...values,
      interests: selectedInterests,
      lifestyle: lifestylePreferences
    };
    
    console.log('Datos completos del usuario:', userData);
    
    toast({
      title: "Registro exitoso",
      description: "¡Tu perfil ha sido creado! Ahora puedes encontrar tu compañero de piso ideal.",
      variant: "default",
    });
    
    navigate('/profile');
  };

  const isAccountValid = () => {
    const name = form.getValues('name');
    const username = form.getValues('username');
    const email = form.getValues('email');
    const password = form.getValues('password');
    const confirmPassword = form.getValues('confirmPassword');
    const terms = form.getValues('terms');
    
    return name && 
           username && 
           email && 
           password && 
           confirmPassword && 
           password === confirmPassword &&
           terms;
  };

  const handleContinueClick = async () => {
    const result = await form.trigger(['name', 'username', 'email', 'password', 'confirmPassword', 'terms']);
    
    if (result && isAccountValid()) {
      setActiveTab("perfil");
      toast({
        title: "Datos guardados",
        description: "Completa tu perfil para finalizar el registro",
        variant: "default",
      });
    } else {
      toast({
        title: "Error en el formulario",
        description: "Por favor, completa correctamente todos los campos",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-20 pb-12">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <div className="glass-card p-6 md:p-8">
              <div className="text-center mb-8">
                <h1 className="text-2xl md:text-3xl font-bold mb-2">
                  <span className="homi-gradient-text">Crear tu cuenta y perfil</span>
                </h1>
                <p className="text-muted-foreground">
                  Regístrate y crea tu perfil para encontrar tu compañero de piso ideal
                </p>
              </div>
              
              <Tabs 
                defaultValue="cuenta" 
                value={activeTab} 
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid grid-cols-2 mb-8">
                  <TabsTrigger value="cuenta">Datos de cuenta</TabsTrigger>
                  <TabsTrigger 
                    value="perfil" 
                    disabled={!isAccountValid}
                    className={!isAccountValid ? "cursor-not-allowed" : ""}
                  >
                    Perfil personal
                  </TabsTrigger>
                </TabsList>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <TabsContent value="cuenta" className="space-y-6">
                      <div className="mb-6">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleGoogleSignIn}
                          disabled={isSigningWithGoogle}
                          className="w-full flex items-center justify-center gap-2 py-5 border-2 relative"
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

                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nombre completo</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input 
                                  placeholder="Tu nombre" 
                                  className="pl-10" 
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
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nombre de usuario</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input 
                                  placeholder="tu_usuario" 
                                  className="pl-10" 
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
                                  className="pl-10" 
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
                                  className="pl-10" 
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
                                  className="pl-10" 
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
                      
                      <div className="flex justify-end">
                        <Button 
                          type="button" 
                          className="rounded-full bg-homi-purple hover:bg-homi-purple/90"
                          onClick={handleContinueClick}
                        >
                          Continuar
                        </Button>
                      </div>
                      
                      <div className="mt-6 pt-6 border-t text-center">
                        <p>
                          ¿Ya tienes una cuenta?{' '}
                          <Link to="/signin" className="text-homi-purple hover:underline font-medium">
                            Iniciar sesión
                          </Link>
                        </p>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="perfil" className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="age"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Edad</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  placeholder="Tu edad" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Ciudad</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="¿Dónde vives?" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="occupation"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Ocupación</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="¿A qué te dedicas?" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="university"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Universidad (si aplica)</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="¿Dónde estudias?" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="bio"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Sobre mí</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Cuéntanos un poco sobre ti, tus rutinas y lo que te gusta hacer..."
                                className="min-h-[100px]"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Comparte algo que te defina y ayude a otros a conocerte mejor.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Separator className="my-8" />
                      
                      <div>
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                          <Heart className="text-homi-purple" size={20} />
                          Intereses y aficiones
                        </h2>
                        <p className="text-muted-foreground mb-6">
                          Selecciona intereses que te definan. Esto nos ayudará a conectarte con personas con gustos similares.
                        </p>
                        
                        <div className="space-y-6">
                          {interestCategories.map((category) => (
                            <div key={category.id} className="mb-4">
                              <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                                {category.icon}
                                {category.name}
                              </h3>
                              <div className="flex flex-wrap gap-2">
                                {category.interests.map((interest) => (
                                  <button
                                    key={interest}
                                    type="button"
                                    className={`px-3 py-1 text-sm rounded-full transition-colors ${
                                      selectedInterests.includes(interest)
                                        ? 'bg-homi-purple text-white'
                                        : 'bg-homi-ultraLightPurple text-homi-purple hover:bg-homi-purple/20'
                                    }`}
                                    onClick={() => toggleInterest(interest)}
                                  >
                                    {interest}
                                  </button>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {selectedInterests.length > 0 && (
                          <div className="mt-4 pt-4 border-t">
                            <h3 className="text-sm font-medium mb-2">Intereses seleccionados:</h3>
                            <div className="flex flex-wrap gap-2">
                              {selectedInterests.map(interest => (
                                <div 
                                  key={interest} 
                                  className="bg-homi-purple text-white px-3 py-1 text-sm rounded-full flex items-center gap-1"
                                >
                                  {interest}
                                  <button 
                                    type="button" 
                                    className="ml-1 hover:bg-white/20 rounded-full h-4 w-4 flex items-center justify-center"
                                    onClick={() => toggleInterest(interest)}
                                  >
                                    ×
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <Separator className="my-8" />
                      
                      <div>
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                          <Users className="text-homi-purple" size={20} />
                          Estilo de vida y convivencia
                        </h2>
                        <p className="text-muted-foreground mb-6">
                          Háblanos sobre tu estilo de vida para encontrar compañeros compatibles.
                        </p>
                        
                        <div className="space-y-8">
                          <div>
                            <label className="text-base font-medium mb-3 block">¿Eres más de mañanas o de noches?</label>
                            <div className="flex flex-wrap gap-4">
                              <button
                                type="button"
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                                  lifestylePreferences.morningPerson
                                    ? 'bg-homi-purple text-white border-homi-purple'
                                    : 'bg-transparent border-input hover:bg-muted/50'
                                }`}
                                onClick={() => handleLifestyleChange('morningPerson', !lifestylePreferences.morningPerson)}
                              >
                                <Sun size={18} /> Madrugador/a
                              </button>
                              <button
                                type="button"
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                                  lifestylePreferences.nightPerson
                                    ? 'bg-homi-purple text-white border-homi-purple'
                                    : 'bg-transparent border-input hover:bg-muted/50'
                                }`}
                                onClick={() => handleLifestyleChange('nightPerson', !lifestylePreferences.nightPerson)}
                              >
                                <Moon size={18} /> Noctámbulo/a
                              </button>
                            </div>
                          </div>
                          
                          <div>
                            <label className="text-base font-medium mb-3 block">Socialización en casa</label>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              {["poco", "moderado", "mucho"].map((level) => (
                                <button
                                  key={level}
                                  type="button"
                                  className={`px-4 py-2 rounded-lg border ${
                                    lifestylePreferences.socializing === level
                                      ? 'bg-homi-purple text-white border-homi-purple'
                                      : 'bg-transparent border-input hover:bg-muted/50'
                                  }`}
                                  onClick={() => handleLifestyleChange('socializing', level)}
                                >
                                  {level === "poco" && "Prefiero tranquilidad"}
                                  {level === "moderado" && "Balance"}
                                  {level === "mucho" && "Me gusta socializar"}
                                </button>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <label className="text-base font-medium mb-3 block">Limpieza y orden</label>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              {["básico", "moderado", "muy ordenado"].map((level) => (
                                <button
                                  key={level}
                                  type="button"
                                  className={`px-4 py-2 rounded-lg border ${
                                    lifestylePreferences.cleanliness === level
                                      ? 'bg-homi-purple text-white border-homi-purple'
                                      : 'bg-transparent border-input hover:bg-muted/50'
                                  }`}
                                  onClick={() => handleLifestyleChange('cleanliness', level)}
                                >
                                  {level}
                                </button>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <label className="text-base font-medium mb-3 block">Tolerancia al ruido</label>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              {["bajo", "moderado", "alto"].map((level) => (
                                <button
                                  key={level}
                                  type="button"
                                  className={`px-4 py-2 rounded-lg border ${
                                    lifestylePreferences.noise === level
                                      ? 'bg-homi-purple text-white border-homi-purple'
                                      : 'bg-transparent border-input hover:bg-muted/50'
                                  }`}
                                  onClick={() => handleLifestyleChange('noise', level)}
                                >
                                  {level === "bajo" && "Prefiero silencio"}
                                  {level === "moderado" && "Nivel medio"}
                                  {level === "alto" && "No me molesta"}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between mt-8">
                        <Button 
                          type="button" 
                          variant="outline" 
                          className="rounded-full"
                          onClick={() => setActiveTab("cuenta")}
                        >
                          Atrás
                        </Button>
                        <Button 
                          type="submit" 
                          className="rounded-full bg-homi-purple hover:bg-homi-purple/90"
                        >
                          Completar registro
                        </Button>
                      </div>
                    </TabsContent>
                  </form>
                </Form>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default RegisterPage;
