
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
    // Set up cleanup function
    return () => {
      isMounted.current = false;
      if (scrollTimeoutRef.current) {
        window.clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

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
    
    // Clear any previous pending scroll operation
    if (scrollTimeoutRef.current) {
      window.clearTimeout(scrollTimeoutRef.current);
    }
    
    // Use shorter timeout for mobile devices for better responsiveness
    const timeoutDelay = isMobile ? 5 : 10;
    
    // Defer scrolling slightly to ensure DOM has updated
    scrollTimeoutRef.current = window.setTimeout(() => {
      // Check if component is still mounted
      if (!isMounted.current) return;
      
      try {
        if (!hash) {
          // Use fastest scrolling method with mobile optimization
          window.scrollTo({
            top: 0,
            left: 0,
            behavior: isMobile ? 'auto' : 'auto' // Always use auto for better performance
          });
          
          console.log(`Scrolled to top for path: ${pathname} (mobile: ${isMobile})`);
        } else {
          // For hash links, find and scroll to the element
          const elementId = hash.replace('#', '');
          const element = document.getElementById(elementId);
          
          if (element) {
            element.scrollIntoView({
              behavior: isMobile ? 'auto' : 'auto' // Always use auto for better performance
            });
            console.log(`Scrolled to element with id: ${elementId} (mobile: ${isMobile})`);
          } else {
            // If element not found, scroll to top
            window.scrollTo(0, 0);
            console.log(`Element with id ${elementId} not found, scrolled to top (mobile: ${isMobile})`);
          }
        }
      } catch (e) {
        console.error("Scroll error:", e);
        // Fallback method if the above fails
        window.scrollTo(0, 0);
      }
    }, timeoutDelay); 
    
  }, [pathname, hash, key, isMobile]); // Added isMobile to dependencies

  return null;
};

export default ScrollToTop;
