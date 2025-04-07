
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
  const { user, session, loading, refreshUser } = useAuth();
  const location = useLocation();
  const [authCheckComplete, setAuthCheckComplete] = useState(false);
  const [localCheckComplete, setLocalCheckComplete] = useState(false);
  const [hasLocalSession, setHasLocalSession] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isNavigating, setIsNavigating] = useState(false);
  const [renderKey] = useState(() => `protected-route-${Math.random().toString(36).substring(2, 9)}`);
  
  // Check for local session on mount - this happens quickly to avoid flicker
  useEffect(() => {
    const localSessionExists = hasStoredSession();
    setHasLocalSession(localSessionExists);
    setLocalCheckComplete(true);
    
    console.log("Local session check:", localSessionExists ? "Valid session found" : "No valid session");
  }, []);
  
  // Try to refresh session if we have a local session but no user in context
  useEffect(() => {
    let isMounted = true;
    
    const attemptSessionRefresh = async () => {
      if (hasLocalSession && !user && !session && localCheckComplete && !loading) {
        console.log("Has local session but no user in context, attempting to refresh session");
        try {
          await refreshUser();
          if (isMounted) {
            setAuthCheckComplete(true);
          }
        } catch (error) {
          console.error("Error refreshing session:", error);
          // Increment retry count to limit retries
          if (isMounted) {
            setRetryCount(prev => prev + 1);
          
            if (retryCount >= 2) {
              // Mark auth check as complete even if we failed after multiple retries
              setAuthCheckComplete(true);
            }
          }
        }
      } else if (!loading) {
        // If not loading, mark auth check as complete
        if (isMounted) {
          setAuthCheckComplete(true);
        }
      }
    };
    
    attemptSessionRefresh();
    
    return () => {
      isMounted = false;
    };
  }, [user, session, loading, hasLocalSession, localCheckComplete, refreshUser, retryCount]);

  // For debugging
  useEffect(() => {
    console.log("Protected route accessed:", {
      path: location.pathname,
      isAuthenticated: !!user,
      hasSession: !!session,
      hasLocalSession: hasLocalSession,
      isLoading: loading,
      authCheckComplete: authCheckComplete,
      localCheckComplete: localCheckComplete,
      allowsPreview: allowPreview,
      retryCount: retryCount,
      isNavigating: isNavigating
    });
    
    // Set a timeout to prevent infinite loading state
    const timeoutId = setTimeout(() => {
      if (!authCheckComplete) {
        console.log("Auth check taking too long, forcing completion");
        setAuthCheckComplete(true);
      }
    }, 2000); // Reduced from 3000ms to 2000ms for better UX
    
    return () => clearTimeout(timeoutId);
  }, [location.pathname, user, session, loading, allowPreview, hasLocalSession, 
      authCheckComplete, localCheckComplete, retryCount, isNavigating]);

  // Prevent re-renders during navigation
  useEffect(() => {
    if (isNavigating) {
      return;
    }
  }, [isNavigating]);

  // Show loading state only if we're still checking authentication
  // Use a more controlled approach to avoid flickering
  if ((loading || !authCheckComplete) && !localCheckComplete) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-homi-purple" />
        <p className="text-sm text-muted-foreground mt-4">Verificando sesión...</p>
      </div>
    );
  }

  // Check if we have a user or session from any source
  const isAuthenticated = !!user || !!session || hasLocalSession;

  if (isAuthenticated) {
    console.log("User authenticated, showing protected content");
    return (
      <div key={renderKey} className="pt-16">
        <DemoBanner />
        <div className="mt-4">
          {children}
        </div>
      </div>
    );
  }

  if (allowPreview && previewComponent) {
    return (
      <div key={renderKey} className="pt-16">
        <DemoBanner />
        <div className="mt-4">
          {previewComponent}
        </div>
      </div>
    );
  }

  if (allowPreview) {
    return (
      <div key={renderKey} className="pt-16">
        <DemoBanner />
        <div className="mt-4">
          {children}
        </div>
      </div>
    );
  }

  // Only navigate if not already navigating to prevent loops
  if (!isNavigating) {
    console.log("Redirecting to signin from:", location.pathname);
    setIsNavigating(true);
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
