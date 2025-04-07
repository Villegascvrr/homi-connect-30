
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useIsMobile } from "@/hooks/use-mobile";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Briefcase, GraduationCap } from "lucide-react";

interface ProfileBasicInfoProps {
  form: any;
  showUniversityField?: boolean;
  onOccupationTypeChange?: (type: string) => void;
}

const occupationOptions = [
  { value: "student", label: "Estudiante" },
  { value: "professional", label: "Profesional" },
  { value: "entrepreneur", label: "Emprendedor" },
  { value: "other", label: "Otro" }
];

const ProfileBasicInfo = ({ form, showUniversityField = false, onOccupationTypeChange }: ProfileBasicInfoProps) => {
  const isMobile = useIsMobile();

  const handleOccupationTypeChange = (value: string) => {
    if (onOccupationTypeChange) {
      onOccupationTypeChange(value);
    }
  };

  // Force remount on mobile state change to ensure proper layout
  const mobileRenderKey = isMobile ? 'mobile-form' : 'desktop-form';

  return (
    <div className="space-y-4" key={mobileRenderKey}>
      <h2 className="text-xl font-semibold">Información Personal</h2>
      
      <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-2 gap-6'}`}>
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input placeholder="Tu nombre" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Apellidos</FormLabel>
              <FormControl>
                <Input placeholder="Tus apellidos" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre de usuario</FormLabel>
              <FormControl>
                <Input placeholder="Tu nombre de usuario" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Tu email" {...field} disabled />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="age"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Edad</FormLabel>
              <FormControl>
                <Input placeholder="Tu edad" type="number" min="16" max="100" {...field} />
              </FormControl>
              <FormDescription>
                Debes tener al menos 16 años para utilizar la plataforma
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="occupationType"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Briefcase className="text-homi-purple" size={18} />
                Ocupación
              </FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  handleOccupationTypeChange(value);
                }}
                value={field.value || ""}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona tu ocupación" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {occupationOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Show university field only for students */}
        {showUniversityField && (
          <FormField
            control={form.control}
            name="university"
            render={({ field }) => (
              <FormItem className={isMobile ? "col-span-1" : "col-span-2"}>
                <FormLabel className="flex items-center gap-2">
                  <GraduationCap className="text-homi-purple" size={18} />
                  Universidad
                </FormLabel>
                <FormControl>
                  <Input placeholder="Tu universidad o centro de estudios" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        
        {/* Custom occupation field for "other" option */}
        {form.watch('occupationType') === 'other' && (
          <FormField
            control={form.control}
            name="occupation"
            render={({ field }) => (
              <FormItem className={isMobile ? "col-span-1" : "col-span-2"}>
                <FormLabel>Especificar ocupación</FormLabel>
                <FormControl>
                  <Input placeholder="Especifica tu ocupación" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        
        <div className="col-span-full">
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Cuéntanos sobre ti..." 
                    className="min-h-[100px]" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileBasicInfo;
