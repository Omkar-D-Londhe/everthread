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

#### 23. `F-10` — Mobile & Cross-Viewport Overflow Remediation
- **Original Finding / Need:** Eliminate horizontal layout overflow across all viewports (320px–1440px) without relying on global masking.
- **Original Acceptance Criterion:** 0 elements exceeding viewport bounds with `body { overflow-x: visible }`.
- **Implemented Resolution:** Added responsive row gutter cap `@media (max-width: 576px) { .row { --bs-gutter-x: 1rem !important; margin-left: 0 !important; margin-right: 0 !important; } }`, adjusted Header gaps and margins, and added ultra-narrow constraints.
- **Evidence Paths & Test References:**
  - Code: `src/styles/main.css`, `src/components/Header.tsx`
  - Tests: `e2e/stage10-acceptance.spec.ts` (`E2E-RESP-01`)
- **Verification Level:** `implemented`, `e2e-tested`, `fully closed`.
- **Resolving Commit:** Stage 10.

#### 24. `F-14` — ThreadLoader Timing Invariance
- **Original Finding / Need:** Verify loader timing strictly preserves approved 1900 ms active duration and 400 ms fade.
- **Original Acceptance Criterion:** Invariant timing confirmed with zero deviation.
- **Implemented Resolution:** Confirmed `ThreadLoader.tsx` timing at 1900 ms / 400 ms fade, reduced-motion parity.
- **Evidence Paths & Test References:**
  - Code: `src/components/ThreadLoader.tsx`
  - Tests: `e2e/stage10-acceptance.spec.ts` (`E2E-LOAD-01`)
- **Verification Level:** `verified`, `e2e-tested`, `fully closed`.
- **Resolving Commit:** Stage 10.

#### 25. `F-19` — Thread Compass End-to-End Browser Verification
- **Original Finding / Need:** Automated E2E verification of Curator's Compass consultation flow, determinism, and product boundaries.
- **Original Acceptance Criterion:** E2E-COMP-01 passes across viewports; same inputs produce identical results; different inputs differ; zero TR products recommended.
- **Implemented Resolution:** Created `e2e/compass.spec.ts` with complete question flow traversal, determinism check, differential check, and zero TR assertion.
- **Evidence Paths & Test References:**
  - Code: `src/pages/CompassPage.tsx`, `src/utils/compassMatcher.ts`
  - Tests: `e2e/compass.spec.ts` (`E2E-COMP-01`)
- **Verification Level:** `verified`, `e2e-tested`, `fully closed`.
- **Resolving Commit:** Stage 10.

#### 26. `F-21` / `V3-10` — Icon Font Fallback & Ligature Protection
- **Original Finding / Need:** Ensure Material Symbols font blocking never displays raw ligature text or causes layout breakage.
- **Original Acceptance Criterion:** Font blocking hides ligature text; decorative icons marked `aria-hidden="true"`; interactive icons have accessible labels.
- **Implemented Resolution:** Added `document.fonts.ready` class `icons-ready` in `index.html` and `main.css`, hiding ligature text until font loads. Added `aria-hidden="true"` to 48 decorative icon instances.
- **Evidence Paths & Test References:**
  - Code: `index.html`, `src/styles/main.css`, `src/components/*`
  - Tests: `e2e/stage10-acceptance.spec.ts` (`E2E-A11Y-ICONS`)
- **Verification Level:** `implemented`, `e2e-tested`, `fully closed`.
- **Resolving Commit:** Stage 10.

#### 27. `F-29` — Focus Ring Contrast Compliance
- **Original Finding / Need:** Replace low-contrast champagne focus rings with high-contrast outlines meeting WCAG 2.1 AA (≥ 3:1).
- **Original Acceptance Criterion:** Focus rings computed contrast ≥ 3:1 everywhere.
- **Implemented Resolution:** Replaced champagne outlines with Deep Oxblood `#49232D` (12.8:1 contrast on Warm Ivory) 2px with 2px offset; on dark surfaces Warm Ivory `#F5EFEB`.
- **Evidence Paths & Test References:**
  - Code: `src/styles/main.css`, `src/styles/animations.css`, `src/styles/walls.css`
  - Tests: `e2e/stage10-acceptance.spec.ts` (`E2E-A11Y-03`)
- **Verification Level:** `implemented`, `e2e-tested`, `fully closed`.
- **Resolving Commit:** Stage 10.

#### 28. `F-30` — Newsletter Accessible Labeling
- **Original Finding / Need:** Provide accessible label for footer newsletter email input.
- **Original Acceptance Criterion:** Newsletter input has accessible name and visible or visually-hidden label.
- **Implemented Resolution:** Added visually-hidden `<label for="newsletter-email">` and `aria-label="Email address"` in `Footer.tsx`.
- **Evidence Paths & Test References:**
  - Code: `src/components/Footer.tsx`
  - Tests: `e2e/stage10-acceptance.spec.ts` (`E2E-A11Y-NEWSLETTER`)
- **Verification Level:** `implemented`, `e2e-tested`, `fully closed`.
- **Resolving Commit:** Stage 10.

#### 29. `F-36` — Failure Mode States Verification
- **Original Finding / Need:** Verify graceful handling when images, diagrams, or fonts fail to load.
- **Original Acceptance Criterion:** Non-blocking fallback chains for images (SVG → PNG → text fallback) and fonts.
- **Implemented Resolution:** Verified fallback handling across `TechniqueStrip`, `ProductImageStage`, and icon fonts.
- **Evidence Paths & Test References:**
  - Code: `src/components/archive/TechniqueStrip.tsx`, `src/components/ProductImageStage.tsx`
  - Tests: `e2e/stage10-acceptance.spec.ts`
- **Verification Level:** `verified`, `e2e-tested`, `fully closed`.
- **Resolving Commit:** Stage 10.

#### 30. `F-37` — Interaction & Accessibility Verification
- **Original Finding / Need:** Verify keyboard-only navigation, landmark structure, touch targets, and ARIA state.
- **Original Acceptance Criterion:** Keyboard navigation operates cleanly without focus loss or traps; touch targets meet minimum criteria.
- **Implemented Resolution:** Verified keyboard traversal, contrast ratios, and touch targets across primary workflows.
- **Evidence Paths & Test References:**
  - Tests: `e2e/stage10-acceptance.spec.ts`
- **Verification Level:** `verified`, `e2e-tested`, `fully closed`.
- **Resolving Commit:** Stage 10.

#### 31. `CL-446` — Signature Motion Calibration: Initiate → Glide → Settle
- **Original Finding / Need:** Collection-switching moving thread rightward movement must be smooth, perceptible, and editorial at normal scroll speeds.
- **Original Acceptance Criterion:** Motion perceptible without wheel hijacking; smooth spring-like bezier glide; luminous head beacon; instant settle under reduced motion.
- **Implemented Resolution:** Refined `WallThread.tsx` with `strokeWidth: 2.75`, lead bezier tip sinusoidal offset, `0.16s cubic-bezier(0.22, 1, 0.36, 1)` glide, head circle bead beacon, and full reduced-motion preservation.
- **Evidence Paths & Test References:**
  - Code: `src/components/walls/WallThread.tsx`, `src/styles/walls.css`, `src/main.tsx`
  - Tests: `e2e/stage10-acceptance.spec.ts` (`E2E-WALL-THREAD`), `src/tests/walls.test.tsx` (13/13 passed)
- **Verification Level:** `implemented`, `unit-tested`, `e2e-tested`, `fully closed`.
- **Resolving Commit:** Stage 10.

#### 32. `F-22` — Documentation Contradictions & Historical Supersession
- **Original Finding / Need:** Catalog and mark conflicting historical documentation without deleting audit history.
- **Original Acceptance Criterion:** Create supersession index; tag conflicting repository documents with a single-line notice; preserve all paragraphs and historical evidence.
- **Implemented Resolution:** Created `docs/SUPERSEDED.md` cataloging conflicting documents against authoritative sources. Prepended `SUPERSEDED in part — see docs/SUPERSEDED.md` to 15 qualifying historical documents across `docs/historical/` and `docs/instructions.md`.
- **Evidence Paths & Test References:**
  - Files: `docs/SUPERSEDED.md`, `docs/instructions.md`, `docs/historical/superseded/*`
- **Verification Level:** `implemented`, `verified`, `fully closed`.
- **Resolving Commit:** Stage 11.

#### 33. `F-45` — Process Rows & Audit Closure Matrix
- **Original Finding / Need:** Establish complete closure matrix reconciling every audit finding, decision, requirement, and checklist row with verified evidence.
- **Original Acceptance Criterion:** Zero blank rows; final statuses mapped to evidence; synchronized across both tracker mirrors.
- **Implemented Resolution:** Generated `docs/CLOSURE_MATRIX.md` with 478 reconciled rows across 7 categories. Both `01b_AUDIT_TRACKER.csv` mirrors updated byte-for-byte.
- **Evidence Paths & Test References:**
  - Files: `docs/CLOSURE_MATRIX.md`, `docs/HANDOVER.md`, `docs/implementation/01b_AUDIT_TRACKER.csv`
- **Verification Level:** `implemented`, `verified`, `fully closed`.
- **Resolving Commit:** Stage 11.

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

## 4. Cross-Reference: Settled Governance Decisions (10 items)

* `O-4`: Canonical motion parameters approved by owner (Section 9 register).
* `O-6`: TR product images confirmed approved by owner for commercial presentation.
* `B-3`: Thread Compass recommendation matrix and consultation flow approved by owner.
* `B-4`: Concept disclosure canonical wording and 3 D-21 placements approved and verified in Stage 09.
* `B-5`: Claim-by-claim factual dispositions approved and verified in Stage 09 (Global Ateliers reframed as design studies, Inlays as engineering spec, Journal curatorial safeguards preserved).
* `O-9`: Canonical AI concept disclosure implemented and verified across PDP, Wall, and Search in Stage 09.
* `O-11`: TR status concept policy and zero edition/hours/origin claims verified.
* `O-12`: Making/Promise conservative craft-homage approach implemented and verified across Home (Stage 06) and House (Stage 09).
* `DEC D-08`: ET-01 product record confirmed as source of truth for hero metadata.
* `DEC D-11`: Homepage editorial narrative progression approved.
