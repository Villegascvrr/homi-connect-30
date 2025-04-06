
import { Info, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const DevelopmentBanner = () => {
  return (
    <div className="bg-gradient-to-r from-homi-purple/90 to-homi-lightPurple/90 py-2 border-b border-homi-purple/30 text-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-center">
          <div className="flex items-center gap-2">
            <div className="bg-white/20 p-1 rounded-full backdrop-blur-sm">
              <Info size={16} className="text-white" />
            </div>
            <p className="text-xs sm:text-sm font-medium">
              <span className="font-bold">Homi estará disponible pronto.</span> ¡Necesitamos llegar a 1000 usuarios registrados para lanzar la app!
            </p>
          </div>
          <Button 
            size="sm"
            variant="outline" 
            className="text-xs rounded-full gap-1 bg-white/20 backdrop-blur-sm hover:bg-white/30 border-white/20"
            onClick={() => window.open('https://chat.whatsapp.com/FPqg8M2kGdm9G49j4YIAMB', '_blank')}
          >
            <MessageCircle size={14} />
            Grupo de WhatsApp
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DevelopmentBanner;
