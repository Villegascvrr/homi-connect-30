import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import DemoBanner from "../layout/DemoBanner";
import { useEffect } from "react";

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

  useEffect(() => {
    // Log route access for debugging
    console.log("Protected route accessed:", {
      path: location.pathname,
      isAuthenticated: !!user,
      isLoading: loading,
      allowsPreview: allowPreview
    });
  }, [location.pathname, user, loading, allowPreview]);

  // Show improved loading state while checking authentication
  if (loading) {
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
