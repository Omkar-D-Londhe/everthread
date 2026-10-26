# STAGE-04 — Traditional Products (TR-01…TR-07) and Commerce Integrity

## 1. Purpose and rationale
Make the seven Living Inheritance concept products real, correctly described and purchasable in the simulated flow, with independent sizes for sets and honest colour behaviour. Nothing may be listed unless its record and images pass the gates.

## 2. Prerequisites
STAGE-03 PASS. `02a_ASSET_REGISTRY.csv` rows for the products being listed carry the status `APPROVED` (recorded by the owner), with no `MISMATCH` or `DUPLICATE`. **On the current registry no image is approved**: after owner approval only TR-02, TR-04 and TR-06 can be listed; TR-05 also needs a distinct three-quarter image; TR-01, TR-03 and TR-07 remain unlisted until F-47 is resolved. Disclosure constants available (provisional is acceptable, B-4).

## 3. Scope and exclusions
In: derivatives, TR image records, listing gate, TR PDP content, size and colour logic, Bag/Saved/checkout changes, search entries, tests. Out: wall UI (Stage 5), Home (Stage 6), Archive UI (Stage 7), Compass changes, editions, dispatch, artisan hours, origin.

## 4. IDs
N-02, N-03, F-15, F-16, F-20, F-36; O-6, O-9, O-10, O-11; CL-019/020, 040–045, 201–211, 215–222, 460–463.

## 5. Current-state evidence
`CartContext.tsx`: lines keyed by `variantId = productId-color-size` (strings), merge on productId+size+color, `removeFromBag(target: number | string)` and `updateQuantity(target, delta)` accept indices; `addToBag` silently returns for unknown ids; BagPage calls with array indices (about L177, L195, L234). Decrement at quantity 1 removes the line. Persistence key `everthread_bag_v2`. `Product.sizes` is `string[]`. No TR images exist in the repo.

## 6. Files affected
`src/data/traditionalProducts.ts`, `src/context/CartContext.tsx`, `src/pages/ProductDetailPage.tsx` (TR rendering path, size/colour UI), `src/pages/BagPage.tsx`, `src/pages/CheckoutPage.tsx`, `src/pages/SavedPiecesPage.tsx`, `src/components/SearchModal.tsx`, `scripts/make_derivatives.py` (new), `public/images/products/living-inheritance/**` (new), `assets-src/living-inheritance/**` (masters), tests `saved-and-bag`, `checkout`, `product-detail`, `search`, new e2e files `e2e/traditional-commerce.spec.ts`, `e2e/cart.spec.ts`.

## 7. Ordered implementation instructions
1. Branch per §15. Gate baseline.
2. **Derivatives.** Work from the handover ZIP (outside the repository). Write `scripts/make_derivatives.py` (Pillow): for each `APPROVED` master create a WebP base at native width plus 400w and 800w (1200w only if the native width ≥ 1200, e.g. `AST-TR03-DET` 1374 px); never upscale; quality 80–84; print resulting sizes; use the normalised names in the registry (`tr-05-primary`, not `primary..`). Masters are **not committed** unless the owner decides otherwise (DEC D-23); record source SHA-256 → derivative mapping in `docs/baseline/ASSET_DERIVATIVES.md`. Never rename extensions.
3. **Image records.** In `traditionalProducts.ts` define each gallery as an ordered array: primary, three-quarter, back, seated, detail, special (if any). Each item: `src`, `srcSet`, `width`, `height`, `alt` (pattern from `02_…` §E), `provenance: 'ai-concept-fashion'`, `view`, `creditText: undefined`.
4. **Listing gate.** `validateTraditionalProduct(p)` (used by tests and in dev): all required roles present (primary, three-quarter, back, seated, detail; plus reversible for TR-03, overlay-slip-detail for TR-05, signature-detail for TR-06); every referenced file exists; `alt` non-empty; `provenance` set; every image's registry status is `APPROVED` (`UT-ASSET-01`); no `MISMATCH`/`DUPLICATE`; no forbidden fields (`edition`, `artisanHours`, `warpDensity`, `origin`, `leadTime`); `includes` equals the garments visible in the images. `isListed = valid`. A failing product stays unlisted and appears nowhere. Record per product why it is or is not listed.
5. **PDP for TR products.** In `ProductDetailPage` branch with `isTraditional(product)`: stage and Lens from Stage 3; title, price, `TR_STATUS_TEXT`, `CONCEPT_NOTICE_TEXT`, materials list (from `materials`), "Includes" list; **hide** edition, lead time, artisan hours, warp density, origin, dispatch/availability labels, care block (no approved care text); size controls per piece (`pieces[]`), each required before Add to Bag; colour swatches; inspiration link ("A contemporary design inspired by…" → `/archive?tradition=<key>`); "Complementary pieces" from other listed TR products. ET rendering path untouched.
6. **Colour behaviour (O-10).** Selecting a colour updates the visible label and the Bag line colour. Images have `colorwayId` (default = first colourway). If `selectedColor.id !== image.colorwayId`, show an `aria-live="polite"` note under the stage: "Images show {first colour name}." Apply the same note component to ET products (their images do not change per colour) so no product implies an unsupported image. Never swap images unless a real `imageSetId` exists.
7. **Cart model.** Extend `CartItem` with optional `sizes?: Record<string, string>` (piece key → size) and keep `size: string` as the human display (single size, or `Top M · Bottom L` composed from piece labels). `variantId = ${productId}-${color}-${sizeKey}` where `sizeKey` is the single size or `piece-size` pairs joined by `_`. Merge only when productId, color and every piece size match. Loading old persisted lines (no `sizes`) must work unchanged. `addToBag` returns `{ok:true}` or `{ok:false, reason}` (`unknown-product`, `not-listed`, `missing-size`); callers show an inline error (`role="alert"`). `getItemProduct` resolves through `ALL_PRODUCTS`.
8. **Bag.** `BagPage` targets lines by `variantId`, not index. Decrement at quantity 1 keeps the line (button `aria-disabled`, same visual state); only the explicit "Remove" control deletes. Line shows title, colour, size string (pieces), quantity, line total. Subtotal unchanged logic.
9. **Saved.** Saved stores product ids only. "Move to Bag" for products with more than one size option (all TR, and ET unchanged behaviour) — for TR navigate to the product page to choose sizes instead of auto-picking the first size. Do not change ET behaviour here.
10. **Checkout.** Summary lists the same lines and the size string; totals equal Bag; simulated-checkout disclosure unchanged.
11. **Search.** Include listed TR products (title, category, inspiration tradition label); result type "Order Folio" as for ET.
12. **Compass.** Do nothing; add the test from Stage 2 to confirm no TR appears.
13. Add tests (§10), run the gate and commit in small groups: derivatives, data+gate, PDP, cart, bag/checkout/saved, tests.

## 8. Expected behaviour
Every listed TR product opens at its slug; gallery shows only its own images in order; Lens works; sizes per piece required; Add to Bag creates a line with the exact product, colour and sizes; quantity and removal act on the intended line; Saved and checkout match the Bag; searching "Moonveil" or "Banaras" finds the product.

## 9. Data integrity, accessibility, failure
No fabricated fields (UT-DATA-02). Missing images ⇒ product unlisted, never a broken page. Size errors announced to assistive tech. Colour note is announced politely.

## 10. Tests
`UT-DATA-02`, `UT-CART-01`; update `saved-and-bag`, `checkout`, `product-detail`, `search`. Playwright: `E2E-CART-02` for each listed TR (sets: choose top M and bottom L, add, verify Bag text shows both), `E2E-CART-03`, `E2E-CART-04` (ET and TR), `E2E-CART-05`, `E2E-LENS-01` for TR, `E2E-PDP-01` with real TR images, `E2E-SEARCH-01`, `E2E-COMP-01` partial (no TR in results).

## 11. Manual checks
At 1440 and 390: visit each TR PDP; verify no cropping, gallery order, differing primary vs three-quarter, same garment in seated view; add two TR products and one ET to the Bag and check checkout.

## 12. Acceptance criteria
- Seven TR records exist; each is listed **only if** it passes the gate; a list of unlisted products with reasons is in `RESULT.md` (if any are unlisted the stage is PARTIAL).
- Add → Bag → quantity → remove → Saved → checkout summary are consistent for every listed TR product, including independent top/bottom sizes.
- Decrement at 1 never deletes; Remove does.
- Invalid add shows a visible error.
- Old persisted ET bag lines still load.
- Compass results never include TR.
- No edition, hours, origin, dispatch or manufacturing claim appears on any TR page.

## 13. Evidence
Playwright report; screenshots of each TR PDP (desktop, mobile); derivative size table; manifest updated; `RESULT.md`.

## 14. Risks and mitigation
Cart model change can break persistence: add migration test with a stored v2 payload. Duplicate-looking primary and three-quarter images: perceptual-hash check in Stage 1 tooling; reject. Page weight: record total KB per TR PDP.

## 15. Git
Create branch `stage-04-traditional-commerce` from the **current head of `integration/everthread-v1`**; confirm `git status` is clean first. Commit in small logical groups with message `stage-04: <summary>`; review `git diff` before each commit and exclude unrelated files. **Do not commit to or push `main`** (a push deploys); no force-push, reset or history rewrite without owner approval. After owner approval: merge the stage branch into `integration/everthread-v1` with `--no-ff` and tag `stage-04-approved`. Record `git status`, `git log --oneline -n 10` and `git diff --stat` in `RESULT.md`.

## 16. Stop conditions
Stop and report BLOCKED when required images are missing or mismatched; never substitute Archive images, panorama crops or ET images for TR gallery items. Do not generate images.

## 17. Exit gate
PASS when §12 holds for all seven products; PARTIAL if some stay unlisted; owner approval required either way before Stage 5.

## 18. Reconciliation addendum (Revision 2)
**18.1 Asset dependencies (manifest IDs, status from `02a_ASSET_REGISTRY.csv`).** `AST-TR02-{PRI,3Q,BCK,SEAT,DET}`, `AST-TR04-{PRI,3Q,BCK,SEAT,DET}`, `AST-TR06-{PRI,3Q,BCK,SEAT,DET,SIG}` — listable after owner approval. `AST-TR05-*` (3Q is `DUPLICATE`), `AST-TR01-*`, `AST-TR03-*`, `AST-TR07-*` (`MISMATCH`) — **not listable** until the registry says `APPROVED`. Do not use any image whose status is not `APPROVED`.

**18.2 Data-model and route implications.** `CartItem.sizes`, composite `variantId`, `addToBag` result type, `isListed` gate, per-piece `pieces[]`, colourway `colorwayId` on images.

**18.3 Desktop / tablet / mobile behaviour.** Desktop: gallery left, details right; sizes per piece stacked with labels. Tablet: same as desktop narrower. Mobile: single column; size groups full width; sticky nothing new. Portrait stage from Stage 3; TR-03 detail (landscape) and TR-06 (0.807) must render without crop.

**18.4 Component state matrix (initial, hover, focus, active, selected, completed, loading, empty, error as applicable).** Size selector: unselected (default), hover, focus-visible, selected, **error** (required size missing, `role="alert"`). Colour swatch: default, hover, focus, selected. Add to Bag: default, success (`aria-live` "Added to Bag"), error (unknown/not-listed/missing-size). Bag line: default, quantity at 1 (minus `aria-disabled`), removed (empty Bag state). Unlisted product page: not-available state.

**18.5 Interaction and motion contract.** None (commerce is static). Pointer, touch and keyboard parity is mandatory for every interactive control; all numeric values not established by an approved source are marked `OWNER_APPROVAL_REQUIRED` in `03_…` §9.

**18.6 Regression checks for previously working features.** ET mixed cart (E2E-CART-01), persistence of old v2 lines, Saved, checkout totals, Compass excludes TR, search for ET.

**18.7 Source files.** Known (verified): `src/context/CartContext.tsx`, `src/pages/BagPage.tsx` (index-based calls ≈L177/195/234), `src/pages/CheckoutPage.tsx`, `src/pages/SavedPiecesPage.tsx`. To verify: where size/colour state lives in `ProductDetailPage.tsx` and how `getItemProduct` resolves. Antigravity must report the actual paths found before editing; unknown locations are not to be invented.

**18.8 Outstanding blockers and owner decisions.** O-6 (BLOCKED), F-47, F-49, B-3, O-9/O-11 (provisional wording), O-10 (default), DEC D-23, approvals of every image used.

**18.9 Stop condition.** Stop (BLOCKED) when any required image is missing, mismatched or unapproved; never substitute Archive, ET or panorama images.

**18.10 End-of-stage report.** Present the 8 items in roadmap §5 item 5 and request explicit owner approval. Do not start the next stage.

**18.11 Evidence-integrity table (fill with actual results only).**
| Check | Planned | Executed | Passed | Failed | Not run | Unverifiable |
|---|---|---|---|---|---|---|
| (one row per check listed in §10–§11, filled with actual results only) | | | | | | |

**18.12 Exit-criteria matrix (copy of §12, to be completed).**
| # | Exit criterion | Result (PASS/FAIL/BLOCKED) | Evidence file |
|---|---|---|---|
| 1 | Seven TR records exist; each is listed **only if** it passes the gate; a list of unlisted products with reasons is in `RESULT.md` (if any are unlisted the stage is PARTIAL). | _to be filled by Antigravity_ | _path_ |
| 2 | Add → Bag → quantity → remove → Saved → checkout summary are consistent for every listed TR product, including independent top/bottom sizes. | _to be filled by Antigravity_ | _path_ |
| 3 | Decrement at 1 never deletes; Remove does. | _to be filled by Antigravity_ | _path_ |
| 4 | Invalid add shows a visible error. | _to be filled by Antigravity_ | _path_ |
| 5 | Old persisted ET bag lines still load. | _to be filled by Antigravity_ | _path_ |
| 6 | Compass results never include TR. | _to be filled by Antigravity_ | _path_ |
| 7 | No edition, hours, origin, dispatch or manufacturing claim appears on any TR page. | _to be filled by Antigravity_ | _path_ |
