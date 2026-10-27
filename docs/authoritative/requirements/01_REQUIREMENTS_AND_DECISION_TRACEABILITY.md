# 01 — Requirements and Decision Traceability — Revision 2

> **Notice:** Authoritative implementation, verification, and audit statuses live in `docs/implementation/01b_AUDIT_TRACKER.csv`. Owner-decision addenda are dated. Do not maintain duplicate statuses here.

Sources (kept, not copied): `everthread_audit_report_v2.md`, `everthread_audit_reassessment_v3.md`, `everthread_master_findings_register.md` (F-01…F-33), `everthread_completeness_check.md` (F-34…F-46, DEC D-18…D-22), `everthread_decision_register.md`, `everthread_solution_proposal.md`, `everthread_requirements_matrix_v3.csv` (`CL-nnn` = acceptance-checklist line number; `V3-nn`), `everthread_phase1_*`, `everthread_motion_verification_v3.md`, the Implementation Brief, Roadmap §2.3 invariants, and the two experience reviews.
Test IDs (`UT-`, `E2E-`, `MAN-`) are defined in `04_TEST_AND_ACCEPTANCE_PLAN.md`. Acceptance criteria are in the named stage file.

## A. ID namespaces (collision warning)
`D-nn` is used for **two** things in earlier documents. Here: **DEF D-nn** = v2 defect IDs (all merged into the F-rows below); **DEC D-nn** = decision-register IDs (§D). `F-nn` = canonical findings. `O-n` = owner decisions 1–14 (§B).

## B. Owner decisions 1–14 (verification status)
**Verification result.** The original option wording behind the letters A/B/C is not in any file I can access (my own `everthread_decision_register.md` uses D-01…D-22 and unlettered options, so letters cannot be matched to it). I therefore do **not** treat any letter as a verified meaning. "Owner text" is the descriptive sentence supplied with the decision. Status terms: `CONFIRMED BY OWNER TEXT` (the supplied sentence is explicit enough to act on) · `DEFAULT APPLIED — OWNER CLARIFICATION REQUIRED` (a conservative, reversible default is implemented; the owner must confirm) · `BLOCKED — OWNER CLARIFICATION REQUIRED` (the named stage/task must not proceed on a guess).

| O | Letter | Owner text (summary) | Status | Default or effect | Blocks | Stage |
|---|---|---|---|---|---|---|
| O-1 | C | Phase 6.0 sources: follow the selected resolution; inspect originals before relying on summaries; do not fabricate access | **BLOCKED — OWNER CLARIFICATION REQUIRED** | Documents still not found. My own D-01 option C read "pause motion work", which would contradict the later text | start of Stage 8 | 1, 8 |
| O-2 | A | Wall URLs: keep selected approach; reconcile with `/collections` + `/collections/the-living-inheritance`; keep legacy links | **BLOCKED — OWNER CLARIFICATION REQUIRED** | Proposed: path routes (recorded, not applied) | start of Stage 5 | 2, 5 |
| O-3 | A | Wall switch: normal, low-effort browsing; premium; no hidden gesture | **BLOCKED — OWNER CLARIFICATION REQUIRED** | Proposed: native horizontal scroll track + labelled tabs | start of Stage 5 | 5 |
| O-4 | A | Motion: selected direction; reconcile with restrained hybrid without silently replacing | **BLOCKED — OWNER CLARIFICATION REQUIRED** | Fold Story Flow separately approved earlier (no pin/snap) | start of Stage 8 | 8 |
| O-5 | A | Technical diagrams: selected presentation; reconcile with the 9-diagram inventory | **BLOCKED — OWNER CLARIFICATION REQUIRED** | Proposed: scroll-driven Technique Strip | Technique Strip task in Stage 7 only | 7 |
| O-6 | B | TR-01/TR-07 mismatch: images must not show garments outside the spec | **BLOCKED — OWNER CLARIFICATION REQUIRED** | Supplied images still show extra garments (F-47) | listing TR-01, TR-03, TR-07 | 4 |
| O-7 | B | Archive→traditional links only where accurate | **BLOCKED — OWNER CLARIFICATION REQUIRED** with F-52 | Sozni info-only and Muga none proceed; Banarasi/Kota entries wait | Banarasi and Kota relation entries | 2, 7 |
| O-8 | B | Compass scope: preserve matcher, tags, tests; do not silently include TR | **DEFAULT APPLIED — OWNER CLARIFICATION REQUIRED** | Compass reads contemporary products only | none (reversible) | 2, 10 |
| O-9 | A | AI concept disclosure with approved wording | **DEFAULT APPLIED — OWNER CLARIFICATION REQUIRED** | Constant `CONCEPT_NOTICE_TEXT`, provisional text | final wording blocks Stage 9 PASS | 4, 9 |
| O-10 | A | Colour selection stays consistent with image, Bag, checkout; never imply a colour photograph | **DEFAULT APPLIED — OWNER CLARIFICATION REQUIRED** | Honest note "Images show {first colour}" | none | 4 |
| O-11 | A | TR status: concept policy; no edition/hours/origin/dispatch/manufacturing claims | **DEFAULT APPLIED — OWNER CLARIFICATION REQUIRED** | Constant `TR_STATUS_TEXT`, provisional | final wording blocks Stage 9 PASS | 2, 4 |
| O-12 | B | Making/Promise: selected treatment, copy subject to claims audit | **DEFAULT APPLIED — OWNER CLARIFICATION REQUIRED** | Claim-free scene (narrative spine links + approved brand lines) | final copy blocks Stage 9 PASS | 6, 9 |
| O-13 | B | Implement fully (no proposal-only downgrade); narrow verification gate for risky interaction | **CONFIRMED BY OWNER TEXT** | Stage 5 spike gate | — | 5 |
| O-14 | A | Serial stage-by-stage approval | **CONFIRMED BY OWNER TEXT** | Roadmap §5 | — | all |

### Dated Addendum: Owner Decision O-6-C (2026-10-26)
Per Master Operating Prompt §5, the owner confirmed Option O-6-C: evaluate EVERY image individually against the product specification. Retain only images that accurately represent the intended product (the garments the specification says are included); replace mismatches. This decision does NOT approve any image and does NOT authorise changing the product specification. All affected images remain unapproved (registry status not APPROVED) until the owner reviews them. Replacements must be supplied by the owner. This supersedes the earlier package record of O-6 as "B/blocked".

## C. Settled decisions carried forward
Home CTA "Enter the Archive" (F-26, Stage 6) · loader ≈2.3 s unchanged (F-14; test E2E-LOAD-01, Stage 10) · colourways names-only (O-10) · no Newest sort (F-17, deferred permanently until real dates) · minus at qty 1 never deletes (F-20, Stage 4) · legacy Archive and product routes redirect (F-40, Stage 2) · Playwright dev dependency (F-31, Stage 1) · GitHub Pages and simulated checkout (all) · Archive→ET (settled earlier): Banarasi→ET-01 (Kadwa-facing wording), Kota Doria→ET-04 (Chanderi wording only), Sozni→ET-07 informational only, Muga→none (F-05, Stage 2/7) — **Banarasi and Kota Doria entries are now in conflict with the latest brief (F-52, DEC D-25)** · Archive educational (all) · historical conflicting catalogue docs retained and marked superseded (F-22, Stage 11) · editions on hold (F-46) · claims need evidence (F-41) · ET-02 title resolved (F-32, Stage 2) · captions "Tradition — role" (F-12, Stage 7) · credit fields now, visible attribution deferred (F-42, Stage 2).

## D. Decision-register dispositions (DEC)
| DEC | Disposition |
|---|---|
| D-01 | Not recoverable → B-1; derived choreography (O-1) |
| D-02 | Approved (fold, no pin/snap) → Stage 8 |
| D-03 | Approved: overview redesign only → Stage 7 |
| D-04 | Approved per §C (plus O-7) → Stage 2/7 |
| D-05 | Resolved: separate collection "The Living Inheritance"; Archive stays educational |
| D-06 | Keep loader → no change |
| D-07 | Names-only + O-10 |
| D-08 | ET-01 record is the source of hero metadata → Stage 6 |
| D-09 | Neutral captions → Stage 7 |
| D-10 | TR images required → asset manifest, B-2 |
| D-11 | Approved → Stage 6 |
| D-12 | Closed: no Newest |
| D-13 | Approved: minus never deletes |
| D-14 | Approved: ET-02 title resolution |
| D-15 | Superseded by approved related-piece pattern (no Acquire) → Stage 2 |
| D-16 | Approved: supersession notices → Stage 11 |
| D-17 | Approved → Stage 1 |
| D-18 | Resolved by Owner Risk Acceptance (2026-10-27) → Contemporary ET edition claims accepted as-is for assessment; zero TR edition numbers |
| D-19 | Approved: legacy slugs resolve → Stage 2 |
| D-20 | Fields now, visible credit text deferred → Stage 2 |
| D-21 | **Pending owner**: approve replacement copy → B-5, Stage 9 |
| D-22 | Resolved by this roadmap |
| D-23 (new) | **Pending owner:** commit PNG masters (~90 MB) to the repository or keep them in the handover ZIP (default: keep out) → Stage 4 |
| D-24 (new) | **Pending owner:** confirm sequencing deviation (Lens before TR products, wall after) → roadmap §4 |
| D-25 (new) | **Pending owner:** which products Banarasi and Kota Doria folios link to (ET-01/ET-04 settled earlier vs TR-01/TR-04 in the latest brief; TR-04 is specified as Kanchipuram-inspired, not Chanderi) → F-52, Stages 2, 7 |

## E. Findings F-01…F-54 (F-47…F-54 added in Revision 2; no existing ID renumbered)
Status key: **Impl** implement; **Verify** confirm only; **Hold** blocked by an open decision/evidence; **Closed** resolved by an approved decision.

| ID | Finding | Disposition | Stage | Files / routes | Tests | Merged refs |
|---|---|---|---|---|---|---|
| F-01 | Story Flow fold missing | Impl | 8 | `HomePage.tsx`, `ArchivePage.tsx`, `HousePage.tsx`, `useEditorialScroll.ts`, `animations.css` (unused `.fabric-*`) | E2E-MOTION-01…04 | V3-01…04, CL-446 |
| F-02 | Home journey/thread continuity | Impl | 6 (structure), 8 (motion) | `HomePage.tsx` | E2E-HOME-01, MOTION | V3-05, V3-07 |
| F-03 | Archive overview uniform grid | Impl | 7 | `ArchivePage.tsx`, styles | E2E-ARCH-01 | — |
| F-04 | Exhibition 5-step opening | Closed (owner accepted) | 7 (hooks), 8 (choreography) | `TraditionExhibitionModal.tsx` | E2E-MOTION-01, ARCH-02, E2E-MOTION-05 | V3-06 |
| F-05 | Archive Acquire mapping unsafe → replace by approved related-piece pattern | Impl (partial hold) | 2 (remove Acquire, data), 7 (UI) | `TraditionExhibitionModal.tsx` L27+, `archive-commerce-guidance.test.tsx`, `phase-7-3…test.tsx` | UT-ARCH-01, E2E-ARCH-03 | DEF D-01; Banarasi/Kota entries held by F-52 |
| F-06 | Lens ignores gallery selection | Impl | 3 | `ProductDetailPage.tsx` L874, `AtelierLensModal.tsx` | E2E-LENS-01 | DEF D-03 |
| F-07 | Lens alignment, upscaling, alt | Impl | 3 | `AtelierLensModal.tsx` | UT-LENS-01, E2E-LENS-02 | DEF D-04 |
| F-08 | Dialog focus (Lens, Exhibition, Search) | Impl | 3 (helper, Lens, Search), 7 (Exhibition) | `AtelierLensModal.tsx`, `SearchModal.tsx`, `TraditionExhibitionModal.tsx` | E2E-LENS-03, ARCH-02 | DEF D-04, D-12 |
| F-09 | Search weave-14 dead link | Impl | 2 | `SearchModal.tsx` L101 | E2E-SEARCH-01 | DEF D-07 |
| F-10 | Mobile overflow | Impl | 3 (PDP), 7 (Archive story button), 10 (remainder, final) | PDP, Archive story page, Journal link, header | E2E-RESP-01 | DEF D-08 |
| F-11 | ET-04 legacy alt text | Impl | 2 | `assetMap.ts` | UT-DATA-01, E2E-A11Y | DEF D-06 |
| F-12 | Filename-like captions | Impl | 7 | `TraditionExhibitionModal.tsx` (shows `activeItem.alt`), generated catalogue | E2E-ARCH-05 | DEF D-09 |
| F-13 | Hero claims contradict ET-01 | Impl | 6 | `HomePage.tsx` L574–582 | E2E-HOME-01 | V3-09 |
| F-14 | Loader timing | Closed (keep) | 10 verify | `ThreadLoader.tsx` L60 (1900 ms), `App.tsx` | E2E-LOAD-01 | DEF D-05 |
| F-15 | Colourways | Impl (behaviour) | 4 | PDP, products data | E2E-CART-04 | DEF D-11 |
| F-16 | Cultural vs Traditional collection | Closed: separate collection | 2, 4, 5 | routes, data | E2E-WALL-01 | DEF D-02 |
| F-17 | Newest sort | Closed (deferred by owner) | 5 (negative check) | — | UT-COLL-01 | — |
| F-18 | Gallery/Compass/accordion transitions unverified | Verify | 3 (gallery), 10 (Compass, accordions) | PDP, `CompassPage.tsx` | E2E-A11Y, MAN-REC | CL-296…308 |
| F-19 | Compass browser verification | Verify | 10 | `CompassPage.tsx`, `compassMatcher.ts` | E2E-COMP-01 | CL-140/307 |
| F-20 | Bag index API; unknown IDs; minus at 1 | Impl | 4 | `CartContext.tsx`, `BagPage.tsx` | UT-CART-01, E2E-CART-03 | DEF D-10 |
| F-21 | Icon font fallback | Impl | 10 | components using Material Symbols, `index.html` | E2E-DEPLOY-01 (fonts blocked) | V3-10 |
| F-22 | Documentation contradictions | Impl | 11 | `docs/` | MAN-DOCS | DEF D-15, V3-12 |
| F-23 | Chunk size, asset weight | Verify | 10 | `vite.config.ts` | MAN-BUILD | DEF D-16 |
| F-24 | Live deployment | Closed (accepted limitation / live verification deferred by owner) | 10, 11 | `e2e/pagesServer.mjs` | MAN-LIVE | V3-14 |
| F-25 | Phase 6.0 documents missing | Hold | 1 record, 8 | — | MAN-OWNER | V3-11 |
| F-26 | CTA "Enter the Archive" | Impl | 6 | `HomePage.tsx` | E2E-HOME-01 | — |
| F-27 | Uppercase product IDs | Impl | 2 | `products.ts` lookup | E2E-ROUTE-04 | DEF D-14 |
| F-28 | `?tradition` persists after close | Impl | 7 | `ArchivePage.tsx` | E2E-ARCH-02 | DEF D-12 |
| F-29 | Focus ring contrast | Impl | 10 | `main.css` | E2E-A11Y-03 | DEF D-13 |
| F-30 | Newsletter input label | Impl | 10 | footer component | E2E-A11Y-01 | — |
| F-31 | No E2E/a11y tests; tests encode wrong behaviour | Impl | 1 (tooling), every stage | `src/tests/*`, `e2e/` | MAN-GATE, E2E-ROUTE-01 | — |
| F-32 | ET-02 title/fibre | Closed → implement | 2 | `products.ts`, slugs | UT-DATA-01, E2E-ROUTE-04 | — |
| F-33 | Plate-label truncation | Impl | 7 | exhibition thumbnails | E2E-RESP-01 | CL-093 |
| F-34 | Motion perceptibility, tablet review | Verify | 8, 10 | all routes | MAN-REC, MAN-VIS | — |
| F-35 | Brand-consistency review | Verify | 10 | all | MAN-VIS | — |
| F-36 | Failure-mode states | Impl/verify | 3 (Lens), 7 (Archive), 10 | — | E2E-LENS-04 | — |
| F-37 | A11y audit | Verify | 10 | all | E2E-A11Y-01…03 | — |
| F-38 | Human image/data review | Verify | 1 (manifest), 7 | assets | MAN-VIS | — |
| F-39 | Search phrase matching | Impl | 2 | `SearchModal.tsx` | UT-SEARCH-01 | DEF D-07 |
| F-40 | Legacy slugs `/archive/<legacy>` | Impl | 2 | `App.tsx`, `ArchivePage.tsx` | E2E-ROUTE-04 | — |
| F-41 | Claims audit beyond Archive | Impl | 1 (inventory), 6, 9 | Home, House, Journal, PDP copy | MAN-CLAIMS | — |
| F-42 | Credits incomplete | Closed (deferred by owner) | 2; visible text deferred | data types | UT-DATA-02 | — |
| F-43 | Phase 6.0 homepage critiques | Verify | 6, 8 | `HomePage.tsx` | MAN-REC | — |
| F-44 | Test debt | Impl | 1 list; each stage | tests | MAN-GATE | — |
| F-45 | Process rows (Git, deploy, report) | Impl | roadmap §5; 11 | — | MAN-GATE, MAN-LIVE | CL-029, 582–593 |
| F-46 | Editions conflict | Closed (accepted risk by owner) | 9 verify | `products.ts` | MAN-CLAIMS | — |
| F-47 | TR gallery mismatches: TR-01 trousers + inner top in all 5 views; TR-03 inner top in 5 of 6; TR-07 champagne skirt in all 5; TR-05 seated legwear ambiguous | Hold (owner) | 1 (verify), 4 (gate) | `02_…` §4, `traditionalProducts.ts` | UT-DATA-02, MAN-VIS | O-6 |
| F-48 | `living-inheritance-collection-campaign.png` is pixel-identical to the rejected panorama (baked thread, non-catalogue figures) | Hold (owner) | 5, 6 | `AST-HOME-CAMP` | MAN-VIS | — |
| F-49 | TR-05 primary and three-quarter near-duplicate | Hold (owner) | 4 | `AST-TR05-3Q` | UT-DATA-02 | — |
| F-50 | File irregularities: `primary..png`, TR-03 detail landscape 1374×1145, TR-06 1127×1396 | Impl | 4 | derivative naming, stage layout | E2E-PDP-01 | — |
| F-51 | Hero shows a riverfront skyline and a non-catalogue sari; location/provenance must not be asserted | Hold (owner) | 5, 6 | `AST-HOME-HERO` | MAN-CLAIMS | — |
| F-52 | Relationship conflict between latest brief and settled decisions (Banarasi/Kota Doria → TR or ET; TR-04 described as Chanderi) | Hold (owner) | 2, 7 | `archiveRelations.ts` | UT-ARCH-01 | DEC D-25 |
| F-53 | Stage order differs from the owner-listed order | Hold (owner) | roadmap | `00_…` §4 | MAN-OWNER | DEC D-24 |
| F-54 | Package v1 contradictions (Git, Stage 1 route tests, snap wording, asset gating, stage-scoped tests) | Closed in Revision 2 | all | package files | MAN-DOCS | — |

## F. New requirements from the experience reviews
| ID | Requirement | Stage |
|---|---|---|
| N-01 | Two collection walls and route sync | 5 |
| N-02 | TR-01…TR-07 sellable concept products | 2, 4 |
| N-03 | Independent top/bottom sizes for sets | 4 |
| N-04 | Portrait-aware product stage | 3 |
| N-05 | Hover Lens on desktop, tap modal on touch | 3 |
| N-06 | Technique strip (9 diagrams) | 7 |
| N-07 | Making/Promise condensed scene | 6 |
| N-08 | Fold panels at ≈7 boundaries | 8 |
| N-09 | Provenance/credit/concept fields | 2 |
| N-10 | Archive↔TR inspiration links | 2, 7 |

## G. Acceptance-checklist (`CL-nnn`) coverage
Every row of `everthread_requirements_matrix_v3.csv` maps through the F-row in its "Merged refs" or by section: §2.1 Bag → F-20, Stage 4/10 · §2.2/§4 Cultural → F-16, N-02, Stages 2/4/5 · §2.3/§6 Lens → F-06/07/08, Stage 3 · §2.4/§7 Motion → F-01/34, Stage 8 · §2.5/§9 Archive → F-03/04/12/33, Stage 7 · §2.6/§8 Search → F-09/39, Stage 2 · §2.7 Loader → F-14 · §3 Catalogue → F-32, Stage 2 · §5 Commerce → Stage 4/10 · §10 Brand → F-35 · §11 Technical → Stages 2, 10 · §12 A11y → F-29/30/37 · §13–14 Testing/Git → F-31/45 · §17 Final acceptance → Stage 11. Rows currently NOT VERIFIED are verification tasks in Stages 8 and 10.
