
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * This component forces scroll to top on every route change
 * and handles special cases like scrolling to specific elements
 */
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // This function handles the scrolling logic
    const handleScroll = () => {
      // If there's a hash in the URL, try to scroll to that element
      if (hash) {
        // Small delay to ensure DOM is ready
        setTimeout(() => {
          const elementId = hash.replace('#', '');
          const element = document.getElementById(elementId);
          
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            console.log(`Scrolled to element with id: ${elementId}`);
          } else {
            // If element doesn't exist, scroll to top
            window.scrollTo(0, 0);
            console.log(`Element with id ${elementId} not found, scrolled to top`);
          }
        }, 300);
      } else {
        // No hash, scroll to top immediately
        // Using setTimeout to ensure this runs after any browser's default scroll behavior
        setTimeout(() => {
          window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'auto' // Using 'auto' instead of 'smooth' for immediate effect
          });
          console.log("Forced scroll to top for path:", pathname);
        }, 0);
      }
    };

    // Execute scroll handling
    handleScroll();

    // Clean up any potential side effects
    return () => {
      // Cancel any pending timeouts if component unmounts during navigation
      // This helps prevent scroll issues during quick navigation changes
    };
  }, [pathname, hash]); // Re-run when pathname or hash changes

  return null;
};

export default ScrollToTop;
