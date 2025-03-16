
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle2, ArrowRight, User, Mail, MapPin, Home, Briefcase } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

type Step = 'datos' | 'intereses' | 'confirmacion';

const EmailSignup = () => {
  const [step, setStep] = useState<Step>('datos');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  
  // Formulario
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    zona: '',
    edad: '',
    presupuesto: [400], // Valor predeterminado de 400€
    comentarios: '',
    intereses: [] as string[]
  });

  const zonasSevilla = [
    'Triana', 'Los Remedios', 'Nervión', 'Centro', 'Macarena', 
    'Alameda', 'Santa Justa', 'Sur', 'Este', 'Aljarafe', 'Otro'
  ];

  const interesesOpciones = [
    'Piso céntrico', 'Ambiente tranquilo', 'Compañeros estudiantes',
    'Zona con ocio', 'Con mascotas', 'Sin mascotas', 'Fumadores',
    'No fumadores', 'Espacio de trabajo'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSliderChange = (value: number[]) => {
    setFormData(prev => ({ ...prev, presupuesto: value }));
  };

  const toggleInteres = (interes: string) => {
    setFormData(prev => {
      const interesesActualizados = prev.intereses.includes(interes)
        ? prev.intereses.filter(i => i !== interes)
        : [...prev.intereses, interes];
      
      return { ...prev, intereses: interesesActualizados };
    });
  };

  const validateCurrentStep = () => {
    if (step === 'datos') {
      if (!formData.nombre || !formData.email || !formData.email.includes('@')) {
        toast({
          title: "Datos incompletos",
          description: "Por favor, completa todos los campos correctamente.",
          variant: "destructive",
        });
        return false;
      }
    } else if (step === 'intereses') {
      if (!formData.zona) {
        toast({
          title: "Datos incompletos",
          description: "Por favor, indica al menos tu zona de interés.",
          variant: "destructive",
        });
        return false;
      }
    }
    return true;
  };

  const nextStep = () => {
    if (!validateCurrentStep()) return;
    
    if (step === 'datos') setStep('intereses');
    else if (step === 'intereses') setStep('confirmacion');
  };

  const prevStep = () => {
    if (step === 'intereses') setStep('datos');
    else if (step === 'confirmacion') setStep('intereses');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateCurrentStep()) return;

    // Make sure we only submit when we're on the confirmation step
    if (step !== 'confirmacion') {
      nextStep();
      return;
    }

    setIsLoading(true);
    
    // En una aplicación real, esto llamaría a un endpoint de API para almacenar los datos
    try {
      // Simulating API call
      setTimeout(() => {
        setIsSubmitted(true);
        toast({
          title: "¡Registro exitoso!",
          description: "Te notificaremos cuando Homi esté disponible.",
        });
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Ha ocurrido un error. Por favor, inténtalo de nuevo más tarde.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center space-x-2 mb-8">
      <div className={`w-3 h-3 rounded-full ${step === 'datos' ? 'bg-homi-purple' : (step === 'intereses' || step === 'confirmacion') ? 'bg-homi-lightPurple' : 'bg-gray-300'}`}></div>
      <div className={`w-10 h-1 ${(step === 'intereses' || step === 'confirmacion') ? 'bg-homi-lightPurple' : 'bg-gray-300'}`}></div>
      <div className={`w-3 h-3 rounded-full ${step === 'intereses' ? 'bg-homi-purple' : step === 'confirmacion' ? 'bg-homi-lightPurple' : 'bg-gray-300'}`}></div>
      <div className={`w-10 h-1 ${step === 'confirmacion' ? 'bg-homi-lightPurple' : 'bg-gray-300'}`}></div>
      <div className={`w-3 h-3 rounded-full ${step === 'confirmacion' ? 'bg-homi-purple' : 'bg-gray-300'}`}></div>
    </div>
  );

  const renderStepTitle = () => {
    if (step === 'datos') return "Tus datos";
    if (step === 'intereses') return "Preferencias";
    return "Confirma tus datos";
  };

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-gradient-to-br from-homi-ultraLightPurple to-white dark:from-homi-purple/20 dark:to-background rounded-xl border border-homi-purple/20 shadow-md animate-fade-in">
        <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
        <h3 className="text-2xl font-bold mb-3">¡Gracias por registrarte!</h3>
        <p className="text-center text-lg mb-4">
          Te notificaremos cuando Homi esté disponible en {formData.zona}.
        </p>
        <div className="text-sm text-muted-foreground">
          <p>Hemos enviado un correo de confirmación a <span className="font-semibold">{formData.email}</span></p>
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
        {renderStepIndicator()}
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-card border border-border shadow-sm rounded-xl p-6 md:p-8 animate-fade-in">
        <h4 className="text-lg font-medium mb-6 flex items-center">
          {step === 'datos' && <User className="mr-2 h-5 w-5 text-homi-purple" />}
          {step === 'intereses' && <MapPin className="mr-2 h-5 w-5 text-homi-purple" />}
          {step === 'confirmacion' && <CheckCircle2 className="mr-2 h-5 w-5 text-homi-purple" />}
          {renderStepTitle()}
        </h4>
        
        {step === 'datos' && (
          <div className="space-y-4">
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium mb-1">Nombre completo *</label>
              <div className="relative">
                <Input
                  id="nombre"
                  name="nombre"
                  placeholder="Tu nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  className="pl-10"
                />
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              </div>
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">Email *</label>
              <div className="relative">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="pl-10"
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          </div>
        )}
        
        {step === 'intereses' && (
          <div className="space-y-4">
            <div>
              <label htmlFor="zona" className="block text-sm font-medium mb-1">Zona de Sevilla donde buscas vivienda *</label>
              <div className="relative">
                <select
                  id="zona"
                  name="zona"
                  value={formData.zona}
                  onChange={handleInputChange as any}
                  className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                >
                  <option value="">Selecciona una zona</option>
                  {zonasSevilla.map(zona => (
                    <option key={zona} value={zona}>{zona}</option>
                  ))}
                </select>
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              </div>
            </div>
            
            <div>
              <label htmlFor="edad" className="block text-sm font-medium mb-1">Edad</label>
              <div className="relative">
                <Input
                  id="edad"
                  name="edad"
                  type="number"
                  min="18"
                  max="99"
                  placeholder="Tu edad"
                  value={formData.edad}
                  onChange={handleInputChange}
                  className="pl-10"
                />
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              </div>
            </div>
            
            <div>
              <Label className="block text-sm font-medium mb-3">Presupuesto mensual: {formData.presupuesto[0]}€</Label>
              <Slider
                defaultValue={[400]}
                max={1200}
                min={200}
                step={50}
                value={formData.presupuesto}
                onValueChange={handleSliderChange}
                className="my-5"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>200€</span>
                <span>700€</span>
                <span>1200€</span>
              </div>
            </div>
          </div>
        )}
        
        {step === 'confirmacion' && (
          <div className="space-y-6">
            <div>
              <p className="text-sm font-medium mb-3">¿Qué buscas en tu próximo hogar?</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {interesesOpciones.map(interes => (
                  <button
                    key={interes}
                    type="button"
                    onClick={() => toggleInteres(interes)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      formData.intereses.includes(interes)
                        ? 'bg-homi-purple text-white'
                        : 'bg-homi-ultraLightPurple text-homi-purple hover:bg-homi-purple/20'
                    }`}
                  >
                    {interes}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label htmlFor="comentarios" className="block text-sm font-medium mb-1">¿Algo más que debamos saber?</label>
              <Textarea
                id="comentarios"
                name="comentarios"
                placeholder="Coméntanos cualquier detalle adicional sobre lo que buscas..."
                value={formData.comentarios}
                onChange={handleInputChange}
                className="min-h-[100px]"
              />
            </div>
            
            <div className="bg-homi-ultraLightPurple/50 dark:bg-homi-purple/10 p-4 rounded-lg border border-homi-purple/10">
              <h5 className="font-medium mb-2">Resumen de tus datos</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="block text-muted-foreground">Nombre:</span>
                  <span className="font-medium">{formData.nombre}</span>
                </div>
                <div>
                  <span className="block text-muted-foreground">Email:</span>
                  <span className="font-medium">{formData.email}</span>
                </div>
                <div>
                  <span className="block text-muted-foreground">Zona:</span>
                  <span className="font-medium">{formData.zona}</span>
                </div>
                <div>
                  <span className="block text-muted-foreground">Edad:</span>
                  <span className="font-medium">{formData.edad || "No especificada"}</span>
                </div>
                <div>
                  <span className="block text-muted-foreground">Presupuesto:</span>
                  <span className="font-medium">{formData.presupuesto[0]}€</span>
                </div>
                <div>
                  <span className="block text-muted-foreground">Intereses:</span>
                  <span className="font-medium">{formData.intereses.length > 0 ? formData.intereses.join(', ') : "Ninguno seleccionado"}</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-8 flex justify-between">
          {step !== 'datos' ? (
            <Button 
              type="button" 
              variant="outline" 
              onClick={prevStep}
              className="rounded-full"
            >
              Atrás
            </Button>
          ) : (
            <div></div> // Espacio vacío para mantener la alineación
          )}
          
          {step !== 'confirmacion' ? (
            <Button 
              type="button" 
              onClick={nextStep}
              className="rounded-full bg-homi-purple hover:bg-homi-purple/90 ml-auto"
            >
              Siguiente 
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          ) : (
            <Button 
              type="submit" 
              disabled={isLoading}
              className="rounded-full bg-homi-purple hover:bg-homi-purple/90 ml-auto"
            >
              {isLoading ? "Enviando..." : "Completar registro"}
            </Button>
          )}
        </div>
      </form>
      
      <div className="mt-4 text-center text-xs text-muted-foreground">
        Al registrarte, aceptas recibir notificaciones cuando Homi esté disponible en tu ciudad.
      </div>
    </div>
  );
};

export default EmailSignup;
