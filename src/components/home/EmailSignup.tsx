import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle2, ArrowRight, User, Mail, MapPin, ChevronDown, ChevronUp, Heart, Users, Moon, Sun, Pencil, AtSign, BookOpen, Camera } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { FormImageUpload } from "@/components/ui/form-image-upload";
import { useAuth, UserSignUpData } from '@/context/AuthContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  }),
  edad: z.string().refine(val => {
    const num = parseInt(val);
    return !val || num >= 18 && num <= 99;
  }, {
    message: "La edad debe ser un número entre 18 y 99."
  }),
  ubicacion: z.string().min(2, {
    message: "La ubicación es requerida."
  }).optional(),
  ocupacion: z.string().optional(),
  universidad: z.string().optional(),
  bio: z.string().min(10, {
    message: "La bio debe tener al menos 10 caracteres."
  }).max(500, {
    message: "La bio no puede tener más de 500 caracteres."
  }).optional(),
  profileImage: z.string().optional(),
  galleryImages: z.array(z.string()).optional(),
  isProfileActive: z.boolean().default(true),
  sevilla_zona: z.string().optional(),
  companeros_count: z.string().optional()
});

const sevillaZones = [
  "Casco Antiguo",
  "Triana",
  "Los Remedios",
  "Nervión",
  "San Pablo - Santa Justa",
  "Este - Alcosa - Torreblanca",
  "Cerro - Amate",
  "Sur",
  "Bellavista - La Palmera",
  "Macarena",
  "Norte",
  "Otro/Alrededores"
];

const companeroOptions = ["1", "2", "3", "4", "5+"];

type Interest = {
  id: string;
  name: string;
};

const EmailSignup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSigningWithGoogle, setIsSigningWithGoogle] = useState(false);
  const [activeTab, setActiveTab] = useState("datos");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [isLookingForApartment, setIsLookingForApartment] = useState(false);
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
      edad: '',
      ubicacion: '',
      ocupacion: '',
      universidad: '',
      bio: '',
      profileImage: '',
      galleryImages: [],
      isProfileActive: true,
      sevilla_zona: '',
      companeros_count: '',
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
  }, [activeTab]);

  const [lifestylePreferences, setLifestylePreferences] = useState({
    morningPerson: false,
    nightPerson: false,
    socializing: "moderado",
    cleanliness: "moderado",
    noise: "moderado"
  });

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

  const interests: Interest[] = [{
    id: "deporte",
    name: "Deporte y actividades físicas"
  }, {
    id: "arte",
    name: "Arte y cultura"
  }, {
    id: "musica",
    name: "Música"
  }, {
    id: "cine",
    name: "Cine y series"
  }, {
    id: "lectura",
    name: "Lectura"
  }, {
    id: "viajes",
    name: "Viajes"
  }, {
    id: "gastronomia",
    name: "Gastronomía y comida"
  }, {
    id: "tecnologia",
    name: "Tecnología"
  }, {
    id: "naturaleza",
    name: "Naturaleza y aire libre"
  }, {
    id: "fotografia",
    name: "Fotografía"
  }, {
    id: "moda",
    name: "Moda y diseño"
  }, {
    id: "gaming",
    name: "Videojuegos"
  }, {
    id: "voluntariado",
    name: "Voluntariado"
  }, {
    id: "aprendizaje",
    name: "Aprendizaje y educación"
  }, {
    id: "mascotas",
    name: "Mascotas y animales"
  }, {
    id: "fiestas",
    name: "Fiestas y vida nocturna"
  }];

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev => prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]);
  };

  const handleLifestyleChange = (field: string, value: any) => {
    setLifestylePreferences(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const isPersonalDataValid = form.getValues('firstName')?.length > 0 && 
                             form.getValues('lastName')?.length > 0 && 
                             form.getValues('username')?.length > 0 && 
                             form.getValues('email')?.length > 0 && 
                             form.getValues('password')?.length > 5 &&
                             !form.formState.errors.firstName && 
                             !form.formState.errors.lastName && 
                             !form.formState.errors.username && 
                             !form.formState.errors.email &&
                             !form.formState.errors.password;

  const handleNextStep = async () => {
    const fieldsToValidate = ["firstName", "lastName", "username", "email", "password"] as const;
    const result = await form.trigger(fieldsToValidate);
    if (result && isPersonalDataValid) {
      setActiveTab("perfil");
      if (formContainerRef.current) {
        setTimeout(() => {
          if (formContainerRef.current) {
            window.scrollTo({
              top: formContainerRef.current.offsetTop - 100,
              behavior: 'smooth'
            });
          }
        }, 50);
      }
    } else {
      toast({
        title: "Por favor completa todos los campos",
        description: "Debes completar correctamente todos los campos requeridos",
        variant: "destructive"
      });
    }
  };

  const handleApartmentSearchToggle = (val: string) => {
    setIsLookingForApartment(!!val);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log("Form submission started", {
      values,
      isPersonalDataValid,
      activeTab
    });
    if (activeTab === "datos") {
      console.log("Advancing to profile tab");
      handleNextStep();
      return; // Don't proceed with submission yet
    }
    if (activeTab === "perfil") {
      console.log("Submitting full form");
      setIsLoading(true);
      
      try {
        const lifestyleObject = {
          morningPerson: lifestylePreferences.morningPerson,
          nightPerson: lifestylePreferences.nightPerson,
          socializing: lifestylePreferences.socializing,
          cleanliness: lifestylePreferences.cleanliness,
          noise: lifestylePreferences.noise,
          hasApartment: values.sevilla_zona && values.sevilla_zona !== 'no_busco',
          genderPreference: "",
          smokingPreference: "",
          occupationPreference: "",
          minAge: "",
          maxAge: "",
          exactPrice: 0
        };
        
        const userData: UserSignUpData = {
          email: values.email,
          password: values.password!,
          firstName: values.firstName,
          lastName: values.lastName,
          username: values.username,
          edad: values.edad,
          ubicacion: values.ubicacion,
          ocupacion: values.ocupacion,
          universidad: values.universidad,
          bio: values.bio,
          profileImage: values.profileImage,
          galleryImages: values.galleryImages,
          interests: selectedInterests,
          lifestyle: lifestyleObject,
          sevilla_zona: values.sevilla_zona,
          companeros_count: values.companeros_count
        };
        
        console.log("Sending user data to signUp function:", userData);
        await signUp(userData);
        
        setIsSubmitted(true);
        setTimeout(() => {
          navigate("/profile");
        }, 500);
      } catch (error: any) {
        console.error("Error submitting form:", error);
        toast({
          title: "Error",
          description: "Ha ocurrido un error al crear tu perfil. Inténtalo de nuevo.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (isSubmitted) {
    return <div className="flex flex-col items-center justify-center p-8 bg-gradient-to-br from-homi-ultraLightPurple to-white dark:from-homi-purple/20 dark:to-background rounded-xl border border-homi-purple/20 shadow-md animate-fade-in">
        <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
        <h3 className="text-2xl font-bold mb-3">¡Gracias por registrarte!</h3>
        <p className="text-center text-lg mb-4">
          Hemos creado tu perfil personalizado en Homi.
        </p>
        <div className="text-sm text-muted-foreground">
          <p>Hemos enviado un correo de confirmación a <span className="font-semibold">{form.getValues('email')}</span></p>
        </div>
      </div>;
  }

  return <div className="w-full max-w-3xl mx-auto" ref={formContainerRef}>
      <div className="mb-6 text-center">
        <h3 className="text-xl font-semibold mb-2">Crea tu perfil personalizado en Homi</h3>
        <p className="text-muted-foreground">
          Cuéntanos sobre ti para que podamos encontrar compañeros compatibles con tu estilo de vida.
        </p>
      </div>

      <div className="bg-white dark:bg-card border border-border shadow-sm rounded-xl p-6 md:p-8 animate-fade-in">
        <Tabs defaultValue="datos" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-8">
            <TabsTrigger value="datos">Datos personales</TabsTrigger>
            <TabsTrigger value="perfil" disabled={!isPersonalDataValid} className={!isPersonalDataValid ? "cursor-not-allowed" : ""}>
              Perfil personal
            </TabsTrigger>
          </TabsList>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <TabsContent value="datos" className="space-y-4">
                <div className="mb-6">
                  <Button type="button" variant="outline" onClick={handleGoogleSignIn} disabled={isSigningWithGoogle} className="w-full flex items-center justify-center gap-2 py-5 border-2 relative">
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
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="firstName" render={({
                  field
                }) => <FormItem>
                        <FormLabel>Nombre *</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input id="firstName" placeholder="Tu nombre" className="pl-10" {...field} />
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
                            <Input id="lastName" placeholder="Tus apellidos" className="pl-10" {...field} />
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
                          <Input id="username" placeholder="tu_usuario" className="pl-10" {...field} />
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
                          <Input id="email" type="email" placeholder="tu@email.com" className="pl-10" {...field} />
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
                          <Input id="password" type="password" placeholder="••••••••" className="pl-10" {...field} />
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>} />
                
                <div className="flex justify-end mt-6">
                  <Button type="button" onClick={handleNextStep} className="rounded-full bg-homi-purple hover:bg-homi-purple/90 ml-auto">
                    Siguiente 
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="perfil" className="space-y-6">
                <div className="space-y-6">
                  <h3 className="text-base font-medium mb-3">Foto de perfil (opcional)</h3>
                  <FormImageUpload name="profileImage" description="Sube una foto clara de tu rostro para que otros usuarios puedan identificarte" required={false} />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="edad" render={({
                  field
                }) => <FormItem>
                        <FormLabel>Edad</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input id="edad" type="number" min="18" max="99" placeholder="Tu edad" className="pl-10" {...field} />
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>} />
                  
                  <FormField control={form.control} name="ubicacion" render={({
                  field
                }) => <FormItem>
                        <FormLabel>Ciudad</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input id="ubicacion" placeholder="¿Dónde vives?" className="pl-10" {...field} />
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>} />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="ocupacion" render={({
                  field
                }) => <FormItem>
                        <FormLabel>Ocupación</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input id="ocupacion" placeholder="¿A qué te dedicas?" className="pl-10" {...field} />
                            <Pencil className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>} />
                  
                  <FormField control={form.control} name="universidad" render={({
                  field
                }) => <FormItem>
                        <FormLabel>Universidad (si aplica)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input id="universidad" placeholder="¿Dónde estudias?" className="pl-10" {...field} />
                            <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>} />
                </div>
                
                <FormField control={form.control} name="bio" render={({
                field
              }) => <FormItem>
                      <FormLabel>Sobre mí</FormLabel>
                      <FormControl>
                        <Textarea id="bio" placeholder="Cuéntanos un poco sobre ti, tus rutinas y lo que te gusta hacer..." className="min-h-[100px]" {...field} />
                      </FormControl>
                      <FormDescription>
                        Comparte algo que te defina y ayude a otros a conocerte mejor.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>} />
                
                <div>
                  <h3 className="text-base font-medium mb-3">Intereses y aficiones</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Selecciona intereses que te definan para encontrar compañeros compatibles.
                  </p>
                  
                  <div className="flex flex-wrap gap-3 mb-6">
                    {interests.map(interest => <button key={interest.id} type="button" className={`px-4 py-2 text-sm rounded-full transition-colors ${selectedInterests.includes(interest.id) ? 'bg-homi-purple text-white' : 'bg-homi-ultraLightPurple text-homi-purple hover:bg-homi-purple/20'}`} onClick={() => toggleInterest(interest.id)}>
                        {interest.name}
                      </button>)}
                  </div>
                  
                  {selectedInterests.length > 0 && <div className="mt-4 pt-4 border-t">
                      <h3 className="text-sm font-medium mb-2">Intereses seleccionados ({selectedInterests.length}):</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedInterests.map(interestId => {
                      const interest = interests.find(i => i.id === interestId);
                      return <Badge key={interestId} className="bg-homi-purple text-white flex items-center gap-1">
                              {interest?.name}
                              <button type="button" className="ml-1 hover:bg-white/20 rounded-full h-4 w-4 flex items-center justify-center" onClick={() => toggleInterest(interestId)}>
                                ×
                              </button>
                            </Badge>;
                    })}
                      </div>
                    </div>}
                </div>
                
                <div>
                  <h3 className="text-base font-medium mb-3">Estilo de vida</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Cuéntanos sobre tus hábitos para encontrar compañeros compatibles.
                  </p>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="text-sm font-medium mb-2 block">¿Eres más de mañanas o de noches?</label>
                      <div className="lifestyle-option-row">
                        <button 
                          type="button" 
                          className={`lifestyle-option-button ${lifestylePreferences.morningPerson ? 'bg-homi-purple text-white border-homi-purple' : 'bg-transparent border-input hover:bg-muted/50'}`} 
                          onClick={() => handleLifestyleChange('morningPerson', !lifestylePreferences.morningPerson)}
                        >
                          <Sun size={18} />
                          <span>Madrugador/a</span>
                        </button>
                        <button 
                          type="button" 
                          className={`lifestyle-option-button ${lifestylePreferences.nightPerson ? 'bg-homi-purple text-white border-homi-purple' : 'bg-transparent border-input hover:bg-muted/50'}`} 
                          onClick={() => handleLifestyleChange('nightPerson', !lifestylePreferences.nightPerson)}
                        >
                          <Moon size={18} />
                          <span>Noctámbulo/a</span>
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">Socialización en casa</label>
                      <div className="lifestyle-option-row">
                        {["poco", "moderado", "mucho"].map(level => (
                          <button 
                            key={level} 
                            type="button" 
                            className={`lifestyle-option-button ${lifestylePreferences.socializing === level ? 'bg-homi-purple text-white border-homi-purple' : 'bg-transparent border-input hover:bg-muted/50'}`} 
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
                      <label className="text-sm font-medium mb-2 block">Limpieza y orden</label>
                      <div className="lifestyle-option-row">
                        {["básico", "moderado", "muy ordenado"].map(level => (
                          <button 
                            key={level} 
                            type="button" 
                            className={`lifestyle-option-button ${lifestylePreferences.cleanliness === level ? 'bg-homi-purple text-white border-homi-purple' : 'bg-transparent border-input hover:bg-muted/50'}`} 
                            onClick={() => handleLifestyleChange('cleanliness', level)}
                          >
                            {level}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">Tolerancia al ruido</label>
                      <div className="lifestyle-option-row">
                        {["bajo", "moderado", "alto"].map(level => (
                          <button 
                            key={level} 
                            type="button" 
                            className={`lifestyle-option-button ${lifestylePreferences.noise === level ? 'bg-homi-purple text-white border-homi-purple' : 'bg-transparent border-input hover:bg-muted/50'}`} 
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
                
                <div className="space-y-4 bg-muted/20 p-4 rounded-xl border border-border">
                  <h3 className="text-base font-medium mb-3 flex items-center gap-2">
                    <MapPin className="text-homi-purple" size={20} />
                    Búsqueda de piso en Sevilla
                  </h3>
                  
                  <FormField
                    control={form.control}
                    name="sevilla_zona"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>¿En qué zona de Sevilla estás buscando piso?</FormLabel>
                        <Select 
                          onValueChange={(value) => {
                            field.onChange(value);
                            handleApartmentSearchToggle(value);
                          }}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona una zona" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="no_busco">No estoy buscando piso en Sevilla</SelectItem>
                            {sevillaZones.map((zone) => (
                              <SelectItem key={zone} value={zone}>{zone}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {isLookingForApartment && (
                    <FormField
                      control={form.control}
                      name="companeros_count"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Users className="text-homi-purple" size={18} />
                            ¿Cuántos compañeros de piso buscas?
                          </FormLabel>
                          <Select 
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona un número" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {companeroOptions.map((option) => (
                                <SelectItem key={option} value={option}>{option}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  
                  {!isLookingForApartment && (
                    <p className="text-sm text-muted-foreground">
                      Indica si estás buscando piso en Sevilla para poder mostrarte compañeros compatibles.
                    </p>
                  )}
                </div>
                
                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={() => setActiveTab("datos")} className="rounded-full">
                    Atrás
                  </Button>
                  
                  <Button type="submit" disabled={isLoading} className="rounded-full bg-homi-purple hover:bg-homi-purple/90">
                    {isLoading ? "Enviando..." : "Completar perfil"}
                  </Button>
                </div>
              </TabsContent>
            </form>
          </Form>
        </Tabs>
      </div>
      
      <div className="mt-4 text-center text-xs text-muted-foreground">
        Al crear tu perfil, aceptas nuestros términos y condiciones.
      </div>
    </div>;
};

export default EmailSignup;
