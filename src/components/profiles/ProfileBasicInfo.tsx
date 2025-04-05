
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useIsMobile } from "@/hooks/use-mobile";

interface ProfileBasicInfoProps {
  form: any;
}

const ProfileBasicInfo = ({ form }: ProfileBasicInfoProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="space-y-4">
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
                <Input placeholder="Tu edad" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ubicación</FormLabel>
              <FormControl>
                <Input placeholder="Tu ciudad actual" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="university"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Universidad</FormLabel>
              <FormControl>
                <Input placeholder="Tu universidad" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="occupation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ocupación</FormLabel>
              <FormControl>
                <Input placeholder="Tu ocupación actual" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
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
