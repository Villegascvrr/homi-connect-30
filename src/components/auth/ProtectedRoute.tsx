
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
  const { user, loading } = useAuth();
  const location = useLocation();
  const [authCheckComplete, setAuthCheckComplete] = useState(false);
  
  useEffect(() => {
    // Log route access for debugging
    console.log("Protected route accessed:", {
      path: location.pathname,
      isAuthenticated: !!user,
      isLoading: loading,
      allowsPreview: allowPreview
    });
    
    // Set a timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      if (loading) {
        console.log("Auth check taking too long, forcing completion");
        setAuthCheckComplete(true);
      }
    }, 2000); // 2 seconds timeout
    
    return () => clearTimeout(timeoutId);
  }, [location.pathname, user, loading, allowPreview]);
  
  // Mark auth check as complete when loading finishes
  useEffect(() => {
    if (!loading) {
      setAuthCheckComplete(true);
    }
  }, [loading]);

  // Show improved loading state while checking authentication - but only briefly
  if (loading && !authCheckComplete) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-homi-purple border-t-transparent mb-4"></div>
        <p className="text-sm text-muted-foreground">Verificando acceso...</p>
      </div>
    );
  }

  // If the user is authenticated, show the actual content
  if (user) {
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
