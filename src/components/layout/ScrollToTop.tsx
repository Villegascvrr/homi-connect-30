
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
  const scrollTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    // Skip the effect on first render to avoid unnecessary scroll
    if (isFirstRender.current) {
      isFirstRender.current = false;
      console.log("ScrollToTop: First render, skipping scroll");
      return;
    }
    
    // Skip the effect if the path hasn't actually changed
    if (prevPathRef.current === pathname) {
      console.log("ScrollToTop: Path unchanged, skipping scroll");
      return;
    }
    
    console.log("ScrollToTop: Path changed from", prevPathRef.current, "to", pathname);
    prevPathRef.current = pathname;
    
    // Clear any previous pending scroll operation
    if (scrollTimeoutRef.current) {
      window.clearTimeout(scrollTimeoutRef.current);
    }
    
    // Defer scrolling slightly to ensure DOM has updated
    scrollTimeoutRef.current = window.setTimeout(() => {
      try {
        if (!hash) {
          // Use fastest scrolling method
          window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'instant' // Most modern browsers support this now
          });
          
          console.log("Scrolled to top for path:", pathname);
        } else {
          // For hash links, find and scroll to the element
          const elementId = hash.replace('#', '');
          const element = document.getElementById(elementId);
          
          if (element) {
            element.scrollIntoView({
              behavior: 'instant' 
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
    }, 10); // Short timeout to ensure render has completed
    
    return () => {
      if (scrollTimeoutRef.current) {
        window.clearTimeout(scrollTimeoutRef.current);
      }
      console.log("ScrollToTop: Component unmounted, skipping scroll");
    };
  }, [pathname, hash, key]); // Added key to dependencies to ensure scroll on same-path but different-key navigation

  return null;
};

export default ScrollToTop;
