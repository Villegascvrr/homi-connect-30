
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (userData: UserSignUpData) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
  refreshUser: () => Promise<void>;
};

export interface UserSignUpData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  username: string;
  edad?: string;
  ubicacion?: string;
  ocupacion?: string;
  universidad?: string;
  bio?: string;
  profileImage?: string;
  galleryImages?: string[];
  interests?: string[];
  lifestyle?: any;
  sevilla_zona?: string;
  companeros_count?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth state changed:", event);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log("Initial session check:", currentSession ? "Found session" : "No session");
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const refreshUser = async () => {
    try {
      const { data: { user: refreshedUser }, error } = await supabase.auth.getUser();
      if (error) throw error;
      if (refreshedUser) {
        setUser(refreshedUser);
      }
      return;
    } catch (error: any) {
      console.error("Error refreshing user:", error.message);
    }
  };

  const signUp = async (userData: UserSignUpData) => {
    setLoading(true);
    try {
      // First, sign up the user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            firstName: userData.firstName,
            lastName: userData.lastName,
            username: userData.username
          },
        },
      });

      if (authError) throw authError;
      
      // If the signup was successful and we have a user
      if (authData.user) {
        // Create a profile record with additional user data
        const profileData = {
          id: authData.user.id,
          first_name: userData.firstName,
          last_name: userData.lastName,
          username: userData.username,
          email: userData.email,
          edad: userData.edad || null,
          ubicacion: userData.ubicacion || null,
          ocupacion: userData.ocupacion || null,
          universidad: userData.universidad || null,
          bio: userData.bio || null,
          profile_image: userData.profileImage || null,
          gallery_images: userData.galleryImages || [],
          interests: userData.interests || [],
          lifestyle: userData.lifestyle || null,
          sevilla_zona: userData.sevilla_zona || null,
          companeros_count: userData.companeros_count || null,
          // Add preferences when specified
          hasApartment: userData.lifestyle?.hasApartment || false,
          genderPreference: userData.lifestyle?.genderPreference || null,
          smokingPreference: userData.lifestyle?.smokingPreference || null,
          occupationPreference: userData.lifestyle?.occupationPreference || null,
          minAge: userData.lifestyle?.minAge || null,
          maxAge: userData.lifestyle?.maxAge || null,
          exactPrice: userData.lifestyle?.exactPrice || null
        };

        // Insert or update profile record
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert(profileData, { onConflict: 'id' });

        if (profileError) {
          console.error("Error creating profile:", profileError.message);
          throw profileError;
        }
      }
      
      toast({
        title: "Cuenta creada con éxito",
        description: "Tu perfil ha sido registrado. Por favor verifica tu correo electrónico.",
      });
    } catch (error: any) {
      toast({
        title: "Error al crear la cuenta",
        description: error.message || "Ha ocurrido un error durante el registro.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = async (userId: string, profileData: Partial<Omit<UserSignUpData, 'password'>>) => {
    try {
      const profileUpdateData: Record<string, any> = {
        edad: profileData.edad,
        ubicacion: profileData.ubicacion,
        ocupacion: profileData.ocupacion,
        universidad: profileData.universidad,
        bio: profileData.bio,
        profile_image: profileData.profileImage,
        gallery_images: profileData.galleryImages,
        interests: profileData.interests,
        lifestyle: profileData.lifestyle,
        sevilla_zona: profileData.sevilla_zona,
        companeros_count: profileData.companeros_count
      };

      Object.keys(profileUpdateData).forEach(key => {
        if (profileUpdateData[key] === undefined) {
          delete profileUpdateData[key];
        }
      });

      const { error } = await supabase
        .from('profiles')
        .update(profileUpdateData)
        .eq('id', userId);

      if (error) throw error;

      return true;
    } catch (error: any) {
      console.error("Error updating profile:", error.message);
      return false;
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      toast({
        title: "Inicio de sesión exitoso",
        description: "Has iniciado sesión en tu cuenta.",
      });
    } catch (error: any) {
      toast({
        title: "Error al iniciar sesión",
        description: error.message || "Credenciales incorrectas.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión correctamente.",
      });
    } catch (error: any) {
      toast({
        title: "Error al cerrar sesión",
        description: error.message || "Ha ocurrido un error al cerrar sesión.",
        variant: "destructive",
      });
    }
  };

  const value = {
    session,
    user,
    signIn,
    signUp,
    signOut,
    loading,
    refreshUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
