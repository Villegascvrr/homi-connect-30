
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertCircle } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Alert, AlertDescription } from "@/components/ui/alert";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [errorDetails, setErrorDetails] = useState("");

  useEffect(() => {
    console.log("404 Error: User attempted to access non-existent route:", location.pathname);
    
    // Check if there's an error in the state or search params
    const searchParams = new URLSearchParams(location.search);
    const errorMessage = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');
    
    if (errorMessage || errorDescription) {
      setErrorDetails(`Error: ${errorMessage || ''} ${errorDescription || ''}`);
      console.error("Auth error detected:", errorMessage, errorDescription);
    }

    // Check for authentication redirects that might have failed
    if (location.pathname.includes('/callback') || location.pathname.includes('/auth/callback')) {
      console.error("Possible failed auth callback detected at:", location.pathname);
    }
    
    // Force scroll to top immediately with no delay
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'auto'
    });
  }, [location.pathname, location.search]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center bg-gray-50 py-8 px-4">
        <div className="max-w-md w-full text-center">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-homi-ultraLightPurple text-homi-purple mb-3">
              <span className="text-xl font-bold">404</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold mb-2">Página no encontrada</h1>
            <p className="text-muted-foreground text-sm">
              Lo sentimos, la página que estás buscando no existe o ha sido movida.
            </p>
            
            {errorDetails && (
              <Alert className="mt-4 bg-amber-50 text-amber-800 border border-amber-200">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {errorDetails}
                </AlertDescription>
              </Alert>
            )}
          </div>
          
          <div className="flex flex-col md:flex-row gap-3 justify-center">
            <Button 
              variant="outline" 
              className="flex items-center gap-2" 
              onClick={handleGoBack}
              size="sm"
            >
              <ArrowLeft size={16} />
              Volver atrás
            </Button>
            <Button 
              className="bg-homi-purple hover:bg-homi-purple/90"
              onClick={handleGoHome}
              size="sm"
            >
              Ir al inicio
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NotFound;
