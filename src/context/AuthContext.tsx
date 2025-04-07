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
  signInWithGoogle: () => Promise<void>;
  signUp: (userData: UserSignUpData) => Promise<{ success: boolean; error?: any }>;
  signOut: () => Promise<void>;
  loading: boolean;
  refreshUser: () => Promise<void>;
  isEmailVerified: boolean;
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
    try {
      const sessionJson = JSON.stringify(session);
      localStorage.setItem('homi-auth-session', sessionJson);
      console.log("Session saved to localStorage:", sessionJson.substring(0, 50) + "...");
      
      // Verify storage was successful
      const stored = localStorage.getItem('homi-auth-session');
      if (!stored) {
        console.warn("Failed to verify session storage, retrying...");
        localStorage.setItem('homi-auth-session', sessionJson);
      } else {
        console.log("Session stored successfully");
      }
    } catch (error) {
      console.error("Error saving session to localStorage:", error);
    }
  } else {
    localStorage.removeItem('homi-auth-session');
    console.log("Session removed from localStorage");
  }
};

// Function to extract username from email
const extractUsernameFromEmail = (email: string): string => {
  if (!email) return '';
  
  // Get the part before @ symbol
  const username = email.split('@')[0];
  
  // Remove any special characters that might not be allowed in usernames
  return username.replace(/[^a-zA-Z0-9_]/g, '').toLowerCase();
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEmailVerified, setIsEmailVerified] = useState(true);
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
    
    // Set up the auth state change listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("Auth state changed:", event, currentSession ? "With session" : "No session");
        
        if (currentSession) {
          console.log("Session received in auth state change:", 
            currentSession.access_token ? currentSession.access_token.substring(0, 10) + "..." : "No access token");
          
          // Set session immediately
          setSession(currentSession);
          
          // Manually save session to localStorage with aggressive verification
          saveSessionToLocalStorage(currentSession);
          
          if (currentSession.user) {
            const authUser = currentSession.user;
            console.log("User ID from session:", authUser.id);
            
            // Siempre consideramos el email como verificado
            setIsEmailVerified(true);
            
            // Use setTimeout to avoid lockup in auth state change callback
            setTimeout(async () => {
              try {
                // Check if profile exists first
                let { data: profileData, error } = await supabase
                  .from('profiles')
                  .select('profile_image, first_name, last_name')
                  .eq('id', authUser.id)
                  .maybeSingle();
                
                if (error || !profileData) {
                  console.log("Profile not found or error, checking if we should create one for Google user");
                  
                  // For Google login, we might need to create a profile if it doesn't exist
                  if (event === 'SIGNED_IN' && authUser.app_metadata?.provider === 'google') {
                    const name = authUser.user_metadata?.full_name || authUser.user_metadata?.name || '';
                    const nameParts = name.split(' ');
                    const firstName = nameParts[0] || '';
                    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
                    
                    // Create a username from the email
                    const usernameFromEmail = extractUsernameFromEmail(authUser.email || '');
                    
                    const newProfile = {
                      id: authUser.id,
                      first_name: firstName,
                      last_name: lastName,
                      username: usernameFromEmail, // Use the username extracted from email
                      email: authUser.email,
                      profile_image: null // Add profile_image field with null value
                    };
                    
                    console.log("Creating profile for Google user:", newProfile);
                    
                    const { error: insertError } = await supabase
                      .from('profiles')
                      .upsert(newProfile, { onConflict: 'id' });
                    
                    if (!insertError) {
                      profileData = newProfile;
                      console.log("Created new profile for Google user");
                    } else {
                      console.error("Error creating profile for Google user:", insertError);
                    }
                  }
                }
                
                if (profileData) {
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
            setIsEmailVerified(false);
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
          
          // Ensure session is stored in localStorage with verification
          saveSessionToLocalStorage(currentSession);
          
          const authUser = currentSession.user;
          setIsEmailVerified(authUser.email_confirmed_at !== null);
          
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
                  
                  // Try to refresh the session with Supabase
                  supabase.auth.refreshSession().then(({ data }) => {
                    if (data.session) {
                      console.log("Session refreshed successfully");
                      setSession(data.session);
                      saveSessionToLocalStorage(data.session);
                    }
                  }).catch(err => {
                    console.error("Error refreshing session:", err);
                  });
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
      
      // First refresh the session to ensure we have the latest token
      const { data: sessionData, error: sessionError } = await supabase.auth.refreshSession();
      if (sessionError) {
        console.error("Error refreshing session:", sessionError);
      } else if (sessionData.session) {
        console.log("Session refreshed during user refresh");
        setSession(sessionData.session);
        saveSessionToLocalStorage(sessionData.session);
      }
      
      // Now get the latest user data
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

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      console.log("Iniciando proceso de autenticación con Google");
      
      // Usamos la nueva función optimizada para el inicio de sesión con Google
      await signInWithGoogleOAuth();
      
      // No necesitamos hacer nada más aquí, la redirección ocurrirá automáticamente
      // y el listener de onAuthStateChange manejará la actualización del estado
    } catch (error: any) {
      console.error("Error en autenticación con Google:", error);
      toast({
        title: "Error al iniciar sesión con Google",
        description: error.message || "Ha ocurrido un error durante el inicio de sesión con Google.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const signInWithGoogleOAuth = async () => {
    const redirectUrl = `${window.location.origin}/verified`;
    console.log("URL de redirección configurada:", redirectUrl);
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
        scopes: 'email profile'
      },
    });

    if (error) throw error;
    
    console.log("Redirección a autenticación de Google iniciada:", data);
  };

  const signUp = async (userData: UserSignUpData) => {
    setLoading(true);
    try {
      console.log("Starting signup process for:", userData.email);
      
      // Sign up the user with auto-confirm true
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            firstName: userData.firstName,
            lastName: userData.lastName,
            username: userData.username
          },
          emailRedirectTo: window.location.origin,
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
        
        // Explicitly set session and user after signup with aggressive storage
        if (authData.session) {
          console.log("Setting session from signup response");
          setSession(authData.session);
          setUser(authData.user);
          
          // Force session storage in localStorage with verification
          saveSessionToLocalStorage(authData.session);
          
          // Double-check storage was successful
          const verifyStorage = localStorage.getItem('homi-auth-session');
          if (!verifyStorage) {
            console.warn("Session storage verification failed, retrying...");
            saveSessionToLocalStorage(authData.session);
          }
        } else {
          console.warn("No session in signup response!");
        }
        
        // Multiple attempts to refresh the session
        const refreshAttempts = [500, 1000, 2000]; // Increasing delays
        
        for (const delay of refreshAttempts) {
          setTimeout(async () => {
            try {
              const { data } = await supabase.auth.refreshSession();
              if (data.session) {
                console.log(`Session refreshed after signup (delay: ${delay}ms)`);
                setSession(data.session);
                saveSessionToLocalStorage(data.session);
                return; // Exit if successful
              }
            } catch (e) {
              console.error(`Error refreshing session after signup (delay: ${delay}ms):`, e);
            }
          }, delay);
        }
      }
      
      toast({
        title: "Cuenta creada con éxito",
        description: "Ya puedes comenzar a usar tu cuenta.",
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

      if (error) {
        console.error("Login error:", error);
        throw error;
      }
      
      console.log("Sign-in successful, session:", data.session ? "Exists" : "Missing");
      
      // Explicitly set session and user after signin
      if (data.session) {
        console.log("Session set after signin:", data.session.access_token.substring(0, 10) + "...");
        setSession(data.session);
        setUser(data.user);
        
        // Manually ensure session is stored in localStorage
        saveSessionToLocalStorage(data.session);
        
        // Navigate to home after successful login with the loggedIn parameter
        setTimeout(() => {
          window.location.href = '/?loggedIn=true';
        }, 500);
      } else {
        throw new Error("No session returned after login");
      }
      
      toast({
        title: "Inicio de sesión exitoso",
        description: "Has iniciado sesión en tu cuenta.",
      });
    } catch (error: any) {
      console.error("Sign in error:", error);
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
      // First clear local state before attempting to sign out from Supabase
      // This ensures the UI responds immediately regardless of API response
      const currentUser = user;
      setUser(null);
      setSession(null);
      
      // Clear session from localStorage
      localStorage.removeItem('homi-auth-session');
      
      // Attempt to sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      // If there's an error but we've already cleared the local state,
      // we can still consider it a "successful" sign out from the user's perspective
      if (error) {
        console.error("Error during API signout:", error);
        // Only show error if it's likely to affect the user experience
        if (error.message !== "Session not found") {
          toast({
            title: "Advertencia",
            description: "Sesión cerrada localmente. " + error.message,
            variant: "default",
          });
        }
      } else {
        toast({
          title: "Sesión cerrada",
          description: "Has cerrado sesión correctamente.",
        });
      }
    } catch (error: any) {
      console.error("Exception during signout:", error);
      toast({
        title: "Error al cerrar sesión",
        description: error.message || "Ha ocurrido un error al cerrar sesión.",
        variant: "destructive",
      });
      
      // Even if there's an exception, we should ensure the user is logged out locally
      setUser(null);
      setSession(null);
      localStorage.removeItem('homi-auth-session');
    }
  };

  const value = {
    session,
    user,
    signIn,
    signInWithGoogle,
    signUp,
    signOut,
    loading,
    refreshUser,
    isEmailVerified
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
