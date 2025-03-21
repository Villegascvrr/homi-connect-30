
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, Home, Users, MessageSquare, User, LogIn } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header 
      className={`sticky top-0 z-50 w-full border-b transition-all duration-300 backdrop-blur-sm ${
        isScrolled ? 'bg-background/95 shadow-sm' : 'bg-background/70'
      }`}
      style={{
        padding: "10px 0 !important"
      }}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2" onClick={() => window.scrollTo(0, 0)}>
          <span className="text-2xl font-bold bg-gradient-to-r from-homi-purple to-homi-lightPurple bg-clip-text text-transparent">Homi</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link 
            to="/" 
            className={`transition-colors ${isActive('/') ? 'text-homi-purple font-medium' : 'text-foreground/80 hover:text-homi-purple'}`}
            onClick={() => window.scrollTo(0, 0)}
          >
            Inicio
          </Link>
          <Link 
            to="/matching" 
            className={`transition-colors text-[1.1rem] font-medium ${isActive('/matching') ? 'text-homi-purple font-semibold' : 'text-foreground/90 hover:text-homi-purple'}`}
            onClick={() => window.scrollTo(0, 0)}
          >
            Encuentra Compañeros
          </Link>
          <Link 
            to="/chat" 
            className={`transition-colors text-[1.1rem] font-medium ${isActive('/chat') ? 'text-homi-purple font-semibold' : 'text-foreground/90 hover:text-homi-purple'}`}
            onClick={() => window.scrollTo(0, 0)}
          >
            Mensajes
          </Link>
          <Link 
            to="/profile" 
            className={`transition-colors text-[1.1rem] font-medium ${isActive('/profile') ? 'text-homi-purple font-semibold' : 'text-foreground/90 hover:text-homi-purple'}`}
            onClick={() => window.scrollTo(0, 0)}
          >
            Mi Perfil
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Button asChild variant="outline" className="rounded-full border-homi-purple/20 hover:border-homi-purple/50 hover:bg-homi-ultraLightPurple/20">
            <Link to="/signin" onClick={() => window.scrollTo(0, 0)}>Iniciar Sesión</Link>
          </Button>
          <Button asChild className="rounded-full bg-homi-purple hover:bg-homi-purple/90 shadow-sm">
            <Link to="/register" onClick={() => window.scrollTo(0, 0)}>Registrarse</Link>
          </Button>
        </div>

        <button className="md:hidden text-foreground p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-sm border-t border-border animate-fade-in">
          <div className="container mx-auto px-4 py-4 flex flex-col">
            <Link 
              to="/" 
              onClick={() => {
                setIsMenuOpen(false);
                window.scrollTo(0, 0);
              }} 
              className={`flex items-center gap-2 py-3 transition-colors ${isActive('/') ? 'text-homi-purple font-medium' : 'text-foreground/80 hover:text-homi-purple'}`}
            >
              <Home size={20} />
              <span>Inicio</span>
            </Link>
            <Link 
              to="/matching" 
              onClick={() => {
                setIsMenuOpen(false);
                window.scrollTo(0, 0);
              }} 
              className={`flex items-center gap-2 py-3.5 transition-colors text-[1.15rem] ${isActive('/matching') ? 'text-homi-purple font-semibold' : 'text-foreground/90 hover:text-homi-purple font-medium'}`}
            >
              <Users size={22} />
              <span>Encuentra Compañeros</span>
            </Link>
            <Link 
              to="/chat" 
              onClick={() => {
                setIsMenuOpen(false);
                window.scrollTo(0, 0);
              }} 
              className={`flex items-center gap-2 py-3.5 transition-colors text-[1.15rem] ${isActive('/chat') ? 'text-homi-purple font-semibold' : 'text-foreground/90 hover:text-homi-purple font-medium'}`}
            >
              <MessageSquare size={22} />
              <span>Mensajes</span>
            </Link>
            <Link 
              to="/profile" 
              onClick={() => {
                setIsMenuOpen(false);
                window.scrollTo(0, 0);
              }} 
              className={`flex items-center gap-2 py-3.5 transition-colors text-[1.15rem] ${isActive('/profile') ? 'text-homi-purple font-semibold' : 'text-foreground/90 hover:text-homi-purple font-medium'}`}
            >
              <User size={22} />
              <span>Mi Perfil</span>
            </Link>
            
            <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-border">
              <Button asChild variant="outline" className="rounded-full w-full justify-center border-homi-purple/20">
                <Link 
                  to="/signin"
                  onClick={() => {
                    setIsMenuOpen(false);
                    window.scrollTo(0, 0);
                  }}
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  Iniciar Sesión
                </Link>
              </Button>
              <Button asChild className="rounded-full w-full justify-center bg-homi-purple hover:bg-homi-purple/90 shadow-sm">
                <Link 
                  to="/register"
                  onClick={() => {
                    setIsMenuOpen(false);
                    window.scrollTo(0, 0);
                  }}
                >
                  Registrarse
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
