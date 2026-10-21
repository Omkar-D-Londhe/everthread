import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePrefersReducedMotion } from './usePrefersReducedMotion.ts';

// Register ScrollTrigger safely across browser and test (JSDOM) environments
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  if (typeof window.matchMedia !== 'function') {
    window.matchMedia = (query: string) =>
      ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false
      }) as unknown as MediaQueryList;
  }
  gsap.registerPlugin(ScrollTrigger);
}

export interface UseEditorialScrollOptions {
  /**
   * Root DOM scope reference for GSAP context encapsulation and cleanup.
   */
  scopeRef: React.RefObject<HTMLElement | null>;

  /**
   * Selector for initial page header/kicker entrance elements.
   * Default: '.editorial-enter'
   */
  headerSelector?: string;

  /**
   * Selector for cards or grid items that stagger upon scrolling into view.
   * Default: '.editorial-card'
   */
  staggerSelector?: string;

  /**
   * Selector for full sections that reveal upon entering the viewport.
   * Default: '.editorial-section'
   */
  sectionSelector?: string;

  /**
   * Selector for editorial photography elements to apply subtle scale settle.
   * Default: '.editorial-image'
   */
  imageSelector?: string;

  /**
   * Dependencies array to re-run animations if route params or items change.
   */
  deps?: React.DependencyList;
}

const isTestEnv = typeof process !== 'undefined' && process.env?.NODE_ENV === 'test';

/**
 * EverThread Signature Editorial Motion Hook
 * Principle: "Initiate → Glide → Settle"
 *
 * - Initiate: Elements enter viewport or page mounts.
 * - Glide: Smooth, controlled power2.out ease with subtle 16-24px rise.
 * - Settle: Resolves into crisp final position without overshoot or bounce.
 *
 * Automatically cleans up ScrollTriggers on unmount and respects prefers-reduced-motion.
 */
export function useEditorialScroll({
  scopeRef,
  headerSelector = '.editorial-enter',
  staggerSelector = '.editorial-card',
  sectionSelector = '.editorial-section',
  imageSelector = '.editorial-image',
  deps = []
}: UseEditorialScrollOptions) {
  const prefersReduced = usePrefersReducedMotion();

  useEffect(() => {
    const scope = scopeRef.current;
    if (!scope || typeof window === 'undefined') return;

    // In reduced-motion or test environments, settle all elements immediately without listeners
    if (prefersReduced || isTestEnv) {
      const allElements = scope.querySelectorAll<HTMLElement>(
        `${headerSelector}, ${staggerSelector}, ${sectionSelector}, ${imageSelector}`
      );
      allElements.forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
        el.style.visibility = 'visible';
      });
      return;
    }

    // Encapsulate all GSAP animations and triggers inside a scoped context
    const ctx = gsap.context(() => {
      // 1. Initial Page Entrance (Initiate → Settle)
      const headerElements = scope.querySelectorAll(headerSelector);
      if (headerElements.length > 0) {
        gsap.fromTo(
          headerElements,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.08,
            ease: 'power2.out',
            clearProps: 'transform'
          }
        );
      }

      // 2. Staggered Card Reveals (Immediate in-viewport vs Off-screen ScrollTrigger)
      const cards = Array.from(scope.querySelectorAll<HTMLElement>(staggerSelector));
      if (cards.length > 0) {
        const windowH = typeof window !== 'undefined' ? (window.innerHeight || document.documentElement.clientHeight) : 800;
        const inViewCards: HTMLElement[] = [];
        const offScreenCards: HTMLElement[] = [];

        cards.forEach((card) => {
          const rect = card.getBoundingClientRect();
          if (rect.top < windowH * 0.95 && rect.bottom > 0) {
            inViewCards.push(card);
          } else {
            offScreenCards.push(card);
          }
        });

        if (inViewCards.length > 0) {
          gsap.fromTo(
            inViewCards,
            { opacity: 0, y: 16 },
            {
              opacity: 1,
              y: 0,
              duration: 0.55,
              stagger: 0.06,
              ease: 'power2.out',
              clearProps: 'transform'
            }
          );
        }

        if (offScreenCards.length > 0) {
          ScrollTrigger.batch(offScreenCards, {
            start: 'top 88%',
            once: true,
            onEnter: (batch) => {
              gsap.fromTo(
                batch,
                { opacity: 0, y: 20 },
                {
                  opacity: 1,
                  y: 0,
                  duration: 0.55,
                  stagger: 0.08,
                  ease: 'power2.out',
                  overwrite: 'auto',
                  clearProps: 'transform'
                }
              );
            }
          });
        }
      }

      // 3. Section Flow Reveals (Initiate → Glide → Settle)
      const sections = scope.querySelectorAll(sectionSelector);
      sections.forEach(sec => {
        gsap.fromTo(
          sec,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sec,
              start: 'top 85%',
              once: true
            },
            clearProps: 'transform'
          }
        );
      });

      // 4. Subtle Photographic Scale Settle
      const images = scope.querySelectorAll(imageSelector);
      images.forEach(img => {
        gsap.fromTo(
          img,
          { opacity: 0.85, scale: 0.98 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.7,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: img,
              start: 'top 88%',
              once: true
            },
            clearProps: 'transform'
          }
        );
      });

      // Synchronize trigger calculations after initial DOM layout settle
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
    }, scope);

    return () => {
      ctx.revert(); // Strictly kill all triggers and reset scoped elements
    };
  }, [prefersReduced, headerSelector, staggerSelector, sectionSelector, imageSelector, ...deps]);
}
