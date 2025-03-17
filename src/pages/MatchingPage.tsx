
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { MatchCard } from '@/components/matching/MatchCard';
import ProfileSearchBar from '@/components/profiles/ProfileSearchBar';
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
    interests: ["lectura", "viajes", "música"]
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
    interests: ["tecnología", "gaming", "deportes"]
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
    interests: ["arte", "fotografía", "viajes"]
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
    interests: ["deporte", "lectura", "música"]
  }
];

const MatchingPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProfiles, setFilteredProfiles] = useState(mockProfiles);
  const { toast } = useToast();

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredProfiles(mockProfiles);
      return;
    }
    
    const lowerCaseQuery = query.toLowerCase();
    const results = mockProfiles.filter(profile => 
      profile.name.toLowerCase().includes(lowerCaseQuery) || 
      profile.username.toLowerCase().includes(lowerCaseQuery)
    );
    
    setFilteredProfiles(results);
    
    toast({
      title: `${results.length} perfiles encontrados`,
      description: results.length > 0 
        ? "Se han encontrado perfiles que coinciden con tu búsqueda" 
        : "No se encontraron perfiles que coincidan con tu búsqueda",
      variant: results.length > 0 ? "default" : "destructive"
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
          
          <div className="mb-8">
            <ProfileSearchBar 
              onSearch={handleSearch}
              className="max-w-xl mx-auto" 
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProfiles.length > 0 ? (
              filteredProfiles.map(profile => (
                <MatchCard key={profile.id} profile={profile} />
              ))
            ) : (
              <div className="col-span-full text-center py-16">
                <p className="text-xl text-muted-foreground">
                  No se encontraron perfiles que coincidan con tu búsqueda
                </p>
                <p className="mt-2">
                  Intenta con otros términos o menos específicos
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default MatchingPage;
