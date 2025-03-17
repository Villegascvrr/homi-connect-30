
import { Info } from 'lucide-react';

const DevelopmentBanner = () => {
  return (
    <div className="bg-gradient-to-r from-homi-purple/90 to-homi-lightPurple/90 py-1.5 border-b border-homi-purple/30 text-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-3 text-center">
          <div className="bg-white/20 p-1 rounded-full backdrop-blur-sm">
            <Info size={16} className="text-white" />
          </div>
          <p className="text-xs sm:text-sm font-medium">
            <span className="font-bold">Homi está en desarrollo.</span> ¡Regístrate ahora para ser de los primeros en usarlo en Sevilla!
          </p>
        </div>
      </div>
    </div>
  );
};

export default DevelopmentBanner;
