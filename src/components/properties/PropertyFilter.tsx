
import { useState, useEffect } from 'react';
import { PropertyFilter as PropertyFilterType } from '@/types/property';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { getUniqueCities } from '@/services/propertyService';
import { Filter, Euro, Home, BedDouble, Bath, Ruler, MapPin } from 'lucide-react';

interface PropertyFilterProps {
  onFilterChange: (filters: PropertyFilterType) => void;
  initialFilters?: PropertyFilterType;
}

const commonAmenities = [
  'Wifi', 
  'Aire acondicionado', 
  'Calefacción', 
  'Lavadora', 
  'Lavavajillas', 
  'Terraza', 
  'Balcón', 
  'Ascensor', 
  'Parking', 
  'Piscina', 
  'Gimnasio'
];

const PropertyFilter = ({ 
  onFilterChange, 
  initialFilters = {} 
}: PropertyFilterProps) => {
  const [filters, setFilters] = useState<PropertyFilterType>(initialFilters);
  const [cities, setCities] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [sizeRange, setSizeRange] = useState<[number, number]>([0, 200]);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  useEffect(() => {
    const loadCities = async () => {
      const uniqueCities = await getUniqueCities();
      setCities(uniqueCities);
    };
    
    loadCities();
  }, []);

  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  const handlePriceRangeChange = (values: number[]) => {
    setPriceRange([values[0], values[1]]);
    setFilters({
      ...filters,
      minPrice: values[0],
      maxPrice: values[1]
    });
  };

  const handleSizeRangeChange = (values: number[]) => {
    setSizeRange([values[0], values[1]]);
    setFilters({
      ...filters,
      minSize: values[0],
      maxSize: values[1]
    });
  };

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    const currentAmenities = filters.amenities || [];
    
    if (checked) {
      setFilters({
        ...filters,
        amenities: [...currentAmenities, amenity]
      });
    } else {
      setFilters({
        ...filters,
        amenities: currentAmenities.filter(a => a !== amenity)
      });
    }
  };

  const handleClearFilters = () => {
    setPriceRange([0, 2000]);
    setSizeRange([0, 200]);
    setFilters({});
  };

  return (
    <div className="bg-white dark:bg-homi-dark border rounded-lg p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center">
          <Filter className="mr-2 h-5 w-5" />
          Filtros
        </h2>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleClearFilters}
        >
          Limpiar filtros
        </Button>
      </div>

      <div className="space-y-6">
        {/* City Filter */}
        <div className="space-y-2">
          <div className="flex items-center">
            <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
            <Label>Ciudad</Label>
          </div>
          <Select
            value={filters.city}
            onValueChange={(value) => setFilters({...filters, city: value})}
          >
            <SelectTrigger>
              <SelectValue placeholder="Cualquier ciudad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Cualquier ciudad</SelectItem>
              {cities.map((city) => (
                <SelectItem key={city} value={city}>{city}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Type Filter */}
        <div className="space-y-2">
          <div className="flex items-center">
            <Home className="mr-2 h-4 w-4 text-muted-foreground" />
            <Label>Tipo de alojamiento</Label>
          </div>
          <Select
            value={filters.type}
            onValueChange={(value: any) => setFilters({...filters, type: value})}
          >
            <SelectTrigger>
              <SelectValue placeholder="Cualquier tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Cualquier tipo</SelectItem>
              <SelectItem value="room">Habitación</SelectItem>
              <SelectItem value="studio">Estudio</SelectItem>
              <SelectItem value="apartment">Apartamento</SelectItem>
              <SelectItem value="house">Casa</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Price Range Filter */}
        <div className="space-y-4">
          <div className="flex items-center">
            <Euro className="mr-2 h-4 w-4 text-muted-foreground" />
            <Label>Precio mensual</Label>
          </div>
          <div className="px-2">
            <Slider
              defaultValue={[0, 2000]}
              min={0}
              max={2000}
              step={50}
              value={[priceRange[0], priceRange[1]]}
              onValueChange={handlePriceRangeChange}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="w-20">
              <Input
                type="number"
                value={priceRange[0]}
                onChange={(e) => handlePriceRangeChange([parseInt(e.target.value), priceRange[1]])}
                className="text-center"
              />
            </div>
            <span>-</span>
            <div className="w-20">
              <Input
                type="number"
                value={priceRange[1]}
                onChange={(e) => handlePriceRangeChange([priceRange[0], parseInt(e.target.value)])}
                className="text-center"
              />
            </div>
            <span>€/mes</span>
          </div>
        </div>

        {/* Basic Filters */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center">
              <BedDouble className="mr-2 h-4 w-4 text-muted-foreground" />
              <Label>Habitaciones</Label>
            </div>
            <Select
              value={filters.rooms?.toString()}
              onValueChange={(value) => setFilters({...filters, rooms: value ? parseInt(value) : undefined})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Cualquiera" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Cualquiera</SelectItem>
                <SelectItem value="1">1+</SelectItem>
                <SelectItem value="2">2+</SelectItem>
                <SelectItem value="3">3+</SelectItem>
                <SelectItem value="4">4+</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center">
              <Bath className="mr-2 h-4 w-4 text-muted-foreground" />
              <Label>Baños</Label>
            </div>
            <Select
              value={filters.bathrooms?.toString()}
              onValueChange={(value) => setFilters({...filters, bathrooms: value ? parseInt(value) : undefined})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Cualquiera" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Cualquiera</SelectItem>
                <SelectItem value="1">1+</SelectItem>
                <SelectItem value="2">2+</SelectItem>
                <SelectItem value="3">3+</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Advanced Filters */}
        <Accordion
          type="single"
          collapsible
          value={isAdvancedOpen ? "advanced" : ""}
          onValueChange={(value) => setIsAdvancedOpen(value === "advanced")}
        >
          <AccordionItem value="advanced" className="border-b-0">
            <AccordionTrigger className="py-2">Filtros avanzados</AccordionTrigger>
            <AccordionContent className="space-y-6">
              {/* Furnished Filter */}
              <div className="flex items-center justify-between">
                <Label htmlFor="furnished">Amueblado</Label>
                <Switch
                  id="furnished"
                  checked={filters.furnished}
                  onCheckedChange={(checked) => setFilters({...filters, furnished: checked})}
                />
              </div>

              {/* Size Range Filter */}
              <div className="space-y-4">
                <div className="flex items-center">
                  <Ruler className="mr-2 h-4 w-4 text-muted-foreground" />
                  <Label>Tamaño (m²)</Label>
                </div>
                <div className="px-2">
                  <Slider
                    defaultValue={[0, 200]}
                    min={0}
                    max={200}
                    step={5}
                    value={[sizeRange[0], sizeRange[1]]}
                    onValueChange={handleSizeRangeChange}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="w-20">
                    <Input
                      type="number"
                      value={sizeRange[0]}
                      onChange={(e) => handleSizeRangeChange([parseInt(e.target.value), sizeRange[1]])}
                      className="text-center"
                    />
                  </div>
                  <span>-</span>
                  <div className="w-20">
                    <Input
                      type="number"
                      value={sizeRange[1]}
                      onChange={(e) => handleSizeRangeChange([sizeRange[0], parseInt(e.target.value)])}
                      className="text-center"
                    />
                  </div>
                  <span>m²</span>
                </div>
              </div>

              {/* Amenities Filter */}
              <div className="space-y-3">
                <Label>Comodidades</Label>
                <div className="grid grid-cols-2 gap-2">
                  {commonAmenities.map((amenity) => (
                    <div key={amenity} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`amenity-${amenity}`}
                        checked={(filters.amenities || []).includes(amenity)}
                        onCheckedChange={(checked) => 
                          handleAmenityChange(amenity, checked as boolean)
                        }
                      />
                      <label
                        htmlFor={`amenity-${amenity}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {amenity}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default PropertyFilter;
