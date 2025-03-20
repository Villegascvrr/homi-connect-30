
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
    // Force immediate scroll to top for ALL pages including home page
    window.scrollTo({
      top: 0,
      behavior: 'auto' // Using 'auto' for immediate scrolling without animation
    });
    
    console.log("Scrolled to top for path:", pathname);
    
    // Only for home page, after scrolling to top, check if we need to scroll to a specific section
    // based on URL hash or other conditions
    if (pathname === "/" && window.location.hash === "#signup-form") {
      // If there's a hash in the URL targeting the signup form, scroll to it
      setTimeout(() => {
        const formElement = document.getElementById("signup-form");
        if (formElement) {
          formElement.scrollIntoView({ behavior: 'smooth' });
          console.log("Scrolled to signup form due to hash");
        }
      }, 100);
    }
  }, [pathname]);

  return null; // This component doesn't render anything
};

export default ScrollToTop;
