
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
};

export type UserSignUpData = {
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
  lifestyle?: {
    morningPerson: boolean;
    nightPerson: boolean;
    socializing: string;
    cleanliness: string;
    noise: string;
  };
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (userData: UserSignUpData) => {
    setLoading(true);
    try {
      // Register the user with Supabase auth
      const { error } = await supabase.auth.signUp({
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

      if (error) throw error;
      
      // After signup, the trigger will create a basic profile, but we need to wait for it
      // We'll update the profile information after the user completes the first login
      // The updateUserProfile function can be called separately once user is authenticated
      
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
      // Create an object with the profile data in the proper format for Supabase
      const profileUpdateData: Record<string, any> = {
        edad: profileData.edad,
        ubicacion: profileData.ubicacion,
        ocupacion: profileData.ocupacion,
        universidad: profileData.universidad,
        bio: profileData.bio,
        profile_image: profileData.profileImage,
        gallery_images: profileData.galleryImages,
        interests: profileData.interests,
        lifestyle: profileData.lifestyle
      };

      // Only include fields that are defined
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
    loading
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
