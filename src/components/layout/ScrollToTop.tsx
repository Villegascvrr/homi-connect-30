
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * This component uses the useLocation hook to detect route changes,
 * and automatically scrolls to the top of the page for all routes
 * including the home page
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Force immediate scroll to top for ALL pages
    window.scrollTo(0, 0);
    
    console.log("Forced scroll to top for path:", pathname);
    
    // Only for home page, check if we need to scroll to a specific section
    if (pathname === "/" && window.location.hash === "#signup-form") {
      // If there's a hash in the URL targeting the signup form, scroll to it
      setTimeout(() => {
        const formElement = document.getElementById("signup-form");
        if (formElement) {
          formElement.scrollIntoView({ behavior: 'smooth' });
          console.log("Scrolled to signup form due to hash");
        }
      }, 300); // Increased timeout to ensure DOM is fully rendered
    }
  }, [pathname]);

  return null; // This component doesn't render anything
};

export default ScrollToTop;
