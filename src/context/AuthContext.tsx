
import React, { createContext, useContext } from "react";
import { Session } from "@supabase/supabase-js";
import { useAuthLogic, UserSignUpData, ExtendedUser } from "@/hooks/useAuthLogic";

/**
 * Authentication context type definition
 */
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
  checkEmailExists: (email: string) => Promise<boolean>;
};

// Create the context with undefined as default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Provider component that wraps the app and makes auth available
 */
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const {
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
  } = useAuthLogic();

  // Define checkEmailExists to maintain API compatibility
  const checkEmailExists = async (email: string): Promise<boolean> => {
    return !(await validateEmailNotInUse(email));
  };

  // Value provided to consuming components
  const value = {
    session,
    user,
    signIn,
    signInWithGoogle,
    signUp,
    signOut,
    loading,
    refreshUser,
    isEmailVerified,
    checkEmailExists
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook for components to get authentication data and functions
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Re-export types for use elsewhere
export type { UserSignUpData, ExtendedUser };
