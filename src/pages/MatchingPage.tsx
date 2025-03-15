import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import MatchCard from '@/components/matching/MatchCard';
import { Button } from '@/components/ui/button';
import { Filter, Users, Sliders, MapPin, Calendar, DollarSign } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

// User profile interface
interface UserProfile {
  id: string;
  name: string;
  age: number;
  location: string;
  bio: string;
  imgUrl: string;
  tags: { id: number; name: string }[];
  compatibility: number;
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
}

const MatchingPage = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [budgetRange, setBudgetRange] = useState([300, 800]);
  
  // Sample users data with additional profiles
  const [users, setUsers] = useState<UserProfile[]>([
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
      compatibility: 87,
      lifestyle: {
        cleanliness: 'Alta',
        noise: 'Bajo',
        schedule: 'Madrugadora',
        guests: 'Ocasionalmente',
        smoking: 'No'
      },
      budget: {
        min: 400,
        max: 600
      },
      moveInDate: 'Septiembre 2023'
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
      compatibility: 75,
      lifestyle: {
        cleanliness: 'Media',
        noise: 'Medio',
        schedule: 'Nocturno',
        guests: 'Frecuente',
        smoking: 'No'
      },
      budget: {
        min: 500,
        max: 800
      },
      moveInDate: 'Octubre 2023'
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
      compatibility: 92,
      lifestyle: {
        cleanliness: 'Alta',
        noise: 'Medio',
        schedule: 'Flexible',
        guests: 'Ocasionalmente',
        smoking: 'No'
      },
      budget: {
        min: 350,
        max: 550
      },
      moveInDate: 'Septiembre 2023'
    },
    {
      id: '4',
      name: 'Miguel',
      age: 26,
      location: 'Madrid',
      bio: 'Ingeniero y músico aficionado. Busco un ambiente tranquilo entre semana pero no me importa algo de movimiento los fines de semana.',
      imgUrl: 'https://images.unsplash.com/photo-1545167622-3a6ac756afa4',
      tags: [
        { id: 8, name: 'Músico' },
        { id: 9, name: 'Profesional' },
        { id: 10, name: 'Organizado' }
      ],
      compatibility: 83,
      lifestyle: {
        cleanliness: 'Alta',
        noise: 'Medio',
        schedule: 'Regular',
        guests: 'Fines de semana',
        smoking: 'Exterior'
      },
      budget: {
        min: 500,
        max: 700
      },
      moveInDate: 'Noviembre 2023'
    },
    {
      id: '5',
      name: 'Ana',
      age: 24,
      location: 'Sevilla',
      bio: 'Estudiante de postgrado en Bellas Artes. Creativa, tranquila y amante de la naturaleza. Busco compartir piso con personas respetuosas.',
      imgUrl: 'https://images.unsplash.com/photo-1601412436009-d964bd02edbc',
      tags: [
        { id: 11, name: 'Artista' },
        { id: 12, name: 'Ecológica' },
        { id: 13, name: 'Lectora' }
      ],
      compatibility: 78,
      lifestyle: {
        cleanliness: 'Media',
        noise: 'Bajo',
        schedule: 'Flexible',
        guests: 'Raramente',
        smoking: 'No'
      },
      budget: {
        min: 350,
        max: 550
      },
      moveInDate: 'Octubre 2023'
    },
    {
      id: '6',
      name: 'Javier',
      age: 27,
      location: 'Barcelona',
      bio: 'Emprendedor digital y aficionado al deporte. Busco compañeros activos y con mentalidad positiva cerca del centro.',
      imgUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d',
      tags: [
        { id: 14, name: 'Emprendedor' },
        { id: 15, name: 'Deportista' },
        { id: 16, name: 'Madrugador' }
      ],
      compatibility: 90,
      lifestyle: {
        cleanliness: 'Alta',
        noise: 'Medio',
        schedule: 'Madrugador',
        guests: 'Ocasionalmente',
        smoking: 'No'
      },
      budget: {
        min: 600,
        max: 900
      },
      moveInDate: 'Septiembre 2023'
    },
    {
      id: '7',
      name: 'Lucía',
      age: 23,
      location: 'Valencia',
      bio: 'Estudiante de último año de Psicología. Sociable pero respetuosa con los espacios personales. Me encantan los animales.',
      imgUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956',
      tags: [
        { id: 17, name: 'Amante de mascotas' },
        { id: 18, name: 'Estudiante' },
        { id: 19, name: 'Sociable' }
      ],
      compatibility: 85,
      lifestyle: {
        cleanliness: 'Media',
        noise: 'Medio',
        schedule: 'Nocturna',
        guests: 'Ocasionalmente',
        smoking: 'Exterior'
      },
      budget: {
        min: 400,
        max: 600
      },
      moveInDate: 'Octubre 2023'
    }
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const profilesPerPage = 6;
  
  const indexOfLastProfile = currentPage * profilesPerPage;
  const indexOfFirstProfile = indexOfLastProfile - profilesPerPage;
  const currentProfiles = users.slice(indexOfFirstProfile, indexOfLastProfile);
  const totalPages = Math.ceil(users.length / profilesPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleLike = (id: string) => {
    console.log('Liked:', id);
  };

  const handlePass = (id: string) => {
    console.log('Passed:', id);
  };

  const handleViewProfile = (id: string) => {
    console.log('View profile:', id);
    window.location.href = `/profile`;
  };

  // User preference settings
  const [userPreferences, setUserPreferences] = useState({
    lifestyle: {
      cleanliness: 'Alta',
      noise: 'Bajo',
      schedule: 'Flexible',
      guests: 'Ocasionalmente',
      smoking: 'No'
    },
    interests: ['Música', 'Cine', 'Lectura', 'Deportes'],
    locationPreference: 'Madrid',
    budgetRange: [400, 700]
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-20 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl md:text-3xl font-bold">Encuentra compañeros</h1>
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="rounded-full"
                  onClick={() => {
                    setShowFilters(!showFilters);
                    setShowPreferences(false);
                  }}
                >
                  <Filter size={18} className="mr-2" /> Filtros
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="rounded-full"
                  onClick={() => {
                    setShowPreferences(!showPreferences);
                    setShowFilters(false);
                  }}
                >
                  <Sliders size={18} className="mr-2" /> Preferencias
                </Button>
                <Button 
                  variant="default" 
                  size="sm" 
                  className="rounded-full bg-homi-purple hover:bg-homi-purple/90"
                  onClick={() => window.location.href = '/chat'}
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
                    <div className="relative">
                      <select className="w-full p-2 rounded-md border border-border bg-background pl-9">
                        <option>Todas las ciudades</option>
                        <option>Madrid</option>
                        <option>Barcelona</option>
                        <option>Valencia</option>
                      </select>
                      <MapPin size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Rango de edad</label>
                    <div className="relative">
                      <select className="w-full p-2 rounded-md border border-border bg-background pl-9">
                        <option>Todas las edades</option>
                        <option>18-22</option>
                        <option>22-26</option>
                        <option>26-30</option>
                      </select>
                      <Users size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Fecha de mudanza</label>
                    <div className="relative">
                      <select className="w-full p-2 rounded-md border border-border bg-background pl-9">
                        <option>Cualquier fecha</option>
                        <option>Próximo mes</option>
                        <option>2-3 meses</option>
                        <option>+3 meses</option>
                      </select>
                      <Calendar size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                    </div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <label className="block text-sm mb-1">Presupuesto: €{budgetRange[0]} - €{budgetRange[1]}</label>
                  <div className="px-2 pt-2">
                    <Slider 
                      defaultValue={budgetRange} 
                      max={1000} 
                      min={200} 
                      step={50} 
                      onValueChange={(value) => setBudgetRange(value as number[])}
                    />
                  </div>
                </div>
                
                <div className="mt-4">
                  <label className="block text-sm mb-1">Estilo de vida</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {['Ordenado', 'Tranquilo', 'Sociable', 'Deportista', 'Nocturno', 'Madrugador', 'No fumador', 'Vegano'].map(tag => (
                      <label key={tag} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-muted border border-border cursor-pointer hover:bg-homi-ultraLightPurple">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm">{tag}</span>
                      </label>
                    ))}
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
            
            {/* Preferences panel */}
            {showPreferences && (
              <div className="glass-card p-6 mb-8 animate-slide-up">
                <h3 className="font-semibold mb-4">Mis preferencias de convivencia</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Configura tus preferencias para mejorar tus coincidencias. Cuanta más información añadas, más precisas serán las recomendaciones.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-2">Estilo de vida</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm mb-1">Nivel de limpieza</label>
                        <select className="w-full p-2 rounded-md border border-border bg-background">
                          <option>Alta - Me gusta tener todo muy limpio</option>
                          <option>Media - Mantengo las áreas comunes en orden</option>
                          <option>Baja - No soy muy estricto con la limpieza</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm mb-1">Nivel de ruido</label>
                        <select className="w-full p-2 rounded-md border border-border bg-background">
                          <option>Bajo - Prefiero ambiente tranquilo</option>
                          <option>Medio - No me importa algo de ruido</option>
                          <option>Alto - No me molesta el ruido</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm mb-1">Horario habitual</label>
                        <select className="w-full p-2 rounded-md border border-border bg-background">
                          <option>Madrugador - Me levanto temprano</option>
                          <option>Flexible - No tengo un horario fijo</option>
                          <option>Nocturno - Suelo acostarme tarde</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Preferencias de vivienda</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm mb-1">Invitados</label>
                        <select className="w-full p-2 rounded-md border border-border bg-background">
                          <option>Frecuente - Me gusta invitar amigos</option>
                          <option>Ocasionalmente - De vez en cuando</option>
                          <option>Raramente - Prefiero no tener invitados</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm mb-1">Fumar</label>
                        <select className="w-full p-2 rounded-md border border-border bg-background">
                          <option>No - Prefiero ambientes sin humo</option>
                          <option>Exterior - Solo en balcón o terraza</option>
                          <option>Sí - No me importa que se fume</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm mb-1">Mascotas</label>
                        <select className="w-full p-2 rounded-md border border-border bg-background">
                          <option>Me encantan - No hay problema</option>
                          <option>Algunas - Depende del animal</option>
                          <option>Ninguna - Prefiero sin mascotas</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <label className="block text-sm mb-1">Presupuesto: €{userPreferences.budgetRange[0]} - €{userPreferences.budgetRange[1]}</label>
                  <div className="px-2 pt-2">
                    <Slider 
                      defaultValue={userPreferences.budgetRange}
                      max={1000} 
                      min={200} 
                      step={50}
                    />
                  </div>
                </div>
                
                <div className="mt-6">
                  <h4 className="font-medium mb-2">Intereses personales</h4>
                  <div className="flex flex-wrap gap-2">
                    {['Música', 'Cine', 'Lectura', 'Deportes', 'Cocina', 'Videojuegos', 'Arte', 'Viajes', 'Tecnología', 'Fotografía'].map(interest => (
                      <label key={interest} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-muted border border-border cursor-pointer hover:bg-homi-ultraLightPurple">
                        <input 
                          type="checkbox" 
                          className="rounded" 
                          defaultChecked={userPreferences.interests.includes(interest)} 
                        />
                        <span className="text-sm">{interest}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end gap-2">
                  <Button variant="outline" size="sm" className="rounded-full">Restaurar</Button>
                  <Button 
                    size="sm" 
                    className="rounded-full bg-homi-purple hover:bg-homi-purple/90"
                  >
                    Guardar preferencias
                  </Button>
                </div>
              </div>
            )}
            
            {/* Matching profiles grid */}
            <div className="mb-8">
              <h2 className="text-xl font-medium mb-6">Perfiles compatibles con tus preferencias</h2>
              
              {currentProfiles.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentProfiles.map((profile) => (
                    <MatchCard
                      key={profile.id}
                      {...profile}
                      onLike={handleLike}
                      onPass={handlePass}
                      onView={handleViewProfile}
                      compact={true}
                    />
                  ))}
                </div>
              ) : (
                <div className="glass-card p-8 text-center">
                  <h3 className="text-xl font-semibold mb-4">No hay perfiles que coincidan</h3>
                  <p className="text-muted-foreground mb-6">Intenta modificar tus filtros para ver más resultados.</p>
                </div>
              )}
              
              {/* Pagination */}
              {users.length > profilesPerPage && (
                <div className="mt-8">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                          onClick={handlePrevPage} 
                        />
                      </PaginationItem>
                      
                      {Array.from({ length: totalPages }).map((_, index) => (
                        <PaginationItem key={index}>
                          <PaginationLink 
                            isActive={currentPage === index + 1}
                            onClick={() => setCurrentPage(index + 1)}
                          >
                            {index + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      
                      <PaginationItem>
                        <PaginationNext 
                          className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                          onClick={handleNextPage} 
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </div>
            
            <div className="text-center mt-12">
              <p className="text-sm text-muted-foreground">
                Haz clic en el corazón para indicar interés, en el botón X para pasar o en el perfil para ver más detalles.
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
