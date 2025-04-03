import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import DemoBanner from "../layout/DemoBanner";

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

  if (loading) {
    return <div className="flex justify-center items-center h-screen">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
    </div>;
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

  // Otherwise redirect to the login page
  return <Navigate to="/signin" state={{ from: location.pathname }} replace />;
};

export default ProtectedRoute;
