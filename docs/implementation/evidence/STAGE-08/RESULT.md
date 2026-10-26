# EverThread Stage 08 — Implementation & Verification Evidence Report

**Stage:** Stage 08 — Motion System, Fold Scenes and Thread Continuity
**Base Commit:** `fba8c8eb8ab328aac2a724c02fadd592efffed3f`
**Branch:** `stage-08-motion`
**Status:** PASS / READY FOR OWNER REVIEW
**Authoritative Specs:**
- `docs/implementation/03_MOTION_AND_TRAVERSAL_SPECIFICATION.md` (Revision 2)
- Section 9: Parameter Register (Owner Decision O-4 Approved)
- `docs/implementation/00_ROADMAP_AND_EXECUTIVE_SUMMARY.md`

---

## 1. Executive Summary

Stage 08 establishes EverThread's canonical motion system, architectural scene folds, 5-step exhibition opening choreography, and thread continuity. Strictly adhering to the non-negotiable architectural mandates:

1. **Native Scrolling Only:** Zero scroll hijacking, zero vertical snap points, zero sticky/pinned canvas locks. Content flows naturally and is immediately accessible.
2. **Canonical Motion Token Register (§9):** Approved under Owner Decision **O-4** as named constants centralized in `src/config/designTokens.ts`.
3. **Architectural Fold-Panels:** Encapsulated in `SceneFold.tsx` and `useSceneFold.ts`, featuring a 3-band desktop / 2-band mobile structure with a 0.5 scrub, 90° max hinge angle, 140ms idle settle, and instant completion guards (>1 viewport / 100ms velocity bypass and keyboard `focusin` bypass).
4. **Strict Boundary Adherence (Strictly 7 Folds):**
   - Home: **H1** (`#highlights`), **H2** (`#home-walls`), **H3** (`#home-making`)
   - Archive: **A1** (`#folios`), **A2** (`#weave-library`)
   - The House: **U1** (`#ateliers`), **U2** (`#appointments`)
   - *No folds on product cards, Collections walls, PDPs, Compass, Journal, Bag, or Checkout.*
5. **Thread Continuity (Strictly 5 Placements):**
   - 1. Home Hero entry trace (`#signatureThreadPath` / `[data-testid="signature-thread-path"]`)
   - 2. Home Hero → Index hand-off scrub (`#highlightsThreadPath` / `[data-testid="highlights-thread-path"]`)
   - 3. Wall stage crossing (`StrandThread variant="crossing"` at Scene H2)
   - 4. Archive strip → first discipline heading (`StrandThread variant="curve"` at Scene A2)
   - 5. Exhibition Modal Step 5 (`data-step="thread"` champagne filament in `TraditionExhibitionModal.tsx`)
   - *Zero thread presence on The House, PDPs, Compass, Bag, or Checkout. The House route explicitly has zero thread placements.*
6. **Exhibition Opening Choreography:** Interruptible 5-step sequence ($\le 1.2$s) implemented via `useExhibitionOpening.ts` in `TraditionExhibitionModal.tsx`. Pressing `Esc`, clicking Close, or navigating plates immediately finishes and displays the final composition.
7. **Technique Strip Glide vs Mobile Swipe:** Desktop-only horizontal scrub drift with cancel-on-interaction, retaining 100% native horizontal swipe (`overflow-x: auto`) and scroll-snap on mobile (< 1024px) with zero document-level overflow at 390px.
8. **Reduced Motion & Accessibility Parity:** Under `prefers-reduced-motion: reduce`, zero fold panels are rendered, 3D rotations are suppressed, threads settle instantly, and content is directly readable and interactive.

---

## 2. Canonical Parameter Register (§9 — Decision O-4)

Centralized in `src/config/designTokens.ts`:

| Parameter | Approved Value | Code Implementation | Status |
|---|---|---|---|
| Fold scrub range | Scene top 90% → 40% | `MOTION_TOKENS.fold.scrubStartViewportRatio = 0.9`, `scrubEndViewportRatio = 0.4` | VERIFIED |
| Scrub smoothing | 0.5 | `MOTION_TOKENS.fold.scrubSmoothing = 0.5` | VERIFIED |
| Bands (desktop / mobile) | 3 / 2 | `MOTION_TOKENS.fold.bandsDesktop = 3`, `bandsMobile = 2` | VERIFIED |
| Band stagger | 0.12 | `MOTION_TOKENS.fold.bandStagger = 0.12` | VERIFIED |
| Hinge travel (desktop / mobile) | 90° desktop / 45° mobile, 6° tilt | `maxHingeAngleDesktop = 90`, `maxHingeAngleMobile = 45`, `restTiltMobile = 6` | VERIFIED |
| Perspective | 1200 px | `MOTION_TOKENS.fold.containerPerspective = 1200` | VERIFIED |
| Idle detection | 140 ms or `scrollend` | `MOTION_TOKENS.fold.idleDetectionMs = 140` | VERIFIED |
| Settle-on-idle tween | 0.35 s `power2.out` (0.1–0.9 band) | `settleDurationSec = 0.35`, `settleEase = 'power2.out'` | VERIFIED |
| Fast-entry guard | > 1 viewport per 100 ms | `fastEntryThresholdViewportsPer100ms = 1.0` | VERIFIED |
| Exhibition opening | $\le 1.2$ s (steps: 0–0.2, 0.15–0.45, 0.3–0.7, 0.55–1.0, 0.9–1.2 s) | `MOTION_TOKENS.exhibition` 5-step schedule | VERIFIED |
| Thread draw / pulse | 0.6 s draw; 400 ms pulse | `MOTION_TOKENS.thread.drawDurationSec = 0.6`, `pulseDurationSec = 0.4` | VERIFIED |
| Hero timeline | 2.4 s | `MOTION_TOKENS.hero.timelineDurationSec = 2.4` | VERIFIED |
| Thread loader duration | 1900 ms min + 400 ms fade | `MOTION_TOKENS.hero.loaderMinDurationMs = 1900`, `loaderFadeDurationMs = 400` | PROTECTED |
| Wall panel width / peek | 88 vw desktop, 92 vw mobile, 12% peek | `MOTION_TOKENS.wall.panelWidthDesktopVw = 88`, `peekRatio = 0.12` | VERIFIED |
| Wall settle threshold | Intersection ratio $\ge 0.6$ | `MOTION_TOKENS.wall.settleThreshold = 0.6` | VERIFIED |
| Lens zoom clamp | max 3.5×; disabled below 1.3× | `MOTION_TOKENS.lens.maxZoom = 3.5`, `minZoom = 1.3` | VERIFIED |
| Product stage clamp | `min(80vh, 900px)` | `MOTION_TOKENS.productStage.maxHeight = 'min(80vh, 900px)'` | VERIFIED |
| Focus ring token | 2 px, 2 px offset, Deep Oxblood | `MOTION_TOKENS.focusRing` | VERIFIED |

---

## 3. Findings & Acceptance Criteria Traceability Matrix

| ID | Title / Requirement | Acceptance Criteria | Verified Result | Evidence / Test |
|---|---|---|---|---|
| **O-4** | Motion parameter register | Centralize in `src/config/designTokens.ts`; owner decision approval | Canonical register verified | Unit test `stage08-motion-system.test.tsx` |
| **F-01** | Story flow fold scenes | 7 canonical boundaries (H1–H3, A1–A2, U1–U2); content never covered | 7 fold wrappers active | `e2e/motion.spec.ts` (E2E-MOTION-01) |
| **F-02** | Native vertical scrolling | Zero pinning, zero scroll hijacking, zero vertical snapping | 100% native scrolling | `e2e/motion.spec.ts` (E2E-MOTION-01) |
| **F-04** | Exhibition 5-step opening | Total duration $\le 1.2$s; interruptible via Esc/close | 5 steps verified; Esc cleans | `e2e/motion.spec.ts` (E2E-MOTION-05) |
| **N-08** | Thread continuity | 5 authorized placements; absent from House, PDP, Bag, Checkout | 5 placements active | `e2e/motion.spec.ts` (E2E-MOTION-04) |
| **V3-01** | Story flow transitions | Natural vertical transitions between scenes | Scrub range 90%→40% | Unit & e2e verified |
| **V3-02** | Mobile fold parity | 2 bands, 45° travel, 6° tilt; zero 390px overflow | 0 layout overflow | `e2e/motion.spec.ts` (E2E-MOTION-06) |
| **V3-03** | Settle-on-idle guarantee | Content settles within 600ms on scroll stop | Idle 140ms + 350ms tween | `e2e/motion.spec.ts` (E2E-MOTION-01) |
| **V3-04** | Fast scroll & focus bypass | Fast entry (>1 vp/100ms) or keyboard tab bypasses fold | Content directly accessible | `e2e/motion.spec.ts` (E2E-MOTION-02) |
| **V3-05** | Thread continuity audit | Golden thread strictly at 5 locations | Verified absent elsewhere | `e2e/motion.spec.ts` (E2E-MOTION-04) |
| **V3-06** | Exhibition choreography | 5 animated steps within $\le 1.2$s | Interruptible & reversible | `e2e/motion.spec.ts` (E2E-MOTION-05) |
| **CL-446**| Reduced motion parity | Stage 08 fold foundation verified; signature review scheduled for Stage 10 | 0 panels rendered in DOM (OPEN for Stage 10) | `e2e/motion.spec.ts` (E2E-MOTION-03) |
| **CL-263**| No pinning / hijacking | Scrolling never hijacked | Verified native scrolling | `e2e/motion.spec.ts` |
| **CL-273**| Trigger cleanup | ScrollTrigger instances cleaned up on route change | Zero memory leaks | `e2e/motion.spec.ts` (E2E-MOTION-07) |

---

## 4. Verification Evidence & Test Summary

### 4.1 Unit Tests (Vitest)
```
Test Files  23 passed (23)
     Tests  344 passed (344)
  Duration  9.67s
```
All existing 22 test suites and the new `stage08-motion-system.test.tsx` (14 tests) passed with 100% success.

### 4.2 Playwright End-to-End Suite (`e2e/motion.spec.ts`)
```
Running 24 tests using 6 workers
  ok E2E-MOTION-01: Verifies the 7 approved fold boundaries across Home, Archive, and House [desktop, tablet, mobile]
  ok E2E-MOTION-02: Keyboard focusin and fast velocity completion guarantees [desktop, tablet, mobile]
  ok E2E-MOTION-03: Reduced motion parity across scenes and components [desktop, tablet, mobile]
  ok E2E-MOTION-04: Thread continuity at the 5 approved placements [desktop, tablet, mobile]
  ok E2E-MOTION-05: Exhibition opening 5-step choreography and interruptibility [desktop, tablet, mobile]
  ok E2E-MOTION-06: Desktop Technique Strip scrub glide vs 390px native horizontal swipe [desktop, tablet, mobile]
  ok E2E-MOTION-07: Lifecycle Trigger Cleanup and Memory Leak Prevention [desktop, tablet, mobile]
  ok E2E-MOTION-08: Intermediate-scrub panel rotation verification at 50% progress [desktop, tablet, mobile]
24 passed (1.4m)
```

### 4.3 Playwright Regression Suites
```
e2e/archive.spec.ts: 30 passed (38.0s)
e2e/home.spec.ts: 8 passed
```

### 4.4 Production Build Integrity
```
vite v6.4.4 building for production...
✓ 94 modules transformed.
dist/index.html                   2.93 kB
dist/assets/index-DTBHgFUw.css  302.60 kB
dist/assets/index-BfS5APGZ.js   791.43 kB
✓ built in 4.20s
```

---

## 5. Visual Evidence Assets

Captured responsive screenshots reside in `docs/implementation/evidence/STAGE-08/`:
1. `01_desktop_fold_h1_highlights.png`: Scene H1 highlights fold settled state.
2. `02_desktop_fold_h2_walls_crossing_thread.png`: Scene H2 walls fold with StrandThread crossing variant.
3. `03_desktop_fold_h3_making.png`: Scene H3 making/promise fold with narrative spine.
4. `04_desktop_archive_fold_a2_thread_curve.png`: Archive Scene A2 entry with StrandThread curve variant.
5. `05_desktop_exhibition_5step_opening.png`: Exhibition modal 5-step choreography settled composition.
6. `06_mobile_390px_fold_settled.png`: Mobile 390px viewport fold settled state (zero horizontal overflow).
7. `07_reduced_motion_settled_state.png`: Reduced motion settled presentation with zero fold panels.
