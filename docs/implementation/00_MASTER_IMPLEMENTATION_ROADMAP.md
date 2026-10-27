# 00 — EverThread Master Implementation Roadmap (Antigravity entry point) — Revision 3

**Current Baseline:** Commit `c60f99b` on branch `stage-08-motion`. Stage 08 (Motion System, Fold Scenes & Thread Continuity) complete.  
**Consolidated Decisions:** Fully reconciled with `EverThread_Consolidated_Owner_Decisions.md`.  
Read this file, then only the current `STAGE-NN` file, and only after the owner approves that stage. Do not read ahead.

---

## 1. Purpose and Scope
Deliver the approved EverThread design: fix audited defects, add the second collection wall **The Living Inheritance** (TR-01…TR-07, sellable *concept* products), redesign the Archive overview, complete the Home journey, implement the approved motion system, and verify everything in real browsers.
- **In scope:** frontend only (React, TypeScript, Vite, React Router, GSAP, Vitest, Playwright dev dependency).
- **Out of scope:** backend, authentication, CMS, admin, real payments or inventory, new image generation, changing canonical ET-01…ET-07 IDs/prices, shortening the loader, a "Newest" sort, any invented product, provenance, artisan or manufacturing fact.
- **Scroll rules:** No scroll pinning and **no vertical scroll snapping anywhere**. Native vertical scrolling is never intercepted. The only snapping permitted is **horizontal** `scroll-snap` inside the collection-wall stage track and the mobile technique strip (native browser behaviour, not scripted).

---

## 2. Baseline and Evidence Status
| Item | Status |
|---|---|
| Repository | Branch `stage-08-motion` at `c60f99b`, clean working tree. Remote head verified. |
| Automated checks | Vitest **344 passed**; Playwright E2E suites passing across baseline, Stage 02, 03, 04, 05, 06, 07, 08; `tsc --noEmit` exit 0; `vite build` exit 0. |
| Dependencies | React 18, React Router DOM 6, GSAP 3, Bootstrap 5, Vite 6, Vitest 2, Playwright test. |
| Consolidated Owner Decisions | Reconciled in `EverThread_Consolidated_Owner_Decisions.md` and `docs/implementation/UNRESOLVED_ISSUES_REGISTER.md`. |
| Image Policy (O-6-C) | Existing images only. No new image generation or replacement requests. Best-fit existing assets retained. |
| Edition Policy (D-18 / F-46) | Assessment-specific owner risk acceptance: existing ET edition claims remain as-is. TR products have 0 edition strings. |

---

## 3. Approved Decisions & Policy Highlights
- **Collection Walls (O-2, O-3):** `/collections` (Contemporary) and `/collections/the-living-inheritance` (The Living Inheritance). Native horizontal scroll-snap, visible peek of next wall, accessible labelled tabs, route sync, keyboard access, natural vertical scrolling. Zero wheel hijacking.
- **Archive-to-TR Relations (O-7):** Existing mappings in `archiveRelations.ts` preserved. TR products confirmed purchasable. Older notes claiming TR products are unlisted or non-purchasable are **superseded**. Educational archive entries remain non-transactional (no direct "Acquire" buttons).
- **Motion System (O-4):** Restrained hybrid motion following **Initiate → Glide → Settle** with fold-based Story Flow. No pinning or vertical scroll snapping.
- **Exhibition Opening (F-04):** Choreography implemented and tested in Stage 08 (`E2E-MOTION-05`). Retained as **pending manual owner review of recording**.
- **Technique Strip (O-5):** Scroll-driven 9-diagram strip preserved without autoplay.
- **House Structure (D-20):** Preserve 6-section House structure exactly. No condensing to 4 chapters.
- **Curator's Compass (O-8):** Contemporary products only.
- **Concept Disclosure (B-4, D-21):** Canonical disclosure: *"Traditional products shown are AI-generated conceptual designs demonstrating archival craft techniques."* Designated placements: (1) TR PDP beneath image stage, (2) Living Inheritance wall header, (3) TR Archive search subtitle.
- **Claims Remediation (B-5, O-12):** Global Ateliers reframed as conceptual design studies. Generational inlays framed as engineering specification. Journal monographs approved as curatorial essays with academic citations.

---

## 4. Stage Sequence and Current Progress
| Stage | File | Objective | Status | Notes |
|:---:|---|---|:---:|---|
| **1** | `STAGE-01-BASELINE-TOOLING-INVENTORY.md` | Baseline, Playwright, asset/claims verification | **COMPLETE** | Merged in baseline |
| **2** | `STAGE-02-DATA-MODEL-ROUTES-COMPATIBILITY.md` | Data model, catalogue boundaries, routes, search, relations | **COMPLETE** | Verified in unit/E2E |
| **3** | `STAGE-03-PRODUCT-STAGE-AND-LENS.md` | Portrait-aware product stage, Lens, dialog focus | **COMPLETE** | Verified in Stage 03 |
| **4** | `STAGE-04-TRADITIONAL-PRODUCTS-AND-COMMERCE.md` | TR products, sizes for sets, colour behaviour, Bag | **COMPLETE** | Verified in Stage 04 |
| **5** | `STAGE-05-COLLECTION-WALLS.md` | Wall stage, two routes, composition | **COMPLETE** | Verified in Stage 05 |
| **6** | `STAGE-06-HOME-INFORMATION-ARCHITECTURE.md` | Home sequence, Making/Promise, wall preview | **COMPLETE** | Verified in Stage 06 |
| **7** | `STAGE-07-ARCHIVE-DIAGRAMS-EXHIBITION.md` | Archive overview, strip, exhibition | **COMPLETE** | Verified in Stage 07 |
| **8** | `STAGE-08-MOTION-AND-THREAD.md` | Fold scenes, opening, thread continuity | **COMPLETE** | Commit `8a61e4d` / `c60f99b` |
| **9** | `STAGE-09-HOUSE-JOURNAL-CLAIMS.md` | House/Journal, claims remediation, disclosure wiring | **COMPLETE** | B-4 & B-5 implemented & verified; Vitest 352 passed, Playwright 78 passed; `stage09-editorial-claims.test.tsx` (8/8) |
| **10** | `STAGE-10-ACCESSIBILITY-REGRESSION-RESPONSIVE.md` | Moving-thread tuning, CL-446 signature moment, synthesis | **COMPLETE** | Moving thread calibrated; CL-446 verified; F-10, F-19, F-21, F-29, F-30, F-36, F-37 verified; F-04 retained OPEN for owner review; 18/18 Stage 10 E2E & 3/3 Compass E2E passed; build exit 0. |
| **11** | `STAGE-11-AUDIT-CLOSURE-HANDOVER.md` | Audit closure, documentation supersession, handover | **COMPLETE** | CLOSURE_MATRIX.md established (478 rows); SUPERSEDED.md created and 15 docs prepended; HANDOVER.md authored; asset paths and zero master PNGs verified; test gates clean; F-04 retained OPEN for owner review; F-24 UNVERIFIED pending live deployment. |

---

## 5. Scope for Upcoming Stages

### Stage 09: The House, Journal, Claims Integrity, and Concept Disclosure
- **Purpose:** Apply approved B-4 canonical disclosure and B-5 claim remediations across The House, Living Inheritance wall, and Search.
- **Specific Tasks:**
  1. Wire canonical constant `CONCEPT_NOTICE_TEXT` into TR PDP (below image stage), Living Inheritance wall header, and TR search subtitle (`D-21`).
  2. Reframe Global Ateliers in `HousePage.tsx` as conceptual design studies (e.g. *“Paris Design Study”*, *“New Delhi Guild Study”*), removing operational coordination claims.
  3. Frame Generational Inlays in `HousePage.tsx` as an engineering tailoring specification.
  4. Preserve existing 6-section House structure (`D-20`) with scenes U1 and U2.
  5. Verify Journal monograph curatorial framing, personas, and academic bibliographies.
  6. Execute Vitest and Playwright claims assertion tests (`e2e/claims.spec.ts`).

### Stage 10: Interaction Polish, Moving Thread, and Synthesis
- **Purpose:** Holistic review of signature moments, cross-viewport refinement, and wall switching motion.
- **Specific Tasks:**
  1. **Collection-Switching Moving Thread:** Inspect `WallThread.tsx`, `WallStage.tsx`, and `walls.css` at normal scroll speeds. Adjust timing/easing so rightward movement is perceptible, smooth, and editorial without sluggishness. Capture before/after evidence.
  2. **Signature Moment Review (`CL-446`):** End-to-end qualitative review of fold-and-settle transitions across viewports.
  3. **Exhibition Opening (`F-04`):** Provide recording package for manual owner review.
  4. **Commerce & Navigation Polish:** Review search filtering, mobile drawer ergonomics, and dedicated shopping flow (`V3-08`, `V3-12`).

### Stage 11: Performance, Accessibility & Final Handover
- **Purpose:** Formal WCAG 2.1 AA accessibility audit (`V3-14`) and performance budget verification (`V3-13`).
- **Specific Tasks:** Keyboard trap audit, screen reader testing, Lighthouse/Core Web Vitals checks, production build validation, and final handover package.
