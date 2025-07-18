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
import { useProfiles } from '@/hooks/use-profiles';
import type { Profile } from '@/hooks/use-profiles';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Filter, UserRound, LayoutGrid, SwatchBook, Heart, Users, Settings, Crown } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Link, useNavigate } from 'react-router-dom';
import { useMatches } from '@/hooks/use-matches';
import DemoBanner from '@/components/layout/DemoBanner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useSwipes } from '@/hooks/use-swipes';

const formatProfileForMatchCard = (profile: Profile) => {
  const tags = profile?.interests?.map((interest: string, index: number) => ({
    id: index + 1,
    name: interest
  }));
  const { budgetMin, budgetMax } = parseBudget(profile.lifestyle?.budget || "");
  return {
    id: profile.id.toString(),
    name: profile.first_name + " "+ profile.last_name,
    age: Number(profile.edad),
    location: profile.location,
    bio: profile.bio,
    imgUrl: profile.profile_image,
    tags: tags && tags.length > 0 ? tags : [{
      id: 1,
      name: "No se encontraron intereses"
    }],
    compatibility: profile.compatibility,
    lifestyle: {
      cleanliness: profile.lifestyle?.cleanliness || "",
      noise: profile.lifestyle?.noise || "",
      schedule: profile.lifestyle?.schedule || "",
      guests: profile.lifestyle?.guests || "",
      smoking: profile.lifestyle?.smoking || "",
    },
    budget: profile.lifestyle.budget,
    sevilla_zona: (profile.lifestyle.sevilla_zonas || []).join(", "),
    roommatesNeeded: profile.companeros_count,
    has_apartment: profile.has_apartment,
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
  buscaPiso?: string;
  city_zone?: string;
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

interface MatchingPageProps {
  isPreview?: boolean;
}

const MatchingPage = ({ isPreview = false }: MatchingPageProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<FilterValues | null>(null);
  const [filteredProfiles, setFilteredProfiles] = useState<any[]>([]);
  const [originalFilteredProfiles, setOriginalFilteredProfiles] = useState<Profile[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'swipe'>('grid');
  const [activeTab, setActiveTab] = useState<'discover' | 'matches'>('discover');
  const { toast } = useToast();
  const [openSearchFilters, setOpenSearchFilters] = useState(false);
  const [openPreferences, setOpenPreferences] = useState(false);
  const isMobile = useIsMobile();
  const { data: profiles, isLoading, error, refetch } = useProfiles(user?.id);
  const { data: matches, isLoading: matchesLoading, error: matchesError, refetch: refetchMatches } = useMatches(user?.id);
  const hasProfileCompleted = user ? user?.completed : true;
  
  const [removedProfiles, setRemovedProfiles] = useState<Set<string>>(new Set());
  const [ availableProfiles, setAvailableProfiles ]= useState<any[]>([]);
  const { hasReachedDailyLimit, checkDailyLimit, updateDailyLimitAfterAction } = useSwipes(user?.id);
  const isSuscriptor = user?.is_suscriptor;
  
  const [orderedProfiles, setOrderedProfiles] = useState<any[]>([]);

  React.useEffect(() => {
    if (profiles) {
      setFilteredProfiles(profiles);
      setOriginalFilteredProfiles(profiles);
    }
  }, [profiles]);

  React.useEffect(() => {
    if (filteredProfiles.length === 0) {
      refetch();
    }
  }, [filteredProfiles, refetch]);

  React.useEffect(() => {
    if (isMobile) {
      setViewMode('swipe');
    } else {
      setViewMode('grid');
    }
  }, [isMobile]);

  React.useEffect(() => {
    checkDailyLimit();
  }, [checkDailyLimit]);

  React.useEffect(() => {
    const fetchAndOrderProfiles = async () => {
      if (!filteredProfiles) return;
      if (!user?.id) {
        setOrderedProfiles(filteredProfiles);
        return;
      }
      // 1. Obtener los IDs de perfiles que han dado match al usuario
      const { data: inverseMatches } = await supabase
        .from('profile_matches')
        .select('profile_id')
        .eq('target_profile_id', user.id);
      // 2. Obtener los IDs de perfiles descartados por el usuario
      const { data: discards } = await supabase
        .from('profile_discards')
        .select('target_profile_id')
        .eq('profile_id', user.id);
      const matchedProfileIds = inverseMatches?.map(m => m.profile_id) || [];
      const discardedProfileIds = discards?.map(d => d.target_profile_id) || [];
      // 3. Filtrar los matches inversos que NO están en discards
      const prioritizedProfiles = filteredProfiles.filter(
        p => matchedProfileIds.includes(p.id) && !discardedProfileIds.includes(p.id)
      );
      // 4. El resto de perfiles
      const otherProfiles = filteredProfiles.filter(
        p => !prioritizedProfiles.includes(p)
      );
      setOrderedProfiles([...prioritizedProfiles, ...otherProfiles]);
    };
    fetchAndOrderProfiles();
  }, [user, filteredProfiles]);

  const handleAction = (action: () => void, message: string) => {
    if (isPreview) {
      toast({
        title: "Demostración",
        description: "Esta es una vista previa. Regístrate para utilizar esta función.",
        variant: "default",
        duration: 1500
      });
    } else {
      action();
    }
  };  

  const handleGoToProfile = () => {
    navigate('/profile/edit');
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
          variant: "default",
          duration: 1500
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
          variant: "default",
          duration: 1500
        });
      },
      "Función de limpiar filtros"
    );
  };

  const applyFiltersAndSearch = (query: string, filters: FilterValues | null) => {
    if (!profiles) return;

    let results = [...profiles];

    // Aplicar búsqueda por texto
    if (query && false) {
      const searchLower = query.toLowerCase();
      results = results.filter(profile =>
        profile.first_name.toLowerCase().includes(searchLower) ||
        profile.location.toLowerCase().includes(searchLower) ||
        profile.bio.toLowerCase().includes(searchLower)
      );
    }
    
    // Aplicar filtros
    if (filters) {
      results = results.filter(profile => {
        let match = true;

        // Filtrar por presupuesto
        if (filters.presupuesto) {
          const [min, max] = filters.presupuesto;
          
          const budget = profile.lifestyle.budget;
          const { budgetMin, budgetMax } = parseBudget(budget);
          match = match && (!budgetMin ||  budgetMin >= min) && (!budgetMax || budgetMax <= max);
        }
        
        // Filtrar por ubicación
        if (filters.ubicacion) {
          match = match && (profile.city && profile.city.toLowerCase() === filters.ubicacion.toLowerCase());
        }
        if (filters.city_zone && filters.ubicacion === 'Sevilla') {
          match = match && (profile.city_zone && profile.city_zone.toLowerCase() === filters.city_zone.toLowerCase());
        }

        // Filtrar por busca piso
        if (filters.buscaPiso) {
          match = match && (( profile.has_apartment !== (filters.buscaPiso === 'Si')) || 
          filters.buscaPiso === 'Cualquiera');
        }

        if(filters.rangoEdad){
          const [min, max] = filters.rangoEdad.split('-').map(Number);
          match = match && (Number(profile.edad) >= min && Number(profile.edad) <= max);
        }
        // ... resto de la lógica de filtros ...

        return match;
      });
    }

    setFilteredProfiles(results);
  };

  const handleLike = (id: string) => {
    if(!user){
      navigate('/signin');
      return;
    }
    handleAction(
      async () => {
        try{
          // Primero obtenemos el valor actual
          const { data: currentData } = await supabase
            .from('profiles')
            .select('skips')
            .eq('id', user?.id)
            .single();
          
          const currentSkips = currentData?.skips || 0;
          
          // Luego actualizamos con el nuevo valor
          const { data: updateData, error: updateError } = await supabase
            .from('profiles')
            .update({ skips: currentSkips + 1 })
            .eq('id', user?.id)
        } catch (error) {
          console.error('Error updating skips:', error);
        }
        
        //insertar en la tabla profile_matches
        try {
          const { data: insertData, error: insertError } = await supabase
            .from('profile_matches')
            .insert({
              profile_id: user?.id,
              target_profile_id: id
            })
          // Comprobar límite tras la inserción
          const reached = await updateDailyLimitAfterAction();
          if (reached && !isSuscriptor) return;
        } catch (error) {
          console.error('Error inserting in profile_matches:', error);
        }
        
        //buscar en la tabla profile_matches si existe un match con el perfil target_profile_id
        const { data: matchData, error: matchError } = await supabase
          .from('profile_matches')
          .select('*')
          .eq('target_profile_id', user?.id)
          .eq('profile_id', id)
          

        //quitar el perfil de la lista de perfiles disponibles
        const newFilteredProfiles = filteredProfiles.filter(profile => profile.id !== id);
        setFilteredProfiles(newFilteredProfiles);

        if (matchData.length > 0) {
          //insertar en la tabla matches
          try {
            const { data: insertData, error: insertError } = await supabase
              .from('matches')
              .insert({
                profile_one_id: user?.id,
                profile_two_id: id
              })
          } catch (error) {
            console.error('Error inserting in matches:', error);
          }

          toast({
            title: "¡Nuevo match!",
            description: "Has coincidido con este perfil",
            variant: "default",
            duration: 1500
          });
        }
        refetchMatches();
        if(newFilteredProfiles.length === 0){refetch();}
      },
      "¡Nuevo match!"
    );
  };

  const handlePass = (id: string) => {
    if(!user){
      navigate('/signin');
      return;
    }
    handleAction(
      async () => {
        const newFilteredProfiles = filteredProfiles.filter(profile => profile.id !== id);
        setRemovedProfiles(removedProfiles.add(filteredProfiles.find(profile => profile.id === id)))
        setFilteredProfiles(newFilteredProfiles);
        // Insertar en la tabla profile_discards
        try {
          const { data: insertData, error: insertError } = await supabase
            .from('profile_discards')
            .insert({
              profile_id: user?.id,
              target_profile_id: id
            })
          // Comprobar límite tras la inserción
          const reached = await updateDailyLimitAfterAction();
          if (reached && !isSuscriptor) return;
        } catch (error) {
          console.error('Error inserting in profile_discards:', error);
        }
        try{
          // Primero obtenemos el valor actual
          const { data: currentData } = await supabase
            .from('profiles')
            .select('skips')
            .eq('id', user?.id)
            .single();
          
          const currentSkips = currentData?.skips || 0;
          
          // Luego actualizamos con el nuevo valor
          const { data: updateData, error: updateError } = await supabase
            .from('profiles')
            .update({ skips: currentSkips + 1 })
            .eq('id', user?.id)
        } catch (error) {
          console.error('Error updating skips:', error);
        }

        if(newFilteredProfiles.length === 0){refetch();}

        toast({
          title: "Pasas",
          description: "Has pasado de este perfil",
          variant: "default",
          duration: 1500
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
          variant: "default",
          duration: 1500
        });
      },
      "Función de ver perfil"
    );
  };

  const handleUnmatch = (id: string) => {
    handleAction(
      async () => {
        console.log("deshacer match", id);
        //borrar de la tabla matches
        try {
          const { data: deleteData, error: deleteError } = await supabase
            .from('matches')
            .delete()
            .eq('id', id)
            .select();
          
          if (deleteError) {
            console.error('Error deleting match:', deleteError);
            return;
          }

          // deleteData contendrá la fila eliminada
          const deletedMatch = deleteData[0];
          console.log("Match eliminado:", deletedMatch);
          
          // Ahora podemos usar deletedMatch.profile_one_id y deletedMatch.profile_two_id
          // para las siguientes operaciones
            
          //borrar de la tabla profile_matches
          try {
            const { data: deleteData, error: deleteError } = await supabase
              .from('profile_matches')
              .delete()
              .eq('profile_id', deletedMatch.profile_one_id)
              .eq('target_profile_id', deletedMatch.profile_two_id);
          } catch (error) {
            console.error('Error deleting profile_matches:', error);
          }

          try {
            const { data: deleteData, error: deleteError } = await supabase
              .from('profile_matches')
              .delete()
              .eq('profile_id', deletedMatch.profile_two_id)
              .eq('target_profile_id', deletedMatch.profile_one_id);
          } catch (error) {
            console.error('Error deleting profile_matches:', error);
          }
        } catch (error) {
          console.error('Error deleting match:', error);
        }
        refetchMatches();
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
          variant: "default",
          duration: 1500
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
          variant: "default",
          duration: 1500
        });
      },
      "Función de ver perfil completo"
    );
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Cargando perfiles...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center min-h-screen">Error al cargar los perfiles</div>;
  }

  if (hasReachedDailyLimit && !isSuscriptor) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center py-16 px-4 max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-4">¡Has llegado al límite diario!</h1>
            <p className="text-muted-foreground mb-6">
              Has llegado a los swipes máximos diarios, puedes seguir hoy sin límites si te conviertes en un Homi: 
            </p>
            <Button 
              onClick={() => navigate('/precios')}
              className={`rounded-full bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 hover:from-yellow-500 hover:via-orange-500 hover:to-red-500 text-black font-bold`}
            >
              <Crown className="mr-2 h-4 w-4" />
              ¡Hazte Premium!
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if(filteredProfiles.length === 0){ refetch();}

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-0 pb-12 bg-transparent">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              <span className="homi-gradient-text">Encuentra compañeros</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl font-normal text-left">Explora los perfiles y conecta con potenciales compañeros de piso.</p>
          </div>
          
          <Tabs defaultValue="discover" value={activeTab} onValueChange={value => {setActiveTab(value as 'discover' | 'matches'); refetch(); refetchMatches()}} className="mb-4">
            <div className="flex justify-between items-center mb-6">
              <TabsList className="bg-muted/60">
                <TabsTrigger value="discover" className="flex items-center gap-2">
                  <Users size={16} />
                  <span className="hidden sm:inline">Descubrir</span>
                </TabsTrigger>
                <TabsTrigger value="matches" className="flex items-center gap-2">
                  <Heart size={16} />
                  <span className="hidden sm:inline">Mis Matches</span>
                  {matches && matches?.length > 0 && (
                    <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-homi-purple/20">
                      {matches.length}
                    </span>
                  )}
                </TabsTrigger>
              </TabsList>
              
              {activeTab === 'discover' && (
                <div className="flex gap-2">
                  {isMobile && false && (
                    <div className="flex items-center mr-auto">
                      <Button variant="ghost" size="sm" className={`rounded-l-full ${viewMode === 'grid' ? 'bg-muted' : ''}`} onClick={() => setViewMode('grid')}>
                        <LayoutGrid size={16} />
                      </Button>
                      <Button variant="ghost" size="sm" className={`rounded-r-full ${viewMode === 'swipe' ? 'bg-muted' : ''}`} onClick={() => setViewMode('swipe')}>
                        <SwatchBook size={16} />
                      </Button>
                    </div>
                  )}
                  
                  <Popover open={openSearchFilters} onOpenChange={setOpenSearchFilters}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="md" className="flex items-center gap-1.5" onClick={() => setOpenSearchFilters(!openSearchFilters)}>
                        <Filter className="h-4 w-4" />
                        <span className="hidden sm:inline text-sm">Filtros</span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0 z-50" align="end" sideOffset={5} compact>
                      <div className="overflow-auto max-h-[80vh] max-w-[90vw] w-[500px] pb-3">
                        <MatchingFilters 
                          activeFilters={activeFilters}
                          onApplyFilters={filters => {
                            handleApplyFilters(filters);
                            setOpenSearchFilters(false);
                          }} 
                          onClearFilters={handleClearFilters} 
                          activeTab="filtros" 
                          className="w-full" 
                          isSuscriptor={isSuscriptor}
                        />
                      </div>
                    </PopoverContent>
                  </Popover>
                  
                  {/*<Popover open={openPreferences} onOpenChange={setOpenPreferences}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="md" className="flex items-center gap-1.5" onClick={() => setOpenPreferences(!openPreferences)}>
                        <Settings className="h-4 w-4" />
                        <span className="hidden sm:inline text-sm">Preferencias</span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0 z-50" align="end" sideOffset={5} compact>
                      <div className="overflow-auto max-h-[80vh] max-w-[90vw] w-[500px] pb-3">
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
                  </Popover>*/}
                </div>
              )}
            </div>
            
            {hasProfileCompleted && (<TabsContent value="discover" className="mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                {/*<div className="lg:col-span-2">
                  <ProfileSearchBar onSearch={handleSearch} className="w-full" />
                </div>*/}
                <div className="lg:col-span-1">
                  {/* Empty space for filters alignment */}
                </div>
              </div>
              
              {orderedProfiles.length > 0 ? (
                <>
                  {viewMode === 'swipe' && (
                    <div className="mb-6">
                      <SwipeInterface 
                        profiles={orderedProfiles.slice(0, 3).map(profile => ({
                          id: profile.id.toString(),
                          name: profile.name,
                          first_name: profile.first_name,
                          last_name: profile.last_name,
                          age: Number(profile.edad),
                          location: profile.location,
                          bio: profile.bio,
                          imgUrl: profile.profile_image,
                          tags: profile.interests ? profile.interests.map((interest, idx) => ({
                            id: idx + 1,
                            name: interest
                          })) : [{
                            id: 1,
                            name: "No se encontraron intereses"
                          }],
                          compatibility: profile.compatibility,
                          lifestyle: profile.lifestyle,
                          budget: profile.lifestyle.budget,
                          sevilla_zona: profile.lifestyle.sevilla_zonas?.join(", ") ,
                          has_apartment: profile.has_apartment,
                          companeros_count: profile.companeros_count
                        }))} 
                        onLike={handleLike} 
                        onPass={handlePass} 
                        onView={handleView} 
                        refetch={refetch}
                      />
                    </div>
                  )}
                  
                  {viewMode === 'grid' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {orderedProfiles.slice(0, 3).map(profile => {
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
            </TabsContent>)}

            {!hasProfileCompleted && (
              <TabsContent value="discover" className="mt-0">
                <div className="text-center py-16">
                  <p className="text-xl text-muted-foreground">
                    Por favor, completa tu perfil para poder explorar perfiles.
                  </p>
                  <Button size={isMobile ? "default" : "lg"} className="mt-4 rounded-full bg-gradient-to-r from-homi-purple to-homi-lightPurple hover:from-homi-lightPurple hover:to-homi-purple text-white font-bold shadow-lg shadow-purple-500/30 transform hover:scale-105 transition-all duration-300 w-full sm:w-auto" asChild>
                    <Link to="/profile/edit">Completar mi perfil</Link>
                  </Button>
                </div>
              </TabsContent>
            )}
            
            <TabsContent value="matches" className="mt-0">
              {matches && matches?.length > 0 ? (
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

const parseBudget = (budget: string) => {
  if (!budget) return { budgetMin: undefined, budgetMax: undefined };
  
  if (budget === "Más de 700€") {
    return { budgetMin: 700, budgetMax: undefined };
  }
  
  if (budget === "Menos de 200€") {
    return { budgetMin: undefined, budgetMax: 200 };
  }

  // Para casos como "200€ - 300€"
  const cleanBudget = budget.replace(/€/g, '').trim();
  const [min, max] = cleanBudget.split('-').map(num => parseInt(num.trim()));
  return { budgetMin: min, budgetMax: max };
};

export default MatchingPage;
