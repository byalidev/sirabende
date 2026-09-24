"use client";

import { useEffect, useRef, type ReactNode } from "react";

// Ensures the existing <details> filter panel is expanded on desktop/tablet,
// while leaving the native accordion (tap-to-open, closed by default) untouched on mobile.
export function ResponsiveFilterPanel({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const details = ref.current;
    if (!details) return;
    const mql = window.matchMedia("(min-width: 761px)");
    const sync = () => {
      if (mql.matches) details.open = true;
    };
    sync();
    mql.addEventListener("change", sync);
    return () => mql.removeEventListener("change", sync);
  }, []);

  return <details className="request-filter-panel" ref={ref}>{children}</details>;
}
