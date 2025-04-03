
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
  
  // Solo mostrar para usuarios autenticados
  if (!user) return null;
  
  return (
    <div className="bg-homi-purple/80 text-white py-2 px-4 text-center">
      <p className="text-sm font-medium max-w-4xl mx-auto">
        {customMessage || "¡Gracias por registrarte en Homi! Te avisaremos cuando la aplicación esté completamente funcional."}
      </p>
    </div>
  );
};

export default DemoBanner;
