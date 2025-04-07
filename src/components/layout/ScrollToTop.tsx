
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

/**
 * This component forces scroll to top on every route change
 * with improved performance for smooth transitions on both mobile and desktop
 */
const ScrollToTop = () => {
  const { pathname, hash, key } = useLocation();
  const prevPathRef = useRef('');
  const isFirstRender = useRef(true);
  const scrollTimeoutRef = useRef<number | null>(null);
  const isMounted = useRef(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    console.log(`ScrollToTop mounted for path: ${pathname}`);
    // Set up cleanup function
    return () => {
      isMounted.current = false;
      if (scrollTimeoutRef.current) {
        window.clearTimeout(scrollTimeoutRef.current);
      }
      console.log(`ScrollToTop unmounted from path: ${pathname}`);
    };
  }, [pathname]);

  useEffect(() => {
    // Skip the effect on first render to avoid unnecessary scroll
    if (isFirstRender.current) {
      console.log("ScrollToTop: First render, skipping scroll");
      isFirstRender.current = false;
      return;
    }
    
    // Skip the effect if the path hasn't actually changed
    if (prevPathRef.current === pathname) {
      console.log("ScrollToTop: Same path, skipping scroll");
      return;
    }
    
    console.log(`ScrollToTop: Path changed from ${prevPathRef.current} to ${pathname}`);
    prevPathRef.current = pathname;
    
    // Clear any previous pending scroll operation
    if (scrollTimeoutRef.current) {
      window.clearTimeout(scrollTimeoutRef.current);
    }
    
    // Use shorter timeout for better responsiveness - consistent between mobile and desktop
    const timeoutDelay = 10;
    
    // Defer scrolling slightly to ensure DOM has updated
    scrollTimeoutRef.current = window.setTimeout(() => {
      // Check if component is still mounted
      if (!isMounted.current) {
        console.log("ScrollToTop: Component unmounted, skipping scroll");
        return;
      }
      
      try {
        if (!hash) {
          // Use fastest scrolling method with mobile optimization
          window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'auto' // Always use auto for better performance
          });
          
          console.log(`ScrollToTop: Scrolled to top for path: ${pathname}`);
        } else {
          // For hash links, find and scroll to the element
          const elementId = hash.replace('#', '');
          const element = document.getElementById(elementId);
          
          if (element) {
            element.scrollIntoView({
              behavior: 'auto' // Always use auto for better performance
            });
            console.log(`ScrollToTop: Scrolled to element with id: ${elementId}`);
          } else {
            // If element not found, scroll to top
            window.scrollTo(0, 0);
            console.log(`ScrollToTop: Element with id ${elementId} not found, scrolled to top`);
          }
        }
      } catch (e) {
        console.error("ScrollToTop: Scroll error:", e);
        // Fallback method if the above fails
        window.scrollTo(0, 0);
      }
    }, timeoutDelay); 
    
  }, [pathname, hash, key]); // Removed isMobile from dependencies to avoid unnecessary re-renders

  return null;
};

export default ScrollToTop;
