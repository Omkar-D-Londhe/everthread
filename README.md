# EverThread — Contemporary Heritage Luxury Atelier

> *"An heirloom, not a trend. Every thread carries a story."*

EverThread is an editorial luxury fashion web application that bridges historic Indian textile traditions with contemporary garment architecture. Designed as a digital atelier, the platform invites patrons to discover artisanal provenance, explore curated garment collections, consult an interactive lifestyle recommendation engine, and inspect heritage weaving techniques through high-resolution cultural archives.

---

## Technical Stack & Architecture

- **UI Framework:** React 18 (Concurrent Root, Strict Mode)
- **Language:** TypeScript 5.6 (Strict Type Checking, Zero `any` policy)
- **Bundler & Dev Server:** Vite 6
- **Routing:** React Router v6 (Client-side SPA with deep linking and fallback defense)
- **Styling:** Custom luxury CSS architecture, design tokens, responsive breakpoints, Bootstrap 5 grid utilities
- **Motion & Interaction:** GSAP 3.12, ScrollTrigger, CSS keyframe animations, `@media (prefers-reduced-motion: reduce)` accessibility compliance
- **Iconography:** 100% accessible inline SVGs with `aria-hidden="true"` and structured labels
- **Asset Pipeline:** Multi-tier responsive WebP imagery with high-density variants (`400w`, `800w`, `1200w`, `1600w`) and SVG vector diagrams with PNG fallbacks
- **State & Persistence:** Native React Context (`CartContext`, `SavedContext`) synchronized with browser `localStorage`
- **Testing Engine:** Vitest 2.1 with `jsdom`, `@testing-library/react`, and `@testing-library/jest-dom`

---

## Quick Start & Developer Guide

### Prerequisites
- Node.js (v18.x, v20.x, or later recommended)
- npm (v9.x or later)

### Installation
Clone the repository and install dependencies:
```bash
# Install exact npm dependencies
npm install
```

### Development Server
Launch the Vite local development server:
```bash
npm run dev
```
The application will be accessible at `http://localhost:5173`. Hot Module Replacement (HMR) is enabled.

### Automated Testing
Execute the full Vitest automated test suite:
```bash
npm test -- --run
```
Expected result: **12 test suites passed, 238 / 238 tests passing**.

### Type Checking
Run the TypeScript compiler without emitting files:
```bash
npx tsc --noEmit
```
Expected result: **0 errors**.

### Production Build
Compile and bundle the application for production deployment:
```bash
npm run build
```
Build artifacts will be generated in `dist/`.

### Production Preview
Locally preview the generated production build:
```bash
npm run preview
```
The production preview server will start at `http://localhost:4173`.

---

## Key Features & Route Architecture

| Route | View Name | Key Interactive Features |
|:---|:---|:---|
| `/` | **Editorial Homepage** | Animated SVG thread entrance loader, hero narrative, craft vignettes, atelier philosophy, featured heirlooms. |
| `/collections` | **Collections Catalogue** | Master catalogue of 7 canonical garments (`ET-01` to `ET-07`), material filtering, tag sorting, and INR currency formatting. |
| `/product/:slug` | **Product Detail** | 280ms cross-dissolve gallery, swatch selector, size selector, model portrait photography, and smooth specification accordions with keyboard trap isolation. |
| `/compass` | **Curator's Compass** | 5-step guided recommendation stepper, continuous champagne-thread progress bar, direction-aware slide/fade transitions, and deterministic lifestyle scoring algorithm (`compassMatcher.ts`). |
| `/archive` | **Cultural Archive** | Curated overview of 13 Indian textile traditions, 4 foundational monograph folios, Weave Library card grid, and deep-link modal triggers. |
| `/archive?tradition=:slug` | **Textile Exhibition** | Immersive 6-plate exhibition modal featuring 78 base WebP images, 260 responsive variants, thumbnail selector strip, and slide-out Technical Diagram Drawer. |
| `/archive/:storySlug` | **Monograph Folios** | Editorial deep-dives into traditional craft techniques (Folios 1.1 through 1.4) with inline technical weave diagrams. |
| `/the-house` | **The Atelier House** | Heritage narrative, artisan guild manifesto, and preservation ethics. |
| `/journal` | **Editorial Journal** | Publications on heritage textile arts, seasonal monographs, and artisan spotlights. |
| `/journal/:articleSlug` | **Journal Article** | Full editorial article reading experience with related reading links. |
| `/saved` | **Saved Pieces** | Bookmarked garments persisted via `localStorage`, synchronized with Header bookmark badge. |
| `/bag` | **Shopping Bag** | Variant-aware item aggregation, quantity adjustments, luxury packaging selection, and order subtotal calculations. |
| `/checkout` | **Concierge Checkout** | Simulated luxury checkout form with billing, shipping, delivery preferences, order review, and empty-bag redirection defense. |
| `*` | **404 Not Found** | Branded, accessible recovery plinth directing patrons back to Collections or the Homepage. |

---

## Repository Documentation

For in-depth architectural and asset details, consult the accompanying documentation in the [`docs/`](./docs) directory:
- **[`PROJECT_STRUCTURE.md`](./docs/PROJECT_STRUCTURE.md):** Complete directory tree map, entry point specifications, `src/` vs `public/` asset handling, and testing structure.
- **[`FILE_USAGE_AUDIT.md`](./docs/FILE_USAGE_AUDIT.md):** Multi-category file inventory classifying active code, static assets, tests, documentation, and historical mockups.
- **[`phase_7_0_release_readiness_report.md`](./docs/phase_7_0_release_readiness_report.md):** Comprehensive release readiness audit, Git setup summary, and hosting compatibility report.
- **[Phase Reports & Specs](./docs/):** Historical phase implementation reports (`phase_6_3` through `phase_6_6`), design briefs, and technical specifications.

---

## Git Workflow & Safety Guidelines

1. **Working Tree Discipline:** Always inspect `git status` before beginning work.
2. **Pre-commit Verification:** Always execute `npx tsc --noEmit` and `npm test -- --run` before staging and committing changes.
3. **Protected Invariants:**
   - Never alter canonical products `ET-01` through `ET-07` or their catalogue order.
   - Never change established tradition slugs (e.g. `kutch-ari-embroidery`, `chanderi-handloom`).
   - Never commit `node_modules/`, `dist/`, `scratch/`, or local environment credentials.
