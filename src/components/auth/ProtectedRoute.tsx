
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
    
    // Set a shorter timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      if (loading) {
        console.log("Auth check taking too long, forcing completion");
        setAuthCheckComplete(true);
      }
    }, 100); // Even shorter timeout for faster user experience
    
    return () => clearTimeout(timeoutId);
  }, [location.pathname, user, session, loading, allowPreview]);
  
  // Mark auth check as complete immediately when loading finishes
  useEffect(() => {
    if (!loading) {
      console.log("Auth loading finished, status:", user ? "authenticated" : "not authenticated");
      setAuthCheckComplete(true);
    }
  }, [loading, user]);

  // Very minimal loading state with better visibility
  if (loading && !authCheckComplete) {
    return (
      <div className="flex flex-col justify-center items-center h-[200px] bg-gray-50">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-homi-purple border-t-transparent"></div>
        <p className="text-sm text-muted-foreground mt-2">Verificando sesión...</p>
      </div>
    );
  }

  // If the user is authenticated or session exists, show the actual content with demo banner
  if (user || session) {
    console.log("User authenticated, showing protected content");
    return (
      <>
        <DemoBanner customMessage={demoMessage || "Estás viendo una demostración de Homi. La aplicación completa estará disponible próximamente."} />
        {children}
      </>
    );
  }

  // If preview is allowed and a preview component is provided, show the preview
  if (allowPreview && previewComponent) {
    return (
      <>
        <DemoBanner />
        {previewComponent}
      </>
    );
  }

  // If preview is allowed but no preview component is provided, 
  // show the actual content with a demo banner
  if (allowPreview) {
    return (
      <>
        <DemoBanner />
        {children}
      </>
    );
  }

  // Otherwise redirect to the login page with return path
  console.log("Redirecting to signin from:", location.pathname);
  return <Navigate to="/signin" state={{ from: location.pathname }} replace />;
};

export default ProtectedRoute;
