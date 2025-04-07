
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import DemoBanner from "../layout/DemoBanner";
import { useEffect, useState } from "react";
import { hasStoredSession } from "@/integrations/supabase/client";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowPreview?: boolean;
  previewComponent?: React.ReactNode;
  demoMessage?: string;
}

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
  
  // Check for local session on mount
  useEffect(() => {
    const localSessionExists = hasStoredSession();
    setHasLocalSession(localSessionExists);
    setLocalCheckComplete(true);
    
    console.log("Local session check:", localSessionExists ? "Valid session found" : "No valid session");
  }, []);
  
  // Try to refresh session if we have a local session but no user in context
  useEffect(() => {
    const attemptSessionRefresh = async () => {
      if (hasLocalSession && !user && !session && localCheckComplete && !loading) {
        console.log("Has local session but no user in context, attempting to refresh session");
        try {
          await refreshUser();
          setAuthCheckComplete(true);
        } catch (error) {
          console.error("Error refreshing session:", error);
          // Increment retry count to limit retries
          setRetryCount(prev => prev + 1);
          
          if (retryCount >= 2) {
            // Mark auth check as complete even if we failed after multiple retries
            setAuthCheckComplete(true);
          }
        }
      } else if (!loading) {
        // If not loading, mark auth check as complete
        setAuthCheckComplete(true);
      }
    };
    
    attemptSessionRefresh();
  }, [user, session, loading, hasLocalSession, localCheckComplete, refreshUser, retryCount]);

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
      retryCount: retryCount
    });
    
    // Set a timeout to prevent infinite loading state
    const timeoutId = setTimeout(() => {
      if (!authCheckComplete) {
        console.log("Auth check taking too long, forcing completion");
        setAuthCheckComplete(true);
      }
    }, 3000);
    
    return () => clearTimeout(timeoutId);
  }, [location.pathname, user, session, loading, allowPreview, hasLocalSession, 
      authCheckComplete, localCheckComplete, retryCount]);

  // Show loading state only if we're still checking authentication
  if ((loading || !authCheckComplete) && !localCheckComplete) {
    return (
      <div className="flex flex-col justify-center items-center h-[200px] bg-gray-50">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-homi-purple border-t-transparent"></div>
        <p className="text-sm text-muted-foreground mt-2">Verificando sesión...</p>
      </div>
    );
  }

  // Check if we have a user or session from any source
  const isAuthenticated = !!user || !!session || hasLocalSession;

  if (isAuthenticated) {
    console.log("User authenticated, showing protected content");
    return (
      <>
        <div className="pt-16">
          <DemoBanner />
          <div className="mt-4">
            {children}
          </div>
        </div>
      </>
    );
  }

  if (allowPreview && previewComponent) {
    return (
      <>
        <div className="pt-16">
          <DemoBanner />
          <div className="mt-4">
            {previewComponent}
          </div>
        </div>
      </>
    );
  }

  if (allowPreview) {
    return (
      <>
        <div className="pt-16">
          <DemoBanner />
          <div className="mt-4">
            {children}
          </div>
        </div>
      </>
    );
  }

  console.log("Redirecting to signin from:", location.pathname);
  return <Navigate to="/signin" state={{ from: location.pathname }} replace />;
};

export default ProtectedRoute;
