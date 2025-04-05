import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";

type ExtendedUser = User & {
  profile_image?: string | null;
};

type AuthContextType = {
  session: Session | null;
  user: ExtendedUser | null;
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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    console.log("AuthProvider initializing");
    
    // First set up the auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("Auth state changed:", event, currentSession ? "With session" : "No session");
        setSession(currentSession);
        
        if (currentSession?.user) {
          const authUser = currentSession.user;
          console.log("Session contains user, fetching profile data");
          
          try {
            const { data: profileData, error } = await supabase
              .from('profiles')
              .select('profile_image, first_name, last_name')
              .eq('id', authUser.id)
              .single();
            
            if (!error && profileData) {
              console.log("Profile data fetched successfully");
              setUser({
                ...authUser,
                profile_image: profileData.profile_image
              });
            } else {
              console.log("No profile data found or error", error);
              setUser(authUser);
            }
          } catch (error) {
            console.error("Error fetching profile data:", error);
            setUser(authUser);
          } finally {
            setLoading(false);
          }
        } else {
          console.log("No user in session");
          setUser(null);
          setLoading(false);
        }
      }
    );

    // Then check for an existing session
    const checkExistingSession = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        console.log("Initial session check:", currentSession ? "Found session" : "No session");
        
        if (currentSession?.user) {
          setSession(currentSession);
          const authUser = currentSession.user;
          
          try {
            const { data: profileData, error } = await supabase
              .from('profiles')
              .select('profile_image')
              .eq('id', authUser.id)
              .single();
            
            if (!error && profileData) {
              console.log("Profile data fetched from existing session");
              setUser({
                ...authUser,
                profile_image: profileData.profile_image
              });
            } else {
              console.log("Setting user from session without profile data");
              setUser(authUser);
            }
          } catch (error) {
            console.error("Error fetching profile data:", error);
            setUser(authUser);
          }
        } else {
          console.log("No existing session found");
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error checking session:", error);
        setLoading(false);
      }
    };
    
    checkExistingSession();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const refreshUser = async () => {
    try {
      console.log("Refreshing user data");
      const { data: { user: refreshedUser }, error } = await supabase.auth.getUser();
      if (error) throw error;
      
      if (refreshedUser) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('profile_image')
          .eq('id', refreshedUser.id)
          .single();
        
        if (!profileError && profileData) {
          console.log("User refreshed with profile data");
          setUser({
            ...refreshedUser,
            profile_image: profileData.profile_image
          });
        } else {
          console.log("User refreshed without profile data");
          setUser(refreshedUser);
        }
      }
      return;
    } catch (error: any) {
      console.error("Error refreshing user:", error.message);
    }
  };

  const signUp = async (userData: UserSignUpData) => {
    setLoading(true);
    try {
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
      
      if (authData.user) {
        const profileData = {
          id: authData.user.id,
          first_name: userData.firstName,
          last_name: userData.lastName,
          username: userData.username,
          email: userData.email
        };

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
        description: "Tu cuenta ha sido registrada. Por favor verifica tu correo electrónico.",
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
