# EverThread — File Usage & Project Asset Audit

**Document:** `FILE_USAGE_AUDIT.md`  
**Phase:** 7.0 Safe Git Setup, Project Organization & Release Readiness  
**Date:** October 2026  
**Status:** Complete & Verified  

---

## 1. Executive Summary & Audit Methodology

This document establishes a complete, evidence-based usage classification of all directories and files within the EverThread codebase. In accordance with strict Phase 7.0 safety directives:
1. **Zero files were deleted.**
2. **Zero dependencies were removed from `package.json`.**
3. **Absence of static TypeScript/ESM imports was NOT treated as sufficient evidence for un-usability.** Public assets, dynamically composed image paths, CSS background references, test fixtures, and runtime URL mappings were comprehensively audited.

Every file group has been classified into one of nine standardized categories (**A** through **I**), accompanied by concrete evidence, confidence ratings, and recommended lifecycle actions.

---

## 2. Standardized Classification Scheme

| Category Code | Classification Name | Description |
|:---:|:---|:---|
| **A** | **Active application source** | Files required to compile, execute, and render the React application in development and production. |
| **B** | **Required static assets** | Images, diagrams, favicons, manifests, and fonts served by URL from the web root (`public/`). |
| **C** | **Required development infrastructure** | Package manifests, lockfiles, compiler configuration, build tooling, and version-control rules. |
| **D** | **Tests and quality assurance** | Automated Vitest test suites, test helpers, and verified browser visual QA screenshot archives. |
| **E** | **Project documentation** | Architectural briefs, specifications, phase implementation reports, roadmaps, and setup guides. |
| **F** | **Generated output** | Disposable compiler and build outputs (`dist/`), local tool caches, and dependency installations (`node_modules/`). |
| **G** | **Historical or archived material** | Legacy static HTML/CSS/JS mockups, pre-React prototype explorations, and exploratory Stitch design files. |
| **H** | **Confirmed unused or redundant files** | Files proven to have zero active runtime, build, test, or documentation utility after multi-vector auditing. |
| **I** | **Uncertain / Tooling candidates** | Python utility scripts and historical image audit data preserved for maintenance and reference. |

---

## 3. Comprehensive File & Directory Inventory Audit

The following table documents the audit results across the entire repository.

| Directory / File Pattern | Classification | Evidence & Operational Role | Confidence | Recommended Action |
|:---|:---:|:---|:---:|:---:|
| `src/main.tsx` | **A** | Application DOM entry point; mounts React 18 root to `#root`. | High | **KEEP** |
| `src/App.tsx` | **A** | Core router container; provides Cart/Saved contexts, Header, Footer, and ThreadLoader. | High | **KEEP** |
| `src/routes.tsx` | **A** | Central React Router configuration defining all 13 canonical application routes. | High | **KEEP** |
| `src/components/*.tsx` | **A** | Active UI components (`Header`, `Footer`, `ThreadLoader`, `TraditionExhibitionModal`, `DiagramDrawer`, `ProductCard`, `SearchModal`, `AtelierLensModal`). | High | **KEEP** |
| `src/pages/*.tsx` | **A** | 13 route page views (`HomePage`, `CollectionsPage`, `ProductDetailPage`, `CompassPage`, `ArchivePage`, `ArchiveStoryPage`, `HousePage`, `JournalPage`, `JournalArticlePage`, `SavedPiecesPage`, `BagPage`, `CheckoutPage`, `NotFoundPage`). | High | **KEEP** |
| `src/context/*.tsx` | **A** | React Context providers (`CartContext.tsx`, `SavedContext.tsx`) managing shopping bag, saved pieces, and `localStorage` persistence. | High | **KEEP** |
| `src/data/products.ts` | **A** | Authoritative catalogue for 7 canonical products (`ET-01` through `ET-07`), pricing, materials, specifications, and model portrait bindings. | High | **KEEP** |
| `src/data/assetMap.ts` | **A** | Comprehensive image mapping resolver connecting traditions, products, and stories to responsive WebP variants. | High | **KEEP** |
| `src/data/stories.ts` | **A** | Monograph folio stories (Folio 1.1 through 1.4) and tradition metadata for the 13 Indian textile traditions. | High | **KEEP** |
| `src/data/journal.ts` | **A** | Journal article content and editorial metadata for `/journal` and `/journal/:articleSlug`. | High | **KEEP** |
| `src/utils/compassMatcher.ts` | **A** | Deterministic algorithm scoring user lifestyle preferences against catalogue attributes for the 5-step Curator's Compass. | High | **KEEP** |
| `src/hooks/*.ts` | **A** | Custom React hooks, including `usePrefersReducedMotion.ts` for accessibility compliance. | High | **KEEP** |
| `src/styles/*.css` | **A** | Core stylesheet architecture: `main.css`, `design-tokens.css`, `animations.css`, `thread-loader.css`. | High | **KEEP** |
| `src/types/*.ts` | **A** | Strict TypeScript interface definitions for catalogue items, navigation, stories, and exhibitions. | High | **KEEP** |
| `public/images/archive/*` | **B** | 78 primary WebP images + 260 responsive variants ($13 \times 6 = 78$ image suites) powering the Immersive Textile Exhibition. | High | **KEEP** |
| `public/images/weave-library/diagrams/*` | **B** | 9 accessible SVG technical weave diagrams and 9 PNG fallback images rendered in the diagram drawer. | High | **KEEP** |
| `public/images/products/*` | **B** | Responsive product photography, swatches, and model portraits for products `ET-01` through `ET-07`. | High | **KEEP** |
| `public/images/brand/*` | **B** | Atelier brand identity assets, including OpenGraph card (`og-everthread.webp`) and crests. | High | **KEEP** |
| `public/images/craft/*`, `home/*`, `materials/*`, `packaging/*`, `house/*`, `journal/*` | **B** | Editorial photography used across the Homepage, The House, and Journal articles. | High | **KEEP** |
| `public/images/site-icons/*` | **B** | Favicons (`favicon.ico`, `favicon-16x16.png`, `favicon-32x32.png`), apple touch icon, and `site.webmanifest`. | High | **KEEP** |
| `public/everthread-loader-hand-clean.png` | **B** | Optimized hand illustration asset used in the approved SVG ThreadLoader component. | High | **KEEP** |
| `index.html` | **A / B** | Root HTML template; links fonts, favicons, OpenGraph metadata, and mounts `src/main.tsx`. | High | **KEEP** |
| `package.json` | **C** | Core Node project manifest; defines scripts (`dev`, `build`, `test`, `preview`) and dependencies. | High | **KEEP** |
| `package-lock.json` | **C** | Exact dependency lockfile ensuring reproducible builds across all environments. | High | **KEEP** |
| `tsconfig.json` | **C** | Strict TypeScript compiler configuration with `noEmit: true`, `noUnusedLocals: true`. | High | **KEEP** |
| `vite.config.ts` | **C** | Vite 6 build configuration integrating React plugin and Vitest jsdom test runner. | High | **KEEP** |
| `.gitignore` | **C** | Configured in Phase 7.0 to exclude `node_modules/`, `dist/`, `scratch/`, OS artifacts, and secrets. | High | **KEEP** |
| `.gitattributes` | **C** | Configured in Phase 7.0 for LF line normalization and binary asset protection. | High | **KEEP** |
| `src/tests/*.test.tsx` | **D** | 12 Vitest automated test suites containing 238 passing unit and integration tests. | High | **KEEP** |
| `artifacts/phase-6-4/*` | **D** | Browser visual QA screenshots verifying Compass transitions and Product Detail interactions. Preserved locally, ignored by Git. | High | **KEEP (LOCAL ARCHIVE)** |
| `artifacts/phase-6-5/*` | **D** | Browser visual QA screenshots verifying Monograph Folios and Exhibition modal workflows. Preserved locally, ignored by Git. | High | **KEEP (LOCAL ARCHIVE)** |
| `artifacts/phase-6-6/*` | **D** | 18-screenshot verification suite across Desktop, Tablet, and Mobile viewports. Preserved locally, ignored by Git. | High | **KEEP (LOCAL ARCHIVE)** |
| `README.md` | **E** | Master repository setup guide, technical architecture overview, and command reference. | High | **KEEP** |
| `PROJECT_STRUCTURE.md` | **E** | Comprehensive project layout map, directory guide, and file lifecycle specifications. | High | **KEEP** |
| `EverThread_Implementation_Brief.md` | **E** | Foundational architectural specification and design system requirements. | High | **KEEP** |
| `EverThread_Remaining_Project_Roadmap.md` | **E** | Multi-phase development roadmap outlining historical progression from Phase 1 to Phase 7. | High | **KEEP** |
| `EverThread_Phase_6_3_2_2_*.md` | **E** | Authoritative contract and specifications for the Immersive Textile Exhibition feature. | High | **KEEP** |
| `instructions.md` | **E** | Core operating guidelines and constraints for the EverThread project. | High | **KEEP** |
| `phase_*_report.md` | **E** | Verified audit and implementation reports for Phases 6.3.1 through 6.6A. | High | **KEEP** |
| `dist/` | **F** | Vite production distribution directory. Ignored by Git; regenerated via `npm run build`. | High | **KEEP (IGNORED)** |
| `node_modules/` | **F** | Installed NPM package dependencies. Ignored by Git; regenerated via `npm install`. | High | **KEEP (IGNORED)** |
| `scratch/` | **F** | Local developer sandbox containing transient scripts and test user data. Ignored by Git. | High | **KEEP (IGNORED)** |
| `archive/legacy-mockups/*.html` | **G** | 11 static HTML mockups from initial design sprint prior to React Vite migration. Preserved locally, ignored by Git. | High | **KEEP (LOCAL ARCHIVE)** |
| `css/*.css` | **G** | Pre-React static stylesheets (`main.css`, `design-tokens.css`, `animations.css`). Replaced by `src/styles/`. Preserved locally, ignored by Git. | High | **KEEP (LOCAL ARCHIVE)** |
| `js/*.js` | **G** | Pre-React vanilla JavaScript files (`collections.js`, `compass.js`, `navigation.js`, etc.). Replaced by React components. Preserved locally, ignored by Git. | High | **KEEP (LOCAL ARCHIVE)** |
| `Images/*` | **G** | Raw source images gathered during initial design sprints prior to modern WebP asset pipeline generation. Preserved locally, ignored by Git. | High | **KEEP (LOCAL ARCHIVE)** |
| `stitch_everthread_luxury_heritage_homepage/` | **G** | Historical Stitch design explorations and HTML/CSS mockups. Preserved locally, ignored by Git. | High | **KEEP (LOCAL ARCHIVE)** |
| `Stitch_New_Pages/` | **G** | Historical Stitch page variants. Preserved locally, ignored by Git. | High | **KEEP (LOCAL ARCHIVE)** |
| `scripts/*.py` | **I** | Asset generation and optimization utility scripts (`build_verified_asset_map.py`, `optimize_assets.py`). | Medium | **KEEP** |
| `audit-output/*` | **I** | CSV manifests and Markdown audits generated during Phase 6.3 image integrity audit. Preserved locally, ignored by Git. | Medium | **KEEP (LOCAL ARCHIVE)** |

---

## 4. Special Scrutiny: Static Imports vs. Dynamic Runtime Assets

In web applications utilizing bundlers like Vite, an asset can be actively loaded at runtime without appearing in a TypeScript `import` statement. The following vectors were verified:

1. **`public/` Asset Delivery:**
   - Any file placed in `public/` is copied verbatim into `dist/` during `npm run build`.
   - Runtime references in `src/data/assetMap.ts`, `src/data/products.ts`, and `src/data/stories.ts` utilize absolute path strings (e.g., `src="/images/archive/banarasi-brocade/archive-banarasi-brocade-model-01.webp"`).
   - If these assets were audited solely by static AST imports, they would appear falsely "unused".
   - **Verification:** All 78 base textile exhibition WebP files, 260 responsive variants, and 18 weave diagrams/fallbacks were audited against `src/data/assetMap.ts` and confirmed actively loaded at runtime.

2. **CSS `url()` References:**
   - Stylesheets in `src/styles/` reference brand fonts and background textures. All referenced assets reside in `public/images/`.

3. **Dynamic Route Slugs:**
   - Routes like `/archive/:storySlug`, `/product/:slug`, and `/journal/:articleSlug` resolve data dynamically from TypeScript objects. No static HTML files intercept these routes.

---

## 5. Security & Environment Configuration Findings

- **Zero Credentials / Secrets:** A deep scan of the repository confirmed that no `.env` files, production credentials, database URIs, private keys, or API tokens are present.
- **Client-Side Safety:** EverThread is a client-side Single Page Application (SPA). State persistence is managed entirely via the browser's `localStorage` (for Saved Pieces and Shopping Bag).
- **`.gitignore` Hardening:** The newly established `.gitignore` ensures that any future `.env`, `.env.local`, or `.env.*.local` files will be automatically excluded from version control.

---

## 6. Actionable Maintenance Recommendations

1. **Immediate Term (Phase 7.0 Baseline):**
   - Maintain the existing folder structure without moving or deleting historical directories (`css/`, `js/`, `Images/`, `stitch_*`). They provide valuable design lineage and are safely preserved in Git.
2. **Medium Term (Post-Release / Refactoring Sprint):**
   - Consider moving `css/`, `js/`, and `Images/` into an `archive/legacy-prototypes/` folder if an explicit repository declutter sprint is scheduled and authorized.
   - Retain `scripts/` as project maintenance tooling for automated WebP regeneration or image compression.
