
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * This component forces scroll to top on every route change
 * and handles special cases like scrolling to specific elements
 */
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // Define a function to handle scrolling
    const handleScroll = () => {
      // Check if we need to scroll to a specific element
      if (pathname === "/" && hash === "#signup-form") {
        // If there's a hash in the URL targeting the signup form, try to scroll to it
        const element = document.getElementById("signup-form");
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
          console.log("Scrolled to signup form element due to hash");
        }
      } else {
        // Force scroll to top for all other cases
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'auto' // Use auto instead of smooth for immediate effect
        });
        console.log("Force scrolled to top for path:", pathname);
      }
    };

    // Execute scroll after a short delay to ensure DOM is ready
    const timeoutId = setTimeout(handleScroll, 10);
    
    // Clean up the timeout
    return () => clearTimeout(timeoutId);
  }, [pathname, hash]); // React to both pathname and hash changes

  return null; // This component doesn't render anything
};

export default ScrollToTop;
