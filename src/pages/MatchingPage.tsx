import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import MatchCard from '@/components/matching/MatchCard';
import ProfileSearchBar from '@/components/profiles/ProfileSearchBar';
import MatchingFilters from '@/components/matching/MatchingFilters';
import SwipeInterface from '@/components/matching/SwipeInterface';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Filter, UserRound, LayoutGrid, SwatchBook } from 'lucide-react';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';

const mockProfiles = [
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  }
];

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
    onView: () => {},
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
  cleanliness?: string;
  noise?: string;
  schedule?: string;
  guests?: string;
  smoking?: string;
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
  lifestyle?: Lifestyle;
  budget?: {
    min: number;
    max: number;
  };
}

const MatchingPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<FilterValues | null>(null);
  const [filteredProfiles, setFilteredProfiles] = useState(mockProfiles);
  const [viewMode, setViewMode] = useState<'grid' | 'swipe'>('grid');
  const { toast } = useToast();
  const [openSearchFilters, setOpenSearchFilters] = useState(false);
  const [openPreferences, setOpenPreferences] = useState(false);
  const isMobile = useIsMobile();
  
  React.useEffect(() => {
    if (isMobile) {
      setViewMode('swipe');
    } else {
      setViewMode('grid');
    }
  }, [isMobile]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    applyFiltersAndSearch(query, activeFilters);
  };

  const handleApplyFilters = (filters: FilterValues) => {
    setActiveFilters(filters);
    applyFiltersAndSearch(searchQuery, filters);
    
    const filterCount = Object.values(filters).filter(value => 
      value !== undefined && 
      (Array.isArray(value) ? value.length > 0 : true)
    ).length;
    
    toast({
      title: `Filtros aplicados (${filterCount})`,
      description: filterCount > 0 ? 
        "Se han aplicado los filtros seleccionados" : 
        "No se han seleccionado filtros específicos",
      variant: "default"
    });
  };

  const handleClearFilters = () => {
    setActiveFilters(null);
    applyFiltersAndSearch(searchQuery, null);
    
    toast({
      title: "Filtros eliminados",
      description: "Se han eliminado todos los filtros",
      variant: "default"
    });
  };

  const applyFiltersAndSearch = (query: string, filters: FilterValues | null) => {
    let results = [...mockProfiles];
    
    if (query.trim()) {
      const lowerCaseQuery = query.toLowerCase();
      results = results.filter(profile => 
        profile.name.toLowerCase().includes(lowerCaseQuery) || 
        profile.username.toLowerCase().includes(lowerCaseQuery) ||
        profile.bio.toLowerCase().includes(lowerCaseQuery) ||
        profile.location.toLowerCase().includes(lowerCaseQuery) ||
        profile.occupation.toLowerCase().includes(lowerCaseQuery)
      );
    }
    
    if (filters) {
      if (filters.ubicacion) {
        results = results.filter(profile => profile.location === filters.ubicacion);
      }
      
      if (filters.presupuesto) {
        const [min, max] = filters.presupuesto;
        results = results.filter(profile => 
          profile.budget && 
          profile.budget.min <= max && 
          profile.budget.max >= min
        );
      }
      
      if (filters.rangoEdad) {
        if (filters.rangoEdad === '18-25') {
          results = results.filter(profile => profile.age >= 18 && profile.age <= 25);
        } else if (filters.rangoEdad === '26-30') {
          results = results.filter(profile => profile.age >= 26 && profile.age <= 30);
        } else if (filters.rangoEdad === '31-40') {
          results = results.filter(profile => profile.age >= 31 && profile.age <= 40);
        } else if (filters.rangoEdad === '41+') {
          results = results.filter(profile => profile.age >= 41);
        }
      }
      
      if (filters.estiloVida && filters.estiloVida.length > 0) {
        const estiloVidaTerms = filters.estiloVida.map(ev => ev.toLowerCase());
        results = results.filter(profile => {
          const profileLifestyle: Lifestyle = profile.lifestyle || emptyLifestyle;
          const hasMatchingLifestyle = 
            (estiloVidaTerms.includes('ordenado') && profileLifestyle.cleanliness === "Muy ordenada") ||
            (estiloVidaTerms.includes('tranquilo') && profileLifestyle.noise === "Tranquila") ||
            (estiloVidaTerms.includes('nocturno') && profileLifestyle.schedule === "nocturno") ||
            (estiloVidaTerms.includes('madrugador') && profileLifestyle.schedule === "diurno") ||
            (estiloVidaTerms.includes('no-fumador') && profileLifestyle.smoking === "No");
          
          return hasMatchingLifestyle;
        });
      }
      
      if (filters.intereses && filters.intereses.length > 0) {
        results = results.filter(profile => 
          filters.intereses!.some(interest => 
            profile.interests.includes(interest)
          )
        );
      }
      
      if (filters.nivelLimpieza) {
        results = results.filter(profile => {
          const lifestyle: Lifestyle = profile.lifestyle || emptyLifestyle;
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
        results = results.filter(profile => {
          const lifestyle: Lifestyle = profile.lifestyle || emptyLifestyle;
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
        results = results.filter(profile => {
          const lifestyle: Lifestyle = profile.lifestyle || emptyLifestyle;
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
        results = results.filter(profile => {
          const lifestyle: Lifestyle = profile.lifestyle || emptyLifestyle;
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
        results = results.filter(profile => {
          const lifestyle: Lifestyle = profile.lifestyle || emptyLifestyle;
          if (filters.fumar === 'no') {
            return lifestyle.smoking === "No";
          } else {
            return lifestyle.smoking === "Sí";
          }
        });
      }
    }
    
    setFilteredProfiles(results);
    
    if (activeFilters !== null || query.trim()) {
      toast({
        title: `${results.length} perfiles encontrados`,
        description: results.length > 0 
          ? "Se han encontrado perfiles que coinciden con tus criterios" 
          : "No se encontraron perfiles que coincidan con tus criterios",
        variant: results.length > 0 ? "default" : "destructive"
      });
    }
  };

  const handleLike = (id: string) => {
    toast({
      title: "¡Te interesa!",
      description: "Has mostrado interés en este perfil",
      variant: "default"
    });
  };

  const handlePass = (id: string) => {
    toast({
      title: "Pasas",
      description: "Has pasado de este perfil",
      variant: "default"
    });
  };

  const handleView = (id: string) => {
    toast({
      title: "Ver perfil",
      description: "Viendo el perfil completo",
      variant: "default"
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              <span className="homi-gradient-text">Encuentra compañeros</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Hemos seleccionado perfiles compatibles con tus preferencias y estilo de vida. 
              Explora los perfiles y conecta con potenciales compañeros de piso.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <ProfileSearchBar 
                onSearch={handleSearch}
                className="w-full" 
              />
            </div>
            <div className="lg:col-span-1 flex justify-end gap-2">
              {isMobile && (
                <div className="flex items-center mr-auto">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`rounded-l-full ${viewMode === 'grid' ? 'bg-muted' : ''}`}
                    onClick={() => setViewMode('grid')}
                  >
                    <LayoutGrid size={18} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`rounded-r-full ${viewMode === 'swipe' ? 'bg-muted' : ''}`}
                    onClick={() => setViewMode('swipe')}
                  >
                    <SwatchBook size={18} />
                  </Button>
                </div>
              )}
              
              <Popover open={openSearchFilters} onOpenChange={setOpenSearchFilters}>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2"
                    onClick={() => setOpenSearchFilters(!openSearchFilters)}
                  >
                    <Filter className="h-4 w-4" />
                    Filtros
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end" sideOffset={5}>
                  <div className="overflow-auto max-h-[90vh] max-w-[90vw] w-[800px]">
                    <MatchingFilters 
                      onApplyFilters={(filters) => {
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
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2"
                    onClick={() => setOpenPreferences(!openPreferences)}
                  >
                    <UserRound className="h-4 w-4" />
                    Preferencias
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end" sideOffset={5}>
                  <div className="overflow-auto max-h-[90vh] max-w-[90vw] w-[800px]">
                    <MatchingFilters 
                      onApplyFilters={(filters) => {
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
          </div>
          
          {filteredProfiles.length > 0 ? (
            <>
              {viewMode === 'swipe' && (
                <div className="mb-10">
                  <SwipeInterface 
                    profiles={filteredProfiles.map(profile => ({
                      id: profile.id.toString(),
                      name: profile.name,
                      age: profile.age,
                      location: profile.location,
                      bio: profile.bio,
                      imgUrl: profile.profileImage,
                      tags: profile.interests.map((interest, idx) => ({ id: idx + 1, name: interest })),
                      compatibility: profile.compatibility,
                      lifestyle: profile.lifestyle,
                      budget: profile.budget,
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
                No se encontraron perfiles que coincidan con tu búsqueda
              </p>
              <p className="mt-2">
                Intenta con otros términos o menos filtros específicos
              </p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default MatchingPage;
