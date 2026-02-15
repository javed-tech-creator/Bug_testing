import { useEffect } from "react";

export default function useOutsideClick(ref, handler, active = true) {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);  
    };

    if (active) {
      document.addEventListener("mousedown", listener);
    }

    return () => {
      document.removeEventListener("mousedown", listener);
    };
  }, [ref, handler, active]);
}