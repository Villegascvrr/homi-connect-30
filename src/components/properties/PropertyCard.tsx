
import { Property } from '@/types/property';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Euro, Home, Ruler, Bath, BedDouble } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface PropertyCardProps {
  property: Property;
  compact?: boolean;
}

const PropertyCard = ({ property, compact = false }: PropertyCardProps) => {
  if (compact) {
    return (
      <Card className="overflow-hidden transition-all h-full">
        <div className="relative">
          <img 
            src={property.images[0]} 
            alt={property.title} 
            className="w-full h-40 object-cover"
          />
          <Badge className="absolute top-2 right-2 bg-homi-purple">
            {property.type === 'room' ? 'Habitación' : 
             property.type === 'apartment' ? 'Apartamento' : 
             property.type === 'studio' ? 'Estudio' : 'Casa'}
          </Badge>
        </div>
        <CardContent className="p-3">
          <h3 className="font-semibold text-base mb-1 line-clamp-1">{property.title}</h3>
          <div className="flex items-center text-muted-foreground mb-2">
            <MapPin size={14} className="mr-1" />
            <span className="text-xs">{property.city}</span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center text-sm">
              <Euro size={14} className="mr-1 text-homi-purple" />
              <span className="font-semibold text-homi-purple">{property.price}€/mes</span>
            </div>
            <div className="flex gap-2">
              {property.type !== 'room' && (
                <div className="flex items-center text-xs">
                  <BedDouble size={14} className="mr-1" />
                  <span>{property.rooms}</span>
                </div>
              )}
              <div className="flex items-center text-xs">
                <Bath size={14} className="mr-1" />
                <span>{property.bathrooms}</span>
              </div>
              <div className="flex items-center text-xs">
                <Ruler size={14} className="mr-1" />
                <span>{property.size}m²</span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-3 pt-0">
          <Button asChild size="sm" className="w-full">
            <Link to={`/properties/${property.id}`}>
              Ver detalles
            </Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden transition-all">
      <div className="grid md:grid-cols-[1fr_2fr] gap-4">
        <div className="relative h-full">
          <img 
            src={property.images[0]} 
            alt={property.title} 
            className="w-full h-full min-h-56 object-cover"
          />
          <Badge className="absolute top-2 right-2 bg-homi-purple">
            {property.type === 'room' ? 'Habitación' : 
             property.type === 'apartment' ? 'Apartamento' : 
             property.type === 'studio' ? 'Estudio' : 'Casa'}
          </Badge>
        </div>
        <div className="p-4">
          <h3 className="text-xl font-semibold mb-2">{property.title}</h3>
          <div className="flex items-center text-muted-foreground mb-4">
            <MapPin size={16} className="mr-2" />
            <span>{property.address}, {property.city}</span>
          </div>
          <p className="text-muted-foreground mb-4 line-clamp-2">{property.description}</p>
          
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="flex flex-col items-center border rounded-md p-2">
              <Euro size={18} className="mb-1 text-homi-purple" />
              <span className="font-semibold text-homi-purple">{property.price}€/mes</span>
            </div>
            <div className="flex flex-col items-center border rounded-md p-2">
              <Home size={18} className="mb-1" />
              <span>{property.type === 'room' ? 'Habitación' : 
                     property.type === 'apartment' ? 'Apartamento' : 
                     property.type === 'studio' ? 'Estudio' : 'Casa'}</span>
            </div>
            <div className="flex flex-col items-center border rounded-md p-2">
              <Ruler size={18} className="mb-1" />
              <span>{property.size} m²</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {property.amenities.slice(0, 4).map((amenity, index) => (
              <Badge key={index} variant="outline" className="bg-accent/50">
                {amenity}
              </Badge>
            ))}
            {property.amenities.length > 4 && (
              <Badge variant="outline" className="bg-accent/50">
                +{property.amenities.length - 4} más
              </Badge>
            )}
          </div>
          
          <div className="flex justify-end">
            <Button asChild>
              <Link to={`/properties/${property.id}`}>
                Ver detalles
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PropertyCard;
