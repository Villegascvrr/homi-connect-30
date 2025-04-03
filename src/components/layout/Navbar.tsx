import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import AuthButton from '@/components/auth/AuthButton';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const location = useLocation();
  const isMobile = useIsMobile();
  const { user, signOut } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = (dropdown: string) => {
    if (activeDropdown === dropdown) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(dropdown);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    // Close mobile menu when route changes
    setIsMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Inicio', path: '/' },
    { name: 'Cómo funciona', path: '/how-it-works' },
    { 
      name: 'Encuentra compañeros', 
      path: '/matching',
      dropdown: [
        { name: 'Buscar compañeros', path: '/matching' },
        { name: 'Compatibilidad', path: '/compatibility' },
      ]
    },
    { name: 'Perfil', path: '/profile', requiresAuth: true },
    { name: 'Chat', path: '/chat', requiresAuth: true },
  ];

  const filteredNavLinks = navLinks.filter(link => 
    !link.requiresAuth || (link.requiresAuth && user)
  );

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      isScrolled ? "bg-white/80 dark:bg-background/80 backdrop-blur-md shadow-sm" : "bg-transparent"
    )}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-xl md:text-2xl font-bold homi-gradient-text">Homi</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {filteredNavLinks.map((link) => (
              !link.dropdown ? (
                <Link
                  key={link.name}
                  to={link.path}
                  className={cn(
                    "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    location.pathname === link.path
                      ? "text-homi-purple"
                      : "text-foreground hover:text-homi-purple"
                  )}
                >
                  {link.name}
                </Link>
              ) : (
                <div key={link.name} className="relative">
                  <button
                    className={cn(
                      "px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center",
                      activeDropdown === link.name || link.dropdown.some(item => location.pathname === item.path)
                        ? "text-homi-purple"
                        : "text-foreground hover:text-homi-purple"
                    )}
                    onClick={() => toggleDropdown(link.name)}
                  >
                    {link.name}
                    {activeDropdown === link.name ? (
                      <ChevronUp className="ml-1 h-4 w-4" />
                    ) : (
                      <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </button>
                  {activeDropdown === link.name && (
                    <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-card ring-1 ring-black ring-opacity-5 z-50">
                      <div className="py-1">
                        {link.dropdown.map((item) => (
                          <Link
                            key={item.name}
                            to={item.path}
                            className="block px-4 py-2 text-sm text-foreground hover:bg-muted"
                            onClick={() => setActiveDropdown(null)}
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            ))}
          </nav>

          {/* Auth Buttons / User Menu */}
          <div className="hidden md:block">
            <AuthButton />
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-card shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {filteredNavLinks.map((link) => (
              !link.dropdown ? (
                <Link
                  key={link.name}
                  to={link.path}
                  className={cn(
                    "block px-3 py-2 rounded-md text-base font-medium",
                    location.pathname === link.path
                      ? "bg-homi-ultraLightPurple text-homi-purple"
                      : "text-foreground hover:bg-muted"
                  )}
                >
                  {link.name}
                </Link>
              ) : (
                <div key={link.name}>
                  <button
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-md text-base font-medium flex items-center justify-between",
                      activeDropdown === link.name || link.dropdown.some(item => location.pathname === item.path)
                        ? "bg-homi-ultraLightPurple text-homi-purple"
                        : "text-foreground hover:bg-muted"
                    )}
                    onClick={() => toggleDropdown(link.name)}
                  >
                    {link.name}
                    {activeDropdown === link.name ? (
                      <ChevronUp className="ml-1 h-4 w-4" />
                    ) : (
                      <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </button>
                  {activeDropdown === link.name && (
                    <div className="pl-4 space-y-1 mt-1">
                      {link.dropdown.map((item) => (
                        <Link
                          key={item.name}
                          to={item.path}
                          className="block px-3 py-2 rounded-md text-sm text-foreground hover:bg-muted"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )
            ))}
            
            {/* Mobile Auth Buttons */}
            <div className="pt-2 pb-1">
              {!user ? (
                <>
                  <Link
                    to="/signin"
                    className="block w-full text-center px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-muted"
                  >
                    Iniciar sesión
                  </Link>
                  <Link
                    to="/register"
                    className="block w-full text-center mt-2 px-3 py-2 rounded-md text-base font-medium bg-homi-purple text-white hover:bg-homi-purple/90"
                  >
                    Registrarse
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/profile"
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-muted"
                  >
                    Mi perfil
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    Cerrar sesión
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
