
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface DemoBannerProps {
  message?: string;
  customMessage?: string;
}

const DemoBanner = ({ 
  message = "Estás viendo una demostración de cómo funciona Homi",
  customMessage
}: DemoBannerProps) => {
  const { user } = useAuth();
  
  return (
    <div className="bg-homi-purple/80 text-white py-2 px-4 text-center relative z-50">
      <p className="text-sm font-medium max-w-4xl mx-auto">
        {user 
          ? "¡Gracias por registrarte en Homi! Te avisaremos cuando la aplicación esté completamente funcional."
          : customMessage || message
        }
        {!user && (
          <> <Link to="/register" className="underline font-bold">Regístrate</Link> para acceder a todas las funciones.</>
        )}
      </p>
    </div>
  );
};

export default DemoBanner;
