
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import DemoBanner from "../layout/DemoBanner";
import { useEffect, useState } from "react";

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
  
  useEffect(() => {
    console.log("Protected route accessed:", {
      path: location.pathname,
      isAuthenticated: !!user,
      hasSession: !!session,
      isLoading: loading,
      allowsPreview: allowPreview
    });
    
    // Set a more reasonable timeout for auth check
    const timeoutId = setTimeout(() => {
      if (loading) {
        console.log("Auth check taking too long, forcing completion");
        setAuthCheckComplete(true);
      }
    }, 1500);
    
    return () => clearTimeout(timeoutId);
  }, [location.pathname, user, session, loading, allowPreview]);
  
  useEffect(() => {
    if (!loading) {
      console.log("Auth loading finished, status:", user ? "authenticated" : "not authenticated");
      setAuthCheckComplete(true);
    }
  }, [loading, user]);

  // Check session storage for auth token to detect sessions that might not be fully loaded
  useEffect(() => {
    const hasStoredSession = !!localStorage.getItem('homi-auth-session');
    if (hasStoredSession && !session && loading) {
      console.log("Session found in storage but not loaded in context yet, waiting...");
    }
  }, [session, loading]);

  if (loading && !authCheckComplete) {
    return (
      <div className="flex flex-col justify-center items-center h-[200px] bg-gray-50">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-homi-purple border-t-transparent"></div>
        <p className="text-sm text-muted-foreground mt-2">Verificando sesión...</p>
      </div>
    );
  }

  if (user || session) {
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
