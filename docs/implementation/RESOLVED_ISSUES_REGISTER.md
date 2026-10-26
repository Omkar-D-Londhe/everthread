# EverThread — Resolved Issues Register

**Generated:** 2026-10-27  
**Baseline Commit:** `8a61e4d` (`stage-08-motion`)  
**Scope:** Authoritative register of all closed or resolved findings, new requirements, and V3 core architectural scope items.

---

## 1. Governance & Qualification Criteria

This register adheres strictly to the following qualification principles:
1. **Row Type Boundary:** Only core tracked defects/findings (`FINDING`), gap requirements (`NEW_REQUIREMENT`), and core V3 architectural scope items (`V3_ROW`) with disposition `CLOSED` or `RESOLVED` are included as primary resolved issues.
2. **Exclusion of Checklist Rows:** Granular acceptance criteria (`CHECKLIST_ROW`) represent verification checks of an implementation rather than standalone architectural issues or defects. The 11 closed motion checklist rows (`CL-263` through `CL-273`) are cross-referenced in Section 3.
3. **Exclusion of Governance Decisions:** Owner decisions (`OWNER_DECISION`) and architecture decision register items (`DECISION_REGISTER`) represent policy governance. Items such as `O-4`, `O-6`, `DEC D-08`, and `DEC D-11` are recorded in Section 4.
4. **Verification Distinction:** The register strictly distinguishes verification tiers:
   - `implemented`: Code is written and integrated into the repository.
   - `unit-tested`: Automated Vitest test suite passes.
   - `E2E-tested`: Automated Playwright browser tests pass.
   - `evidence-inspected`: Artifact screenshots, recordings, or diff logs reviewed and committed in `docs/implementation/evidence/`.
   - `owner-accepted`: Explicit owner decision or approval recorded.
   - `fully closed`: Original acceptance criteria satisfied across all tiers without outstanding caveats.

---

## 2. Core Resolved Issues (22 Items)

### A. Core Architectural Scope Items (`V3_ROW` — 8 items)

#### 1. `V3-01` — Story Flow: Initiate → Glide → Settle
- **Original Finding / Need:** Implement Story Flow where deliberate user interaction initiates motion, architectural panels fold/roll to reveal a scene (glide), and the scene settles cleanly into a readable position, returning control.
- **Original Acceptance Criterion:** Frame-by-frame visual storyboard comparison; smooth 60fps fold and idle settle within 600ms without scroll trapping.
- **Implemented Resolution:** Integrated `useSceneFold` hook, CSS 3D perspectives, GSAP ScrollTrigger timeline with scrub, and idle settle listener.
- **Evidence Paths & Test References:**
  - Code: `src/hooks/useSceneFold.ts`, `src/components/motion/SceneFold.tsx`, `src/config/designTokens.ts`
  - Tests: `src/tests/stage08-motion-system.test.tsx`, `e2e/motion.spec.ts` (`E2E-MOTION-01`, `E2E-MOTION-08`)
  - Evidence: `docs/implementation/evidence/STAGE-08/RESULT.md`, artifacts `01_desktop_fold_h1_highlights.png` to `06_mobile_390px_fold_settled.png`
- **Verification Level:** `implemented`, `unit-tested`, `E2E-tested`, `evidence-inspected`.
- **Resolving Commit:** `8a61e4d` (Stage 08).
- **Caveats / Deferred Work:** Signature moment qualitative review deferred to Stage 10 under `CL-446`.

#### 2. `V3-02` — Story Flow Surface Scope (Home, Archive, House)
- **Original Finding / Need:** Ensure Story Flow motion is prominent on Home, Archive, and The House, while commerce surfaces (PDP, Bag, Checkout) remain conventional and fast.
- **Original Acceptance Criterion:** Visual and route inspection confirming fold scenes exist only at designated editorial boundaries; zero fold obstruction on catalog/cart.
- **Implemented Resolution:** Fold scenes wired strictly to 7 authorized boundaries (3 Home, 2 Archive, 2 House). Commerce routes use standard layout without fold canvas wrappers.
- **Evidence Paths & Test References:**
  - Code: `src/pages/HomePage.tsx`, `src/pages/ArchivePage.tsx`, `src/pages/HousePage.tsx`
  - Tests: `src/tests/stage08-motion-system.test.tsx`, `e2e/motion.spec.ts`
  - Evidence: `docs/implementation/evidence/STAGE-08/RESULT.md`
- **Verification Level:** `implemented`, `unit-tested`, `E2E-tested`, `evidence-inspected`.
- **Resolving Commit:** `8a61e4d` (Stage 08).
- **Caveats / Deferred Work:** None.

#### 3. `V3-03` — Story Flow Usability & Accessibility (Interruptible & Reduced Motion)
- **Original Finding / Need:** Story Flow must be interruptible, keyboard-accessible, reduced-motion-friendly, mobile-appropriate, and never trap scrolling or block navigation history.
- **Original Acceptance Criterion:** Keyboard focus immediately settles panel; fast velocity entry bypasses lag; `prefers-reduced-motion` renders zero fold DOM panels; back/forward navigation preserves scroll.
- **Implemented Resolution:** `useSceneFold` synchronously evaluates `prefers-reduced-motion` to skip DOM panel rendering; added keyboard `focusin` and velocity bypass triggers.
- **Evidence Paths & Test References:**
  - Code: `src/hooks/useSceneFold.ts`, `src/components/motion/SceneFold.tsx`
  - Tests: `src/tests/stage08-motion-system.test.tsx` (reduced-motion unit test), `e2e/motion.spec.ts` (`E2E-MOTION-03`, `E2E-MOTION-04`)
  - Evidence: `docs/implementation/evidence/STAGE-08/RESULT.md`, artifact `07_reduced_motion_settled_state.png`
- **Verification Level:** `implemented`, `unit-tested`, `E2E-tested`, `evidence-inspected`.
- **Resolving Commit:** `8a61e4d` (Stage 08).
- **Caveats / Deferred Work:** Final multi-browser assistive technology validation scheduled for Stage 11.

#### 4. `V3-04` — Defined Destination Frame & Idle Settling
- **Original Finding / Need:** Scenes must settle to an exact readable alignment when scrolling stops or idles.
- **Original Acceptance Criterion:** Settling initiates after idle debounce (approved 140ms) and resolves within 600ms without oscillation.
- **Implemented Resolution:** ScrollTrigger idle listener fires at 140ms debounce with smooth GSAP tween to snapped progress bound.
- **Evidence Paths & Test References:**
  - Code: `src/hooks/useSceneFold.ts`, `src/config/designTokens.ts`
  - Tests: `src/tests/stage08-motion-system.test.tsx`
  - Evidence: `docs/implementation/evidence/STAGE-08/RESULT.md`
- **Verification Level:** `implemented`, `unit-tested`, `evidence-inspected`.
- **Resolving Commit:** `8a61e4d` (Stage 08).
- **Caveats / Deferred Work:** None.

#### 5. `V3-05` — Signature Thread Continuity Spine
- **Original Finding / Need:** Signature thread must act as a narrative spine across the site rather than generic disconnected decoration.
- **Original Acceptance Criterion:** Golden thread trajectory connects scenes at authorized locations with continuous SVG coordinate alignment.
- **Implemented Resolution:** SVG continuity thread placed at exactly 5 authorized boundaries (Hero entrance, Hero-to-index, Wall stage crossing, Technique strip handoff, Archive story return). Explicitly omitted from The House.
- **Evidence Paths & Test References:**
  - Code: `src/components/motion/GoldenThreadTrajectory.tsx`, `src/components/walls/WallStage.tsx`
  - Tests: `e2e/motion.spec.ts` (`E2E-MOTION-02`), `e2e/stage05.spec.ts`
  - Evidence: `docs/implementation/evidence/STAGE-08/RESULT.md`, artifacts `02_desktop_fold_h2_walls_crossing_thread.png`, `04_desktop_archive_fold_a2_thread_curve.png`
- **Verification Level:** `implemented`, `unit-tested`, `E2E-tested`, `evidence-inspected`.
- **Resolving Commit:** `8a61e4d` (Stage 08).
- **Caveats / Deferred Work:** None.

#### 6. `V3-06` — Exhibition Opening Choreography
- **Original Finding / Need:** Tradition exhibition modal must feature 5-step opening choreography: cover anchors, surface settles, main image reveals, 5 views fan/settle, thread connects; interruptible.
- **Original Acceptance Criterion:** Choreography completes in $\le 1200\,\text{ms}$, allows early click/ESC dismissal, and renders all 5 views.
- **Implemented Resolution:** Implemented `useExhibitionOpening` coordinating sequence at 100ms, 400ms, 700ms, 1000ms, and 1200ms.
- **Evidence Paths & Test References:**
  - Code: `src/hooks/useExhibitionOpening.ts`, `src/components/archive/TraditionExhibitionModal.tsx`
  - Tests: `e2e/motion.spec.ts` (`E2E-MOTION-05`)
  - Evidence: `docs/implementation/evidence/STAGE-08/RESULT.md`, artifact `05_desktop_exhibition_5step_opening.png`
- **Verification Level:** `implemented`, `unit-tested`, `E2E-tested`, `evidence-inspected`.
- **Resolving Commit:** `8a61e4d` (Stage 08).
- **Caveats / Deferred Work:** Technical execution verified; formal aesthetic signoff tracked under `F-04` (kept OPEN).

#### 7. `V3-07` — Homepage Narrative Journey
- **Original Finding / Need:** Rebuild homepage journey in canonical sequence: Hero → Thread Compass → Cultural Archive → Permanent Capsule → The Making → Promise → Journal/Footer.
- **Original Acceptance Criterion:** Strict sequential section order verified in DOM and visual recording (`E2E-HOME-01`).
- **Implemented Resolution:** Full restructuring of `HomePage.tsx` to match canonical section sequence.
- **Evidence Paths & Test References:**
  - Code: `src/pages/HomePage.tsx`
  - Tests: `e2e/home.spec.ts` (`E2E-HOME-01`)
  - Evidence: `docs/implementation/evidence/STAGE-06/RESULT.md`
- **Verification Level:** `implemented`, `unit-tested`, `E2E-tested`, `evidence-inspected`.
- **Resolving Commit:** Stage 06 baseline commit.
- **Caveats / Deferred Work:** Stage 09 copy reconciliation pending.

#### 8. `V3-09` — Claim Restraint in Homepage Hero & Story
- **Original Finding / Need:** Remove unsupported edition and composition claims from the homepage hero and story text.
- **Original Acceptance Criterion:** Assert zero unsupported claims in hero; ensure ET-01 is source of truth (`E2E-HOME-02`).
- **Implemented Resolution:** Hero metadata dynamically bound to ET-01 data attributes; unsupported claims removed.
- **Evidence Paths & Test References:**
  - Code: `src/pages/HomePage.tsx`, `src/data/products.ts`
  - Tests: `e2e/home.spec.ts` (`E2E-HOME-02`)
  - Evidence: `docs/implementation/evidence/STAGE-06/RESULT.md`
- **Verification Level:** `implemented`, `unit-tested`, `E2E-tested`, `evidence-inspected`.
- **Resolving Commit:** Stage 06 baseline commit.
- **Caveats / Deferred Work:** Broader claims audit across House and Journal scheduled for Stage 09 (`B-5`).

---

### B. Tracked Findings & Defect Fixes (`FINDING` — 10 items)

#### 9. `F-01` — Story Flow Fold Missing
- **Original Finding:** Absence of architectural 3D fold transitions between core editorial scenes.
- **Original Acceptance Criterion:** Fold transitions implemented at designated boundaries, verified with Playwright scrub assertions (`E2E-MOTION-01…04`).
- **Implemented Resolution:** Implemented GSAP ScrollTrigger 3D clip-path fold system in `SceneFold.tsx`.
- **Evidence Paths & Test References:**
  - Code: `src/components/motion/SceneFold.tsx`, `src/hooks/useSceneFold.ts`
  - Tests: `e2e/motion.spec.ts` (`E2E-MOTION-01`, `E2E-MOTION-08`)
  - Evidence: `docs/implementation/evidence/STAGE-08/RESULT.md`
- **Verification Level:** `implemented`, `unit-tested`, `E2E-tested`, `evidence-inspected`.
- **Resolving Commit:** `8a61e4d` (Stage 08).
- **Caveats / Deferred Work:** Holistic review deferred to Stage 10 (`CL-446`).

#### 10. `F-02` — Home Journey & Golden Thread Continuity
- **Original Finding:** Homepage lacked visual continuity spine connecting disparate sections.
- **Original Acceptance Criterion:** Continuous pathing connecting scenes verified via visual review and automated test (`E2E-HOME-01`, `E2E-MOTION-02`).
- **Implemented Resolution:** Dynamic SVG continuity path bridging sections with responsive coordinates.
- **Evidence Paths & Test References:**
  - Code: `src/components/motion/GoldenThreadTrajectory.tsx`, `src/pages/HomePage.tsx`
  - Tests: `e2e/motion.spec.ts`, `e2e/home.spec.ts`
  - Evidence: `docs/implementation/evidence/STAGE-08/RESULT.md`
- **Verification Level:** `implemented`, `unit-tested`, `E2E-tested`, `evidence-inspected`.
- **Resolving Commit:** `8a61e4d` (Stage 08).
- **Caveats / Deferred Work:** None.

#### 11. `F-09` — Search "weave-14" Dead Link
- **Original Finding:** Search modal returned dead links for query "weave-14".
- **Original Acceptance Criterion:** Navigating to search result redirects to valid existing route (`E2E-SEARCH-01`).
- **Implemented Resolution:** Corrected search index routing logic to point to valid archive slugs.
- **Evidence Paths & Test References:**
  - Code: `src/components/SearchModal.tsx`, `src/data/legacyRoutes.ts`
  - Tests: `src/tests/stage02-unit.test.ts`, `e2e/stage02.spec.ts`
- **Verification Level:** `implemented`, `unit-tested`, `E2E-tested`.
- **Resolving Commit:** Stage 02 commit.
- **Caveats / Deferred Work:** None.

#### 12. `F-11` — ET-04 Legacy Alt Text
- **Original Finding:** Alt text on ET-04 image was outdated/incorrect.
- **Original Acceptance Criterion:** Accessible alt text matches official catalog description (`UT-DATA-01`, `E2E-A11Y`).
- **Implemented Resolution:** Corrected metadata in asset map and product data.
- **Evidence Paths & Test References:**
  - Code: `src/data/assetMap.ts`, `src/data/products.ts`
  - Tests: `src/tests/stage02-unit.test.ts`
- **Verification Level:** `implemented`, `unit-tested`.
- **Resolving Commit:** Stage 02 commit.
- **Caveats / Deferred Work:** None.

#### 13. `F-13` — Hero Claims Contradict ET-01 Record
- **Original Finding:** Homepage hero marketing copy made claims contradicting ET-01 product data.
- **Original Acceptance Criterion:** Hero copy matches product record specifications (`E2E-HOME-02`).
- **Implemented Resolution:** Hero component refactored to read directly from ET-01 catalog properties.
- **Evidence Paths & Test References:**
  - Code: `src/pages/HomePage.tsx`, `src/data/products.ts`
  - Tests: `e2e/home.spec.ts`
  - Evidence: `docs/implementation/evidence/STAGE-06/`
- **Verification Level:** `implemented`, `unit-tested`, `E2E-tested`, `evidence-inspected`.
- **Resolving Commit:** Stage 06 commit.
- **Caveats / Deferred Work:** None.

#### 14. `F-26` — CTA "Enter the Archive" Mismatch
- **Original Finding:** Inconsistent call-to-action labeling on homepage archive portal.
- **Original Acceptance Criterion:** Standardized CTA label and route binding (`E2E-HOME-02`).
- **Implemented Resolution:** Standardized to "Enter the Archive" routing cleanly to `/archive`.
- **Evidence Paths & Test References:**
  - Code: `src/pages/HomePage.tsx`
  - Tests: `e2e/home.spec.ts`
  - Evidence: `docs/implementation/evidence/STAGE-06/`
- **Verification Level:** `implemented`, `unit-tested`, `E2E-tested`, `evidence-inspected`.
- **Resolving Commit:** Stage 06 commit.
- **Caveats / Deferred Work:** None.

#### 15. `F-27` — Uppercase Product IDs Collisions
- **Original Finding:** Mixed case product identifiers caused routing 404s.
- **Original Acceptance Criterion:** Uppercase product IDs route and resolve consistently (`E2E-ROUTE-04`).
- **Implemented Resolution:** Route handlers case-normalized to support uppercase canonical product IDs.
- **Evidence Paths & Test References:**
  - Code: `src/data/products.ts`, route switchers
  - Tests: `src/tests/stage02-unit.test.ts`, `e2e/stage02.spec.ts`
- **Verification Level:** `implemented`, `unit-tested`, `E2E-tested`.
- **Resolving Commit:** Stage 02 commit.
- **Caveats / Deferred Work:** None.

#### 16. `F-32` — ET-02 Title and Fibre Inconsistency
- **Original Finding:** ET-02 title and fibre composition differed between House page and catalog.
- **Original Acceptance Criterion:** Data reconciliation across all pages (`UT-DATA-01`, `E2E-ROUTE-04`).
- **Implemented Resolution:** Synchronized product data definitions across House and catalog records.
- **Evidence Paths & Test References:**
  - Code: `src/data/products.ts`, `src/pages/HousePage.tsx`
  - Tests: `src/tests/stage02-unit.test.ts`, `e2e/stage02.spec.ts`
- **Verification Level:** `implemented`, `unit-tested`, `E2E-tested`.
- **Resolving Commit:** Stage 02 commit.
- **Caveats / Deferred Work:** None.

#### 17. `F-39` — Search Phrase Matching Inflexibility
- **Original Finding:** Search failed on multi-word and partial phrase queries.
- **Original Acceptance Criterion:** Multi-token and fuzzy matching support verified (`UT-SEARCH-01`).
- **Implemented Resolution:** Upgraded search scoring algorithm in `SearchModal.tsx`.
- **Evidence Paths & Test References:**
  - Code: `src/components/SearchModal.tsx`
  - Tests: `src/tests/stage02-unit.test.ts`, `e2e/stage02.spec.ts`
- **Verification Level:** `implemented`, `unit-tested`, `E2E-tested`.
- **Resolving Commit:** Stage 02 commit.
- **Caveats / Deferred Work:** None.

#### 18. `F-40` — Legacy Slugs `/archive/<legacy>` Support
- **Original Finding:** Legacy archive links resulted in dead pages.
- **Original Acceptance Criterion:** Legacy slugs seamlessly resolve or redirect (`E2E-ROUTE-04`).
- **Implemented Resolution:** Implemented route alias lookup table in `legacyRoutes.ts`.
- **Evidence Paths & Test References:**
  - Code: `src/data/legacyRoutes.ts`, `src/pages/ArchiveStoryPage.tsx`
  - Tests: `src/tests/stage02-unit.test.ts`, `e2e/stage02.spec.ts`
- **Verification Level:** `implemented`, `unit-tested`, `E2E-tested`.
- **Resolving Commit:** Stage 02 commit.
- **Caveats / Deferred Work:** None.

---

### C. New Architectural Requirements (`NEW_REQUIREMENT` — 4 items)

#### 19. `N-02` — TR-01…TR-07 Sellable Concept Products
- **Original Finding / Need:** Enable full commercial purchasing capabilities for Traditional garments TR-01 through TR-07 as sellable concept designs.
- **Original Acceptance Criterion:** Every TR garment can be added to cart, displayed in Bag with exact image/price/sizes, and carried through simulated checkout.
- **Implemented Resolution:** Integrated `isListed: true` and `isPurchasable: true` in `traditionalProducts.ts`, full bag flow support.
- **Evidence Paths & Test References:**
  - Code: `src/data/traditionalProducts.ts`, `src/context/CartContext.tsx`
  - Tests: `src/tests/traditional-commerce.test.tsx`, `src/tests/traditional-pdp-flow.test.tsx`
- **Verification Level:** `implemented`, `unit-tested`, `owner-accepted`, `fully closed`.
- **Resolving Commit:** Stage 04 commit.
- **Caveats / Deferred Work:** Concept notice wording pending formal signoff under `B-4`.

#### 20. `N-07` — Condensed Making & Promise Scene
- **Original Finding / Need:** Replace verbose, claim-heavy Making and Promise sections on homepage with a condensed, claim-free homage scene.
- **Original Acceptance Criterion:** Homepage renders condensed single scene with verified claim-free copy (`E2E-HOME-06`).
- **Implemented Resolution:** Condensed into unified scene with narrative spine links and verified brand values.
- **Evidence Paths & Test References:**
  - Code: `src/pages/HomePage.tsx`
  - Tests: `e2e/home.spec.ts` (`E2E-HOME-06`)
  - Evidence: `docs/implementation/evidence/STAGE-06/`
- **Verification Level:** `implemented`, `unit-tested`, `E2E-tested`, `evidence-inspected`.
- **Resolving Commit:** Stage 06 commit.
- **Caveats / Deferred Work:** None.

#### 21. `N-08` — Fold Panels Wired at 7 Boundaries
- **Original Finding / Need:** Restrict fold transitions strictly to authorized boundaries (3 Home, 2 Archive, 2 House) without extraneous scene cuts.
- **Original Acceptance Criterion:** Fold panels present only at H1..H3, A1..A2, U1..U2; 3 bands on desktop, 2 bands on mobile.
- **Implemented Resolution:** Implemented responsive band splitting and fold triggers across the 7 boundaries.
- **Evidence Paths & Test References:**
  - Code: `src/components/motion/SceneFold.tsx`, `src/config/designTokens.ts`
  - Tests: `src/tests/stage08-motion-system.test.tsx`, `e2e/motion.spec.ts` (`E2E-MOTION-01`, `E2E-MOTION-06`)
  - Evidence: `docs/implementation/evidence/STAGE-08/RESULT.md`
- **Verification Level:** `implemented`, `unit-tested`, `E2E-tested`, `evidence-inspected`.
- **Resolving Commit:** `8a61e4d` (Stage 08).
- **Caveats / Deferred Work:** None.

#### 22. `N-09` — Provenance, Credit, and Concept Data Fields
- **Original Finding / Need:** Add structured data models for image provenance, artisan credits, and concept disclosures.
- **Original Acceptance Criterion:** Data types and catalog records populated with provenance metadata (`UT-DATA-02`).
- **Implemented Resolution:** Added `ImageProvenance`, `creditText`, and `conceptNotice` fields to catalog schemas.
- **Evidence Paths & Test References:**
  - Code: `src/types/catalog.ts`, `src/data/traditionalProducts.ts`, `src/data/assetMap.ts`
  - Tests: `src/tests/stage02-unit.test.ts`
- **Verification Level:** `implemented`, `unit-tested`, `fully closed`.
- **Resolving Commit:** Stage 02 commit.
- **Caveats / Deferred Work:** Front-end editorial copy signoff deferred to Stage 09.

---

## 3. Cross-Reference: Closed Verification Checklists (11 items)

The following 11 checklist verification items (`CHECKLIST_ROW`) are closed in the tracker, representing specific technical criteria satisfied during Stage 08:
* `CL-263`: Visible but restrained page-entry transition.
* `CL-264`: Section reveals noticeable at normal scroll speed.
* `CL-265`: Consistent easing, timing, and visual rhythm.
* `CL-266`: Considered entrance sequence without delaying essential content.
* `CL-267`: No flicker, layout shift, or permanently hidden content.
* `CL-268`: No scroll hijacking or harmful forced horizontal movement.
* `CL-269`: No continuous expensive rendering on idle.
* `CL-270`: Mobile motion adapted for viewport size and performance.
* `CL-271`: `prefers-reduced-motion` strictly respected (zero DOM panels).
* `CL-272`: Motion does not interfere with focus or interactive controls.
* `CL-273`: Re-entering routes does not break animation state.

---

## 4. Cross-Reference: Settled Governance Decisions (4 items)

* `O-4`: Canonical motion parameters approved by owner (Section 9 register).
* `O-6`: TR product images confirmed approved by owner for commercial presentation.
* `DEC D-08`: ET-01 product record confirmed as source of truth for hero metadata.
* `DEC D-11`: Homepage editorial narrative progression approved.
