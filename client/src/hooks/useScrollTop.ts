import { useEffect } from "react";
import { useLocation } from "wouter";

/** Every route change lands at the top of the new page, like a classic site. */
export function useScrollTop() {
  const [pathname] = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);
}

