
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import DemoBanner from "../layout/DemoBanner";
import { useEffect, useState } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowPreview?: boolean;
  previewComponent?: React.ReactNode;
}

const ProtectedRoute = ({ 
  children, 
  allowPreview = false,
  previewComponent 
}: ProtectedRouteProps) => {
  const { user, session, loading } = useAuth();
  const location = useLocation();
  const [authCheckComplete, setAuthCheckComplete] = useState(false);
  
  useEffect(() => {
    // Log route access for debugging
    console.log("Protected route accessed:", {
      path: location.pathname,
      isAuthenticated: !!user,
      hasSession: !!session,
      isLoading: loading,
      allowsPreview: allowPreview
    });
    
    // Set a shorter timeout to prevent infinite loading - reduced from 800ms to 500ms
    const timeoutId = setTimeout(() => {
      if (loading) {
        console.log("Auth check taking too long, forcing completion");
        setAuthCheckComplete(true);
      }
    }, 500); // Reduced timeout from 800ms to 500ms for faster user experience
    
    return () => clearTimeout(timeoutId);
  }, [location.pathname, user, session, loading, allowPreview]);
  
  // Mark auth check as complete immediately when loading finishes
  useEffect(() => {
    if (!loading) {
      setAuthCheckComplete(true);
    }
  }, [loading]);

  // Very brief loading state - show for a shorter time
  if (loading && !authCheckComplete) {
    return (
      <div className="flex flex-col justify-center items-center h-[200px] bg-gray-50">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-homi-purple border-t-transparent mb-1"></div>
        <p className="text-xs text-muted-foreground">Verificando...</p>
      </div>
    );
  }

  // If the user is authenticated or session exists, show the actual content
  if (user || session) {
    console.log("User authenticated, showing protected content");
    return <>{children}</>;
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
