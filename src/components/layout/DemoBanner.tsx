
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

interface DemoBannerProps {
  message?: string;
  customMessage?: string;
}

const DemoBanner = ({ 
  message = "¡HomiMatch ya está disponible! Empieza a encontrar compañeros de piso compatibles",
  customMessage
}: DemoBannerProps) => {
  const { user } = useAuth();
  const [justRegistered, setJustRegistered] = useState(false);
  const [forceHide, setForceHide] = useState(false);
  const location = useLocation();
  
  // Check URL parameters for controlling the banner display
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    
    // Check if we need to force hide the banner
    if (urlParams.get('forceHideBadge') === 'true') {
      setForceHide(true);
      return;
    }
    
    // Only set justRegistered if user is authenticated AND registered parameter is true
    if (urlParams.get('registered') === 'true' && user) {
      setJustRegistered(true);
      // Clean URL parameters after processing
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (!user) {
      // Reset justRegistered if no user is authenticated
      setJustRegistered(false);
    }
  }, [user, location.search]);

  // Don't show the banner if we need to force hide it
  if (forceHide) {
    return null;
  }

  // Message for different user states and pages
  const getMessage = () => {
    if (justRegistered && user) {
      return "¡Bienvenido a HomiMatch! Completa tu perfil y empieza a conectar con compañeros de piso ideales.";
    } 
    
    // Page-specific messages
    if (location.pathname === '/chat') {
      return "Conecta y chatea con compañeros de piso compatibles. ¡HomiMatch ya está activo!";
    }
    
    if (location.pathname === '/matching') {
      return "Encuentra tu compañero de piso ideal con nuestro sistema de matching inteligente.";
    }
    
    if (user) {
      return customMessage || "¡HomiMatch está activo! Encuentra tu compañero de piso ideal ahora.";
    }
    
    return customMessage || message;
  };

  return (
    <div className="bg-homi-purple/80 text-white py-2 px-4 text-center w-full z-30">
      <p className="text-sm font-medium max-w-4xl mx-auto">
        {getMessage()}
        {!user && (
          <> <Link to="/register" className="underline font-bold hover:text-white/80 transition-colors">Crea tu cuenta</Link> para acceder a todas las funciones.</>
        )}
      </p>
    </div>
  );
};

export default DemoBanner;
