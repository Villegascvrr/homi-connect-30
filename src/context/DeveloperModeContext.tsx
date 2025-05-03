
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type DeveloperModeContextType = {
  isDeveloperMode: boolean;
  enableDeveloperMode: () => void;
  disableDeveloperMode: () => void;
  toggleDeveloperMode: () => void;
};

const DeveloperModeContext = createContext<DeveloperModeContextType | undefined>(undefined);

export const DEVELOPER_MODE_KEY = 'homi-developer-mode';

export const DeveloperModeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isDeveloperMode, setIsDeveloperMode] = useState<boolean>(false);

  useEffect(() => {
    // Check if developer mode is enabled in localStorage
    const storedMode = localStorage.getItem(DEVELOPER_MODE_KEY);
    
    // Check if we're in a development environment
    const isLocalhost = 
      window.location.hostname === 'localhost' || 
      window.location.hostname === '127.0.0.1' ||
      window.location.hostname.includes('gitpod.io') ||
      window.location.hostname.includes('lovable');
    
    // Check if there's a URL parameter to enable developer mode
    const urlParams = new URLSearchParams(window.location.search);
    const devModeParam = urlParams.get('devMode');
    
    // Enable developer mode if any condition is met
    const shouldEnableDeveloperMode = 
      storedMode === 'true' || 
      isLocalhost || 
      devModeParam === 'true';
    
    setIsDeveloperMode(shouldEnableDeveloperMode);
    
    // Always store the current setting
    if (shouldEnableDeveloperMode) {
      localStorage.setItem(DEVELOPER_MODE_KEY, 'true');
    }
  }, []);

  const enableDeveloperMode = () => {
    localStorage.setItem(DEVELOPER_MODE_KEY, 'true');
    setIsDeveloperMode(true);
  };

  const disableDeveloperMode = () => {
    localStorage.setItem(DEVELOPER_MODE_KEY, 'false');
    setIsDeveloperMode(false);
  };

  const toggleDeveloperMode = () => {
    const newMode = !isDeveloperMode;
    localStorage.setItem(DEVELOPER_MODE_KEY, newMode ? 'true' : 'false');
    setIsDeveloperMode(newMode);
  };

  return (
    <DeveloperModeContext.Provider value={{ 
      isDeveloperMode, 
      enableDeveloperMode, 
      disableDeveloperMode,
      toggleDeveloperMode 
    }}>
      {children}
    </DeveloperModeContext.Provider>
  );
};

export const useDeveloperMode = (): DeveloperModeContextType => {
  const context = useContext(DeveloperModeContext);
  if (context === undefined) {
    throw new Error('useDeveloperMode must be used within a DeveloperModeProvider');
  }
  return context;
};
