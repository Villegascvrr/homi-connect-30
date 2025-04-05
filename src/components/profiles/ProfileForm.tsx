
import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { FormImageUpload } from "@/components/ui/form-image-upload";
import ProfileStatusToggle from "@/components/profiles/ProfileStatusToggle";
import { Separator } from "@/components/ui/separator";
import ProfileBasicInfo from "./ProfileBasicInfo";
import ProfileInterests from "./ProfileInterests";
import ProfileApartmentPreferences from "./ProfileApartmentPreferences";

// Define the form schema with all necessary fields
const formSchema = z.object({
  firstName: z.string().min(1, "El nombre es obligatorio"),
  lastName: z.string().optional(),
  username: z.string().min(2, "El nombre de usuario debe tener al menos 2 caracteres"),
  email: z.string().email("Por favor introduce un email válido"),
  bio: z.string().optional(),
  age: z.string().optional(),
  location: z.string().optional(),
  university: z.string().optional(),
  occupation: z.string().optional(),
  profileImage: z.string().optional(),
  interests: z.array(z.string()).default([]),
  newInterest: z.string().optional(),
  isProfileActive: z.boolean().default(true),
  sevilla_zona: z.string().optional(),
  companeros_count: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const ProfileForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLookingForApartment, setIsLookingForApartment] = useState(false);
  const { user, refreshUser } = useAuth();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      bio: "",
      age: "",
      location: "",
      university: "",
      occupation: "",
      profileImage: "",
      interests: [],
      newInterest: "",
      isProfileActive: true,
      sevilla_zona: "",
      companeros_count: "",
    },
  });

  // Fetch user profile data when component mounts
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        setIsLoading(true);
        
        try {
          // Fetch user's profile from Supabase
          const { data: profileData, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          
          if (error) {
            console.error("Error fetching profile:", error);
            throw error;
          }
          
          console.log("Raw profile data from Supabase:", profileData);
          
          // Check if user is looking for apartment in Sevilla
          setIsLookingForApartment(!!profileData.sevilla_zona && profileData.sevilla_zona !== 'no_busco');
          
          // Set form data with the fetched profile
          form.reset({
            firstName: profileData.first_name || '',
            lastName: profileData.last_name || '',
            username: profileData.username || '',
            email: user.email || "",
            bio: profileData.bio || "",
            age: profileData.edad || "",
            location: profileData.ubicacion || "",
            university: profileData.universidad || "",
            occupation: profileData.ocupacion || "",
            profileImage: profileData.profile_image || "",
            interests: profileData.interests || [],
            newInterest: "",
            isProfileActive: profileData.is_profile_active !== false,
            sevilla_zona: profileData.sevilla_zona || "",
            companeros_count: profileData.companeros_count || "",
          });
          
          console.log("Profile data loaded into form:", form.getValues());
        } catch (err) {
          console.error("Error loading profile data:", err);
          // Fallback to using just the auth user data
          form.reset({
            firstName: user.user_metadata?.firstName || "",
            lastName: user.user_metadata?.lastName || "",
            username: user.user_metadata?.username || "",
            email: user.email || "",
            bio: "",
            age: "",
            location: "",
            university: "",
            occupation: "",
            profileImage: "",
            interests: [],
            newInterest: "",
            isProfileActive: true,
            sevilla_zona: "",
            companeros_count: "",
          });
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    fetchUserProfile();
  }, [user, form]);

  async function onSubmit(values: FormValues) {
    if (!user) return;
    
    setIsSubmitting(true);
    console.log("Form submitted with values:", values);
    
    try {
      // Filter out the newInterest field which is only for UI
      const { newInterest, ...dataToSave } = values;
      
      // Prepare data for update
      const updateData = {
        first_name: dataToSave.firstName,
        last_name: dataToSave.lastName,
        username: dataToSave.username,
        bio: dataToSave.bio || '',
        edad: dataToSave.age || '',
        ubicacion: dataToSave.location || '',
        universidad: dataToSave.university || '',
        ocupacion: dataToSave.occupation || '',
        profile_image: dataToSave.profileImage || '',
        interests: dataToSave.interests,
        is_profile_active: dataToSave.isProfileActive,
        sevilla_zona: dataToSave.sevilla_zona || '',
        companeros_count: dataToSave.companeros_count || '',
        updated_at: new Date().toISOString()
      };
      
      console.log("Data being sent to Supabase:", updateData);
      
      // Update the profile in Supabase
      const { data, error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id)
        .select();
        
      if (error) {
        console.error("Error from Supabase:", error);
        throw error;
      }
      
      console.log("Update successful, returned data:", data);
      
      // Refresh the user data in the global context
      await refreshUser();
      
      toast({
        title: "Perfil actualizado",
        description: "Tu información de perfil ha sido guardada.",
      });
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error al actualizar el perfil",
        description: error.message || "Ha ocurrido un error al guardar los cambios.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleProfileStatusToggle = (active: boolean) => {
    form.setValue('isProfileActive', active);
  };
  
  const handleApartmentSearchToggle = (val: string) => {
    setIsLookingForApartment(!!val && val !== 'no_busco');
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
          {/* Status toggle */}
          <div className="mb-4">
            <ProfileStatusToggle 
              isActive={form.watch('isProfileActive')} 
              onToggle={handleProfileStatusToggle}
            />
          </div>
          
          <Separator className="my-4" />
          
          {/* Image upload section */}
          <div className="w-full mb-6">
            <FormImageUpload
              name="profileImage"
              label="Foto de perfil"
              description="Esta será tu imagen principal en tu perfil"
              required={false}
            />
          </div>
          
          {/* Basic info section */}
          <ProfileBasicInfo form={form} />
          
          {/* Interests section */}
          <ProfileInterests form={form} />
          
          {/* Apartment preferences section */}
          <ProfileApartmentPreferences 
            form={form} 
            isLookingForApartment={isLookingForApartment}
            onApartmentSearchToggle={handleApartmentSearchToggle}
          />
        </div>

        <Button 
          type="submit" 
          className="w-full mt-6 bg-homi-purple hover:bg-homi-purple/90" 
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
