
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
    
    // Explicitly force scroll to top with a different method
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0; // For Safari
  }, [location.pathname]);

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="max-w-md w-full text-center">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-homi-ultraLightPurple text-homi-purple mb-4">
              <span className="text-2xl font-bold">404</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Página no encontrada</h1>
            <p className="text-muted-foreground">
              Lo sentimos, la página que estás buscando no existe o ha sido movida.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-3 justify-center">
            <Button 
              variant="outline" 
              className="flex items-center gap-2" 
              onClick={handleGoBack}
            >
              <ArrowLeft size={16} />
              Volver atrás
            </Button>
            <Button 
              className="bg-homi-purple hover:bg-homi-purple/90"
              asChild
            >
              <Link to="/">Ir al inicio</Link>
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NotFound;
