import { useState, useEffect } from 'react';

/**
 * Custom hook to detect whether the user has requested reduced motion at the OS/browser level.
 * Handles SSR/JSDOM environments safely and subscribes to runtime media query changes.
 */
export function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return false;
    }
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return;
    }

    const mediaQueryList = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotionPreference = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    // Modern browsers support addEventListener on MediaQueryList
    if (typeof mediaQueryList.addEventListener === 'function') {
      mediaQueryList.addEventListener('change', updateMotionPreference);
      return () => {
        mediaQueryList.removeEventListener('change', updateMotionPreference);
      };
    } else if (typeof (mediaQueryList as any).addListener === 'function') {
      // Legacy Safari / older engines
      (mediaQueryList as any).addListener(updateMotionPreference);
      return () => {
        (mediaQueryList as any).removeListener(updateMotionPreference);
      };
    }
  }, []);

  return prefersReducedMotion;
}
