
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import MatchCard from '@/components/matching/MatchCard';
import ProfileSearchBar from '@/components/profiles/ProfileSearchBar';
import MatchingFilters from '@/components/matching/MatchingFilters';
import { useToast } from '@/hooks/use-toast';

// Mockup data for profile cards
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

// Convert mock profiles to expected format for MatchCard
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
    // Add empty handler functions
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

const MatchingPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<FilterValues | null>(null);
  const [filteredProfiles, setFilteredProfiles] = useState(mockProfiles);
  const { toast } = useToast();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    applyFiltersAndSearch(query, activeFilters);
  };

  const handleApplyFilters = (filters: FilterValues) => {
    setActiveFilters(filters);
    applyFiltersAndSearch(searchQuery, filters);
    
    // Mostrar toast con resumen de filtros aplicados
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
    
    // Apply text search first
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
    
    // Then apply filters if any are active
    if (filters) {
      // Ubicación
      if (filters.ubicacion) {
        results = results.filter(profile => profile.location === filters.ubicacion);
      }
      
      // Presupuesto
      if (filters.presupuesto) {
        const [min, max] = filters.presupuesto;
        results = results.filter(profile => 
          profile.budget && 
          profile.budget.min <= max && 
          profile.budget.max >= min
        );
      }
      
      // Rango de edad
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
      
      // Estilo de vida
      if (filters.estiloVida && filters.estiloVida.length > 0) {
        // Simulamos el filtrado de estilo de vida
        // En datos reales, esto dependería de cómo están estructurados los datos
        const estiloVidaTerms = filters.estiloVida.map(ev => ev.toLowerCase());
        results = results.filter(profile => {
          // Verificamos si alguna propiedad del perfil coincide con los estilos seleccionados
          const profileLifestyle = profile.lifestyle || {};
          const hasMatchingLifestyle = 
            (estiloVidaTerms.includes('ordenado') && profileLifestyle.cleanliness === "Muy ordenada") ||
            (estiloVidaTerms.includes('tranquilo') && profileLifestyle.noise === "Tranquila") ||
            (estiloVidaTerms.includes('nocturno') && profileLifestyle.schedule === "nocturno") ||
            (estiloVidaTerms.includes('madrugador') && profileLifestyle.schedule === "diurno") ||
            (estiloVidaTerms.includes('no-fumador') && profileLifestyle.smoking === "No");
          
          return hasMatchingLifestyle;
        });
      }
      
      // Intereses
      if (filters.intereses && filters.intereses.length > 0) {
        results = results.filter(profile => 
          filters.intereses!.some(interest => 
            profile.interests.includes(interest)
          )
        );
      }
      
      // Nivel de limpieza
      if (filters.nivelLimpieza) {
        results = results.filter(profile => {
          if (filters.nivelLimpieza === 'alta') {
            return profile.lifestyle && profile.lifestyle.cleanliness === "Muy ordenada";
          } else if (filters.nivelLimpieza === 'media') {
            return profile.lifestyle && profile.lifestyle.cleanliness === "Normal";
          } else {
            return true; // Si es baja, aceptamos cualquier nivel
          }
        });
      }
      
      // Nivel de ruido
      if (filters.nivelRuido) {
        results = results.filter(profile => {
          if (filters.nivelRuido === 'bajo') {
            return profile.lifestyle && profile.lifestyle.noise === "Tranquila";
          } else if (filters.nivelRuido === 'moderado') {
            return profile.lifestyle && profile.lifestyle.noise === "Normal";
          } else {
            return profile.lifestyle && profile.lifestyle.noise === "Sociable";
          }
        });
      }
      
      // Horario habitual
      if (filters.horarioHabitual) {
        results = results.filter(profile => {
          if (filters.horarioHabitual === 'madrugador') {
            return profile.lifestyle && profile.lifestyle.schedule === "diurno";
          } else if (filters.horarioHabitual === 'nocturno') {
            return profile.lifestyle && profile.lifestyle.schedule === "nocturno";
          } else {
            return profile.lifestyle && profile.lifestyle.schedule === "flexible";
          }
        });
      }
      
      // Invitados
      if (filters.invitados) {
        results = results.filter(profile => {
          if (filters.invitados === 'frecuente') {
            return profile.lifestyle && profile.lifestyle.guests === "Frecuentemente";
          } else if (filters.invitados === 'ocasional') {
            return profile.lifestyle && profile.lifestyle.guests === "Ocasionalmente";
          } else {
            return profile.lifestyle && profile.lifestyle.guests === "Rara vez";
          }
        });
      }
      
      // Fumar
      if (filters.fumar) {
        results = results.filter(profile => {
          if (filters.fumar === 'no') {
            return profile.lifestyle && profile.lifestyle.smoking === "No";
          } else {
            return profile.lifestyle && profile.lifestyle.smoking === "Sí";
          }
        });
      }
      
      // Mascotas (asumimos que todos aceptan mascotas en este ejemplo)
      // En un caso real, necesitaríamos datos específicos sobre mascotas
    }
    
    setFilteredProfiles(results);
    
    // Solo mostrar el toast de resultados cuando cambian los filtros, no en la carga inicial
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
            <div className="lg:col-span-3">
              <ProfileSearchBar 
                onSearch={handleSearch}
                className="w-full" 
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <MatchingFilters 
                onApplyFilters={handleApplyFilters}
                onClearFilters={handleClearFilters}
                className="w-full"
              />
            </div>
            
            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProfiles.length > 0 ? (
                  filteredProfiles.map(profile => {
                    const cardProps = formatProfileForMatchCard(profile);
                    return (
                      <MatchCard 
                        key={profile.id}
                        {...cardProps}
                        onLike={handleLike}
                        onPass={handlePass}
                        onView={handleView}
                      />
                    );
                  })
                ) : (
                  <div className="col-span-full text-center py-16">
                    <p className="text-xl text-muted-foreground">
                      No se encontraron perfiles que coincidan con tu búsqueda
                    </p>
                    <p className="mt-2">
                      Intenta con otros términos o menos filtros específicos
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default MatchingPage;
