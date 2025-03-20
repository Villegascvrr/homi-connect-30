
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * This component forces scroll to top on every route change
 * and handles special cases like scrolling to specific elements
 */
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // Force scroll to top immediately when route changes
    if (!hash) {
      // Use both methods for maximum compatibility
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      console.log("Forced scroll to top for path:", pathname);
    } else {
      // Wait for DOM to be ready before scrolling to hash
      const scrollToElement = () => {
        const elementId = hash.replace('#', '');
        const element = document.getElementById(elementId);
        
        if (element) {
          // Use both methods
          element.scrollIntoView({ behavior: 'auto' });
          console.log(`Scrolled to element with id: ${elementId}`);
        } else {
          // Element not found, scroll to top
          window.scrollTo(0, 0);
          document.documentElement.scrollTop = 0;
          document.body.scrollTop = 0;
          console.log(`Element with id ${elementId} not found, scrolled to top`);
        }
      };
      
      // Delay slightly to ensure DOM is fully rendered
      setTimeout(scrollToElement, 100);
    }
    
    // Prevent any focus on elements that might cause unwanted scrolling
    document.activeElement instanceof HTMLElement && document.activeElement.blur();
    
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
