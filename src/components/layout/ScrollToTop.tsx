
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * This component uses the useLocation hook to detect route changes,
 * and automatically scrolls to the top of the page whenever the route changes.
 * 
 * For the home page ("/"), it will not scroll automatically, allowing
 * users to see the hero section first rather than being directed to the form.
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Don't auto-scroll on the home page to avoid jumping to the form
    if (pathname !== "/") {
      // Scroll to top when pathname changes for non-home pages
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, [pathname]);

  return null; // This component doesn't render anything
};

export default ScrollToTop;
