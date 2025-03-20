
import React, { useState } from 'react';
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useToast } from "@/hooks/use-toast"
import { useIsMobile } from "@/hooks/use-mobile"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { FormImageUpload } from "@/components/ui/form-image-upload"
import ProfileStatusToggle from "@/components/profiles/ProfileStatusToggle"
import { Separator } from "@/components/ui/separator"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  profileImage: z.string().optional(),
  galleryImages: z.array(z.string()).optional(),
  isProfileActive: z.boolean().default(true),
})

const ProfileForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isMobile = useIsMobile();
  
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      profileImage: "",
      galleryImages: [] as string[],
      isProfileActive: true,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    console.log("Form submitted with values:", values);
    
    // Simulate API call with timeout
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Profile updated",
        description: "Your profile information has been saved.",
      });
    }, 1000);
  }

  const handleProfileStatusToggle = (active: boolean) => {
    form.setValue('isProfileActive', active);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Información Personal</h2>
          
          {/* Status toggle - improved mobile layout */}
          <div className="mb-4">
            <ProfileStatusToggle 
              isActive={form.watch('isProfileActive')} 
              onToggle={handleProfileStatusToggle}
            />
          </div>
          
          <Separator className="my-4" />
          
          {/* Image upload section - improved mobile layout */}
          <div className="space-y-4">
            <div className="w-full">
              <FormImageUpload
                name="profileImage"
                label="Foto de perfil"
                description="Esta será tu imagen principal en tu perfil (opcional)"
                required={false}
              />
            </div>
            
            <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-2 gap-6'}`}>
              <FormField
                control={form.control}
                name="name"
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Tu email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        {/* Gallery section - improved mobile layout */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Galería de fotos</h2>
          <FormImageUpload
            name="galleryImages"
            multiple={true}
            description="Comparte fotos de ti o de tus espacios para que otros usuarios te conozcan mejor"
          />
        </div>

        <Button 
          type="submit" 
          className="w-full mt-6" 
          size="auto" 
          wrap="normal" 
          disabled={isSubmitting}
        >
          <span className="button-text-container">
            {isSubmitting ? "Guardando..." : "Guardar cambios"}
          </span>
        </Button>
      </form>
    </Form>
  );
};

export default ProfileForm;
