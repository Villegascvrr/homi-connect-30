
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import DemoBanner from "../layout/DemoBanner";
import { useEffect, useState } from "react";
import { hasStoredSession } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowPreview?: boolean;
  previewComponent?: React.ReactNode;
  demoMessage?: string;
}

/**
 * Improved ProtectedRoute component with more stable auth state handling
 * and smoother transitions between authenticated states
 */
const ProtectedRoute = ({ 
  children, 
  allowPreview = false,
  previewComponent,
  demoMessage
}: ProtectedRouteProps) => {
  const { user, session, loading } = useAuth();
  const location = useLocation();
  const [localCheckComplete, setLocalCheckComplete] = useState(false);
  const [hasLocalSession, setHasLocalSession] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [maxWaitTimeReached, setMaxWaitTimeReached] = useState(false);
  
  // Check for local session on mount - this happens quickly to avoid flicker
  useEffect(() => {
    const localSessionExists = hasStoredSession();
    setHasLocalSession(localSessionExists);
    setLocalCheckComplete(true);
    
    console.log("Local session check:", localSessionExists ? "Valid session found" : "No valid session");
    
    // Set a timeout to prevent infinite loading state
    const timeoutId = setTimeout(() => {
      setMaxWaitTimeReached(true);
      console.log("Max wait time reached, forcing auth check completion");
    }, 1500); // Shorter timeout for better UX
    
    return () => clearTimeout(timeoutId);
  }, []);

  // For debugging
  useEffect(() => {
    console.log("Protected route accessed:", {
      path: location.pathname,
      isAuthenticated: !!user,
      hasSession: !!session,
      hasLocalSession: hasLocalSession,
      isLoading: loading,
      localCheckComplete: localCheckComplete,
      allowsPreview: allowPreview,
      isNavigating: isNavigating,
      maxWaitTimeReached: maxWaitTimeReached
    });
  }, [location.pathname, user, session, loading, allowPreview, hasLocalSession, 
      localCheckComplete, isNavigating, maxWaitTimeReached]);

  // Prevent re-renders during navigation
  useEffect(() => {
    if (isNavigating) {
      return;
    }
  }, [isNavigating]);

  // Check if we can make an auth determination
  const canDetermineAuth = localCheckComplete || maxWaitTimeReached || !loading;
  
  // Show loading state only for a reasonable time
  if (!canDetermineAuth) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-homi-purple" />
        <p className="text-sm text-muted-foreground mt-4">Verificando sesión...</p>
      </div>
    );
  }

  // Immediately check if user is authenticated to avoid multiple renders
  const isAuthenticated = !!user || !!session || hasLocalSession;
  
  if (isAuthenticated) {
    console.log("User authenticated, showing protected content");
    return (
      <div className="pt-16">
        <DemoBanner />
        <div className="mt-4">
          {children}
        </div>
      </div>
    );
  }

  if (allowPreview && previewComponent) {
    return (
      <div className="pt-16">
        <DemoBanner />
        <div className="mt-4">
          {previewComponent}
        </div>
      </div>
    );
  }

  if (allowPreview) {
    return (
      <div className="pt-16">
        <DemoBanner />
        <div className="mt-4">
          {children}
        </div>
      </div>
    );
  }

  // If not authenticated and not navigating yet, redirect to login page
  if (!isNavigating) {
    console.log("Redirecting to signin from:", location.pathname);
    setIsNavigating(true);
    // Use immediate return of Navigate instead of setTimeout to ensure faster redirection
    return <Navigate to="/signin" state={{ from: location.pathname }} replace />;
  }
  
  // Fallback while navigating to prevent flickering
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-background">
      <Loader2 className="h-8 w-8 animate-spin text-homi-purple" />
      <p className="text-sm text-muted-foreground mt-4">Redirigiendo...</p>
    </div>
  );
};

export default ProtectedRoute;
