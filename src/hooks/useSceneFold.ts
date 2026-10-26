import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MOTION_TOKENS } from '../config/designTokens.ts';
import { usePrefersReducedMotion } from './usePrefersReducedMotion.ts';

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
  (window as unknown as { ScrollTrigger?: typeof ScrollTrigger }).ScrollTrigger = ScrollTrigger;
}

declare global {
  interface Window {
    __scrollTriggerCount?: number;
    ScrollTrigger?: any;
  }
}

export interface UseSceneFoldOptions {
  sceneId: string;
  disabled?: boolean;
}

export function useSceneFold(
  containerRef: React.RefObject<HTMLElement | null>,
  options: UseSceneFoldOptions
) {
  const { sceneId, disabled = false } = options;
  const prefersReduced = usePrefersReducedMotion();
  const [isReady, setIsReady] = useState(false);
  const [isComplete, setIsComplete] = useState<boolean>(() => Boolean(disabled || prefersReduced));
  const settleTweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof window === 'undefined' || disabled || prefersReduced) {
      setIsComplete(true);
      return;
    }

    // Reduced motion or test environment check: bypass completely unless explicitly testing motion
    const isTest = typeof process !== 'undefined' && process.env?.NODE_ENV === 'test';
    const forceMotionTest = Boolean(
      (window as unknown as { __EVERTHREAD_TEST_MOTION__?: boolean }).__EVERTHREAD_TEST_MOTION__ ||
      (typeof window.location?.search === 'string' && window.location.search.includes('test-motion=true'))
    );
    if (isTest && !forceMotionTest) {
      setIsComplete(true);
      return;
    }

    let isDestroyed = false;
    let scrollTimeout: ReturnType<typeof setTimeout> | null = null;
    const isMobile = window.innerWidth <= 768;
    const numBands = isMobile
      ? MOTION_TOKENS.fold.bandsMobile
      : MOTION_TOKENS.fold.bandsDesktop;
    const maxAngle = isMobile
      ? MOTION_TOKENS.fold.maxHingeAngleMobile
      : MOTION_TOKENS.fold.maxHingeAngleDesktop;
    const restTilt = isMobile ? MOTION_TOKENS.fold.restTiltMobile : 0;
    const stagger = MOTION_TOKENS.fold.bandStagger;

    const completeImmediately = () => {
      if (settleTweenRef.current) {
        settleTweenRef.current.kill();
        settleTweenRef.current = null;
      }
      setIsComplete(true);
      if (el) {
        el.classList.add('is-complete');
        el.setAttribute('data-fold-complete', 'true');
        const panels = el.querySelector<HTMLElement>('.scene-fold__panels');
        if (panels) {
          panels.style.display = 'none';
        }
      }
    };

    // Completion Guarantee 1: Focus inside the scene instantly reveals it
    const handleFocusIn = () => {
      completeImmediately();
    };
    el.addEventListener('focusin', handleFocusIn);

    // Completion Guarantee 2: Hash navigation directly to an anchor inside the scene
    const handleHashChange = () => {
      if (window.location.hash && el.querySelector(window.location.hash)) {
        completeImmediately();
      }
    };
    window.addEventListener('hashchange', handleHashChange);

    let ctx: gsap.Context | null = null;

    try {
      ctx = gsap.context(() => {
        const panelsContainer = el.querySelector<HTMLElement>('.scene-fold__panels');
        const bands = el.querySelectorAll<HTMLElement>('.scene-fold__band');

        if (!panelsContainer || bands.length === 0) {
          completeImmediately();
          return;
        }

        const progressProxy = { value: 0 };

        const applyBandRotation = (prog: number) => {
          if (prog >= 0.999) {
            completeImmediately();
            return;
          }

          bands.forEach((band, idx) => {
            // Apply stagger across bands
            const start = idx * stagger;
            const duration = 1 - (numBands - 1) * stagger;
            const bandProg = gsap.utils.clamp(0, 1, (prog - start) / Math.max(0.01, duration));
            const angle = restTilt + bandProg * (maxAngle - restTilt);
            const opacity = 1 - bandProg * 0.85;

            band.style.transform = `rotateX(${-angle}deg)`;
            band.style.opacity = `${opacity}`;
          });
        };

        const trigger = ScrollTrigger.create({
          id: `fold-${sceneId}`,
          trigger: el,
          start: `top ${MOTION_TOKENS.fold.scrubStartViewportRatio * 100}%`,
          end: `top ${MOTION_TOKENS.fold.scrubEndViewportRatio * 100}%`,
          scrub: MOTION_TOKENS.fold.scrubSmoothing,
          onUpdate: (self) => {
            if (isDestroyed) return;

            // Completion Guarantee 3: Fast scrolling bypass (> 1 viewport / 100ms)
            const velocity = Math.abs(self.getVelocity() || 0);
            const fastThreshold = window.innerHeight * 10 * MOTION_TOKENS.fold.fastEntryThresholdViewportsPer100ms;
            if (velocity > fastThreshold) {
              completeImmediately();
              return;
            }

            // Normal scrub update
            progressProxy.value = self.progress;
            applyBandRotation(self.progress);

            // Settle on idle detection (140ms debounce)
            if (scrollTimeout) clearTimeout(scrollTimeout);
            if (settleTweenRef.current) {
              settleTweenRef.current.kill();
              settleTweenRef.current = null;
            }

            scrollTimeout = setTimeout(() => {
              if (
                !isDestroyed &&
                progressProxy.value > MOTION_TOKENS.fold.settleMinProgress &&
                progressProxy.value < MOTION_TOKENS.fold.settleMaxProgress
              ) {
                const target = progressProxy.value > 0.5 ? 1 : 0;
                settleTweenRef.current = gsap.to(progressProxy, {
                  value: target,
                  duration: MOTION_TOKENS.fold.settleDurationSec,
                  ease: MOTION_TOKENS.fold.settleEase,
                  onUpdate: () => {
                    applyBandRotation(progressProxy.value);
                  },
                  onComplete: () => {
                    if (target === 1) {
                      completeImmediately();
                    }
                  }
                });
              }
            }, MOTION_TOKENS.fold.idleDetectionMs);
          }
        });

        // Mark ready
        setIsReady(true);
        el.classList.add('js-fold-ready');

        // Check if initial scroll position is already past the fold trigger
        if (trigger.progress >= 0.99) {
          completeImmediately();
        } else {
          applyBandRotation(trigger.progress);
        }
      }, el);
    } catch (err) {
      console.warn(`[EverThread Motion] useSceneFold error on ${sceneId}, bypassing fold:`, err);
      el.setAttribute('data-fold-error', 'true');
      completeImmediately();
    }

    // Expose ScrollTrigger count for lifecycle leak testing
    if (typeof window !== 'undefined') {
      window.__scrollTriggerCount = ScrollTrigger.getAll().length;
    }

    return () => {
      isDestroyed = true;
      if (scrollTimeout) clearTimeout(scrollTimeout);
      if (settleTweenRef.current) {
        settleTweenRef.current.kill();
        settleTweenRef.current = null;
      }
      el.removeEventListener('focusin', handleFocusIn);
      window.removeEventListener('hashchange', handleHashChange);
      if (ctx) {
        ctx.revert();
      }
      if (typeof window !== 'undefined') {
        window.__scrollTriggerCount = ScrollTrigger.getAll().length;
      }
    };
  }, [containerRef, sceneId, disabled, prefersReduced]);

  return { isReady, isComplete };
}
