# STAGE-01 — Baseline, Tooling, Asset Verification and Claims Inventory

**Verdict options:** PASS / FAIL / BLOCKED / PARTIAL. Read `00_MASTER_IMPLEMENTATION_ROADMAP.md` first.

## 1. Purpose and rationale
Prove the starting state, add the approved browser-test tooling, verify what assets really exist, and inventory visible claims, so every later stage works from evidence. This stage changes no product behaviour.

## 2. Prerequisites and dependencies
Owner has reviewed the package (readiness is `BLOCKED — OWNER DECISIONS REQUIRED`: Stage 1 may start only when the owner explicitly says so). Clean checkout of `main` at `ebf7b6b` (remote head re-checked at that commit; if later, record `git log ebf7b6b..HEAD` and re-run the whole baseline). The asset ZIP `EverThread_Asset_Handover.zip` is available outside the repository. No earlier stage.

## 3. Scope and exclusions
In: baseline record; Playwright setup (approved dev dependency) and Pages-style test server; characterization (non-failing) E2E tests of currently working behaviour; verified asset manifest; claims inventory; test-debt list. Out: any defect fix, any UI/data change, image creation, CI workflow changes.

## 4. IDs
F-25, F-31, F-38, F-41, F-44, F-45; O-1, O-6, O-14; DEC D-17; blockers B-1, B-2, B-3, B-4.

## 5. Current-state evidence
Verified in audit: 15 Vitest files / 251 tests; `tsc` clean; build OK with a large-chunk warning; scripts are only `dev`, `build` (`tsc && vite build`), `preview`, `test` (`vitest run`); no Playwright, ESLint or lint script; `scripts/` folder exists. No TR assets in `public/`. Eight owner PNGs exist outside the repo.

## 6. Files and locations affected
`package.json`, `package-lock.json` (Playwright dev dependency only), `playwright.config.ts` (new), `e2e/` (new: `pagesServer.mjs`, `baseline.spec.ts`, `helpers.ts`), `docs/stage-evidence/STAGE-01/` (new), `docs/baseline/` (new: `BASELINE.md`, `ASSET_VERIFICATION.md`, `CLAIMS_INVENTORY.md`, `TEST_DEBT.md`). No `src/` changes.

## 7. Ordered implementation instructions
1. `git status`, `git rev-parse HEAD`, `git branch --show-current`; record. Create `integration/everthread-v1` from the clean `main`, then branch `stage-01-baseline` from it (see §15).
2. Run `npm ci`, `npm test`, `npx tsc --noEmit`, `npm run build`. Save output. Record warnings (chunk size). Do not fix them.
3. Install Playwright: `npm i -D @playwright/test` then `npx playwright install chromium`. Add script `"test:e2e": "playwright test"`.
4. Create `e2e/pagesServer.mjs`: Node `http` server; serve files from `dist/` under `/everthread/`; for any path under `/everthread/` that is not a file, return `dist/404.html` with **status 404**; root `/` returns 404. Read port from `process.env.PORT` (default 4173).
5. Create `playwright.config.ts`: `webServer` command `npm run build && node e2e/pagesServer.mjs`, `url http://127.0.0.1:4173/everthread/`, `reuseExistingServer: true`; projects `desktop` (1440×900), `tablet` (1024×768), `mobile` (390×844, `hasTouch`, `isMobile`). `trace: 'retain-on-failure'`, `screenshot: 'only-on-failure'`.
6. Write `e2e/baseline.spec.ts` with **characterization tests that pass today and only cover routes that exist at baseline**: `/`, `/collections`, `/product/<each ET slug>`, `/compass`, `/archive`, the 4 story routes, `/archive?tradition=<13 keys>`, `/the-house`, `/journal`, `/journal/<article>`, `/saved`, `/bag`, `/checkout`, an unknown route (branded 404): one `h1`, no uncaught page errors; ET-01/04/07 mixed-cart add, qty+, remove, subtotal, reload persistence; checkout validation and simulated confirmation. Add `E2E-BASE-01` asserting `/collections/the-living-inheritance` is a branded 404 (route intentionally deferred to Stage 5; Stage 5 replaces this test). Known defects go in `TEST_DEBT.md`, not into passing tests.
7. Verify the supplied assets against `02a_ASSET_REGISTRY.csv`: unpack `EverThread_Asset_Handover.zip` **outside** the repository; list files (expect 40 PNG plus the stale manifest to be ignored); re-measure dimensions, mode and SHA-256 and compare with the registry; report any difference and stop on a mismatch. Search `public/` and the repository for `living-inheritance`, `tr-0` and TR names (expect none). Do **not** depend on `_legacy_archive/Images` (not supplied).
8. Re-check the registry's consistency findings by opening images (do not trust the registry blindly): items visible vs the product `includes` list, primary vs three-quarter distinctness, orientation, colourway shown. Write `ASSET_VERIFICATION.md` listing agreement or disagreement per `AST-*` row (F-47…F-51). Record that **no image is approved** until the owner changes a status to `APPROVED`. Do not copy any file into `public/`.
9. Search again for the two Phase 6.0 documents (file names and content across the repo, `docs/`, git history). Record the result in `BASELINE.md`. If found, stop and tell the owner before Stage 8; if not, B-1 stays.
10. Build `CLAIMS_INVENTORY.md`: extract visible factual claims from Home, The House, Journal, product pages (ET), Archive modal text, and footer. Per claim: location (file, line), text, category (material, origin, craft, edition, provenance, sustainability, operations, availability, history), evidence source, status `supported | unsupported | needs-owner`. Known suspects: "Numbered 01–64", "100% Unblended", "Mulberry Silk & Cashmere", "Pit-Loomed Jacquard", "Our Global Ateliers", "Documented Provenance", "Honoring Artisan Lineage", "Generational Inlay Margins", "Pit-Loomed Humidity", "Ready to Dispatch", "Limited Reserve", all "Edition of N". Do not edit any copy.
11. Write `TEST_DEBT.md`: tests that currently assert behaviour this package changes (`archive-commerce-guidance`, `phase-7-3-commerce-lens`, `asset-binding` alt expectations, `search`, `saved-and-bag`, `product-detail`, `collections`) with the stage that must update each.
12. Commit tooling and docs; do not push `main`.

## 8. Expected behaviour and outcome
Repository behaves identically; new tooling runs; manifests and inventories exist.

## 9. Data integrity, accessibility, failure states
No data or UI modifications. If an image cannot be opened or hashed, mark it UNREADABLE, not VERIFIED.

## 10. Automated tests to add or update
`e2e/baseline.spec.ts` as above (E2E-ROUTE-01 subset, E2E-CART-01, ARCH deep links). Existing Vitest suite unchanged.

## 11. Manual checks
Open `dist` through the Pages-style server at `http://127.0.0.1:4173/everthread/archive` (direct load) and confirm the page renders, proving the fallback works.

## 12. Acceptance criteria
- `npm test`, `tsc`, `build` outputs saved and match the audited results (or differences explained).
- Playwright runs on 3 projects with all baseline tests green.
- `ASSET_VERIFICATION.md` lists every required asset with a status backed by an opened file or "not found".
- `CLAIMS_INVENTORY.md` covers Home, House, Journal, ET product pages, Archive modal and footer.
- No `src/` file modified (`git diff --stat -- src` empty).

## 13. Evidence required
Saved command outputs; Playwright report; `git diff --stat`; `RESULT.md` in `docs/stage-evidence/STAGE-01/`.

## 14. Regression risks and mitigation
Dependency install could change the lockfile broadly: review `package-lock.json` diff and ensure only Playwright and its dependencies were added. Playwright browser download may fail: report BLOCKED rather than skipping.

## 15. Git
Create `integration/everthread-v1` from the clean `main` (`git status` must be empty), then create branch `stage-01-baseline` from the **current head of `integration/everthread-v1`**; confirm `git status` is clean first. Commit in small logical groups with message `stage-01: <summary>`; review `git diff` before each commit and exclude unrelated files. **Do not commit to or push `main`** (a push deploys); no force-push, reset or history rewrite without owner approval. After owner approval: merge the stage branch into `integration/everthread-v1` with `--no-ff` and tag `stage-01-approved`. Record `git status`, `git log --oneline -n 10` and `git diff --stat` in `RESULT.md`.

## 16. Stop conditions / blockers
Stop and report if: the baseline differs from `ebf7b6b` with failing tests; Playwright cannot run; the TR images cannot be located. Missing images are not a Stage 1 failure; they are BLOCKED items for Stage 4.

## 17. Exit gate
PASS when §12 is met and the owner approves. Owner decisions needed at exit: location of the 8 PNGs and the missing TR gallery/hero/campaign assets (B-2), replacement TR-01/TR-07 primaries (B-3), exact disclosure wording (B-4).

## 18. Reconciliation addendum (Revision 2)
**18.1 Asset dependencies (manifest IDs, status from `02a_ASSET_REGISTRY.csv`).** No asset enters the application. Verify against `02a_ASSET_REGISTRY.csv` all 40 supplied rows: `AST-HOME-HERO`, `AST-HOME-CAMP`, `AST-TR01-*` … `AST-TR07-*` (38), and confirm `AST-HOME-PLATE` is absent. Existing repository rows `REPO-DIAG-*` (9) are only counted.

**18.2 Data-model and route implications.** No change. Baseline only. New files: `playwright.config.ts`, `e2e/*`, `docs/baseline/*`.

**18.3 Desktop / tablet / mobile behaviour.** Characterization tests run on desktop 1440×900, tablet 1024×768, mobile 390×844 (touch). No layout change.

**18.4 Component state matrix (initial, hover, focus, active, selected, completed, loading, empty, error as applicable).** Not applicable (no UI change). Tool states to record: test passed / failed / skipped, server up/down.

**18.5 Interaction and motion contract.** None. Pointer, touch and keyboard parity is mandatory for every interactive control; all numeric values not established by an approved source are marked `OWNER_APPROVAL_REQUIRED` in `03_…` §9.

**18.6 Regression checks for previously working features.** Entire existing Vitest suite (251) unchanged; build unchanged.

**18.7 Source files.** Known (verified): `package.json`, `vite.config.ts`, `.github/workflows/deploy.yml`, `public/404.html`, `src/main.tsx`, `src/App.tsx`. Unknown: none to edit in `src/`. Antigravity must report the actual paths found before editing; unknown locations are not to be invented.

**18.8 Outstanding blockers and owner decisions.** B-1 (record only), B-2, B-3, B-4, DEC D-17 (approved), DEC D-23 (masters), owner decision #1 (C).

**18.9 Stop condition.** Stop if the baseline commit differs and tests fail, Playwright cannot run, the ZIP contents differ from the registry, or any `src/` file would need editing.

**18.10 End-of-stage report.** Present the 8 items in roadmap §5 item 5 and request explicit owner approval. Do not start the next stage.

**18.11 Evidence-integrity table (fill with actual results only).**
| Check | Planned | Executed | Passed | Failed | Not run | Unverifiable |
|---|---|---|---|---|---|---|
| (one row per check listed in §10–§11, filled with actual results only) | | | | | | |

**18.12 Exit-criteria matrix (copy of §12, to be completed).**
| # | Exit criterion | Result (PASS/FAIL/BLOCKED) | Evidence file |
|---|---|---|---|
| 1 | `npm test`, `tsc`, `build` outputs saved and match the audited results (or differences explained). | _to be filled by Antigravity_ | _path_ |
| 2 | Playwright runs on 3 projects with all baseline tests green. | _to be filled by Antigravity_ | _path_ |
| 3 | `ASSET_VERIFICATION.md` lists every required asset with a status backed by an opened file or "not found". | _to be filled by Antigravity_ | _path_ |
| 4 | `CLAIMS_INVENTORY.md` covers Home, House, Journal, ET product pages, Archive modal and footer. | _to be filled by Antigravity_ | _path_ |
| 5 | No `src/` file modified (`git diff --stat -- src` empty). | _to be filled by Antigravity_ | _path_ |
