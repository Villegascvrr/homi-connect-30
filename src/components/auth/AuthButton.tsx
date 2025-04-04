
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

const AuthButton = () => {
  const { user, signOut, loading: authLoading } = useAuth();
  const isMobile = useIsMobile();
  const [loading, setLoading] = useState(true);

  // Add a short timeout to ensure we don't get stuck in loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  // Use local loading state that times out, or auth loading state
  const isLoading = loading && authLoading;

  if (isLoading) {
    return (
      <Button variant="ghost" size="sm" disabled className="h-9 w-9 rounded-full">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></div>
      </Button>
    );
  }

  if (!user) {
    // For mobile view, show a stacked layout
    if (isMobile) {
      return (
        <div className="flex flex-col space-y-2">
          <Link
            to="/signin"
            className="block w-full text-center px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-muted"
          >
            Iniciar sesión
          </Link>
          <Link
            to="/register"
            className="block w-full text-center px-3 py-2 rounded-md text-base font-medium bg-homi-purple text-white hover:bg-homi-purple/90"
          >
            Registrarse
          </Link>
        </div>
      );
    }
    
    // For desktop view, show buttons side by side
    return (
      <div className="flex items-center gap-2">
        <Button asChild variant="outline" size="sm" className="border-homi-purple text-homi-purple hover:bg-homi-purple/10">
          <Link to="/signin">Iniciar sesión</Link>
        </Button>
        <Button asChild className="bg-homi-purple hover:bg-homi-purple/90 text-white">
          <Link to="/register">Registrarse</Link>
        </Button>
      </div>
    );
  }

  // User is logged in, show avatar dropdown
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0">
          <Avatar className="h-9 w-9">
            {/* Cast user to any to avoid typescript error with profile_image */}
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
          onClick={() => signOut()}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Cerrar sesión</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AuthButton;
