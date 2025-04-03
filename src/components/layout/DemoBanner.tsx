
import { Link } from 'react-router-dom';

interface DemoBannerProps {
  message?: string;
}

const DemoBanner = ({ message = "Estás viendo una demostración de cómo funciona Homi" }: DemoBannerProps) => {
  return (
    <div className="bg-homi-purple/80 text-white py-2 px-4 text-center sticky top-16 z-40">
      <p className="text-sm">
        {message}. <Link to="/register" className="underline font-bold">Regístrate</Link> para acceder a todas las funciones.
      </p>
    </div>
  );
};

export default DemoBanner;
