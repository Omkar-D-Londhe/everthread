# Stage 03 Execution Plan: Portrait-Aware Product Stage, Atelier Lens and Shared Dialog Focus

**Stage ID:** STAGE-03  
**Status:** In Progress  
**Date:** 2026-10-26  
**Git Branch:** `stage-03-stage-lens`  
**Base:** `integration/everthread-v1` at `7f636b6` (tagged `stage-02-approved`)  

---

## 1. Objectives

1. **Single Image Source of Truth:** Unify PDP image state (`activeImageIndex`). Pass active gallery image to both the stage and Atelier Lens, eliminating the `macroImage ||` precedence (F-06, CL-064, CL-238, CL-246).
2. **Portrait-Aware Product Stage (`ProductImageStage.tsx`):** Clamped aspect ratio stage (`max-height: min(80vh, 900px)`) rendering full portrait (4:5 / 0.8) and landscape (3:2 / 1.5) images with `object-fit: contain` without cropping heads or feet (N-04, F-10, CL-063).
3. **Lens Math & Desktop Hover Preview (`lensMath.ts`):** Pure mathematical functions calculating contain rect, pointer mapping, non-stretching background size/position, and capping zoom at `min(3.5, naturalW/renderedW)`. Disables zoom if `< 1.3` (F-07, CL-065, CL-071, CL-240, CL-241, CL-242).
4. **Modal Lens Redesign (`AtelierLensModal.tsx`):** Precision modal for touch, keyboard, and small screens with pan/zoom parity, arrow-key panning, +/- zoom, and clean error/loading states (N-05, CL-066, CL-067, CL-068, CL-069, CL-070, CL-243, CL-244, CL-245).
5. **Shared Dialog Focus Helper (`useDialogFocus.ts`):** Trap Tab/Shift+Tab, close on Escape via document listener, restore focus to opener, handle `#root` siblings. Apply to `AtelierLensModal` and `SearchModal` (F-08, CL-068, CL-244).
6. **Mobile PDP Strip Overflow Fix:** Ensure thumbnail track is flex-contained (`overflow-x: auto`, `max-width: 100%`, `min-width: 0`) preventing horizontal overflow on 390 px screens (F-10).
7. **Testing & Verification:** Unit tests (`UT-LENS-01`), Playwright suites (`E2E-LENS-01`..`04`, `E2E-PDP-01`, `E2E-A11Y-02`), test debt remediation in `product-detail.test.tsx` and `phase-7-3-commerce-lens.test.tsx`.

---

## 2. Execution Checklist

- [ ] 1. Record Stage 02 documentation discrepancy in `docs/implementation/baseline/TEST_DEBT.md` (Done).
- [ ] 2. Implement `src/utils/lensMath.ts` and unit test suite `src/tests/lens-math.test.ts`.
- [ ] 3. Implement `src/hooks/useDialogFocus.ts` and apply to `src/components/SearchModal.tsx`.
- [ ] 4. Implement `src/components/ProductImageStage.tsx` with desktop hover preview, crosshair box, and contain aspect ratio.
- [ ] 5. Refactor `src/components/AtelierLensModal.tsx` with `lensMath` and `useDialogFocus`.
- [ ] 6. Refactor `src/pages/ProductDetailPage.tsx` to use `ProductImageStage`, single source of truth, and overflow-protected thumbnail strip.
- [ ] 7. Update existing unit test suites (`product-detail.test.tsx`, `phase-7-3-commerce-lens.test.tsx`) to assert active image in Lens.
- [ ] 8. Implement Playwright test suite `e2e/stage03.spec.ts` covering `E2E-LENS-01`..`04`, `E2E-PDP-01` (with synthetic 1122×1402 portrait fixture), and `E2E-A11Y-02`.
- [ ] 9. Run full test gate: Vitest, TypeScript `tsc --noEmit`, production build, and Playwright across all 3 viewports.
- [ ] 10. Update `01b_AUDIT_TRACKER.csv` with evidence paths and validate arithmetic via `summary_counts.py`.
- [ ] 11. Produce `docs/implementation/evidence/STAGE-03/RESULT.md` and commit.
