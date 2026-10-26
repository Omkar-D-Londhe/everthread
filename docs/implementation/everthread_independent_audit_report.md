# EverThread — Independent Audit Report (Phase 1: Source Audit)

Audited commit: `ebf7b6b` ("fix: resolve asset paths for both local dev server and GitHub Pages subpath", 2026-10-22).
Method: read-only `git clone --depth 1` into a scratch directory, plus reading the supplied checklist in full. No project file was modified, nothing was committed, pushed or deployed, and no dependencies were installed.

> **Read this first.** This is a **source-code audit only**. I had no browser, no DOM/console access and no way to run the app. Every finding below is labelled either **[CODE]** (read in source) or **[NOT RUN]** (behaviour not executed). Almost every behavioural requirement is therefore **NOT VERIFIED**. Nothing is marked PASS on the strength of code existing.

---

## 1. Executive summary

| Area | Status | One-line finding |
|---|---|---|
| Cultural Collection (shopping experience) | **FAIL** (missing) | No route, page, data model or product records exist. No file references a Cultural Collection. |
| Cultural garments orderable | **BLOCKED** | Nothing sellable exists beyond ET-01…ET-07. Requires your approved product data (§9). |
| Wrong item in Bag | **NOT VERIFIED** (no root cause found in source) | Bag is keyed by catalogue ID; I found no hard-coded fallback or index lookup that would swap products. Live reproduction not possible. Index-based Bag API is a fragility risk. |
| Atelier Lens | **PARTIAL / likely defective [CODE]** | Product-page Lens always uses the product's `macroImage`, not the selected gallery image, and its zoom maths appears to mis-map pointer to image for non-16:10 sources. |
| Search / Chanderi result | **PASS-candidate, NOT VERIFIED live** | Search is built from real data models; the string "Pleated Indigo Chanderi Tunic" is not a product title in the current repo. It survives only in stale asset folder names, image alt text and a legacy slug. |
| Archive data | **PARTIAL** | 13 traditions × 6 base roles confirmed on disk. Archive→product map contains arbitrary and likely dead entries. |
| Deployment config | **PARTIAL** | Workflow, base path, Router basename and SPA 404 fallback are present and coherent in source. Actual deployment status NOT VERIFIED. |
| Tests / typecheck / build | **NOT VERIFIED** | Not run (installing dependencies was prohibited). |

---

## 2. Capabilities and limitations

| Capability | Available? | Notes |
|---|---|---|
| Browse live site | **No (effectively)** | Fetching the supplied `/archive` URL returned a client error. This is consistent with GitHub Pages serving its SPA fallback `404.html` with HTTP 404 for nested routes, but I cannot confirm that. The site root could not be fetched (tool only opens URLs from the conversation or search results; search found nothing relevant). |
| Inspect repository source | **Yes** | Read-only clone. |
| Follow nested routes / interact | **No** | No browser. |
| DOM / console | **No** | |
| Run tests / build | **No** | `npm install` was prohibited; tests and `tsc` cannot run without it. |
| Responsive 1440/1024/390 | **No** | |
| Deployment status | **No** | GitHub API returned a rate-limit error. |

Blocked verifications: every live interaction, every viewport, scroll-motion perceptibility, loader timing, Lens interaction, mixed-cart reproduction, console errors, test/build results, Actions run status.

---

## 3. Architecture overview [CODE]

- React 18 + TypeScript + Vite 6, React Router 6, Bootstrap 5 + custom CSS, GSAP (ScrollTrigger via `src/hooks/useEditorialScroll.ts`), Vitest + Testing Library (15 test files).
- Entry `src/main.tsx`: `BrowserRouter basename={import.meta.env.BASE_URL}` → `CartProvider` → `SavedProvider` → `App`.
- Routes in `src/App.tsx`: `/`, `/collections`, `/product/:slug`, `/compass`, `/archive`, `/archive/:storySlug`, `/the-house`, `/journal`, `/journal/:articleSlug`, `/saved`, `/bag`, `/checkout`, `*` (NotFoundPage). **No cultural route.**
- Catalogue: `src/data/products.ts` (`PRODUCTS`, 7 records, `getProductById`, `getProductBySlug`).
- Bag: `src/context/CartContext.tsx`, persisted to `localStorage` key `everthread_bag_v2`, synced across tabs via `storage` event.
- Search: `src/components/SearchModal.tsx`, built from `PRODUCTS`, `WEAVE_LIBRARY`, `STORIES`, `JOURNAL_ARTICLES`.
- Lens: `src/components/AtelierLensModal.tsx`.
- Archive: `src/data/assetMap.ts`, `src/data/stories.ts`, `src/components/TraditionExhibitionModal.tsx`, `ArchivePage.tsx`, `ArchiveStoryPage.tsx`.
- Loader: `src/components/ThreadLoader.tsx`, `src/styles/thread-loader.css`, preload in `index.html`; App shows it for a fixed 750 ms timer (0 in tests).
- Deployment: `.github/workflows/deploy.yml` (`npm ci` → `npm test -- --run` → `npx tsc --noEmit` → `npm run build` → Pages deploy), `public/404.html` SPA redirect, Vite `base: '/everthread/'` with custom plugins that rewrite `/images/` to `/everthread/images/` in JS chunks and in `index.html` hrefs.

---

## 4. Requirement audit matrix (grouped)

The checklist contains roughly 300 individual checkboxes. Rather than pad rows, I have grouped them by requirement cluster and listed the behaviours I could and could not assess. If you want a literal one-row-per-checkbox matrix, that is a mechanical follow-up once browser access exists, because most rows would read NOT VERIFIED.

| # | Requirement | Expected | Evidence | Status | Root cause / finding | Impact | Recommended fix | Regression test |
|---|---|---|---|---|---|---|---|---|
| R1 | Canonical products ET-01…07 match names/prices | Names and prices per table | `src/data/products.ts` lines for each record | **PASS (data only)** | All 7 names and prices match the table. IDs are lowercase `et-01`…`et-07` rather than `ET-01`; slugs match titles. Images, detail pages and checkout not executed. | None on data; lowercase vs uppercase only matters if other systems expect `ET-xx`. | None required; confirm lowercase is intended. | Data-snapshot test asserting id/title/price for all 7. |
| R2 | Bag identity single source of truth | Bag line shows exact selected product | `CartContext.tsx`, `ProductDetailPage.tsx:163`, `SavedPiecesPage.tsx:204`, `TraditionExhibitionModal.tsx:566,754`, `BagPage.tsx` | **NOT VERIFIED** | See §5. No source defect found; live test not possible. | Reported defect cannot be confirmed or ruled out. | Reproduce in browser first. | Mixed-cart test (see §15). |
| R3 | Bag quantity/remove target the right line | Only intended line changes | `BagPage.tsx:177,195,234`; `CartContext.tsx` `removeFromBag`/`updateQuantity` | **PARTIAL (risk)** | Bag UI calls `updateQuantity(idx, ±1)` and `removeFromBag(idx)` with **array indices**. Correct while render order equals state order, but an index API is exactly the "array-index selection" pattern the checklist warns about. The context also accepts a `variantId` string, so a safer path already exists. | Latent wrong-line risk if the list is ever sorted/filtered or state changes between render and click. | Switch Bag UI to `variantId`. | Test: add A, B, C; remove B via variantId; assert A and C intact. |
| R4 | Cultural Collection exists | Dedicated route + cards + detail | `src/App.tsx`; repo-wide grep for "cultural collection" in `src`, `public`, `docs` returned nothing | **FAIL** | Not implemented. | Customers cannot browse or buy cultural garments. | Build only after data approval (§9). | Route and card tests. |
| R5 | Cultural garments orderable | Approved records flow to Bag/checkout | `CartContext.addToBag` ignores any ID not in `PRODUCTS` (`if (!prod) return`) | **BLOCKED** | No sellable cultural records exist, and unknown IDs are silently dropped. | A cultural item with a non-catalogue ID would silently fail to add, with no user feedback. That could be one source of the "wrong or missing item" experience. | Add approved records to the catalogue; surface add failures. | Add-by-ID tests for each approved record. |
| R6 | Atelier Lens source = selected image | Follows gallery selection | `ProductDetailPage.tsx:871-879` | **FAIL [CODE]** | `imageSrc={product.macroImage \|\| currentImage.src}`: the Lens uses `macroImage` whenever it exists, so changing the gallery image does not change the Lens source. | Lens shows the macro asset, not the image the customer is looking at. | Pass the active gallery image (or an explicit per-image hi-res source). | Test: select gallery image 3, open Lens, assert source equals image 3. |
| R7 | Lens zoom 3–5× and pointer mapping | Correct magnification and alignment | `AtelierLensModal.tsx:85-107, 192-222` | **PARTIAL (suspected defect) [CODE]** | Fixed `zoom=3.5` is within range. Viewport is `aspectRatio: 16/10` with `<img class="object-fit-cover">`, but the loupe sets `backgroundSize = rect.width*zoom × rect.height*zoom`, which stretches the image to 16:10. For portrait product images (the product defaults are 1024×1536) the loupe will not line up with the cropped visible image. Marked suspected because I did not run it. | Magnified area may not correspond to what is under the pointer. | Make loupe background sizing match the `object-fit` crop, or render with matching `contain`. | Visual test with a known landmark image. |
| R8 | Lens keyboard / focus | Open, operate and close by keyboard; focus handled | `AtelierLensModal.tsx:54-78, 159-161` | **PARTIAL [CODE]** | Esc closes; initial focus goes to the Close button; `role="dialog" aria-modal="true"`. No focus trap, no focus restore, and loupe movement is mouse/touch only, so there is no keyboard way to move the loupe. The image `alt` is the generic "Living weave macro inspection view" for every product. | Keyboard users can open and close but not inspect. Generic alt is not meaningful. | Add focus trap/restore, arrow-key panning, per-image alt. | Keyboard test. |
| R9 | Lens touch | Works without trapping scroll | `AtelierLensModal.tsx:128-135, 197` | **NOT VERIFIED** | Touch handlers exist and viewport sets `touchAction: 'none'`, which stops page scroll while touching the image area. Real-device behaviour unknown. | Possible scroll-trap on small screens. | Test on device. | Mobile manual test. |
| R10 | Lens on cultural garments | Works on approved records | n/a | **BLOCKED** | No cultural records. | — | — | — |
| R11 | Search built from real data | Real records only | `SearchModal.tsx:68-135` | **PASS-candidate (code), NOT VERIFIED live** | Product results use `p.title` and `p.price` from `PRODUCTS`; traditions, stories and journal from their data files; URLs from slugs. Nothing hand-written. | — | — | Test each result type against its source record and destination. |
| R12 | "Pleated Indigo Chanderi Tunic — ₹32,000" | Not shown unless a genuine product | repo grep | **See §10** | Not a product title in `products.ts`. Present only in `assetMap.ts` image alt text and folder path (`/images/products/pleated-indigo-chanderi-tunic/…`) and a legacy slug alias in `getProductBySlug`. | If alt text is surfaced anywhere (gallery, Lens caption), users still see the old name next to ET-04's ₹32,000. | Rename alt text to the canonical title; keep the legacy slug redirect. | Assert no gallery alt contains the legacy name. |
| R13 | Archive: 13 traditions × 6 roles | 78 base assets | `ls public/images/archive` | **PASS (file counts)** | 13 tradition folders each have all 6 base role WebPs, plus a `general` folder with none. Image-to-caption correctness NOT VERIFIED (needs visual check). | — | — | Asset-binding test already exists (8 cases); run it. |
| R14 | Archive→product links not arbitrary | Only verified relationships | `TraditionExhibitionModal.tsx:27-34` | **PARTIAL** | `TRADITION_PRODUCT_MAP` maps `banarasi-brocade→et-01`, `chanderi→et-04`, `kota-doria→et-04`, `pashmina→et-07`, `kashmiri-sozni→et-07`, `muga-silk→et-02`. Keys `chanderi` and `pashmina` do not match any of the 13 asset folder keys, so they may be dead entries (unless aliased elsewhere; not verified). `muga-silk→et-02` links Assam muga to a tussar trench, and `kota-doria→et-04` links Kota to a Chanderi-weave tunic. The code comment calls these "verified"; I found no evidence of that approval. | A tradition page can show "Acquire to Bag" for a garment that is not that tradition. The checklist forbids arbitrary mapping. | Ask you which mappings are approved; remove the rest. | Test: only approved traditions render Acquire. |
| R15 | `weave-14` and Folio 1.1 links | `/archive/the-art-of-the-drape`; `/archive?tradition=banarasi-brocade` | `ArchivePage.tsx:298,359`; `editorial-archive.test.tsx:189-198` | **PARTIAL** | weave-14 link exists in source and has a test. Folio 1.1 destination not located in a quick grep. Neither executed. | — | Confirm Folio 1.1 link. | Link-target tests. |
| R16 | Routes + direct refresh | Nested routes work on Pages | `public/404.html`, `index.html:36-40`, `main.tsx` | **PARTIAL** | SPA fallback follows the rafgraph pattern with `pathSegmentsToKeep = 1`, consistent with `/everthread/`. Live refresh NOT VERIFIED. | — | — | Manual refresh of `/everthread/archive`, `/product/<slug>`, `/archive?tradition=…`. |
| R17 | Asset paths under subpath | Images resolve | `vite.config.ts` | **PARTIAL** | Build-time string rewrite of `/images/` → `/everthread/images/` in JS chunks and `index.html` hrefs. It does **not** touch CSS (I found no `/images/` URLs in `src/styles`, so currently harmless) and would mangle any unrelated string containing `/images/`. Fragile but functioning in principle. | Future CSS `url(/images/…)` would break on Pages. | Prefer `import.meta.env.BASE_URL`. | Build, then grep `dist` for un-prefixed `/images/`. |
| R18 | Manifest/icons | Paths resolve | `site.webmanifest`, `index.html:18-22` | **PARTIAL** | Manifest icon paths are relative (resolve correctly beside the manifest). `index.html` hrefs rely on the rewrite plugin. Manifest has no `start_url`/`scope`. | Minor PWA behaviour. | Optional. | — |
| R19 | Motion hook cleanup | Timelines/triggers killed | `useEditorialScroll.ts:70,150,216-221` | **PARTIAL [CODE]** | Uses a GSAP context with `ctx.revert()` on unmount; reduced-motion and test environments settle elements immediately. Whether motion is *perceptible* is NOT VERIFIED on every route. | — | — | Reduced-motion and visibility tests. |
| R20 | Loader | Approved hand + thread, optimized, fast | `ThreadLoader.tsx`, `index.html:26`, `App.tsx` | **PARTIAL** | WebP exists (`everthread-loader-hand-clean.webp`) and is preloaded with high priority; PNG variants remain in `public`. The loader is dismissed by a **fixed 750 ms timer**, not by asset readiness. No size or timing measured. | Loader may hide before the image paints on a slow connection, or hold the site 750 ms on a fast one. | Tie dismissal to image load with a cap. | Cold-load timing measurement. |
| R21 | Checkout simulated, matches Bag | Summary equals Bag | `CheckoutPage.tsx` (848 lines) | **NOT VERIFIED** | Not read in depth. | — | — | Checkout-vs-Bag test. |
| R22 | Saved items | Correct identity and add-to-Bag | `SavedPiecesPage.tsx:195-210` | **PARTIAL [CODE]** | Saved resolves by `getProductById`. Move-to-Bag passes `item.productId`, size and colour. Behaviour not executed. | — | — | Existing saved-and-bag tests (19 cases) once run. |
| R23 | Colour/size selectors real | Data-backed | `products.ts` colours/sizes; `ProductDetailPage.tsx` | **PARTIAL [CODE]** | Each product defines named colours and sizes, and the Bag line stores the chosen colour/size. Whether selecting a colour changes the displayed image was not checked. If it does not, the colour control is a decorative selector that fails the checklist. | Possible fake control. | Check in browser. | — |
| R24 | Responsive / accessibility / reduced motion across routes | Per checklist | — | **NOT VERIFIED** | No browser. | — | — | — |
| R25 | Tests, `tsc`, build | Pass | — | **NOT VERIFIED** | Not run. The CI workflow runs all three on push to `main`. | — | — | `npm test`, `npx tsc --noEmit`, `npm run build`. |

---

## 5. Bag / product identity findings (priority 1)

Traced path [CODE]:

1. Source record: `PRODUCTS[]` in `products.ts` (stable `id`).
2. Product detail `handleAddToBag` passes `productId: product.id` with size and colour (`ProductDetailPage.tsx:163`). The product comes from the route slug via `getProductBySlug`.
3. Saved page passes `item.productId` (`SavedPiecesPage.tsx:204`). Archive modal passes `associatedProduct.id` (`TraditionExhibitionModal.tsx:566, 754`).
4. `CartContext.addToBag` looks the product up by ID; if absent it **returns silently**; otherwise it merges lines on `productId + size + color` or appends one.
5. Bag state stores only `productId`, `variantId`, `size`, `color`, `quantity`. Name, image and price are resolved from the catalogue at render time through `getItemProduct`, and the subtotal is recomputed from the catalogue. Stored prices cannot go stale.

What I did **not** find: hard-coded fallback IDs, `PRODUCTS[index]` selection in the add path, or duplicate IDs. `PRODUCTS[0]` appears once, as the homepage `flagshipProduct` (`HomePage.tsx:421`); it is a display choice and I did not trace whether any Add to Bag control is attached to it.

What is risky:

- Bag quantity/remove use array indices (R3).
- Silent drop of unknown IDs (R5): a cultural item from any non-catalogue source would never appear and would give no error.
- The Archive modal's Acquire button adds `sizes[0]` and `colors[0]` automatically with no customer choice, so the customer gets a default variant they did not pick.
- Persisted Bag items are validated against the *current* catalogue on load, so renamed or removed IDs vanish silently from a returning customer's Bag.

**Conclusion:** I cannot confirm or refute your reported "wrong cultural garment in Bag" defect. Given that cultural garments are not in the catalogue, the most probable explanations from source are (a) the Archive "Acquire to Bag" button adding the *mapped* product (e.g. Kota Doria → ET-04) rather than anything the customer thought they were buying, or (b) an earlier version that is no longer in this commit. Both are hypotheses, not findings. Live reproduction at the deployed commit is required.

---

## 6. Cultural Collection and sellable garment audit

- No route, page, component, data file or test for a Cultural Collection (grep across `src`, `public`, `docs`: zero hits).
- The only "cultural" commerce is the Archive bridge: six tradition keys → four existing products (§R14).
- 14 weave records exist in `stories.ts` (`weave-1`… through `weave-14`, the last being "Uncut Radial Bias Draping", a draping record rather than one of the 13 asset-backed traditions). None is a sellable record, and none should be treated as one.
- Status: **FAIL** (not built), with downstream **BLOCKED** on approvals (§9).

---

## 7. Atelier Lens audit

See R6–R10. Summary: open/close and Esc exist; the Lens source on product pages is `macroImage`, not the selected gallery image; zoom maths likely misaligns for non-16:10 sources; alt text is generic; no keyboard panning; no focus trap or restore; touch behaviour unverified. Homepage Lens uses a fixed home image, which is appropriate for that placement. Cultural Lens: BLOCKED. Whether source images are high-resolution enough for 3.5× was not measured.

---

## 8. Route-by-route animation audit

**Not verified on any route.** I can state only the source facts: a shared `useEditorialScroll` hook with ScrollTrigger batching and `ctx.revert()` cleanup, reduced-motion and test-environment short-circuits, a `motion-homepage` test file (41 cases) that runs in jsdom and therefore cannot judge perceptibility, and a `ScrollTrigger.refresh()` call in the hook. Whether motion is visible at normal scroll speed (your original complaint), whether any content stays hidden if GSAP fails to initialise, and whether the 404 page, Journal, House, Saved, Bag and Checkout use the hook at all were not checked in source. These need a browser pass.

---

## 9. Missing data and approvals needed from you

1. Is a Cultural Collection to be built at all? If yes, supply for each sellable garment: stable ID, display name, price, image set, tradition association, available sizes/colours, and any provenance wording you approve.
2. Which Archive→product mappings are genuinely approved? Specifically `kota-doria→ET-04`, `kashmiri-sozni→ET-07`, `muga-silk→ET-02`, `banarasi-brocade→ET-01`. Remove or approve each.
3. Confirm lowercase `et-01`…`et-07` IDs are acceptable versus the uppercase form in your checklist.
4. Confirm that the legacy "Pleated Indigo Chanderi Tunic" name should be retired from image alt text and folder names (the legacy slug can stay as a redirect).
5. Should the Archive "Acquire to Bag" button choose the first size and colour automatically, or require selection?

---

## 10. Search and Chanderi result audit

- Search index: products, 14 weave records (labelled "13 traditions" in code comments), stories and journal articles, all from data modules.
- "Pleated Indigo Chanderi Tunic — ₹32,000": **not** produced by the current code, because product results use the catalogue title ("Angrakha Asymmetric Sheer Tunic") and price. The old name lives in `assetMap.ts` alt text (e.g. "Pleated Indigo Chanderi Tunic — Editorial Silhouette"), the image folder name, and the legacy slug `the-pleated-indigo-chanderi-tunic → et-04`. I did not map it to another product; it is simply a stale name for ET-04's images.
- If you saw this result on the live site, either the deployed build predates the current commit or a different code path surfaced the alt text. **NOT VERIFIED**; needs a live search.
- The existing `search.test.tsx` has only 5 cases, and `phase-7-3-commerce-lens.test.tsx` tests Chanderi→ET-04 as *intended* behaviour, which is the mapping in question.

---

## 11. Loader and performance

See R20. Not measured: bytes, load time, first paint, reduced-motion behaviour. No performance claim is made.

---

## 12. Saved, collections, product detail, checkout

Only partially read (R21–R23). `CollectionsPage.tsx` has material/colour/craft/price filter definitions that I did not trace; "functional filters" and "no hidden cards after filtering" are NOT VERIFIED.

---

## 13. Responsive design and accessibility

NOT VERIFIED at all three viewports. Source-level observations only: Lens has `aria-modal`, a labelled title and a labelled close button; the Search modal focuses its input on open and closes on Esc (focus restore on close not checked). Archive keyboard-hint contrast and mobile behaviour were not examined.

---

## 14. Technical configuration and GitHub Pages

See R16–R18. Additionally: the CI workflow runs tests, typecheck and build before deploying, which is good practice. It deploys on every push to `main`. The global `/` shortcut opens Search unless an input or textarea is focused.

---

## 15. Tests and commands actually run

| Command | Result |
|---|---|
| `git clone --depth 1 …` into scratch | Succeeded (commit `ebf7b6b`) |
| File listing and `grep` over source | Done |
| `curl` GitHub Actions / Pages API | **Failed: rate limited** (no status obtained) |
| `web_fetch` of the `/archive` URL | Client error |
| `npm test`, `npx tsc --noEmit`, `npm run build` | **Not run** |

Post-fix tests I recommend: all existing Vitest suites; plus new tests for (a) mixed-cart identity with three distinct products, remove-by-variantId and quantity isolation; (b) Lens source follows the selected gallery image; (c) Archive Acquire only appears for approved mappings and adds the selected variant; (d) no gallery alt contains the legacy Chanderi name; (e) add-to-bag of an unknown ID shows an error; (f) browser checks of the three viewports, reduced motion, refresh on nested routes.

---

## 16. Confirmed root causes (source evidence only)

1. Lens source ignores gallery selection — `ProductDetailPage.tsx:874`.
2. Lens loupe background sizing does not follow `object-fit: cover` — `AtelierLensModal.tsx:104-105, 205` (suspected, unexecuted).
3. Bag mutations are index-based — `BagPage.tsx:177,195,234`.
4. Unknown product IDs are dropped silently — `CartContext.tsx` `addToBag`.
5. Stale "Pleated Indigo Chanderi Tunic" name in ET-04 image alt text and folder — `assetMap.ts` (~lines 244–273).
6. Unapproved/possibly dead Archive→product mappings — `TraditionExhibitionModal.tsx:27-34`.
7. Loader dismissal on a fixed 750 ms timer — `App.tsx`.
8. No Cultural Collection implementation.

## 17. Prioritised remediation plan (do not start until you approve)

- P0: Reproduce the Bag defect in a browser at the live commit; decide the cultural data (§9); switch Bag to variantId; surface failed adds.
- P0: Fix Lens source and loupe mapping; add keyboard panning and focus trap.
- P1: Clean Chanderi alt text; resolve Archive mappings; verify search live.
- P1: Route-by-route motion pass in a browser; Archive instruction readability.
- P2: Loader readiness-based dismissal; viewport and accessibility pass; CSS/base-path hardening.

## 18. Summary of status

- **Confirmed broken (source):** no Cultural Collection; Lens product-page source ignores selected image.
- **Confirmed working (data only):** seven canonical names and prices; 13 × 6 archive base images on disk; search built from data models; CI pipeline structure.
- **Partial / risky:** Bag index API; Archive mappings; Lens zoom/keyboard; loader timing; Pages routing config.
- **Blocked:** cultural ordering, cultural Lens, cultural search results.
- **Not verified:** all live behaviour, motion, responsive layouts, accessibility in practice, loader performance, tests, typecheck, build, deployment status.

Waiting for your approval before any code change.
