# EverThread — Baseline Verification Record

**Commit Baseline:** `ebf7b6b` on branch `main`  
**Integration Branch:** `integration/everthread-v1` (baseline commit `3694d59`)  
**Stage Branch:** `stage-01-baseline`  
**Date:** 2026-10-26  
**Environment:** Windows (PowerShell), Node v20+, Vite 6, React 18, TypeScript 5.6.3  

---

## 1. Automated Baseline Verification Results

| Check | Tool / Command | Result | Details |
|---|---|---|---|
| Unit / Component Tests | `npm test` (`vitest run`) | **PASS (251 / 251 tests passed)** | 15 test files, 251 tests passed in 32.38s. Matches historical audited state. |
| TypeScript Compilation | `npx tsc --noEmit` | **PASS (Exit 0)** | Zero type errors across entire codebase. |
| Production Build | `npm run build` (`tsc && vite build`) | **PASS (Exit 0)** | Built in 4.90s. Generated `dist/index.html` (2.93 kB), `dist/assets/index-CY9wAwxq.css` (288.87 kB), `dist/assets/index-wlX6NQyK.js` (687.53 kB). Expected minification chunk warning (>500 kB). |
| E2E Browser Testing | `npx playwright test` | **PASS (78 / 78 tests passed)** | 26 test cases × 3 projects (desktop 1440x900, tablet 1024x768, mobile 390x844) = 78 tests passed against GitHub Pages emulation server in 1.5m. |

---

## 2. Browser Testing Infrastructure (Playwright)

- **Dependency:** `@playwright/test` ^1.64.1 added as owner-approved DEV dependency.
- **Pages Emulation Server:** `e2e/pagesServer.mjs`
  - Pure Node.js `http` server (zero new dependencies).
  - Serves production build files from `dist/` mounted under subpath `/everthread/`.
  - Serves static assets with proper MIME types.
  - Returns `dist/404.html` with **HTTP 404** for any non-file request, perfectly replicating GitHub Pages single-page-app redirection behavior.
  - Root `/` returns HTTP 404 per GitHub Pages repository subpath rules.
- **Projects Configured:**
  - `desktop`: 1440 × 900
  - `tablet`: 1024 × 768
  - `mobile`: 390 × 844 (`hasTouch: true`, `isMobile: true`, emulating Pixel 5)
- **Baseline Characterization Tests (`e2e/baseline.spec.ts`):**
  - `E2E-ROUTE-01` (Baseline subset): 24 distinct baseline routes tested on all 3 projects. Asserts each route renders exactly one `h1` and generates zero uncaught console/runtime errors.
  - `E2E-BASE-01`: Asserts `/collections/the-living-inheritance` correctly renders the branded 404 page at baseline (intentionally unrouted until Stage 5).
  - `E2E-CART-01`: Characterization of mixed cart operations (ET-01 with size, ET-04 with size, ET-07 accessory), quantity increase, item removal, subtotal calculation, `localStorage` reload persistence, form validation on `/checkout`, and successful simulated concierge reservation generation (`ET-DEMO-XXXXXX`).

---

## 3. Phase 6.0 Documentation Search (Blocker B-1 / F-25)

- **Search Scope:** Complete filesystem (`docs/`, `src/`, `scratch/`, `_legacy_archive/`) and entire git history (`git log --all --full-history`).
- **Files Queried:** `phase_6_0*`, `*storyboard*`, `*experience_redesign*`.
- **Result:** **NOT FOUND**.
- **Assessment:** Blocker B-1 is confirmed open. The two Phase 6.0 documents (experience redesign audit and cinematic motion storyboard) are not present in the repository or commit history. Story Flow choreography in Stage 8 remains labeled as derived until owner clarification or supply of originals.

---

## 4. Working Tree & Git Safety Check

- `main` branch is untouched and remains at commit `ebf7b6b`.
- No `src/` files modified (`git diff --stat -- src` is completely empty).
- All changes are strictly confined to test tooling (`package.json`, `package-lock.json`, `playwright.config.ts`, `e2e/*`) and documentation (`docs/implementation/baseline/*`, `docs/implementation/evidence/*`).
