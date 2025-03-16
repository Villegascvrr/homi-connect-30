
import { useState, useEffect } from 'react';
import { filterProperties } from '@/services/propertyService';
import { Property, PropertyFilter } from '@/types/property';
import { useQuery } from '@tanstack/react-query';
import PropertyCard from '@/components/properties/PropertyCard';
import PropertyFilter from '@/components/properties/PropertyFilter';
import PropertyMap from '@/components/properties/PropertyMap';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Pagination, 
  PaginationContent, 
  PaginationEllipsis, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';
import { List, MapPin, Loader2 } from 'lucide-react';

const PropertiesPage = () => {
  const [filters, setFilters] = useState<PropertyFilter>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const propertiesPerPage = 6;

  const { data: properties = [], isLoading, refetch } = useQuery({
    queryKey: ['properties', filters],
    queryFn: () => filterProperties(filters)
  });

  useEffect(() => {
    // Reset to first page when filters change
    setCurrentPage(1);
  }, [filters]);

  const handleFilterChange = (newFilters: PropertyFilter) => {
    setFilters(newFilters);
  };

  // Pagination logic
  const indexOfLastProperty = currentPage * propertiesPerPage;
  const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage;
  const currentProperties = properties.slice(indexOfFirstProperty, indexOfLastProperty);
  const totalPages = Math.ceil(properties.length / propertiesPerPage);

  const paginate = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if there are less than maxVisiblePages
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink 
              isActive={currentPage === i}
              onClick={() => paginate(i)}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // Show first page
      items.push(
        <PaginationItem key={1}>
          <PaginationLink 
            isActive={currentPage === 1}
            onClick={() => paginate(1)}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );
      
      // Show ellipsis if currentPage is not close to first page
      if (currentPage > 3) {
        items.push(
          <PaginationItem key="ellipsis1">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      
      // Show pages around current page
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = startPage; i <= endPage; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink 
              isActive={currentPage === i}
              onClick={() => paginate(i)}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
      
      // Show ellipsis if currentPage is not close to last page
      if (currentPage < totalPages - 2) {
        items.push(
          <PaginationItem key="ellipsis2">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      
      // Show last page
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink 
            isActive={currentPage === totalPages}
            onClick={() => paginate(totalPages)}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    return items;
  };

  return (
    <div className="pt-24 pb-16">
      <div className="container px-4 mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Buscar Pisos y Habitaciones</h1>
          <p className="text-lg text-muted-foreground">
            Encuentra el alojamiento perfecto para tu etapa universitaria
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
          {/* Sidebar with filters */}
          <div className="order-2 lg:order-1">
            <div className="sticky top-24">
              <PropertyFilter onFilterChange={handleFilterChange} />
            </div>
          </div>

          {/* Main content */}
          <div className="order-1 lg:order-2">
            <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">
                  {properties.length} {properties.length === 1 ? 'resultado' : 'resultados'} encontrados
                </h2>
              </div>
              
              <div className="flex items-center gap-2">
                <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'list' | 'map')}>
                  <TabsList>
                    <TabsTrigger value="list">
                      <List className="h-4 w-4 mr-2" />
                      Lista
                    </TabsTrigger>
                    <TabsTrigger value="map">
                      <MapPin className="h-4 w-4 mr-2" />
                      Mapa
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-2" />
                <p className="text-muted-foreground">Cargando propiedades...</p>
              </div>
            ) : (
              <div>
                <Tabs value={viewMode} className="w-full">
                  <TabsContent value="list" className="mt-0">
                    {properties.length === 0 ? (
                      <div className="text-center py-12 bg-muted/40 rounded-lg">
                        <h3 className="text-xl font-semibold mb-2">No se encontraron propiedades</h3>
                        <p className="text-muted-foreground mb-4">
                          Prueba a cambiar los filtros para ver más opciones
                        </p>
                        <Button onClick={() => setFilters({})}>Limpiar filtros</Button>
                      </div>
                    ) : (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {currentProperties.map((property) => (
                            <PropertyCard 
                              key={property.id} 
                              property={property} 
                              compact={true}
                            />
                          ))}
                        </div>
                        
                        {/* Pagination */}
                        {totalPages > 1 && (
                          <Pagination className="my-8">
                            <PaginationContent>
                              <PaginationItem>
                                <PaginationPrevious 
                                  onClick={() => paginate(currentPage - 1)}
                                  aria-disabled={currentPage === 1}
                                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                                />
                              </PaginationItem>
                              
                              {renderPaginationItems()}
                              
                              <PaginationItem>
                                <PaginationNext 
                                  onClick={() => paginate(currentPage + 1)}
                                  aria-disabled={currentPage === totalPages}
                                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                                />
                              </PaginationItem>
                            </PaginationContent>
                          </Pagination>
                        )}
                      </>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="map" className="mt-0">
                    <div className="bg-muted/40 rounded-lg p-4">
                      <div className="mb-4">
                        <PropertyMap 
                          properties={properties} 
                          height="600px"
                          zoom={12}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {currentProperties.slice(0, 3).map((property) => (
                          <PropertyCard 
                            key={property.id} 
                            property={property} 
                            compact={true}
                          />
                        ))}
                      </div>
                      
                      {properties.length > 3 && (
                        <div className="mt-4 text-center">
                          <Button variant="outline" onClick={() => setViewMode('list')}>
                            Ver todas las propiedades
                          </Button>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertiesPage;
