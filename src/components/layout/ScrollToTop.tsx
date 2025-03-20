
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * This component forces scroll to top on every route change
 * with improved handling for page transitions
 */
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();
  const prevPathRef = useRef('');

  useEffect(() => {
    // Skip the effect if the path hasn't actually changed
    // This prevents unwanted scroll resets when state changes but path doesn't
    if (prevPathRef.current === pathname) {
      return;
    }
    
    prevPathRef.current = pathname;
    
    // Handle scroll logic inside a callback that runs after all renders and effects
    // This ensures DOM is fully updated before scrolling
    const scrollTimeout = setTimeout(() => {
      if (!hash) {
        try {
          // First try window.scrollTo for older browsers
          window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'instant' // Use 'instant' instead of 'auto' for immediate scroll
          });
          
          // Then try document elements for better compatibility
          document.documentElement.scrollTop = 0;
          document.body.scrollTop = 0;
          
          // Remove any focus that might cause scrolling
          document.activeElement instanceof HTMLElement && document.activeElement.blur();
          
          console.log("Forced scroll to top for path:", pathname);
        } catch (e) {
          // Fallback method if the above fails
          window.scrollTo(0, 0);
          console.log("Used fallback scroll method for path:", pathname);
        }
      } else {
        // For hash links, wait a bit longer to ensure DOM is fully rendered
        setTimeout(() => {
          try {
            const elementId = hash.replace('#', '');
            const element = document.getElementById(elementId);
            
            if (element) {
              element.scrollIntoView({ behavior: 'instant' });
              console.log(`Scrolled to element with id: ${elementId}`);
            } else {
              // If element not found, scroll to top
              window.scrollTo(0, 0);
              document.documentElement.scrollTop = 0;
              document.body.scrollTop = 0;
              console.log(`Element with id ${elementId} not found, scrolled to top`);
            }
          } catch (e) {
            // Fallback for hash navigation errors
            window.scrollTo(0, 0);
            console.log("Hash navigation error, used fallback scroll");
          }
        }, 50);
      }
    }, 10);
    
    // Cleanup the timeout if component unmounts or route changes again
    return () => clearTimeout(scrollTimeout);
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
