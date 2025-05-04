
import React, { useState } from "react";
import { Link, NavLink as RouterNavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

import logoImage from "@/assets/homi-logo.svg";

interface AuthButtonProps {
  isMobile?: boolean;
  closeMobileMenu?: () => void;
}

const AuthButton: React.FC<AuthButtonProps> = ({ isMobile = false, closeMobileMenu }) => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      if (closeMobileMenu) {
        closeMobileMenu();
      }
    } catch (error) {
      console.error("Failed to sign out", error);
    }
  };

  if (user) {
    return (
      <Button variant="outline" onClick={handleSignOut}>
        Cerrar sesión
      </Button>
    );
  } else {
    return (
      <>
        <Link to="/signin">
          <Button variant="ghost" onClick={closeMobileMenu}>
            Iniciar sesión
          </Button>
        </Link>
        <Link to="/register">
          <Button onClick={closeMobileMenu}>Regístrate</Button>
        </Link>
      </>
    );
  }
};

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ to, children }) => (
  <RouterNavLink
    to={to}
    className={({ isActive }) =>
      `text-sm font-medium transition-colors hover:text-foreground/80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 data-[active]:text-foreground ${
        isActive ? "text-foreground" : "text-muted-foreground"
      }`
    }
  >
    {children}
  </RouterNavLink>
);

interface MobileNavLinkProps extends NavLinkProps {
  onClick: () => void;
}

const MobileNavLink: React.FC<MobileNavLinkProps> = ({ to, children, onClick }) => (
  <RouterNavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      `block py-2 text-base font-medium transition-colors hover:text-foreground/80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 data-[active]:text-foreground ${
        isActive ? "text-foreground" : "text-muted-foreground"
      }`
    }
  >
    {children}
  </RouterNavLink>
);

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth();

  return (
    <header className="py-4 px-4 border-b bg-white z-10">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img
            src={logoImage}
            alt="Homi"
            className="w-8 h-8 md:w-10 md:h-10"
          />
          <span className="font-bold text-xl md:text-2xl">
            <span className="text-zinc-900">Homi</span>
            <span className="text-homi-purple">Match</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <nav>
            <ul className="flex items-center gap-6">
              <li>
                <NavLink to="/how-it-works">Cómo funciona</NavLink>
              </li>
              <li>
                <NavLink to="/matching">Encontrar compañero</NavLink>
              </li>
              {user && (
                <>
                  <li>
                    <NavLink to="/chat">Mensajes</NavLink>
                  </li>
                </>
              )}
            </ul>
          </nav>

          <AuthButton />
        </div>

        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Menu"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-white pt-16 px-4">
          <nav>
            <ul className="flex flex-col gap-4 mt-4">
              <li>
                <MobileNavLink
                  to="/how-it-works"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Cómo funciona
                </MobileNavLink>
              </li>
              <li>
                <MobileNavLink
                  to="/matching"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Encontrar compañero
                </MobileNavLink>
              </li>
              {user && (
                <>
                  <li>
                    <MobileNavLink
                      to="/chat"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Mensajes
                    </MobileNavLink>
                  </li>
                </>
              )}
            </ul>
          </nav>

          <div className="mt-6">
            <AuthButton isMobile closeMobileMenu={() => setIsMenuOpen(false)} />
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
