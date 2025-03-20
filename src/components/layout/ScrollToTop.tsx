
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * This component forces scroll to top on every route change
 * and handles special cases like scrolling to specific elements
 */
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // Force immediate scroll to top
    window.scrollTo(0, 0);
    
    // Log for debugging
    console.log("Forced scroll to top for path:", pathname);
    
    // Handle hash navigation separately, with enough delay to ensure the initial scroll completed
    if (hash) {
      // Wait for DOM to be ready
      setTimeout(() => {
        const elementId = hash.replace('#', '');
        const element = document.getElementById(elementId);
        
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
          console.log(`Scrolled to element with id: ${elementId}`);
        } else {
          console.log(`Element with id ${elementId} not found`);
        }
      }, 300); // Longer timeout to ensure initial scroll completes
    }
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
