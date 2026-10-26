# STAGE-04 Implementation Plan: Traditional Products & Commerce Integrity

**Date:** 2026-10-26  
**Branch:** `stage-04-traditional-commerce`  
**Base Commit / Integration Tag:** `stage-03-approved` (`c559f7a` on `integration/everthread-v1`)

---

## 1. Objectives & Boundaries

### Scope
1. **Cart Model & Integrity (`F-20`, `UT-CART-01`):**
   - Refactor `CartItem` / `BagItem` to support optional per-piece sizes: `sizes?: Record<string, string>`.
   - Implement deterministic `variantId`: `${productId}-${color}-${sizeKey}`.
   - Refactor `addToBag` to return `{ ok: boolean, reason?: 'unknown-product' | 'not-listed' | 'missing-size' }`.
   - Enforce listing gate: unlisted products (`isListed === false`) cannot be added to bag.
   - Guard against invalid product IDs.
   - Enforce minimum quantity: decrementing at quantity 1 keeps the line (`aria-disabled="true"`); only explicit "Remove" deletes the line.
   - Support backward-compatible migration of legacy `everthread_bag_v2` storage payloads.
2. **Independent Sizes for Sets (`N-03`):**
   - In `TraditionalProduct`, specify per-piece size arrays (`pieces: [{ key: 'top', label: 'Top', sizes: [...] }, { key: 'bottom', label: 'Bottom', sizes: [...] }]`).
   - In `ProductDetailPage`, render independent size selectors per piece when `pieces.length > 1`.
3. **Honest Colour Behaviour (`F-15`, `O-10`):**
   - In `ProductDetailPage`, under the stage, when `selectedColor.name !== product.colors[0]?.name`, render an `aria-live="polite"` notice: `"Images show {product.colors[0].name}."`
   - Apply to both ET products and TR products.
4. **Listing Gate (`validateTraditionalProduct`):**
   - Implement validator ensuring all required views, non-empty alt, approved asset registry status, no mismatch/duplicate, and no forbidden fields (`edition`, `artisanHours`, `warpDensity`, `origin`, `leadTime`).
   - Verify that against current registry, all 7 TR products remain unlisted (`isListed: false`).
5. **Catalogue Safety & Decision O-6-C:**
   - Do NOT approve assets on owner's behalf.
   - Do NOT list or enable purchase of TR-01 through TR-07.
   - Keep `CL-055` open (FAIL/BLOCKED).
   - Carry forward verified resolutions of `CL-064`, `CL-238`, `CL-246` for regular products.

---

## 2. Implementation Order

1. **Cart Model & Types:** Update `src/types/index.ts` and `src/context/CartContext.tsx`.
2. **Bag & Checkout Pages:** Update `src/pages/BagPage.tsx`, `src/pages/CheckoutPage.tsx`, and `src/pages/SavedPiecesPage.tsx`.
3. **TR Data Model & Validation Gate:** Implement `validateTraditionalProduct` in `src/data/traditionalProducts.ts`.
4. **Product Detail Page Updates:** Add colour notice and independent piece size selectors in `src/pages/ProductDetailPage.tsx`.
5. **Unit Tests:** Create `src/tests/traditional-commerce.test.ts`; update `src/tests/saved-and-bag.test.tsx` and `src/tests/data-state.test.tsx` for decrement-at-1 behavior.
6. **E2E Tests:** Create `e2e/stage04.spec.ts`.
7. **Verification:** Vitest (`npm test -- --run`), Playwright (`stage04.spec.ts`, `stage03.spec.ts`, `stage02.spec.ts`, `baseline.spec.ts`), TypeScript (`npx tsc --noEmit`), and Vite build (`npm run build`).
8. **Tracker Reconciliation & Stage Outcome:** Update `01b_AUDIT_TRACKER.csv` and generate `RESULT.md`.
