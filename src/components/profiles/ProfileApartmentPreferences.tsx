import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { MapPin, Users, Euro, Home, X } from "lucide-react";
import { Button } from "@/components/ui/button";

// Principales ciudades universitarias de España
const spanishCities = [
  "Sevilla",
  "Madrid",
  "Barcelona",
  "Valencia",
  "Granada",
  "Salamanca",
  "Zaragoza",
  "Málaga",
  "Bilbao",
  "Santiago de Compostela",
  "Alicante",
  "Murcia",
  "Valladolid",
  "Oviedo",
  "San Sebastián",
  "Córdoba",
  "Cádiz",
  "Huelva",
  "Almería",
  "Jaén",
  "Otro"
];

// Zonas de Sevilla (solo se muestran si la ciudad es Sevilla)
const sevillaZones = [
  "Casco Antiguo",
  "Triana",
  "Los Remedios",
  "Nervión",
  "San Pablo - Santa Justa",
  "Este - Alcosa - Torreblanca",
  "Cerro - Amate",
  "Sur",
  "Bellavista - La Palmera",
  "Macarena",
  "Norte",
  "Viapol",
  "El Plantinar",
  "El Juncal",
  "Gran Plaza",
  "Otro/Alrededores"
];

// Número de compañeros options
const companeroOptions = ["1", "2", "3", "4", "5+"];

// Presupuesto ranges
const budgetRanges = [
  "Menos de 200€",
  "200€ - 300€",
  "300€ - 400€",
  "400€ - 500€",
  "500€ - 600€",
  "600€ - 700€",
  "Más de 700€"
];

// Número de habitaciones options
const roomCountOptions = ["2", "3", "4", "5", "6+"];

interface ProfileApartmentPreferencesProps {
  form: any;
  apartmentStatus: 'looking' | 'have';
  onApartmentStatusChange: (status: 'looking' | 'have') => void;
}

const ProfileApartmentPreferences = ({ 
  form, 
  apartmentStatus,
  onApartmentStatusChange
}: ProfileApartmentPreferencesProps) => {
  const selectedCity = form.watch('ciudad');
  const isSevilla = selectedCity === 'Sevilla';
  const selectedZones = form.watch('sevilla_zonas') || [];

  const handleZoneChange = (zone: string, checked: boolean) => {
    const currentZones = selectedZones || [];
    
    if (checked) {
      // If user has apartment, only allow one zone selection
      if (apartmentStatus === 'have') {
        form.setValue('sevilla_zonas', [zone]);
      } else {
        // For those looking for apartment, allow up to 3 zones
        if (currentZones.length < 3) {
          form.setValue('sevilla_zonas', [...currentZones, zone]);
        }
      }
    } else {
      // Remove zone
      form.setValue('sevilla_zonas', currentZones.filter((z: string) => z !== zone));
    }
  };

  const removeZone = (zoneToRemove: string) => {
    const currentZones = selectedZones || [];
    form.setValue('sevilla_zonas', currentZones.filter((z: string) => z !== zoneToRemove));
  };

  const maxZones = apartmentStatus === 'have' ? 1 : 3;

  const handlePriceChange = (value: string) => {
    // Remove any non-numeric characters
    const numericValue = value.replace(/\D/g, '');
    form.setValue('room_price', numericValue);
  };

  return (
    <Card className="border-homi-purple/30">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <MapPin className="text-homi-purple" size={20} />
          Situación de vivienda
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Apartment status options */}
        <FormItem className="space-y-3">
          <FormLabel>¿Cuál es tu situación actual?</FormLabel>
          <RadioGroup 
            defaultValue={apartmentStatus} 
            onValueChange={(value) => {
              onApartmentStatusChange(value as 'looking' | 'have');
              // Reset zones when changing apartment status
              if (value === 'have' && selectedZones.length > 1) {
                // Keep only the first zone if switching to "have apartment"
                form.setValue('sevilla_zonas', selectedZones.slice(0, 1));
              }
            }}
            className="flex flex-col space-y-1"
          >
            <FormItem className="flex items-center space-x-3 space-y-0">
              <FormControl>
                <RadioGroupItem value="looking" />
              </FormControl>
              <FormLabel className="font-normal">Estoy buscando piso</FormLabel>
            </FormItem>
            <FormItem className="flex items-center space-x-3 space-y-0">
              <FormControl>
                <RadioGroupItem value="have" />
              </FormControl>
              <FormLabel className="font-normal">Ya tengo piso y busco compañeros</FormLabel>
            </FormItem>
          </RadioGroup>
        </FormItem>
        
        {/* Show different fields based on apartment status */}
        <div className="space-y-4">
          {/* City selection */}
          <FormField
            control={form.control}
            name="ciudad"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {apartmentStatus === 'looking' 
                    ? '¿En qué ciudad estás buscando piso?' 
                    : '¿En qué ciudad está tu piso?'
                  }
                </FormLabel>
                <Select 
                  onValueChange={(value) => {
                    field.onChange(value);
                    // Reset zonas when city changes
                    if (value !== 'Sevilla') {
                      form.setValue('sevilla_zonas', []);
                    }
                  }}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una ciudad" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="max-h-60">
                    {spanishCities.map((city) => (
                      <SelectItem key={city} value={city}>{city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Custom city input if "Otro" is selected */}
          {selectedCity === 'Otro' && (
            <FormField
              control={form.control}
              name="ciudad_otra"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Especifica tu ciudad</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Escribe el nombre de tu ciudad"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          
          {/* Zone selection for Sevilla only */}
          {isSevilla && (
            <FormField
              control={form.control}
              name="sevilla_zonas"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {apartmentStatus === 'have' 
                      ? '¿En qué zona de Sevilla está tu piso?' 
                      : '¿En qué zonas de Sevilla? (máximo 3)'
                    }
                  </FormLabel>
                  
                  {/* Selected zones display */}
                  {selectedZones.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {selectedZones.map((zone: string) => (
                        <div
                          key={zone}
                          className="flex items-center gap-1 bg-homi-purple/10 text-homi-purple px-3 py-1 rounded-full text-sm"
                        >
                          <span>{zone}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0 hover:bg-transparent"
                            onClick={() => removeZone(zone)}
                          >
                            <X size={12} />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                    {sevillaZones.map((zone) => (
                      <div key={zone} className="flex items-center space-x-2">
                        <Checkbox
                          id={zone}
                          checked={selectedZones.includes(zone)}
                          onCheckedChange={(checked) => handleZoneChange(zone, !!checked)}
                          disabled={!selectedZones.includes(zone) && selectedZones.length >= maxZones}
                        />
                        <label
                          htmlFor={zone}
                          className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                            !selectedZones.includes(zone) && selectedZones.length >= maxZones 
                              ? 'text-gray-400' 
                              : 'cursor-pointer'
                          }`}
                        >
                          {zone}
                        </label>
                      </div>
                    ))}
                  </div>
                  
                  <FormDescription>
                    {apartmentStatus === 'have' 
                      ? 'Selecciona la zona donde está ubicado tu piso'
                      : 'Selecciona hasta 3 zonas de Sevilla donde te gustaría vivir'
                    }
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          
          {/* Companions count */}
          <FormField
            control={form.control}
            name="companeros_count"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Users className="text-homi-purple" size={18} />
                  ¿Cuántos compañeros de piso buscas?
                </FormLabel>
                <Select 
                  onValueChange={field.onChange}
                  value={field.value || ""}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un número" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {companeroOptions.map((option) => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Budget field - only for those looking for apartment */}
          {apartmentStatus === 'looking' && (
            <FormField
              control={form.control}
              name="budget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Euro className="text-homi-purple" size={18} />
                    Presupuesto mensual
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || ""}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un rango" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {budgetRanges.map((range) => (
                        <SelectItem key={range} value={range}>{range}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Presupuesto mensual que puedes pagar por una habitación
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Apartment details - only for those who have an apartment */}
          {apartmentStatus === 'have' && (
            <div className="space-y-4 border-t pt-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Home className="text-homi-purple" size={18} />
                Detalles del piso
              </h3>
              
              {/* Number of rooms */}
              <FormField
                control={form.control}
                name="room_count"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número de habitaciones</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona el número de habitaciones" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {roomCountOptions.map((count) => (
                          <SelectItem key={count} value={count}>{count}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Número total de habitaciones en el piso
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Room price */}
              <FormField
                control={form.control}
                name="room_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio por habitación</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="300"
                        value={field.value || ""}
                        onChange={(e) => handlePriceChange(e.target.value)}
                        leftIcon={<Euro size={16} />}
                        inputMode="numeric"
                        pattern="[0-9]*"
                      />
                    </FormControl>
                    <FormDescription>
                      Precio en euros que cobraría cada compañero por su habitación
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileApartmentPreferences;
