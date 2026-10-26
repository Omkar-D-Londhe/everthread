# STAGE-05 Implementation Plan: Collection Walls, Stage, Routes, and The Living Inheritance Composition

- **Date:** 2026-10-26
- **Working Branch:** `stage-05-collection-walls`
- **Base Integration Commit:** `9d33e80` (tagged `stage-04-approved` on `integration/everthread-v1`)
- **Author:** EverThread Implementation Engineer
- **Operating Specification:** Master Operating Prompt §18 & `docs/implementation/STAGE-05-COLLECTION-WALLS.md`

---

## 1. Objectives & Scope

1. **Routes & Layout Architecture:**
   - Implement nested routing in `App.tsx`:
     ```tsx
     <Route path="/collections" element={<CollectionWallsLayout />}>
       <Route index element={<ContemporaryWall />} />
       <Route path="the-living-inheritance" element={<LivingInheritanceWall />} />
     </Route>
     ```
   - Preserve existing `CollectionsPage.tsx` content, layout, and test IDs under `ContemporaryWall.tsx`.
   - Update document title per wall: `"Contemporary Collection · EverThread"` vs `"The Living Inheritance · EverThread"`.
   - Ensure header NavLink `/collections` remains active for both sub-routes (`end={false}`).

2. **Spike Verification Gate (O-13):**
   - Implement `WallStage` with plain panels, route sync, native horizontal scroll, and keyboard tabs.
   - Run spike Playwright tests `E2E-WALL-02` (horizontal swipe/scroll switches route), `E2E-WALL-03` (no vertical wheel hijacking), and `E2E-WALL-05` (keyboard tabs & arrow navigation) prior to visual styling.
   - Strictly prohibit wheel event capture / scroll hijacking.

3. **WallStage Component & Visual Thread:**
   - Horizontal snap track (`scroll-snap-type: x mandatory`, `overscroll-behavior-x: contain`, `scrollbar-width: none`).
   - Two panels: `flex: 0 0 88vw` on desktop/tablet (≈12% peek of adjacent panel), `flex: 0 0 92vw` on mobile.
   - Accessible tablist (`role="tablist"`, `aria-selected`, `aria-controls="wall-products"`).
   - Route ↔ scroll synchronization with `scrollend` / 140ms debounce and programmatic scroll suppression.
   - `WallThread`: SVG gold thread across panel boundaries, stroke offset mapped to scroll position, 400ms settle pulse, static when `prefers-reduced-motion`.
   - Safe stage art: ET-01 primary crop / typographic styling for Contemporary panel (`AST-HOME-PLATE` is `NOT_YET_SUPPLIED`); typographic styling / editorial crop for The Living Inheritance (`AST-HOME-HERO` is `OWNER_APPROVAL_REQUIRED`). Zero use of `AST-HOME-CAMP` or rejected panorama.
   - Nudge: Single 6% scroll nudge behind `const WALL_NUDGE_ENABLED = false` (owner approval pending).

4. **The Living Inheritance Wall Composition (`wallMoments.ts`):**
   - Three curated moments:
     1. `mantle-drape`: `tr-01` (7/12 cols), `tr-02` (5/12 cols) — layout `feature-offset`.
     2. `geometry`: `tr-03`, `tr-04` — layout `staggered-pair`.
     3. `veil-print`: `tr-05`, `tr-06`, `tr-07` — layout `triptych-lead-last`.
   - Catalogue Safety Gate: Displays listed products ONLY. Because TR-01..TR-07 are unlisted (`isListed: false`), moments without listed products are omitted, displaying an elegant archival curatorial preparation notice.
   - Shared toolbar: Sort (Featured, Price asc/desc) and filters (Category, Colour, Price — no craft or fibre facets on TR wall). When active, switches to flat grid.

5. **Acceptance & Verification:**
   - Vitest unit tests: Update `collections.test.tsx` and author `walls.test.tsx`.
   - Playwright E2E tests: `e2e/stage05.spec.ts` covering `E2E-WALL-01` through `E2E-WALL-06`, `E2E-ROUTE-02`, `E2E-ROUTE-03`, `E2E-RESP-01`, and `E2E-A11Y-02`.
   - Full regression suite execution (Stage 04, Stage 03, Stage 02, Baseline).
   - Tracker reconciliation and outcome report authoring in `docs/implementation/evidence/STAGE-05/RESULT.md`.
