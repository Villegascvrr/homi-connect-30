
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * This component uses the useLocation hook to detect route changes,
 * and automatically scrolls to the top of the page for all routes
 * except for the home page ("/"), which scrolls to the signup form section
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Force immediate execution of scroll after route change
    if (pathname === "/") {
      // For home page, scroll to the form section
      const scrollToForm = () => {
        const formElement = document.getElementById("signup-form");
        if (formElement) {
          formElement.scrollIntoView({ behavior: 'smooth' });
          console.log("Scrolled to signup form");
        } else {
          // If form element not found, scroll to a position that should reveal the form
          console.log("Signup form element not found, scrolling to estimated position");
          window.scrollTo({
            top: window.innerHeight, // Scroll approximately one viewport height
            behavior: 'smooth'
          });
        }
      };

      // Ensure DOM is fully rendered before attempting to scroll
      window.requestAnimationFrame(() => {
        // Add a slight delay to ensure React has completed rendering
        setTimeout(scrollToForm, 100);
      });
    } else {
      // For all other pages, scroll to top immediately
      window.scrollTo({
        top: 0,
        behavior: 'auto' // Changed to 'auto' for immediate scrolling without animation
      });
      console.log("Scrolled to top for path:", pathname);
    }
  }, [pathname]);

  return null; // This component doesn't render anything
};

export default ScrollToTop;
