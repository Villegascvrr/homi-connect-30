
import { Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const DevelopmentBanner = () => {
  return (
    <div className="bg-gradient-to-r from-homi-purple/90 to-homi-lightPurple/90 py-2.5 border-b border-homi-purple/30 text-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-3 text-center">
          <div className="bg-white/20 p-1.5 rounded-full backdrop-blur-sm">
            <Info size={18} className="text-white" />
          </div>
          <p className="text-sm sm:text-base font-medium">
            <span className="font-bold">Homi está en desarrollo.</span> ¡Regístrate ahora para ser de los primeros en usarlo en Sevilla!
          </p>
        </div>
      </div>
    </div>
  );
};

export default DevelopmentBanner;
