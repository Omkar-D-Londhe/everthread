# 00 — EverThread Master Implementation Roadmap (Antigravity entry point) — Revision 2

**Readiness: `BLOCKED — OWNER DECISIONS REQUIRED`.** Not yet implementation-ready. Blocking items are listed in §7 and `FINAL_RECONCILIATION_REPORT.md`. Read `DOCUMENTATION_INDEX.md` for reading order and superseded files.
Read this file, then only the current `STAGE-NN` file, and only after the owner approves that stage. Do not read ahead.

## 1. Purpose and scope
Deliver the approved EverThread design: fix audited defects, add the second collection wall **The Living Inheritance** (TR-01…TR-07, sellable *concept* products), redesign the Archive overview, complete the Home journey, implement the approved motion system, and verify everything in real browsers.
**In scope:** frontend only (React, TypeScript, Vite, React Router, GSAP, Vitest, Playwright dev dependency). **Out of scope:** backend, authentication, CMS, admin, real payments or inventory, new image generation, changing canonical ET-01…ET-07 IDs/prices (ET-02 retitle excepted, approved), shortening the loader, a "Newest" sort, edition numbers, any invented product, provenance, artisan or manufacturing fact.
**Scroll rules.** No scroll pinning and **no vertical scroll snapping anywhere**. Native vertical scrolling is never intercepted. The only snapping permitted is **horizontal** `scroll-snap` inside the collection-wall stage track and the mobile technique strip (native browser behaviour, not scripted).

## 2. Baseline and evidence status
| Item | Status |
|---|---|
| Repository | `main` at `ebf7b6b`, clean tree. Remote head re-checked this session: `ebf7b6b` (**Verified**). No later commits |
| Automated checks | **Executed this session** on the local copy of `ebf7b6b`: Vitest 15 files / **251 passed**; `tsc --noEmit` exit 0; `vite build` exit 0 with the large-chunk warning (**Verified, local**). Earlier identical results are historical |
| Dependencies | react 18, react-router-dom 6, gsap 3, bootstrap 5, vite 6, vitest 2. No Playwright, no ESLint, no lint script (**Verified**) |
| Deployment | Workflow on push to `main`: `npm ci` → `npm test -- --run` → `npx tsc --noEmit` → `npm run build` → Pages. **Live site UNVERIFIED** (hostname unreachable from the audit environment) |
| Phase 6.0 documents | Not found (file names, contents, all git history): blocker B-1 |
| Repository images | 520 `.webp`, 17 `.png` (icons, OG image, loader). **No TR asset in the repository.** `_legacy_archive/Images` is **not supplied and not referenced** |
| Supplied handover ZIP | 40 PNG masters inspected and reviewed: see `02_ASSET_MANIFEST_AND_MAPPING.md` (23 owner-approval-required, 16 mismatch, 1 duplicate; none approved) |
| CI limits | CI cannot detect live routing, motion, touch, focus, layout or fonts |

## 3. Approved decisions
See `01_…TRACEABILITY.md` §B (owner decisions 1–14 with their verification status) and §C (settled decisions). Highlights: Home CTA "Enter the Archive"; loader ≈2.3 s unchanged; names-only colourways with honest image behaviour; no Newest sort; minus at 1 never deletes; legacy routes redirect; Playwright approved; GitHub Pages and simulated checkout; ET-02 title "Ivory Hand-Spun Matka Silk Cocoon Trench" (ID, price, legacy route kept); Archive educational; editions on hold; claims need evidence.

## 4. Stage sequence and dependencies
| Stage | File | Objective | Depends on |
|---|---|---|---|
| 1 | `STAGE-01-BASELINE-TOOLING-INVENTORY.md` | Baseline, Playwright, asset/claims verification | package approval |
| 2 | `STAGE-02-DATA-MODEL-ROUTES-COMPATIBILITY.md` | Data model, catalogue boundaries, routes, search, relations | 1 |
| 3 | `STAGE-03-PRODUCT-STAGE-AND-LENS.md` | Portrait-aware product stage, Lens, dialog focus | 2 |
| 4 | `STAGE-04-TRADITIONAL-PRODUCTS-AND-COMMERCE.md` | TR products, sizes for sets, colour behaviour, Bag | 3 + approved assets |
| 5 | `STAGE-05-COLLECTION-WALLS.md` | Wall stage, two routes, composition | 4 |
| 6 | `STAGE-06-HOME-INFORMATION-ARCHITECTURE.md` | Home sequence, Making/Promise, wall preview | 5 |
| 7 | `STAGE-07-ARCHIVE-DIAGRAMS-EXHIBITION.md` | Archive overview, strip, exhibition | 2, 3 |
| 8 | `STAGE-08-MOTION-AND-THREAD.md` | Fold scenes, opening, thread | 5, 6, 7 |
| 9 | `STAGE-09-HOUSE-JOURNAL-CLAIMS.md` | House/Journal, claims, disclosure | 6, 7, owner copy |
| 10 | `STAGE-10-ACCESSIBILITY-REGRESSION-RESPONSIVE.md` | Remaining findings, full suite | 2–9 |
| 11 | `STAGE-11-AUDIT-CLOSURE-HANDOVER.md` | Closure, supersession, handover | 10 |

**Sequencing deviation (DEC D-24, owner confirmation required).** The owner-listed baseline order was: 1 baseline · 2 data/routes · 3 collection wall · 4 traditional products · 5 product presentation and Lens · 6 Home · 7 Archive · 8 Motion · 9 House/Journal/claims · 10 accessibility · 11 closure. This package swaps three workstreams, with unchanged filenames except that the file numbered 3 is now the Lens stage:
| Owner-listed workstream | Package stage | Reason (verified dependency) |
|---|---|---|
| 3 Collection wall | **5** | the wall shows TR cards; cards may only link to purchasable products (Stage 4) |
| 4 Traditional products | **4** | unchanged position, but needs the Lens/stage first |
| 5 Product presentation and Lens | **3** | TR images are portrait; the current fixed 16:10 stage crops heads/feet, and the Lens defects (F-06, F-07, F-08) would otherwise be built into every TR page |
If the owner prefers the original order, only Stages 3–5 are re-ordered; their internal content does not change, but Stage 4 would first need an interim portrait fix. Until confirmed, Stage 3 starts after Stage 2.
Critical path: 1 → 2 → 3 → 4 → 5 → 6 → 8 → 10 → 11 (7 and 9 interleave as listed).

## 5. Execution protocol for Antigravity
1. Read this file, `DOCUMENTATION_INDEX.md` and the current stage file only. Work on that stage only.
2. **Git workflow (single, consistent).** `main` is production (a push deploys). Never commit to or push `main` before Stage 11. Stage 1 creates `integration/everthread-v1` from the clean `main` and every stage branch is created from the **current head of `integration/everthread-v1`** after confirming `git status` is clean. When the owner approves a stage, merge its branch into `integration/everthread-v1` with `--no-ff`, tag `stage-NN-approved`, and start the next stage from that head. Stage 11 (owner approval) merges `integration/everthread-v1` into `main`.
3. No opportunistic redesign; no new dependency except Playwright (Stage 1).
4. Run the stage's tests and checks; store evidence in `docs/stage-evidence/STAGE-NN/` with `RESULT.md`.
5. **End-of-stage report (mandatory, exactly these 8 items):** requirements/findings addressed; changed files; tests and checks with **actual** results; visual and interaction evidence; unresolved defects, assumptions, blockers; exit-criteria pass/fail matrix; Git checkpoint and `git status`; explicit request for owner approval.
6. Evidence integrity: for each check record `planned / executed / passed / failed / not run / unverifiable`. Never invent results, screenshots, paths, commits, deployment outcomes or asset properties. Historical results stay labelled historical until re-run.
7. Verdicts: PASS / FAIL / BLOCKED / PARTIAL. A stage passes only when every mandatory exit criterion is met; if one fails, stop and report. Never start the next stage without explicit approval.
8. Never claim live-site verification from local tests.
9. Ambiguous or unapproved values (numbers, timings, wording) are placed in named constants and listed in `RESULT.md` for owner confirmation. Do not invent exact pixel values, timings or visual decisions that no document establishes (`03_…` §9 lists the derived ones).
10. Rollback: revert the stage merge commit on `integration/everthread-v1`; never delete evidence or rewrite history.

## 6. Definition of done
Every finding in `01_…` has a final disposition with evidence; Vitest, Playwright, `tsc`, build pass; responsive, keyboard and reduced-motion reviews recorded; asset registry fully resolved; no unsupported claim shipped; owner sign-off.

## 7. Blockers and external evidence
| ID | Blocker | Affects | Handling |
|---|---|---|---|
| B-1 | Phase 6.0 documents not accessible; owner decision #1 letter ambiguous | Stage 8 start | Derived choreography labelled derived; owner supplies files or confirms |
| B-2 | **Resolved in part:** 40 assets supplied; still `NOT_YET_SUPPLIED`: clean Contemporary plate (`AST-HOME-PLATE`); no asset has owner approval | Stages 4, 5, 6 | Owner approval recorded in the registry |
| B-3 | **Open:** TR-01, TR-03, TR-07 show garments beyond the spec in every/most views (F-47); TR-05 three-quarter duplicate (F-49) | Stage 4 | Owner decision per `02_…` §4 |
| B-4 | Exact approved disclosure and TR status wording not accessible | Stages 4, 9 | Constants with provisional text; owner supplies final text |
| B-5 | Owner copy decisions (claims, House/Making/Promise), edition evidence (DEC D-18, D-21) | Stages 6, 9 | Only `supported` claims ship |
| B-6 | Source resolution of TR images ≈1122 px wide | Stage 3 | Lens magnification capped by native resolution |
| B-7 | Live GitHub Pages verification | Stages 10, 11 | UNVERIFIED until the owner confirms |
| B-8 | **Archive-to-product relationship conflict (F-52):** the latest brief states Banarasi → TR-01 and Kota Doria → TR-04 ("a Chanderi garment"), while the settled list says Banarasi → ET-01 and Kota Doria → ET-04, and TR-04 is specified as a Kanchipuram-inspired set | Stages 2, 7 | Stage 2/7 implement only the non-conflicting items (Sozni info-only, Muga none, TR inspiration links not for Banarasi/Kota until resolved) |
| B-9 | Letters A/B/C of owner decisions 1–12 cannot be verified against original option text | see §8 | Safe defaults, per-stage blocking table |
| B-10 | Masters in repository? (DEC D-23) | Stage 4 | Default: not committed |
| B-11 | Sequencing deviation (DEC D-24) | Stage 3 start | Owner confirmation |

## 8. Owner-decision status (summary; detail in `01_…` §B)
Blocking a stage start: #1 → Stage 8; #2, #3 → Stage 5; #4 → Stage 8; #5 → Stage 7 strip only. Blocking a task only: #6 → listing of TR-01/03/07; #7 + F-52 → Banarasi/Kota relations; #9 → final disclosure wording; #11 → final status wording; #12 → final Making/Promise copy. Safe default applied (reversible): #8, #10. Confirmed by the owner's own text: #13, #14.

## 9. Package index
`00` this file · `01` traceability · `02` asset registry (+ `02a_ASSET_REGISTRY.csv`) · `03` motion/traversal · `04` tests · `STAGE-01…11` · `DOCUMENTATION_INDEX.md` · `FINAL_RECONCILIATION_REPORT.md`.
