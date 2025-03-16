
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckCircle2, Mail, UserPlus, Send, Sparkles, Calendar, MapPin, LockKeyhole, Info } from 'lucide-react';

type UserType = 'student' | 'professional' | 'other';

const PreRegisterForm = () => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const { toast } = useToast();
  
  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [age, setAge] = useState('');
  const [userType, setUserType] = useState<UserType>('student');
  const [interests, setInterests] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [notification, setNotification] = useState(true);

  const handleNext = () => {
    if (step === 1 && (!name || !email)) {
      toast({
        title: "Campos requeridos",
        description: "Por favor, completa todos los campos obligatorios.",
        variant: "destructive",
      });
      return;
    }
    
    if (step === 2 && (!city || !age || !userType)) {
      toast({
        title: "Campos requeridos",
        description: "Por favor, completa todos los campos obligatorios.",
        variant: "destructive",
      });
      return;
    }
    
    if (step < 3) {
      setStep((prevStep) => (prevStep === 1 ? 2 : 3) as 1 | 2 | 3);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((prevStep) => (prevStep === 3 ? 2 : 1) as 1 | 2 | 3);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !city || !age || !userType) {
      toast({
        title: "Campos incompletos",
        description: "Por favor, completa todos los campos obligatorios.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // In a real application, this would call an API endpoint to store user data
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsRegistered(true);
      toast({
        title: "¡Pre-registro exitoso!",
        description: "Te notificaremos cuando Homi esté disponible.",
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

  // Progress indicator
  const ProgressBar = () => (
    <div className="flex items-center justify-center gap-4 mb-8">
      {[1, 2, 3].map((s) => (
        <div key={s} className="flex items-center">
          <div 
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              s === step 
                ? 'bg-homi-purple text-white' 
                : s < step 
                  ? 'bg-homi-lightPurple text-white' 
                  : 'bg-muted text-muted-foreground'
            } transition-all duration-300`}
          >
            {s < step ? <CheckCircle2 size={16} /> : s}
          </div>
          {s < 3 && (
            <div className={`w-16 h-1 ${s < step ? 'bg-homi-lightPurple' : 'bg-muted'}`}></div>
          )}
        </div>
      ))}
    </div>
  );

  if (isRegistered) {
    return (
      <div className="glass-card p-10 rounded-3xl border border-homi-purple/20 shadow-xl bg-gradient-to-br from-white via-white to-homi-ultraLightPurple/30 dark:from-black/60 dark:via-black/50 dark:to-homi-purple/10">
        <div className="flex flex-col items-center justify-center">
          <div className="h-20 w-20 rounded-full bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center mb-6 shadow-lg shadow-green-400/20 animate-pulse-soft">
            <CheckCircle2 className="h-10 w-10 text-white" />
          </div>
          <h3 className="text-2xl md:text-3xl font-bold mb-4 text-gradient bg-gradient-to-r from-homi-purple to-homi-lightPurple">¡Pre-registro completado con éxito!</h3>
          <p className="text-lg text-center text-foreground/80 mb-6 max-w-md">
            Gracias por tu interés en Homi. Te notificaremos por email cuando la plataforma esté lista para lanzarse.
          </p>
          
          <div className="w-full max-w-md p-6 rounded-xl bg-homi-ultraLightPurple/30 border border-homi-purple/10 mb-6">
            <div className="flex items-start gap-3 mb-3">
              <UserPlus className="text-homi-purple h-5 w-5 mt-0.5" />
              <div>
                <h4 className="font-semibold text-foreground">Cuenta lista para crear</h4>
                <p className="text-sm text-muted-foreground">Tu información está guardada y lista para cuando abra la plataforma</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="text-homi-purple h-5 w-5 mt-0.5" />
              <div>
                <h4 className="font-semibold text-foreground">Notificaciones activadas</h4>
                <p className="text-sm text-muted-foreground">Te enviaremos un email cuando Homi esté disponible</p>
              </div>
            </div>
          </div>
          
          <Button 
            size="lg" 
            className="rounded-full bg-gradient-to-r from-homi-purple to-homi-lightPurple hover:shadow-xl hover:shadow-homi-purple/25 px-8 animate-float"
            onClick={() => window.location.reload()}
          >
            <Sparkles className="h-5 w-5 mr-2" />
            Volver al inicio
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-8 md:p-10 rounded-3xl border border-homi-purple/20 shadow-xl bg-gradient-to-br from-white via-white to-homi-ultraLightPurple/30 dark:from-black/60 dark:via-black/50 dark:to-homi-purple/10">
      <div className="mb-6 text-center">
        <h3 className="text-2xl md:text-3xl font-bold mb-3 text-gradient bg-gradient-to-r from-homi-purple to-homi-lightPurple">
          Pre-regístrate ahora
        </h3>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          Sé de los primeros en probar Homi cuando esté disponible y encuentra el compañero de piso perfecto.
        </p>
      </div>
      
      <ProgressBar />
      
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1 space-y-2">
                <Label htmlFor="name" className="text-foreground flex items-center gap-2">
                  <UserPlus size={16} className="text-homi-lightPurple" />
                  Nombre completo <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="Tu nombre y apellidos"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-12 rounded-xl border-homi-purple/20 focus:border-homi-purple focus:ring-homi-purple/20"
                  required
                />
              </div>
              <div className="flex-1 space-y-2">
                <Label htmlFor="email" className="text-foreground flex items-center gap-2">
                  <Mail size={16} className="text-homi-lightPurple" />
                  Correo electrónico <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 rounded-xl border-homi-purple/20 focus:border-homi-purple focus:ring-homi-purple/20"
                  required
                />
              </div>
            </div>
          </div>
        )}
        
        {/* Step 2: Personal Details */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1 space-y-2">
                <Label htmlFor="city" className="text-foreground flex items-center gap-2">
                  <MapPin size={16} className="text-homi-lightPurple" />
                  Ciudad <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="city"
                  placeholder="¿Dónde buscas piso?"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="h-12 rounded-xl border-homi-purple/20 focus:border-homi-purple focus:ring-homi-purple/20"
                  required
                />
              </div>
              <div className="flex-1 space-y-2">
                <Label htmlFor="age" className="text-foreground flex items-center gap-2">
                  <Calendar size={16} className="text-homi-lightPurple" />
                  Edad <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="Tu edad"
                  min="18"
                  max="99"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="h-12 rounded-xl border-homi-purple/20 focus:border-homi-purple focus:ring-homi-purple/20"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-foreground block mb-3 flex items-center gap-2">
                <Info size={16} className="text-homi-lightPurple" />
                ¿Eres estudiante o profesional? <span className="text-red-500">*</span>
              </Label>
              <div className="flex flex-wrap gap-3">
                {[
                  { value: 'student', label: '👨‍🎓 Estudiante' },
                  { value: 'professional', label: '💼 Profesional' },
                  { value: 'other', label: '✨ Otro' }
                ].map((option) => (
                  <Button
                    key={option.value}
                    type="button"
                    variant={userType === option.value ? 'default' : 'outline'}
                    className={`rounded-full px-6 py-2 h-auto ${
                      userType === option.value 
                        ? 'bg-gradient-to-r from-homi-purple to-homi-lightPurple text-white' 
                        : 'border-homi-purple/20 text-foreground hover:bg-homi-ultraLightPurple/30'
                    }`}
                    onClick={() => setUserType(option.value as UserType)}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Step 3: Preferences */}
        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-2">
              <Label htmlFor="interests" className="text-foreground flex items-center gap-2">
                <Sparkles size={16} className="text-homi-lightPurple" />
                Intereses y hobbies
              </Label>
              <Textarea
                id="interests"
                placeholder="¿Cuáles son tus intereses y hobbies? (deportes, música, arte, etc.)"
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                className="min-h-24 rounded-xl border-homi-purple/20 focus:border-homi-purple focus:ring-homi-purple/20"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="additionalInfo" className="text-foreground flex items-center gap-2">
                <Info size={16} className="text-homi-lightPurple" />
                Información adicional
              </Label>
              <Textarea
                id="additionalInfo"
                placeholder="¿Algo más que quieras contarnos? (preferencias de convivencia, mascotas, etc.)"
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
                className="min-h-24 rounded-xl border-homi-purple/20 focus:border-homi-purple focus:ring-homi-purple/20"
              />
            </div>
            
            <div className="flex items-start gap-3 p-4 rounded-xl bg-homi-ultraLightPurple/30 border border-homi-purple/10">
              <LockKeyhole className="text-homi-purple h-5 w-5 mt-0.5" />
              <div>
                <h4 className="font-semibold text-foreground">Privacidad y protección de datos</h4>
                <p className="text-sm text-muted-foreground">Tu información se utiliza únicamente para notificarte sobre el lanzamiento de Homi y preparar tu perfil cuando la plataforma esté lista.</p>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row justify-between mt-8 gap-4">
          {step > 1 ? (
            <Button 
              type="button" 
              variant="outline" 
              className="rounded-full border-homi-purple/20 hover:bg-homi-ultraLightPurple/30"
              onClick={handleBack}
              disabled={isLoading}
            >
              Atrás
            </Button>
          ) : (
            <div></div>
          )}
          
          {step < 3 ? (
            <Button 
              type="button" 
              className="rounded-full bg-gradient-to-r from-homi-purple to-homi-lightPurple hover:shadow-lg hover:shadow-homi-purple/25"
              onClick={handleNext}
            >
              Siguiente
            </Button>
          ) : (
            <Button 
              type="submit" 
              className="rounded-full bg-gradient-to-r from-homi-purple to-homi-lightPurple hover:shadow-lg hover:shadow-homi-purple/25"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Enviando...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  Completar pre-registro
                </span>
              )}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default PreRegisterForm;
