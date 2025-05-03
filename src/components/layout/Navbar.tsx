
import { useState, useEffect } from 'react';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthButton from '@/components/auth/AuthButton';
import { useAuth } from '@/context/AuthContext';
import DeveloperModeBanner from '@/components/layout/DeveloperModeBanner';
import NavbarActions from '@/components/layout/NavbarActions';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [theme, setTheme] = useState<'light' | 'dark'>(
    document.documentElement.classList.contains('dark') ? 'dark' : 'light'
  );
  
  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Handle theme toggle
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };
  
  // Safe navigation guard - close menu when changing pages
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);
  
  // Handle closing mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isMenuOpen && !target.closest('#navbar-mobile-menu') && !target.closest('#navbar-menu-button')) {
        setIsMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);
  
  return (
    <>
      <DeveloperModeBanner />
    
      <header className={`fixed top-0 w-full z-40 transition-all duration-200 ${scrolled ? 'bg-background/80 backdrop-blur-md shadow-sm' : 'bg-transparent'}`}>
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2">
                <img 
                  src="/lovable-uploads/2d51c735-5f08-4390-8bb3-9f96a25db216.png" 
                  alt="HomiMatch" 
                  className="h-8 w-auto"
                />
                <span className="font-bold text-lg tracking-tight">HomiMatch</span>
              </Link>
            </div>
            
            {/* Desktop navigation */}
            <nav className="hidden md:flex items-center gap-1">
              <Button variant="ghost" asChild>
                <Link to="/">Inicio</Link>
              </Button>
              
              {user && (
                <>
                  <Button variant="ghost" asChild>
                    <Link to="/matching">Buscar Match</Link>
                  </Button>
                  <Button variant="ghost" asChild>
                    <Link to="/chat">Chat</Link>
                  </Button>
                </>
              )}
              
              <Button variant="ghost" asChild>
                <Link to="/cookies">Recursos</Link>
              </Button>
            </nav>
            
            {/* Actions section */}
            <div className="flex items-center gap-4">
              {/* Theme toggle button */}
              <Button variant="ghost" size="icon" onClick={toggleTheme}>
                {theme === 'light' ? <Moon className="h-[1.2rem] w-[1.2rem]" /> : <Sun className="h-[1.2rem] w-[1.2rem]" />}
              </Button>
              
              {/* NavbarActions component for authenticated user */}
              <NavbarActions className="hidden md:flex" />
              
              {/* Authentication button */}
              <AuthButton className="hidden md:block" />
              
              {/* Mobile menu button */}
              <Button
                id="navbar-menu-button"
                variant="ghost" 
                size="icon"
                className="md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div 
            id="navbar-mobile-menu"
            className="md:hidden fixed inset-x-0 top-16 bg-background/95 backdrop-blur-md shadow-md overflow-hidden transition-all z-50"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-2">
              <Link 
                to="/" 
                className="flex items-center px-4 py-2 text-sm font-medium rounded-md hover:bg-accent"
                onClick={() => setIsMenuOpen(false)}
              >
                Inicio
              </Link>
              
              {user && (
                <>
                  <Link 
                    to="/matching" 
                    className="flex items-center px-4 py-2 text-sm font-medium rounded-md hover:bg-accent"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Buscar Match
                  </Link>
                  <Link 
                    to="/chat" 
                    className="flex items-center px-4 py-2 text-sm font-medium rounded-md hover:bg-accent"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Chat
                  </Link>
                </>
              )}
              
              <Link 
                to="/cookies" 
                className="flex items-center px-4 py-2 text-sm font-medium rounded-md hover:bg-accent"
                onClick={() => setIsMenuOpen(false)}
              >
                Recursos
              </Link>
              
              {user && (
                <Link 
                  to="/profile" 
                  className="flex items-center px-4 py-2 text-sm font-medium rounded-md hover:bg-accent"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Mi Perfil
                </Link>
              )}

              <div className="mt-2 pt-2 border-t">
                <AuthButton className="w-full" />
              </div>
            </div>
          </div>
        )}
      </header>
      
      {/* Empty div to push content below fixed navbar */}
      <div className="h-16"></div>
    </>
  );
};

export default Navbar;
