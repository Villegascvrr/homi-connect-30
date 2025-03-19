
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * This component uses the useLocation hook to detect route changes,
 * and automatically scrolls to the page positions based on the route:
 * - For home page ("/"), it scrolls to the signup form section
 * - For all other pages, it scrolls to the top
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname === "/") {
      // For home page, scroll to the form section with a longer delay
      // to ensure the page has fully loaded and rendered
      setTimeout(() => {
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
      }, 300); // Increased delay to ensure page is fully rendered
    } else {
      // For all other pages, scroll to top
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      console.log("Scrolled to top for path:", pathname);
    }
  }, [pathname]);

  return null; // This component doesn't render anything
};

export default ScrollToTop;
