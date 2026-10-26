# Stage 02 Execution Plan: Data Model, Catalogue Boundaries, Routes, Search and Compatibility

**Stage:** STAGE-02  
**Lead:** Implementation Engineer  
**Date:** 2026-10-26  
**Status:** IN PROGRESS  

---

## 1. Scope and Invariants

- **In Scope:**
  - Data model and catalogue boundaries in `src/types/catalog.ts`, `src/data/products.ts`, and new `src/data/traditionalProducts.ts`.
  - Schema extension with `ProductBase`, `TraditionalProduct`, `CatalogueProduct`, `isTraditional`.
  - Extension of `ProductCategory` union (`'Gowns & Drapes' | 'Sets & Co-ords'`).
  - TR-01 through TR-07 concept specifications added with `isListed: false` and `isPurchasable: false` (no fabricated `artisanHours`, `warpDensity`, `origin`, `edition`, `leadTime`).
  - ET-02 retitle to "Ivory Hand-Spun Matka Silk Cocoon Trench" (fiber: "100% Hand-Spun Matka Raw Silk", legacy slug preserved).
  - ET-04 alt text correction in `src/data/assetMap.ts`.
  - Image provenance and credit fields added to `ResponsiveImage` in `src/data/assetMap.ts`.
  - Case-insensitive product ID/slug lookups, legacy slug aliasing.
  - Legacy Archive route redirection table (`src/data/legacyRoutes.ts`) for 9 legacy pairs to `/archive?tradition={canonicalKey}`.
  - Curatorial search enhancements: multi-token AND matching, weave-14 mapping to `/archive/the-art-of-the-drape`, listed-only product filtering, verified destination URLs.
  - Archive relations (`src/data/archiveRelations.ts`): Sozni info-only, Muga none, Banarasi and Kota Doria blocked per Decision O-7 / DEC D-25; removal of all "Acquire to Bag" buttons and add-to-bag calls from `TraditionExhibitionModal.tsx`.
  - Product detail page unlisted guard: "This piece is not currently available" with no Add to Bag for unlisted products.
  - Compass scope preserved: contemporary products only (Decision O-8 default).
  - Test debt correction for updated contracts and authoring of tests: `UT-DATA-01`, `UT-DATA-02`, `UT-COMP-01`, `UT-SEARCH-01`, `UT-ROUTE-01`, `UT-ARCH-01`, `E2E-ROUTE-04`, `E2E-SEARCH-01`, `E2E-LINK-01`.
- **Out of Scope (Strict Invariants):**
  - No visible TR shopping experience or wall routes UI (Stage 5).
  - No TR product listed or purchasable (Stage 4).
  - No approval of unapproved image assets (Decision O-6-C).
  - No Cart changes for multi-piece sets (Stage 4).
  - No Archive full visual redesign (Stage 7).
  - Zero pushes to any git remote; zero merges into `main`; zero deployments.

---

## 2. Execution Checklist Rows

| Item ID | Requirement / Finding | Planned Change | Target Files | Acceptance Criterion | Verification Method | Expected Evidence |
|---|---|---|---|---|---|---|
| `F-16` / `N-02` | Traditional product schema & catalogue separation | Add `ProductBase`, `TraditionalProduct`, `CatalogueProduct`, `isTraditional`, extend `ProductCategory` | `src/types/catalog.ts` | TR products do not require fabricated manufacturing fields | `tsc --noEmit`, `UT-DATA-01`, `UT-DATA-02` | `catalog.ts`, Vitest output |
| `N-02` / `O-11` | TR-01..TR-07 concept records | Add 7 concept specifications with `isListed: false`, `isPurchasable: false` | `src/data/traditionalProducts.ts` | 7 TR records exported; no fabricated fields; TR-06 as geometric print | `UT-DATA-02` | `traditionalProducts.ts`, Vitest output |
| `F-32` | ET-02 title, slug, and fiber correction | Retitle to "Ivory Hand-Spun Matka Silk Cocoon Trench", fiber "100% Hand-Spun Matka Raw Silk", keep legacy slug | `src/data/products.ts`, tests | Title and fiber updated; id, price, legacy route preserved | `UT-DATA-01`, `E2E-ROUTE-04` | `products.ts`, Vitest, Playwright |
| `F-11` | ET-04 alt text update | Replace "Pleated Indigo Chanderi Tunic" with "Angrakha Asymmetric Sheer Tunic — {view}" | `src/data/assetMap.ts` | Alt text matches canonical product title | `UT-DATA-01` | `assetMap.ts`, Vitest output |
| `F-42` / `N-09` | Image provenance & credit fields | Add `provenance?: ImageProvenance`, `creditText?: string` to `ResponsiveImage` | `src/data/assetMap.ts` | Types compile cleanly, fields present | `tsc --noEmit`, `UT-DATA-02` | `assetMap.ts` |
| `F-27` / `D-14` | Case-insensitive product lookups | Case-insensitive ID and slug matching; legacy slug aliases | `src/data/products.ts` | `/product/ET-01` resolves to ET-01 | `UT-DATA-01`, `E2E-ROUTE-04` | `products.ts`, Playwright |
| `F-40` / `D-19` | 9 Legacy Archive route redirects | Map legacy slugs to canonical tradition queries | `src/data/legacyRoutes.ts`, `src/App.tsx`, `src/pages/ArchiveStoryPage.tsx` | `/archive/<legacy-slug>` redirects to `/archive?tradition=<canonical-key>` | `UT-ROUTE-01`, `E2E-ROUTE-04` | `legacyRoutes.ts`, Playwright |
| `F-39` / `F-09` | Curatorial search token matching & weave-14 | Split query into tokens (AND logic); map weave-14 to `/archive/the-art-of-the-drape`; listed-only filter | `src/components/SearchModal.tsx` | "Indigo Chanderi Tunic" finds ET-04; weave-14 URL valid; results resolvable | `UT-SEARCH-01`, `E2E-SEARCH-01` | `SearchModal.tsx`, Vitest, Playwright |
| `F-05` / `O-7` / `D-25` | Archive relations & Acquire removal | Create `archiveRelations.ts` (Sozni info, Muga none, Banarasi/Kota blocked); delete Acquire button & cart calls | `src/data/archiveRelations.ts`, `src/components/TraditionExhibitionModal.tsx` | Zero Acquire buttons in Archive; plain text link for listed piece | `UT-ARCH-01`, `E2E-ARCH-03` | `TraditionExhibitionModal.tsx`, Playwright |
| `PDP Guard` | Unlisted product detail protection | Display "This piece is not currently available" and disable Add to Bag for unlisted products | `src/pages/ProductDetailPage.tsx` | Direct navigation to unlisted TR product renders not-available state | `UT-DATA-01`, Playwright | `ProductDetailPage.tsx`, Playwright |
| `O-8` | Curator's Compass scope | Compass queries contemporary products (`PRODUCTS`) only | `src/utils/compassMatcher.ts` | Matcher, tags, and tests intact and passing | `UT-COMP-01` | Vitest output |
| `F-44` | Test debt remediation & Stage 02 tests | Correct outdated assertions; add `UT-DATA-01`, `UT-DATA-02`, `UT-COMP-01`, `UT-SEARCH-01`, `UT-ROUTE-01`, `UT-ARCH-01`, `E2E-ROUTE-04`, `E2E-SEARCH-01`, `E2E-LINK-01` | `src/tests/*`, `e2e/stage02.spec.ts` | All Vitest tests pass; Playwright e2e passes | `npm test`, `npx playwright test` | Test runner logs |

---

## 3. Dependencies and Verification Gate

- **Prerequisites:** `stage-01-approved` merged into `integration/everthread-v1`, branch `stage-02-data-model`.
- **Automated Gate:**
  1. `npm test -- --run` (all Vitest unit tests pass)
  2. `npx tsc --noEmit` (TypeScript exit code 0)
  3. `npm run build` (production Vite build passes)
  4. `npx playwright test` (all e2e specs pass across desktop, tablet, mobile)
- **Exit Gate:** Complete `RESULT.md` with evidence-integrity table and §18.12 exit-criteria matrix; stop and wait for owner review.
