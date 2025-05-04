import React, { useState, useEffect } from 'react';
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
import { useMatching } from '@/hooks/use-matching';
import { useAuth } from '@/context/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';

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

interface MatchingPageProps {
  isPreview?: boolean;
}

const MatchingPage = ({ isPreview = false }: MatchingPageProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<FilterValues | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'swipe'>('grid');
  const [activeTab, setActiveTab] = useState<'discover' | 'matches'>('discover');
  const { toast } = useToast();
  const [openSearchFilters, setOpenSearchFilters] = useState(false);
  const [openPreferences, setOpenPreferences] = useState(false);
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const loading = false; // Removed isLoading property reference
  
  // Use real data from the useMatching hook
  const {
    potentialMatches,
    matches,
    isLoadingPotentials,
    isLoadingMatches,
    handleLike,
    handlePass,
    refetchPotentials,
    refetchMatches
  } = useMatching();
  
  // Filtered profiles state
  const [filteredProfiles, setFilteredProfiles] = useState(potentialMatches);
  
  // Update filtered profiles when potential matches change
  useEffect(() => {
    if (potentialMatches.length > 0) {
      setFilteredProfiles(potentialMatches);
    }
  }, [potentialMatches]);

  // Set appropriate view mode based on device
  useEffect(() => {
    if (isMobile) {
      setViewMode('swipe');
    } else {
      setViewMode('grid');
    }
  }, [isMobile]);
  
  // Handle search functionality
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setFilteredProfiles(potentialMatches);
      return;
    }
    
    const lowerCaseQuery = query.toLowerCase();
    const results = potentialMatches.filter(profile => 
      profile.name.toLowerCase().includes(lowerCaseQuery) || 
      profile.bio.toLowerCase().includes(lowerCaseQuery) || 
      profile.location.toLowerCase().includes(lowerCaseQuery)
    );
    
    setFilteredProfiles(results);
    
    toast({
      title: `${results.length} perfiles encontrados`,
      description: results.length > 0 ? 
        "Se han encontrado perfiles que coinciden con tu búsqueda" : 
        "No se encontraron perfiles que coincidan con tu búsqueda",
      variant: results.length > 0 ? "default" : "destructive"
    });
  };

  // Handle filter application
  const handleApplyFilters = (filters: FilterValues) => {
    setActiveFilters(filters);
    
    // Apply filters to potential matches
    let results = [...potentialMatches];
    
    if (filters.ubicacion) {
      results = results.filter(profile => 
        profile.location.toLowerCase() === filters.ubicacion?.toLowerCase()
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
    
    if (filters.intereses && filters.intereses.length > 0) {
      results = results.filter(profile => 
        profile.tags.some(tag => 
          filters.intereses?.includes(tag.name)
        )
      );
    }
    
    if (filters.nivelLimpieza && filters.nivelLimpieza !== '') {
      results = results.filter(profile => {
        if (!profile.lifestyle) return false;
        
        if (filters.nivelLimpieza === 'alta') {
          return profile.lifestyle.cleanliness === "Muy ordenada";
        } else if (filters.nivelLimpieza === 'media') {
          return profile.lifestyle.cleanliness === "Normal";
        }
        return true;
      });
    }
    
    if (filters.nivelRuido && filters.nivelRuido !== '') {
      results = results.filter(profile => {
        if (!profile.lifestyle) return false;
        
        if (filters.nivelRuido === 'bajo') {
          return profile.lifestyle.noise === "Tranquila";
        } else if (filters.nivelRuido === 'moderado') {
          return profile.lifestyle.noise === "Normal";
        } else if (filters.nivelRuido === 'alto') {
          return profile.lifestyle.noise === "Sociable";
        }
        return true;
      });
    }
    
    setFilteredProfiles(results);
    
    const filterCount = Object.values(filters).filter(
      value => value !== undefined && (Array.isArray(value) ? value.length > 0 : true)
    ).length;
    
    toast({
      title: `Filtros aplicados (${filterCount})`,
      description: filterCount > 0 ? 
        "Se han aplicado los filtros seleccionados" : 
        "No se han seleccionado filtros específicos",
      variant: "default"
    });
  };

  // Clear filters
  const handleClearFilters = () => {
    setActiveFilters(null);
    setFilteredProfiles(potentialMatches);
    
    toast({
      title: "Filtros eliminados",
      description: "Se han eliminado todos los filtros",
      variant: "default"
    });
  };
  
  // Handle match-related actions
  const handleView = (id: string) => {
    toast({
      title: "Ver perfil",
      description: "Viendo el perfil completo",
      variant: "default"
    });
  };

  const handleUnmatch = (id: string) => {
    toast({
      title: "Match eliminado",
      description: "Has eliminado este match",
      variant: "default"
    });
    // In a real implementation, call a service to remove the match
    refetchMatches();
  };

  const handleMessage = (id: string) => {
    toast({
      title: "Abrir chat",
      description: "Redirigiendo al chat con este usuario",
      variant: "default"
    });
    // In a real implementation, redirect to the chat page with this match
  };

  const handleViewProfile = (id: string) => {
    toast({
      title: "Ver perfil completo",
      description: "Viendo el perfil completo del usuario",
      variant: "default"
    });
    // In a real implementation, redirect to the profile view page
  };

  // Fix the refetchPotentials button handler
  const handleRefreshClick = () => {
    refetchPotentials();
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-0 pb-12 bg-transparent">
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-6">
              <span className="homi-gradient-text">Cargando perfiles...</span>
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="rounded-lg overflow-hidden border border-gray-200">
                  <Skeleton className="h-48 w-full" />
                  <div className="p-4 space-y-2">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <div className="flex flex-wrap gap-1 mt-2">
                      <Skeleton className="h-6 w-16 rounded-full" />
                      <Skeleton className="h-6 w-16 rounded-full" />
                      <Skeleton className="h-6 w-16 rounded-full" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

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
            <p className="text-muted-foreground max-w-2xl font-normal text-left">
              Explora los perfiles y conecta con potenciales compañeros de piso.
            </p>
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
                    <PopoverContent className="p-0 z-50" align="end" sideOffset={5}>
                      <div className="overflow-auto max-h-[80vh] max-w-[90vw] w-[500px] pb-3">
                        <MatchingFilters 
                          onApplyFilters={handleApplyFilters} 
                          onClearFilters={handleClearFilters} 
                          activeTab="filtros" 
                          className="w-full" 
                        />
                      </div>
                    </PopoverContent>
                  </Popover>
                  
                  <Popover open={openPreferences} onOpenChange={setOpenPreferences}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="md" className="flex items-center gap-1.5" onClick={() => setOpenPreferences(!openPreferences)}>
                        <Settings className="h-4 w-4" />
                        <span className="hidden sm:inline text-sm">Preferencias</span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0 z-50" align="end" sideOffset={5}>
                      <div className="overflow-auto max-h-[80vh] max-w-[90vw] w-[500px] pb-3">
                        <MatchingFilters 
                          onApplyFilters={handleApplyFilters} 
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
              
              {isLoadingPotentials ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array(6).fill(0).map((_, i) => (
                    <div key={i} className="rounded-lg overflow-hidden border border-gray-200">
                      <Skeleton className="h-48 w-full" />
                      <div className="p-4 space-y-2">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <div className="flex flex-wrap gap-1 mt-2">
                          <Skeleton className="h-6 w-16 rounded-full" />
                          <Skeleton className="h-6 w-16 rounded-full" />
                          <Skeleton className="h-6 w-16 rounded-full" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredProfiles.length > 0 ? (
                <>
                  {viewMode === 'swipe' && (
                    <div className="mb-6">
                      <SwipeInterface 
                        profiles={filteredProfiles} 
                        onLike={handleLike} 
                        onPass={handlePass} 
                        onView={handleView} 
                      />
                    </div>
                  )}
                  
                  {viewMode === 'grid' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredProfiles.map(profile => (
                        <MatchCard 
                          key={profile.id} 
                          {...profile} 
                          onLike={handleLike} 
                          onPass={handlePass} 
                          onView={handleView} 
                          compact={isMobile} 
                        />
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-16">
                  <p className="text-xl text-muted-foreground">
                    No se encontraron perfiles que coincidan con tus criterios.
                  </p>
                  <Button 
                    onClick={handleRefreshClick}
                    className="mt-4 rounded-full bg-homi-purple hover:bg-homi-purple/90"
                  >
                    Refrescar perfiles
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="matches" className="mt-0">
              {isLoadingMatches ? (
                <div className="space-y-4">
                  {Array(3).fill(0).map((_, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 border rounded-lg">
                      <Skeleton className="h-16 w-16 rounded-full" />
                      <div className="flex-1">
                        <Skeleton className="h-5 w-1/3 mb-2" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : matches.length > 0 ? (
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
