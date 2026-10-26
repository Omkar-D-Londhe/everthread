# STAGE-03 — Portrait-Aware Product Stage, Atelier Lens and Shared Dialog Focus

## 1. Purpose and rationale
Portrait TR images need a stage that does not crop heads or feet. The Lens currently shows the wrong image, stretches its preview and traps nobody (focus escapes). Fixing both once, on the existing ET products, de-risks Stage 4. A shared dialog-focus helper is created here and reused later.

## 2. Prerequisites
STAGE-02 PASS (ET-02 title, alt text, `CatalogueProduct` lookups).

## 3. Scope and exclusions
In: PDP image stage and gallery layout, Lens redesign (desktop hover preview, touch/keyboard modal), shared `useDialogFocus`, Search modal focus, PDP mobile overflow, failure/loading states, tests. Out: TR product pages and gallery content (Stage 4), colour-to-image logic (Stage 4), any change to Bag or checkout.

## 4. IDs
F-06, F-07, F-08 (Lens, Search), F-10 (PDP part), F-18 (gallery), F-36; N-04, N-05; CL-064/066/067/068/238/243/244/246.

## 5. Current-state evidence
`ProductDetailPage.tsx` about L874: `imageSrc={product.macroImage || currentImage.src}` (macro wins). `AtelierLensModal.tsx`: fixed `zoom = 3.5`; viewport `aspectRatio: 16/10`; `<img>` uses `object-fit: cover` while the loupe's `background-size` is container size × 3.5 (stretched, up to ≈5% offset); generic alt "Living weave macro inspection view"; `aria-modal` set but no focus trap, focus not restored; touch handlers exist with `touch-action: none`. ET sources are landscape 1536×1024; main stage at 1440 px measured 878×522. Lens shows 3073 px from a 1536 px source (≈2× upscaling). Test ids in use: `gallery-main-image`, `gallery-thumbnails`, `inspect-fabric-lens-btn`, `atelier-lens-image`, `atelier-lens-viewport`, `atelier-lens-glass`. Search modal returns focus to body on close.

## 6. Files affected
`src/pages/ProductDetailPage.tsx`, `src/components/AtelierLensModal.tsx`, **new** `src/components/ProductImageStage.tsx`, **new** `src/utils/lensMath.ts`, **new** `src/hooks/useDialogFocus.ts`, `src/components/SearchModal.tsx`, `src/styles/*.css` (stage, gallery strip), tests `product-detail`, `phase-7-3-commerce-lens`, **new** `lens-math.test.ts`, e2e `e2e/lens.spec.ts`, `e2e/pdp-stage.spec.ts`.

## 7. Ordered implementation instructions
1. Branch per §15. Record baseline gate.
2. **Single image source of truth.** In the PDP keep one state `activeImageIndex`. Derive `activeImage = gallery[activeImageIndex]` once and pass it to both the visible stage and the Lens. Remove the `macroImage ||` precedence. If the macro image is meant to be a gallery plate, it must appear as a gallery item the visitor selects.
3. **`ProductImageStage`.** Props: `image` (src, width, height, alt, srcSet), `onZoomRequest`. Render the image with `object-fit: contain` inside a container whose aspect ratio equals `image.width/image.height`, clamped: `max-height: min(80vh, 900px)`, width fills the column; background Warm Ivory. This fully shows portrait (≈0.8) and landscape (1.5) sources without cropping. Keep the 280 ms cross-dissolve between images (reuse the existing keyframe) and keep `data-testid="gallery-main-image"`. Thumbnails: keep `gallery-thumbnails`; make the strip its own scroll container (`overflow-x: auto`, `max-width: 100%`, `min-width: 0` on its flex parent) so it cannot widen the page (F-10 PDP part).
4. **Lens math** in `lensMath.ts` (pure functions, unit-tested): `getContainRect(containerW, containerH, naturalW, naturalH)` → rendered rect; `pointerToImage(px, py, rect, natural)` → natural coordinates or null outside; `maxZoom(naturalW, renderedW)` = `naturalW / renderedW`; `effectiveZoom = min(3.5, maxZoom)`; if `effectiveZoom < 1.3` magnification is **disabled** and the control shows "Full-resolution view" only; `previewBackground(pointerInRect, rect, zoom, previewSize)` → `background-size` = `rect.width × zoom` by `rect.height × zoom` (same aspect ratio as the image, so **no stretch**) and `background-position` = `-(pointerInRect.x × zoom − previewSize / 2)` px, `-(pointerInRect.y × zoom − previewSize / 2)` px, clamped so the preview never shows empty space. Here `pointerInRect` is the pointer offset inside the contain rect, and the preview samples exactly the pixels under the pointer.
5. **Desktop hover preview.** On `(hover: hover) and (pointer: fine)` and viewport ≥1024 px: hovering the main image shows a square preview pane to the right of the stage (own column, `aria-hidden="true"`, `pointer-events: none`), tracking the pointer through `requestAnimationFrame`; a small crosshair box marks the sampled area on the image; hidden on pointer leave and when `effectiveZoom < 1.3`. Not hover-only: the stage also has a visible focusable button "Inspect detail" (existing `inspect-fabric-lens-btn`).
6. **Modal Lens (touch, keyboard, small screens).** Reuse `AtelierLensModal` as the modal: opens from the button or a tap on the image when the device is coarse-pointer; shows the **active image at its contain size** with the same math; touch: one-finger drag pans the magnified view (`touch-action: none` only inside the modal viewport), double-tap or a visible "+ / −" pair toggles zoom between 1× and `effectiveZoom`; keyboard: arrow keys pan by 10% of the viewport, `+`/`-` zoom, `Esc` closes.
7. **Dialog focus helper** `useDialogFocus({open, onClose, containerRef, initialFocusRef})`: captures `document.activeElement` on open; moves focus to `initialFocusRef` (Close button); traps Tab/Shift+Tab within `containerRef`; closes on `Esc` through a document-level `keydown` listener (so it works wherever focus is); restores focus to the captured opener on close; sets `inert`/`aria-hidden` on `#root` siblings only if supported (otherwise rely on trap); cleans up listeners on unmount. Apply to the Lens modal and to `SearchModal` (focus returns to the opener, or `body` if opened by the `/` shortcut with a fallback to the header search button).
8. **Alt text.** Modal image alt = the gallery image's own `alt` (from data) + " — magnified view". No generic string.
9. **Failure and lifecycle.** `onError` on the Lens image shows "This image could not be loaded." and disables magnification; show a lightweight loading state until `naturalWidth` is known; listeners, rAF and `ResizeObserver` removed on unmount and on route change (use effect cleanups); closing during a route change must not throw.
10. **Resolution honesty.** Show "Native resolution view" text only if `effectiveZoom === 1`; never display a zoom factor larger than `effectiveZoom`. Record the actual cap per ET image in `RESULT.md`.
11. Update/add tests (§10). Run the gate. Commit.

## 8. Expected behaviour
Choosing any gallery thumbnail changes both the stage and the Lens source. Portrait and landscape images appear whole. Desktop: hover preview tracks the pointer without stretch. Touch: tap opens the modal; drag pans. Keyboard: button → modal, arrows pan, Esc closes, focus returns to the button. Search closes with Esc and returns focus to its opener.

## 9. Data integrity, accessibility, failure
One image state; per-image alt; focus trap; `Esc` always works; reduced motion disables the dissolve and preview easing; error and loading states present; no hover-only critical function.

## 10. Tests
Vitest: `UT-LENS-01` (`lensMath` contain rect, mapping, cap, disable at <1.3); update `product-detail` and `phase-7-3-commerce-lens` to assert source = active image (they must stop asserting the old behaviour). Playwright: `E2E-LENS-01` for ET-01…07 (and TR-01…07 in Stage 4), `E2E-LENS-02`, `E2E-LENS-03`, `E2E-LENS-04`, `E2E-PDP-01` (use a temporary fixture product or the ET portrait-cropped image test route if no portrait ET exists: create a test-only page under `e2e/fixtures` that renders `ProductImageStage` with a 1122×1402 image from the uploaded set, **not shipped**), `E2E-A11Y-02` for the PDP and Lens.

## 11. Manual checks
At 1440, 1024, 390: select each thumbnail on ET-01 and ET-02, open the Lens, confirm same image, no stretch, Esc and focus return; check a portrait fixture shows head and feet.

## 12. Acceptance criteria
- Lens source equals the selected gallery image for all 7 ET products and every thumbnail.
- Preview content under the pointer matches the expected image coordinates within 2 px (E2E-LENS-02).
- No head/feet cropping for 4:5 portrait fixture at all three viewports.
- Focus never leaves the open Lens or Search dialog; Esc closes from any element; focus is restored.
- No horizontal overflow on any PDP at 390 px.
- No test asserting the old behaviour remains.

## 13. Evidence
Playwright report and traces; screenshots per viewport; short recording of hover preview and modal; `RESULT.md` with measured `effectiveZoom` per ET image.

## 14. Risks and mitigation
Layout shift while the image size is unknown: reserve aspect ratio from data (`width`/`height` already present). Hover preview fighting scroll: preview is `pointer-events: none`. Safari `inert` support: rely on the trap. Existing ET photos are landscape; ensure no regression in the PDP column layout at 1024 px.

## 15. Git
Create branch `stage-03-stage-lens` from the **current head of `integration/everthread-v1`**; confirm `git status` is clean first. Commit in small logical groups with message `stage-03: <summary>`; review `git diff` before each commit and exclude unrelated files. **Do not commit to or push `main`** (a push deploys); no force-push, reset or history rewrite without owner approval. After owner approval: merge the stage branch into `integration/everthread-v1` with `--no-ff` and tag `stage-03-approved`. Record `git status`, `git log --oneline -n 10` and `git diff --stat` in `RESULT.md`.

## 16. Stop conditions
Stop if the active-image state cannot be unified without changing Bag logic; if magnification cannot meet the 2 px mapping test; if any ET PDP layout regresses.

## 17. Exit gate
PASS when §12 holds, gate commands pass, recordings reviewed by the owner and the owner approves.

## 18. Reconciliation addendum (Revision 2)
**18.1 Asset dependencies (manifest IDs, status from `02a_ASSET_REGISTRY.csv`).** No new assets. Verification uses existing ET images (`REPO` product folders). Portrait behaviour is tested with a **synthetic 1122×1402 fixture** generated in `e2e/fixtures/` (not a supplied image, not shipped).

**18.2 Data-model and route implications.** No data-model change beyond ensuring each gallery image record exposes `width`, `height`, `alt`.

**18.3 Desktop / tablet / mobile behaviour.** Desktop (≥1024 px, fine pointer): two-column PDP, hover preview pane right of the image. Tablet 1024 px with touch and mobile 390 px: single stage, tap opens modal, thumbnails in own scroll strip. Stage never exceeds `min(80vh, 900px)`.

**18.4 Component state matrix (initial, hover, focus, active, selected, completed, loading, empty, error as applicable).** Stage image: loading (reserved aspect box), loaded, **error** (message, magnifier disabled). Thumbnail: default, hover, focus-visible, selected (aria-current). Inspect button: default, hover, focus, active, disabled when `effectiveZoom < 1.3`. Preview pane: hidden / visible. Modal: closed, open (focus on Close), panning, zoomed, error. Search dialog: open/closed with focus restoration.

**18.5 Interaction and motion contract.** Gallery cross-dissolve: existing 280 ms keyframe (unchanged). Hover preview follows pointer with no easing (rAF). Modal needs no entrance animation; if a fade is used its duration is a named token (`OWNER_APPROVAL_REQUIRED`) and it is disabled under reduced motion. Interruption: closing or changing image cancels rAF and listeners. Pointer, touch and keyboard parity is mandatory for every interactive control; all numeric values not established by an approved source are marked `OWNER_APPROVAL_REQUIRED` in `03_…` §9.

**18.6 Regression checks for previously working features.** ET add-to-Bag, size/colour selection, gallery thumbnails, cross-dissolve, Saved, accordions, existing `product-detail` tests (updated, not deleted).

**18.7 Source files.** Known (verified): `src/pages/ProductDetailPage.tsx` (≈L874), `src/components/AtelierLensModal.tsx`, `src/components/SearchModal.tsx`. To verify: gallery container class names and the CSS file holding the 16:10 rule; whether `macroImage` is also a gallery item. Antigravity must report the actual paths found before editing; unknown locations are not to be invented.

**18.8 Outstanding blockers and owner decisions.** Parameters in `03_…` §9 (owner approval); DEC D-24 (sequence). No asset blockers.

**18.9 Stop condition.** Stop if the active-image state cannot be unified without touching Bag logic or if any ET PDP layout regresses.

**18.10 End-of-stage report.** Present the 8 items in roadmap §5 item 5 and request explicit owner approval. Do not start the next stage.

**18.11 Evidence-integrity table (fill with actual results only).**
| Check | Planned | Executed | Passed | Failed | Not run | Unverifiable |
|---|---|---|---|---|---|---|
| (one row per check listed in §10–§11, filled with actual results only) | | | | | | |

**18.12 Exit-criteria matrix (copy of §12, to be completed).**
| # | Exit criterion | Result (PASS/FAIL/BLOCKED) | Evidence file |
|---|---|---|---|
| 1 | Lens source equals the selected gallery image for all 7 ET products and every thumbnail. | _to be filled by Antigravity_ | _path_ |
| 2 | Preview content under the pointer matches the expected image coordinates within 2 px (E2E-LENS-02). | _to be filled by Antigravity_ | _path_ |
| 3 | No head/feet cropping for 4:5 portrait fixture at all three viewports. | _to be filled by Antigravity_ | _path_ |
| 4 | Focus never leaves the open Lens or Search dialog; Esc closes from any element; focus is restored. | _to be filled by Antigravity_ | _path_ |
| 5 | No horizontal overflow on any PDP at 390 px. | _to be filled by Antigravity_ | _path_ |
| 6 | No test asserting the old behaviour remains. | _to be filled by Antigravity_ | _path_ |
