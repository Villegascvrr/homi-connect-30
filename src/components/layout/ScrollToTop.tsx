
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * This component forces scroll to top on every route change
 * with improved performance for smooth transitions
 */
const ScrollToTop = () => {
  const { pathname, hash, key } = useLocation();
  const prevPathRef = useRef('');
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Skip the effect on first render to avoid unnecessary scroll
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    
    // Skip the effect if the path hasn't actually changed
    if (prevPathRef.current === pathname) {
      return;
    }
    
    prevPathRef.current = pathname;
    
    // Use requestAnimationFrame to ensure scroll happens after renders
    requestAnimationFrame(() => {
      try {
        if (!hash) {
          // Use fastest scrolling method
          window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'auto' // Use 'auto' instead of 'smooth' for faster transitions
          });
          
          console.log("Scrolled to top for path:", pathname);
        } else {
          // For hash links, find and scroll to the element
          const elementId = hash.replace('#', '');
          const element = document.getElementById(elementId);
          
          if (element) {
            element.scrollIntoView({
              behavior: 'auto' // Use 'auto' for faster transitions
            });
            console.log(`Scrolled to element with id: ${elementId}`);
          } else {
            // If element not found, scroll to top
            window.scrollTo(0, 0);
            console.log(`Element with id ${elementId} not found, scrolled to top`);
          }
        }
      } catch (e) {
        console.error("Scroll error:", e);
        // Fallback method if the above fails
        window.scrollTo(0, 0);
      }
    });
  }, [pathname, hash, key]); // Added key to dependencies to ensure scroll on same-path but different-key navigation

  return null;
};

export default ScrollToTop;
