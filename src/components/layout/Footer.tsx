
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-homi-dark border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="inline-block">
              <span className="text-2xl font-bold text-homi-purple">Hominet</span>
            </Link>
            <p className="mt-4 text-muted-foreground max-w-md">
              Conectamos estudiantes universitarios y jóvenes profesionales con compañeros 
              de piso compatibles mediante un sistema de matching inteligente.
            </p>
          </div>

          {/* Links */}
          <div>
            <h5 className="font-bold text-lg mb-4">Enlaces</h5>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-homi-purple transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/matching" className="text-muted-foreground hover:text-homi-purple transition-colors">
                  Encuentra Compañeros
                </Link>
              </li>
              <li>
                <Link to="/properties" className="text-muted-foreground hover:text-homi-purple transition-colors">
                  Buscar Pisos
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-muted-foreground hover:text-homi-purple transition-colors">
                  Cómo Funciona
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h5 className="font-bold text-lg mb-4">Legal</h5>
            <ul className="space-y-3">
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-homi-purple transition-colors">
                  Política de Privacidad
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-homi-purple transition-colors">
                  Términos de Servicio
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="text-muted-foreground hover:text-homi-purple transition-colors">
                  Política de Cookies
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} Hominet. Todos los derechos reservados.
          </p>
          <div className="mt-4 md:mt-0 flex items-center gap-4">
            <a href="#" className="text-muted-foreground hover:text-homi-purple transition-colors">
              Instagram
            </a>
            <a href="#" className="text-muted-foreground hover:text-homi-purple transition-colors">
              Twitter
            </a>
            <a href="#" className="text-muted-foreground hover:text-homi-purple transition-colors">
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
