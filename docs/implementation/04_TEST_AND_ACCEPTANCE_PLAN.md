# 04 — Test and Acceptance Plan — Revision 2

## 1. Tooling (set up in Stage 1)
- Vitest + Testing Library (existing, jsdom). They prove logic and DOM structure only.
- **Playwright** (`@playwright/test`, dev dependency, approved) for real-browser behaviour: routing, focus, pointer/touch, scroll, overflow, motion state.
- `e2e/pagesServer.mjs`: a tiny Node static server (no new dependency) serving `dist/` under `/everthread/` and returning `404.html` **with HTTP 404** for unknown paths, to emulate GitHub Pages. Playwright `webServer` runs `npm run build` then this server.
- Scripts to add: `"test:e2e": "playwright test"`. CI changes (running e2e in the deploy workflow) require explicit owner approval (Stage 10); until then CI only runs the existing three checks.
- Playwright projects: `desktop` 1440×900, `tablet` 1024×768, `mobile` 390×844 with touch (Chromium). Extra overflow widths 320, 360, 768 inside E2E-RESP-01.
- Fonts: external fonts are unavailable in some environments; tests must not depend on them (block `fonts.googleapis.com` in one dedicated test).

## 2. Route matrix and **route availability by stage**
A test may only require a route in or after the stage that introduces it. Before that stage, tests may assert the route is intentionally absent (branded 404). Existing tests and functionality are never removed to make a stage pass.
| Route group | Exists from | Notes |
|---|---|---|
| `/`, `/collections`, `/product/<ET slug>`, `/compass`, `/archive`, 4 story routes, `/archive?tradition=<13 keys>`, `/the-house`, `/journal`, `/journal/<article>`, `/saved`, `/bag`, `/checkout`, 404 | baseline (Stage 1) | the Stage 1 characterization suite covers only these |
| 9 `/archive/<legacy-slug>` redirects, `/product/<UPPERCASE-ID>` | Stage 2 | |
| `/product/<TR slug>` | Stage 2 as "not available"; purchasable only when listed (Stage 4) | |
| `/collections/the-living-inheritance` | Stage 5 | `E2E-BASE-01` asserts it is a 404 at baseline and is **removed in Stage 5** (documented replacement, not a deletion of coverage) |
| `/archive?diagram=<id>` | Stage 7 | |
Full route list (final state) for the Stage 10 suite follows.

### Final route list (every route, every viewport)
`/`, `/collections`, `/collections/the-living-inheritance`, `/product/<slug>` (ET-01…07, TR-01…07), `/compass`, `/archive`, `/archive/<story>` (4 stories), `/archive?tradition=<13 keys>`, `/the-house`, `/journal`, `/journal/<article>`, `/saved`, `/bag`, `/checkout`, unknown route (404). Legacy: 9 `/archive/<legacy-slug>`, 9 `?tradition=<legacy-slug>`, ET legacy product slugs, upper-case IDs.

## 3. Test catalogue (IDs referenced by the stage files)
**Added in Revision 2:** `UT-ASSET-01` and `E2E-BASE-01` (rows below).

**Vitest (UT)**
| ID | Asserts |
|---|---|
| UT-DATA-01 | ET-01…07 ids, names, prices unchanged except ET-02 title "Ivory Hand-Spun Matka Silk Cocoon Trench"; `PRODUCTS` still equals the contemporary set; `ALL_PRODUCTS` = ET + TR; slug and id lookup incl. legacy slugs and case-insensitive ids |
| UT-DATA-02 | Every TR record validates: stable id, price, sizes/pieces, colourways, no `edition`/`artisanHours`/`warpDensity`/`origin`/dispatch values; concept flags set; every referenced image exists and has `alt`, `provenance`; incomplete record ⇒ `isPurchasable === false` |
| UT-COMP-01 | Existing Compass tests pass unchanged; matcher never returns TR (default for O-8) |
| UT-CART-01 | Set lines keyed by pieces' sizes; same product different size = new line; old persisted lines still load; unknown id returns an error result, not silence; decrement at 1 keeps line; remove by `variantId` |
| UT-LENS-01 | Lens math: pointer → image coordinates for contain-fit; cap = min(3.5, native/rendered); disabled when cap < 1.3 |
| UT-SEARCH-01 | "Indigo Chanderi Tunic" finds ET-04 via token matching; weave-14 result URL = `/archive/the-art-of-the-drape`; every result URL resolvable |
| UT-ROUTE-01 | Legacy alias tables: 9 archive slugs → canonical tradition keys |
| UT-ARCH-01 | Related-piece map: Sozni→info only, Muga→none; Banarasi and Kota Doria entries are `blocked` (render nothing) until DEC D-25 is resolved; six TR inspiration links exist and stay hidden until the product is listed; none produce an add-to-bag action |
| UT-COLL-01 | Collections sort options are exactly Featured, price low→high, price high→low (no "Newest"); `ContemporaryWall` keeps all existing test ids |
| UT-ASSET-01 | Reads `02a_ASSET_REGISTRY.csv`: every TR image referenced by data exists in the registry with status `APPROVED` and is not `MISMATCH`/`DUPLICATE`; otherwise its product is `isListed:false` |
Existing tests that encode the old behaviour **must be corrected, not deleted**: `archive-commerce-guidance`, `phase-7-3-commerce-lens`, `asset-binding` (alt expectations), `search`, `saved-and-bag`, `product-detail`, `collections`.

**Playwright (E2E)**
| ID | Asserts |
|---|---|
| E2E-BASE-01 | Baseline only (Stage 1–4): `/collections/the-living-inheritance` shows the branded 404; replaced by `E2E-WALL-01` in Stage 5 |
| E2E-ROUTE-01 | Every route in §2 loads at 3 viewports: one `h1`, no uncaught page errors, no failed first-party requests |
| E2E-ROUTE-02 | Through the Pages-style server: deep links with `?query` and `#hash` and refresh on nested routes restore the right page |
| E2E-ROUTE-03 | Back/forward across routes and between the two walls returns to the previous page and wall |
| E2E-ROUTE-04 | Legacy and case variants resolve to canonical content (no "Not Found") |
| E2E-LINK-01 | Crawl internal links on all routes: 0 broken, including links inside open modals |
| E2E-SEARCH-01 | Phrase queries; every result destination resolves; weave-14 opens `/archive/the-art-of-the-drape`; empty state shown; **TR assertions are enabled from Stage 4 and apply to listed products only** |
| E2E-LENS-01 | For ET-01…07 and TR-01…07: choose each gallery thumbnail, open Lens: Lens source equals the main image source |
| E2E-LENS-02 | Hover pointer positions map to the expected image coordinates within 2 px (computed against `lensMath`); no stretching |
| E2E-LENS-03 | Desktop hover preview; touch tap opens modal; Tab stays inside; Esc closes; focus returns to trigger; arrow keys pan; route change while open closes cleanly |
| E2E-LENS-04 | With the image request blocked: error state shown, no exception, magnifier disabled |
| E2E-PDP-01 | Portrait images fully visible (head and feet within stage) at 3 viewports; landscape ET images unaffected |
| E2E-CART-01 | Mixed ET cart: add 3, qty change, remove, subtotal, reload persistence (reuses audited flows) |
| E2E-CART-02 | Each TR: add, Bag line identity (id, size(s), colour), quantity, remove, Saved, checkout summary equal Bag; set products have independent top and bottom sizes |
| E2E-CART-03 | Decrement at 1 keeps item; Remove deletes; invalid add shows an error message |
| E2E-CART-04 | Colour selection: label, displayed image (or honest note), Bag line and checkout summary agree |
| E2E-CART-05 | Reload with set lines; previously stored ET lines still load |
| E2E-WALL-01 | Both wall URLs load directly and refresh correctly; `/collections` still Contemporary |
| E2E-WALL-02 | Horizontal wheel (`deltaX`) over the stage settles on the other wall and pushes its route; Back returns |
| E2E-WALL-03 | Touch swipe (CDP synthesized gesture) switches wall; vertical swipe still scrolls the page |
| E2E-WALL-04 | Labels (tablist) clickable; ArrowLeft/Right moves; Home/End; focus ring visible |
| E2E-WALL-05 | Vertical wheel over the stage scrolls the page (no hijack) |
| E2E-WALL-06 | Reduced motion: instant switch, no nudge, thread static |
| E2E-ARCH-01 | 13 traditions deep-link open; discipline groups present; no uniform 14-tile grid (feature cards larger than others) |
| E2E-ARCH-02 | Modal: focus stays inside after 20 Tabs; Esc closes from any focus; focus returns to opener; `?tradition` cleared on close |
| E2E-ARCH-03 | No Acquire/Add to Bag anywhere in Archive; ET and TR related links as per UT-ARCH-01 |
| E2E-ARCH-04 | Technique strip: 9 items in documented order; open viewer; keyboard focus scrolls into view; reduced motion has no transform |
| E2E-ARCH-05 | No caption/alt matches filename-like patterns; captions follow "Tradition — role" |
| E2E-HOME-01 | Section order per spec; exactly one Compass teaser; CTA "Enter the Archive"; hero metadata strings equal ET-01 record values |
| E2E-COMP-01 | Compass: complete the flow; same inputs give the same result twice; different inputs differ; reasons shown; back and restart work; no TR in results |
| E2E-MOTION-01 | At each fold boundary: panel transform reaches `none`/removed; stop mid-fold and wait 600 ms ⇒ fold completes and scene content is visible and clickable |
| E2E-MOTION-02 | Reduced motion: no `.scene-fold__panels`, no 3D transforms on any route |
| E2E-MOTION-03 | No pinning: no `position:fixed` scene wrappers; programmatic scrollY unchanged by animations |
| E2E-MOTION-04 | Navigate away and back 5×: `window.__scrollTriggerCount` returns to baseline |
| E2E-A11Y-01 | One `h1`, `main`, skip link, `lang`, unique ids, every control and input has an accessible name incl. newsletter |
| E2E-A11Y-02 | Keyboard-only traversal: header, wall, PDP, Lens, Bag, checkout, modals |
| E2E-A11Y-03 | Focus indicator contrast ≥ 3:1 against ivory (computed) |
| E2E-RESP-01 | At 320/360/390/768/1024/1440 no element extends beyond the viewport and `body{overflow-x:hidden}` is not required (test with it overridden). **Stage-scoped:** each stage runs it on the routes it changed; the whole site is covered in Stage 10 |
| E2E-LOAD-01 | Loader visible 2.0–2.8 s on normal load, shorter with reduced motion, hand image shown |
| E2E-DEPLOY-01 | Production build behind Pages-style server: 0 failed asset requests across all existing routes; the fonts-blocked assertion (no literal icon names) is enabled only after F-21 is fixed in Stage 10 (before that it is report-only) |

**Manual (MAN)**
| ID | Procedure |
|---|---|
| MAN-VIS | Review screenshots at 1440, 1024, 390 for each changed route; no clipped or overlapping content |
| MAN-REC | Screen recordings at normal scroll speed for each motion boundary, wall switch and exhibition opening, normal and reduced motion |
| MAN-CLAIMS | Stage 1 claims inventory: every visible factual claim marked supported/unsupported; unsupported claims absent or owner-approved |
| MAN-GATE | Stage gate commands pass; no test still asserts superseded behaviour (list in `docs/baseline/TEST_DEBT.md`); Git status/log recorded |
| MAN-DOCS | `docs/SUPERSEDED.md` and notices present; package consistency script passes; every stage file has sections 1–18 |
| MAN-BUILD | Build log and chunk table recorded; warnings listed |
| MAN-OWNER | Owner confirms or supplies the named input (documents, decision, approval) and the confirmation is recorded in `RESULT.md` |
| MAN-LIVE | Owner opens the live URL after deployment and checks 8 routes (`/`, `/collections`, the second wall, a TR product, `/archive`, an exhibition, `/bag`, an unknown route) and reload on each |

## 4. Per-stage mandatory gate commands
`npm ci` (if lockfile changed) → `npm test` → `npx tsc --noEmit` → `npm run build` → `npx playwright test <stage-specific files>`. A stage may not PASS with a failing or skipped (`.skip`/`.fixme`) test unless that test is a documented known defect owned by a later stage (listed in `RESULT.md`).

## 5. Evidence format
`docs/stage-evidence/STAGE-NN/RESULT.md` (verdict, changed files, test summary, deviations, open items) · `test-output.txt` · screenshots `NN-<route>-<viewport>.png` · recordings `NN-<scene>-<viewport>.webm` · `git diff --stat`.

## 6. Deployment verification
Local gates never prove the live site. After the owner merges to `main` and the workflow completes: record the Actions run URL and commit; owner runs MAN-LIVE. Until then live status is **UNVERIFIED**.

## 7. Evidence integrity (applies to every stage)
For every stage `RESULT.md` contains a table with one row per planned check and the columns **Planned · Executed · Passed · Failed · Not run · Unverifiable**, filled with actual results only. Historical results (earlier audits) are labelled `HISTORICAL` until re-run on the stage's commit. Appropriate evidence: automated output for automated behaviour, screenshots for visual claims, recordings for motion, direct interaction notes for interactive behaviour.

## 8. Checks actually executed during this reconciliation (not implementation tests)
| Check | Result |
|---|---|
| `npx vitest run` on the local copy of `ebf7b6b` | 15 files, 251 passed (executed) |
| `npx tsc --noEmit` | exit 0 (executed) |
| `npx vite build` | exit 0, large-chunk warning (executed) |
| `git ls-remote` head of `Omkar-D-Londhe/everthread` | `ebf7b6b` (executed) |
| Asset ZIP inspection (40 PNG: size, mode, SHA-256, perceptual hash, visual contact sheets) | executed |
| Package consistency script (stage sections, referenced files, test-ID definitions) | executed (see final report) |
Not run: all Playwright tests (not yet installed), all stage tests, live-site checks, any implementation.
