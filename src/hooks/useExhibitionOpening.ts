import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { MOTION_TOKENS } from '../config/designTokens.ts';
import { usePrefersReducedMotion } from './usePrefersReducedMotion.ts';

export interface UseExhibitionOpeningOptions {
  isOpen: boolean;
  modalRef: React.RefObject<HTMLElement | null>;
  activeRole?: string;
  onSettled?: () => void;
}

export function useExhibitionOpening({
  isOpen,
  modalRef,
  activeRole,
  onSettled
}: UseExhibitionOpeningOptions) {
  const prefersReduced = usePrefersReducedMotion();
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const interruptAndComplete = () => {
    if (timelineRef.current) {
      timelineRef.current.progress(1).kill();
      timelineRef.current = null;
      if (onSettled) onSettled();
    }
  };

  useEffect(() => {
    const modal = modalRef.current;
    if (!isOpen || !modal || typeof window === 'undefined') {
      if (timelineRef.current) {
        timelineRef.current.kill();
        timelineRef.current = null;
      }
      return;
    }

    const isTest = typeof process !== 'undefined' && process.env?.NODE_ENV === 'test';
    const forceMotionTest = Boolean(
      (window as unknown as { __EVERTHREAD_TEST_MOTION__?: boolean }).__EVERTHREAD_TEST_MOTION__ ||
      (typeof window.location?.search === 'string' && window.location.search.includes('test-motion=true'))
    );
    if (prefersReduced || (isTest && !forceMotionTest)) {
      // Immediate final state
      const allSteps = modal.querySelectorAll<HTMLElement>('[data-step]');
      allSteps.forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
        el.style.visibility = 'visible';
      });
      if (onSettled) onSettled();
      return;
    }

    // Kill any existing timeline
    if (timelineRef.current) {
      timelineRef.current.kill();
      timelineRef.current = null;
    }

    const cover = modal.querySelector<HTMLElement>('[data-step="cover"]');
    const surface = modal.querySelector<HTMLElement>('[data-step="surface"]');
    const mainImage = modal.querySelector<HTMLElement>('[data-step="main-image"]');
    const views = modal.querySelector<HTMLElement>('[data-step="views"]');
    const thread = modal.querySelector<HTMLElement>('[data-step="thread"]');
    const thumbCards = views ? views.querySelectorAll<HTMLElement>('.exhibition-thumb-card') : [];

    // Initialize elements to starting values
    if (cover) gsap.set(cover, { opacity: 0 });
    if (surface) gsap.set(surface, { opacity: 0, y: 16 });
    if (mainImage) gsap.set(mainImage, { opacity: 0, scale: MOTION_TOKENS.exhibition.step3MainImage.startScale });
    if (thumbCards.length > 0) gsap.set(thumbCards, { opacity: 0, x: 12 });
    if (thread) gsap.set(thread, { opacity: 0 });

    const tl = gsap.timeline({
      paused: false,
      onComplete: () => {
        timelineRef.current = null;
        if (onSettled) onSettled();
      }
    });

    timelineRef.current = tl;

    // Step 1: Cover anchors 0–0.2s
    if (cover) {
      tl.to(cover, { opacity: 1, duration: MOTION_TOKENS.exhibition.step1Cover.end, ease: 'power2.out' }, 0);
    }

    // Step 2: Surface settles 0.15–0.45s
    if (surface) {
      tl.to(surface, {
        opacity: 1,
        y: 0,
        duration: MOTION_TOKENS.exhibition.step2Surface.end - MOTION_TOKENS.exhibition.step2Surface.start,
        ease: 'power2.out'
      }, MOTION_TOKENS.exhibition.step2Surface.start);
    }

    // Step 3: Main image reveals 0.3–0.7s (opacity + scale 1.02 -> 1)
    if (mainImage) {
      tl.to(mainImage, {
        opacity: 1,
        scale: MOTION_TOKENS.exhibition.step3MainImage.endScale,
        duration: MOTION_TOKENS.exhibition.step3MainImage.end - MOTION_TOKENS.exhibition.step3MainImage.start,
        ease: 'power2.out'
      }, MOTION_TOKENS.exhibition.step3MainImage.start);
    }

    // Step 4: Five supporting views fan/stack and settle 0.55–1.0s (stagger 0.06)
    if (thumbCards.length > 0) {
      tl.to(thumbCards, {
        opacity: 1,
        x: 0,
        duration: 0.35,
        stagger: MOTION_TOKENS.exhibition.step4Views.stagger,
        ease: 'power2.out'
      }, MOTION_TOKENS.exhibition.step4Views.start);
    }

    // Step 5: Champagne thread draws briefly 0.9–1.2s
    if (thread) {
      tl.to(thread, {
        opacity: 1,
        duration: MOTION_TOKENS.exhibition.step5Thread.end - MOTION_TOKENS.exhibition.step5Thread.start,
        ease: 'power2.out'
      }, MOTION_TOKENS.exhibition.step5Thread.start);
    }

    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
        timelineRef.current = null;
      }
    };
  }, [isOpen, modalRef, prefersReduced]);

  // If user changes activeRole (next/prev plate) during opening, skip to final state immediately
  useEffect(() => {
    if (timelineRef.current && timelineRef.current.isActive()) {
      interruptAndComplete();
    }
  }, [activeRole]);

  return { interruptAndComplete };
}
