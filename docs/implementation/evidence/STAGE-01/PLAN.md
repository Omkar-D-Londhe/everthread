# Stage 01 Execution Plan: Baseline, Tooling, Asset Verification and Claims Inventory

**Stage:** STAGE-01  
**Lead:** Implementation Engineer  
**Date:** 2026-10-26  
**Status:** COMPLETED  

---

## 1. Scope and Invariants

- **In Scope:**
  - Establish Git baseline, working tree classification, and integration branch structure.
  - Execute automated baseline checks (`npm test`, `npx tsc --noEmit`, `npm run build`).
  - Install Playwright DEV dependency (`@playwright/test`), install Chromium browser.
  - Implement GitHub Pages emulation server (`e2e/pagesServer.mjs`) serving `dist/` at `/everthread/` with status 404 fallback.
  - Implement Playwright configuration (`playwright.config.ts`) across 3 viewports: desktop (1440x900), tablet (1024x768), mobile (390x844 with touch).
  - Write baseline characterization tests (`e2e/baseline.spec.ts`) covering all baseline routes, one `h1`, zero page errors, `E2E-BASE-01` (Living Inheritance 404), and `E2E-CART-01` (mixed cart & checkout flow).
  - Verify 40 handover PNG assets from `EverThread_Asset_Handover.zip` outside the repo against `02a_ASSET_REGISTRY.csv`.
  - Re-search for missing Phase 6.0 documents.
  - Complete claims inventory across all visible routes (`CLAIMS_INVENTORY.md`).
  - Catalog test debt (`TEST_DEBT.md`).
  - Initialise authoritative audit tracker (`01b_AUDIT_TRACKER.csv`) and verification tools.
- **Out of Scope (Strict Invariants):**
  - Zero modifications to `src/` files.
  - No asset copying or conversion into `public/`.
  - No live git remote pushes or deployment modifications.

---

## 2. Execution Checklist Rows (Requirement / Finding → Planned Change → Actual File → Acceptance Criterion → Verification → Evidence)

| Item ID | Requirement / Finding | Planned Change | Actual File | Acceptance Criterion | Verification Method | Expected Evidence |
|---|---|---|---|---|---|---|
| `F-25` / `B-1` | Phase 6.0 documents search | Re-search entire repo, `docs/`, and git history for Phase 6.0 docs | `docs/implementation/baseline/BASELINE.md` | Accurate confirmation of whether Phase 6.0 docs exist | Search commands (`git log`, filesystem search) | `BASELINE.md` §3 |
| `F-31` | Add browser automation (Playwright) | Add `@playwright/test` dev dependency, configure 3 projects, add test server | `package.json`, `playwright.config.ts`, `e2e/pagesServer.mjs` | Clean install, npm test:e2e runs without errors on desktop, tablet, mobile | `npm i -D @playwright/test`, `npx playwright install chromium` | `package.json`, `playwright.config.ts` |
| `F-38` | Asset & Monograph inventory | Audit 40 supplied assets against `02a_ASSET_REGISTRY.csv` | `docs/implementation/baseline/ASSET_VERIFICATION.md` | 100% SHA-256 and dimension match; zero assets approved; no TR asset in `public/` | Python script `verify_assets.py` reading ZIP outside repo | `ASSET_VERIFICATION.md` |
| `F-41` | Claims integrity baseline | Catalog visible claims across all routes into supported, unsupported, and AI disclosure | `docs/implementation/baseline/CLAIMS_INVENTORY.md` | Complete scan of visible copy and data files | Codebase keyword scan & route review | `CLAIMS_INVENTORY.md` |
| `F-44` | Test debt catalogue | Catalog existing tests asserting obsolete or superseded behavior | `docs/implementation/baseline/TEST_DEBT.md` | Identify 7 test files needing remediation in later stages; zero tests deleted | Audit of test files vs roadmap rules | `TEST_DEBT.md` |
| `F-45` | Audit tracking framework | Create authoritative tracker `01b_AUDIT_TRACKER.csv` with 483 rows | `docs/implementation/01b_AUDIT_TRACKER.csv`, `docs/implementation/tools/*` | Exact status vocabulary, complete row counts, reproducible arithmetic | Python generator and summary script | `01b_AUDIT_TRACKER.csv`, `summary_counts.py` |
| `O-14` | Serial stage-by-stage progression | Restrict all work to Stage 01 only; stop and report at exit gate | `STAGE-01-BASELINE-TOOLING-INVENTORY.md` | Zero Stage 02 work executed; wait for owner command | Process inspection | Stage completion report |
| `E2E-BASE-01` | Living Inheritance route is 404 at baseline | Assert `/collections/the-living-inheritance` shows branded 404 | `e2e/baseline.spec.ts` | Displays branded 404 page ("Folio Unrecorded") across all 3 viewports | Playwright execution | Playwright test output |
| `E2E-ROUTE-01` | Baseline route integrity | Test 24 baseline routes across 3 viewports | `e2e/baseline.spec.ts` | Each route has exactly one `h1`, zero console/runtime errors | Playwright execution | Playwright test output |
| `E2E-CART-01` | Cart & checkout characterization | Test 3-item cart (ET-01, ET-04, ET-07), qty change, remove, reload, checkout validation, order generation | `e2e/baseline.spec.ts` | Subtotal correct, state persists after reload, checkout validates and completes demo order | Playwright execution | Playwright test output |

---

## 3. Dependencies and Cross-Stage Handoff

- **Stage 02 Prerequisite:** Depends on Playwright test runner, `pagesServer.mjs`, and clean baseline established in Stage 01.
- **Stage 04 Prerequisite:** Blocked for TR product listing until owner reviews Decision O-6-C and replacement assets (B-2, B-3).
- **Stage 05 Prerequisite:** Will replace `E2E-BASE-01` with `E2E-WALL-01` once `/collections/the-living-inheritance` route is introduced.
