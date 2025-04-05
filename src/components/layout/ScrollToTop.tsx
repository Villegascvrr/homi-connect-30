
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * This component forces scroll to top on every route change
 * with improved handling for page transitions
 */
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();
  const prevPathRef = useRef('');
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Skip the effect on first render to avoid unnecessary scroll
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    
    // Skip the effect if the path hasn't actually changed
    // This prevents unwanted scroll resets when state changes but path doesn't
    if (prevPathRef.current === pathname) {
      return;
    }
    
    prevPathRef.current = pathname;
    
    // Handle scroll logic without delay to avoid waiting
    try {
      if (!hash) {
        // Use immediate scrolling for better performance
        window.scrollTo(0, 0);
        
        // Then ensure scroll position is reset for complete compatibility
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        
        console.log("Scrolled to top for path:", pathname);
      } else {
        // For hash links, find and scroll to the element
        const elementId = hash.replace('#', '');
        const element = document.getElementById(elementId);
        
        if (element) {
          element.scrollIntoView();
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
      console.log("Used fallback scroll method for path:", pathname);
    }
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
