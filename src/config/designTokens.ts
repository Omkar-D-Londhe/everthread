/**
 * EverThread Authoritative Design & Motion Tokens
 * Master Operating Contract: 03_MOTION_AND_TRAVERSAL_SPECIFICATION.md (Revision 2) §9
 * Owner Decision: O-4 Approved Canonical Parameters
 */

export const MOTION_TOKENS = {
  // Fold-Panel Transition Parameters (Section 2 & 9)
  fold: {
    scrubStartViewportRatio: 0.9, // 90% of viewport height
    scrubEndViewportRatio: 0.4, // 40% of viewport height
    scrubSmoothing: 0.5,
    bandsDesktop: 3,
    bandsMobile: 2,
    bandStagger: 0.12,
    maxHingeAngleDesktop: 90, // degrees
    maxHingeAngleMobile: 45, // visual travel degrees
    restTiltMobile: 6, // degrees
    containerPerspective: 1200, // px
    idleDetectionMs: 140, // ms
    settleMinProgress: 0.1,
    settleMaxProgress: 0.9,
    settleDurationSec: 0.35,
    settleEase: 'power2.out',
    fastEntryThresholdViewportsPer100ms: 1.0,
  },

  // Exhibition Opening Choreography (Section 4 & 9)
  exhibition: {
    totalDurationMax: 1.2, // seconds
    step1Cover: { start: 0, end: 0.2 },
    step2Surface: { start: 0.15, end: 0.45 },
    step3MainImage: { start: 0.3, end: 0.7, startScale: 1.02, endScale: 1.0 },
    step4Views: { start: 0.55, end: 1.0, stagger: 0.06 },
    step5Thread: { start: 0.9, end: 1.2 },
  },

  // Thread Motif (Section 4 & 9)
  thread: {
    drawDurationSec: 0.6,
    pulseDurationSec: 0.4,
    color: '#B49A70', // Champagne Gold thread
  },

  // Hero & Ordinary Reveals (Section 4 & 9)
  hero: {
    timelineDurationSec: 2.4,
    loaderMinDurationMs: 1900,
    loaderFadeDurationMs: 400,
  },

  ordinaryReveal: {
    riseDistancePx: 24,
    durationSec: 0.65,
    ease: 'power2.out',
  },

  // Wall Stage (Section 9)
  wall: {
    panelWidthDesktopVw: 88,
    panelWidthMobileVw: 92,
    peekRatio: 0.12,
    settleThreshold: 0.6,
    nudgeRatio: 0.06,
    productAreaSettlePx: 24,
    productAreaSettleDurationSec: 0.25,
  },

  // Atelier Lens (Section 9)
  lens: {
    maxZoom: 3.5,
    minZoom: 1.3,
    clampStyle: 'min(80vh, 900px)',
  },

  // Accessibility & Focus (Section 9)
  focus: {
    ringWidthPx: 2,
    ringOffsetPx: 2,
    ringColor: '#300f19', // Deep Oxblood
  }
} as const;

export type MotionTokens = typeof MOTION_TOKENS;
