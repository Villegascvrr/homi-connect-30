
import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useToast } from "@/hooks/use-toast"
import { useIsMobile } from "@/hooks/use-mobile"
import { useAuth } from "@/context/AuthContext"

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
import { Textarea } from "@/components/ui/textarea"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  bio: z.string().optional(),
  age: z.string().optional(),
  location: z.string().optional(),
  university: z.string().optional(),
  occupation: z.string().optional(),
  profileImage: z.string().optional(),
  galleryImages: z.array(z.string()).optional(),
  isProfileActive: z.boolean().default(true),
})

const ProfileForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();
  const { user } = useAuth();
  
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      bio: "",
      age: "",
      location: "",
      university: "",
      occupation: "",
      profileImage: "",
      galleryImages: [] as string[],
      isProfileActive: true,
    },
  });

  // Fetch user profile data when component mounts
  useEffect(() => {
    if (user) {
      // In a real app, you would fetch the user's profile from the database
      // For now, we'll use the user object from the auth context
      setIsLoading(true);
      
      // Simulate API call with timeout
      setTimeout(() => {
        form.reset({
          name: user.user_metadata?.full_name || "",
          email: user.email || "",
          bio: user.user_metadata?.bio || "",
          age: user.user_metadata?.age || "",
          location: user.user_metadata?.location || "",
          university: user.user_metadata?.university || "",
          occupation: user.user_metadata?.occupation || "",
          profileImage: user.user_metadata?.avatar_url || "",
          galleryImages: user.user_metadata?.gallery_images || [],
          isProfileActive: user.user_metadata?.is_profile_active !== false,
        });
        setIsLoading(false);
      }, 500);
    }
  }, [user, form]);

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

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-64 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 w-44 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

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
                      <Input placeholder="Tu ciudad" {...field} />
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
                      <Input placeholder="Tu ocupación" {...field} />
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
