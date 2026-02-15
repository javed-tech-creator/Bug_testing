import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Hook to scroll to top on route changes
 * Can be used in nested route components or layouts
 * @param {number} delay - Optional delay in ms before scrolling (useful for animations)
 */
export const useScrollToTop = (delay = 0) => {
  const { pathname } = useLocation();

  useEffect(() => {
    if (delay === 0) {
      window.scrollTo(0, 0);
    } else {
      const timer = setTimeout(() => {
        window.scrollTo(0, 0);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [pathname, delay]);
};

export default useScrollToTop;
