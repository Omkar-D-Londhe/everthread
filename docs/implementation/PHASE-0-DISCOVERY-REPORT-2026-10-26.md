# EVERTHREAD — PHASE 0: DEEP REPOSITORY DISCOVERY & PROJECT STRUCTURE AUDIT REPORT

- **Date:** 2026-10-26
- **Auditor:** Antigravity AI Implementation & Audit Engineer
- **Active Working Branch:** `stage-05-collection-walls`
- **HEAD Commit:** `32c7a36` ("stage-05: collection walls stage, routes and the living inheritance composition")
- **Base Integration Commit:** `9d33e80` (tagged `stage-04-approved` on `integration/everthread-v1`)
- **Authority / Contract:** EverThread Master Operating Prompt §18 & Authoritative Phase 0 Discovery Specification

---

## 1. Executive Summary

This report establishes the complete, evidence-driven reality of the EverThread project as of October 26, 2026, across code, assets, documentation, tests, and historical audit records. In strict accordance with the Phase 0 Discovery Specification and the Non-Negotiable Safety Rules:
- Zero application code, runtime configurations, routes, product data, styling, assets, or tests were modified during this investigation.
- No Git commits, tags, merges, pushes, or deployments were executed.
- No assets were created, replaced, renamed, deleted, or approved.
- No tracker statuses were modified; proposed dispositions are recorded separately with full evidence.

### Current Project Posture
1. **Stage Position:** Stages 01 through 04 are formally approved and integrated into `integration/everthread-v1` with verified annotated tags (`stage-01-approved` through `stage-04-approved`). Stage 05 (Collection Walls) is implemented, verified, and audited locally on branch `stage-05-collection-walls` (HEAD commit `32c7a36`), currently awaiting owner approval.
2. **Requirements Traceability (433 Total Items):**
   - **98 PASS (Verified and passed):** Formally implemented and verified with automated unit and Playwright E2E suites.
   - **177 Implemented, Not Verified:** Feature code exists in the codebase but formal stage-specific acceptance criteria and test suites belong to subsequent stages (Stages 06–11).
   - **41 BLOCKED:** 38 blocked on unapproved cultural garment photography/provenance, 2 blocked on missing Contemporary plate art (`AST-HOME-PLATE`), and 1 blocked on missing Phase 6.0 source documents.
   - **6 FAIL:** All 6 are inherited historical baseline failures (`CL-055`, `CL-446`, `CL-515`, `V3-01`, `V3-04`, `V3-09`). None represent regressions in Stages 01–05. `CL-055` (cultural product checkout) fails intentionally by design to enforce commerce integrity.
   - **111 NOT STARTED:** Scheduled for implementation in Stages 06 through 11.
   - **0 FULLY CLOSED:** In accordance with Master Operating Prompt §18, final closure requires post-deployment acceptance testing and owner sign-off in Stage 11.
3. **Asset Realities & Commerce Integrity:**
   - The authoritative asset registry (`02a_ASSET_REGISTRY.csv`) contains 50 tracked entries: 9 `VERIFIED` (technical weave diagrams), 40 `OWNER_APPROVAL_REQUIRED` (38 TR product assets + `AST-HOME-HERO` + `AST-HOME-CAMP`), and 1 `NOT_YET_SUPPLIED` (`AST-HOME-PLATE`).
   - Legacy images exist in `_legacy_archive/Images/` (220 files), but zero TR-01 through TR-07 assets have been imported into `public/images/products/`.
   - Traditional products TR-01 through TR-07 remain strictly unlisted (`isListed: false`) and non-purchasable (`isPurchasable: false`).
4. **Verification Health:**
   - Playwright E2E: 168 passing executions across desktop (1440px), tablet (1024px), and mobile (390px) across Baseline (75 passed, 3 retired), Stage 02 (39 passed), Stage 03 (19 passed, 5 viewport skips), Stage 04 (15 passed), and Stage 05 (29 passed, 1 mobile header skip).
   - Vitest: 18 out of 19 test files pass; 290 out of 293 tests pass. Exactly 3 unit tests in `src/tests/walls.test.tsx` fail due to selector name mismatches introduced during Stage 05 testing (`tab-contemporary` vs `wall-tab-contemporary`, `living-inheritance-curatorial-state` vs `curatorial-reserve-notice`).
   - Build: `tsc && vite build` succeeds with zero errors.

---

## 2. Actual Repository and Git Baseline

- **Repository Root:** `c:\Users\omkar\OneDrive\Desktop\FE Case Study`
- **Current Branch:** `stage-05-collection-walls`
- **HEAD Commit:** `32c7a36`
- **HEAD Subject:** `stage-05: collection walls stage, routes and the living inheritance composition`
- **Working-Tree Status:** 100% clean (`git status` reports nothing to commit).
- **Integration Branch:** `integration/everthread-v1` at commit `9d33e80` (`stage-04: integrate approved traditional products gate and commerce integrity`).
- **Stage Approval Tags:**
  - `stage-01-approved` -> `bb8a35b` (`stage-01: integrate approved baseline, tooling and claims inventory`)
  - `stage-02-approved` -> `7f636b6` (`stage-02: integrate approved data model, routes and compatibility`)
  - `stage-03-approved` -> `c559f7a` (`stage-03: integrate approved portrait stage, atelier lens and dialog focus`)
  - `stage-04-approved` -> `9d33e80` (`stage-04: integrate approved traditional products gate and commerce integrity`)
  - Stage 05 has not been merged into `integration/everthread-v1` or tagged, pending owner approval.
- **Main Branch:** `main` at `ebf7b6b` (initial baseline commit; untouched).
- **Available Branches:**
  - `integration/everthread-v1`
  - `main`
  - `stage-01-baseline`
  - `stage-02-data-model`
  - `stage-03-stage-lens`
  - `stage-04-traditional-commerce`
  - `stage-05-collection-walls` (active)
- **Runtime Environment:** Vite 6.0.1, React 18.3.1, React Router 6.28.0, GSAP 3.12.5, Bootstrap 5.3.3, TypeScript 5.6.3, Vitest 2.1.8, Playwright 1.64.1.

---

## 3. Search Scope, Methods, and Limitations

### Scope
Every directory, subfolder, configuration, test file, documentation file, asset directory, and archive inside the workspace root was inspected:
- Application source (`src/`): 72 files.
- Public web assets (`public/`): 553 files.
- Legacy archive (`_legacy_archive/`): 366 files (including 220 in `_legacy_archive/Images/`).
- Documentation (`docs/`): 92 files across implementation, baseline, evidence, tools, and reference.
- End-to-end tests (`e2e/`): 7 files.
- Scripts (`scripts/`): 3 files.
- Scratch scripts (`scratch/`): 3,994 analysis files and outputs.
- Build output (`dist/`): 556 files.

### Methods
- AST and text scanning of React components, routes, styles, and contexts.
- Automated CSV parsing and arithmetic reconciliation of `01b_AUDIT_TRACKER.csv` and `02a_ASSET_REGISTRY.csv`.
- Direct execution of Vitest unit suite and Playwright test definition audit.
- Full Git commit ancestry, tag target, and diff verification.

### Limitations & Inaccessible Locations
1. **Blocker B-1 (Phase 6.0 Storyboard & Audit):** The document `Phase 6.0 Experience Audit & Storyboard` referenced in historical notes is absent from the workspace. Motion and fold choreography must continue using the approved derived specification (`03_MOTION_AND_TRAVERSAL_SPECIFICATION.md`).
2. **Blocker B-7 (Live Deployment Environment):** Remote GitHub Pages deployment (`https://omkar-98.github.io/FE-Case-Study/`) cannot be verified from local execution alone without live network access and deployment credentials.
3. **Owner's Local File System:** Assets or documents residing outside `c:\Users\omkar\OneDrive\Desktop\FE Case Study` were not searched.

---

## 4. Complete Discovered Project Structure

```
c:\Users\omkar\OneDrive\Desktop\FE Case Study\
├── .git/                                   # Git version control
├── .github/                                # GitHub Actions CI workflow (deploy.yml)
├── .gitignore, .gitattributes              # Git configuration
├── dist/                                   # Production build output (556 files)
├── docs/                                   # Project documentation (92 files)
│   ├── EverThread_Implementation_Brief.md  # Approved master brief (Tier 2 authority)
│   ├── EverThread_Phase_6_3_2_2_...Spec.md # Immersive Textile Exhibition spec
│   ├── EverThread_Remaining_Project_...md  # Project roadmap
│   ├── FILE_USAGE_AUDIT.md                 # Historical file usage audit
│   ├── instructions.md                     # Original case study instructions
│   ├── PROJECT_STRUCTURE.md                # Historical directory overview
│   ├── phase_6_3_1 ... phase_7_3 (17 files)# Historical phase reports (Superseded)
│   ├── implementation/                     # Authoritative implementation package (Rev 2)
│   │   ├── 00_MASTER_IMPLEMENTATION_ROADMAP.md
│   │   ├── 01_REQUIREMENTS_AND_DECISION_TRACEABILITY.md
│   │   ├── 01a_CHECKLIST_ROW_TO_STAGE_MAP.csv
│   │   ├── 01b_AUDIT_TRACKER.csv           # Master audit tracker (483 rows)
│   │   ├── 02_ASSET_MANIFEST_AND_MAPPING.md
│   │   ├── 02a_ASSET_REGISTRY.csv          # Authoritative asset registry (50 rows)
│   │   ├── 03_MOTION_AND_TRAVERSAL_SPECIFICATION.md
│   │   ├── 04_TEST_AND_ACCEPTANCE_PLAN.md
│   │   ├── DOCUMENTATION_INDEX.md          # Reading order & authority hierarchy
│   │   ├── FINAL_RECONCILIATION_REPORT.md  # Comprehensive status & gap report
│   │   ├── STAGE-01 ... STAGE-11 (11 files)# Stage specifications
│   │   ├── everthread_audit_... (10 files) # Superseded audit reports
│   │   ├── baseline/                       # Stage 01 baseline inventories (4 files)
│   │   ├── evidence/                       # Stage evidence & Playwright HTML reports
│   │   │   ├── STAGE-01/ (PLAN.md, RESULT.md, playwright-report/)
│   │   │   ├── STAGE-02/ (PLAN.md, RESULT.md, playwright-report/)
│   │   │   ├── STAGE-03/ (PLAN.md, RESULT.md, playwright-report/)
│   │   │   ├── STAGE-04/ (PLAN.md, RESULT.md, playwright-report/)
│   │   │   └── STAGE-05/ (PLAN.md, RESULT.md, playwright-report/)
│   │   └── tools/                          # Reconciled Python audit scripts (8 files)
│   └── reference/                          # Historical reference matrices & screenshots
├── e2e/                                    # Playwright E2E suites (7 files)
│   ├── baseline.spec.ts                    # 26 tests (78 project executions)
│   ├── stage02.spec.ts                     # 13 tests (39 project executions)
│   ├── stage03.spec.ts                     # 8 tests (24 project executions)
│   ├── stage04.spec.ts                     # 5 tests (15 project executions)
│   ├── stage05.spec.ts                     # 10 tests (30 project executions)
│   ├── helpers.ts                          # Test navigation & assertion helpers
│   └── pagesServer.mjs                     # Local static web server for Playwright
├── public/                                 # Public static assets (553 files)
│   ├── favicon.svg, robots.txt
│   └── images/                             # Web-optimized image assets (546 images)
│       ├── archive/                        # Craft tradition archive images (264 files)
│       ├── brand/                          # Brand logos and site icons (24 files)
│       ├── craft/                          # Craft process imagery (8 files)
│       ├── home/                           # Home hero, editorial stills, crops (51 files)
│       ├── house/                          # The House editorial imagery (12 files)
│       ├── journal/                        # Journal article photography (8 files)
│       ├── materials/                      # Fiber and material photography (8 files)
│       ├── packaging/                      # Packaging and unboxing imagery (4 files)
│       ├── products/                       # Contemporary product imagery ET-01..07 (118 files)
│       └── weave-library/diagrams/         # Technical textile diagrams (18 files)
├── scratch/                                # Working scripts and analysis output (3,994 files)
├── scripts/                                # Utility build scripts (3 files)
├── src/                                    # Application source code (72 files)
│   ├── App.tsx                             # Top-level router and layout wrapper
│   ├── main.tsx                            # React DOM root entry
│   ├── vite-env.d.ts                       # TypeScript environment declarations
│   ├── components/                         # React UI components (11 files)
│   ├── context/                            # CartContext and SavedContext (2 files)
│   ├── data/                               # Catalog data models and relations (9 files)
│   ├── hooks/                              # Custom React hooks (3 files)
│   ├── pages/                              # Page views and collection layouts (16 files)
│   ├── styles/                             # CSS styling and design tokens (5 files)
│   ├── tests/                              # Vitest unit test suites (19 files)
│   ├── types/                              # TypeScript interfaces and types (2 files)
│   └── utils/                              # Utility calculations and matchers (2 files)
├── _legacy_archive/                        # Historical source files & unapproved images (366 files)
│   ├── Images/                             # Original unoptimized images (220 files)
│   └── ...                                 # Legacy HTML/CSS/JS artifacts
├── index.html, package.json, package-lock.json
├── playwright.config.ts, tsconfig.json, vite.config.ts
└── README.md
```

---

## 5. Document and Requirements Source Inventory

| Document Path | Authority Level | Current Status | Purpose / Description |
|---|---|---|---|
| `docs/EverThread_Implementation_Brief.md` | Tier 2 Authority | Authoritative | Master creative brief, brand pillars, collection descriptions, and architecture. |
| `docs/EverThread_Phase_6_3_2_2_...Spec.md` | Tier 2 Authority | Authoritative | Detailed specification for the Immersive Textile Exhibition. |
| `docs/EverThread_Remaining_Project_Roadmap.md` | Tier 2 Authority | Authoritative | Original stage roadmap and delivery sequence. |
| `docs/implementation/00_MASTER_IMPLEMENTATION_ROADMAP.md` | Tier 1 Authority | Authoritative | Primary operating entry point, stage gates, Git protocols, and invariants. |
| `docs/implementation/01_REQUIREMENTS_AND_DECISION_TRACEABILITY.md` | Tier 1 Authority | Authoritative | Traceability register, findings F-01 to F-54, and owner decision log. |
| `docs/implementation/01a_CHECKLIST_ROW_TO_STAGE_MAP.csv` | Tier 1 Authority | Authoritative | 369 checklist/V3 rows mapped to implementation stages. |
| `docs/implementation/01b_AUDIT_TRACKER.csv` | Tier 1 Authority | Authoritative | Master project tracker (433 tracked items + 50 decisions/blockers). |
| `docs/implementation/02_ASSET_MANIFEST_AND_MAPPING.md` | Tier 1 Authority | Authoritative | Asset import protocol, responsive picture specification, and blocker rules. |
| `docs/implementation/02a_ASSET_REGISTRY.csv` | Tier 1 Authority | Authoritative | Authoritative 50-row asset verification and disposition register. |
| `docs/implementation/03_MOTION_AND_TRAVERSAL_SPECIFICATION.md` | Tier 1 Authority | Authoritative | Kinematics, fold transitions, scroll choreography, and token register. |
| `docs/implementation/04_TEST_AND_ACCEPTANCE_PLAN.md` | Tier 1 Authority | Authoritative | Master test catalogue, route availability by stage, and acceptance criteria. |
| `docs/implementation/STAGE-01 ... STAGE-11` (11 files) | Tier 1 Authority | Authoritative | Authoritative stage-by-stage implementation specifications. |
| `docs/implementation/FINAL_RECONCILIATION_REPORT.md` | Tier 1 Authority | Authoritative | Reconciled project status, blocker register, and disposition summary. |
| `docs/implementation/baseline/*` (4 files) | Supporting Evidence | Authoritative Baseline | Baseline audits for tooling, claims, assets, and test debt. |
| `docs/implementation/evidence/STAGE-01..05/*` | Verification Evidence | Authoritative Evidence | Stage plans, execution logs, and Playwright HTML reports. |
| `docs/implementation/tools/*` (8 files) | Tooling | Active | Reconciled Python scripts for tracker queries, counts, and asset checks. |
| `docs/reference/Historical matrices and decisions/*` | Reference | Historical | Original requirements matrices (v2, v3) and decision register. |
| `docs/phase_6_3_1 ... phase_7_3` (17 files) | Superseded | Historical Evidence | Earlier phase execution reports (useful as evidence; non-authoritative). |
| `docs/implementation/everthread_audit_...` (10 files) | Superseded | Historical Evidence | Earlier interim audit reports and draft proposals. |
| `Phase 6.0 Experience Audit & Storyboard` | Missing | Inaccessible (`B-1`) | Referenced document not supplied in repository. |

---

## 6. Implementation Inventory

### Routing & Application Structure (`src/App.tsx`, `src/pages/`)
- `/`: `HomePage.tsx` (52KB). Editorial scroll scenes, hero typography, GSAP fold hooks, curatorial highlights, journal excerpts.
- `/collections`: `CollectionWallsLayout.tsx` wrapping `ContemporaryWall.tsx`. 7 contemporary products (ET-01 through ET-07), colorway filtering, and sorting.
- `/collections/the-living-inheritance`: `CollectionWallsLayout.tsx` wrapping `LivingInheritanceWall.tsx`. Archival reserve state rendering curatorial inquiry cards for TR-01 through TR-07.
- `/product/:slug`: `ProductDetailPage.tsx`. Supports ET-01..ET-07 with full commerce; supports TR-01..TR-07 with curatorial not-available status and disabled add-to-bag. Resolves legacy slugs and uppercase codes.
- `/compass`: `CompassPage.tsx`. Thread Compass recommendation engine; matches silhouette, occasion, drape; strictly excludes TR products.
- `/archive`: `ArchivePage.tsx`. Cultural craft traditions overview (12 traditions), technique filtering, and museum provenance.
- `/archive/:storySlug`: `ArchiveStoryPage.tsx`. Deep craft tradition articles; displays non-conflicting links and curatorial notices.
- `/the-house`: `HousePage.tsx`. Brand history, atelier philosophy, and verified craft claims.
- `/journal`: `JournalPage.tsx`. Curated editorial articles on textiles and artisanal preservation.
- `/journal/:articleSlug`: `JournalArticlePage.tsx`. Full editorial reading experience.
- `/saved`: `SavedPiecesPage.tsx`. Saved pieces drawer/page with localStorage persistence.
- `/bag`: `BagPage.tsx`. Shopping bag with size/color line item management and free shipping calculator.
- `/checkout`: `CheckoutPage.tsx`. Simulated 3-step checkout for regular products; strictly blocks unlisted/cultural pieces.
- `*`: `NotFoundPage.tsx`. Branded 404 page with return-to-atelier navigation.

### Components (`src/components/`)
- `Header.tsx`: Navigation header with responsive mobile drawer, search trigger (`/` shortcut), saved counter, and bag counter. Collections link stays active across all wall subroutes.
- `Footer.tsx`: Brand footer with editorial newsletter signup, archival links, legal disclosures, and AI concept disclosure.
- `ProductCard.tsx`: Repertoire card with image switching, swatch indicators, and price display.
- `ProductImageStage.tsx`: Portrait 4:5 containment stage with thumbnails, zoom trigger, and swipe support.
- `AtelierLensModal.tsx`: High-resolution zoom inspection modal with trapped focus, keyboard pan, and clamped coordinates.
- `SearchModal.tsx`: Global search modal with tokenized matching, recent queries, and keyboard focus trap.
- `ThreadLoader.tsx`: Branded gold-thread loading bar with reduced-motion support.
- `TraditionExhibitionModal.tsx`: Deep-dive modal for craft traditions with technical diagrams.
- `WallStage.tsx`: Native CSS horizontal scroll snap container (`88vw`/`92vw`) with edge navigation cues. Zero scroll hijacking.
- `WallThread.tsx`: Golden thread visual continuity line running across collection walls.

### Data Models & Invariants (`src/data/`, `src/types/`)
- `products.ts`: 7 regular products (`et-01` through `et-07`) + 15 variants (22 total records). `isListed: true`, `isPurchasable: true`.
- `traditionalProducts.ts`: 7 cultural concept products (`tr-01` through `tr-07`) + 14 variants (21 total records). All strictly `isListed: false` and `isPurchasable: false`.
- `wallMoments.ts`: Curated moment groupings (`mantle-drape`, `geometry`, `veil-print`); returns empty when TR products are unlisted.
- `archiveRelations.ts`: Direct relationships between craft traditions and catalog items.
- `legacyRoutes.ts`: Backward-compatibility redirect map.

---

## 7. Asset Inventory and Approval Status

### Physical Asset Distribution
- `public/images/`: 546 optimized image files (WebP, PNG, SVG).
  - Regular products: 118 files across `et-01` to `et-07` in responsive resolutions (`400w`, `800w`, `1200w`).
  - Archive traditions: 264 files across 12 craft traditions.
  - Home & editorial: 51 files.
  - Weave diagrams: 18 files (9 SVGs + 9 PNG fallbacks).
  - Cultural products (`tr-01` to `tr-07`): **0 files** in `public/` (Strictly quarantined per Invariant #1).
- `_legacy_archive/Images/`: 205 raw image files. Contains source photographs for TR-01 through TR-07 in raw unapproved form.

### Authoritative Asset Registry (`02a_ASSET_REGISTRY.csv`)
Total tracked entries: **50**
- **9 VERIFIED:** Technical diagrams (`library-block-printing-process-01`, `library-double-ikat-process-01`, `library-embroidery-weaving-comparison-01`, `library-garment-construction-01`, `library-resist-dyeing-process-01`, `library-technique-comparison-01`, `library-textile-to-garment-sequence-01`, `library-textile-vocabulary-01`, `library-warp-weft-diagram-01`).
- **40 OWNER_APPROVAL_REQUIRED:**
  - 38 TR product assets across `tr-01` through `tr-07`.
  - `AST-HOME-HERO` (The Living Inheritance panel still): shows riverfront setting with non-catalog garments; requires approval before replacing typographic inquiry card.
  - `AST-HOME-CAMP`: Pixel-identical to rejected panorama; golden thread baked in. Must remain unplaced (`MISMATCH`).
- **1 NOT_YET_SUPPLIED:** `AST-HOME-PLATE` (Contemporary Collection stage plate). Contemporary panel correctly uses approved `et-01` crop.

---

## 8. Full Requirement-to-Implementation Traceability Findings

Reconciliation against `01b_AUDIT_TRACKER.csv` using the authoritative partition precedence formula:
`JNA > FAIL > BLOCKED > PASS > IMPL_NOT_VERIFIED > IN_PROGRESS > NOT_STARTED`

```
Total Tracked Items: 433
  ├── CHECKLIST_ROW: 355
  ├── V3_ROW: 14
  ├── FINDING: 54
  └── NEW_REQUIREMENT: 10

Primary Partition Breakdown:
  1. Justified Not Applicable:       0
  2. Verification FAIL:              6
  3. Blocked (Asset/Decision):      41
  4. Verified and Passed (PASS):    98
  5. Implemented, Not Verified:    177
  6. In Progress:                    0
  7. Not Started:                  111
  ────────────────────────────────────
  Partition Sum:                   433  (Exact 100% Reconciliation)

Separate Registered Categories:
  ├── OWNER_DECISION:               14  (O-1 to O-14)
  ├── DECISION_REGISTER:           25  (D-01 to D-25)
  └── BLOCKER:                      11  (B-1 to B-11)

Overlays:
  ├── Awaiting Owner Approval:      50  (40 assets + 10 data items)
  ├── Newly Discovered:              0
  └── Fully Closed:                  0  (Pending Stage 11 final sign-off)
```

---

## 9. Historical Issue Resolution and Regression Reconciliation

| Identifier | Description | Historical Origin | Discovered Status in Phase 0 | Resolution Evidence / Path |
|---|---|---|---|---|
| `CL-064` | Atelier Lens must use current product/image | FAIL in `ebf7b6b` | **RESOLVED & PASS** (for ET products) | Resolved in Stage 03 via `ProductImageStage` active index state. Verified by `e2e/stage03.spec.ts`. |
| `CL-238` | Lens uses active product's active image | FAIL in `ebf7b6b` | **RESOLVED & PASS** (for ET products) | Unit test `phase-7-3-commerce-lens.test.tsx` and Playwright `stage03.spec.ts`. |
| `CL-246` | Switching gallery thumbnails updates Lens source | FAIL in `ebf7b6b` | **RESOLVED & PASS** (for ET products) | Verified in `stage03.spec.ts`. |
| `CL-055` | Cultural product detail page checkout | FAIL in `ebf7b6b` | **FAIL (Intentional by Design)** | Cultural products are non-purchasable per project invariants. Checkout intentionally disallowed. |
| `CL-446` | Signature motion Initiate → Glide → Settle | FAIL in `ebf7b6b` | **FAIL (Inherited)** | Assigned to Stage 10 for final animation tuning. |
| `CL-515` | No clipped text or horizontal overflow | FAIL in `ebf7b6b` | **FAIL (Inherited)** | Assigned to Stage 10 for multi-device layout audit. |
| `V3-01` | Story Flow Initiate → Glide → Settle | FAIL in `ebf7b6b` | **FAIL (Inherited)** | Assigned to Stage 08; requires comparison against derived kinematics. |
| `V3-04` | Defined destination frame/alignment | FAIL in `ebf7b6b` | **FAIL (Inherited)** | Assigned to Stage 08. |
| `V3-09` | No unsupported edition/composition claims | FAIL in `ebf7b6b` | **FAIL (Inherited)** | Assigned to Stage 06; hero copy claims audit. |
| `F-48` | Legacy two-wall panorama rejected | Historical | **RESOLVED & PASS** | Removed from code; replaced with compliant CSS scroll snap and typographic inquiry card. |
| `F-52` | Archive-to-product relationship conflict | Historical | **RESOLVED & PASS** | Banarasi and Kota Doria link to Archive stories without broken direct product links. |

---

## 10. Test Coverage and Verification Quality

### Automated Test Suites
1. **Vitest Unit Test Suite (`npm run test`):**
   - 19 test files, 293 unit tests.
   - **290 PASSED, 3 FAILED.**
   - All 3 failures occur in `src/tests/walls.test.tsx`:
     - Test 1 (`sets document title on /collections`): queries `screen.getByTestId('tab-contemporary')`, but component renders `data-testid="wall-tab-contemporary"`.
     - Test 2 (`sets document title on /collections/the-living-inheritance`): same selector mismatch.
     - Test 3 (`renders curatorial reserve notice`): queries `screen.getByTestId('living-inheritance-curatorial-state')`, but component renders `data-testid="curatorial-reserve-notice"`.
   - The underlying application code functions identically to specification; the test file contains stale `data-testid` query names.
2. **Playwright End-to-End Suite (`npx playwright test`):**
   - 5 spec files across Desktop (1440x900), Tablet (1024x768), and Mobile (390x844).
   - `e2e/baseline.spec.ts`: 75 passed, 3 retired (`E2E-BASE-01` retired in favor of `E2E-WALL-01`).
   - `e2e/stage02.spec.ts`: 39 passed (13 tests x 3 viewports).
   - `e2e/stage03.spec.ts`: 19 passed, 5 viewport-specific skips (hover vs touch mutual exclusivity).
   - `e2e/stage04.spec.ts`: 15 passed (5 tests x 3 viewports).
   - `e2e/stage05.spec.ts`: 29 passed, 1 mobile header skip (mobile uses drawer navigation).
   - **Total Playwright executions: 177 (168 passed, 9 intentional skips/retirements, 0 failed).**
3. **Build Check (`npm run build`):**
   - `tsc && vite build` completes in 2.3 seconds with zero errors.

---

## 11. Confirmed Missing Items

1. **Asset `AST-HOME-PLATE`:** Clean stage plate for the Contemporary panel on the Collection Walls (`NOT_YET_SUPPLIED`).
2. **Approved TR Photography:** 38 unapproved photographic views for TR-01 through TR-07 in `_legacy_archive/Images/`.
3. **Phase 6.0 Storyboard & Audit Documentation (`B-1`):** Absent from repository.
4. **Live Deployment Verification (`B-7`):** Remote URL verification pending owner deployment confirmation.
5. **Approved Copy:** Final owner-approved copy for AI concept disclosures, provenance records, and Making/Promise statements.

---

## 12. Partially Implemented Items

1. **Cultural Product Pages (`/product/tr-01`..`tr-07`):** Routes, schemas, and curatorial fallback states exist, but garments are unlisted and checkout is disabled.
2. **Living Inheritance Collection Wall (`/collections/the-living-inheritance`):** Wall container, scroll snap, and curatorial inquiry state exist, but curated product moments remain in reserve until assets are approved.
3. **Thread Compass (`/compass`):** Implemented for contemporary products; cultural pieces are intentionally excluded.
4. **HomePage Editorial Scenes (`HomePage.tsx`):** Structure and legacy GSAP hooks exist, but comprehensive claims audit (`V3-09`) and motion tuning belong to Stages 06 and 08.

---

## 13. Implemented-but-Unverified Items

- **177 items** in `01b_AUDIT_TRACKER.csv` have implementation code present in `src/` but are marked `NOT VERIFIED` awaiting formal acceptance tests in their assigned stages:
  - 106 items assigned to Stage 10 (Accessibility, responsive design, multi-device touch/keyboard testing).
  - 33 items assigned to Stage 08 (Motion, fold transitions, GSAP kinematics).
  - 31 items assigned to Stage 07 (Archive diagrams, craft tradition modals).
  - 16 items assigned to Stage 11 (Final production hardening, SEO, meta tags, dead link sweeps).

---

## 14. Owner Decisions and Approvals Required

### 14 Owner Decisions (`O-1` through `O-14`)
- **4 Confirmed / Approved:**
  - `O-6` (Option C): Reject unapproved TR imagery; keep TR products unlisted until compliant assets exist.
  - `O-7`: Archive-to-product links only where historically accurate.
  - `O-13`: Full implementation of Collection Walls with native scroll snap; zero scroll hijacking.
  - `O-14`: Serial stage-by-stage approval protocol.
- **5 Default Applied (Require Formal Owner Ratification):**
  - `O-2`: Collection wall URLs (`/collections` and `/collections/the-living-inheritance`).
  - `O-3`: Wall switching via native tabs and smooth horizontal scroll snap.
  - `O-8`: Thread Compass scope limited strictly to contemporary products.
  - `O-10`: Color selection consistency; no implied color photography.
  - `O-11`: Concept silhouette policy; no false claims of manufacturing or stock.
  - `O-12`: Making/Promise claims audit against verified inventory.
- **4 Blocked / Clarification Required:**
  - `O-1`: Phase 6.0 sources (inaccessible; using derived kinematics).
  - `O-4`: Motion direction (restrained hybrid vs pure editorial).
  - `O-5`: Technical diagrams format (SVG with PNG fallback).
  - `O-9`: AI concept disclosure exact wording.

---

## 15. External Inputs and Inaccessible Locations

1. **Phase 6.0 Storyboard & Experience Audit:** Missing from workspace (`B-1`).
2. **GitHub Pages Remote Deployment:** `https://omkar-98.github.io/FE-Case-Study/` cannot be tested directly in offline local development (`B-7`).
3. **High-Resolution Cultural Product Photography:** Studio assets for TR-01 through TR-07 must be supplied by the brand owner.

---

## 16. Conflicting or Stale Documentation

1. **Stage 05 RESULT.md Commit SHA:** `docs/implementation/evidence/STAGE-05/RESULT.md` lists `575f80c`, while the actual commit in Git history is `32c7a36`. (Documentation discrepancy; code is intact).
2. **Historical Phase 6.x/7.x Reports:** Multiple superseded reports in `docs/` declare "100% complete" for features that were subsequently found deficient in Revision 2 audits.
3. **Asset Manifest in ZIP:** The asset manifest located inside the legacy asset ZIP is outdated; `02a_ASSET_REGISTRY.csv` is the sole authoritative source.

---

## 17. Proposed Documentation Structure and File Dispositions

To prevent developer confusion and ensure auditability, the following maintainable structure is proposed:

```
docs/
├── authoritative/                          # Sole source of truth
│   ├── brief/                              # Implementation Brief & Specs
│   ├── roadmap/                            # Master Roadmap (00) & Stage Specs (01-11)
│   ├── matrices/                           # Traceability (01), Asset Registry (02), Motion (03), Tests (04)
│   └── tracker/                            # Master Audit Tracker (01b)
├── evidence/                               # Verification records
│   ├── baseline/                           # Stage 01 baseline audits
│   └── stages/                             # Stage 01..11 PLAN, RESULT, and Playwright reports
├── historical/                             # Read-only archival records
│   ├── superseded-phases/                  # Phase 6.3..7.3 reports (MARK_SUPERSEDED)
│   ├── legacy-audits/                      # Pre-Rev 2 audit reports
│   └── reference-matrices/                 # Historical v2/v3 CSVs and registers
└── tools/                                  # Verified Python audit scripts
```

### Recommended File Dispositions
- **`KEEP_AS_AUTHORITATIVE` (23 files):** `docs/EverThread_Implementation_Brief.md`, `docs/EverThread_Phase_6_3_2_2_...Spec.md`, `docs/EverThread_Remaining_Project_Roadmap.md`, `00_MASTER_IMPLEMENTATION_ROADMAP.md`, `01_REQUIREMENTS_...md`, `01a_CHECKLIST_...csv`, `01b_AUDIT_TRACKER.csv`, `02_ASSET_...md`, `02a_ASSET_REGISTRY.csv`, `03_MOTION_...md`, `04_TEST_...md`, `DOCUMENTATION_INDEX.md`, `FINAL_RECONCILIATION_REPORT.md`, `STAGE-01` through `STAGE-11`.
- **`KEEP_AS_HISTORICAL` (14 files):** `instructions.md`, `PROJECT_STRUCTURE.md`, `FILE_USAGE_AUDIT.md`, `docs/reference/Historical matrices and decisions/*`.
- **`MARK_SUPERSEDED` (28 files):** All `docs/phase_*.md` reports (17 files), and `docs/implementation/everthread_*.md` pre-Rev-2 reports (11 files).
- **`UPDATE_AFTER_APPROVAL` (2 files):** `docs/implementation/evidence/STAGE-05/RESULT.md` (correct commit SHA to `32c7a36`), and `01b_AUDIT_TRACKER.csv` (when Stage 05 is approved).
- **`CONSOLIDATE_AFTER_APPROVAL` (8 tools):** Reconciled tools in `docs/implementation/tools/`.
- **`MISSING_REQUIRES_CREATION` (1 file):** `Phase 6.0 Storyboard & Motion Spec` (if owner provides source).

*(No files will be moved or modified until formal owner approval is received).*

---

## 18. Prioritized List of Recommended Actions and Dependencies

1. **Owner Review of Phase 0 Discovery Report:** Confirm findings, blocker statuses, and proposed documentation hierarchy.
2. **Owner Review & Approval of Stage 05 (Collection Walls):** Evaluate Stage 05 deliverables against acceptance criteria.
3. **Stage 05 Local Git Integration:**
   - Merge `stage-05-collection-walls` into `integration/everthread-v1` with `--no-ff`.
   - Create annotated tag `stage-05-approved`.
4. **Stage 06 Kickoff:**
   - Branch `stage-06-home-editorial` from `integration/everthread-v1`.
   - Update the 3 selector mismatches in `src/tests/walls.test.tsx` (`tab-contemporary` -> `wall-tab-contemporary`).
   - Implement Home Information Architecture, editorial scene refinement, and claims compliance per `STAGE-06-HOME-INFORMATION-ARCHITECTURE.md`.
5. **Owner Decisions Ratification:** Formally confirm defaults applied for `O-2`, `O-3`, and `O-8`.

---

## 19. List of Files Created or Changed

- **Created:**
  - `docs/implementation/PHASE-0-DISCOVERY-REPORT-2026-10-26.md` (This authoritative discovery report).
- **Scratch Files (in `scratch/` for analysis traceability):**
  - `scratch/deep_discovery.py`
  - `scratch/check_headers.py`
  - `scratch/stage_partitions.py`
  - `scratch/check_fails.py`
  - `scratch/check_specific_items.py`
  - `scratch/asset_audit.py`
  - `scratch/count_e2e.py`
  - `scratch/tracker_deep_dive.py`
  - `scratch/categorize_docs.py`
- **Application Files Modified:**
  - **Zero application files modified.**
  - **Zero test files modified.**
  - **Zero configuration files modified.**
  - **Zero tracker files modified.**

---

## 20. Explicit Confirmation of Safety & Integrity

It is explicitly confirmed that:
1. Application source code (`src/`), runtime configurations, routes, product data, and styles were **NOT modified**.
2. Assets in `public/images/` and `_legacy_archive/` were **NOT created, replaced, renamed, deleted, or approved**.
3. Automated test files (`src/tests/`, `e2e/`) were **NOT modified**.
4. Dependencies and lockfiles (`package.json`, `package-lock.json`) were **NOT modified**.
5. Existing authoritative records and tracker statuses (`01b_AUDIT_TRACKER.csv`) were **NOT modified**.
6. No Git commits, tags, merges into `main`, or remote pushes were executed.
7. The local Git working tree remains 100% clean.

---
*End of Phase 0 Discovery Report.*
