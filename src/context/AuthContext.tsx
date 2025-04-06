
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
  signUp: (userData: UserSignUpData) => Promise<{ success: boolean; error?: any }>;
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

// Function to manually save session to localStorage
const saveSessionToLocalStorage = (session: Session | null): void => {
  if (session) {
    localStorage.setItem('homi-auth-session', JSON.stringify(session));
    console.log("Session saved to localStorage");
  } else {
    localStorage.removeItem('homi-auth-session');
    console.log("Session removed from localStorage");
  }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Monitor and log session changes for debugging
  useEffect(() => {
    if (session) {
      console.log("Session updated in state:", session.access_token.substring(0, 10) + "...");
    } else {
      console.log("Session cleared from state");
    }
  }, [session]);

  useEffect(() => {
    console.log("AuthProvider initializing");
    setLoading(true);
    
    // Set up the auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("Auth state changed:", event, currentSession ? "With session" : "No session");
        
        if (currentSession) {
          console.log("Session received in auth state change:", 
            currentSession.access_token ? currentSession.access_token.substring(0, 10) + "..." : "No access token");
          setSession(currentSession);
          
          // Manually save session to localStorage as a backup
          saveSessionToLocalStorage(currentSession);
          
          if (currentSession.user) {
            const authUser = currentSession.user;
            console.log("User ID from session:", authUser.id);
            
            // Use setTimeout to avoid lockup in auth state change callback
            setTimeout(async () => {
              try {
                const { data: profileData, error } = await supabase
                  .from('profiles')
                  .select('profile_image, first_name, last_name')
                  .eq('id', authUser.id)
                  .maybeSingle();
                
                if (!error && profileData) {
                  console.log("Profile data fetched successfully");
                  setUser({
                    ...authUser,
                    profile_image: profileData.profile_image
                  });
                } else {
                  console.log("No profile data found or error:", error);
                  setUser(authUser);
                }
              } catch (error) {
                console.error("Error fetching profile data:", error);
                setUser(authUser);
              } finally {
                setLoading(false);
              }
            }, 0);
          }
        } else {
          console.log("No session in auth state change");
          if (event === 'SIGNED_OUT') {
            // Clear session from localStorage on sign out
            localStorage.removeItem('homi-auth-session');
            setSession(null);
            setUser(null);
          }
          setLoading(false);
        }
      }
    );

    // Then check for an existing session
    const checkExistingSession = async () => {
      try {
        // First try to get session from Supabase
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        console.log("Initial session check:", currentSession ? "Found session" : "No session");
        
        if (currentSession?.user) {
          console.log("Setting session from getSession call");
          setSession(currentSession);
          
          // Ensure session is stored in localStorage
          saveSessionToLocalStorage(currentSession);
          
          const authUser = currentSession.user;
          
          try {
            const { data: profileData, error } = await supabase
              .from('profiles')
              .select('profile_image')
              .eq('id', authUser.id)
              .maybeSingle();
            
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
          // If no session from Supabase, check localStorage as fallback
          const sessionStr = localStorage.getItem('homi-auth-session');
          console.log("Checking localStorage for session:", sessionStr ? "Found" : "Not found");
          
          if (sessionStr) {
            try {
              const sessionData = JSON.parse(sessionStr);
              const isExpired = sessionData.expires_at && new Date(sessionData.expires_at * 1000) < new Date();
              
              if (!isExpired) {
                console.log("Using session from localStorage");
                // Set the session from localStorage
                setSession(sessionData);
                
                if (sessionData.user) {
                  console.log("Setting user from localStorage session");
                  setUser(sessionData.user);
                }
              } else {
                console.log("Session in localStorage is expired");
                localStorage.removeItem('homi-auth-session');
              }
            } catch (error) {
              console.error("Error parsing session from localStorage:", error);
            }
          } else {
            console.log("No existing session found in localStorage");
          }
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
          .maybeSingle();
        
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
      console.log("Starting signup process for:", userData.email);
      
      // Sign up the user
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

      if (authError) {
        console.error("Auth error during signup:", authError);
        throw authError;
      }
      
      console.log("Auth signup successful, user created:", authData.user?.id);
      
      if (authData.user) {
        // Create the user profile
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
        
        console.log("Profile created successfully");
        
        // Explicitly set session and user after signup
        if (authData.session) {
          console.log("Setting session from signup response");
          setSession(authData.session);
          setUser(authData.user);
          
          // Manually ensure session is stored in localStorage
          saveSessionToLocalStorage(authData.session);
        } else {
          console.warn("No session in signup response!");
        }
      }
      
      toast({
        title: "Cuenta creada con éxito",
        description: "Tu cuenta ha sido registrada. Por favor completa tu perfil.",
      });
      
      return { success: true };
    } catch (error: any) {
      console.error("SignUp error:", error);
      toast({
        title: "Error al crear la cuenta",
        description: error.message || "Ha ocurrido un error durante el registro.",
        variant: "destructive",
      });
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      console.log("Attempting to sign in user:", email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      console.log("Sign-in successful, session:", data.session ? "Exists" : "Missing");
      
      // Explicitly set session and user after signin
      if (data.session) {
        console.log("Session set after signin:", data.session.access_token.substring(0, 10) + "...");
        setSession(data.session);
        setUser(data.user);
        
        // Manually ensure session is stored in localStorage
        saveSessionToLocalStorage(data.session);
      }
      
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
      
      setUser(null);
      setSession(null);
      
      // Clear session from localStorage
      localStorage.removeItem('homi-auth-session');
      
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
