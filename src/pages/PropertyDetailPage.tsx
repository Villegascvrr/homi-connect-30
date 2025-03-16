
import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getPropertyById } from '@/services/propertyService';
import { Property } from '@/types/property';
import PropertyGallery from '@/components/properties/PropertyGallery';
import PropertyMap from '@/components/properties/PropertyMap';
import ContactLandlordForm from '@/components/properties/ContactLandlordForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronLeft, 
  MapPin, 
  Euro, 
  Calendar, 
  Home, 
  Ruler, 
  BedDouble, 
  Bath, 
  Check, 
  User,
  Phone,
  Mail,
  Share2,
  Heart
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from '@/components/ui/sheet';

const PropertyDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isFavorite, setIsFavorite] = useState(false);

  const { data: property, isLoading, error } = useQuery({
    queryKey: ['property', id],
    queryFn: () => getPropertyById(id || ''),
    enabled: !!id
  });

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleAddToFavorites = () => {
    setIsFavorite(!isFavorite);
    toast({
      title: isFavorite ? 'Eliminado de favoritos' : 'Añadido a favoritos',
      description: isFavorite 
        ? 'Se ha eliminado la propiedad de tus favoritos' 
        : 'Se ha añadido la propiedad a tus favoritos',
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property?.title,
        text: property?.description,
        url: window.location.href,
      })
      .catch((error) => console.log('Error sharing', error));
    } else {
      // Fallback
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: 'Enlace copiado',
        description: 'El enlace se ha copiado al portapapeles'
      });
    }
  };

  const renderPropertyType = (type: Property['type']) => {
    switch (type) {
      case 'apartment':
        return 'Apartamento';
      case 'room':
        return 'Habitación';
      case 'house':
        return 'Casa';
      case 'studio':
        return 'Estudio';
      default:
        return type;
    }
  };

  if (isLoading) {
    return (
      <div className="pt-24 pb-16">
        <div className="container px-4 mx-auto">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-pulse flex flex-col items-center">
              <div className="rounded-full bg-slate-200 h-24 w-24 mb-4"></div>
              <div className="h-4 bg-slate-200 rounded w-48 mb-3"></div>
              <div className="h-3 bg-slate-200 rounded w-32"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="pt-24 pb-16">
        <div className="container px-4 mx-auto">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Propiedad no encontrada</h2>
            <p className="text-muted-foreground mb-6">
              Lo sentimos, la propiedad que estás buscando no existe o ha sido eliminada.
            </p>
            <Button asChild>
              <Link to="/properties">Ver todas las propiedades</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16">
      <div className="container px-4 mx-auto">
        {/* Back button and actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <Button variant="ghost" onClick={handleGoBack}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="mr-2 h-4 w-4" />
              Compartir
            </Button>
            <Button 
              variant={isFavorite ? "default" : "outline"} 
              size="sm" 
              onClick={handleAddToFavorites}
              className={isFavorite ? "bg-red-500 hover:bg-red-600" : ""}
            >
              <Heart className={`mr-2 h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
              {isFavorite ? "Guardado" : "Guardar"}
            </Button>
          </div>
        </div>

        {/* Title and price */}
        <div className="mb-6">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-2">
            <h1 className="text-3xl md:text-4xl font-bold">{property.title}</h1>
            <div className="text-3xl font-bold text-homi-purple">
              {property.price}€<span className="text-base font-normal">/mes</span>
            </div>
          </div>
          <div className="flex items-center text-muted-foreground">
            <MapPin className="mr-2 h-4 w-4" />
            <span>{property.address}, {property.city}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
          <div>
            {/* Gallery */}
            <div className="mb-8">
              <PropertyGallery images={property.images} title={property.title} />
            </div>

            {/* Description and details */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Descripción</h2>
              <p className="text-muted-foreground whitespace-pre-line mb-6">
                {property.description}
              </p>
            </div>

            {/* Features */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Características</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 flex flex-col items-center text-center">
                    <Home className="h-6 w-6 mb-2 text-homi-purple" />
                    <div className="font-semibold">{renderPropertyType(property.type)}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 flex flex-col items-center text-center">
                    <Ruler className="h-6 w-6 mb-2 text-homi-purple" />
                    <div className="font-semibold">{property.size} m²</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 flex flex-col items-center text-center">
                    <BedDouble className="h-6 w-6 mb-2 text-homi-purple" />
                    <div className="font-semibold">{property.rooms} {property.rooms === 1 ? 'Habitación' : 'Habitaciones'}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 flex flex-col items-center text-center">
                    <Bath className="h-6 w-6 mb-2 text-homi-purple" />
                    <div className="font-semibold">{property.bathrooms} {property.bathrooms === 1 ? 'Baño' : 'Baños'}</div>
                  </CardContent>
                </Card>
                <Card className="col-span-2 md:col-span-4">
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">Disponibilidad</h3>
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-homi-purple" />
                      <span>Disponible a partir del {new Date(property.availability).toLocaleDateString()}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Amenities */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Comodidades</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4">
                {property.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center">
                    <Check className="h-5 w-5 mr-2 text-homi-purple" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Location */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Ubicación</h2>
              <div className="mb-4">
                <PropertyMap property={property} height="400px" />
              </div>
              <p className="text-muted-foreground">
                La ubicación exacta se compartirá después de confirmar la reserva.
              </p>
            </div>
          </div>

          <div>
            {/* Landlord card */}
            <Card className="sticky top-24 mb-6">
              <CardHeader>
                <CardTitle>Contactar con el propietario</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
                    <img 
                      src={property.landlord.avatar || 'https://via.placeholder.com/100?text=?'} 
                      alt={property.landlord.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{property.landlord.name}</h3>
                    <div className="text-muted-foreground text-sm flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      Propietario
                    </div>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 mr-3 text-homi-purple" />
                    <span className="text-muted-foreground">{property.landlord.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 mr-3 text-homi-purple" />
                    <span className="text-muted-foreground">{property.landlord.email}</span>
                  </div>
                </div>

                <Sheet>
                  <SheetTrigger asChild>
                    <Button className="w-full">Enviar mensaje</Button>
                  </SheetTrigger>
                  <SheetContent className="overflow-y-auto">
                    <SheetHeader>
                      <SheetTitle>Contactar con {property.landlord.name}</SheetTitle>
                      <SheetDescription>
                        Rellena el formulario para ponerte en contacto con el propietario de este alojamiento.
                      </SheetDescription>
                    </SheetHeader>
                    <div className="mt-6">
                      <ContactLandlordForm property={property} />
                    </div>
                  </SheetContent>
                </Sheet>
              </CardContent>
            </Card>

            {/* Quick info */}
            <Card>
              <CardHeader>
                <CardTitle>Información adicional</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Precio</h3>
                    <div className="flex items-center justify-between">
                      <span>Alquiler mensual</span>
                      <span className="font-semibold">{property.price}€</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>Fianza (2 meses)</span>
                      <span>{property.price * 2}€</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Tipo de alojamiento</h3>
                    <Badge variant="outline" className="mr-2 mb-2">
                      {renderPropertyType(property.type)}
                    </Badge>
                    <Badge variant="outline" className="mr-2 mb-2">
                      {property.furnished ? 'Amueblado' : 'Sin amueblar'}
                    </Badge>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Publicado</h3>
                    <div className="text-muted-foreground">
                      {new Date(property.createdAt).toLocaleDateString()} - Ref: {property.id}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailPage;
