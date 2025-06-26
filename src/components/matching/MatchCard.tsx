import { useState } from 'react';
import CompatibilityBadge from '@/components/ui/CompatibilityBadge';
import { Heart, X, MessageSquare, User, Calendar, Home, MapPin, Clock, Briefcase, Users, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Tag {
  id: number;
  name: string;
}

interface MatchCardProps {
  id: string;
  name: string;
  age: number;
  location: string;
  bio: string;
  imgUrl: string;
  tags: Tag[];
  compatibility: number;
  ocupacion?: string;
  lifestyle?: {
    cleanliness: string;
    noise: string;
    schedule: string;
    guests: string;
    smoking: string;
  };
  budget?: {
    min: number;
    max: number;
  };
  moveInDate?: string;
  onLike: (id: string) => void;
  onPass: (id: string) => void;
  onView: (id: string) => void;
  compact?: boolean;
  sevilla_zona: string;
}

// Zonas específicas para diferentes ciudades
const getSpecificZones = (city: string) => {
  console.log('Getting zones for city:', city);
  const zones = {
    'Madrid': ['Malasaña', 'Chueca', 'La Latina', 'Chamberí', 'Retiro', 'Salamanca', 'Lavapiés', 'Argüelles', 'Moncloa', 'Ciudad Universitaria'],
    'Barcelona': ['Gràcia', 'El Born', 'Eixample', 'Poblenou', 'Barceloneta', 'Sarrià', 'Les Corts', 'Sants', 'Vila de Gràcia', 'El Raval'],
    'Valencia': ['El Carmen', 'Ruzafa', 'Ciutat Vella', 'Benimaclet', 'Algirós', 'Campanar', 'Jesús', 'Patraix', 'Poblats Marítims', 'Quatre Carreres'],
    'Sevilla': ['Nervión', 'Reina Mercedes', 'Triana', 'Centro', 'Los Remedios', 'Macarena', 'Este-Alcosa-Torreblanca', 'Bellavista-La Palmera', 'Cerro-Amate', 'Viapol', 'San Pablo', 'Rochelambert', 'Palmete', 'Ciudad Jardín', 'Heliópolis', 'Bami', 'Pino Montano', 'San Jerónimo', 'Tablada', 'Polígono Sur'],
    'Bilbao': ['Casco Viejo', 'Abando', 'Indautxu', 'Deusto', 'San Inazio', 'Begoña', 'Ibaiondo', 'Rekalde', 'Basurto', 'Zorrotza'],
    'Zaragoza': ['Centro', 'Universidad', 'Delicias', 'Almozara', 'Oliver-Valdefierro', 'Casablanca', 'Torrero-La Paz', 'Actur-Rey Fernando', 'Margen Izquierda', 'Sur'],
    'Málaga': ['Centro Histórico', 'Soho', 'La Malagueta', 'Pedregalejo', 'El Palo', 'Carretera de Cádiz', 'Ciudad Jardín', 'Teatinos', 'Churriana', 'Campanillas']
  };
  
  const cityZones = zones[city as keyof typeof zones] || ['Centro', 'Norte', 'Sur', 'Este', 'Oeste'];
  console.log('Available zones for', city, ':', cityZones);
  return cityZones;
};

const MatchCard = ({
  id,
  name,
  age,
  location,
  bio,
  imgUrl,
  tags,
  compatibility,
  ocupacion,
  lifestyle,
  budget,
  moveInDate,
  onLike,
  onPass,
  onView,
  compact = false,
  sevilla_zona
}: MatchCardProps) => {
  const [swiping, setSwiping] = useState<'left' | 'right' | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const lifestyleData = getLifestyle(lifestyle);
  
  // Generate number of roommates being sought (1-3)
  const roommatesNeeded = Math.floor(Math.random() * 3) + 1;
  
  // Simular datos de vivienda (en una implementación real vendría de la base de datos)
  const hasApartment = Math.random() > 0.5; // Esto debería venir de los datos del perfil
  const housingStatus = sevilla_zona && sevilla_zona.trim() !== ''
    ? (hasApartment ? `Tengo piso en ${sevilla_zona}` : `Busco piso en ${sevilla_zona}`)
    : (hasApartment ? 'Tengo piso' : 'Busco piso');
  console.log('Housing status:', housingStatus);
  
  // Simular precio del piso (en una implementación real vendría de la base de datos)
  const apartmentPrice = hasApartment ? Math.floor(Math.random() * 500) + 400 : null; // Entre 400-900€

  // Utilidad para obtener solo la primera palabra del nombre
  const firstName = name.split(' ')[0];

  // If compact mode is enabled, show a simplified card design
  if (compact) {
    return (
      <div 
        className="relative glass-card overflow-hidden transition-all duration-300 hover:shadow-md cursor-pointer h-full rounded-xl"
        onClick={() => onView(id)}
      >
        <div className="relative aspect-square overflow-hidden bg-gray-100 rounded-t-xl">
          <img
            src={imgUrl}
            alt={name}
            className="w-full h-full object-cover"
          />
          <div 
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 text-white"
          >
            <h3 className="text-base font-bold">{age && age !== 0 ? firstName+", "+age : firstName}</h3>
            <p className="text-xs opacity-90">
              {location}
            </p>
            {ocupacion && (
              <p className="text-xs opacity-80 flex items-center gap-1">
                <Briefcase size={10} />
                {ocupacion}
              </p>
            )}
          </div>
          <div className="absolute top-2 right-2">
            <CompatibilityBadge percentage={compatibility} size="sm" />
          </div>
          
          {/* Housing status badge */}
          <div className="absolute top-2 left-2">
            <span className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
              hasApartment 
                ? 'bg-green-500/90 text-white' 
                : 'bg-blue-500/90 text-white'
            }`}>
              {hasApartment ? <Home size={12} /> : <Search size={12} />}
              {housingStatus}
            </span>
          </div>
        </div>
        
        <div className="p-3">
          <p className="text-xs mb-2 line-clamp-2">{bio}</p>
          
          <div className="flex flex-wrap gap-1 mb-2">
            {tags.slice(0, 2).map((tag) => (
              <span 
                key={tag.id} 
                className="px-1.5 py-0.5 text-xs rounded-full bg-homi-ultraLightPurple text-homi-purple"
              >
                {tag.name}
              </span>
            ))}
            {tags.length > 2 && (
              <span className="px-1.5 py-0.5 text-xs rounded-full bg-muted text-muted-foreground">
                +{tags.length - 2}
              </span>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            {budget && (
              <span className="flex items-center gap-0.5 text-xs bg-green-500/20 text-green-700 px-2 py-0.5 rounded-full">
                {typeof budget === 'object' ? JSON.stringify(budget) : budget}
              </span>
            )}
            
            <div className="flex gap-1">
              <button 
                className="w-6 h-6 rounded-full bg-white border border-red-500 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  onPass(id);
                }}
              >
                <X size={12} />
              </button>
              <button 
                className="w-6 h-6 rounded-full bg-white border border-homi-purple text-homi-purple flex items-center justify-center hover:bg-homi-purple hover:text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  onLike(id);
                }}
              >
                <Heart size={12} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Original full-size card design - now with increased rounded corners
  return (
    <div 
      className={`relative max-w-md w-full mx-auto glass-card overflow-hidden transition-all duration-300 shadow-lg rounded-xl ${
        swiping === 'right' ? 'animate-swipe-right' : 
        swiping === 'left' ? 'animate-swipe-left' : ''
      }`}
    >
      <div className="relative aspect-[3/2] overflow-hidden bg-gray-100 rounded-t-xl">
        <img
          src={imgUrl}
          alt={name}
          className="w-full h-full object-cover"
        />
        <div 
          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 text-white"
        >
          <h3 className="text-xl font-bold">{age && age !== 0 ? firstName+", "+age : firstName}</h3>
          <p className="text-sm opacity-90">
            {location}
          </p>
          {ocupacion && (
            <p className="text-sm opacity-80 flex items-center gap-1">
              <Briefcase size={14} />
              {ocupacion}
            </p>
          )}
        </div>
        
        
        {/* Housing status badge */}
        <div className="absolute top-2 left-2">
          <span className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
            hasApartment 
              ? 'bg-green-500/90 text-white' 
              : 'bg-blue-500/90 text-white'
          }`}>
            {hasApartment ? <Home size={12} /> : <Search size={12} />}
            {housingStatus}
          </span>
        </div>
      </div>
      
      <div className="p-3">
        <div className="flex justify-between items-center mb-2">
          <button 
            onClick={() => setShowDetails(!showDetails)}
            className="text-sm font-medium text-homi-purple flex items-center gap-1 hover:underline"
          >
            {showDetails ? 'Mostrar menos' : 'Ver más detalles'}
            <span className="transition-transform duration-300" style={{ transform: showDetails ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
          </button>
          
          <div className="flex gap-2">
            {budget && (
              <span className="flex items-center text-xs gap-1 bg-green-500/20 text-green-700 px-2 py-1 rounded-full">
                {typeof budget === 'object' ? JSON.stringify(budget) : budget}
              </span>
            )}
            {moveInDate && (
              <span className="flex items-center text-xs gap-1 bg-homi-ultraLightPurple text-homi-purple px-2 py-1 rounded-full">
                <Calendar size={12} />
                {moveInDate}
              </span>
            )}
          </div>
        </div>
        
        <p className={`${showDetails ? '' : 'line-clamp-2'} mb-3 text-sm`}>{bio}</p>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {tags.map((tag) => (
            <span 
              key={tag.id} 
              className="px-2 py-0.5 text-xs rounded-full bg-homi-ultraLightPurple text-homi-purple"
            >
              {tag.name}
            </span>
          ))}
        </div>
        
        {/* Additional details */}
        {showDetails && lifestyleData && (
          <div className="mb-3 animate-fade-in">
            <h4 className="font-medium mb-2 text-sm">Estilo de vida</h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-1 text-xs">
                <span className="w-6 h-6 rounded-full bg-homi-ultraLightPurple flex items-center justify-center text-homi-purple">
                  <Clock size={14} />
                </span>
                <div>
                  <span className="text-xs text-muted-foreground">Horario</span>
                  <span className="block">{lifestyleData.schedule}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs">
                <span className="w-6 h-6 rounded-full bg-homi-ultraLightPurple flex items-center justify-center text-homi-purple">
                  <User size={14} />
                </span>
                <div>
                  <span className="text-xs text-muted-foreground">Limpieza</span>
                  <span className="block">{lifestyleData.cleanliness}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs">
                <span className="w-6 h-6 rounded-full bg-homi-ultraLightPurple flex items-center justify-center text-homi-purple">
                  <MessageSquare size={14} />
                </span>
                <div>
                  <span className="text-xs text-muted-foreground">Invitados</span>
                  <span className="block">{lifestyleData.guests}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs">
                <span className="w-6 h-6 rounded-full bg-homi-ultraLightPurple flex items-center justify-center text-homi-purple">
                  <span className="text-xs">🚬</span>
                </span>
                <div>
                  <span className="text-xs text-muted-foreground">Fumar</span>
                  <span className="block">{lifestyleData.smoking}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-3 pt-2 border-t border-muted">
              <div className="flex items-center gap-2 text-sm">
                <span className="w-6 h-6 rounded-full bg-homi-ultraLightPurple flex items-center justify-center text-homi-purple">
                  <Users size={14} />
                </span>
                <div>
                  <span className="text-xs text-muted-foreground">Busca</span>
                  <span className="block font-medium">
                    {roommatesNeeded} compañero{roommatesNeeded > 1 ? 's' : ''} de piso
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex justify-between gap-2 mt-2">
          <button 
            className="w-10 h-10 rounded-full bg-white border border-red-500 text-red-500 flex items-center justify-center shadow-md transition-all hover:bg-red-500 hover:text-white"
            onClick={() => handleSwipe('left')}
          >
            <X size={20} />
          </button>
          
          
          
          <button 
            className="w-10 h-10 rounded-full bg-white border border-homi-purple text-homi-purple flex items-center justify-center shadow-md transition-all hover:bg-homi-purple hover:text-white"
            onClick={() => handleSwipe('right')}
          >
            <Heart size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MatchCard;

const getLifestyle = (lifestyle: any) => {
  if (!lifestyle) return null;

  return {
    cleanliness: lifestyle.cleanliness === "very_clean" ? "Muy ordenado/a" 
      : lifestyle.cleanliness === "clean" ? "Ordenado/a" 
      : lifestyle.cleanliness === "moderate" ? "Moderado/a" 
      : lifestyle.cleanliness === "relaxed" ? "Relajado/a" 
      : lifestyle.cleanliness,
    
    schedule: lifestyle.schedule === "morning_person" ? "Madrugador/a"
      : lifestyle.schedule === "night_owl" ? "Nocturno/a"
      : lifestyle.schedule === "flexible" ? "Flexible"
      : lifestyle.schedule,
    
    guests: lifestyle.guests === "rarely" ? "Casi nunca"
      : lifestyle.guests === "occasionally" ? "Ocasionalmente"
      : lifestyle.guests === "frequently" ? "Frecuentemente"
      : lifestyle.guests === "no_problem" ? "No me importa"
      : lifestyle.guests,
    
    smoking: lifestyle.smoking === "non_smoker" ? "No fumo"
      : lifestyle.smoking === "outdoor_only" ? "Fuma en exteriores"
      : lifestyle.smoking === "smoker" ? "Fumo"
      : lifestyle.smoking
  };
}
