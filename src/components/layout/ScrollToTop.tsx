
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * This component forces scroll to top on every route change
 * and handles special cases like scrolling to specific elements
 */
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // For all navigations, ALWAYS scroll to top first no matter what
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'auto' // Use auto instead of smooth for immediate effect
    });
    console.log("ALWAYS force scrolled to top for path:", pathname);
    
    // Only scroll to hash elements if specifically requested with a hash in URL
    if (hash) {
      const handleHashScroll = () => {
        const elementId = hash.replace('#', '');
        const element = document.getElementById(elementId);
        
        if (element) {
          // Only scroll to element if it exists
          setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth' });
            console.log(`Scrolled to ${elementId} element due to hash`);
          }, 200);
        } else {
          console.log("Hash target not found, already scrolled to top");
        }
      };

      // Execute hash scrolling after a delay to ensure initial scroll to top completes
      const timeoutId = setTimeout(handleHashScroll, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [pathname, hash]); // Only react to pathname and hash changes

  return null; // This component doesn't render anything
};

export default ScrollToTop;
