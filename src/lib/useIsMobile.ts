"use client";

import { useEffect, useState } from "react";

/**
 * Tracks whether the viewport is phone-sized (< `breakpoint`px), used to
 * trim the heavy WebGL scenes on mobile — fewer particles, lower pixel
 * ratio, and dropping the decorative hero crystal entirely. Returns `false`
 * during SSR / first paint so the server and client markup agree.
 */
export function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [breakpoint]);

  return isMobile;
}
