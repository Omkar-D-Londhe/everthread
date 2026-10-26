# EverThread — Full Project Audit (ZIP-based, with real-browser testing of a local build)

**Audited source:** uploaded ZIP, `.git` HEAD `ebf7b6b` ("fix: resolve asset paths for both local dev server and GitHub Pages subpath", 2026-10-22), working tree clean. This is the same commit as the earlier GitHub-clone audit, so the exact commit **is confirmed**.
**Not audited:** the deployed GitHub Pages site. `omkar-d-londhe.github.io` does not resolve from my environment, so nothing below is a statement about the live site.

Companion files: `everthread_requirements_matrix.md` / `.csv` (355 rows, one per checklist checkbox), `runtime_checks/` (the scripts I ran, re-runnable), two screenshots.

---

## 0. What I could actually do (corrections to my earlier report included)

My earlier report said I had no browser and could not run anything. **That was wrong for this environment.** I had stopped at "don't install anything" for the first task. This time I checked, and:

| Capability | Result |
|---|---|
| Unzip and read all source, `.git` history | Yes |
| `npm ci` in a **scratch copy** (your upload untouched) | Yes, succeeded |
| `npx vitest run` | **15 files, 251 tests passed** (only warnings: React Router future-flag notices) |
| `npx tsc --noEmit` | **exit 0** |
| `npx vite build` | **succeeded**; `dist` ≈ 91 MB; 0 un-prefixed `/images/` strings in JS |
| Real browser | **Yes** — headless Chromium via Playwright, driving the production build served by a small static server that mimics GitHub Pages (`404.html` returned with HTTP 404 for unknown paths) |
| Viewports | 1440×900, 1024×768, 390×844 |
| Live GitHub Pages | **No** (DNS does not resolve; fetch tool returns an error for `/archive`) |
| Actions status | Partial: the Actions HTML page lists 10 runs, #4–#10 successful, #10 on `ebf7b6b` (read from page HTML, logs not read) |
| Google Fonts | **No** (no external DNS), so my screenshots use fallback fonts |

Evidence labels used everywhere: **[browser]** observed in that local build · **[source]** read in code · **[measured]/[computed]** numeric · **[screenshot]** I viewed the image.
A green CI run proves tests/tsc/build passed *in CI*; it cannot prove nested-route refresh, live asset loading, fonts, or anything visual.

**Corrections to my previous report:**
1. Loader: I said dismissal is a fixed 750 ms. Wrong. `App.tsx` has a 750 ms timer, but `ThreadLoader` enforces `minDisplayTimeMs` = **1900 ms** plus a 400 ms fade. **Measured: loader visible ≈ 2.3–2.6 s** on every full page load; **≈ 1.04 s** under reduced motion.
2. Archive map keys `chanderi` / `pashmina`: I said they might be dead. Confirmed: lookup is by the resolved record's `traditionKey`, so those two keys are never used; `?tradition=chanderi` opens the Kota Doria record and `pashmina` opens Kashmiri Sozni. Harmless dead entries.
3. Folio 1.1: I could not find its link before. It exists on the Living Loom monograph page (`/archive?tradition=banarasi-brocade`) and works.

---

## 1. Executive summary

**Confirmed defects (reproduced in the local build)**
- **Archive "Acquire to Bag" puts a different garment in the Bag than the one being viewed.** Open `/archive?tradition=muga-silk`: the page shows an Assam muga *sari*; the "Repertoire Lineage" card offers *Ivory Raw Tussar Cocoon Trench ₹1,12,000* with "Acquire to Bag". This is almost certainly what you experienced as "wrong item in the Bag". **It is not a state bug**: Bag identity is correct for everything I added. It is a product-mapping decision (see D-01).
- **Atelier Lens ignores the selected gallery image** (5 of 6 images on ET-01 opened the same detail image).
- **Lens keyboard focus escapes the dialog** after 5 Tab presses despite `aria-modal`.
- **Loader forced to ≈ 2.3 s+** regardless of readiness.
- **Legacy "Pleated Indigo Chanderi Tunic" wording is still rendered** as `alt` text on five ET-04 gallery images.
- **Search "radial bias draping" result opens nothing** (`/archive?tradition=radial-bias-draping`).
- **Mobile (390 px) content extends beyond the viewport** on 4 routes and is clipped by `overflow-x: hidden` (up to 38 px).
- **Archive plate captions are filename-like** ("archive muga silk model 01").

**Missing requirements:** Cultural Collection (route, data, cards, PDP, Bag path, Lens, search entries) — confirmed absent.

**Needs your approval:** whether any cultural garment is sellable and its data; which of the four Archive→product mappings stay; whether colour swatches are real variants.

**Working (directly tested, local build):** mixed-cart identity for regular products, quantity/remove/subtotal, merge-vs-new-line behaviour, reload persistence, header badge, Saved save/link, checkout validation → review → demo confirmation (explicitly simulated, no card fields), all 13 Archive exhibitions open with images loading, 4 story routes, Journal links, branded 404, legacy slugs, query/hash survive the Pages fallback (emulated), reduced-motion visibility, 544/544 referenced image files exist, 9/9 diagrams with SVG+PNG files present.

**Runtime behaviour still untested:** the live site; touch-drag in Lens on a real device; visual quality/perceptibility of motion; Lens on ET-02…07; image-failure states; tablet visual review; real-font rendering; Lighthouse/axe.

**Coverage, stated honestly** (checklist only, 355 rows): PASS 83 · FAIL 21 · PARTIAL 107 · SOURCE RISK 3 · SOURCE VERIFIED 17 · NOT VERIFIED 94 · BLOCKED 11 · NEEDS APPROVAL 19. About **130 rows rest on direct browser/measurement evidence**, 26 on source reading alone; the rest are process items or judgement calls. "PASS" means passed in the local build, not on the live site.

---

## 2. Specification inventory (24 Markdown files in the ZIP + the separately attached checklist)

I must be candid: **I did not read every document line by line.** Per your rule the audit is therefore *not complete* on this dimension.

| File | Purpose | Review depth |
|---|---|---|
| `EverThread_Complete_Functionality_Acceptance_Checklist.md` (attached; not in ZIP) | Authoritative acceptance spec, 355 checkboxes | **Read in full** → matrix |
| `docs/instructions.md` | Original implementation brief (catalogue, pages, guardrails) | **Read in full** |
| `docs/EverThread_Implementation_Brief.md` | Agreed routes, stack, process gates | Targeted extraction (routes, rules) |
| `docs/EverThread_Phase_6_3_2_2_Immersive_Textile_Exhibition_Spec.md` | Exhibition spec; §13 protected data | §13 and header only |
| `docs/EverThread_Remaining_Project_Roadmap.md` | Phase plan, invariants | Headings + grep only |
| `README.md`, `docs/PROJECT_STRUCTURE.md`, `docs/FILE_USAGE_AUDIT.md` | Architecture/deploy notes | Headings + grep (README), header only (others) |
| `docs/phase_7_3_comprehensive_audit_report.md` | Remediation incl. canonical rename | Categories 2 and 7 read |
| `docs/phase_7_3_visual_commerce_corrections_report.md` | Chanderi/Archive commerce claims | Matrix and §1 read |
| `docs/phase_6_6_preflight_audit.md` | Pre-release verification | §4.2 read |
| `docs/phase_7_0`, `7_1`, `7_2` ×2 reports | Release/deploy/motion/Lens reports | Titles/status only |
| `docs/phase_6_3_1`, `6_3_2`, `6_3_2_1`, `6_3_2_2` ×4, `6_3_2_2_1`, `6_3_2_2_3`, `6_4` ×2, `6_5` ×2 | Image, exhibition, Compass, monograph reports | Titles/status only |

**Not yet extracted into matrix rows:** requirements that exist only in the non-checklist documents (e.g. instructions.md page-by-page rules). I did not fabricate rows for them. I can extend the matrix document by document if you want.

### Specification conflicts and reconciliation

| Topic | Statement A | Statement B | Decision |
|---|---|---|---|
| ET-02/04/05/06/07 names | `instructions.md` §5 (earliest): ET-02 "Ivory Structured Raw Silk Coat", **ET-04 "Pleated Indigo Chanderi Tunic"**, ET-05 "Oxblood Structured Box Calf Leather Bag", ET-06 "Handspun Mulberry Silk Scarf in Burgundy", ET-07 "Fine Pashmina & Zari Reversible Stole in Ivory" | Exhibition Spec §13, checklist §3, `phase_7_3_comprehensive_audit_report`, `products.ts`: Raw Tussar Cocoon Trench / **Angrakha Asymmetric Sheer Tunic** / Box-Calf Structured Frame Bag / Hand-Rolled Mulberry Twill Scarf / High-Altitude Hand-Spun Pashmina Stole | **B applies.** instructions.md itself allows a "newer, explicitly approved catalogue", the later Exhibition Spec and your checklist declare B protected, and git shows the rename in `b81b5b5`. |
| Same, in `phase_7_3_visual_commerce_corrections_report` | Calls Chanderi tunic and Ivory Structured Raw Silk Coat canonical | `phase_7_3_comprehensive_audit_report` (39 min later) | Visual report is **superseded** (commits `4f7b0d1` 01:37 → `b81b5b5` 02:16 on 10-22). |
| `phase_6_6_preflight_audit.md` §4.2 | Lists a seventh-product set unlike any other (e.g. ET-01 "Sylvan Mulberry Silk Trench", ET-02 ₹58,000, ET-04 ₹32,500) | All other docs | **Treated as erroneous/stale** → NEEDS APPROVAL to confirm; matches nothing in code. |
| Product route | `instructions.md`: `/products/:productId`, `/house` | Brief "Agreed routes", checklist, code: `/product/:slug`, `/the-house` | Brief + checklist + code apply. |
| Price formatting | instructions.md ₹1,12,000 vs a report ₹112,000 | — | Cosmetic; code uses Indian grouping. |

---

## 3. Architecture summary [source]

React 18 + TypeScript + Vite 6, React Router 6 (`basename = import.meta.env.BASE_URL`), GSAP via one shared hook (`useEditorialScroll.ts`), Vitest. State: `CartContext` (localStorage `everthread_bag_v2`, cross-tab `storage` sync, lines keyed `productId+size+color`, name/image/price resolved from the catalogue at render so stored prices cannot go stale), `SavedContext`. Catalogue: `products.ts` (7 records). Archive: `assetMap.ts` (13 traditions × 6 roles, 9 diagrams), `stories.ts` (4 monographs + 14 weave records), `TraditionExhibitionModal.tsx` (with `TRADITION_PRODUCT_MAP`). Routes: `/`, `/collections`, `/product/:slug`, `/compass`, `/archive`, `/archive/:storySlug`, `/the-house`, `/journal`, `/journal/:articleSlug`, `/saved`, `/bag`, `/checkout`, `*`. Deployment: `.github/workflows/deploy.yml` (npm ci → test → tsc → build → Pages), `public/404.html` SPA restore, build plugins that prefix `/images/` with `/everthread/`.

---

## 4. Defect and risk register

| ID | Sev | Type | Defect | Files / routes | Evidence | Repro | Proposed fix |
|---|---|---|---|---|---|---|---|
| D-01 | **High** | Confirmed (design/data) | Archive "Acquire to Bag" adds a catalogue garment unrelated to the tradition viewed; first size/colour auto-chosen | `TraditionExhibitionModal.tsx` (`TRADITION_PRODUCT_MAP`, add handlers); `/archive?tradition=muga-silk`, `kota-doria`, `kashmiri-sozni`, `banarasi-brocade` | [browser] Muga → Bag = Ivory Raw Tussar Cocoon Trench; Kota Doria → Angrakha tunic; Sozni → Pashmina stole; Banarasi → Coat-Dress. [screenshot] | Open URL → Acquire → `/bag` | Needs your approval per mapping; remove unapproved ones; rename card "Shop a related piece"; require size/colour |
| D-02 | **High** | Missing | No Cultural Collection (route, data, cards, PDP, Bag path, Lens, search) | `App.tsx`, `src/data` | [source] zero references | — | Build only after approval (§7) |
| D-03 | **High** | Confirmed | Lens ignores selected gallery image | `ProductDetailPage.tsx` (`imageSrc={product.macroImage \|\| currentImage.src}`) | [browser] ET-01: images 1–5 opened Lens on detail-01; only the one equal to detail-01 matched | Select plate N → Inspect fabric | Pass the active image (or a per-image hi-res source) |
| D-04 | Med | Confirmed + computed | Lens loupe mapping and resolution | `AtelierLensModal.tsx` | [measured] viewport 878×522 (aspect 1.68) vs image natural 1536×1024 (1.5) → loupe stretches, `<img>` crops (cover): offset up to ≈5% of image height; loupe background 3073 px vs 1536 px native (~2× upscale); [browser] focus escapes dialog after 5 Tabs; focus not returned to trigger; generic alt | Hover edges; Tab×5 | Match loupe sizing to the crop; focus trap/restore; arrow-key panning; per-image alt; resolution note |
| D-05 | Med | Confirmed | Forced loader delay | `ThreadLoader.tsx` (`minDisplayTimeMs=1900` + 400 ms fade), `App.tsx` 750 ms timer | [measured] 2.3–2.6 s normal; 1.04 s reduced-motion | Load `/` or any deep link | Dismiss on asset-ready with a short cap |
| D-06 | Med | Confirmed | Legacy "Pleated Indigo Chanderi Tunic" strings remain | `assetMap.ts` (alt text), image folder `products/pleated-indigo-chanderi-tunic/`, legacy slug in `getProductBySlug` | [browser] five ET-04 gallery `alt`s use it; search is clean | Open ET-04, read img alts | Rename alt text; **keep** legacy slug; folder rename optional |
| D-07 | Med | Confirmed | Search "radial bias draping" → `/archive?tradition=radial-bias-draping` opens no exhibition; multi-word phrases ("Indigo Chanderi Tunic") return 0 | `SearchModal.tsx`, `ArchivePage.tsx` | [browser] | Search "radial" → click | Point to `/archive/the-art-of-the-drape`; tokenise matching |
| D-08 | Med | Confirmed | 390 px overflow clipped by `overflow-x:hidden` (PDP gallery, Archive story button +38 px, Journal link +13 px, header icon +5 px) | PDP, `/archive/:slug`, `/journal`, header | [measured] | Open at 390 px | Fix widths/wrap |
| D-09 | Low | Confirmed | Plate captions look like filenames | `assetMap.ts` captions | [screenshot] | Any exhibition | Approved caption copy |
| D-10 | Low | Source risk | Bag mutations use array indices; unknown IDs silently dropped; minus at 1 deletes line | `BagPage.tsx`, `CartContext.tsx` | [source]; [browser] minus-at-1 removed the line | — | Use `variantId`; surface add failures; confirm minus behaviour |
| D-11 | Med | Needs approval | Colour swatches change colour name/Bag variant but not the image | `ProductDetailPage.tsx` | [browser] ET-01 (3), others (2) | Click swatch | Add colourway images, or relabel, or remove |
| D-12 | Low | Confirmed | Closing exhibition leaves `?tradition=…` in URL (refresh reopens); focus restore untested | `TraditionExhibitionModal.tsx`/`ArchivePage.tsx` | [browser] | Esc then read URL | Clear param on close |
| D-13 | Low | Computed | Champagne focus ring 2.57:1 on ivory | CSS focus style | [computed] | — | Use oxblood/espresso ring |
| D-14 | Info | Confirmed | `/product/ET-01` (upper case) → not found while `/product/et-01` works; legacy slugs resolve without canonical redirect | `getProductBySlug` | [browser] | — | Case-insensitive lookup; optional redirect |
| D-15 | Info | Doc risk | Stale specs contradict code (names, routes) | `docs/` | §2 | — | Mark superseded |
| D-16 | Info | Observation | Heavy assets: Archive ≈ 3.7 MB after scroll; `dist` ≈ 91 MB | — | [measured] | — | Lighthouse; lazy-load review |

Seven canonical products: **names and prices match the table [source]**; IDs are lowercase `et-01…et-07`.

---

## 5. Specific investigations

**A. Cultural Collection:** nothing exists. Needed from you per garment: stable ID (not ET-01…07), display name, price, images, tradition association (only if verified), real sizes/colours (or none), approved wording. Educational Archive records are correctly not sellable; the four bridges are the only commerce hook.

**B. Wrong item in Bag:** Tested [browser]: add ET-01, ET-04, ET-07 → Bag lines exact; qty+ and remove hit only intended lines; same variant merges (×2), different size separate; subtotal ₹1,02,000 after removal; reload persisted; checkout total ₹2,05,500 for 3 × ₹68,500; empty-bag guard present in source. Patterns found [source]: index-based Bag mutations (**present**, low immediate risk) and silent ignore of unknown IDs (**present**). **I could not reproduce a state-level wrong-item bug.** The reproducible "wrong item" is D-01.

**C. Atelier Lens:** D-03, D-04. Not tested: touch-drag, ET-02…07, image-failure states.

**D. Archive mappings** (what code maps; I found no approval record):
| Tradition (record) | Maps to | Assessment |
|---|---|---|
| banarasi-brocade | ET-01 Oxblood Wool-Silk Signature Coat-Dress | Plausible garment link; **approve** |
| kota-doria (also alias `chanderi`) | ET-04 Angrakha Asymmetric Sheer Tunic | Kota Doria ≠ Chanderi; ET-04 was formerly the "Chanderi tunic" → **NEEDS APPROVAL** |
| kashmiri-sozni (alias `pashmina`) | ET-07 Pashmina stole | Instructions: don't imply all pashmina is Sozni-embroidered → **NEEDS APPROVAL** |
| muga-silk | ET-02 Ivory Raw Tussar Cocoon Trench | Muga sari vs tussar trench → **likely wrong; NEEDS APPROVAL** |
| other 9 | none | Correctly protected by a curatorial notice |

**E. Chanderi wording:** origin = baseline catalogue (`2c8a3cd`) and `instructions.md`; ET-04 was renamed to Angrakha in `b81b5b5` (10-22 02:16). If you saw it on the deployed site, that deployment predated `b81b5b5`. In the current build, searching "Chanderi" returns only ET-04 Angrakha Asymmetric Sheer Tunic — ₹32,000 [browser]. Residual wording: D-06.

**F. Loader/motion:** D-05. Reveals exist on PDP, Archive, House, Journal (51/51/32/21 hidden-at-load nodes become visible after scroll); **no content stayed invisible after full scroll on any of 13 routes** (the 152 hidden nodes on `/collections` are the closed mobile filter drawer, by design). Under reduced motion everything is visible at load. Whether the motion is *perceptible and polished* is untested (human judgement).

**G. Deployment/routing:** workflow runs tests+tsc+build before deploy (I reproduced all three green). CI **can** detect: type errors, failing unit tests, build failures. It **cannot** detect: wrong live base path, 404-fallback behaviour, fonts, image quality, any visual/behavioural defect (all of D-01, 03, 05…). Local emulation of the Pages fallback restored path/query/hash correctly for 18 routes; **real Pages unverified**.

---

## 6. Runtime checks still required (need you or a live-capable browser)
1. Open live `/everthread/archive`, `/product/...`, refresh each; confirm assets and fonts.
2. Lens touch-drag on a phone; Lens on ET-02…07.
3. Human review of motion on each route (screen recording).
4. Tablet (1024×768) visual pass of the Archive.
5. Lighthouse + axe on `/`, `/collections`, PDP, `/archive`.
6. Confirm Actions run #10 log is green and the live site matches `ebf7b6b`.

## 7. Decisions and data I need from you
1. Cultural Collection: build or not; if yes, full data per garment (§5A).
2. Approve/reject each Archive→product mapping (§5D).
3. Colour swatches: real colourways (with images), or remove?
4. Which catalogue naming is final — confirm Angrakha et al. (checklist/spec/code) and that `instructions.md` and `phase_6_6_preflight` are retired.
5. Captions copy for the 78 plates (or approve a rule).
6. Minus at qty 1: delete (current) or clamp?
7. Loader target time.

## 8. Prioritised remediation plan (not started)
**P0:** D-01 (after approval), D-03, D-02 (after data). **P1:** D-04, D-07, D-06, D-05, D-08. **P2:** D-09–D-14, doc cleanup, Lighthouse/axe, regression tests (selected-image Lens, mixed cart, archive acquire mapping, alt text, dead search links).

## 9. Run it yourself (PowerShell, from the project folder)
```powershell
npm ci
npx vitest run
npx tsc --noEmit
npm run build
npm run dev          # then open the printed URL
```
To reproduce my browser checks: `pip install playwright` then `playwright install chromium`, run `python runtime_checks/pages_server.py` (serves `dist/` at `/everthread/` on port 4173 with Pages-style 404) and then e.g. `python runtime_checks/flow.py`. Scripts hard-code `http://127.0.0.1:4173/everthread` and the sandbox path of `dist`; adjust `ROOT` in `pages_server.py`.

## 10. Coverage statement
Requirements extracted: **355** (checklist) + 0 numbered rows from other documents. Traced to implementation: 355 (all rows carry a file/route mapping). Directly tested in a local browser/measured: ≈130. Status counts: PASS 83, FAIL 21, PARTIAL 107, SOURCE RISK 3, SOURCE VERIFIED 17, NOT VERIFIED 94, BLOCKED 11, NEEDS APPROVAL 19. Unread/partly read documents: see §2 table (14 documents at title level only; 7 targeted extraction only). Reasons for NOT VERIFIED/BLOCKED: human-perception items, untested interactions, no live access, no cultural data. **The audit is not complete** against your "every document read" criterion.
