import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/** After a route change, scroll to the element matching the URL hash once it exists. */
export function useScrollToHash() {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;
    const id = hash.slice(1);
    const raf = requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    });
    return () => cancelAnimationFrame(raf);
  }, [hash]);
}
