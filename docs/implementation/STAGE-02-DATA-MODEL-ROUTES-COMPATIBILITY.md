# STAGE-02 — Data Model, Catalogue Boundaries, Routes, Search and Compatibility

## 1. Purpose and rationale
Everything later (Lens, TR products, walls, Archive links) needs a safe data foundation. This stage adds the traditional product model **without fabricating required fields**, separates the two catalogues, fixes search and legacy routes, removes the unsafe Archive "Acquire" mapping, and corrects known data defects. No TR product is publicly purchasable yet.

## 2. Prerequisites and dependencies
STAGE-01 PASS. Baseline tests green. `docs/baseline/ASSET_VERIFICATION.md` exists.

## 3. Scope and exclusions
In: types, data files, lookup functions, legacy route redirects, search, archive relationship data and removal of Acquire, ET-02 title, ET-04 alt text, provenance/credit fields, test updates. Out: any visible TR page, Lens, cart changes for sets (Stage 4), wall routes UI (Stage 5), Archive redesign (Stage 7), image work.

## 4. IDs
F-05, F-09, F-11, F-16, F-27, F-32, F-39, F-40, F-42, F-44; O-2, O-7, O-8, O-9, O-11; DEC D-15, D-19, D-20.

## 5. Current-state evidence
`src/types/catalog.ts`: `Product` requires `artisanHours`, `warpDensity`, `origin`, `edition`, `leadTime`, `statusDisclaimer`; `ProductCategory` has 4 values; sizes are `string[]`. `src/data/products.ts` exports `PRODUCTS` (7 ET), `getProductById` (L332), `getProductBySlug` (L336). `PRODUCTS` is imported by `SearchModal.tsx`, `TraditionExhibitionModal.tsx`, `utils/compassMatcher.ts`, `ProductDetailPage.tsx`, `CollectionsPage.tsx`, `HomePage.tsx`. `TraditionExhibitionModal.tsx` L27 `TRADITION_PRODUCT_MAP` and add-to-bag calls (about L566, L754). `SearchModal.tsx` L101 builds `/archive?tradition=${w.traditionKey || w.slug}`; matching is whole-phrase. ET-04 gallery alt in `assetMap.ts` (about L244–273) uses "Pleated Indigo Chanderi Tunic". `/product/ET-01` is not found. `/archive/<legacy-slug>` shows "Exhibition Folio Not Found" while `?tradition=<legacy>` works (9 of 9).

## 6. Files affected
`src/types/catalog.ts`, `src/data/products.ts`, **new** `src/data/traditionalProducts.ts`, **new** `src/data/archiveRelations.ts`, **new** `src/data/legacyRoutes.ts`, `src/data/assetMap.ts` (alt text, image type), `src/components/SearchModal.tsx`, `src/components/TraditionExhibitionModal.tsx`, `src/pages/ArchiveStoryPage.tsx` or `src/App.tsx` (redirect), `src/pages/ProductDetailPage.tsx` (narrowing and not-available state only), `src/utils/compassMatcher.ts` (verify, import rename only), tests listed in §10.

## 7. Ordered implementation instructions
1. Branch per §15. Run the full gate first and record.
2. **Types.** In `catalog.ts` add `ProductBase` (id, slug, title, subtitle, category, price, currency, description, colors, image fields, gallery, relatedStorySlugs, careInstructions, contentFlags, provenance fields). Keep `Product` exactly as today for ET (so ET code compiles unchanged). Add `TraditionalProduct extends ProductBase` with: `collection: 'traditional'`, `pieces: {key: string; label: string; sizes: string[]}[]`, `includes: string[]`, `materials: {part: string; composition: string}[]` (concept specification), `colorways`-compatible `colors`, `story: string`, `inspiration: {traditionKey: string; label: string}`, `statusText` (constant `TR_STATUS_TEXT`), `conceptNotice` (constant `CONCEPT_NOTICE_TEXT`), `isListed: boolean`. **Do not** add `edition`, `artisanHours`, `warpDensity`, `origin`, `leadTime` or dispatch values to TR records. Export `CatalogueProduct = Product | TraditionalProduct` and `isTraditional(p)`. Extend `ProductCategory` with `'Gowns & Drapes' | 'Sets & Co-ords'` (assigned: TR-01 Outerwear, TR-02 Gowns & Drapes, TR-03/04/06 Sets & Co-ords, TR-05 Outerwear, TR-07 Gowns & Drapes).
3. **Image type.** In `assetMap.ts` add optional `provenance`, `creditText`, and ensure `alt` on `ResponsiveImage`. Add `ImageProvenance` union per `02_…` §E. Do not change any visible text.
4. **TR records.** Create `traditionalProducts.ts` exporting `TRADITIONAL_PRODUCTS` with the seven concept records below. Copy the owner's approved concept specs exactly; add no other facts. All records `isListed: false` until Stage 4.
| ID / slug | Title | Price | Pieces (sizes) | Colourways | Materials (concept spec) | Inspiration key |
|---|---|---|---|---|---|---|
| `tr-01` banaras-afterlight-sculpted-brocade-mantle-coat | Banaras Afterlight — Sculpted Brocade Mantle Coat | 128000 | coat (XS–XL) | Oxblood / Antique Gold; Midnight Indigo / Champagne | shell 70% mulberry silk 30% viscose jacquard; lining 100% cupro; decorative thread 100% polyester | banarasi-brocade |
| `tr-02` mayura-axis-sculpted-drape-gown | Mayura Axis — Sculpted Drape Gown | 142000 | gown (XS–XL) | Peacock Emerald / Antique Gold; Rani Rose / Champagne | shell 100% mulberry silk satin; contrast 100% silk jacquard; lining 100% cupro | paithani-silk |
| `tr-03` patola-geometry-reversible-jacket-and-trouser-set | Patola Geometry — Reversible Jacket and Trouser Set | 148000 | jacket, trousers (XS–XL each) | Midnight Ink / Vermilion; Forest / Old Gold | 60% silk 40% cotton jacquard; jacket lining 100% cotton | patan-patola |
| `tr-04` temple-grid-longline-tunic-and-trouser-set | Temple Grid — Longline Tunic and Trouser Set | 118000 | tunic, trousers (XS–XL each) | Deep Oxblood / Warm Ivory; Midnight Blue / Champagne | tunic 100% mulberry silk twill; trousers 65% cotton 35% silk; borders 100% silk jacquard | kanchipuram-silk |
| `tr-05` moonveil-sheer-embroidered-overlay | Moonveil — Sheer Embroidered Overlay | 78000 | overlay with inner slip (XS–XL, one size for the pair) | Warm Ivory / Pearl; Deep Oxblood / Muted Rose | overlay 100% cotton voile; embroidery 100% cotton; slip 100% mulberry silk crepe | chikankari |
| `tr-06` indigo-orbit-geometric-overshirt-and-trouser-co-ord | Indigo Orbit — Geometric Overshirt and Trouser Co-ord | 66000 | overshirt, trousers (XS–XL each) | Indigo / Terracotta; Espresso / Sand | 100% cotton twill | ajrakh |
| `tr-07` tidal-bind-sculpted-cape-dress | Tidal Bind — Sculpted Cape Dress | 92000 | dress (XS–XL) | Oxblood / Champagne; Deep Indigo / Warm Ivory | shell 100% mulberry silk crepe; lining 100% cupro | bandhani |
Describe TR-06 as "Ajrakh-inspired geometric print" and never as hand block-printed. Story lines come from the owner spec; do not add cultural or production claims.
5. **Catalogue boundaries.** In `products.ts`: keep `PRODUCTS` (ET only, unchanged) and `getProductById/Slug` semantics for ET; add `CONTEMPORARY_PRODUCTS = PRODUCTS`, `ALL_PRODUCTS = [...PRODUCTS, ...TRADITIONAL_PRODUCTS]`, `getCatalogueProductById`, `getCatalogueProductBySlug`, `getListedProductBySlug`. Lookups are **case-insensitive** on id and slug and include legacy slugs (existing aliases plus ET-02 `ivory-raw-tussar-cocoon-trench`). `compassMatcher.ts` must keep reading only `PRODUCTS` (add UT-COMP-01).
6. **ET-02.** Change title to "Ivory Hand-Spun Matka Silk Cocoon Trench", new canonical slug `ivory-hand-spun-matka-silk-cocoon-trench`, keep old slug as alias; keep id `et-02`, price ₹1,12,000, fibre "100% Hand-Spun Matka Raw Silk". Run `grep -rni "tussar" src` and update every user-facing and test string that names ET-02 as Tussar (do not touch Archive text about Tussar silk as a material). Update `data-state`, `product-detail`, `collections`, `search`, `saved-and-bag` tests accordingly.
7. **ET-04 alt text.** In `assetMap.ts` replace "Pleated Indigo Chanderi Tunic" in current-product alt strings with "Angrakha Asymmetric Sheer Tunic — {view}". Keep the folder `products/pleated-indigo-chanderi-tunic/` and legacy slug.
8. **Legacy Archive routes.** Create `legacyRoutes.ts` with the nine pairs (legacy → canonical tradition key): varanasi-kadwa→banarasi-brocade, chanderi-handloom→kota-doria, changthangi-pashmina→kashmiri-sozni, assam-wild-silk-twill→muga-silk, kanchipuram-korvai-temple→kanchipuram-silk, maharashtra-paithani-tapestry→paithani-silk, gujarat-patan-patola-double-ikat→patan-patola, telangana-pochampally-ikat→pochampally-ikat, odisha-sambalpuri-bandha→sambalpuri-ikat. In the `/archive/:storySlug` handler, check the table first and `<Navigate to="/archive?tradition={key}" replace />`; unknown slugs keep the existing not-found page. Keep `?tradition=<legacy>`, `?tradition=chanderi` and `?tradition=pashmina` working.
9. **Search.** (a) Tokenise the query (split on whitespace, lowercase, drop empty); a record matches if every token appears in its searchable text (title, subtitle, tags, region, description fields already used). Keep existing result order and types. (b) Replace the `traditionKey || slug` fallback: add `WEAVE_STORY_ROUTES = {'weave-14': '/archive/the-art-of-the-drape'}`; a weave record without `traditionKey` uses this map; a record with neither is excluded. (c) Product results come from `ALL_PRODUCTS.filter(isListed)` (TR hidden until Stage 4). (d) Add a data-level test that every generated URL resolves.
10. **Archive relationships.** Create `archiveRelations.ts` exporting `ARCHIVE_RELATED_PIECES: Record<string, {kind: 'piece' | 'info' | 'none'; productId?: string; text?: string}>`: banarasi-brocade → piece ET-01; kota-doria → piece ET-04; kashmiri-sozni → info; muga-silk → none; and `TRADITION_INSPIRED_DESIGNS`: banarasi-brocade→tr-01, paithani-silk→tr-02, patan-patola→tr-03, kanchipuram-silk→tr-04, chikankari→tr-05, ajrakh→tr-06, bandhani→tr-07. Texts are provisional constants flagged `NEEDS-OWNER-WORDING`: ET-01 "Related piece: its weave record notes a Kadwa-style facing." ET-04 "Related piece: woven in a Chanderi handloom weave, a technique this folio also covers." (never "Kota Doria garment"); ET-07 info "Pashmina is the ground fabric discussed in this folio." TR: "A contemporary design inspired by the visual language of {tradition}." No other relationships. **Hold (F-52, DEC D-25):** the latest brief names Banarasi → TR-01 and Kota Doria → TR-04 ("a Chanderi garment"), while the settled list names ET-01 and ET-04 and TR-04 is specified as Kanchipuram-inspired. Write the `banarasi-brocade` and `kota-doria` entries as `kind: 'blocked'` (no link rendered) and **omit** `banarasi-brocade → tr-01` from `TRADITION_INSPIRED_DESIGNS` until the owner resolves it. Sozni (`info`) and Muga (`none`) proceed; the other six TR inspiration links (paithani-silk→tr-02, patan-patola→tr-03, kanchipuram-silk→tr-04, chikankari→tr-05, ajrakh→tr-06, bandhani→tr-07) are written but remain hidden until the product is listed (Stage 4).
11. **Remove Acquire.** In `TraditionExhibitionModal.tsx` delete `TRADITION_PRODUCT_MAP`, the `useCart` add-to-bag calls and the "Acquire to Bag" button. Render a placeholder `RelatedPiece` call that reads `archiveRelations` and shows a plain text link ("View related piece") for `piece` entries whose product `isListed`, plain text for `info`, nothing for `none`/unlisted. Do not redesign the modal (Stage 7).
12. **PDP guard.** In `ProductDetailPage.tsx`, if a product resolves but `!isListed`, render the existing not-found style state ("This piece is not currently available") and no Add to Bag. ET products must behave exactly as before.
13. Update all affected existing tests (§10). Run the gate. Commit.

## 8. Expected behaviour
Site looks and behaves the same except: ET-02 title, ET-04 alt text, Archive shows no Acquire, search finds multi-word queries and weave-14 opens the drape story, legacy `/archive/<slug>` redirects, `/product/ET-01` works, TR URLs show "not available".

## 9. Data integrity, accessibility, failure states
TR records contain no fabricated required fields (`UT-DATA-02`). Related links are real anchors with discernible text. Unknown ids never throw.

## 10. Tests to add or update
Add `UT-DATA-01`, `UT-DATA-02`, `UT-COMP-01`, `UT-SEARCH-01`, `UT-ROUTE-01`, `UT-ARCH-01`; add e2e `E2E-ROUTE-04`, `E2E-SEARCH-01`, `E2E-LINK-01`. Update (correct, do not delete): `archive-commerce-guidance`, `phase-7-3-commerce-lens`, `asset-binding`, `search`, `data-state`, `product-detail`, `collections`, `saved-and-bag`, `tradition-exhibition`.

## 11. Manual checks
Open `/archive/chanderi-handloom` → lands on `/archive?tradition=kota-doria`. Search "Indigo Chanderi Tunic" → ET-04. Search "radial" → drape story. `/product/ET-01` → coat-dress. `/product/tr-01…` → "not available".

## 12. Acceptance criteria
All of §8 observed; ET-01…07 ids, prices unchanged and names unchanged except ET-02; no Add to Bag exists in Archive; Compass tests unchanged and passing; `tsc` clean; no TR record is purchasable or listed.

## 13. Evidence
Test output, Playwright report for the three new e2e tests, `RESULT.md`, `git diff --stat`.

## 14. Risks and mitigation
Type narrowing churn in `ProductDetailPage`: keep ET paths untouched and add `isTraditional` guards only. Renaming ET-02 breaks assertions: update tests in the same commit. Slug aliasing must not break saved Bag lines (ids unchanged).

## 15. Git
Create branch `stage-02-data-routes` from the **current head of `integration/everthread-v1`**; confirm `git status` is clean first. Commit in small logical groups with message `stage-02: <summary>`; review `git diff` before each commit and exclude unrelated files. **Do not commit to or push `main`** (a push deploys); no force-push, reset or history rewrite without owner approval. After owner approval: merge the stage branch into `integration/everthread-v1` with `--no-ff` and tag `stage-02-approved`. Record `git status`, `git log --oneline -n 10` and `git diff --stat` in `RESULT.md`.

## 16. Stop conditions
Stop if Compass tests change, if any ET price/id changes, or if a TR record would need a fabricated field. Provisional wording constants are acceptable but must be listed in `RESULT.md`.

## 17. Exit gate
PASS when §12 and all gate commands pass and the owner approves. Owner confirms wording constants or accepts provisional text.

## 18. Reconciliation addendum (Revision 2)
**18.1 Asset dependencies (manifest IDs, status from `02a_ASSET_REGISTRY.csv`).** Existing assets only: ET-04 gallery records (`public/images/products/pleated-indigo-chanderi-tunic/…`) get corrected `alt`; no TR asset is referenced yet (TR image records may list planned paths but every TR product stays `isListed:false`).

**18.2 Data-model and route implications.** `ProductBase`, `TraditionalProduct`, `CatalogueProduct`, `ALL_PRODUCTS`, `legacyRoutes.ts`, `archiveRelations.ts`, search tokeniser. Routes: 9 `/archive/<legacy>` redirects, case-insensitive product ids. No wall route yet.

**18.3 Desktop / tablet / mobile behaviour.** No visual change expected at any width except the Archive modal (no Acquire button) and the not-available product state (centered message, same width constraints as the existing not-found state).

**18.4 Component state matrix (initial, hover, focus, active, selected, completed, loading, empty, error as applicable).** Product page: loading (existing), loaded, **not available** (new, error-style, `role="status"`). Search: empty query, results (hover/focus ring on items), no results (existing empty state). Archive related link: default, hover, focus-visible (underline + ring), absent when kind is `none`/`blocked`.

**18.5 Interaction and motion contract.** None added. Reduced motion unaffected. Pointer, touch and keyboard parity is mandatory for every interactive control; all numeric values not established by an approved source are marked `OWNER_APPROVAL_REQUIRED` in `03_…` §9.

**18.6 Regression checks for previously working features.** Compass tests unchanged; Bag/Saved/checkout; ET prices and ids; existing slugs; `?tradition=chanderi|pashmina` aliases.

**18.7 Source files.** Known (verified): `src/types/catalog.ts`, `src/data/products.ts` (lookups ≈L332–336), `src/data/assetMap.ts`, `src/components/SearchModal.tsx` (≈L101), `src/components/TraditionExhibitionModal.tsx` (≈L27 map), `src/App.tsx`. To verify before editing: where legacy story slugs are resolved (`ArchiveStoryPage.tsx`), the exact `Footer` and Compass imports of `PRODUCTS`. Antigravity must report the actual paths found before editing; unknown locations are not to be invented.

**18.8 Outstanding blockers and owner decisions.** Owner decisions #7 and F-52/DEC D-25 (Banarasi, Kota Doria entries held), #8 (default applied), #9/#11 (provisional constants), DEC D-19/D-20 (approved).

**18.9 Stop condition.** Stop if Compass tests change, any ET id/price changes, or a TR record needs a fabricated required field.

**18.10 End-of-stage report.** Present the 8 items in roadmap §5 item 5 and request explicit owner approval. Do not start the next stage.

**18.11 Evidence-integrity table (fill with actual results only).**
| Check | Planned | Executed | Passed | Failed | Not run | Unverifiable |
|---|---|---|---|---|---|---|
| (one row per check listed in §10–§11, filled with actual results only) | | | | | | |

**18.12 Exit-criteria matrix (copy of §12, to be completed).**
| # | Exit criterion | Result (PASS/FAIL/BLOCKED) | Evidence file |
|---|---|---|---|

