import React, { useState, useEffect, useCallback } from 'react';
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
import ProfileLifestyle from "./ProfileLifestyle";

// Define the form schema with all necessary fields
const formSchema = z.object({
  firstName: z.string().min(1, "El nombre es obligatorio"),
  lastName: z.string().optional(),
  username: z.string().min(2, "El nombre de usuario debe tener al menos 2 caracteres"),
  email: z.string().email("Por favor introduce un email válido"),
  bio: z.string().optional(),
  age: z.string()
    .refine(val => {
      const num = parseInt(val);
      return !isNaN(num) && num >= 16;
    }, { message: "Debes tener al menos 16 años" })
    .optional(),
  occupation: z.string().optional(),
  occupationType: z.enum(['student', 'professional', 'entrepreneur', 'other']).optional(),
  university: z.string().optional(),
  fieldOfStudy: z.string().optional(),
  profileImage: z.string().optional(),
  interests: z.array(z.string()).default([]),
  isProfileActive: z.boolean().default(true),
  completed: z.boolean().default(false),
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
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [initialFormData, setInitialFormData] = useState<FormValues | null>(null);
  const { user, refreshUser } = useAuth();
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
      fieldOfStudy: "",
      profileImage: "",
      interests: [],
      isProfileActive: true,
      completed: false,
      lifestyle: {
        schedule: undefined,
        cleanliness: undefined,
        smoking: undefined,
        pets: undefined,
        guests: undefined,
      },
    },
  });

  // Save function
  const saveProfile = useCallback(async (values: FormValues) => {
    if (!user || isLoading) return false;
    
    try {
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
        field_of_study: values.fieldOfStudy,
      };
      
      const completed = (values.profileImage && values.firstName && values.age && values.occupation && values.lifestyle) ? true : false;

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
        completed: completed,
        lifestyle: lifestyle,
        updated_at: new Date().toISOString()
      };
      
      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id);
        
      if (error) {
        throw error;
      }
      
      setHasUnsavedChanges(false);
      
      // Refresh user data
      try {
        await refreshUser();
      } catch (refreshError) {
        console.error("Error refreshing user after save:", refreshError);
      }
      
      return true;
      
    } catch (error: any) {
      console.error("Error saving profile:", error);
      toast({
        title: "Error al guardar",
        description: "Los cambios no se pudieron guardar.",
        variant: "destructive",
      });
      return false;
    }
  }, [user, refreshUser, toast, isLoading]);

  // Save when leaving the page or component
  useEffect(() => {
    const handleBeforeUnload = async (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
        
        // Try to save the data
        const values = form.getValues();
        await saveProfile(values);
      }
    };

    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'hidden' && hasUnsavedChanges) {
        const values = form.getValues();
        await saveProfile(values);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      
      // Save on unmount if there are unsaved changes
      if (hasUnsavedChanges) {
        const values = form.getValues();
        saveProfile(values);
      }
    };
  }, [hasUnsavedChanges, form, saveProfile]);

  // Watch for form changes to detect unsaved changes
  useEffect(() => {
    const subscription = form.watch((values) => {
      if (!isLoading && initialFormData) {
        // Compare current values with initial data to detect changes
        const hasChanges = JSON.stringify(values) !== JSON.stringify(initialFormData);
        setHasUnsavedChanges(hasChanges);
      }
    });
    return () => subscription.unsubscribe();
  }, [form, isLoading, initialFormData]);

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
          
          // Extract lifestyle data
          const lifestyleData = typeof profileData.lifestyle === 'object' && profileData.lifestyle !== null
            ? profileData.lifestyle as Record<string, unknown>
            : {};
          
          let occupationType: 'student' | 'professional' | 'entrepreneur' | 'other' = "other";
          if (profileData.ocupacion === "Estudiante") {
            occupationType = "student";
          } else if (profileData.ocupacion === "Profesional") {
            occupationType = "professional";
          } else if (profileData.ocupacion === "Emprendedor") {
            occupationType = "entrepreneur";
          } else if (profileData.ocupacion === "Otro") {
            occupationType = "other";
          }
          
          setShowUniversityField(occupationType === "student");
          
          const formData: FormValues = {
            firstName: profileData.first_name || '',
            lastName: profileData.last_name || '',
            username: profileData.username || '',
            email: user.email || "",
            bio: profileData.bio || "",
            age: profileData.edad || "",
            occupation: profileData.ocupacion || "",
            occupationType: occupationType,
            university: profileData.universidad || "",
            fieldOfStudy: lifestyleData.field_of_study as string || "",
            profileImage: profileData.profile_image || "",
            interests: profileData.interests || [],
            isProfileActive: profileData.is_profile_active !== false,
            completed: profileData.completed || false,
            lifestyle: {
              schedule: lifestyleData.schedule as any,
              cleanliness: lifestyleData.cleanliness as any,
              smoking: lifestyleData.smoking as any,
              pets: lifestyleData.pets as any,
              guests: lifestyleData.guests as any,
            },
          };
          
          form.reset(formData);
          setInitialFormData(formData);
          
        } catch (err) {
          console.error("Error loading profile data:", err);
          const defaultData: FormValues = {
            firstName: user.user_metadata?.firstName || "",
            lastName: user.user_metadata?.lastName || "",
            username: user.user_metadata?.username || "",
            email: user.email || "",
            bio: "",
            age: "",
            occupation: "",
            occupationType: "other",
            university: "",
            fieldOfStudy: "",
            profileImage: "",
            interests: [],
            isProfileActive: true,
            completed: false,
            lifestyle: {
              schedule: undefined,
              cleanliness: undefined,
              smoking: undefined,
              pets: undefined,
              guests: undefined,
            },
          };
          form.reset(defaultData);
          setInitialFormData(defaultData);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    fetchUserProfile();
  }, [user, form]);

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    
    const success = await saveProfile(values);
    
    if (success) {
      toast({
        title: "Perfil actualizado",
        description: "Tu información de perfil ha sido guardada.",
      });
      
      if (onSaved) {
        setTimeout(() => {
          window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'instant'
          });
          
          onSaved();
        }, 100);
      }
    }
    
    setIsSubmitting(false);
  }

  const handleCancelEdit = async () => {
    if (hasUnsavedChanges) {
      // Save before canceling
      const values = form.getValues();
      await saveProfile(values);
    }
    
    if (cancelEdit) {
      cancelEdit();
    }
  };

  const handleProfileStatusToggle = (active: boolean) => {
    form.setValue('isProfileActive', active);
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
          {/* Unsaved changes indicator */}
          {hasUnsavedChanges && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-amber-50 p-3 rounded-lg border border-amber-200">
              <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
              Tienes cambios sin guardar. Se guardarán automáticamente al salir de esta página.
            </div>
          )}
          
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
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-end mt-6">
          {cancelEdit && (
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleCancelEdit}
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
      </form>
    </Form>
  );
};

export default ProfileForm;
