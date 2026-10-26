# 03 — Motion and Traversal Specification — Revision 2

**Provenance of this document.** *Approved:* Initiate → Glide → Settle; Story Flow = architectural panels fold/roll to reveal a scene, strongest on Home, Archive, The House, commerce conventional (Brief §7); scrubbed fold with native scroll, no pinning or snapping (owner); five-step exhibition opening (Exhibition Spec); loader ≈2.3 s unchanged. *Derived by me (not from the missing Phase 6.0 storyboard, blocker B-1):* all timings, thresholds, boundary list and the panel mechanics below. If the owner later supplies the original storyboard, reconcile before Stage 8.

## 1. Vocabulary
- **Glide:** continuous, scroll-following movement; content reveals and settles without taking control of scrolling.
- **Transition:** deliberate change between two scenes (fold panels, wall pan, exhibition opening).
- **Static:** no special motion (commerce flow).
- **Thread:** the golden SVG motif. Used only where it connects something (Section 5). Never a switch control.

## 2. Fold-panel mechanism (Transition between scenes)
1. Each fold boundary wraps the *next scene* in `.scene-fold` containing a decorative overlay `.scene-fold__panels` (`aria-hidden="true"`, `pointer-events:none`) with 3 horizontal bands (mobile: 2). Reuse and adapt the existing, currently unused `.fabric-fold-container` / `.fabric-panel` / `.folded-up` CSS in `animations.css` if it fits; otherwise replace it. Content stays in normal document flow underneath (no layout shift).
2. Bands are hinged at their top edge (`transform-origin: top center`, container `perspective: 1200px`). Progress 0→1 maps to `rotateX(0 → -90°)` with a 0.12 stagger. Desktop max hinge angle 90° in total travel; mobile uses a gentler fold (travel capped to about 45° visual, 6° tilt at rest) and 2 bands.
3. **Scrub range:** start when the scene's top edge reaches 90% of the viewport height, end when it reaches 40%. ScrollTrigger `scrub: 0.5`, **no `pin`, no vertical `snap`, no scroll-position changes.** (The wall-stage track and mobile strip use *horizontal* native `scroll-snap`; that is a separate, approved behaviour and is not scripted.)
4. **Settle-on-idle:** when scrolling is idle for 140 ms (or `scrollend` fires) and progress is between 0.1 and 0.9, run a time-based `gsap.to(progressProxy, {value: nearest end, duration: 0.35, ease: 'power2.out'})`. It animates the panels only; it never calls `scrollTo`. A new scroll event kills the tween and returns to scrub.
5. **Completion guarantees (content must never stay covered):** if focus enters the scene (`focusin`), if the hash or a find-in-page jump lands inside it, if the scene is entered with scroll velocity above one viewport per 100 ms, or if GSAP fails to initialise → set progress 1 immediately and remove the panels. The CSS hides panels by default; they are enabled only after GSAP adds the `js-fold-ready` class.
6. At progress 1 remove panels from layout (`display:none`) and clear transforms (`clearProps`).
7. **Reduced motion** (`prefers-reduced-motion: reduce`): never add `js-fold-ready`; scene is simply visible.
8. Cleanup: create all triggers inside `gsap.context()`; `ctx.revert()` on unmount and on route change; `ScrollTrigger.refresh()` after images load and after resize debounce 150 ms. In test builds expose `window.__scrollTriggerCount` for E2E-MOTION-04.

## 3. Fold boundaries (7 — the only folds)
| ID | Route | From → to | Notes |
|---|---|---|---|
| H1 | `/` | Hero → chapter index | Existing hero→highlights scrub hand-off is kept; fold added to the index |
| H2 | `/` | Archive/craft scene → two-wall preview | Thread crosses into the preview |
| H3 | `/` | Two-wall preview → Making/Promise | — |
| A1 | `/archive` | Intro → Foundational Studies | — |
| A2 | `/archive` | Studies → Weave Library (discipline groups) | — |
| U1 | `/the-house` | Chapter 1 → Chapter 2 | — |
| U2 | `/the-house` | Chapter 2 → Chapter 3 | Max two on this route |
No folds on cards, Collections, product pages, Compass, Journal, Bag or checkout.

## 4. Other motion
- **Home hero (Glide, timed):** keep the existing timeline (≈2.4 s, Home source around lines 212–230; verify). Derived sequence: thread enters and traces the wordmark and headline baseline (≈1.1 s), headline mask-reveal overlaps (≈0.9 s), textile plinth lights/lifts (≈0.7 s), metadata and CTAs settle (≈0.5 s). Starts after the loader (unchanged 1900 ms minimum + 400 ms fade).
- **Ordinary reveals:** keep `useEditorialScroll` (24 px rise, `once`). Never delay essential content.
- **Wall pan (Transition, native):** horizontal scroll-snap; thread is an SVG overlay inside the scrolling track drawn by `scrollLeft` progress and pulsing once (400 ms) on settle; below the stage the product area swaps with a 24 px / 250 ms settle. No fold.
- **Exhibition opening (Transition, ≤1.2 s, interruptible):** (1) cover anchors 0–0.2 s; (2) surface settles 0.15–0.45 s; (3) main image reveals 0.3–0.7 s (opacity + scale 1.02→1); (4) five supporting views fan/stack and settle 0.55–1.0 s (stagger 0.06); (5) champagne thread draws briefly 0.9–1.2 s. Esc, close, next plate or navigation kills the timeline and shows the final state. Reduced motion: final state immediately.
- **Technique strip (Glide):** `translateX` bound to section progress (scrub), total shift = strip width − viewport; no autoplay, no timers. Mobile and reduced motion: native swipeable strip (`overflow-x:auto`, scroll-snap), no transform.
- **Gallery:** 280 ms cross-dissolve (existing). **Compass:** existing slide keyframes. **Lens:** none beyond pointer tracking.
- **Static:** Bag, checkout, product selection, filters.

## 5. Thread placements (the only five)
1. Hero entry/trace. 2. Hero→index hand-off (existing scrub). 3. Wall stage crossing. 4. Archive strip → first discipline heading (draw ≈0.6 s on enter). 5. Exhibition step 5. Not on House, product pages, Compass, Bag or checkout.

## 6. Route-by-route matrix
| Route / scene | Trigger | Type | Thread | Settled state | Reduced motion | Mobile | Accessibility | Reuse · complexity |
|---|---|---|---|---|---|---|---|---|
| Home hero | Page entry | Glide (timed) | Trace | CTAs readable, metadata settled | Final state | Same, shorter distances | Content in DOM from start | Existing · low |
| H1–H3 | Scroll | Fold | H1 existing; H2 crossing | Panel removed, heading in upper third | No panels | 2 bands, small angle | `aria-hidden` panels; focus completes fold | New hook · medium |
| Wall stage | Swipe / scroll / label / arrows | Pan transition | Crosses, pulses | Panel snapped, route updated | Instant jump, no nudge | Swipe | Tablist, arrows, labels | New · medium-high |
| Collections list | Scroll / hover | Glide | None | Cards visible | Static | Same | — | Existing · low |
| Archive A1/A2 | Scroll | Fold | Strip hand-off | Settled sections | No panels | 2 bands | As above | New hook · medium |
| Technique strip | Scroll | Glide (drift) | None | Static strip | Native strip | Native swipe | Items are links; focus scrolls into view | New · low-medium |
| Exhibition | Open folio | Transition | Step 5 | Final composition | Instant | Same, shorter | Esc kills; focus on Close | Existing modal · medium |
| House U1/U2 | Scroll | Fold | None | Chapters settled | No panels | 2 bands | As above | Hook · low |
| PDP | Select image | Cross-dissolve | None | Image shown | None | Same | Alt per image | Existing |
| Bag / checkout / Journal / Compass | — | Static or existing | None | — | — | — | — | — |

## 7. Traversal and information architecture
- **Navigation weighting:** primary links **Collections**, **Cultural Archive**, **Thread Compass**; secondary (lighter) **The House**, **Journal**; utilities Search, Saved, Bag. No new primary link for the second collection.
- **Home order:** Hero → chapter index I–III (Compass, Archive, Capsule) → one Compass teaser → Archive/craft scene (Living Loom + three static diagram thumbnails) → two-wall preview → Making/Promise (condensed) → Journal teaser and footer. No product grid, no duplicate Compass.
- **Journeys:** Home → Collections (wall stage) → product → Bag → checkout (simulated). Product (TR) → "inspired by" tradition folio. Archive → discipline → folio → approved related piece. Technique strip → diagram viewer → folio. Compass → contemporary matches → product.
- **Archive overview:** discipline-led asymmetric groups (one feature card plus smaller cards per discipline), then the technique strip; exhibition modal preserved.

## 8. Mandatory constraints
Native scrolling only; no pinning, no vertical snapping, no scroll hijacking; every transition interruptible and reversible; content never hidden after interruption; reduced-motion parity; keyboard parity; no thread on control surfaces. Evidence: E2E-MOTION-01…04 and recordings (MAN-REC).

## 9. Parameter register (all numeric values in this document are DERIVED)
No source document establishes these values (the Phase 6.0 storyboard is unavailable, B-1). They are **proposals**, status `OWNER_APPROVAL_REQUIRED`. Antigravity must implement each as a named constant in one file (`src/config/designTokens.ts`) and list the final values in `RESULT.md`; the owner may change any of them before a stage passes.
| Parameter | Proposed value | Used in |
|---|---|---|
| Fold scrub range | scene top 90% → 40% of viewport | Stage 8 |
| Scrub smoothing | 0.5 | Stage 8 |
| Bands (desktop / mobile) | 3 / 2 | Stage 8 |
| Band stagger | 0.12 | Stage 8 |
| Hinge travel | up to 90° desktop; mobile visual travel about 45°, tilt 6° | Stage 8 |
| Container perspective | 1200 px | Stage 8 |
| Idle detection | 140 ms or `scrollend` | Stages 5, 8 |
| Settle-on-idle band and tween | progress between 0.1 and 0.9; 0.35 s `power2.out` | Stage 8 |
| Fast-entry guard | > one viewport per 100 ms | Stage 8 |
| Exhibition opening | total ≤ 1.2 s; steps at 0–0.2, 0.15–0.45, 0.3–0.7, 0.55–1.0 (stagger 0.06), 0.9–1.2 s | Stage 8 |
| Thread draw / pulse | 0.6 s draw; 400 ms pulse | Stages 5, 8 |
| Hero timeline | existing ≈2.4 s (verify in source; not changed unless required) | Stage 8 |
| Ordinary reveal | existing 24 px rise, 0.65 s | existing |
| Wall panel width / peek | 88 vw desktop, 92 vw mobile; next panel peeks about 12% | Stage 5 |
| Wall settle threshold | intersection ratio ≥ 0.6 | Stage 5 |
| Wall nudge | 6% once per session, disabled by default | Stage 5 |
| Product-area settle | 24 px over 250 ms | Stage 5 |
| Lens zoom | max 3.5×; disabled below 1.3× | Stage 3 |
| Product stage clamp | `min(80vh, 900px)` | Stage 3 |
| Hover-preview breakpoint | ≥ 1024 px with fine pointer | Stage 3 |
| Focus ring | 2 px, 2 px offset, Deep Oxblood | Stage 10 |
| Loader | **not a parameter**: protected, unchanged (≈1900 ms minimum + 400 ms fade) | — |
Easing, colours and fonts follow the established brand foundations; any other easing curve is `OWNER_APPROVAL_REQUIRED`.
