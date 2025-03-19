
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * This component uses the useLocation hook to detect route changes,
 * and automatically scrolls to the top of the page whenever the route changes.
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top when pathname changes
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [pathname]);

  return null; // This component doesn't render anything
};

export default ScrollToTop;
