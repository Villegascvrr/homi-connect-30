
import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import MatchCard from '@/components/matching/MatchCard';
import { Button } from '@/components/ui/button';
import { Filter, Users } from 'lucide-react';

const MatchingPage = () => {
  const [showFilters, setShowFilters] = useState(false);
  
  // Sample users data
  const [users, setUsers] = useState([
    {
      id: '1',
      name: 'Elena',
      age: 23,
      location: 'Madrid',
      bio: 'Estudiante de Arquitectura. Me gusta leer, el arte y las noches tranquilas. Busco piso cerca de la universidad.',
      imgUrl: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7',
      tags: [
        { id: 1, name: 'Ordenada' },
        { id: 2, name: 'Tranquila' },
        { id: 3, name: 'Estudiante' }
      ],
      compatibility: 87
    },
    {
      id: '2',
      name: 'Carlos',
      age: 25,
      location: 'Barcelona',
      bio: 'Desarrollador web, amante de la tecnología y los videojuegos. Busco un ambiente relajado donde pueda trabajar y descansar.',
      imgUrl: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952',
      tags: [
        { id: 1, name: 'Tecnología' },
        { id: 4, name: 'Deportista' },
        { id: 5, name: 'Profesional' }
      ],
      compatibility: 75
    },
    {
      id: '3',
      name: 'Laura',
      age: 22,
      location: 'Valencia',
      bio: 'Estudiante de Medicina. Me encanta cocinar y compartir momentos con amigos. Busco compañeros con intereses similares.',
      imgUrl: 'https://images.unsplash.com/photo-1472396961693-142e6e269027',
      tags: [
        { id: 6, name: 'Sociable' },
        { id: 7, name: 'Cocinera' },
        { id: 3, name: 'Estudiante' }
      ],
      compatibility: 92
    }
  ]);

  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const currentUser = users[currentUserIndex];

  const handleLike = (id: string) => {
    console.log('Liked:', id);
    if (currentUserIndex < users.length - 1) {
      setCurrentUserIndex(currentUserIndex + 1);
    }
  };

  const handlePass = (id: string) => {
    console.log('Passed:', id);
    if (currentUserIndex < users.length - 1) {
      setCurrentUserIndex(currentUserIndex + 1);
    }
  };

  const handleViewProfile = (id: string) => {
    console.log('View profile:', id);
    // Implement navigation to profile view
  };

  // Reset matching to start over
  const resetMatching = () => {
    setCurrentUserIndex(0);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-20 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl md:text-3xl font-bold">Encuentra compañeros</h1>
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="rounded-full"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter size={18} className="mr-2" /> Filtros
                </Button>
                <Button 
                  variant="default" 
                  size="sm" 
                  className="rounded-full bg-homi-purple hover:bg-homi-purple/90"
                >
                  <Users size={18} className="mr-2" /> Matches
                </Button>
              </div>
            </div>
            
            {/* Filters panel */}
            {showFilters && (
              <div className="glass-card p-6 mb-8 animate-slide-up">
                <h3 className="font-semibold mb-4">Filtros de búsqueda</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm mb-1">Ubicación</label>
                    <select className="w-full p-2 rounded-md border border-border bg-background">
                      <option>Todas las ciudades</option>
                      <option>Madrid</option>
                      <option>Barcelona</option>
                      <option>Valencia</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Rango de edad</label>
                    <select className="w-full p-2 rounded-md border border-border bg-background">
                      <option>Todas las edades</option>
                      <option>18-22</option>
                      <option>22-26</option>
                      <option>26-30</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Presupuesto</label>
                    <select className="w-full p-2 rounded-md border border-border bg-background">
                      <option>Cualquier presupuesto</option>
                      <option>€300-€500</option>
                      <option>€500-€700</option>
                      <option>€700-€1000</option>
                    </select>
                  </div>
                </div>
                <div className="mt-4 flex justify-end gap-2">
                  <Button variant="outline" size="sm" className="rounded-full">Limpiar</Button>
                  <Button 
                    size="sm" 
                    className="rounded-full bg-homi-purple hover:bg-homi-purple/90"
                  >
                    Aplicar
                  </Button>
                </div>
              </div>
            )}
            
            {/* Matching card */}
            <div className="flex justify-center items-center my-8">
              {currentUser ? (
                <MatchCard 
                  {...currentUser}
                  onLike={handleLike}
                  onPass={handlePass}
                  onView={handleViewProfile}
                />
              ) : (
                <div className="glass-card p-8 text-center">
                  <h3 className="text-xl font-semibold mb-4">No hay más perfiles por mostrar</h3>
                  <p className="text-muted-foreground mb-6">Has revisado todos los perfiles disponibles con tus filtros actuales.</p>
                  <Button 
                    className="rounded-full bg-homi-purple hover:bg-homi-purple/90"
                    onClick={resetMatching}
                  >
                    Volver a empezar
                  </Button>
                </div>
              )}
            </div>
            
            <div className="text-center mt-12">
              <p className="text-sm text-muted-foreground">
                Pulsa el botón del corazón para indicar interés o el botón X para pasar al siguiente perfil.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default MatchingPage;
