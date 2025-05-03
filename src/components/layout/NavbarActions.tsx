
import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Bell, MessageSquare, User, Code } from 'lucide-react';
import { useDeveloperMode } from '@/context/DeveloperModeContext';

interface NavbarActionsProps {
  className?: string;
}

const NavbarActions = ({ className = '' }: NavbarActionsProps) => {
  const { user } = useAuth();
  const { isDeveloperMode, toggleDeveloperMode } = useDeveloperMode();
  const navigate = useNavigate();

  if (!user) {
    return null;
  }

  return (
    <div className={`flex items-center gap-1 md:gap-2 ${className}`}>
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        aria-label="Messages"
        onClick={() => navigate('/chat')}
      >
        <MessageSquare className="h-[1.2rem] w-[1.2rem]" />
        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
          2
        </span>
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        aria-label="Notifications"
      >
        <Bell className="h-[1.2rem] w-[1.2rem]" />
        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
          3
        </span>
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        aria-label="Developer Mode"
        onClick={toggleDeveloperMode}
      >
        <Code className={`h-[1.2rem] w-[1.2rem] ${isDeveloperMode ? 'text-amber-500' : ''}`} />
        {isDeveloperMode && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[10px] text-white">
            D
          </span>
        )}
      </Button>
      
      <Button 
        variant="ghost"
        size="icon"
        className="rounded-full"
        onClick={() => navigate('/profile')}
      >
        <User className="h-[1.2rem] w-[1.2rem]" />
      </Button>
      
      {isDeveloperMode && (
        <Button 
          variant="outline" 
          size="sm"
          className="hidden md:flex"
          onClick={() => navigate('/developer')}
        >
          Developer Dashboard
        </Button>
      )}
    </div>
  );
};

export default NavbarActions;
