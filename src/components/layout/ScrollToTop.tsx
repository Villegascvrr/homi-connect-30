
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * This component forces scroll to top on every route change
 * and handles special cases like scrolling to specific elements
 */
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // Check if there's a hash in the URL
    if (!hash) {
      // If there's no hash, immediately scroll to top
      window.scrollTo(0, 0);
      console.log("Forced scroll to top for path:", pathname);
    } else {
      // If there is a hash, handle it after a small delay to ensure DOM is ready
      setTimeout(() => {
        const elementId = hash.replace('#', '');
        const element = document.getElementById(elementId);
        
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
          console.log(`Scrolled to element with id: ${elementId}`);
        } else {
          // If element doesn't exist, scroll to top instead
          window.scrollTo(0, 0);
          console.log(`Element with id ${elementId} not found, scrolled to top`);
        }
      }, 300);
    }
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
