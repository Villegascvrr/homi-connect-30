
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, Home, Users, MessageSquare, User, LogIn, HelpCircle } from 'lucide-react';

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

  // Close mobile menu when changing pages
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'py-2 bg-white/80 dark:bg-homi-dark/80 backdrop-blur-md shadow-sm' 
          : 'py-4 bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-homi-purple">homi</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link 
            to="/" 
            className={`transition-colors ${
              isActive('/') 
                ? 'text-homi-purple font-medium' 
                : 'text-foreground/80 hover:text-homi-purple'
            }`}
          >
            Inicio
          </Link>
          <Link 
            to="/matching" 
            className={`transition-colors ${
              isActive('/matching') 
                ? 'text-homi-purple font-medium' 
                : 'text-foreground/80 hover:text-homi-purple'
            }`}
          >
            Encuentra Compañeros
          </Link>
          <Link 
            to="/how-it-works" 
            className={`transition-colors ${
              isActive('/how-it-works') 
                ? 'text-homi-purple font-medium' 
                : 'text-foreground/80 hover:text-homi-purple'
            }`}
          >
            Cómo Funciona
          </Link>
          <Link 
            to="/chat" 
            className={`transition-colors ${
              isActive('/chat') 
                ? 'text-homi-purple font-medium' 
                : 'text-foreground/80 hover:text-homi-purple'
            }`}
          >
            Mensajes
          </Link>
          <Link 
            to="/profile" 
            className={`transition-colors ${
              isActive('/profile') 
                ? 'text-homi-purple font-medium' 
                : 'text-foreground/80 hover:text-homi-purple'
            }`}
          >
            Mi Perfil
          </Link>
        </nav>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Button asChild variant="outline" className="rounded-full">
            <Link to="/signin">Iniciar Sesión</Link>
          </Button>
          <Button asChild className="rounded-full bg-homi-purple hover:bg-homi-purple/90">
            <Link to="/register">Registrarse</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-foreground p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-t border-border animate-fade-in">
          <div className="container mx-auto px-4 py-4 flex flex-col">
            <Link 
              to="/" 
              className={`flex items-center gap-2 py-3 transition-colors ${
                isActive('/') 
                  ? 'text-homi-purple font-medium' 
                  : 'text-foreground/80 hover:text-homi-purple'
              }`}
            >
              <Home size={20} />
              <span>Inicio</span>
            </Link>
            <Link 
              to="/matching" 
              className={`flex items-center gap-2 py-3 transition-colors ${
                isActive('/matching') 
                  ? 'text-homi-purple font-medium' 
                  : 'text-foreground/80 hover:text-homi-purple'
              }`}
            >
              <Users size={20} />
              <span>Encuentra Compañeros</span>
            </Link>
            <Link 
              to="/how-it-works" 
              className={`flex items-center gap-2 py-3 transition-colors ${
                isActive('/how-it-works') 
                  ? 'text-homi-purple font-medium' 
                  : 'text-foreground/80 hover:text-homi-purple'
              }`}
            >
              <HelpCircle size={20} />
              <span>Cómo Funciona</span>
            </Link>
            <Link 
              to="/chat" 
              className={`flex items-center gap-2 py-3 transition-colors ${
                isActive('/chat') 
                  ? 'text-homi-purple font-medium' 
                  : 'text-foreground/80 hover:text-homi-purple'
              }`}
            >
              <MessageSquare size={20} />
              <span>Mensajes</span>
            </Link>
            <Link 
              to="/profile" 
              className={`flex items-center gap-2 py-3 transition-colors ${
                isActive('/profile') 
                  ? 'text-homi-purple font-medium' 
                  : 'text-foreground/80 hover:text-homi-purple'
              }`}
            >
              <User size={20} />
              <span>Mi Perfil</span>
            </Link>
            
            <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-border">
              <Button asChild variant="outline" className="rounded-full w-full justify-center">
                <Link to="/signin">
                  <LogIn className="mr-2 h-4 w-4" />
                  Iniciar Sesión
                </Link>
              </Button>
              <Button asChild className="rounded-full w-full justify-center bg-homi-purple hover:bg-homi-purple/90">
                <Link to="/register">Registrarse</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
