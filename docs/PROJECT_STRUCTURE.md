# EverThread — Project Structure & Architectural Map

**Document:** `PROJECT_STRUCTURE.md`  
**Phase:** 7.0 Safe Git Setup, Project Organization & Release Readiness  
**Date:** October 2026  
**Status:** Authoritative Architectural Reference  

---

## 1. Directory Tree Overview

```text
FE Case Study/
├── .git/                                # Git version control database (main branch)
├── .gitattributes                       # Line ending and binary asset Git attributes
├── .gitignore                           # Git ignore rules for node_modules, dist, scratch, etc.
├── .github/                             # CI/CD & AUTOMATION WORKFLOWS
│   └── workflows/                       # GitHub Actions workflows
│       └── deploy.yml                   # Automated GitHub Pages build & deployment pipeline
│
├── src/                                 # ACTIVE APPLICATION SOURCE CODE
│   ├── components/                      # Reusable React UI components
│   │   ├── AtelierLensModal.tsx         # Detailed inspection modal for craft techniques
│   │   ├── DiagramDrawer.tsx            # Slide-out drawer displaying technical weave diagrams
│   │   ├── Footer.tsx                   # Global atelier footer with newsletter, legal, & sitemap
│   │   ├── Header.tsx                   # Global brand header with bag/saved badges & nav links
│   │   ├── ProductCard.tsx              # Reusable product grid card with quick-view and pricing
│   │   ├── SearchModal.tsx              # Full-screen modal for global catalogue & archive search
│   │   ├── ThreadLoader.tsx             # Approved branded SVG luxury loader animation
│   │   └── TraditionExhibitionModal.tsx # Immersive 6-plate textile exhibition viewer
│   ├── context/                         # Global React state context providers
│   │   ├── CartContext.tsx              # Shopping bag state, quantity math, localStorage sync
│   │   └── SavedContext.tsx             # Saved pieces bookmarking and localStorage sync
│   ├── data/                            # Authoritative data stores and asset maps
│   │   ├── assetCatalog.json            # Machine-readable inventory of all exhibition assets
│   │   ├── assetMap.ts                  # Resolvers connecting items to responsive WebP variants
│   │   ├── journal.ts                   # Editorial journal stories and author metadata
│   │   ├── products.ts                  # 7 canonical products (ET-01 to ET-07) and specifications
│   │   └── stories.ts                   # Monograph folios and 13 Indian textile traditions
│   ├── hooks/                           # Custom React lifecycle and DOM hooks
│   │   └── usePrefersReducedMotion.ts   # Accessibility hook detecting OS motion preferences
│   ├── pages/                           # 13 canonical route page components
│   │   ├── ArchivePage.tsx              # Cultural Archive overview & Weave Library grid
│   │   ├── ArchiveStoryPage.tsx         # In-depth monograph folio editorial stories
│   │   ├── BagPage.tsx                  # Shopping bag view with order summary
│   │   ├── CheckoutPage.tsx             # Concierge luxury checkout simulation
│   │   ├── CollectionsPage.tsx          # Master catalogue of 7 heirloom garments
│   │   ├── CompassPage.tsx              # 5-step Curator's Compass consultation
│   │   ├── HomePage.tsx                 # Hero entrance, craft vignettes, atelier narrative
│   │   ├── HousePage.tsx                # Heritage, philosophy, and artisan guild manifesto
│   │   ├── JournalArticlePage.tsx       # Individual editorial journal article view
│   │   ├── JournalPage.tsx              # Index of cultural and craft publications
│   │   ├── NotFoundPage.tsx             # Accessible 404 plinth with guided recovery links
│   │   ├── ProductDetailPage.tsx        # Cross-dissolve gallery, swatches, sizing, spec accordions
│   │   └── SavedPiecesPage.tsx          # Curated bookmark gallery
│   ├── styles/                          # CSS stylesheets and design tokens
│   │   ├── animations.css               # Keyframes, transitions, and reduced-motion overrides
│   │   ├── design-tokens.css            # Atelier color palette, typography scales, spacing
│   │   ├── main.css                     # Global reset, typography, layout, Bootstrap overrides
│   │   └── thread-loader.css            # Keyframe animations for the thread drawing entrance
│   ├── tests/                           # Vitest automated test suites (238 passing tests)
│   │   ├── asset-binding.test.tsx       # Image asset integrity and portrait binding tests
│   │   ├── checkout.test.tsx            # Checkout form validation, empty bag defense, totals
│   │   ├── collections.test.tsx         # Catalogue ordering, filtering, sorting, price display
│   │   ├── compass.test.tsx             # Recommendation scoring, stepper logic, animation
│   │   ├── data-state.test.tsx          # LocalStorage persistence, bag/saved synchronization
│   │   ├── editorial-archive.test.tsx   # Folio stories, diagram metadata, deep-linking
│   │   ├── foundation.test.tsx          # Route resolution, shell layout, navigation smoke tests
│   │   ├── motion-homepage.test.tsx     # Hero entrance, GSAP motion, reduced-motion overrides
│   │   ├── product-detail.test.tsx      # Gallery cross-dissolve, accordions, size selectors
│   │   ├── saved-and-bag.test.tsx       # State management, variant aggregation, badges
│   │   ├── thread-loader.test.tsx       # SVG stroke animation, timer fallback, dismiss behavior
│   │   └── tradition-exhibition.test.tsx# 13 traditions, 6 image roles, modal interactions
│   ├── types/                           # Strict TypeScript interfaces and type definitions
│   │   ├── catalog.ts                   # Product, swatch, size, and tradition types
│   │   └── index.ts                     # Navigation, route, and shared interface contracts
│   ├── utils/                           # Core algorithmic utilities
│   │   └── compassMatcher.ts            # Deterministic scoring algorithm for the Curator's Compass
│   ├── App.tsx                          # App shell, context wrappers, global layout
│   ├── main.tsx                         # Client application entry point
│   └── routes.tsx                       # React Router v6 route configuration
│
├── public/                              # REQUIRED STATIC ASSETS (Served from web root)
│   ├── images/                          # Production WebP media and diagram SVGs
│   │   ├── archive/                     # 78 WebP base images + 260 responsive variants
│   │   ├── brand/                       # Atelier logo, OpenGraph banner, crests
│   │   ├── craft/                       # Artisan weaving, block printing, and loom imagery
│   │   ├── home/                        # Hero editorial imagery and mood textures
│   │   ├── house/                       # Atelier workshop and artisan atelier portraits
│   │   ├── journal/                     # Editorial article header and inline photography
│   │   ├── materials/                   # Raw fiber, mulberry silk, and organic dye stills
│   │   ├── packaging/                   # Presentation box and sustainable ribbon imagery
│   │   ├── products/                    # Product imagery, swatches, and model portraits
│   │   ├── site-icons/                  # Favicons, Apple touch icon, webmanifest
│   │   └── weave-library/diagrams/      # 9 technical SVG diagrams + 9 PNG fallbacks
│   ├── 404.html                         # GitHub Pages SPA deep-link redirect fallback
│   ├── everthread-loader-hand-clean.png # Approved artisan hand illustration for loader
│   ├── everthread-loader-hand.png       # Original raw hand illustration
│   └── favicon.ico                      # Root fallback favicon
│
├── scripts/                             # ASSET PROCESSING & BUILD UTILITIES
│   ├── build_verified_asset_map.py      # Python script generating verified asset maps
│   ├── generate_asset_map.py            # Utility script for mapping responsive image variants
│   └── optimize_assets.py               # Image compression and WebP conversion script
│
├── _legacy_archive/                     # CONSOLIDATED HISTORICAL ARCHIVE (Local disk only, Git-ignored, 453 MB)
│   ├── Images/                          # Raw pre-conversion PNGs (378 MB - replaced by public/images)
│   ├── audit-output/                    # Phase 6.3 image audit manifests & contact sheets (31.6 MB)
│   ├── artifacts/                       # QA browser visual screenshot archives (30.1 MB)
│   ├── stitch_everthread_.../           # Historical Stitch design homepage prototype (6.2 MB)
│   ├── Stitch_New_Pages/                # Historical Stitch variant prototypes (6.4 MB)
│   ├── archive/legacy-mockups/          # 11 static pre-React HTML mockups (0.24 MB)
│   ├── css/                             # Static pre-React stylesheets (0.03 MB)
│   └── js/                              # Static pre-React vanilla JS scripts (0.07 MB)
│
├── dist/                                # GENERATED PRODUCTION BUILD (Git-ignored)
│   ├── assets/                          # Bundled JS and CSS chunks
│   ├── images/                          # Copied public static images
│   └── index.html                       # Compiled HTML entry point
│
├── node_modules/                        # INSTALLED NPM DEPENDENCIES (Git-ignored)
├── scratch/                             # TRANSIENT SCRIPTS & TEST ARTIFACTS (Git-ignored)
│
├── index.html                           # Root HTML template
├── package.json                         # Project manifest & dependency declarations
├── package-lock.json                    # Exact dependency lockfile
├── tsconfig.json                        # TypeScript compiler options
├── vite.config.ts                       # Vite 6 bundler and test runner configuration
├── docs/                                # PROJECT DOCUMENTATION & AUDIT REPORTS
│   ├── PROJECT_STRUCTURE.md             # This architectural document
│   ├── FILE_USAGE_AUDIT.md              # Comprehensive asset usage and classification audit
│   ├── phase_7_0_release_readiness_report.md # Release readiness report
│   ├── EverThread_Implementation_Brief.md    # Initial design and architectural brief
│   ├── EverThread_Remaining_Project_Roadmap.md # Multi-phase development roadmap
│   └── phase_*_report.md                # Verified phase audit and implementation reports
│
├── README.md                            # Primary project documentation & quick start
├── index.html                           # Root HTML template
├── package.json                         # Project manifest & dependency declarations
├── package-lock.json                    # Exact dependency lockfile
├── tsconfig.json                        # TypeScript compiler options
└── vite.config.ts                       # Vite 6 bundler and test runner configuration
```

---

## 2. Core Application Entry Points & Execution Flow

1. **HTML Document Entry:** `index.html`  
   Configures document title, character encoding, viewport boundaries, OpenGraph metadata, font preconnects (`Playfair Display` and `Hanken Grotesk`), Material Symbols font, and links `/images/site-icons/favicon.ico`. It provides `<div id="root"></div>` and mounts `src/main.tsx` via `<script type="module">`.

2. **React DOM Initialization:** `src/main.tsx`  
   Retrieves `#root` from the DOM, initializes the React 18 concurrent root (`createRoot`), and mounts `<App />` within `React.StrictMode`.

3. **Application Shell & Providers:** `src/App.tsx`  
   Wraps the application in:
   - `<BrowserRouter>` for HTML5 client-side routing.
   - `<SavedProvider>` for bookmark state synchronization.
   - `<CartProvider>` for shopping bag state and checkout calculations.
   - Global `<Header />` with brand crest, navigation links, and dynamic badge counts.
   - `<ThreadLoader />` which coordinates the first-load luxury animated entrance.
   - Global `<Footer />` containing atelier information and legal credentials.

4. **Routing Engine:** `src/routes.tsx`  
   Registers 13 declarative routes using React Router v6:
   - `/` $\rightarrow$ `HomePage`
   - `/collections` $\rightarrow$ `CollectionsPage`
   - `/product/:slug` $\rightarrow$ `ProductDetailPage`
   - `/compass` $\rightarrow$ `CompassPage`
   - `/archive` $\rightarrow$ `ArchivePage`
   - `/archive/:storySlug` $\rightarrow$ `ArchiveStoryPage`
   - `/the-house` $\rightarrow$ `HousePage`
   - `/journal` $\rightarrow$ `JournalPage`
   - `/journal/:articleSlug` $\rightarrow$ `JournalArticlePage`
   - `/saved` $\rightarrow$ `SavedPiecesPage`
   - `/bag` $\rightarrow$ `BagPage`
   - `/checkout` $\rightarrow$ `CheckoutPage`
   - `*` $\rightarrow$ `NotFoundPage`

---

## 3. Asset Architecture: `src/` Bundled Code vs. `public/` Static Media

Understanding the separation between `src/` and `public/` is critical for maintaining EverThread:

| Property | `src/` Code & Assets | `public/` Static Assets |
|:---|:---|:---|
| **Location** | `src/components/`, `src/styles/`, etc. | `public/images/`, `public/favicon.ico` |
| **Build Processing** | Analyzed, bundled, minified, and hashed by Rollup/Vite. | Copied verbatim into `dist/` without file modification or hashing. |
| **Referencing Syntax** | Standard ESM imports: `import styles from './styles.css'`. | Absolute URL path strings: `<img src="/images/products/..." />`. |
| **Cache Invalidation** | Content hashing (`index-CouFP1BX.js`). | Standard HTTP caching headers or query string cache busters. |
| **Primary Contents** | TypeScript components, pages, hooks, tests, core CSS tokens. | Responsive WebP imagery (78 traditions, 260 variants), SVG diagrams, favicons. |

---

## 4. State Management & Persistence Architecture

EverThread employs lightweight, reactive state persistence without external heavy state libraries:

1. **`SavedContext` (`src/context/SavedContext.tsx`):**
   - Manages the user's bookmarked heirloom garments.
   - Persists state across browser reloads using `localStorage.getItem('everthread_saved')`.
   - Synchronizes item counts immediately with the Header bookmark icon badge.

2. **`CartContext` (`src/context/CartContext.tsx`):**
   - Manages shopping bag items, aggregating identical product/size/color variants.
   - Computes subtotal, luxury packaging options, and shipping calculations.
   - Persists state in `localStorage.getItem('everthread_bag')`.
   - Enforces empty-bag checkout protection (redirecting unauthorized checkout attempts).

---

## 5. Automated Test Suite Organization

EverThread features a comprehensive, regression-tested Vitest test suite organized inside `src/tests/`:

- Total Suites: **12 test suites**
- Total Automated Tests: **238 tests**
- Execution Command: `npm test -- --run`
- Environment: `jsdom` with `@testing-library/react` and `@testing-library/jest-dom`

### Test Suite Map:
1. `asset-binding.test.tsx` (8 tests): Validates model portrait bindings (`ET-03`, `ET-04`) and WebP path resolution.
2. `thread-loader.test.tsx` (7 tests): Validates SVG animation triggers, timeout fallbacks, and accessibility dismissal.
3. `data-state.test.tsx` (12 tests): Validates `localStorage` synchronization and state persistence across context boundaries.
4. `tradition-exhibition.test.tsx` (19 tests): Validates the 6-plate exhibition modal, thumbnail strip, and tradition switching across all 13 traditions.
5. `compass.test.tsx` (24 tests): Validates 5-step stepper navigation, direction-aware slide animations, and deterministic match logic.
6. `checkout.test.tsx` (13 tests): Validates concierge checkout form fields, input validation, order calculation, and empty-bag guards.
7. `saved-and-bag.test.tsx` (19 tests): Validates add/remove actions, quantity modifications, variant aggregation, and badge counters.
8. `product-detail.test.tsx` (26 tests): Validates 7 product routes, 280ms cross-dissolve gallery, swatches, and specification accordions.
9. `editorial-archive.test.tsx` (17 tests): Validates cultural archive folios, 9 diagram descriptions, PNG fallbacks, and deep-link query navigation.
10. `collections.test.tsx` (35 tests): Validates catalogue sorting, filter tags, default ordering (`ET-01` to `ET-07`), and INR pricing.
11. `foundation.test.tsx` (17 tests): Validates shell layout, header/footer links, 404 recovery plinths, and baseline routing.
12. `motion-homepage.test.tsx` (41 tests): Validates hero typography, GSAP animations, reduced-motion overrides, and interactive vignettes.

---

## 6. How to Identify Production vs. Development Files

- **Required for Production Build:**
  - Files inside `src/` (excluding `src/tests/`).
  - Files inside `public/`.
  - `index.html`, `package.json`, `tsconfig.json`, `vite.config.ts`.
- **Development & Verification Only:**
  - `src/tests/` (Vitest suites).
  - `artifacts/` (Visual QA screenshots).
  - `scripts/` (Utility scripts for asset generation).
  - `audit-output/` (Audit reports from Phase 6.3).
  - `scratch/` (Developer scratchpad; ignored by Git).
- **Historical Lineage & Reference (Local Archive):**
  - `_legacy_archive/` (contains `Images/`, `audit-output/`, `artifacts/`, `archive/`, `css/`, `js/`, `stitch_*`, `Stitch_New_Pages/`).
  - These files total 453 MB and are safely preserved locally on disk for design provenance, but are excluded from Git to keep the repository lightweight (under 90 MB).

---

## 7. Project Hygiene & Long-Term Maintenance Rules

1. **Always run verification checks before committing:**
   - `npx tsc --noEmit` (ensure 0 TypeScript errors).
   - `npm test -- --run` (ensure 238 passing tests).
   - `npm run build` (ensure clean production bundling).
2. **Never modify canonical product data or tradition identifiers without cross-cutting updates:**
   - Products `ET-01` through `ET-07` and tradition slugs (including legacy slugs `kutch-ari-embroidery` and `chanderi-handloom`) are contract invariants.
3. **Keep `scratch/` and `dist/` out of version control:**
   - The established `.gitignore` automatically prevents temporary files from polluting Git history.
