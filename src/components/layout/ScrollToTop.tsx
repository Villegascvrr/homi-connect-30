
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * This component forces scroll to top on every route change
 * and handles special cases like scrolling to specific elements
 */
const ScrollToTop = () => {
  const { pathname, hash, search } = useLocation();

  useEffect(() => {
    // For all navigations, ALWAYS scroll to top first no matter what
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'auto' // Use auto instead of smooth for immediate effect
    });
    console.log("ALWAYS force scrolled to top for path:", pathname);
    
    // If there's a hash, only then attempt to scroll to the element
    // after the initial scroll to top
    if (hash) {
      const handleHashScroll = () => {
        const elementId = hash.replace('#', '');
        const element = document.getElementById(elementId);
        
        if (element) {
          // Only scroll to element if it exists, with a longer delay
          setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth' });
            console.log(`Scrolled to ${elementId} element due to hash`);
          }, 200); // Longer delay to ensure initial scroll to top completes
        } else {
          console.log("Hash target not found, already scrolled to top");
        }
      };

      // Execute hash scrolling after a delay to ensure initial scroll to top completes
      const timeoutId = setTimeout(handleHashScroll, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [pathname, hash, search]); // React to pathname, hash, and search changes

  return null; // This component doesn't render anything
};

export default ScrollToTop;
