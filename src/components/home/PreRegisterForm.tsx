
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
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
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { ArrowRight, Check, Home, Mail, MapPin, Sparkles, User, Users } from 'lucide-react';

const stepOneSchema = z.object({
  name: z.string().min(2, { message: 'El nombre debe tener al menos 2 caracteres' }),
  email: z.string().email({ message: 'Email inválido' }),
});

const stepTwoSchema = z.object({
  city: z.string().min(2, { message: 'Por favor indica tu ciudad' }),
  lookingFor: z.enum(['roommate', 'room', 'both'], {
    required_error: 'Por favor selecciona una opción',
  }),
});

const stepThreeSchema = z.object({
  interests: z.string().optional(),
  budget: z.string().min(1, { message: 'Por favor indica tu presupuesto' }),
});

const PreRegisterForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const { toast } = useToast();

  const stepOneForm = useForm<z.infer<typeof stepOneSchema>>({
    resolver: zodResolver(stepOneSchema),
    defaultValues: {
      name: '',
      email: '',
    },
  });

  const stepTwoForm = useForm<z.infer<typeof stepTwoSchema>>({
    resolver: zodResolver(stepTwoSchema),
    defaultValues: {
      city: '',
      lookingFor: 'roommate',
    },
  });

  const stepThreeForm = useForm<z.infer<typeof stepThreeSchema>>({
    resolver: zodResolver(stepThreeSchema),
    defaultValues: {
      interests: '',
      budget: '',
    },
  });

  const onStepOneSubmit = (values: z.infer<typeof stepOneSchema>) => {
    setFormData({ ...formData, ...values });
    setStep(2);
  };

  const onStepTwoSubmit = (values: z.infer<typeof stepTwoSchema>) => {
    setFormData({ ...formData, ...values });
    setStep(3);
  };

  const onStepThreeSubmit = async (values: z.infer<typeof stepThreeSchema>) => {
    const finalData = { ...formData, ...values };
    setIsLoading(true);
    
    // In a real application, this would call an API endpoint to store the registration
    // For now, we'll simulate a successful registration after a short delay
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Registration data:', finalData);
      setIsRegistered(true);
      toast({
        title: "¡Pre-registro completado!",
        description: "Te contactaremos pronto con más información.",
      });
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

  const goBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const lookingForOptions = [
    { value: 'roommate', label: 'Un compañero/a de piso', icon: <Users className="h-4 w-4" /> },
    { value: 'room', label: 'Una habitación', icon: <Home className="h-4 w-4" /> },
    { value: 'both', label: 'Ambos', icon: <Sparkles className="h-4 w-4" /> },
  ];

  if (isRegistered) {
    return (
      <div className="w-full max-w-lg mx-auto animate-fade-in">
        <div className="p-8 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-2xl border border-green-200 dark:border-green-800 shadow-xl">
          <div className="flex flex-col items-center text-center">
            <div className="h-20 w-20 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center mb-6 shadow-lg">
              <Check className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-green-700 dark:text-green-400">¡Pre-registro completado!</h3>
            <p className="text-green-600 dark:text-green-300 mb-6">
              Gracias por tu interés en Homi. Te contactaremos pronto con más información sobre nuestro lanzamiento y cómo podrás encontrar el compañero de piso ideal.
            </p>
            <Button 
              onClick={() => setIsRegistered(false)}
              variant="outline" 
              className="border-green-300 text-green-700 hover:bg-green-50 hover:text-green-800"
            >
              Volver
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="glass-card p-8 shadow-xl border border-homi-purple/10">
        <div className="flex justify-between mb-8 relative">
          {[1, 2, 3].map((stepNumber) => (
            <div key={stepNumber} className="flex flex-col items-center relative z-10">
              <div 
                className={`h-10 w-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  step === stepNumber
                    ? 'bg-gradient-to-r from-homi-purple to-homi-lightPurple text-white scale-110 shadow-lg'
                    : step > stepNumber
                    ? 'bg-green-100 text-green-600 dark:bg-green-900/60 dark:text-green-400'
                    : 'bg-gray-100 text-gray-400 dark:bg-gray-800/60 dark:text-gray-500'
                }`}
              >
                {step > stepNumber ? <Check size={20} /> : stepNumber}
              </div>
              <span className={`text-xs font-medium mt-2 ${
                step === stepNumber
                  ? 'text-homi-purple dark:text-homi-lightPurple'
                  : 'text-muted-foreground'
              }`}>
                {stepNumber === 1 ? 'Datos' : stepNumber === 2 ? 'Preferencias' : 'Intereses'}
              </span>
            </div>
          ))}
          
          {/* Progress bar */}
          <div className="absolute top-5 left-0 w-full h-0.5 bg-gray-100 dark:bg-gray-800 -z-0">
            <div 
              className="h-full bg-gradient-to-r from-homi-purple to-homi-lightPurple transition-all duration-500"
              style={{ width: `${(step - 1) * 50}%` }}
            ></div>
          </div>
        </div>

        {step === 1 && (
          <div className="animate-fade-in">
            <h3 className="text-xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-homi-purple via-homi-lightPurple to-homi-purple">
              Datos personales
            </h3>
            <Form {...stepOneForm}>
              <form onSubmit={stepOneForm.handleSubmit(onStepOneSubmit)} className="space-y-4">
                <FormField
                  control={stepOneForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre completo</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input placeholder="Tu nombre" className="pl-10" {...field} />
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={stepOneForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Correo electrónico</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input placeholder="tu@email.com" type="email" className="pl-10" {...field} />
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  className="w-full mt-6 rounded-full bg-gradient-to-r from-homi-purple to-homi-lightPurple hover:shadow-xl hover:shadow-homi-purple/25 transition-all duration-300"
                >
                  Continuar
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </Form>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-in">
            <h3 className="text-xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-homi-purple via-homi-lightPurple to-homi-purple">
              Preferencias de búsqueda
            </h3>
            <Form {...stepTwoForm}>
              <form onSubmit={stepTwoForm.handleSubmit(onStepTwoSubmit)} className="space-y-4">
                <FormField
                  control={stepTwoForm.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ciudad donde buscas</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input placeholder="Ej: Madrid, Barcelona, Valencia..." className="pl-10" {...field} />
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={stepTwoForm.control}
                  name="lookingFor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>¿Qué estás buscando?</FormLabel>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
                        {lookingForOptions.map((option) => (
                          <Button
                            key={option.value}
                            type="button"
                            variant={field.value === option.value ? "default" : "outline"}
                            className={`flex items-center justify-center gap-2 h-auto py-3 transition-all ${
                              field.value === option.value 
                                ? "bg-gradient-to-r from-homi-purple to-homi-lightPurple text-white" 
                                : "border-homi-purple/20 hover:bg-homi-ultraLightPurple/50"
                            }`}
                            onClick={() => field.onChange(option.value)}
                          >
                            {option.icon}
                            <span className="text-sm">{option.label}</span>
                          </Button>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-3 mt-6">
                  <Button 
                    type="button" 
                    variant="outline"
                    className="flex-1 border-homi-purple/20 hover:bg-homi-ultraLightPurple/50"
                    onClick={goBack}
                  >
                    Atrás
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1 rounded-full bg-gradient-to-r from-homi-purple to-homi-lightPurple hover:shadow-xl hover:shadow-homi-purple/25 transition-all duration-300"
                  >
                    Continuar
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        )}

        {step === 3 && (
          <div className="animate-fade-in">
            <h3 className="text-xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-homi-purple via-homi-lightPurple to-homi-purple">
              Intereses y presupuesto
            </h3>
            <Form {...stepThreeForm}>
              <form onSubmit={stepThreeForm.handleSubmit(onStepThreeSubmit)} className="space-y-4">
                <FormField
                  control={stepThreeForm.control}
                  name="budget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Presupuesto mensual (€)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="Ej: 400" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={stepThreeForm.control}
                  name="interests"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Intereses o comentarios (opcional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Cuéntanos un poco sobre ti, tus aficiones, preferencias de convivencia..." 
                          className="min-h-[100px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-3 mt-6">
                  <Button 
                    type="button" 
                    variant="outline"
                    className="flex-1 border-homi-purple/20 hover:bg-homi-ultraLightPurple/50"
                    onClick={goBack}
                  >
                    Atrás
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1 rounded-full bg-gradient-to-r from-homi-purple to-homi-lightPurple hover:shadow-xl hover:shadow-homi-purple/25 transition-all duration-300"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                        Enviando...
                      </>
                    ) : (
                      <>
                        Completar registro
                        <Sparkles className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        )}
      </div>
    </div>
  );
};

export default PreRegisterForm;
