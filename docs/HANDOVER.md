# EverThread — Production Handover & Architecture Document

**Specification Reference:** `docs/implementation/STAGE-11-AUDIT-CLOSURE-HANDOVER.md` §7.7  
**Baseline Commit:** `c60f99b` on branch `stage-08-motion`  
**Generated Date:** 2026-10-27  
**Final Stage Status:** Stage 11 Complete / Handover Ready  

---

## 1. Executive Summary & Architecture Overview

EverThread is a high-end editorial and contemporary heritage-luxury fashion house frontend built with **React 18**, **TypeScript**, **Vite 6**, **GSAP 3**, **React Router 6**, and **Bootstrap 5**. The project delivers an experience combining ecommerce clarity with the pacing and tactile rhythm of a luxury monograph.

### Non-Negotiable Architectural Principles
1. **100% Native Scrolling:** No scroll pinning, no vertical scroll snapping, and no scroll hijacking anywhere. Native vertical scrolling is never intercepted.
2. **Horizontal Snapping:** Native horizontal `scroll-snap` is used strictly inside the Collection Wall stage track and mobile technique strip.
3. **Motion Contract (Initiate → Glide → Settle):** Restrained hybrid motion following approved canonical parameters (`O-4`), with strict `prefers-reduced-motion` compliance.
4. **Architectural Fold Boundaries:** Strictly 7 fold boundaries (`H1`, `H2`, `H3` on Home; `A1`, `A2` on Archive; `U1`, `U2` on The House).
5. **Thread Continuity:** Strictly 5 placements across Home, Wall Stage crossing, Archive strip curve, and Exhibition Modal filament.
6. **Loader Timing Invariance:** `ThreadLoader.tsx` is fixed at exactly **1900 ms active duration** and **400 ms fade**.

---

## 2. Canonical Route Table

The application serves the following verified routes and canonical redirects:

| Path | Component / Page | Purpose & Description | Verified Viewports |
|---|---|---|:---:|
| `/` | `HomePage.tsx` | Home journey (Hero, Highlights plinths, Two-Wall preview, Making & Promise) | 1440, 1024, 390, 320 |
| `/collections` | `ContemporaryWall.tsx` | Contemporary Collection wall (`ET-01`–`ET-07`), horizontal stage track with peek | 1440, 1024, 390, 320 |
| `/collections/the-living-inheritance` | `LivingInheritanceWall.tsx` | Traditional Collection wall (`TR-01`–`TR-07`), AI concept designs, canonical disclosure | 1440, 1024, 390, 320 |
| `/product/:productId` | `ProductDetailPage.tsx` | Portrait-aware PDP, image stage, Atelier Loupe Lens, size/colour selection, Bag add | 1440, 1024, 390, 320 |
| `/archive` | `ArchivePage.tsx` | Cultural Archive, 4 discipline groups, asymmetric layout, 9-diagram technique strip | 1440, 1024, 390, 320 |
| `/archive/:traditionKey` | `ArchiveStoryPage.tsx` | Living Loom deep tradition monographic story with navigation | 1440, 1024, 390, 320 |
| `/compass` | `CompassPage.tsx` | Curator's Compass 3-step consultation stepper (Contemporary products only) | 1440, 1024, 390, 320 |
| `/house` | `HousePage.tsx` | The House (6 sections: Hero, Creed, Materials, Design Studies, Bespoke, Transparency) | 1440, 1024, 390, 320 |
| `/journal` | `JournalPage.tsx` | Curatorial Monographs and Journal essays index | 1440, 1024, 390, 320 |
| `/journal/:articleId` | `JournalArticlePage.tsx` | Journal article view with academic bibliography sources and curatorial personas | 1440, 1024, 390, 320 |
| `/saved` | `SavedPiecesPage.tsx` | Saved Pieces wishlist with localStorage persistence and plinth cards | 1440, 1024, 390, 320 |
| `/bag` | `BagPage.tsx` | Shopping Bag with variantId composite keys, quantity controls, and order summary | 1440, 1024, 390, 320 |
| `/checkout` | `CheckoutPage.tsx` | Demo Concierge Checkout with empty bag guard and consultation confirmation | 1440, 1024, 390, 320 |
| `*` | `NotFoundPage.tsx` | Luxury editorial 404 page with return to home and collections links | 1440, 1024, 390, 320 |

### Canonical Aliases & Route Redirects
- `/products/:productId` redirects cleanly to `/product/:productId`.
- Legacy tradition slugs (e.g. `/archive/banarasi`) redirect cleanly to `/archive?tradition=banarasi`.
- Case-insensitive product IDs (e.g. `/product/et-01` or `/product/ET-01`) resolve identically.

---

## 3. Catalog Data Boundaries & Model Architecture

The product catalog enforces strict boundary separation across two distinct collection domains:

### 3.1 Collections & Boundaries
1. **`PRODUCTS` (`src/data/products.ts`):**
   - Canonical Contemporary pieces: **`ET-01` through `ET-07`**.
   - Attributes: Concrete price in USD, commercial sizes (`XS`–`XL`), colorways, physical fiber specifications.
   - Recommended exclusively by Curator's Compass (`compassMatcher.ts`).
2. **`TRADITIONAL_PRODUCTS` (`src/data/traditionalProducts.ts`):**
   - Traditional Collection pieces: **`TR-01` through `TR-07`**.
   - Conceptual AI-generated fashion studies demonstrating archival craft techniques.
   - Attributes: Commercially purchasable (`isListed: true`), concept disclosure notice (`CONCEPT_NOTICE_TEXT`), zero edition claims, zero fabricated artisan biographies, structured garment sets (e.g., Kurta + Trouser) with component-specific sizing.
3. **`ALL_PRODUCTS` (`src/data/products.ts`):**
   - Unified union helper (`[...PRODUCTS, ...TRADITIONAL_PRODUCTS]`) powering universal lookups by ID or slug (`getProductById`, `getProductBySlug`).

### 3.2 Canonical Disclosure Wiring (`B-4`, `D-21`)
The canonical disclosure text is centralized as `CONCEPT_NOTICE_TEXT` in `src/data/traditionalProducts.ts`:
> *"Traditional products shown are AI-generated conceptual designs demonstrating archival craft techniques."*

Placements:
1. **TR Product Detail Page:** Rendered beneath the primary image stage.
2. **The Living Inheritance Collection Wall:** Rendered prominently in the collection wall header.
3. **Search Modal:** Rendered as the subtitle under Traditional Collection search results (*"AI-generated conceptual design"*).

---

## 4. Operational Procedure: Adding a Traditional (`TR-xx`) Product

To add a new Traditional Collection piece without breaking system invariants:

1. **Allocate Canonical ID:** Use next sequential ID (e.g., `TR-08`).
2. **Add Assets to `public/images/products/tr-xx-.../`:**
   - Place optimized WebP and high-resolution PNG detail images (capped at native resolution per `B-6`).
   - Do **not** place large unoptimized master PNGs (>5MB) in `public/`.
3. **Register Product in `src/data/traditionalProducts.ts`:**
   ```typescript
   {
     id: 'TR-08',
     slug: 'tr-08-your-slug',
     name: 'Your Traditional Design Title',
     subtitle: 'Craft Technique Subtitle',
     price: 2450,
     currency: 'USD',
     collection: 'traditional',
     isListed: true,
     conceptNotice: CONCEPT_NOTICE_TEXT,
     provenance: 'ai-concept-fashion',
     craftTradition: 'Tradition Name',
     origin: 'Region, Country',
     // sizing specifications for single garments or sets
   }
   ```
4. **Register Image Assets in `src/data/assetMap.ts`:**
   - Add image view paths (`primary`, `detail`, `threeQuarter`, `editorial`, `back`) with responsive `srcset` entries.
5. **Add Archive Inspiration Link in `src/data/archiveRelations.ts`:**
   - Link the relevant craft tradition key in `TRADITION_INSPIRED_DESIGNS` to the new product ID.
6. **Verify Automated Gates:**
   - Run `npm test` and `npx tsc --noEmit` to ensure type compatibility and cart integration.

---

## 5. Test Execution Guide

All automated tests and build pipelines are executed via npm scripts:

```bash
# 1. Run full Vitest unit and component test suite (355 tests)
npm test

# 2. Run TypeScript typecheck (zero emit)
npx tsc --noEmit

# 3. Execute Vite production build
npm run build

# 4. Run dedicated Stage 10 & Compass Playwright browser tests
npx playwright test e2e/stage10-acceptance.spec.ts e2e/compass.spec.ts

# 5. Run full Playwright E2E suite
npm run test:e2e
```

> **Note on Legacy Playwright Tests:** Running `npm run test:e2e` executes all 12 spec files. Historical test suites written during early development (`stage02.spec.ts`, `stage04.spec.ts`, `stage05.spec.ts`) contain assertions expecting Traditional products to be unlisted (`isListed: false`). These tests fail because TR products were subsequently made commercially purchasable concept pieces (`isListed: true`) under approved **Owner Decisions B-4 and O-7**. Use `npx playwright test e2e/stage10-acceptance.spec.ts e2e/compass.spec.ts` for verified Stage 10/11 browser acceptance.

---

## 6. Known Limitations & Owner-Accepted Risks

The following items represent conscious owner decisions and assessment-specific risk acceptances recorded in `01_REQUIREMENTS_AND_DECISION_TRACEABILITY.md` and `EverThread_Consolidated_Owner_Decisions.md`:

1. **`D-18` / `F-46` (Edition Claims Risk Acceptance):**
   - Assessment-specific risk acceptance: Existing Contemporary (`ET-01`–`ET-07`) edition claims (e.g., *"Edition of 12"*) are retained as-is for the design assessment. Traditional (`TR-01`–`TR-07`) products have strictly zero edition strings.
2. **`O-6-C` (Existing Image Only Policy):**
   - Best-fitting existing imagery already present in the project is retained for `TR-01`, `TR-03`, and `TR-07`. No new image generation or editing was commissioned.
3. **`F-17` (Newest Sort Deferred):**
   - Deferred by owner decision. Only "Featured", "Price: Low to High", and "Price: High to Low" sort options exist on collection walls.
4. **`F-42` (Visible Credit Text Deferred):**
   - Structured metadata models (`ImageProvenance`, `creditText`) are fully implemented in the data schemas; visible front-end credit overlays were deferred by decision.
5. **`B-1` / `F-25` (Phase 6.0 Documents Missing):**
   - Confirmed missing from filesystem and git history. Derived motion parameters were reviewed and formally approved by the owner under Decision **`O-4`**.

---

## 7. Open Owner Decisions & Required Post-Handover Actions

The following two items are gated specifically for owner action:

1. **`F-04` (Exhibition 5-Step Opening Choreography):**
   - **Current Status:** `OPEN | PENDING MANUAL OWNER REVIEW`
   - **Required Owner Action:** The technical execution and timing tests (`useExhibitionOpening.ts`, `E2E-MOTION-05`) pass. The owner must manually review the screen recording of the 5-step opening choreography (`docs/implementation/evidence/STAGE-07/` or local browser) before formally closing `F-04`.
2. **`F-24` / `B-7` (Live Deployment Verification on GitHub Pages):**
   - **Current Status:** `BLOCKED / UNVERIFIED`
   - **Required Owner Action:** In accordance with Stage 11 §7.6, deployment status cannot be claimed as verified from CI alone. The owner must merge to `main` (triggering `.github/workflows/deploy.yml`), and confirm 8 live routes (`/`, `/collections`, `/collections/the-living-inheritance`, `/product/ET-01`, `/archive`, `/compass`, `/house`, `/bag`) with page reload (`MAN-LIVE`).

---

## 8. Changed-File Inventory (`git diff --stat`)

The following 50 tracked files were modified across Pass A, Stage 09, Stage 10, and Stage 11:

```text
 docs/historical/drafts/everthread_audit_reassessment_v3.md     |   2 +
 docs/historical/drafts/everthread_audit_report_v2.md           |   2 +
 docs/historical/drafts/everthread_completeness_check.md        |   2 +
 docs/historical/drafts/everthread_master_findings_register.md  |   2 +
 docs/historical/drafts/everthread_phase1_verification_gap_report.md | 2 +
 docs/historical/drafts/everthread_reassessment_summary.md      |   2 +
 docs/historical/drafts/everthread_solution_proposal.md         |   2 +
 docs/historical/superseded/phase-reports/phase_6_6_preflight_audit.md | 2 +
 docs/historical/superseded/phase-reports/phase_7_0_release_readiness_report.md | 2 +
 docs/historical/superseded/phase-reports/phase_7_1_github_pages_report.md | 2 +
 docs/historical/superseded/phase-reports/phase_7_2_deployment_verification_report.md | 2 +
 docs/historical/superseded/phase-reports/phase_7_2_functionality_motion_lens_report.md | 2 +
 docs/historical/superseded/phase-reports/phase_7_3_comprehensive_audit_report.md | 2 +
 docs/historical/superseded/phase-reports/phase_7_3_visual_commerce_corrections_report.md | 2 +
 docs/implementation/00_MASTER_IMPLEMENTATION_ROADMAP.md        | 135 +++++---
 docs/implementation/01b_AUDIT_TRACKER.csv                      |  46 ++--
 docs/implementation/RESOLVED_ISSUES_REGISTER.md                |  97 +++++-
 docs/implementation/UNRESOLVED_ISSUES_REGISTER.md              | 173 ++++----
 docs/implementation/tracker/01b_AUDIT_TRACKER.csv              |  46 ++--
 docs/instructions.md                                           |   2 +
 index.html                                                     |  15 +
 src/components/AtelierLensModal.tsx                            |   4 +-
 src/components/Footer.tsx                                      |   7 +-
 src/components/Header.tsx                                      |   6 +-
 src/components/SearchModal.tsx                                 |  17 +-
 src/components/walls/WallThread.tsx                            |  73 ++++-
 src/data/traditionalProducts.ts                                |   5 +-
 src/main.tsx                                                   |   1 +
 src/pages/BagPage.tsx                                          |  16 +-
 src/pages/CheckoutPage.tsx                                     |  12 +-
 src/pages/HomePage.tsx                                         |  18 +-
 src/pages/HousePage.tsx                                        |  34 ++-
 src/pages/JournalArticlePage.tsx                               |   2 +-
 src/pages/JournalPage.tsx                                      |   6 +-
 src/pages/ProductDetailPage.tsx                                |  15 +-
 src/pages/SavedPiecesPage.tsx                                  |  10 +-
 src/pages/collections/ContemporaryWall.tsx                     |  14 +-
 src/pages/collections/LivingInheritanceWall.tsx                |  15 +-
 src/styles/animations.css                                      |  18 +-
 src/styles/main.css                                            |  95 +++--
 src/styles/walls.css                                           |  15 +-
 src/tests/walls.test.tsx                                       |  30 ++
```

New Documentation Deliverables Created:
- `docs/CLOSURE_MATRIX.md` (478 reconciled rows)
- `docs/SUPERSEDED.md` (Supersession index)
- `docs/HANDOVER.md` (This document)
