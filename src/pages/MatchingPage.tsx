import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import MatchCard from '@/components/matching/MatchCard';
import MatchesList from '@/components/matching/MatchesList';
import ProfileSearchBar from '@/components/profiles/ProfileSearchBar';
import MatchingFilters from '@/components/matching/MatchingFilters';
import SwipeInterface from '@/components/matching/SwipeInterface';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Filter, UserRound, LayoutGrid, SwatchBook, Heart, Users, Settings } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Link } from 'react-router-dom';
import DemoBanner from '@/components/layout/DemoBanner';

type MockProfile = {
  id: number;
  name: string;
  username: string;
  age: number;
  location: string;
  occupation: string;
  bio: string;
  compatibility: number;
  profileImage: string;
  interests: string[];
  lifestyle: {
    cleanliness: string;
    noise: string;
    schedule: string;
    guests: string;
    smoking: string;
  };
  budget: {
    min: number;
    max: number;
  };
};

const mockProfiles: MockProfile[] = [{
  id: 1,
  name: "Laura García",
  username: "lauragarcia",
  age: 24,
  location: "Madrid",
  occupation: "Estudiante de Medicina",
  bio: "Buscando piso compartido cerca del hospital. Soy tranquila y ordenada.",
  compatibility: 95,
  profileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3",
  interests: ["lectura", "viajes", "música"],
  lifestyle: {
    cleanliness: "Muy ordenada",
    noise: "Tranquila",
    schedule: "diurno",
    guests: "Ocasionalmente",
    smoking: "No"
  },
  budget: {
    min: 400,
    max: 600
  }
}, {
  id: 2,
  name: "Carlos Martínez",
  username: "carlosm",
  age: 28,
  location: "Barcelona",
  occupation: "Desarrollador Web",
  bio: "Busco compañero/a de piso en Barcelona. Trabajo desde casa la mayoría de días.",
  compatibility: 82,
  profileImage: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3",
  interests: ["tecnología", "gaming", "deportes"],
  lifestyle: {
    cleanliness: "Normal",
    noise: "Normal",
    schedule: "flexible",
    guests: "Frecuentemente",
    smoking: "No"
  },
  budget: {
    min: 500,
    max: 800
  }
}, {
  id: 3,
  name: "Ana López",
  username: "analopez",
  age: 26,
  location: "Valencia",
  occupation: "Diseñadora Gráfica",
  bio: "Creativa, ordenada y sociable. Busco piso cerca del centro con buen ambiente.",
  compatibility: 78,
  profileImage: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop&ixlib=rb-4.0.3",
  interests: ["arte", "fotografía", "viajes"],
  lifestyle: {
    cleanliness: "Muy ordenada",
    noise: "Sociable",
    schedule: "diurno",
    guests: "Ocasionalmente",
    smoking: "Sí"
  },
  budget: {
    min: 350,
    max: 550
  }
}, {
  id: 4,
  name: "Miguel Sánchez",
  username: "miguels",
  age: 30,
  location: "Sevilla",
  occupation: "Arquitecto",
  bio: "Busco piso compartido con personas tranquilas y respetuosas.",
  compatibility: 65,
  profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3",
  interests: ["deporte", "lectura", "música"],
  lifestyle: {
    cleanliness: "Normal",
    noise: "Tranquilo",
    schedule: "nocturno",
    guests: "Rara vez",
    smoking: "No"
  },
  budget: {
    min: 400,
    max: 700
  }
}];

const formatProfileForMatchCard = (profile: any) => {
  const tags = profile.interests.map((interest: string, index: number) => ({
    id: index + 1,
    name: interest
  }));
  return {
    id: profile.id.toString(),
    name: profile.name,
    age: profile.age,
    location: profile.location,
    bio: profile.bio,
    imgUrl: profile.profileImage,
    tags: tags,
    compatibility: profile.compatibility,
    lifestyle: profile.lifestyle,
    budget: profile.budget,
    onLike: () => {},
    onPass: () => {},
    onView: () => {}
  };
};

interface FilterValues {
  presupuesto?: [number, number];
  ubicacion?: string;
  rangoEdad?: string;
  fechaMudanza?: string;
  estiloVida?: string[];
  intereses?: string[];
  nivelLimpieza?: string;
  nivelRuido?: string;
  horarioHabitual?: string;
  invitados?: string;
  fumar?: string;
  mascotas?: string;
}

interface Lifestyle {
  cleanliness: string;
  noise: string;
  schedule: string;
  guests: string;
  smoking: string;
}

const emptyLifestyle: Lifestyle = {
  cleanliness: "",
  noise: "",
  schedule: "",
  guests: "",
  smoking: ""
};

interface Profile {
  id: number;
  name: string;
  username: string;
  age: number;
  location: string;
  occupation: string;
  bio: string;
  compatibility: number;
  profileImage: string;
  interests: string[];
  lifestyle: Lifestyle;
  budget: {
    min: number;
    max: number;
  };
}

interface MatchingPageProps {
  isPreview?: boolean;
}

const MatchingPage = ({ isPreview = false }: MatchingPageProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<FilterValues | null>(null);
  const [filteredProfiles, setFilteredProfiles] = useState<MockProfile[]>(mockProfiles);
  const [originalFilteredProfiles, setOriginalFilteredProfiles] = useState<MockProfile[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'swipe'>('grid');
  const [activeTab, setActiveTab] = useState<'discover' | 'matches'>('discover');
  const { toast } = useToast();
  const [openSearchFilters, setOpenSearchFilters] = useState(false);
  const [openPreferences, setOpenPreferences] = useState(false);
  const isMobile = useIsMobile();
  const [matches, setMatches] = useState([{
    id: "5",
    name: "Elena Fernández",
    age: 25,
    location: "Madrid",
    imgUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.0.3",
    compatibility: 91,
    matchDate: "2025-03-18T14:30:00Z",
    messageCount: 5,
    tags: [{
      id: 1,
      name: "música"
    }, {
      id: 2,
      name: "yoga"
    }, {
      id: 3,
      name: "cocina"
    }]
  }, {
    id: "6",
    name: "Diego Morales",
    age: 27,
    location: "Barcelona",
    imgUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3",
    compatibility: 87,
    matchDate: "2025-03-15T10:15:00Z",
    tags: [{
      id: 1,
      name: "gaming"
    }, {
      id: 2,
      name: "tecnología"
    }, {
      id: 3,
      name: "cine"
    }]
  }, {
    id: "7",
    name: "Lucía Martínez",
    age: 24,
    location: "Valencia",
    imgUrl: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?q=80&w=1980&auto=format&fit=crop&ixlib=rb-4.0.3",
    compatibility: 82,
    matchDate: "2025-03-10T18:45:00Z",
    messageCount: 2,
    tags: [{
      id: 1,
      name: "deporte"
    }, {
      id: 2,
      name: "viajes"
    }, {
      id: 3,
      name: "fotografía"
    }]
  }]);

  React.useEffect(() => {
    if (isMobile) {
      setViewMode('swipe');
    } else {
      setViewMode('grid');
    }
  }, [isMobile]);

  const handleAction = (action: () => void, message: string) => {
    if (isPreview) {
      toast({
        title: "Demostración",
        description: "Esta es una vista previa. Regístrate para utilizar esta función.",
        variant: "default"
      });
    } else {
      action();
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    handleAction(
      () => applyFiltersAndSearch(query, activeFilters),
      "Función de búsqueda"
    );
  };

  const handleApplyFilters = (filters: FilterValues) => {
    setActiveFilters(filters);
    handleAction(
      () => {
        applyFiltersAndSearch(searchQuery, filters);
        const filterCount = Object.values(filters).filter(value => value !== undefined && (Array.isArray(value) ? value.length > 0 : true)).length;
        toast({
          title: `Filtros aplicados (${filterCount})`,
          description: filterCount > 0 ? "Se han aplicado los filtros seleccionados" : "No se han seleccionado filtros específicos",
          variant: "default"
        });
      },
      "Función de filtros"
    );
  };

  const handleClearFilters = () => {
    setActiveFilters(null);
    handleAction(
      () => {
        applyFiltersAndSearch(searchQuery, null);
        toast({
          title: "Filtros eliminados",
          description: "Se han eliminado todos los filtros",
          variant: "default"
        });
      },
      "Función de limpiar filtros"
    );
  };

  const calculateSimilarityScore = (profile: MockProfile, filters: FilterValues) => {
    let score = 0;
    let possiblePoints = 0;
    if (filters.ubicacion) {
      possiblePoints += 10;
      if (profile.location === filters.ubicacion) {
        score += 10;
      }
    }
    if (filters.presupuesto && profile.budget) {
      possiblePoints += 10;
      const [minFilter, maxFilter] = filters.presupuesto;
      const {
        min: minProfile,
        max: maxProfile
      } = profile.budget;

      if (maxProfile >= minFilter && minProfile <= maxFilter) {
        const overlapStart = Math.max(minFilter, minProfile);
        const overlapEnd = Math.min(maxFilter, maxProfile);
        const overlapSize = overlapEnd - overlapStart;
        const filterSize = maxFilter - minFilter;
        const overlapPercentage = overlapSize / filterSize;
        score += Math.round(10 * overlapPercentage);
      }
    }
    if (filters.rangoEdad) {
      possiblePoints += 10;
      let matches = false;
      if (filters.rangoEdad === '18-25' && profile.age >= 18 && profile.age <= 25) {
        matches = true;
      } else if (filters.rangoEdad === '26-30' && profile.age >= 26 && profile.age <= 30) {
        matches = true;
      } else if (filters.rangoEdad === '31-40' && profile.age >= 31 && profile.age <= 40) {
        matches = true;
      } else if (filters.rangoEdad === '41+' && profile.age >= 41) {
        matches = true;
      }
      if (matches) {
        score += 10;
      }
    }
    if (filters.estiloVida && filters.estiloVida.length > 0 && profile.lifestyle) {
      possiblePoints += 15;
      const estiloVidaTerms = filters.estiloVida.map(ev => ev.toLowerCase());
      let matchCount = 0;
      if (estiloVidaTerms.includes('ordenado') && profile.lifestyle.cleanliness === "Muy ordenada") {
        matchCount++;
      }
      if (estiloVidaTerms.includes('tranquilo') && profile.lifestyle.noise === "Tranquila") {
        matchCount++;
      }
      if (estiloVidaTerms.includes('nocturno') && profile.lifestyle.schedule === "nocturno") {
        matchCount++;
      }
      if (estiloVidaTerms.includes('madrugador') && profile.lifestyle.schedule === "diurno") {
        matchCount++;
      }
      if (estiloVidaTerms.includes('no-fumador') && profile.lifestyle.smoking === "No") {
        matchCount++;
      }
      const matchPercentage = matchCount / estiloVidaTerms.length;
      score += Math.round(15 * matchPercentage);
    }
    if (filters.intereses && filters.intereses.length > 0) {
      possiblePoints += 15;
      const matchCount = filters.intereses.filter(interest => profile.interests.includes(interest)).length;
      const matchPercentage = matchCount / filters.intereses.length;
      score += Math.round(15 * matchPercentage);
    }

    if (filters.nivelLimpieza && profile.lifestyle) {
      possiblePoints += 5;
      if (filters.nivelLimpieza === 'alta' && profile.lifestyle.cleanliness === "Muy ordenada" || filters.nivelLimpieza === 'media' && profile.lifestyle.cleanliness === "Normal") {
        score += 5;
      }
    }
    if (filters.nivelRuido && profile.lifestyle) {
      possiblePoints += 5;
      if (filters.nivelRuido === 'bajo' && profile.lifestyle.noise === "Tranquila" || filters.nivelRuido === 'moderado' && profile.lifestyle.noise === "Normal" || filters.nivelRuido === 'alto' && profile.lifestyle.noise === "Sociable") {
        score += 5;
      }
    }
    if (filters.horarioHabitual && profile.lifestyle) {
      possiblePoints += 5;
      if (filters.horarioHabitual === 'madrugador' && profile.lifestyle.schedule === "diurno" || filters.horarioHabitual === 'nocturno' && profile.lifestyle.schedule === "nocturno" || filters.horarioHabitual === 'flexible' && profile.lifestyle.schedule === "flexible") {
        score += 5;
      }
    }

    return possiblePoints > 0 ? score / possiblePoints * 100 : 0;
  };

  const applyFiltersAndSearch = (query: string, filters: FilterValues | null) => {
    let exactMatches: MockProfile[] = [];
    let similarProfiles: {
      profile: MockProfile;
      score: number;
    }[] = [];
    let results = [...mockProfiles];

    if (query.trim()) {
      const lowerCaseQuery = query.toLowerCase();
      results = results.filter(profile => profile.name.toLowerCase().includes(lowerCaseQuery) || profile.username.toLowerCase().includes(lowerCaseQuery) || profile.bio.toLowerCase().includes(lowerCaseQuery) || profile.location.toLowerCase().includes(lowerCaseQuery) || profile.occupation.toLowerCase().includes(lowerCaseQuery));
    }

    if (filters) {
      similarProfiles = results.map(profile => ({
        profile,
        score: calculateSimilarityScore(profile, filters)
      }));

      let filteredResults = [...results];
      if (filters.ubicacion) {
        filteredResults = filteredResults.filter(profile => profile.location === filters.ubicacion);
      }
      if (filters.presupuesto) {
        const [min, max] = filters.presupuesto;
        filteredResults = filteredResults.filter(profile => profile.budget && profile.budget.min <= max && profile.budget.max >= min);
      }
      if (filters.rangoEdad) {
        if (filters.rangoEdad === '18-25') {
          filteredResults = filteredResults.filter(profile => profile.age >= 18 && profile.age <= 25);
        } else if (filters.rangoEdad === '26-30') {
          filteredResults = filteredResults.filter(profile => profile.age >= 26 && profile.age <= 30);
        } else if (filters.rangoEdad === '31-40') {
          filteredResults = filteredResults.filter(profile => profile.age >= 31 && profile.age <= 40);
        } else if (filters.rangoEdad === '41+') {
          filteredResults = filteredResults.filter(profile => profile.age >= 41);
        }
      }
      if (filters.estiloVida && filters.estiloVida.length > 0) {
        const estiloVidaTerms = filters.estiloVida.map(ev => ev.toLowerCase());
        filteredResults = filteredResults.filter(profile => {
          const profileLifestyle = profile.lifestyle;
          const hasMatchingLifestyle = estiloVidaTerms.includes('ordenado') && profileLifestyle.cleanliness === "Muy ordenada" || estiloVidaTerms.includes('tranquilo') && profileLifestyle.noise === "Tranquila" || estiloVidaTerms.includes('nocturno') && profileLifestyle.schedule === "nocturno" || estiloVidaTerms.includes('madrugador') && profileLifestyle.schedule === "diurno" || estiloVidaTerms.includes('no-fumador') && profileLifestyle.smoking === "No";
          return hasMatchingLifestyle;
        });
      }
      if (filters.intereses && filters.intereses.length > 0) {
        filteredResults = filteredResults.filter(profile => filters.intereses!.some(interest => profile.interests.includes(interest)));
      }
      if (filters.nivelLimpieza) {
        filteredResults = filteredResults.filter(profile => {
          const lifestyle = profile.lifestyle;
          if (filters.nivelLimpieza === 'alta') {
            return lifestyle.cleanliness === "Muy ordenada";
          } else if (filters.nivelLimpieza === 'media') {
            return lifestyle.cleanliness === "Normal";
          } else {
            return true;
          }
        });
      }
      if (filters.nivelRuido) {
        filteredResults = filteredResults.filter(profile => {
          const lifestyle = profile.lifestyle;
          if (filters.nivelRuido === 'bajo') {
            return lifestyle.noise === "Tranquila";
          } else if (filters.nivelRuido === 'moderado') {
            return lifestyle.noise === "Normal";
          } else {
            return lifestyle.noise === "Sociable";
          }
        });
      }
      if (filters.horarioHabitual) {
        filteredResults = filteredResults.filter(profile => {
          const lifestyle = profile.lifestyle;
          if (filters.horarioHabitual === 'madrugador') {
            return lifestyle.schedule === "diurno";
          } else if (filters.horarioHabitual === 'nocturno') {
            return lifestyle.schedule === "nocturno";
          } else {
            return lifestyle.schedule === "flexible";
          }
        });
      }
      if (filters.invitados) {
        filteredResults = filteredResults.filter(profile => {
          const lifestyle = profile.lifestyle;
          if (filters.invitados === 'frecuente') {
            return lifestyle.guests === "Frecuentemente";
          } else if (filters.invitados === 'ocasional') {
            return lifestyle.guests === "Ocasionalmente";
          } else {
            return lifestyle.guests === "Rara vez";
          }
        });
      }
      if (filters.fumar) {
        filteredResults = filteredResults.filter(profile => {
          const lifestyle = profile.lifestyle;
          if (filters.fumar === 'no') {
            return lifestyle.smoking === "No";
          } else {
            return lifestyle.smoking === "Sí";
          }
        });
      }
      exactMatches = filteredResults;

      if (exactMatches.length === 0 && similarProfiles.length > 0) {
        similarProfiles.sort((a, b) => b.score - a.score);
        const similarEnough = similarProfiles.filter(item => item.score >= 30);
        if (similarEnough.length > 0) {
          results = similarEnough.map(item => item.profile);
          toast({
            title: "No hay coincidencias exactas",
            description: `Mostrando ${results.length} perfiles similares a tus criterios`,
            variant: "default"
          });
        } else {
          results = [];
        }
      } else {
        results = exactMatches;
      }
    }

    setOriginalFilteredProfiles(results);
    setFilteredProfiles(results);
    if (activeFilters !== null || query.trim()) {
      toast({
        title: `${results.length} perfiles encontrados`,
        description: results.length > 0 ? "Se han encontrado perfiles que coinciden con tus criterios" : "No se encontraron perfiles que coincidan con tus criterios",
        variant: results.length > 0 ? "default" : "destructive"
      });
    }
  };

  const handleLike = (id: string) => {
    handleAction(
      () => {
        if (!matches.some(match => match.id === id)) {
          const profileToMatch = mockProfiles.find(p => p.id.toString() === id);
          if (profileToMatch) {
            const newMatch = {
              id: profileToMatch.id.toString(),
              name: profileToMatch.name,
              age: profileToMatch.age,
              location: profileToMatch.location,
              imgUrl: profileToMatch.profileImage,
              compatibility: profileToMatch.compatibility,
              matchDate: new Date().toISOString(),
              tags: profileToMatch.interests.map((interest, idx) => ({
                id: idx + 1,
                name: interest
              }))
            };
            setMatches(prev => [newMatch, ...prev]);
            toast({
              title: "¡Nuevo match!",
              description: `Has hecho match con ${profileToMatch.name}`,
              variant: "default"
            });
          } else {
            toast({
              title: "¡Te interesa!",
              description: "Has mostrado interés en este perfil",
              variant: "default"
            });
          }
        } else {
          toast({
            title: "Ya hiciste match",
            description: "Ya has hecho match con este perfil anteriormente",
            variant: "default"
          });
        }
      },
      "Función de like"
    );
  };

  const handlePass = (id: string) => {
    handleAction(
      () => {
        toast({
          title: "Pasas",
          description: "Has pasado de este perfil",
          variant: "default"
        });
      },
      "Función de pasar"
    );
  };

  const handleView = (id: string) => {
    handleAction(
      () => {
        toast({
          title: "Ver perfil",
          description: "Viendo el perfil completo",
          variant: "default"
        });
      },
      "Función de ver perfil"
    );
  };

  const handleUnmatch = (id: string) => {
    handleAction(
      () => {
        setMatches(prev => prev.filter(match => match.id !== id));
      },
      "Función de deshacer match"
    );
  };

  const handleMessage = (id: string) => {
    handleAction(
      () => {
        toast({
          title: "Abrir chat",
          description: "Redirigiendo al chat con este usuario",
          variant: "default"
        });
      },
      "Función de mensaje"
    );
  };

  const handleViewProfile = (id: string) => {
    handleAction(
      () => {
        toast({
          title: "Ver perfil completo",
          description: "Viendo el perfil completo del usuario",
          variant: "default"
        });
      },
      "Función de ver perfil completo"
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {isPreview && <DemoBanner />}
      
      <main className="flex-grow pt-0 pb-12 bg-transparent">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              <span className="homi-gradient-text">Encuentra compañeros</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl font-normal text-left">Explora los perfiles y conecta con potenciales compañeros de piso.</p>
          </div>
          
          <Tabs defaultValue="discover" value={activeTab} onValueChange={value => setActiveTab(value as 'discover' | 'matches')} className="mb-4">
            <div className="flex justify-between items-center mb-6">
              <TabsList className="bg-muted/60">
                <TabsTrigger value="discover" className="flex items-center gap-2">
                  <Users size={16} />
                  <span className="hidden sm:inline">Descubrir</span>
                </TabsTrigger>
                <TabsTrigger value="matches" className="flex items-center gap-2">
                  <Heart size={16} />
                  <span className="hidden sm:inline">Mis Matches</span>
                  {matches.length > 0 && (
                    <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-homi-purple/20">
                      {matches.length}
                    </span>
                  )}
                </TabsTrigger>
              </TabsList>
              
              {activeTab === 'discover' && (
                <div className="flex gap-2">
                  {isMobile && (
                    <div className="flex items-center mr-auto">
                      <Button variant="ghost" size="xs" className={`rounded-l-full ${viewMode === 'grid' ? 'bg-muted' : ''}`} onClick={() => setViewMode('grid')}>
                        <LayoutGrid size={16} />
                      </Button>
                      <Button variant="ghost" size="xs" className={`rounded-r-full ${viewMode === 'swipe' ? 'bg-muted' : ''}`} onClick={() => setViewMode('swipe')}>
                        <SwatchBook size={16} />
                      </Button>
                    </div>
                  )}
                  
                  <Popover open={openSearchFilters} onOpenChange={setOpenSearchFilters}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="xs" className="flex items-center gap-1.5" onClick={() => setOpenSearchFilters(!openSearchFilters)}>
                        <Filter className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline text-xs">Filtros</span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0 z-50" align="end" sideOffset={5} compact>
                      <div className="overflow-auto max-h-[80vh] max-w-[90vw] w-[450px] pb-3">
                        <MatchingFilters 
                          onApplyFilters={filters => {
                            handleApplyFilters(filters);
                            setOpenSearchFilters(false);
                          }} 
                          onClearFilters={handleClearFilters} 
                          activeTab="filtros" 
                          className="w-full" 
                        />
                      </div>
                    </PopoverContent>
                  </Popover>
                  
                  <Popover open={openPreferences} onOpenChange={setOpenPreferences}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="xs" className="flex items-center gap-1.5" onClick={() => setOpenPreferences(!openPreferences)}>
                        <Settings className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline text-xs">Preferencias</span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0 z-50" align="end" sideOffset={5} compact>
                      <div className="overflow-auto max-h-[80vh] max-w-[90vw] w-[450px] pb-3">
                        <MatchingFilters 
                          onApplyFilters={filters => {
                            handleApplyFilters(filters);
                            setOpenPreferences(false);
                          }} 
                          onClearFilters={handleClearFilters} 
                          activeTab="preferencias" 
                          className="w-full" 
                        />
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              )}
            </div>
          
            <TabsContent value="discover" className="mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                <div className="lg:col-span-2">
                  <ProfileSearchBar onSearch={handleSearch} className="w-full" />
                </div>
                <div className="lg:col-span-1">
                  {/* Empty space for filters alignment */}
                </div>
              </div>
              
              {filteredProfiles.length > 0 ? (
                <>
                  {viewMode === 'swipe' && (
                    <div className="mb-6">
                      <SwipeInterface 
                        profiles={filteredProfiles.map(profile => ({
                          id: profile.id.toString(),
                          name: profile.name,
                          age: profile.age,
                          location: profile.location,
                          bio: profile.bio,
                          imgUrl: profile.profileImage,
                          tags: profile.interests.map((interest, idx) => ({
                            id: idx + 1,
                            name: interest
                          })),
                          compatibility: profile.compatibility,
                          lifestyle: profile.lifestyle,
                          budget: profile.budget
                        }))} 
                        onLike={handleLike} 
                        onPass={handlePass} 
                        onView={handleView} 
                      />
                    </div>
                  )}
                  
                  {viewMode === 'grid' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredProfiles.map(profile => {
                        const cardProps = formatProfileForMatchCard(profile);
                        return (
                          <MatchCard 
                            key={profile.id} 
                            {...cardProps} 
                            onLike={handleLike} 
                            onPass={handlePass} 
                            onView={handleView} 
                            compact={isMobile} 
                          />
                        );
                      })}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-16">
                  <p className="text-xl text-muted-foreground">
                    No se encontraron perfiles que coincidan con tus criterios.
                  </p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="matches" className="mt-0">
              {matches.length > 0 ? (
                <MatchesList 
                  matches={matches} 
                  onMessage={handleMessage}
                  onUnmatch={handleUnmatch}
                  onViewProfile={handleViewProfile}
                />
              ) : (
                <div className="text-center py-16">
                  <div className="mb-6">
                    <div className="inline-block p-4 rounded-full bg-muted mb-4">
                      <Heart className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">No tienes matches aún</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      ¡Sigue explorando perfiles y encontrarás compañeros de piso compatibles!
                    </p>
                  </div>
                  <Button 
                    onClick={() => setActiveTab('discover')}
                    className="rounded-full bg-homi-purple hover:bg-homi-purple/90"
                  >
                    Explorar perfiles
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default MatchingPage;
