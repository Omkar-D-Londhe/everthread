# EverThread — Contemporary Heritage Luxury Atelier

> *"An heirloom, not a trend. Every thread carries a story."*

EverThread is an editorial luxury fashion web application that bridges historic Indian textile traditions with contemporary garment architecture. Designed as a digital atelier, the platform invites patrons to discover artisanal provenance, explore curated garment collections, consult an interactive lifestyle recommendation engine, and inspect heritage weaving techniques through high-resolution cultural archives.

---

## 1. Project Overview

EverThread combines high-clarity ecommerce functionality with the editorial rhythm and typographic restraint of a luxury monograph. The user journey is structured around the narrative spine: **Thread → Textile → Craft → Garment → Story**.

### Major User-Facing Experiences
- **Editorial Homepage (`/`):** Features the signature entrance loader, hero narrative, Highlights plinths, two-wall preview, and condensed Making & Promise craft homage.
- **Two Collection Walls (`/collections` & `/collections/the-living-inheritance`):**
  - **The Contemporary Collection (`/collections`):** Seven canonical heirloom pieces (`ET-01` through `ET-07`) featuring pure handloom Matka silk, Pashmina wool, and Mulberry silks with concrete USD pricing and commercial sizing.
  - **The Living Inheritance Wall (`/collections/the-living-inheritance`):** Seven traditional pieces (`TR-01` through `TR-07`) showcasing archival craft traditions (Banarasi brocade, Jamdani, Patola, Kanchipuram, Chanderi, Ajrakh, and Bandhani).
  - **Collection-Switching Motion:** Native horizontal scroll-snap stage track with a calibrated dynamic SVG thread connecting the collections, visible next-wall peek, and labelled tab navigation.
- **Portrait-Aware Product Detail Page (`/product/:productId`):** High-density portrait imagery, interactive swatch selection, multi-piece set sizing, specification accordions, and the **Atelier Loupe Lens** (hover loupe on desktop, tap modal on mobile).
- **Curator's Compass (`/compass`):** A 3-step guided lifestyle consultation stepper (Fabric & Fiber → Silhouette & Occasion → Regional Palette) driven by a deterministic recommendation engine (`compassMatcher.ts`) recommending exclusively Contemporary pieces.
- **Cultural Archive & Exhibition Modal (`/archive` & `/archive?tradition=:slug`):** Discipline-grouped asymmetric layout covering 13 Indian textile traditions, a 9-diagram horizontal technique strip with deep-linking, deep living-loom stories (`/archive/:traditionKey`), and an immersive 6-plate textile exhibition modal with technical weave diagrams.
- **The House (`/house`):** A 6-section brand philosophy journey: Hero, Foundational Creed, Material Integrity, Conceptual Design Studies (Paris, New Delhi, Kyoto, Milan), Bespoke Concierge, and Transparency Notice.
- **Curatorial Monographs & Journal (`/journal` & `/journal/:articleId`):** Academic curatorial essays, historical monograph profiles, and scholarly bibliography sources.
- **Commerce Flow (`/saved`, `/bag`, `/checkout`):** LocalStorage-backed Saved Pieces wishlist, shopping bag with composite variant keys and quantity controls, and a demo concierge checkout with empty-bag redirection defense.

### Catalog Boundaries & Concept Product Disclosure
The application enforces strict architectural separation between two product domains:
1. **Contemporary Collection (`ET-01`–`ET-07`):** Physical fashion garments with verified composition specifications and pricing in USD.
2. **Traditional Collection (`TR-01`–`TR-07`):** AI-generated conceptual fashion studies demonstrating archival craft techniques. They are commercially purchasable concept pieces (`isListed: true`).

> [!IMPORTANT]
> **Approved Canonical Concept Disclosure (`B-4`, `D-21`):**
> *"Traditional products shown are AI-generated conceptual designs demonstrating archival craft techniques."*
> This canonical disclosure is wired prominently beneath the image stage on TR product detail pages, across The Living Inheritance collection wall header, and as the subtitle for Traditional results in search.

*Editorial Safeguard (`B-5`):* Global ateliers on The House page are framed strictly as conceptual design studies (*"Paris Design Study"*, *"New Delhi Guild Study"*, etc.), and Generational Inlays are framed as engineering tailoring specifications. They do not represent physical brick-and-mortar partnerships or operational supply chains.

---

## 2. Prerequisites

- **Node.js:** Node.js LTS `v18.x`, `v20.x`, or `v22.x` is required. (Vite 6 and TypeScript 5.6 require Node.js 18+).
- **Package Manager:** `npm` (`v9.x` or `v10.x`) matching the bundled `package-lock.json`.
- **Browser:** Any modern evergreen browser (Google Chrome, Mozilla Firefox, Apple Safari, Microsoft Edge).
- **Optional (for E2E browser tests):** Playwright browser binaries (Chromium).

---

## 3. Clone and Install

Clone the repository and install dependencies using the verified `package-lock.json`:

### Windows PowerShell
```powershell
# Clone the repository
git clone https://github.com/Omkar-D-Londhe/everthread.git

# Enter project directory
cd everthread

# Install exact dependencies
npm install
```

### macOS / Linux
```bash
# Clone the repository
git clone https://github.com/Omkar-D-Londhe/everthread.git

# Enter project directory
cd everthread

# Install exact dependencies
npm install
```

> [!TIP]
> To ensure exact dependency tree reproduction, you can use `npm ci` instead of `npm install`. Do not delete `package-lock.json`.

---

## 4. Environment and Configuration

EverThread is completely self-contained:
- **No `.env` file is required.**
- **No external API keys, secrets, or cloud database credentials are needed.**
- The application runs locally out of the box with zero runtime configuration. All product catalogs, tradition folios, and motion tokens are bundled as static TypeScript data structures.

---

## 5. Run the Application Locally

Launch the local development server:

```bash
npm run dev
```

- **Local URL:** [`http://localhost:5173/everthread/`](http://localhost:5173/everthread/)
- **Automatic Redirect:** Vite's development middleware automatically redirects requests from bare `http://localhost:5173/` directly to `http://localhost:5173/everthread/`.
- **Hot Module Replacement (HMR):** Active by default for React components and CSS stylesheets.
- **Stopping the Server:** Press `Ctrl + C` in your terminal.

### Custom Port or Network Access
```bash
# Run on a custom port
npm run dev -- --port 3000

# Expose to local network (for mobile device testing on the same Wi-Fi)
npm run dev -- --host
```

---

## 6. Build and Preview

### Production Compilation
Compile TypeScript and build the optimized production bundle with Vite:

```bash
npm run build
```

- **Internal Command:** Runs `tsc && vite build`.
- **Output Directory:** `dist/`.
- **Expected Artifacts:**
  - `dist/index.html` (SPA entry point with asset path rewriter)
  - `dist/assets/index-[hash].js` (Application bundle)
  - `dist/assets/index-[hash].css` (Compiled styles and design tokens)
- **Success Criteria:** Process exits with code `0`. Any TypeScript compiler error will halt the build and output the exact file and line number.

### Local Production Preview
Preview the production build locally under production subpath routing:

```bash
npm run preview
```

- **Preview URL:** [`http://localhost:4173/everthread/`](http://localhost:4173/everthread/)

---

## 7. Type Checking, Linting, and Tests

### 7.1 TypeScript Type Checking
Run strict TypeScript compilation without emitting output files:

```bash
npx tsc --noEmit
```
- **Expected Result:** Clean exit with code `0` and **0 errors**.

### 7.2 Unit and Component Tests (Vitest)
EverThread uses Vitest with jsdom and `@testing-library/react`:

```bash
# Run the full Vitest suite (355 tests)
npm test

# Run a single targeted test suite (e.g. collection walls)
npx vitest run src/tests/walls.test.tsx

# Run tests in interactive watch mode
npx vitest
```
- **Full Suite Coverage:** **24 test files, 355 / 355 tests passing** (0 failed, 0 skipped).
- **Test Categories:** Data schemas, cart models, product stages, Loupe lens math, search algorithms, tradition exhibitions, editorial claims, motion folds, thread continuity, and collection walls.

### 7.3 End-to-End Browser Tests (Playwright)

#### First-Time Playwright Setup
If running browser tests for the first time, install the required Chromium browser binary:
```bash
npx playwright install chromium
```

#### Verified Stage Acceptance Tests
Run the dedicated Stage 10/11 acceptance suite and Curator's Compass browser suite:

```bash
npx playwright test e2e/stage10-acceptance.spec.ts e2e/compass.spec.ts
```

- **Total Tests:** **21 tests passing** across Desktop (`1440px`), Tablet (`1024px`), and Mobile (`390px`).
- **Verifications:**
  - `E2E-WALL-THREAD`: Collection-switching moving thread visibility, easing, and reduced-motion instant snap.
  - `E2E-RESP-01`: Responsive layout overflow sweep from 320px to 1440px with `overflow-x: visible` unmasked (0 overflowing elements).
  - `E2E-A11Y-03`: Focus ring contrast ratio ≥ 3:1 using Deep Oxblood (`#49232D`, 12.8:1 on ivory) and Warm Ivory on dark surfaces.
  - `E2E-A11Y-NEWSLETTER`: Accessible form labeling and ARIA attributes in footer.
  - `E2E-A11Y-ICONS`: Google Material Symbols ligature font fallback and decorative `aria-hidden="true"` protection.
  - `E2E-LOAD-01`: ThreadLoader timing invariance (strictly 1900 ms active / 400 ms fade).
  - `E2E-COMP-01`: Curator's Compass determinism, step navigation, and strict zero-TR recommendation boundary.

#### Note on Full Legacy Playwright Suite (`npm run test:e2e`)
Running `npm run test:e2e` executes all 12 spec files in `e2e/`. Note that legacy tests written during early development (`stage02.spec.ts`, `stage04.spec.ts`, `stage05.spec.ts`) contain historical assertions expecting Traditional products to be unlisted (`isListed: false`). These tests fail because TR products were subsequently made commercially purchasable concept pieces (`isListed: true`) under approved **Owner Decisions B-4 and O-7**.

---

## 8. Troubleshooting

| Symptom | Likely Cause | Recommended Resolution |
|---|---|---|
| `Port 5173 is in use` | Another Vite process is running | Run `npm run dev -- --port 5174` or stop the running process. |
| `Cannot find module ...` on install | Stale package cache or interrupted network | Run `npm ci` to cleanly synchronize against `package-lock.json`. Do not delete the lockfile. |
| Playwright tests fail with `Executable doesn't exist` | Playwright Chromium binary not installed | Run `npx playwright install chromium`. |
| Deep link refresh returns 404 on local preview | Subpath mismatch or missing base | Always access the preview at `http://localhost:4173/everthread/`. |
| Material Symbols render as text strings (e.g. "menu") | External Google Fonts CDN blocked | The application includes an automatic CSS fallback hiding ligature text via `.icons-ready` class in `index.html` and `main.css`. |

---

## 9. Project Structure

```text
everthread/
├── index.html                   # HTML shell with font-loading and icon fallback defense
├── vite.config.ts               # Vite bundler configuration with /everthread/ base and path rewrites
├── tsconfig.json                # Strict TypeScript configuration
├── package.json                 # Dependencies and npm scripts
├── public/                      # Static assets
│   ├── images/products/         # High-density portrait & detail photography (ET & TR products)
│   ├── images/home/             # Campaign assets and plinth plates
│   └── 404.html                 # SPA deep-linking fallback handler for static hosting
├── src/
│   ├── components/              # Shared UI components (Header, Footer, Modals, Folds, Loupe)
│   │   └── walls/               # WallStage, WallTrack, WallThread SVG animation components
│   ├── config/                  # Design tokens, motion parameters (MOTION_TOKENS per O-4)
│   ├── context/                 # CartContext and SavedContext state providers
│   ├── data/                    # Authoritative catalog and editorial datasets
│   │   ├── products.ts          # Contemporary Collection products (ET-01 to ET-07)
│   │   ├── traditionalProducts.ts # Traditional Collection products (TR-01 to TR-07) & B-4 disclosure
│   │   ├── assetMap.ts          # Responsive image paths and srcset mappings (227 unique paths)
│   │   ├── archiveDisciplines.ts# Cultural Archive 4-discipline taxonomy
│   │   ├── archiveRelations.ts  # Tradition-to-Product inspiration relations
│   │   └── journal.ts           # Curatorial monographs, essays, and bibliographies
│   ├── pages/                   # Route views (HomePage, Collections, PDP, Compass, House, Archive)
│   │   └── collections/         # ContemporaryWall, LivingInheritanceWall, CollectionWallsLayout
│   ├── styles/                  # Luxury CSS architecture (main.css, walls.css, animations.css)
│   └── tests/                   # Vitest unit and integration suites (355 tests)
├── e2e/                         # Playwright E2E browser test suites
│   ├── stage10-acceptance.spec.ts # Stage 10/11 accessibility, motion, and overflow audit
│   └── compass.spec.ts          # Curator's Compass determinism & zero-TR test suite
└── docs/                        # Specifications, registers, and audit deliverables
    ├── CLOSURE_MATRIX.md        # Authoritative closure matrix reconciling all 483 tracked items
    ├── SUPERSEDED.md            # Supersession register indexing 15 historical documents
    ├── HANDOVER.md              # Complete architectural and operational handover documentation
    ├── authoritative/           # Revision 2 specifications, asset manifests, and traceability
    └── implementation/          # Audit trackers (01b_AUDIT_TRACKER.csv) and issue registers
```

---

## 10. Current Status, Limitations, and Gated Actions

EverThread has completed all planned development stages through **Stage 11 — Audit Closure, Documentation Supersession, and Handover**.

### Gated Items Awaiting Owner Action
1. **`F-04` (Exhibition 5-Step Opening Choreography):**
   - **Current Status:** `OPEN | PENDING MANUAL OWNER REVIEW`
   - **Technical Fact:** Implemented and tested in code (`useExhibitionOpening.ts`, `E2E-MOTION-05` passing). Formally retained as **OPEN** awaiting manual owner inspection of screen recordings or browser playback.
2. **`F-24` / `B-7` (Live GitHub Pages Deployment):**
   - **Current Status:** `UNVERIFIED / BLOCKED`
   - **Technical Fact:** Local deployment build and Pages-style static server pass. Live URL verification is owner-gated: requires merging to `main` and manually verifying the 8 live routes per `MAN-LIVE`. Never claimed as verified from CI alone.

### Assessment-Specific Owner Risk Acceptances & Deferred Items
- **`DEC D-18` / `F-46` (Edition Claims Risk Acceptance):** Existing Contemporary (`ET-01`–`ET-07`) edition claims (e.g. *"Edition of 12"*) are retained as-is for assessment submission without claiming factual verification. TR products carry strictly zero edition claims.
- **`O-6-C` (Existing Image Only Policy):** Best-fitting existing imagery is retained for `TR-01`, `TR-03`, and `TR-07`. No new image generation was commissioned.
- **`F-17` (Newest Sort):** Deferred by owner decision.
- **`F-42` (Visible Credit Text):** Metadata fields are implemented in catalog schemas; visible front-end overlay was deferred by decision.
- **`ThreadLoader` Timing Invariance:** Preserved strictly at **1900 ms active duration** and **400 ms fade**.

---

## 11. Quick-Start Command Reference

| Action | PowerShell / Bash Command | Expected Output / Result |
|---|---|---|
| **1. Install Dependencies** | `npm install` | Clean install; lockfile respected |
| **2. Start Dev Server** | `npm run dev` | Local server at `http://localhost:5173/everthread/` |
| **3. TypeScript Typecheck** | `npx tsc --noEmit` | `0 errors` (Exit code 0) |
| **4. Run Unit Tests** | `npm test` | **355 passed** across 24 test files |
| **5. Run Targeted Test** | `npx vitest run src/tests/walls.test.tsx` | Specific test suite passes |
| **6. Run E2E Acceptance** | `npx playwright test e2e/stage10-acceptance.spec.ts e2e/compass.spec.ts` | **21 passed** across 3 viewports |
| **7. Production Build** | `npm run build` | Optimized bundle in `dist/` |
| **8. Preview Build** | `npm run preview` | Local preview at `http://localhost:4173/everthread/` |
