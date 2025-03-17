import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Heart, 
  BookOpen, 
  Music, 
  Coffee, 
  Film, 
  Utensils, 
  Globe, 
  Users, 
  Moon, 
  Sun,
  Home,
  Search
} from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
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
});

type InterestCategory = {
  id: string;
  name: string;
  icon: JSX.Element;
  interests: string[];
};

const ProfileForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      age: "",
      location: "",
      occupation: "",
      university: "",
      bio: "",
    },
  });

  const [selectedInterests, setSelectedInterests] = React.useState<string[]>([]);
  const [lifestylePreferences, setLifestylePreferences] = React.useState({
    morningPerson: false,
    nightPerson: false,
    socializing: "moderado",
    cleanliness: "moderado",
    noise: "moderado",
  });
  
  const [lookingForPreferences, setLookingForPreferences] = React.useState({
    hasApartment: true,
    roommatesCount: "2",
    genderPreference: "cualquiera",
    smokingPreference: "no",
    occupationPreference: "estudiantes",
    minAge: "18",
    maxAge: "35",
  });

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

  const handleLookingForChange = (field: string, value: any) => {
    setLookingForPreferences(prev => ({
      ...prev,
      [field]: value
    }));
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    const profileData = {
      ...values,
      interests: selectedInterests,
      lifestyle: lifestylePreferences,
      lookingFor: lookingForPreferences
    };
    
    console.log(profileData);
  }

  return (
    <div className="max-w-3xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8 text-center">
        <span className="homi-gradient-text">Cuéntanos sobre ti</span>
      </h1>
      <p className="text-muted-foreground text-center mb-10">
        Completa tu perfil personal para que podamos encontrar compañeros con intereses y estilos de vida compatibles.
      </p>
      
      <div className="glass-card p-6 mb-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input placeholder="Tu nombre" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Edad</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Tu edad" {...field} />
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
                      <Input placeholder="¿Dónde vives?" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="occupation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ocupación</FormLabel>
                    <FormControl>
                      <Input placeholder="¿A qué te dedicas?" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="university"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Universidad (si aplica)</FormLabel>
                  <FormControl>
                    <Input placeholder="¿Dónde estudias?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sobre mí</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Cuéntanos un poco sobre ti, tus rutinas y lo que te gusta hacer..."
                      className="min-h-[120px]"
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
          </form>
        </Form>
      </div>
      
      <div className="glass-card p-6 mb-8">
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
      
      <div className="glass-card p-6 mb-8">
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
            <label className="text-base font-medium mb-3 block">Socialización en casa</label>
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
            <label className="text-base font-medium mb-3 block">Limpieza y orden</label>
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
            <label className="text-base font-medium mb-3 block">Tolerancia al ruido</label>
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
      
      <div className="glass-card p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Search className="text-homi-purple" size={20} />
          Lo que estoy buscando
        </h2>
        <p className="text-muted-foreground mb-6">
          Indícanos qué tipo de compañeros de piso estás buscando para ayudarte a encontrar las mejores coincidencias.
        </p>
        
        <div className="space-y-6">
          <div>
            <label className="text-base font-medium mb-3 block">¿Ya tienes piso o estás buscando uno?</label>
            <div className="flex gap-4">
              <button
                type="button"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                  lookingForPreferences.hasApartment
                    ? 'bg-homi-purple text-white border-homi-purple'
                    : 'bg-transparent border-input hover:bg-muted/50'
                }`}
                onClick={() => handleLookingForChange('hasApartment', true)}
              >
                <Home size={18} /> Ya tengo piso
              </button>
              <button
                type="button"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                  !lookingForPreferences.hasApartment
                    ? 'bg-homi-purple text-white border-homi-purple'
                    : 'bg-transparent border-input hover:bg-muted/50'
                }`}
                onClick={() => handleLookingForChange('hasApartment', false)}
              >
                <Search size={18} /> Estoy buscando piso
              </button>
            </div>
          </div>
          
          <div>
            <label className="text-base font-medium mb-3 block">¿Cuántos compañeros de piso buscas?</label>
            <div className="grid grid-cols-4 gap-3">
              {["1", "2", "3", "4+"].map((count) => (
                <button
                  key={count}
                  type="button"
                  className={`px-4 py-2 rounded-lg border ${
                    lookingForPreferences.roommatesCount === count
                      ? 'bg-homi-purple text-white border-homi-purple'
                      : 'bg-transparent border-input hover:bg-muted/50'
                  }`}
                  onClick={() => handleLookingForChange('roommatesCount', count)}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="text-base font-medium mb-3 block">Prefiero compartir con:</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: "cualquiera", label: "Cualquier género" },
                { value: "mujeres", label: "Solo mujeres" },
                { value: "hombres", label: "Solo hombres" }
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`px-4 py-2 rounded-lg border ${
                    lookingForPreferences.genderPreference === option.value
                      ? 'bg-homi-purple text-white border-homi-purple'
                      : 'bg-transparent border-input hover:bg-muted/50'
                  }`}
                  onClick={() => handleLookingForChange('genderPreference', option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="text-base font-medium mb-3 block">Preferencia respecto a fumar:</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: "no", label: "No fumadores" },
                { value: "ocasional", label: "Fumador ocasional" },
                { value: "si", label: "Fumadores ok" }
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`px-4 py-2 rounded-lg border ${
                    lookingForPreferences.smokingPreference === option.value
                      ? 'bg-homi-purple text-white border-homi-purple'
                      : 'bg-transparent border-input hover:bg-muted/50'
                  }`}
                  onClick={() => handleLookingForChange('smokingPreference', option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="text-base font-medium mb-3 block">Ocupación preferida:</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: "estudiantes", label: "Estudiantes" },
                { value: "trabajadores", label: "Trabajadores" },
                { value: "cualquiera", label: "Cualquiera" }
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`px-4 py-2 rounded-lg border ${
                    lookingForPreferences.occupationPreference === option.value
                      ? 'bg-homi-purple text-white border-homi-purple'
                      : 'bg-transparent border-input hover:bg-muted/50'
                  }`}
                  onClick={() => handleLookingForChange('occupationPreference', option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="text-base font-medium mb-3 block">Rango de edad:</label>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Edad mínima</label>
                <Select
                  value={lookingForPreferences.minAge}
                  onValueChange={(value) => handleLookingForChange('minAge', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar edad mínima" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 23 }, (_, i) => i + 18).map((age) => (
                      <SelectItem key={age} value={age.toString()}>
                        {age} años
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Edad máxima</label>
                <Select
                  value={lookingForPreferences.maxAge}
                  onValueChange={(value) => handleLookingForChange('maxAge', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar edad máxima" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 45 }, (_, i) => i + 21).map((age) => (
                      <SelectItem key={age} value={age.toString()}>
                        {age} años
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-center">
        <Button 
          type="submit" 
          className="bg-homi-purple hover:bg-homi-purple/90 text-white px-8 py-6 rounded-full text-lg"
          onClick={form.handleSubmit(onSubmit)}
        >
          Guardar Perfil
        </Button>
      </div>
    </div>
  );
};

export default ProfileForm;
