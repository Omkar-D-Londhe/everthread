# STAGE-08 — Motion System, Fold Scenes and Thread Continuity

## 1. Purpose and rationale
Implement the approved Story Flow (scrubbed fold scenes at seven boundaries, Initiate → Glide → Settle), the exhibition's five-step opening, scroll-driven strip drift, and thread continuity in exactly the five approved places. Commerce stays static. All specifics are in `03_MOTION_AND_TRAVERSAL_SPECIFICATION.md`; this file orders the work.

## 2. Prerequisites
STAGES 5, 6 and 7 PASS (scene markers `data-scene` and `data-step` exist). Blocker B-1 status recorded: if the owner has now supplied the Phase 6.0 storyboard, reconcile `03_…` against it **before** starting and stop on any conflict.

## 3. Scope and exclusions
In: `useSceneFold` hook, fold panels, settle-on-idle, reduced-motion handling, hero refinement (only if needed), exhibition opening timeline, strip drift, thread components, cleanup, motion tests and recordings. Out: pinning, snap, scroll hijacking, new animation library, motion on cards, product pages, Compass, Bag, checkout, loader timing, wall pan changes.

## 4. IDs
F-01, F-02, F-04, F-34, F-43; N-08; O-1, O-4; V3-01…V3-06; CL-263…273, 277…381.

## 5. Current-state evidence
`useEditorialScroll.ts` implements ordinary reveals (≈24 px rise, 0.65 s, `once`) with `gsap.context()` and `ctx.revert()`. `animations.css` ≈L40–54 holds unused `.fabric-fold-container`, `.fabric-panel`, `.folded-up`. Measured: 0 elements with 3D transforms, clip-path or perspective while scrolling Home, Archive, House at 1440/1024/390. Home hero timeline ≈2.4 s plus a scrub hand-off exist. Exhibition has only `exhibitionFadeIn`/`plinthEntrance`. No pinning or snapping libraries are installed.

## 6. Files affected
**new** `src/hooks/useSceneFold.ts`, `src/components/motion/SceneFold.tsx`, `src/components/motion/StrandThread.tsx`, `src/hooks/useExhibitionOpening.ts`; `src/pages/HomePage.tsx`, `ArchivePage.tsx`, `HousePage.tsx` (wrap scenes only), `src/components/TraditionExhibitionModal.tsx` (timeline), `src/components/archive/TechniqueStrip.tsx` (drift), `src/styles/animations.css`, tests `motion-homepage` (update), new `e2e/motion.spec.ts`.

## 7. Ordered implementation instructions
1. Branch per §15. Gate baseline. Record a "before" screen recording of Home, Archive, House at 1440 and 390.
2. **Tokens.** Put every numeric value from `03_…` §9 in `src/config/designTokens.ts` as a named constant; do not scatter literals. List the final values in `RESULT.md` for owner confirmation.
3. **CSS foundation.** Decide whether to reuse or replace `.fabric-*`. Panels hidden by default; visible only under `.js-fold-ready`. Container `perspective: 1200px`; bands `transform-origin: top center; backface-visibility: hidden; will-change: transform` only while animating.
4. **`useSceneFold(sceneRef, {bands, maxAngle})`** per `03_…` §2: create bands, `ScrollTrigger` start `top 90%` end `top 40%`, `scrub: 0.5`, **no `pin`, no `snap`**, progress proxy; `onUpdate` sets band rotation (stagger 0.12); on completion set `display:none`; clean up in `gsap.context`.
5. **Settle-on-idle.** On idle (140 ms or `scrollend`) with progress in (0.1, 0.9) tween the proxy to the nearest end over 0.35 s; a new scroll kills the tween. Never call `scrollTo`.
6. **Completion guarantees.** Complete immediately on `focusin` inside the scene, hash/anchor/find-in-page entry into the scene, fast entry (> one viewport per 100 ms), `visibilitychange` to hidden, resize that invalidates measurements, or any GSAP error (wrap init in `try/catch` and add a `data-fold-error` attribute).
7. **Apply to the seven boundaries only:** H1, H2, H3 (Home), A1, A2 (Archive), U1, U2 (House). Wrap using the existing `data-scene` markers. Mobile: 2 bands, reduced angle; tablet follows desktop.
8. **Reduced motion.** `usePrefersReducedMotion` true ⇒ never add `js-fold-ready`, no hero timeline motion, no strip drift, opening shows final state.
9. **Hero.** Inspect the current hero timeline (≈L212–230). Keep total ≈2.4 s starting after the loader. Only if the derived sequence in `03_…` §4 is missing (thread trace → headline mask → plinth lift → metadata/CTA settle) adjust ordering; do not alter the loader or its timing.
10. **Thread (`StrandThread`).** Reusable SVG path component with `draw(progress)` and `pulse()`; used at: hero entry (existing), hero→index hand-off (existing), wall stage (already in Stage 5: align styling), Archive strip → first discipline heading (draw ≈0.6 s on enter), exhibition step 5. Nowhere else. `aria-hidden`, `pointer-events:none`.
11. **Exhibition opening (`useExhibitionOpening`).** Build one `gsap.timeline` using the five `data-step` elements and the timings in `03_…` §4 (total ≤1.2 s). `Esc`, close, next plate, route change or unmount call `timeline.progress(1).kill()` and show the final state; start only after the modal is mounted and focus has moved to Close. Reduced motion: no timeline.
12. **Strip drift.** `TechniqueStrip`: on desktop with motion allowed, bind `translateX` to the section's scroll progress (scrub) with total shift = strip width − viewport; on mobile or reduced motion keep the native strip. Items remain focusable and focus scrolls them into view (cancel drift while focused).
13. **Cleanup/instrumentation.** All triggers inside `gsap.context`; revert on unmount/route change; `ScrollTrigger.refresh()` after image load and after a 150 ms debounced resize. In test builds expose `window.__scrollTriggerCount`.
14. Add tests and **recordings** (§10, §13). Gate. Commit.

## 8. Expected behaviour
Scrolling into each of the seven scenes folds panels away smoothly, finishing on its own if the visitor stops; the exhibition opens in five visible steps and can be skipped instantly; the strip drifts gently with scroll; reduced-motion users see everything immediately; commerce pages are untouched.

## 9. Data integrity, accessibility, failure
Content is in the DOM and focusable from the start; panels are `aria-hidden` and non-interactive; keyboard focus completes the fold; GSAP failure leaves content visible; no layout shift (verify CLS-like movement of headings is 0 px after settle).

## 10. Tests
`E2E-MOTION-01…04`; `E2E-ARCH-04` (reduced-motion strip); `E2E-ARCH-02` (open/close during opening); `E2E-RESP-01` on the three routes; `E2E-A11Y-02` for keyboard through scenes; update `motion-homepage.test.tsx` (assert hook behaviour with mocked ScrollTrigger; do not claim visual proof).

## 11. Manual checks
`MAN-REC`: record each of H1–U2 at normal scroll speed, stopping mid-fold, scrolling backward, scrolling fast, with reduced motion on, on desktop and mobile; record opening and Esc mid-opening; owner reviews.

## 12. Acceptance criteria
- Panels exist only at the seven boundaries and each reaches a removed/identity state.
- Stopping mid-fold completes within 600 ms and the scene is readable and clickable.
- No pin, no vertical snap, scroll position never altered by animation.
- `focusin` inside a covered scene reveals it immediately.
- Trigger count returns to baseline after 5 navigations away and back.
- Reduced motion: 0 panels, 0 3D transforms.
- Exhibition opening ≤1.2 s, interruptible, five steps visible in the recording.
- Loader duration unchanged (E2E-LOAD-01 passes).

## 13. Evidence
Before/after recordings (desktop, mobile, reduced motion), Playwright traces, `RESULT.md` with measured fold completion times.

## 14. Risks and mitigation
Fold overlays hide content briefly: guarantees in step 5 plus idle completion. Mobile performance: 2 bands, no `will-change` at rest, test on a throttled CPU profile (4×). ScrollTrigger refresh after font/image load: re-test boundaries after hard reload.

## 15. Git
Create branch `stage-08-motion` from the **current head of `integration/everthread-v1`**; confirm `git status` is clean first. Commit in small logical groups with message `stage-08: <summary>`; review `git diff` before each commit and exclude unrelated files. **Do not commit to or push `main`** (a push deploys); no force-push, reset or history rewrite without owner approval. After owner approval: merge the stage branch into `integration/everthread-v1` with `--no-ff` and tag `stage-08-approved`. Record `git status`, `git log --oneline -n 10` and `git diff --stat` in `RESULT.md`.

## 16. Stop conditions
Stop and report if any fold cannot guarantee visible content, if a library other than GSAP seems required, or if the owner's storyboard (if supplied) contradicts the derived sequence.

## 17. Exit gate
PASS when §12 holds and the owner approves the recordings. Without owner review of recordings the verdict is at most PARTIAL.

## 18. Reconciliation addendum (Revision 2)
**18.1 Asset dependencies (manifest IDs, status from `02a_ASSET_REGISTRY.csv`).** None new. Uses existing hero, exhibition and strip elements.

**18.2 Data-model and route implications.** `designTokens.ts`; no data change.

**18.3 Desktop / tablet / mobile behaviour.** Desktop: 3 bands, full angle; tablet as desktop; mobile: 2 bands, reduced tilt. Strip drift desktop only; native strip on mobile.

**18.4 Component state matrix (initial, hover, focus, active, selected, completed, loading, empty, error as applicable).** Fold panel: hidden (no JS), ready, scrubbing, settling, complete (removed), error (`data-fold-error`). Opening timeline: idle, running, skipped, complete. Strip: static, drifting, focused (drift paused). Thread: undrawn, drawing, drawn, pulsing.

**18.5 Interaction and motion contract.** Full contract in `03_…` §2–§4 (all values derived, in tokens). Interruption/reversal re-enters scrub; focus or hash entry completes instantly. Reduced motion: none of the panels, hero, drift, opening or thread animation; content visible immediately. Pointer, touch and keyboard parity is mandatory for every interactive control; all numeric values not established by an approved source are marked `OWNER_APPROVAL_REQUIRED` in `03_…` §9.

**18.6 Regression checks for previously working features.** Ordinary reveals, hero scrub, wall pan, loader timing, scroll position never altered, keyboard navigation, back/forward.

**18.7 Source files.** Known (verified): `src/hooks/useEditorialScroll.ts`, `src/pages/HomePage.tsx`, `src/styles/animations.css` (≈L40–54 unused fold classes). To verify: whether `HousePage.tsx` uses the hook and the scene wrapper boundaries. Antigravity must report the actual paths found before editing; unknown locations are not to be invented.

**18.8 Outstanding blockers and owner decisions.** O-1 and O-4 (BLOCKED — block the start), B-1, parameter register approval.

**18.9 Stop condition.** Stop if any fold cannot guarantee visible content, if a second animation library seems necessary, or if the owner's storyboard contradicts the derived sequence.

**18.10 End-of-stage report.** Present the 8 items in roadmap §5 item 5 and request explicit owner approval. Do not start the next stage.

**18.11 Evidence-integrity table (fill with actual results only).**
| Check | Planned | Executed | Passed | Failed | Not run | Unverifiable |
|---|---|---|---|---|---|---|
| (one row per check listed in §10–§11, filled with actual results only) | | | | | | |

**18.12 Exit-criteria matrix (copy of §12, to be completed).**
| # | Exit criterion | Result (PASS/FAIL/BLOCKED) | Evidence file |
|---|---|---|---|
| 1 | Panels exist only at the seven boundaries and each reaches a removed/identity state. | _to be filled by Antigravity_ | _path_ |
| 2 | Stopping mid-fold completes within 600 ms and the scene is readable and clickable. | _to be filled by Antigravity_ | _path_ |
| 3 | No pin, no vertical snap, scroll position never altered by animation. | _to be filled by Antigravity_ | _path_ |
| 4 | `focusin` inside a covered scene reveals it immediately. | _to be filled by Antigravity_ | _path_ |
| 5 | Trigger count returns to baseline after 5 navigations away and back. | _to be filled by Antigravity_ | _path_ |
| 6 | Reduced motion: 0 panels, 0 3D transforms. | _to be filled by Antigravity_ | _path_ |
| 7 | Exhibition opening ≤1.2 s, interruptible, five steps visible in the recording. | _to be filled by Antigravity_ | _path_ |
| 8 | Loader duration unchanged (E2E-LOAD-01 passes). | _to be filled by Antigravity_ | _path_ |
