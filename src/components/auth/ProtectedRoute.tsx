
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

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
    return <div className="flex justify-center items-center h-full py-10">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
    </div>;
  }

  // Si el usuario está autenticado, mostrar el contenido real
  if (user) {
    return <>{children}</>;
  }

  // Si se permite vista previa y hay un componente de vista previa, mostrar la vista previa
  if (allowPreview && previewComponent) {
    return <>{previewComponent}</>;
  }

  // Si se permite vista previa pero no hay componente de vista previa, mostrar el contenido real
  if (allowPreview) {
    return <>{children}</>;
  }

  // De lo contrario redirigir a la página de login
  return <Navigate to="/signin" state={{ from: location.pathname }} replace />;
};

export default ProtectedRoute;
