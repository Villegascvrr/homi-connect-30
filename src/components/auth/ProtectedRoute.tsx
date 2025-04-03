
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowPreview?: boolean;
}

const ProtectedRoute = ({ 
  children, 
  allowPreview = false,
}: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="flex justify-center items-center h-full py-10">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
    </div>;
  }

  // Si el usuario está autenticado, mostrar el contenido real
  if (user) {
    return <>{children}</>;
  }

  // Si se permite vista previa, mostrar el contenido real
  if (allowPreview) {
    return <>{children}</>;
  }

  // De lo contrario redirigir a la página de login
  return <Navigate to="/signin" state={{ from: location.pathname }} replace />;
};

export default ProtectedRoute;
