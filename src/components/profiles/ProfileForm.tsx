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
import ProfileLifestyle from "./ProfileLifestyle";
import { Save } from "lucide-react";

const formSchema = z.object({
  firstName: z.string().min(1, "El nombre es obligatorio"),
  lastName: z.string().optional(),
  username: z.string().min(2, "El nombre de usuario debe tener al menos 2 caracteres"),
  email: z.string().email("Por favor introduce un email válido"),
  bio: z.string().optional(),
  age: z.string().optional(),
  occupation: z.string().optional(),
  occupationType: z.enum(['student', 'professional', 'entrepreneur', 'other']).optional(),
  university: z.string().optional(),
  profileImage: z.string().optional(),
  interests: z.array(z.string()).default([]),
  isProfileActive: z.boolean().default(true),
  apartmentStatus: z.enum(['looking', 'have']).default('looking'),
  sevilla_zona: z.string().optional(),
  companeros_count: z.string().optional(),
  budget: z.string().optional(),
  lifestyle: z.object({
    schedule: z.enum(['morning_person', 'night_owl', 'flexible']).optional(),
    cleanliness: z.enum(['very_clean', 'clean', 'moderate', 'relaxed']).optional(),
    smoking: z.enum(['non_smoker', 'outdoor_only', 'smoker']).optional(),
    pets: z.enum(['no_pets', 'has_pets', 'pets_welcome', 'no_pets_allowed']).optional(),
    guests: z.enum(['rarely', 'occasionally', 'frequently', 'no_problem']).optional(),
  }).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ProfileFormProps {
  onSaved?: () => void;
  cancelEdit?: () => void;
}

const ProfileForm = ({ onSaved, cancelEdit }: ProfileFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user, refreshUser } = useAuth();
  const [apartmentStatus, setApartmentStatus] = useState<'looking' | 'have'>('looking');
  const [showUniversityField, setShowUniversityField] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      bio: "",
      age: "",
      occupation: "",
      occupationType: undefined,
      university: "",
      profileImage: "",
      interests: [],
      isProfileActive: true,
      apartmentStatus: 'looking',
      sevilla_zona: "",
      companeros_count: "",
      budget: "",
      lifestyle: {
        schedule: undefined,
        cleanliness: undefined,
        smoking: undefined,
        pets: undefined,
        guests: undefined,
      },
    },
  });

  useEffect(() => {
    const occupationType = form.watch("occupationType");
    setShowUniversityField(occupationType === "student");
  }, [form.watch("occupationType")]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        setIsLoading(true);
        
        try {
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
          
          let currentApartmentStatus: 'looking' | 'have' = 'looking';
          if (profileData.sevilla_zona) {
            if (profileData.sevilla_zona === 'tengo_piso') {
              currentApartmentStatus = 'have';
            } else {
              currentApartmentStatus = 'looking';
            }
          }
          setApartmentStatus(currentApartmentStatus);
          
          const lifestyleData = typeof profileData.lifestyle === 'object' && profileData.lifestyle !== null
            ? profileData.lifestyle as Record<string, unknown>
            : {};
          
          let occupationType = "other";
          if (profileData.ocupacion === "Estudiante") {
            occupationType = "student";
          } else if (profileData.ocupacion === "Profesional") {
            occupationType = "professional";
          } else if (profileData.ocupacion === "Emprendedor") {
            occupationType = "entrepreneur";
          }
          
          setShowUniversityField(occupationType === "student");
          
          form.reset({
            firstName: profileData.first_name || '',
            lastName: profileData.last_name || '',
            username: profileData.username || '',
            email: user.email || "",
            bio: profileData.bio || "",
            age: profileData.edad || "",
            occupation: profileData.ocupacion || "",
            occupationType: occupationType as any,
            university: profileData.universidad || "",
            profileImage: profileData.profile_image || "",
            interests: profileData.interests || [],
            isProfileActive: profileData.is_profile_active !== false,
            apartmentStatus: currentApartmentStatus,
            sevilla_zona: currentApartmentStatus === 'looking' ? profileData.sevilla_zona || "" : "",
            companeros_count: profileData.companeros_count || "",
            budget: lifestyleData.budget as string || "",
            lifestyle: {
              schedule: lifestyleData.schedule as any,
              cleanliness: lifestyleData.cleanliness as any,
              smoking: lifestyleData.smoking as any,
              pets: lifestyleData.pets as any,
              guests: lifestyleData.guests as any,
            },
          });
          
          console.log("Profile data loaded into form:", form.getValues());
        } catch (err) {
          console.error("Error loading profile data:", err);
          form.reset({
            firstName: user.user_metadata?.firstName || "",
            lastName: user.user_metadata?.lastName || "",
            username: user.user_metadata?.username || "",
            email: user.email || "",
            bio: "",
            age: "",
            occupation: "",
            occupationType: "other" as any,
            university: "",
            profileImage: "",
            interests: [],
            isProfileActive: true,
            apartmentStatus: 'looking',
            sevilla_zona: "",
            companeros_count: "",
            budget: "",
            lifestyle: {
              schedule: undefined,
              cleanliness: undefined,
              smoking: undefined,
              pets: undefined,
              guests: undefined,
            },
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
      let sevilla_zona;
      if (values.apartmentStatus === 'have') {
        sevilla_zona = values.sevilla_zona;
      } else {
        sevilla_zona = values.sevilla_zona;
      }
      
      let occupation = values.occupation;
      if (values.occupationType === "student") {
        occupation = "Estudiante";
      } else if (values.occupationType === "professional") {
        occupation = "Profesional";
      } else if (values.occupationType === "entrepreneur") {
        occupation = "Emprendedor";
      } else if (values.occupationType === "other" && !values.occupation) {
        occupation = "Otro";
      }
      
      const lifestyle = {
        ...(values.lifestyle || {}),
        budget: values.budget
      };
      
      const updateData = {
        first_name: values.firstName,
        last_name: values.lastName,
        username: values.username,
        bio: values.bio || '',
        edad: values.age || '',
        ocupacion: occupation || '',
        universidad: values.university || '',
        profile_image: values.profileImage || '',
        interests: values.interests,
        is_profile_active: values.isProfileActive,
        sevilla_zona: sevilla_zona,
        companeros_count: values.companeros_count || '',
        lifestyle: lifestyle,
        updated_at: new Date().toISOString()
      };
      
      console.log("Data being sent to Supabase:", updateData);
      
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
      
      await refreshUser();
      
      toast({
        title: "Perfil actualizado",
        description: "Tu información de perfil ha sido guardada.",
      });
      
      if (onSaved) {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'instant'
        });
        
        onSaved();
      }
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
  
  const handleApartmentStatusChange = (status: 'looking' | 'have') => {
    setApartmentStatus(status);
    form.setValue('apartmentStatus', status);
  };

  const handleOccupationTypeChange = (type: string) => {
    form.setValue('occupationType', type as any);
    setShowUniversityField(type === "student");
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
          <div className="mb-4">
            <ProfileStatusToggle 
              isActive={form.watch('isProfileActive')} 
              onToggle={handleProfileStatusToggle}
            />
          </div>
          
          <Separator className="my-4" />
          
          <div className="w-full mb-6">
            <FormImageUpload
              name="profileImage"
              label="Foto de perfil"
              description="Esta será tu imagen principal en tu perfil"
              required={false}
            />
          </div>
          
          <ProfileBasicInfo 
            form={form} 
            showUniversityField={showUniversityField}
            onOccupationTypeChange={handleOccupationTypeChange}
          />
          
          <ProfileInterests form={form} />
          
          <ProfileLifestyle form={form} />
          
          <ProfileApartmentPreferences 
            form={form} 
            apartmentStatus={apartmentStatus}
            onApartmentStatusChange={handleApartmentStatusChange}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-between mt-6 bg-white p-4 rounded-lg shadow-sm">
          <div className="flex flex-col sm:flex-row gap-4">
            {cancelEdit && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={cancelEdit}
                className="w-full sm:w-auto"
              >
                Cancelar
              </Button>
            )}
            <Button 
              type="submit" 
              className="w-full sm:w-auto bg-homi-purple hover:bg-homi-purple/90" 
              size="auto" 
              wrap="normal" 
              disabled={isSubmitting}
            >
              <span className="button-text-container">
                {isSubmitting ? "Guardando..." : "Guardar cambios"}
              </span>
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default ProfileForm;
