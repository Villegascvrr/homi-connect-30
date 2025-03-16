
import { Info } from 'lucide-react';

const DevelopmentBanner = () => {
  return (
    <div className="bg-homi-ultraLightPurple border-b border-homi-purple/20 py-2">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-2 text-center text-sm text-homi-purple">
          <Info size={16} />
          <p>
            <span className="font-semibold">Homi está en desarrollo.</span> Estamos trabajando para lanzar la plataforma pronto.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DevelopmentBanner;
