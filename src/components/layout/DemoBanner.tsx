
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
    <div className="bg-homi-purple/80 text-white py-2 px-4 text-center sticky top-16 z-40">
      <p className="text-sm">
        {customMessage || message}
        {!user && (
          <> <Link to="/register" className="underline font-bold">Regístrate</Link> para acceder a todas las funciones.</>
        )}
      </p>
    </div>
  );
};

export default DemoBanner;
