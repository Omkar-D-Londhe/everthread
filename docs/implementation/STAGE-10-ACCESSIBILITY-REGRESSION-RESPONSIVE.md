# STAGE-10 — Accessibility, Regression and Responsive Acceptance

## 1. Purpose and rationale
Fix the remaining mandatory findings, then prove the whole site in real browsers: every route and viewport, keyboard-only operation, reduced motion, commerce regression, production build under the Pages-style fallback, and unchanged loader timing.

## 2. Prerequisites
STAGES 2–9 PASS (or approved PARTIAL with the gaps listed). Full Playwright suite exists from earlier stages.

## 3. Scope and exclusions
In: remaining defects F-10 (final sweep), F-19, F-21, F-23, F-29, F-30, F-35, F-36, F-37; the full suite; optional CI proposal. Out: redesign, new features, CI workflow edits without owner approval, performance rewrites beyond reported warnings.

## 4. IDs
F-10, F-14 (verify), F-18, F-19, F-21, F-23, F-24, F-29, F-30, F-34, F-35, F-36, F-37; CL-506…519, 534…559; E2E suites.

## 5. Current-state evidence
`body{overflow-x:hidden}` at `main.css` L29 (since baseline) masks overflow; measured clipping at 390 px on PDP gallery, Archive story button (+38 px), Journal link (+13 px), header icon (+5 px) (the first two should be fixed in Stages 3 and 7). Focus ring colour champagne is 2.57:1 on ivory. Newsletter email input has no accessible name. Icon fonts (Material Symbols from Google) show literal ligature names if blocked. Compass has 24 unit/UI tests but no browser test. Build warns about chunks > 500 kB; Archive transfers ≈3.7 MB.

## 6. Files affected
`src/styles/main.css` and component styles, footer/newsletter component, header, components using Material Symbols, `index.html`, `e2e/*.spec.ts`, `playwright.config.ts`, optionally `.github/workflows/deploy.yml` **only with owner approval**.

## 7. Ordered implementation instructions
1. Branch per §15. Run the whole gate and the whole Playwright suite; save a baseline report.
2. **Overflow root cause (F-10).** Run `E2E-RESP-01` with `body{overflow-x:hidden}` overridden to `visible` at 320, 360, 390, 768, 1024, 1440 on every route and both walls; for each element extending beyond the viewport, fix its own layout (`min-width: 0`, wrapping, `max-width: 100%`, gap reduction, container `overflow-x:auto` for intentional strips). Only when the sweep is clean may the global rule be removed; if removal breaks something intentional, keep the rule **and** record each exception with its reason.
3. **Focus ring (F-29).** Replace the champagne focus outline with Deep Oxblood (`#49232D`, 12.8:1 on ivory) 2 px with 2 px offset; on dark surfaces use Warm Ivory. Add `E2E-A11Y-03` (computed contrast ≥ 3:1).
4. **Newsletter (F-30).** Add a visible or `visually-hidden` `<label for>` (or `aria-label="Email address"`) to the footer email input; verify on every route.
5. **Icons (F-21).** Where Material Symbols ligatures are used, add `aria-hidden="true"` to decorative icons, give icon-only controls an `aria-label`, and provide a fallback so literal names never display when the font is blocked: either replace critical icons with inline SVG components or apply `font-display: block` with a CSS fallback that hides the text (`font-size:0` until the font is loaded, using the Font Loading API class `icons-ready`). No new dependency.
6. **Compass (F-19).** Write `E2E-COMP-01`: complete the flow; same inputs twice give identical results; different inputs differ; reasons visible; Back and Restart work; no TR in results. Fix only genuine defects the test reveals (list them first).
7. **Failure states (F-36).** Add tests for blocked images on PDP, Archive plates and diagrams (SVG→PNG fallback), and blocked font CSS.
8. **Remaining a11y (F-37).** `E2E-A11Y-01/02`: landmarks, labels, unique ids, keyboard-only traversal of header, walls, PDP, Lens, Bag, checkout, Search, exhibition. Touch targets ≥ 44×44 px for primary controls (measure). Document any exceptions.
9. **Loader (F-14).** `E2E-LOAD-01`: visible 2.0–2.8 s on normal load, shorter under reduced motion; fail if `ThreadLoader.tsx` default 1900 ms or the 400 ms fade was changed (`git diff` check).
10. **Commerce regression.** Run `E2E-CART-01…05` end to end across ET and TR mixed carts, reload persistence and checkout.
11. **Routing regression.** `E2E-ROUTE-01…04`, `E2E-LINK-01`, `E2E-SEARCH-01`, `E2E-WALL-01…06`, `E2E-DEPLOY-01` under the Pages-style server.
12. **Visual and motion review (F-34, F-35).** Produce screenshots for every changed route at 1440/1024/390 and recordings per `MAN-REC`; check brand tokens (colours, fonts, square corners, whitespace) visually.
13. **Performance note (F-23).** Run the build, record chunk sizes and per-page transfer; propose (do not apply unless trivial and risk-free) code-splitting or image-lazy-loading fixes in `RESULT.md`.
14. **CI proposal.** Prepare, but do not commit, a workflow job running Playwright; ask the owner to approve changing `deploy.yml`.
15. Fix defects found; repeat the failing tests until green; commit.

## 8. Expected behaviour
No clipped or overflowing content at any tested width; keyboard users can complete every flow; reduced motion works; commerce and routing behave identically through the production build; loader timing unchanged.

## 9. Data integrity, accessibility, failure
All WCAG-relevant checks listed above recorded; failures documented with severity.

## 10. Tests
Entire catalogue in `04_…` §3, run on 3 projects. Also `npm test`, `tsc`, `build`.

## 11. Manual checks
Human walk-through at 390, 1024, 1440: Home → both walls → a TR product → Lens → Bag → checkout; Archive → exhibition → related link; Compass; House; Journal; 404. Include a keyboard-only pass and one pass with reduced motion.

## 12. Acceptance criteria
- 0 elements beyond viewport on every route at 320–1440 px (with global overflow hiding disabled, or each exception recorded).
- Focus ring ≥ 3:1 everywhere; newsletter labelled; no literal icon names with fonts blocked.
- Whole Playwright suite and Vitest pass; `tsc` and build pass.
- Loader unchanged.
- No skipped test other than documented later-stage known defects (none expected now).

## 13. Evidence
Full Playwright HTML report, build log with chunk table, screenshots and recordings, `RESULT.md` listing all fixes, any waivers and the CI proposal.

## 14. Risks and mitigation
Removing the global overflow rule can expose hidden bugs: do it last and per route. Contrast fixes may alter look: confirm with owner screenshots.

## 15. Git
Create branch `stage-10-acceptance` from the **current head of `integration/everthread-v1`**; confirm `git status` is clean first. Commit in small logical groups with message `stage-10: <summary>`; review `git diff` before each commit and exclude unrelated files. **Do not commit to or push `main`** (a push deploys); no force-push, reset or history rewrite without owner approval. After owner approval: merge the stage branch into `integration/everthread-v1` with `--no-ff` and tag `stage-10-approved`. Record `git status`, `git log --oneline -n 10` and `git diff --stat` in `RESULT.md`.

## 16. Stop conditions
Stop if a fix requires redesign or scope changes; report BLOCKED with evidence.

## 17. Exit gate
PASS when §12 holds and the owner approves. Live deployment remains UNVERIFIED until Stage 11.

## 18. Reconciliation addendum (Revision 2)
**18.1 Asset dependencies (manifest IDs, status from `02a_ASSET_REGISTRY.csv`).** All registry rows are re-verified for existence and referenced paths; no new assets.

**18.2 Data-model and route implications.** No data change.

**18.3 Desktop / tablet / mobile behaviour.** Sweep at 320, 360, 390, 768, 1024, 1440 on every route and both walls; visual review at 1440/1024/390.

**18.4 Component state matrix (initial, hover, focus, active, selected, completed, loading, empty, error as applicable).** Every interactive component in the site: default, hover, focus-visible, active, selected, disabled, loading, empty, error — verified per route in the keyboard and visual passes.

**18.5 Interaction and motion contract.** Verification only (recordings; reduced motion). Pointer, touch and keyboard parity is mandatory for every interactive control; all numeric values not established by an approved source are marked `OWNER_APPROVAL_REQUIRED` in `03_…` §9.

**18.6 Regression checks for previously working features.** The entire suite, all previously working behaviour.

**18.7 Source files.** Known (verified): `src/styles/main.css` L29, footer/newsletter component, header, components using Material Symbols. To verify: each overflow offender discovered by the sweep. Antigravity must report the actual paths found before editing; unknown locations are not to be invented.

**18.8 Outstanding blockers and owner decisions.** CI change approval, F-24 live verification (owner).

**18.9 Stop condition.** Stop if a fix requires redesign or scope change.

**18.10 End-of-stage report.** Present the 8 items in roadmap §5 item 5 and request explicit owner approval. Do not start the next stage.

**18.11 Evidence-integrity table (fill with actual results only).**
| Check | Planned | Executed | Passed | Failed | Not run | Unverifiable |
|---|---|---|---|---|---|---|
| (one row per check listed in §10–§11, filled with actual results only) | | | | | | |

**18.12 Exit-criteria matrix (copy of §12, to be completed).**
| # | Exit criterion | Result (PASS/FAIL/BLOCKED) | Evidence file |
|---|---|---|---|
| 1 | 0 elements beyond viewport on every route at 320–1440 px (with global overflow hiding disabled, or each exception recorded). | _to be filled by Antigravity_ | _path_ |
| 2 | Focus ring ≥ 3:1 everywhere; newsletter labelled; no literal icon names with fonts blocked. | _to be filled by Antigravity_ | _path_ |
| 3 | Whole Playwright suite and Vitest pass; `tsc` and build pass. | _to be filled by Antigravity_ | _path_ |
| 4 | Loader unchanged. | _to be filled by Antigravity_ | _path_ |
| 5 | No skipped test other than documented later-stage known defects (none expected now). | _to be filled by Antigravity_ | _path_ |
