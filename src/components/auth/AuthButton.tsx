
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect, useState } from "react";
import { hasStoredSession, signInWithGoogleOAuth } from "@/integrations/supabase/client";

const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" className="mr-1">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

const AuthButton = () => {
  const { user, signOut, loading: authLoading, refreshUser } = useAuth();
  const isMobile = useIsMobile();
  const [loading, setLoading] = useState(true);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [sessionVerified, setSessionVerified] = useState(false);
  const [isGoogleSignIn, setIsGoogleSignIn] = useState(false);
  const [renderKey, setRenderKey] = useState('initial');

  // Add a short timeout to ensure we don't get stuck in loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  // Force re-render on user change
  useEffect(() => {
    setRenderKey(`auth-button-${user ? 'logged-in' : 'logged-out'}-${Date.now()}`);
  }, [user]);

  // Check if we have a session in localStorage but no user loaded
  useEffect(() => {
    const checkSession = async () => {
      if (!user && hasStoredSession() && !sessionVerified) {
        try {
          await refreshUser();
          setSessionVerified(true);
        } catch (error) {
          console.error("Failed to refresh user from localStorage session:", error);
          setSessionVerified(true); // Mark as verified anyway to avoid repeated attempts
        }
      } else {
        setSessionVerified(true);
      }
    };
    
    checkSession();
  }, [user, refreshUser, sessionVerified]);

  // Use local loading state that times out, or auth loading state
  const isLoading = (loading && authLoading) || !sessionVerified || isSigningOut || isGoogleSignIn;

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      await signOut();
      // La navegación ahora se maneja en la función signOut
    } catch (error) {
      console.error("Error during sign out:", error);
      setIsSigningOut(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleSignIn(true);
      await signInWithGoogleOAuth();
    } catch (error: any) {
      console.error("Error durante la autenticación con Google:", error);
      setIsGoogleSignIn(false);
    }
  };

  if (isLoading) {
    return (
      <Button variant="ghost" size="sm" disabled className="h-9 w-9 rounded-full">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></div>
      </Button>
    );
  }

  // Key for forcing re-render when auth state changes
  const keyPrefix = user ? 'user-logged-in' : 'user-logged-out';
  const componentKey = `${keyPrefix}-${renderKey}`;

  if (!user) {
    // For mobile view, show a stacked layout
    if (isMobile) {
      return (
        <div className="flex flex-col space-y-2" key={componentKey}>
          <Link
            to="/signin"
            className="block w-full text-center px-3 py-2 rounded-full text-base font-medium text-foreground hover:bg-muted"
          >
            Iniciar sesión
          </Link>
          <Link
            to="/register"
            className="block w-full text-center px-3 py-2 rounded-full text-base font-medium bg-homi-purple text-white hover:bg-homi-purple/90"
          >
            Registrarse
          </Link>
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-center gap-2 rounded-full"
            onClick={handleGoogleSignIn}
            disabled={isGoogleSignIn}
          >
            {isGoogleSignIn ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></div>
                <span>Conectando...</span>
              </>
            ) : (
              <>
                <GoogleIcon />
                Google
              </>
            )}
          </Button>
        </div>
      );
    }
    
    // For desktop view, show buttons side by side
    return (
      <div className="flex items-center gap-2" key={componentKey}>
        <Button asChild variant="outline" size="sm" className="border-homi-purple text-homi-purple hover:bg-homi-purple/10 rounded-full">
          <Link to="/signin">Iniciar sesión</Link>
        </Button>
        <Button asChild className="bg-homi-purple hover:bg-homi-purple/90 text-white rounded-full">
          <Link to="/register">Registrarse</Link>
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="rounded-full flex items-center justify-center gap-1"
          onClick={handleGoogleSignIn}
          disabled={isGoogleSignIn}
        >
          {isGoogleSignIn ? (
            <>
              <div className="h-3 w-3 animate-spin rounded-full border-2 border-b-transparent"></div>
              <span>Conectando...</span>
            </>
          ) : (
            <>
              <GoogleIcon />
              Google
            </>
          )}
        </Button>
      </div>
    );
  }

  // User is logged in, show avatar dropdown
  return (
    <DropdownMenu key={componentKey}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0">
          <Avatar className="h-9 w-9">
            <AvatarImage src={(user as any).profile_image || ""} alt="Profile" />
            <AvatarFallback className="bg-homi-purple text-white">
              {user.email?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/profile" className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Perfil</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-red-600 focus:text-red-600 cursor-pointer"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Cerrar sesión</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AuthButton;
