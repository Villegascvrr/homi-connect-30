
import { useState, useCallback, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase, checkEmailExists } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface UserSignUpData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  username: string;
}

export interface ExtendedUser extends User {
  profile_image?: string | null;
}

/**
 * Helper function to save session to localStorage
 */
const saveSessionToLocalStorage = (session: Session | null): void => {
  if (session) {
    try {
      const sessionJson = JSON.stringify(session);
      localStorage.setItem('homi-auth-session', sessionJson);
      console.log("Session saved to localStorage");
      
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

/**
 * Helper function to extract username from email
 */
const extractUsernameFromEmail = (email: string): string => {
  if (!email) return '';
  
  const username = email.split('@')[0];
  return username.replace(/[^a-zA-Z0-9_]/g, '').toLowerCase();
};

/**
 * Cleanup auth storage (used during sign out)
 */
const cleanupAuthStorage = (): void => {
  // Clear all possible auth-related storage
  localStorage.removeItem('homi-auth-session');
  localStorage.removeItem('supabase.auth.token');
  localStorage.removeItem('auth.token');
  
  // Clear cookies
  document.cookie.split(";").forEach(function(c) {
    document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
  });

  // Clear any other potential auth storage
  try {
    const localStorageKeys = Object.keys(localStorage);
    localStorageKeys.forEach(key => {
      if (key.includes('supabase') || key.includes('auth') || key.includes('session')) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.error("Error cleaning up localStorage:", error);
  }
};

/**
 * Custom hook that handles all authentication logic
 */
export const useAuthLogic = () => {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEmailVerified, setIsEmailVerified] = useState(true);
  const [authKey, setAuthKey] = useState<string>('initial');
  const { toast } = useToast();
  const [isInternalAction, setIsInternalAction] = useState(false);

  /**
   * Refreshes the current user data
   */
  const refreshUser = useCallback(async () => {
    try {
      console.log("Refreshing user data");
      setIsInternalAction(true);
      
      const { data: sessionData, error: sessionError } = await supabase.auth.refreshSession();
      if (sessionError) {
        console.error("Error refreshing session:", sessionError);
      } else if (sessionData.session) {
        console.log("Session refreshed during user refresh");
        setSession(sessionData.session);
        saveSessionToLocalStorage(sessionData.session);
      }
      
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
      setIsInternalAction(false);
      return;
    } catch (error: any) {
      console.error("Error refreshing user:", error.message);
      setIsInternalAction(false);
    }
  }, []);

  /**
   * Initiates Google OAuth sign in
   */
  const signInWithGoogle = useCallback(async () => {
    setLoading(true);
    setIsInternalAction(true);
    try {
      console.log("Iniciando proceso unificado de autenticación con Google");
      
      // Using the exported function from supabase client
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/verified`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
          scopes: 'email profile',
        },
      });
      
    } catch (error: any) {
      console.error("Error en autenticación con Google:", error);
      toast({
        title: "Error al autenticar con Google",
        description: error.message || "Ha ocurrido un error durante la autenticación con Google.",
        variant: "destructive",
      });
      setLoading(false);
      setIsInternalAction(false);
    }
  }, [toast]);

  /**
   * Validates if email already exists before registration
   */
  const validateEmailNotInUse = useCallback(async (email: string): Promise<boolean> => {
    try {
      console.log("Checking if email exists:", email);
      setIsInternalAction(true);
      
      // First check in profiles table
      const { data, error } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', email)
        .maybeSingle();
      
      if (data) {
        console.log("Email exists in profiles table:", email);
        setIsInternalAction(false);
        return false;
      }
      
      // Then check in auth.users using our secure method
      const emailExists = await checkEmailExists(email);
      console.log(`Email exists in auth system: ${emailExists ? "yes" : "no"}`);
      setIsInternalAction(false);
      return !emailExists;
      
    } catch (error) {
      console.error("Error checking if email exists:", error);
      setIsInternalAction(false);
      return false; // Safe fallback, prevent registration if unsure
    }
  }, []);

  /**
   * Signs up a new user
   */
  const signUp = useCallback(async (userData: UserSignUpData) => {
    setLoading(true);
    setIsInternalAction(true);
    try {
      console.log("Starting signup process for:", userData.email);
      
      // Validate required fields
      if (!userData.email || !userData.password || !userData.firstName || 
          !userData.lastName || !userData.username) {
        toast({
          title: "Datos incompletos",
          description: "Todos los campos son obligatorios para crear una cuenta.",
          variant: "destructive",
        });
        setLoading(false);
        setIsInternalAction(false);
        return { success: false, error: { message: "Missing required fields" } };
      }
      
      // Check if email already exists
      const isEmailAvailable = await validateEmailNotInUse(userData.email);
      if (!isEmailAvailable) {
        console.log("Email already exists, cannot register:", userData.email);
        toast({
          title: "Correo ya registrado",
          description: "Este correo electrónico ya está registrado. Por favor, inicia sesión o usa otro correo.",
          variant: "destructive",
        });
        setLoading(false);
        setIsInternalAction(false);
        return { success: false, error: { message: "Email already registered" } };
      }
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            firstName: userData.firstName,
            lastName: userData.lastName,
            username: userData.username
          },
          emailRedirectTo: window.location.origin + '/verified',
        },
      });

      if (authError) {
        console.error("Auth error during signup:", authError);
        setIsInternalAction(false);
        throw authError;
      }
      
      console.log("Auth signup successful, user created:", authData.user?.id);
      
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
        
        console.log("Profile created successfully");
        
        if (authData.session) {
          console.log("Setting session from signup response");
          setSession(authData.session);
          setUser(authData.user);
          
          saveSessionToLocalStorage(authData.session);
        } else {
          console.warn("No session in signup response!");
        }
      }
      
      toast({
        title: "Cuenta creada con éxito",
        description: "Ya puedes comenzar a usar tu cuenta.",
      });
      
      // Allow the UI to update before redirecting
      setTimeout(() => {
        window.location.href = '/?registered=true';
      }, 500);
      
      setIsInternalAction(false);
      return { success: true };
    } catch (error: any) {
      console.error("SignUp error:", error);
      if (error.message?.includes('email') || error.message?.includes('already')) {
        toast({
          title: "Correo ya registrado",
          description: "Este correo electrónico ya está registrado. Por favor, inicia sesión o usa otro correo.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error al crear la cuenta",
          description: error.message || "Ha ocurrido un error durante el registro.",
          variant: "destructive",
        });
      }
      setIsInternalAction(false);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  }, [toast, validateEmailNotInUse]);

  /**
   * Signs in an existing user
   */
  const signIn = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setIsInternalAction(true);
    try {
      console.log("Attempting to sign in user:", email);
      
      if (!email || !password) {
        toast({
          title: "Datos incompletos",
          description: "El email y la contraseña son obligatorios.",
          variant: "destructive",
        });
        setLoading(false);
        setIsInternalAction(false);
        return;
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Login error:", error);
        setIsInternalAction(false);
        throw error;
      }
      
      console.log("Sign-in successful, session:", data.session ? "Exists" : "Missing");
      
      if (data.session) {
        console.log("Session set after signin");
        setSession(data.session);
        setUser(data.user);
        
        saveSessionToLocalStorage(data.session);
        
        toast({
          title: "Inicio de sesión exitoso",
          description: "Has iniciado sesión en tu cuenta.",
        });
        
        // Allow the UI to update before redirecting
        setTimeout(() => {
          window.location.href = '/?loggedIn=true';
        }, 300);
      } else {
        throw new Error("No session returned after login");
      }
      
    } catch (error: any) {
      console.error("Sign in error:", error);
      toast({
        title: "Error al iniciar sesión",
        description: error.message === "Invalid login credentials" 
          ? "Credenciales inválidas. Verifica tu email y contraseña."
          : (error.message || "Ha ocurrido un error durante el inicio de sesión."),
        variant: "destructive",
      });
      setIsInternalAction(false);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  /**
   * Signs out the current user
   */
  const signOut = useCallback(async () => {
    try {
      console.log("Starting sign out process...");
      
      setLoading(true);
      setIsInternalAction(true);
      
      const wasAuthenticated = !!user;
      
      // First, clear our local state
      setUser(null);
      setSession(null);
      
      // Then clean up all storage
      cleanupAuthStorage();
      
      // Finally, call the API to sign out
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      
      if (error) {
        console.error("Error during API signout:", error);
        toast({
          title: "Error al cerrar sesión",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Sesión cerrada",
          description: "Has cerrado sesión correctamente.",
        });
        
        setAuthKey('signed-out-' + Date.now());
        
        if (wasAuthenticated) {
          // Allow the UI to update before redirecting
          setTimeout(() => {
            window.location.href = '/';
          }, 300);
        }
      }
      setIsInternalAction(false);
    } catch (error: any) {
      console.error("Exception during signout:", error);
      toast({
        title: "Error al cerrar sesión",
        description: error.message || "Ha ocurrido un error al cerrar sesión.",
        variant: "destructive",
      });
      setIsInternalAction(false);
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  // Set up auth state listener and check for existing session
  useEffect(() => {
    console.log("AuthLogic initializing with key:", authKey);
    let isMounted = true;
    setLoading(true);
    
    // 1. Set up auth state change listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        // Skip internal auth actions to prevent re-rendering loops
        if (isInternalAction) {
          console.log("Skipping auth event due to internal action:", event);
          return;
        }
        
        console.log("Auth state changed:", event, currentSession ? "With session" : "No session");
        
        if (!isMounted) {
          console.log("Component unmounted, skipping auth state update");
          return;
        }
        
        if (currentSession) {
          console.log("Session received in auth state change");
          
          if (isMounted) {
            setSession(currentSession);
            saveSessionToLocalStorage(currentSession);
          }
          
          if (currentSession.user && isMounted) {
            const authUser = currentSession.user;
            console.log("User ID from session:", authUser.id);
            
            setIsEmailVerified(true);
            
            // Using setTimeout to avoid potential deadlock with Supabase auth state
            setTimeout(async () => {
              if (!isMounted) return;
              
              try {
                let { data: profileData, error } = await supabase
                  .from('profiles')
                  .select('profile_image, first_name, last_name')
                  .eq('id', authUser.id)
                  .maybeSingle();
                
                if (!isMounted) return;
                
                if (error || !profileData) {
                  console.log("Profile not found or error, checking if we should create one for Google user");
                  
                  // Create profile for Google users if needed
                  if (event === 'SIGNED_IN' && authUser.app_metadata?.provider === 'google') {
                    const name = authUser.user_metadata?.full_name || authUser.user_metadata?.name || '';
                    const nameParts = name.split(' ');
                    const firstName = nameParts[0] || '';
                    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
                    
                    const usernameFromEmail = extractUsernameFromEmail(authUser.email || '');
                    
                    const newProfile = {
                      id: authUser.id,
                      first_name: firstName,
                      last_name: lastName,
                      username: usernameFromEmail,
                      email: authUser.email,
                      profile_image: null
                    };
                    
                    console.log("Creating profile for Google user:", newProfile);
                    
                    const { error: insertError } = await supabase
                      .from('profiles')
                      .upsert(newProfile, { onConflict: 'id' });
                    
                    if (!isMounted) return;
                    
                    if (!insertError) {
                      profileData = newProfile;
                      console.log("Created new profile for Google user");
                    } else {
                      console.error("Error creating profile for Google user:", insertError);
                    }
                  }
                }
                
                if (profileData && isMounted) {
                  console.log("Profile data fetched successfully");
                  setUser({
                    ...authUser,
                    profile_image: profileData.profile_image
                  });
                } else if (isMounted) {
                  console.log("No profile data found or error:", error);
                  setUser(authUser);
                }
              } catch (error) {
                console.error("Error fetching profile data:", error);
                if (isMounted) {
                  setUser(authUser);
                }
              } finally {
                if (isMounted) {
                  setLoading(false);
                }
              }
            }, 0);
          }
        } else {
          console.log("No session in auth state change");
          if (event === 'SIGNED_OUT' && isMounted) {
            cleanupAuthStorage();
            setSession(null);
            setUser(null);
            setIsEmailVerified(false);
          }
          if (isMounted) {
            setLoading(false);
          }
        }
      }
    );

    // 2. THEN check for existing session
    const checkExistingSession = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        console.log("Initial session check:", currentSession ? "Found session" : "No session");
        
        if (!isMounted) return;
        
        if (currentSession?.user) {
          console.log("Setting session from getSession call");
          setSession(currentSession);
          
          saveSessionToLocalStorage(currentSession);
          
          const authUser = currentSession.user;
          setIsEmailVerified(authUser.email_confirmed_at !== null);
          
          try {
            const { data: profileData, error } = await supabase
              .from('profiles')
              .select('profile_image')
              .eq('id', authUser.id)
              .maybeSingle();
            
            if (!isMounted) return;
            
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
            if (isMounted) {
              setUser(authUser);
            }
          }
        } else {
          const sessionStr = localStorage.getItem('homi-auth-session');
          console.log("Checking localStorage for session:", sessionStr ? "Found" : "Not found");
          
          if (sessionStr && isMounted) {
            try {
              const sessionData = JSON.parse(sessionStr);
              const isExpired = sessionData.expires_at && new Date(sessionData.expires_at * 1000) < new Date();
              
              if (!isExpired) {
                console.log("Using session from localStorage");
                setSession(sessionData);
                
                if (sessionData.user) {
                  setUser(sessionData.user);
                  
                  // Try to refresh the session
                  supabase.auth.refreshSession().then(({ data }) => {
                    if (!isMounted) return;
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
        
        if (isMounted) {
          setLoading(false);
        }
      } catch (error) {
        console.error("Error checking session:", error);
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    checkExistingSession();

    // Set timeout to prevent infinite loading state
    const loadingTimeout = setTimeout(() => {
      if (isMounted && loading) {
        console.log("Auth loading timeout reached, forcing completion");
        setLoading(false);
      }
    }, 3000);

    return () => {
      isMounted = false;
      subscription.unsubscribe();
      clearTimeout(loadingTimeout);
    };
  }, [authKey, isInternalAction]);

  return {
    user,
    session,
    loading,
    isEmailVerified,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    refreshUser,
    validateEmailNotInUse
  };
};
