
import { RocketIcon } from 'lucide-react';

const DevelopmentBanner = () => {
  return (
    <div className="bg-gradient-to-r from-homi-purple/90 to-homi-lightPurple/90 py-3 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-3 text-center">
          <RocketIcon size={20} className="animate-float" />
          <p className="font-medium">
            <span className="font-bold">¡Homi está en desarrollo! 🚀</span> Estamos trabajando para lanzar la plataforma pronto.
            <span className="hidden sm:inline"> Regístrate para ser de los primeros en probarla.</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default DevelopmentBanner;
