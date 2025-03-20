
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * This component forces scroll to top on every route change
 * and handles special cases like scrolling to specific elements
 */
const ScrollToTop = () => {
  const { pathname, hash, search } = useLocation();

  useEffect(() => {
    // If there's no hash, always scroll to top immediately
    if (!hash) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'auto' // Use auto instead of smooth for immediate effect
      });
      console.log("Force scrolled to top for path:", pathname);
      return;
    }

    // Only handle hash-based scrolling if explicitly requested
    // with a valid element ID
    const handleHashScroll = () => {
      if (hash) {
        const elementId = hash.replace('#', '');
        const element = document.getElementById(elementId);
        
        if (element) {
          // Only scroll to element if it exists
          element.scrollIntoView({ behavior: 'smooth' });
          console.log(`Scrolled to ${elementId} element due to hash`);
        } else {
          // If element doesn't exist, default to top
          window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'auto'
          });
          console.log("Hash target not found, scrolled to top");
        }
      }
    };

    // Execute hash scrolling after a short delay to ensure DOM is ready
    const timeoutId = setTimeout(handleHashScroll, 100);
    
    // Clean up the timeout
    return () => clearTimeout(timeoutId);
  }, [pathname, hash, search]); // React to pathname, hash, and search changes

  return null; // This component doesn't render anything
};

export default ScrollToTop;
