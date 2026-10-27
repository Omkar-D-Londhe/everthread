SUPERSEDED in part — see docs/SUPERSEDED.md

# EverThread — Phase 1 Verification-Gap Report

No project file was modified. Browser = headless Chromium against a **local production build** served with GitHub-Pages-style 404 fallback. It is not the live site.

## 1. Baseline
| Item | Value |
|---|---|
| Repository | ZIP "FE Case Study", `.git` present |
| Branch / commit | `main` / `ebf7b6b` (2026-10-22 21:00 +0530) |
| Working tree | clean (0 changes), identical to v2/v3 audited source |
| Scripts | `test` = `vitest run`; build via Vite; **no E2E, visual or accessibility tooling in the repo** |
| Test suite | 15 files, 251 tests, all jsdom (Vitest + Testing Library) |

## 2. Source-of-truth index (compact)
| Document | Path | Role | Read |
|---|---|---|---|
| Implementation Brief | `docs/EverThread_Implementation_Brief.md` | **Authoritative** approved decisions (routes, Story Flow §7, page content §8) | Sections 4–8 |
| Remaining Project Roadmap | `docs/…Roadmap.md` | **Authoritative** invariants §2.3 (loader timing, colourways, Archive IDs) | §2.2–2.3 |
| Exhibition Spec | `docs/…Exhibition_Spec.md` | **Authoritative** exhibition, motion arc, protected data §13 | §1, Opening, §13 |
| Acceptance Checklist | uploads | Latest requirements (**Cultural Collection appears only here**) | Full (v2) |
| `instructions.md` | `docs/` | Oldest brief; **superseded** on catalogue names and routes | Full (v2) |
| v2 / v3 audits, matrices, motion record | outputs | Prior evidence | Own artifacts |
| Phase 6.3–7.3 reports | `docs/` | Supplementary history; 7.2 §5 and 7.3 visual report are **superseded** | Targeted |
| `phase_6_6_preflight_audit.md` | `docs/` | Contains erroneous catalogue; **uncertain/superseded** | §4.2 |
| **Phase 6.0 Experience Audit & Redesign Plan; Cinematic Motion Storyboard** | — | Would be authoritative for motion/homepage | **NOT FOUND** |

**Phase 6.0 search (this run):** filenames `*6_0*`, `*storyboard*`, `*experience_audit*`, `*redesign_plan*` over the whole sandbox; content search for the two titles, "Homepage Choreography", `stage_6_0`, `phase_6_0` in the working tree and all git commits; `/mnt/transcripts` (empty); the ZIP and uploads. Result: none exist; the only hits are my own v3 outputs. Earlier conversation materials are not available to me in this session, so I cannot recover them. **Please upload both files** (variants `phase_6_0_…`/`stage_6_0_…`). The only description of their content I have is your directive's summary (hero thread trace → masked headline → plinth illumination → settle; scrub hand-off to Highlights); I have not treated that as the storyboard.

## 3. Evidence reused (valid: same commit, clean tree)
v2 runtime results (Bag/Saved/checkout flow, 13 Archive exhibitions, route sweep at 3 widths, Lens, search, loader timing, reduced motion, overflow measurement), v3 signature-motion measurement, 251 tests / `tsc` / build.

## 4. Checks actually executed in this phase
1. Repo state and git history search for the Phase 6.0 files.
2. Test inventory: files, case counts, describe topics; confirmed no E2E/a11y tooling.
3. **Internal link crawl:** 24 unique internal links across 12 routes → **0 broken**.
4. **Search destination sweep:** 14 queries → 28 destinations → **1 dead** (`/archive?tradition=radial-bias-draping`).
5. **History:** back/forward across three routes correct.
6. **Hero CTAs, sort, filters, Journal, PDP related links** read from DOM.
7. **Exhibition modal via real click:** focus lands on Close; **after 14 Tab presses focus is outside the dialog; Escape then does not close it** (new defect).
8. **Accessibility DOM baseline on 9 routes:** 1 h1, 1 main, skip link, `lang="en"`, 0 duplicate ids; one unlabelled email input on every page (newsletter); the "nameless controls" my script flagged were hidden mobile-nav links (false positive).
9. **Archive overview** full-page screenshots (desktop, mobile) reviewed.
10. Compass flow attempted; **inconclusive** (my selectors captured no results). Compass stays NOT TESTED in browser; its 24 existing unit/UI tests are unreviewed here.

## 5. Requirements with no adequate verification
- Real host: every route, asset path, font loading, refresh behaviour (**BLOCKED**).
- Visual quality and feel of every animation (needs a human recording).
- Lens touch-drag; Lens on ET-02…07; image-failure states.
- Compass browser flow, results, determinism, reverse navigation.
- Saved "move to Bag" click; combined PDP+Archive cart.
- Tablet (1024 px) visual review; contrast beyond brand colours; screen-reader behaviour; touch-target sizes.
- Human review of 78 Archive plates for subject correctness.
- Archive fallback behaviour (broken SVG/WebP).

## 6. Newly discovered since v3
| New | Evidence |
|---|---|
| Exhibition modal: no focus trap; Esc fails once focus leaves | [browser] |
| Hero secondary CTA reads "Discover the Stories"; Brief §8 specifies "Enter the Archive" | [browser] vs Brief |
| Sorting lacks "newest"; Brief §8 lists featured/newest/price asc/desc | [browser] vs Brief |
| Archive overview is a uniform 14-tile grid (Brief: "curated exhibition rather than … endless generic grid"; Spec: avoid "six equal tiles") | [screenshot] |
| Newsletter email input has no accessible label | [browser DOM] |
| Existing tests assert incorrect behaviour as correct (e.g. archive mapping) and cannot catch the Lens/search bugs | [source] |
| No E2E/browser/a11y tests in repo; all 251 tests are jsdom | [source] |

## 7. Previous findings that no longer reproduce
None. Reclassified (not "fixed"): loader delay (protected timing → decision), colourways (protected data → decision), Cultural Collection (unresolved scope → decision).

## 8. Coverage
Browser/viewport: desktop 1440, tablet 1024 and mobile 390 for the route sweep, motion and overflow tests; most interaction tests desktop only. Blocked: live host. Exact regression tests needed during implementation are listed per finding in `everthread_solution_proposal.md` (and stage gates later).

## 9. Unresolved issues that must be addressed
Story Flow missing; Archive mapping/purchase actions; Lens source, alignment and focus; exhibition focus trap; dead search link; mobile overflow; legacy alt text; filename captions; hero claim inconsistency; Archive overview redesign decision; exhibition opening; hero CTA copy; "newest" sort; unlabelled newsletter input; contrast of focus ring; icon-font fallback; documentation contradictions; deployment verification; missing Phase 6.0 documents.

## 10. Efficiency note
Reused: all v2/v3 runtime evidence and build/test results. New checks run: items 1–9 above (about six scripted browser sessions). Documents read fully: checklist and `instructions.md` (earlier); selectively: Brief, Roadmap, Exhibition Spec, 6.3.2.2.x, 7.x reports. Not re-run: tests/tsc/build (unchanged inputs). Unverified: items in §5.

Companion: `everthread_phase1_functionality_inventory.csv` (40 feature-level rows; the 369-row `everthread_requirements_matrix_v3` remains the detailed trace).
