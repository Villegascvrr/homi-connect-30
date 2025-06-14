import React, { useState, useEffect, useCallback, useRef } from 'react';
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
import { useIsMobile } from '@/hooks/use-mobile';

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
  apartmentStatus: z.enum(['looking', 'have']).default('looking'),
  ciudad: z.string().optional(),
  ciudad_otra: z.string().optional(),
  sevilla_zonas: z.array(z.string()).default([]),
  companeros_count: z.string().optional(),
  budget: z.string().optional(),
  room_count: z.string().optional(),
  room_price: z.string().optional(),
  apartment_description: z.string().optional(),
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
  const [apartmentStatus, setApartmentStatus] = useState<'looking' | 'have'>('looking');
  const [showUniversityField, setShowUniversityField] = useState(false);
  const [showFixedButtons, setShowFixedButtons] = useState(true);
  const formRef = useRef<HTMLFormElement>(null);
  const formEndRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

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
      apartmentStatus: 'looking',
      ciudad: "",
      ciudad_otra: "",
      sevilla_zonas: [],
      companeros_count: "",
      budget: "",
      room_count: "",
      room_price: "",
      apartment_description: "",
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

  useEffect(() => {
    const handleScroll = () => {
      if (!formEndRef.current) return;
      
      const formEnd = formEndRef.current.getBoundingClientRect().top;
      const viewportHeight = window.innerHeight;
      
      setShowFixedButtons(formEnd + (isMobile ? 150 : 30) > viewportHeight);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  // Save function
  const saveProfile = useCallback(async (values: FormValues) => {
    if (!user || isLoading) return false;
    
    try {
      // Handle city and zone logic
      let finalCity = values.ciudad;
      if (values.ciudad === 'Otro' && values.ciudad_otra) {
        finalCity = values.ciudad_otra;
      }
      
      // For backwards compatibility, store the location info in sevilla_zona
      let sevilla_zona_value = "";
      if (values.apartmentStatus === 'have') {
        sevilla_zona_value = 'tengo_piso';
      } else if (finalCity === 'Sevilla' && values.sevilla_zonas && values.sevilla_zonas.length > 0) {
        sevilla_zona_value = values.sevilla_zonas[0];
      } else if (finalCity) {
        sevilla_zona_value = finalCity;
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
        budget: values.budget,
        ciudad: finalCity,
        sevilla_zona: values.ciudad === 'Sevilla' && values.sevilla_zonas && values.sevilla_zonas.length > 0 ? values.sevilla_zonas[0] : undefined,
        sevilla_zonas: values.sevilla_zonas,
        room_count: values.room_count,
        room_price: values.room_price,
        apartment_description: values.apartment_description,
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
        sevilla_zona: sevilla_zona_value,
        completed: completed,
        companeros_count: values.companeros_count || '',
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
          
          let currentApartmentStatus: 'looking' | 'have' = 'looking';
          
          // Extract city and zone information
          let ciudad = "";
          let ciudad_otra = "";
          let sevilla_zonas: string[] = [];
          
          if (profileData.sevilla_zona) {
            // Check if it's the old format (just a zone) or new format
            const sevillaZones = [
              "Casco Antiguo", "Triana", "Los Remedios", "Nervión", 
              "San Pablo - Santa Justa", "Este - Alcosa - Torreblanca", 
              "Cerro - Amate", "Sur", "Bellavista - La Palmera", 
              "Macarena", "Norte", "Viapol", "El Plantinar", "El Juncal", 
              "Gran Plaza", "Otro/Alrededores"
            ];
            
            if (sevillaZones.includes(profileData.sevilla_zona)) {
              // Old format: it's a Sevilla zone
              ciudad = "Sevilla";
              sevilla_zonas = [profileData.sevilla_zona];
            } else if (profileData.sevilla_zona === 'tengo_piso') {
              currentApartmentStatus = 'have';
              ciudad = "Sevilla"; // Default to Sevilla for backwards compatibility
            } else {
              // It might be a city name
              ciudad = profileData.sevilla_zona;
            }
          }

          // Handle new format where sevilla_zonas might be stored in lifestyle
          const lifestyleData = typeof profileData.lifestyle === 'object' && profileData.lifestyle !== null
            ? profileData.lifestyle as Record<string, unknown>
            : {};
          
          // Check if sevilla_zonas is stored in lifestyle object
          if (lifestyleData.sevilla_zonas && Array.isArray(lifestyleData.sevilla_zonas)) {
            sevilla_zonas = lifestyleData.sevilla_zonas as string[];
            if (sevilla_zonas.length > 0) {
              ciudad = "Sevilla";
            }
          }
          
          setApartmentStatus(currentApartmentStatus);
          
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
            apartmentStatus: currentApartmentStatus,
            ciudad: ciudad,
            ciudad_otra: ciudad_otra,
            sevilla_zonas: sevilla_zonas,
            companeros_count: profileData.companeros_count || "",
            budget: lifestyleData.budget as string || "",
            room_count: lifestyleData.room_count as string || "",
            room_price: lifestyleData.room_price as string || "",
            apartment_description: lifestyleData.apartment_description as string || "",
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
            apartmentStatus: 'looking',
            ciudad: "",
            ciudad_otra: "",
            sevilla_zonas: [],
            companeros_count: "",
            budget: "",
            room_count: "",
            room_price: "",
            apartment_description: "",
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
  
  const handleApartmentStatusChange = (status: 'looking' | 'have') => {
    setApartmentStatus(status);
    form.setValue('apartmentStatus', status);
  };

  const handleOccupationTypeChange = (type: string) => {
    form.setValue('occupationType', type as any);
    setShowUniversityField(type === "student");
  };

  const renderButtons = () => (
    <div className="flex flex-col sm:flex-row gap-4 justify-end">
      <Button 
        type="submit" 
        className={`w-full sm:w-auto bg-homi-purple hover:bg-homi-purple/90 transition-all duration-200 shadow-lg hover:shadow-xl`}
        size="auto" 
        wrap="normal" 
        disabled={isSubmitting}
      >
        <span className="button-text-container">
          {isSubmitting ? "Guardando..." : "Guardar cambios"}
        </span>
      </Button>     
      {cancelEdit && (
        <Button 
          type="button" 
          variant="outline" 
          onClick={cancelEdit}
          className={`w-full sm:w-auto transition-all duration-200 shadow-lg hover:shadow-xl`}
        >
          Cancelar
        </Button>
      )}
    </div>
  );

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
      <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
          
          <ProfileApartmentPreferences 
            form={form} 
            apartmentStatus={apartmentStatus}
            onApartmentStatusChange={handleApartmentStatusChange}
          />
        </div>

        {/* Botones flotantes */}
        {showFixedButtons && (
          <div className="fixed bottom-0 left-0 right-0 z-50 sm:bottom-4">
            <div className="max-w-4xl mx-auto px-0 sm:px-6">
              <div className={`bg-white p-4 ${isMobile ? '' : 'rounded-lg'} sm:w-fit sm:ml-auto border border-homi-purple/30`}>
                {renderButtons()}
              </div>
            </div>
          </div>
        )}

        {/* Elemento para detectar el final del formulario */}
        <div ref={formEndRef} className="h-1" />
        
        {/* Botones fijos al final */}
        <div className="bg-white p-4 rounded-lg sm:w-fit sm:ml-auto border border-homi-purple/30">
          {renderButtons()}
        </div>
      </form>
    </Form>
  );
};

export default ProfileForm;
