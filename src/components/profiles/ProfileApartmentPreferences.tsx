
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Users } from "lucide-react";

// Zonas de Sevilla
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

interface ProfileApartmentPreferencesProps {
  form: any;
  isLookingForApartment: boolean;
  onApartmentSearchToggle: (val: string) => void;
}

const ProfileApartmentPreferences = ({ 
  form, 
  isLookingForApartment,
  onApartmentSearchToggle
}: ProfileApartmentPreferencesProps) => {
  return (
    <Card className="border-homi-purple/30">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <MapPin className="text-homi-purple" size={20} />
          Búsqueda de piso en Sevilla
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="sevilla_zona"
          render={({ field }) => (
            <FormItem>
              <FormLabel>¿En qué zona de Sevilla estás buscando piso o compañeros?</FormLabel>
              <Select 
                onValueChange={(value) => {
                  field.onChange(value);
                  onApartmentSearchToggle(value);
                }}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una zona" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="no_busco">No estoy buscando piso ni compañeros en Sevilla</SelectItem>
                  {sevillaZones.map((zone) => (
                    <SelectItem key={zone} value={zone}>{zone}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {isLookingForApartment && (
          <FormField
            control={form.control}
            name="companeros_count"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Users className="text-homi-purple" size={18} />
                  ¿Cuántos compañeros de piso buscas?</FormLabel>
                <Select 
                  onValueChange={field.onChange}
                  defaultValue={field.value}
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
        )}
        
        {!isLookingForApartment && (
          <p className="text-sm text-muted-foreground">
            Indica si estás buscando piso o compañeros en Sevilla para poder mostrarte perfiles compatibles.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileApartmentPreferences;
