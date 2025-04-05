
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

interface DemoBannerProps {
  message?: string;
  customMessage?: string;
}

const DemoBanner = ({ 
  message = "Estás viendo una demostración de cómo funciona Homi",
  customMessage
}: DemoBannerProps) => {
  const { user } = useAuth();
  const [justRegistered, setJustRegistered] = useState(false);
  const location = useLocation();
  
  // Check if user just registered based on URL parameter
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('registered') === 'true' && user) {
      setJustRegistered(true);
    }
  }, [user]);

  // Message for different user states and pages
  const getMessage = () => {
    if (justRegistered) {
      return "¡Gracias por registrarte en Homi! Completa tu perfil y síguenos en @homimatch para recibir todas las novedades.";
    } 
    
    // Page-specific messages
    if (location.pathname === '/chat') {
      return "Estás viendo una demostración de la función de chat. Pronto podrás conectar con compañeros de piso compatibles.";
    }
    
    if (location.pathname === '/matching') {
      return "Estás viendo una demostración de la función de matching. Pronto podrás encontrar compañeros de piso compatibles.";
    }
    
    if (user) {
      return customMessage || "Estás viendo una demostración de Homi. La aplicación completa estará disponible próximamente.";
    }
    
    return customMessage || message;
  };

  return (
    <div className="bg-homi-purple/80 text-white py-2 px-4 text-center w-full z-30">
      <p className="text-sm font-medium max-w-4xl mx-auto">
        {getMessage()}
        {!user && (
          <> <Link to="/register" className="underline font-bold hover:text-white/80 transition-colors">Regístrate</Link> para acceder a todas las funciones.</>
        )}
      </p>
    </div>
  );
};

export default DemoBanner;
