
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle2, ArrowRight, User, Mail, MapPin, ChevronDown, ChevronUp, Home, Wifi, Utensils } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Schema for form validation - simplified version of RegisterPage schema
const formSchema = z.object({
  // Account section
  nombre: z.string().min(2, { message: 'El nombre debe tener al menos 2 caracteres' }),
  email: z.string().email({ message: 'Email inválido' }),
  
  // Profile section
  edad: z.string().optional(),
  zona: z.string().min(2, {
    message: "La zona es requerida.",
  }),
  presupuesto: z.array(z.number()),
  comentarios: z.string().optional(),
});

type InteresCategoria = 'ambiente' | 'servicios' | 'habitacion' | 'ubicacion' | 'convivencia';

interface InteresOpcion {
  id: string;
  label: string;
  categoria: InteresCategoria;
}

const EmailSignup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("datos");
  const [openCategories, setOpenCategories] = useState<InteresCategoria[]>(['ambiente']);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const navigate = useNavigate();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: '',
      email: '',
      edad: '',
      zona: '',
      presupuesto: [400], // Valor predeterminado de 400€
      comentarios: '',
    },
  });

  const [lifestylePreferences, setLifestylePreferences] = useState({
    morningPerson: false,
    nightPerson: false,
    socializing: "moderado",
    cleanliness: "moderado",
    noise: "moderado",
  });

  const zonasSevilla = [
    'Triana', 'Los Remedios', 'Nervión', 'Centro', 'Macarena', 
    'Alameda', 'Santa Justa', 'Sur', 'Este', 'Aljarafe', 'Otro'
  ];

  // Lista ampliada de intereses organizados por categorías
  const categorias: Record<InteresCategoria, string> = {
    ambiente: 'Ambiente y estilo',
    servicios: 'Servicios incluidos',
    habitacion: 'Características de la habitación',
    ubicacion: 'Ubicación',
    convivencia: 'Convivencia'
  };

  const interesesOpciones: InteresOpcion[] = [
    // Ambiente y estilo
    { id: 'piso-centrico', label: 'Piso céntrico', categoria: 'ambiente' },
    { id: 'ambiente-tranquilo', label: 'Ambiente tranquilo', categoria: 'ambiente' },
    { id: 'ambiente-estudiantil', label: 'Ambiente estudiantil', categoria: 'ambiente' },
    { id: 'decoracion-moderna', label: 'Decoración moderna', categoria: 'ambiente' },
    { id: 'estilo-minimalista', label: 'Estilo minimalista', categoria: 'ambiente' },
    { id: 'zona-con-ocio', label: 'Zona con ocio', categoria: 'ambiente' },
    
    // Servicios incluidos
    { id: 'wifi-incluido', label: 'WiFi incluido', categoria: 'servicios' },
    { id: 'agua-incluida', label: 'Agua incluida', categoria: 'servicios' },
    { id: 'luz-incluida', label: 'Luz incluida', categoria: 'servicios' },
    { id: 'limpieza-incluida', label: 'Servicio de limpieza', categoria: 'servicios' },
    { id: 'lavadora', label: 'Lavadora', categoria: 'servicios' },
    { id: 'secadora', label: 'Secadora', categoria: 'servicios' },
    { id: 'cocina-equipada', label: 'Cocina totalmente equipada', categoria: 'servicios' },
    { id: 'aire-acondicionado', label: 'Aire acondicionado', categoria: 'servicios' },
    { id: 'calefaccion', label: 'Calefacción', categoria: 'servicios' },
    
    // Características de la habitación
    { id: 'bano-privado', label: 'Baño privado', categoria: 'habitacion' },
    { id: 'escritorio-trabajo', label: 'Escritorio de trabajo', categoria: 'habitacion' },
    { id: 'armario-amplio', label: 'Armario amplio', categoria: 'habitacion' },
    { id: 'cama-grande', label: 'Cama grande (>90cm)', categoria: 'habitacion' },
    { id: 'ventana-exterior', label: 'Ventana exterior', categoria: 'habitacion' },
    { id: 'terraza', label: 'Terraza o balcón', categoria: 'habitacion' },
    
    // Ubicación
    { id: 'cerca-universidad', label: 'Cerca de universidad', categoria: 'ubicacion' },
    { id: 'cerca-metro', label: 'Cerca de metro/tranvía', categoria: 'ubicacion' },
    { id: 'cerca-supermercado', label: 'Cerca de supermercado', categoria: 'ubicacion' },
    { id: 'zona-verde', label: 'Cerca de parques', categoria: 'ubicacion' },
    { id: 'buen-transporte', label: 'Buen transporte público', categoria: 'ubicacion' },
    
    // Convivencia
    { id: 'companeros-estudiantes', label: 'Compañeros estudiantes', categoria: 'convivencia' },
    { id: 'companeros-trabajadores', label: 'Compañeros trabajadores', categoria: 'convivencia' },
    { id: 'con-mascotas', label: 'Con mascotas', categoria: 'convivencia' },
    { id: 'sin-mascotas', label: 'Sin mascotas', categoria: 'convivencia' },
    { id: 'fumadores', label: 'Fumadores', categoria: 'convivencia' },
    { id: 'no-fumadores', label: 'No fumadores', categoria: 'convivencia' },
    { id: 'lgbtq-friendly', label: 'LGBTQ+ friendly', categoria: 'convivencia' },
    { id: 'internacional', label: 'Ambiente internacional', categoria: 'convivencia' }
  ];

  const toggleInteres = (interesId: string) => {
    setSelectedInterests(prev => 
      prev.includes(interesId)
        ? prev.filter(i => i !== interesId)
        : [...prev, interesId]
    );
  };

  const toggleCategory = (categoria: InteresCategoria) => {
    setOpenCategories(prev => 
      prev.includes(categoria) 
        ? prev.filter(cat => cat !== categoria)
        : [...prev, categoria]
    );
  };

  const handleLifestyleChange = (field: string, value: any) => {
    setLifestylePreferences(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSliderChange = (value: number[]) => {
    form.setValue("presupuesto", value);
  };

  // Validar primera pestaña para habilitar la segunda
  const isPersonalDataValid = form.formState.isValid && 
    form.getValues('nombre') && 
    form.getValues('email');

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
        description: "Te notificaremos cuando Homi esté disponible.",
      });
      setIsLoading(false);
      
      // Opcionalmente, redirigir al usuario al perfil después del registro
      // navigate("/profile");
    }, 1000);
  };

  // Obtener el nombre de un interés por su ID
  const getInteresLabel = (interesId: string): string => {
    const interes = interesesOpciones.find(opt => opt.id === interesId);
    return interes ? interes.label : interesId;
  };

  // Renderizar la sección de intereses en el paso de confirmación
  const renderInteresesSeleccionados = () => {
    if (selectedInterests.length === 0) {
      return <span className="text-muted-foreground italic">Ninguno seleccionado</span>;
    }

    return (
      <div className="flex flex-wrap gap-1">
        {selectedInterests.map(interesId => (
          <Badge key={interesId} variant="outline" className="bg-homi-ultraLightPurple text-homi-purple">
            {getInteresLabel(interesId)}
          </Badge>
        ))}
      </div>
    );
  };

  // Renderizar el icono según la categoría
  const getCategoryIcon = (categoria: InteresCategoria) => {
    switch (categoria) {
      case 'ambiente': return <Home className="h-4 w-4 mr-2" />;
      case 'servicios': return <Wifi className="h-4 w-4 mr-2" />;
      case 'habitacion': return <Home className="h-4 w-4 mr-2" />;
      case 'ubicacion': return <MapPin className="h-4 w-4 mr-2" />;
      case 'convivencia': return <Utensils className="h-4 w-4 mr-2" />;
      default: return <Home className="h-4 w-4 mr-2" />;
    }
  };

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-gradient-to-br from-homi-ultraLightPurple to-white dark:from-homi-purple/20 dark:to-background rounded-xl border border-homi-purple/20 shadow-md animate-fade-in">
        <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
        <h3 className="text-2xl font-bold mb-3">¡Gracias por registrarte!</h3>
        <p className="text-center text-lg mb-4">
          Te notificaremos cuando Homi esté disponible en {form.getValues('zona')}.
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
        <h3 className="text-xl font-semibold mb-2">¿Quieres ser de los primeros en usar Homi?</h3>
        <p className="text-muted-foreground">
          Regístrate ahora y obtén acceso preferente cuando lancemos en tu zona.
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
              value="preferencias" 
              disabled={!isPersonalDataValid}
              className={!isPersonalDataValid ? "cursor-not-allowed" : ""}
            >
              Preferencias
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
                    onClick={() => isPersonalDataValid && setActiveTab("preferencias")}
                    className="rounded-full bg-homi-purple hover:bg-homi-purple/90 ml-auto"
                    disabled={!isPersonalDataValid}
                  >
                    Siguiente 
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="preferencias" className="space-y-6">
                <FormField
                  control={form.control}
                  name="zona"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Zona de Sevilla donde buscas vivienda *</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <select
                            id="zona"
                            className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                            {...field}
                          >
                            <option value="">Selecciona una zona</option>
                            {zonasSevilla.map(zona => (
                              <option key={zona} value={zona}>{zona}</option>
                            ))}
                          </select>
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
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
                
                <div>
                  <Label className="block text-sm font-medium mb-3">Presupuesto mensual: {form.getValues('presupuesto')[0]}€</Label>
                  <Slider
                    defaultValue={[400]}
                    max={1200}
                    min={200}
                    step={50}
                    value={form.getValues('presupuesto')}
                    onValueChange={handleSliderChange}
                    className="my-5"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>200€</span>
                    <span>700€</span>
                    <span>1200€</span>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium mb-3">¿Qué buscas en tu próximo hogar?</p>
                  
                  {Object.entries(categorias).map(([categoriaKey, categoriaLabel]) => {
                    const categoria = categoriaKey as InteresCategoria;
                    const isOpen = openCategories.includes(categoria);
                    const interesesCategoria = interesesOpciones.filter(i => i.categoria === categoria);
                    
                    return (
                      <Collapsible 
                        key={categoria} 
                        open={isOpen} 
                        onOpenChange={() => toggleCategory(categoria)}
                        className="mb-3 border border-border rounded-lg"
                      >
                        <CollapsibleTrigger className="flex items-center justify-between w-full p-3 hover:bg-muted/50 transition-colors rounded-lg">
                          <div className="flex items-center">
                            {getCategoryIcon(categoria)}
                            <span className="font-medium">{categoriaLabel}</span>
                          </div>
                          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </CollapsibleTrigger>
                        <CollapsibleContent className="p-3 pt-0">
                          <div className="flex flex-wrap gap-2 mt-2">
                            {interesesCategoria.map(interes => (
                              <button
                                key={interes.id}
                                type="button"
                                onClick={() => toggleInteres(interes.id)}
                                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                                  selectedInterests.includes(interes.id)
                                    ? 'bg-homi-purple text-white'
                                    : 'bg-homi-ultraLightPurple text-homi-purple hover:bg-homi-purple/20'
                                }`}
                              >
                                {interes.label}
                              </button>
                            ))}
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    );
                  })}
                </div>
                
                <FormField
                  control={form.control}
                  name="comentarios"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>¿Algo más que debamos saber?</FormLabel>
                      <FormControl>
                        <textarea
                          id="comentarios"
                          placeholder="Coméntanos cualquier detalle adicional sobre lo que buscas..."
                          className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
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
                    {isLoading ? "Enviando..." : "Completar registro"}
                  </Button>
                </div>
              </TabsContent>
            </form>
          </Form>
        </Tabs>
      </div>
      
      <div className="mt-4 text-center text-xs text-muted-foreground">
        Al registrarte, aceptas recibir notificaciones cuando Homi esté disponible en tu ciudad.
      </div>
    </div>
  );
};

export default EmailSignup;
