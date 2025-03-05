
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, Home, Users, MessageSquare, User } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
          <Link to="/" className="text-foreground/80 hover:text-homi-purple transition-colors">
            Inicio
          </Link>
          <Link to="/matching" className="text-foreground/80 hover:text-homi-purple transition-colors">
            Encuentra Compañeros
          </Link>
          <Link to="/how-it-works" className="text-foreground/80 hover:text-homi-purple transition-colors">
            Cómo Funciona
          </Link>
        </nav>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Button variant="outline" className="rounded-full">
            Iniciar Sesión
          </Button>
          <Button className="rounded-full bg-homi-purple hover:bg-homi-purple/90">
            Registrarse
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
              className="flex items-center gap-2 py-3 text-foreground/80 hover:text-homi-purple transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <Home size={20} />
              <span>Inicio</span>
            </Link>
            <Link 
              to="/matching" 
              className="flex items-center gap-2 py-3 text-foreground/80 hover:text-homi-purple transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <Users size={20} />
              <span>Encuentra Compañeros</span>
            </Link>
            <Link 
              to="/chat" 
              className="flex items-center gap-2 py-3 text-foreground/80 hover:text-homi-purple transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <MessageSquare size={20} />
              <span>Mensajes</span>
            </Link>
            <Link 
              to="/profile" 
              className="flex items-center gap-2 py-3 text-foreground/80 hover:text-homi-purple transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <User size={20} />
              <span>Mi Perfil</span>
            </Link>
            
            <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-border">
              <Button variant="outline" className="rounded-full w-full justify-center">
                Iniciar Sesión
              </Button>
              <Button className="rounded-full w-full justify-center bg-homi-purple hover:bg-homi-purple/90">
                Registrarse
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
