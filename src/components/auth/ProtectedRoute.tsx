
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import DemoBanner from "../layout/DemoBanner";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

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
  const { user, session, loading } = useAuth();
  const location = useLocation();
  const [authCheckComplete, setAuthCheckComplete] = useState(false);
  const [hasLocalSession, setHasLocalSession] = useState(false);
  
  // Check for local session on mount
  useEffect(() => {
    const checkLocalSession = () => {
      const sessionStr = localStorage.getItem('homi-auth-session');
      if (sessionStr) {
        try {
          const sessionData = JSON.parse(sessionStr);
          const isExpired = sessionData.expires_at && new Date(sessionData.expires_at * 1000) < new Date();
          const hasValidSession = !isExpired;
          
          console.log("Local session check:", hasValidSession ? "Valid session found" : "Invalid or expired session");
          setHasLocalSession(hasValidSession);
          
          // If we have a valid session in localStorage but no user/session in context
          // trigger a session refresh
          if (hasValidSession && !user && !session) {
            console.log("Valid local session but no user in context, refreshing session");
            supabase.auth.refreshSession();
          }
        } catch (e) {
          console.error("Error parsing session from localStorage:", e);
          setHasLocalSession(false);
        }
      } else {
        console.log("No session found in localStorage");
        setHasLocalSession(false);
      }
    };
    
    checkLocalSession();
  }, [user, session]);
  
  useEffect(() => {
    console.log("Protected route accessed:", {
      path: location.pathname,
      isAuthenticated: !!user,
      hasSession: !!session,
      hasLocalSession: hasLocalSession,
      isLoading: loading,
      allowsPreview: allowPreview
    });
    
    // Set a more reasonable timeout for auth check
    const timeoutId = setTimeout(() => {
      if (loading) {
        console.log("Auth check taking too long, forcing completion");
        setAuthCheckComplete(true);
      }
    }, 2000); // Increased timeout to give more time for auth check
    
    return () => clearTimeout(timeoutId);
  }, [location.pathname, user, session, loading, allowPreview, hasLocalSession]);
  
  useEffect(() => {
    const checkSession = async () => {
      if (!user && !session && hasLocalSession) {
        console.log("No user or session in context, but found in localStorage. Refreshing session...");
        try {
          const { data } = await supabase.auth.getSession();
          if (data.session) {
            console.log("Session refreshed from localStorage");
          } else {
            console.log("Failed to refresh session from localStorage");
            setAuthCheckComplete(true);
          }
        } catch (error) {
          console.error("Error refreshing session:", error);
          setAuthCheckComplete(true);
        }
      } else if (!loading) {
        console.log("Auth loading finished, status:", user ? "authenticated" : "not authenticated");
        setAuthCheckComplete(true);
      }
    };
    
    checkSession();
  }, [loading, user, session, hasLocalSession]);

  if ((loading && !authCheckComplete) || (!user && hasLocalSession && !authCheckComplete)) {
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
