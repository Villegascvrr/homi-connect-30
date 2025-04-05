
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { MapPin, Users, Euro } from "lucide-react";

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
  apartmentStatus: 'looking' | 'have' | 'not_looking';
  onApartmentStatusChange: (status: 'looking' | 'have' | 'not_looking') => void;
}

const ProfileApartmentPreferences = ({ 
  form, 
  apartmentStatus,
  onApartmentStatusChange
}: ProfileApartmentPreferencesProps) => {
  return (
    <Card className="border-homi-purple/30">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <MapPin className="text-homi-purple" size={20} />
          Situación en Sevilla
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Apartment status options */}
        <FormItem className="space-y-3">
          <FormLabel>¿Cuál es tu situación actual?</FormLabel>
          <RadioGroup 
            defaultValue={apartmentStatus} 
            onValueChange={(value) => onApartmentStatusChange(value as 'looking' | 'have' | 'not_looking')}
            className="flex flex-col space-y-1"
          >
            <FormItem className="flex items-center space-x-3 space-y-0">
              <FormControl>
                <RadioGroupItem value="looking" />
              </FormControl>
              <FormLabel className="font-normal">Estoy buscando piso en Sevilla</FormLabel>
            </FormItem>
            <FormItem className="flex items-center space-x-3 space-y-0">
              <FormControl>
                <RadioGroupItem value="have" />
              </FormControl>
              <FormLabel className="font-normal">Ya tengo piso en Sevilla y busco compañeros</FormLabel>
            </FormItem>
            <FormItem className="flex items-center space-x-3 space-y-0">
              <FormControl>
                <RadioGroupItem value="not_looking" />
              </FormControl>
              <FormLabel className="font-normal">No estoy buscando piso ni compañeros</FormLabel>
            </FormItem>
          </RadioGroup>
        </FormItem>
        
        {/* Show different fields based on apartment status */}
        {apartmentStatus !== 'not_looking' && (
          <div className="space-y-4">
            {/* Zone selection for those looking for apartment */}
            {apartmentStatus === 'looking' && (
              <FormField
                control={form.control}
                name="sevilla_zona"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>¿En qué zona de Sevilla estás buscando piso?</FormLabel>
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
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            {/* Zone for those with apartment looking for roommates */}
            {apartmentStatus === 'have' && (
              <FormField
                control={form.control}
                name="sevilla_zona"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>¿En qué zona de Sevilla está tu piso?</FormLabel>
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
            
            {/* Budget field */}
            {apartmentStatus === 'looking' && (
              <FormField
                control={form.control}
                name="budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Euro className="text-homi-purple" size={18} />
                      Presupuesto mensual (€)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number" 
                        placeholder="Ej: 300"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Presupuesto mensual que puedes pagar por una habitación
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileApartmentPreferences;
