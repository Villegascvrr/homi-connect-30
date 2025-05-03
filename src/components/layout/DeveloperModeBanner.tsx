
import React from 'react';
import { useDeveloperMode } from '@/context/DeveloperModeContext';
import { AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

const DeveloperModeBanner = () => {
  const { isDeveloperMode, toggleDeveloperMode } = useDeveloperMode();

  if (!isDeveloperMode) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-amber-500/90 to-amber-700/90 py-2 border-b border-amber-600/30 text-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-center">
          <div className="flex items-center gap-2">
            <div className="bg-white/20 p-1 rounded-full backdrop-blur-sm">
              <AlertTriangle size={16} className="text-white" />
            </div>
            <p className="text-xs sm:text-sm font-medium">
              <span className="font-bold">DEVELOPER MODE</span> - You're viewing real user data and testing features
            </p>
          </div>
          <Button 
            size="sm"
            variant="outline" 
            className="text-xs rounded-full gap-1 bg-white/20 backdrop-blur-sm hover:bg-white/30 border-white/20"
            onClick={toggleDeveloperMode}
          >
            {isDeveloperMode ? (
              <>
                <EyeOff size={14} />
                Switch to User Mode
              </>
            ) : (
              <>
                <Eye size={14} />
                Switch to Developer Mode
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeveloperModeBanner;
