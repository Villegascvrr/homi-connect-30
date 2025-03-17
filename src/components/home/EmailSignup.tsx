
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { 
  CheckCircle2, 
  ArrowRight, 
  User, 
  Mail, 
  MapPin, 
  ChevronDown, 
  ChevronUp, 
  Heart, 
  Users, 
  Moon, 
  Sun, 
  Pencil, 
  AtSign,
  BookOpen 
} from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Schema for form validation - profile-focused version
const formSchema = z.object({
  // Account section
  nombre: z.string().min(2, { message: 'El nombre debe tener al menos 2 caracteres' }),
  username: z.string()
    .min(3, { message: 'El nombre de usuario debe tener al menos 3 caracteres' })
    .max(20, { message: 'El nombre de usuario no puede tener más de 20 caracteres' })
    .regex(/^[a-z0-9_]+$/, { message: 'El nombre de usuario solo puede contener letras minúsculas, números y guiones bajos' }),
  email: z.string().email({ message: 'Email inválido' }),
  
  // Profile section
  edad: z.string().refine((val) => {
    const num = parseInt(val);
    return !val || (num >= 18 && num <= 99);
  }, {
    message: "La edad debe ser un número entre 18 y 99.",
  }),
  ubicacion: z.string().min(2, {
    message: "La ubicación es requerida.",
  }).optional(),
  ocupacion: z.string().optional(),
  universidad: z.string().optional(),
  bio: z.string().min(10, {
    message: "La bio debe tener al menos 10 caracteres.",
  }).max(500, {
    message: "La bio no puede tener más de 500 caracteres.",
  }).optional(),
});

type Interest = {
  id: string;
  name: string;
};

const EmailSignup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("datos");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const navigate = useNavigate();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: '',
      username: '',
      email: '',
      edad: '',
      ubicacion: '',
      ocupacion: '',
      universidad: '',
      bio: '',
    },
  });

  const [lifestylePreferences, setLifestylePreferences] = useState({
    morningPerson: false,
    nightPerson: false,
    socializing: "moderado",
    cleanliness: "moderado",
    noise: "moderado",
  });

  // Updated list of general interests instead of subcategories
  const interests: Interest[] = [
    { id: "deporte", name: "Deporte y actividades físicas" },
    { id: "arte", name: "Arte y cultura" },
    { id: "musica", name: "Música" },
    { id: "cine", name: "Cine y series" },
    { id: "lectura", name: "Lectura" },
    { id: "viajes", name: "Viajes" },
    { id: "gastronomia", name: "Gastronomía y comida" },
    { id: "tecnologia", name: "Tecnología" },
    { id: "naturaleza", name: "Naturaleza y aire libre" },
    { id: "fotografia", name: "Fotografía" },
    { id: "moda", name: "Moda y diseño" },
    { id: "gaming", name: "Videojuegos" },
    { id: "voluntariado", name: "Voluntariado" },
    { id: "aprendizaje", name: "Aprendizaje y educación" },
    { id: "mascotas", name: "Mascotas y animales" },
    { id: "fiestas", name: "Fiestas y vida nocturna" },
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

  // Validar primera pestaña para habilitar la segunda
  const isPersonalDataValid = 
    form.getValues('nombre')?.length > 0 && 
    form.getValues('username')?.length > 0 &&
    form.getValues('email')?.length > 0 &&
    !form.formState.errors.nombre &&
    !form.formState.errors.username &&
    !form.formState.errors.email;

  // Esta función maneja el envío final del formulario
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!isPersonalDataValid && activeTab === "datos") {
      return;
    }
    
    setIsLoading(true);
    
    // Combinar datos del formulario con intereses y estilo de vida
    const userData = {
      ...values,
      interests: selectedInterests,
      lifestyle: lifestylePreferences
    };
    
    console.log('Datos completos del usuario:', userData);
    
    // Simulación de envío a API
    setTimeout(() => {
      setIsSubmitted(true);
      toast({
        title: "¡Registro exitoso!",
        description: "Tu perfil se ha creado correctamente.",
      });
      setIsLoading(false);
      
      // Opcionalmente, redirigir al usuario al perfil después del registro
      // navigate("/profile");
    }, 1000);
  };

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-gradient-to-br from-homi-ultraLightPurple to-white dark:from-homi-purple/20 dark:to-background rounded-xl border border-homi-purple/20 shadow-md animate-fade-in">
        <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
        <h3 className="text-2xl font-bold mb-3">¡Gracias por registrarte!</h3>
        <p className="text-center text-lg mb-4">
          Hemos creado tu perfil personalizado en Homi.
        </p>
        <div className="text-sm text-muted-foreground">
          <p>Hemos enviado un correo de confirmación a <span className="font-semibold">{form.getValues('email')}</span></p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="mb-6 text-center">
        <h3 className="text-xl font-semibold mb-2">Crea tu perfil personalizado en Homi</h3>
        <p className="text-muted-foreground">
          Cuéntanos sobre ti para que podamos encontrar compañeros compatibles con tu estilo de vida.
        </p>
      </div>

      <div className="bg-white dark:bg-card border border-border shadow-sm rounded-xl p-6 md:p-8 animate-fade-in">
        <Tabs 
          defaultValue="datos" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-2 mb-8">
            <TabsTrigger value="datos">Datos personales</TabsTrigger>
            <TabsTrigger 
              value="perfil" 
              disabled={!isPersonalDataValid}
              className={!isPersonalDataValid ? "cursor-not-allowed" : ""}
            >
              Perfil personal
            </TabsTrigger>
          </TabsList>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <TabsContent value="datos" className="space-y-4">
                <FormField
                  control={form.control}
                  name="nombre"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre completo *</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            id="nombre"
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
                      <FormLabel>Nombre de usuario *</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            id="username"
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
                      <FormLabel>Email *</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            id="email"
                            type="email"
                            placeholder="tu@email.com"
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
                
                <div className="flex justify-end mt-6">
                  <Button 
                    type="button" 
                    onClick={() => {
                      if (isPersonalDataValid) {
                        setActiveTab("perfil");
                      } else {
                        form.trigger(["nombre", "username", "email"]);
                      }
                    }}
                    className="rounded-full bg-homi-purple hover:bg-homi-purple/90 ml-auto"
                  >
                    Siguiente 
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="perfil" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="edad"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Edad</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              id="edad"
                              type="number"
                              min="18"
                              max="99"
                              placeholder="Tu edad"
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
                    name="ubicacion"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ciudad</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              id="ubicacion"
                              placeholder="¿Dónde vives?"
                              className="pl-10"
                              {...field}
                            />
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="ocupacion"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ocupación</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              id="ocupacion"
                              placeholder="¿A qué te dedicas?"
                              className="pl-10"
                              {...field}
                            />
                            <Pencil className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="universidad"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Universidad (si aplica)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              id="universidad"
                              placeholder="¿Dónde estudias?"
                              className="pl-10"
                              {...field}
                            />
                            <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                          </div>
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
                          id="bio"
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
                
                <div>
                  <h3 className="text-base font-medium mb-3">Intereses y aficiones</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Selecciona intereses que te definan para encontrar personas afines.
                  </p>
                  
                  <div className="flex flex-wrap gap-3 mb-6">
                    {interests.map((interest) => (
                      <button
                        key={interest.id}
                        type="button"
                        className={`px-4 py-2 text-sm rounded-full transition-colors ${
                          selectedInterests.includes(interest.id)
                            ? 'bg-homi-purple text-white'
                            : 'bg-homi-ultraLightPurple text-homi-purple hover:bg-homi-purple/20'
                        }`}
                        onClick={() => toggleInterest(interest.id)}
                      >
                        {interest.name}
                      </button>
                    ))}
                  </div>
                  
                  {selectedInterests.length > 0 && (
                    <div className="mt-4 pt-4 border-t">
                      <h3 className="text-sm font-medium mb-2">Intereses seleccionados ({selectedInterests.length}):</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedInterests.map(interestId => {
                          const interest = interests.find(i => i.id === interestId);
                          return (
                            <Badge 
                              key={interestId} 
                              className="bg-homi-purple text-white flex items-center gap-1"
                            >
                              {interest?.name}
                              <button 
                                type="button" 
                                className="ml-1 hover:bg-white/20 rounded-full h-4 w-4 flex items-center justify-center"
                                onClick={() => toggleInterest(interestId)}
                              >
                                ×
                              </button>
                            </Badge>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
                
                <div>
                  <h3 className="text-base font-medium mb-3">Estilo de vida</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Cuéntanos sobre tus hábitos para encontrar compañeros compatibles.
                  </p>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="text-sm font-medium mb-2 block">¿Eres más de mañanas o de noches?</label>
                      <div className="flex gap-4">
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
                      <label className="text-sm font-medium mb-2 block">Socialización en casa</label>
                      <div className="grid grid-cols-3 gap-3">
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
                      <label className="text-sm font-medium mb-2 block">Limpieza y orden</label>
                      <div className="grid grid-cols-3 gap-3">
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
                      <label className="text-sm font-medium mb-2 block">Tolerancia al ruido</label>
                      <div className="grid grid-cols-3 gap-3">
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
                
                <div className="flex justify-between">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setActiveTab("datos")}
                    className="rounded-full"
                  >
                    Atrás
                  </Button>
                  
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="rounded-full bg-homi-purple hover:bg-homi-purple/90"
                  >
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
    </div>
  );
};

export default EmailSignup;
