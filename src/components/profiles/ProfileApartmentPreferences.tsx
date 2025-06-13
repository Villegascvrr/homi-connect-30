import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { MapPin, Users, Euro } from "lucide-react";

// Principales ciudades universitarias de España
const spanishCities = [
  "Sevilla",
  "Madrid",
  "Barcelona",
  "Valencia",
  "Granada",
  "Salamanca",
  "Santiago de Compostela",
  "Valladolid",
  "Zaragoza",
  "Bilbao",
  "Córdoba",
  "Murcia",
  "Alicante",
  "Málaga",
  "Cádiz",
  "Alcalá de Henares",
  "Pamplona",
  "León",
  "Oviedo",
  "Santander",
  "Castellón de la Plana",
  "Vitoria-Gasteiz",
  "Jaén",
  "Almería",
  "Huelva",
  "Cáceres",
  "Badajoz",
  "Las Palmas de Gran Canaria",
  "Santa Cruz de Tenerife",
  "Palma",
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
            onValueChange={(value) => onApartmentStatusChange(value as 'looking' | 'have')}
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
                    // Reset zona when city changes
                    if (value !== 'Sevilla') {
                      form.setValue('sevilla_zona', '');
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
              name="sevilla_zona"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>¿En qué zona de Sevilla?</FormLabel>
                  <Select 
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una zona" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sevillaZones.map((zone) => (
                        <SelectItem key={zone} value={zone}>{zone}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Especifica la zona de Sevilla para mejorar las coincidencias
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
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileApartmentPreferences;
