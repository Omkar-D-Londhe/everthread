> **OWNER CORRECTION ADDENDUM — 2026-10-27 (documentation-only; supersedes stale O-7/catalogue status notes)**
> The owner confirms that the Traditional Collection clothing-piece mappings were already supplied to Antigravity and that the Traditional Collection products have already been made purchasable. Preserve the previously supplied mapping; do not ask the owner to remap the entries or re-approve the mapping as a new decision.
>
> Older audit snapshots that state `TR-01`–`TR-07` are `isListed: false` / `isPurchasable: false`, or describe related mappings as blocked solely because of that status, are historical snapshots and are superseded by this owner correction for planning/documentation purposes. Do not present those older values as the current state. The current code/runtime has not been independently inspected in this documentation-only pass, so this is recorded as **owner-confirmed current state**, not as a newly executed technical verification.
>
> O-7 remains governed by the already-approved safeguards: preserve the existing owner-provided mapping; describe relationships as “related” or “inspired by,” never as “made with” unless independently supported; keep Archive entries educational and do not add purchase actions to the Archive folio itself; retain Sozni as informational-only and Muga Silk without a product association; do not describe Kota Doria as a garment; word the Chanderi relationship as Chanderi. Update documentation and acceptance notes to reflect the owner-confirmed purchasability state. **No application code changes are authorized by this addendum.**

---

# 01 — Requirements and Decision Traceability

Sources (kept, not copied): `everthread_audit_report_v2.md`, `everthread_audit_reassessment_v3.md`, `everthread_master_findings_register.md` (F-01…F-33), `everthread_completeness_check.md` (F-34…F-46, DEC D-18…D-22), `everthread_decision_register.md`, `everthread_solution_proposal.md`, `everthread_requirements_matrix_v3.csv` (`CL-nnn` = acceptance-checklist line number; `V3-nn`), `everthread_phase1_*`, `everthread_motion_verification_v3.md`, the Implementation Brief, Roadmap §2.3 invariants, and the two experience reviews.
Test IDs (`UT-`, `E2E-`, `MAN-`) are defined in `04_TEST_AND_ACCEPTANCE_PLAN.md`. Acceptance criteria are in the named stage file.

## A. ID namespaces (collision warning)
`D-nn` is used for **two** things in earlier documents. Here: **DEF D-nn** = v2 defect IDs (all merged into the F-rows below); **DEC D-nn** = decision-register IDs (§D). `F-nn` = canonical findings. `O-n` = owner decisions 1–14 (§B).

## B. Owner decisions 1–14
The letters were supplied without the original option text. Interpretation uses only the descriptive text in the instruction prompt. "Ambiguity" is the exact uncertainty; the safe default is what the stages implement.

| O | Decision (letter) | Interpretation used | Ambiguity | Safe default | Stage |
|---|---|---|---|---|---|
| O-1 | Phase 6.0 documents: C | Inspect the original materials before relying on summaries; never claim access to what is missing | Register option C read "pause motion work" | Motion proceeds from Brief §7 (Story Flow also approved earlier); derived choreography labelled derived | 1, 8 |
| O-2 | Wall URLs: A | `/collections` = Contemporary (canonical, unchanged); `/collections/the-living-inheritance` = second wall; old links keep working | Option wording not available | Path routes | 2, 5 |
| O-3 | Wall switch: A | Native horizontal scroll-snap stage, visible next-wall edge, labelled wall titles (tablist), route sync | — | As stated in review | 5 |
| O-4 | Motion: A | Restrained hybrid with approved fold Story Flow and Initiate→Glide→Settle | Could mean "Glide-led" | Hybrid (fold at 7 boundaries) | 8 |
| O-5 | Diagrams: A | Scroll-driven Technique Strip, nine diagrams, no autoplay | — | As reviewed | 7 |
| O-6 | TR-01/TR-03/TR-07 image/specification reconciliation: C (explicit owner decision, 2026-10-26) | Decide separately for each product; retain only images that accurately represent the intended product and replace mismatches | Individual image-level decisions remain pending; owner has not approved any specific image or changed any product specification | Inspect every affected view against the intended product specification. Keep a matching image only if its garment identity, included pieces, silhouette, colourway, and view are consistent. Replace mismatches; update product specifications only if separately approved. A product remains unlistable until its required assets are verified and approved. | 1, 4 |
| O-7 | Archive→traditional links: B | Archive folio may show an informational "design inspired by this tradition" link to the matching TR product where the relationship is supported by the approved concept spec; never an Acquire/Add to Bag | — | Link only, 7 relationships in Stage 2 | 2, 7 |
| O-8 | Compass scope: B | Compass behaviour, matcher, tags and tests preserved | Could mean "include TR" | Compass reads contemporary products only | 2, 10 |
| O-9 | AI concept disclosure: A | Concept disclosure with structured provenance; approved wording | **Wording text unavailable** | Constant `CONCEPT_NOTICE_TEXT` provisional; owner supplies final (B-4) | 2, 4, 9 |
| O-10 | Colour selection: A | Selected colour, shown image, Bag line and checkout stay consistent; never imply an image shows a colour it does not | — | If no per-colour images, show honest note "Images show {default colour}" | 4 |
| O-11 | TR status: A | Concept status; no edition, hours, origin, dispatch or manufacturing claims | Wording unavailable | Constant `TR_STATUS_TEXT` provisional | 2, 4 |
| O-12 | Making/Promise: B | Condensed scene with copy limited to supported statements; full copy after claims audit | — | Neutral copy from supported list only | 6, 9 |
| O-13 | Scope: B | Implement fully, with a narrow verification gate for the risky wall interaction | — | Stage 5 Playwright gate | 5 |
| O-14 | Approval sequence: A | One stage at a time with owner approval | — | Section 5 of roadmap | all |

## C. Settled decisions carried forward
Home CTA "Enter the Archive" (F-26, Stage 6) · loader ≈2.3 s unchanged (F-14; test E2E-LOAD-01, Stage 10) · colourways names-only (O-10) · no Newest sort (F-17, deferred permanently until real dates) · minus at qty 1 never deletes (F-20, Stage 4) · legacy Archive and product routes redirect (F-40, Stage 2) · Playwright dev dependency (F-31, Stage 1) · GitHub Pages and simulated checkout (all) · Archive→ET: Banarasi→ET-01 (verified Kadwa-facing wording), Kota Doria→ET-04 (Chanderi wording only), Sozni→ET-07 informational only, Muga→none (F-05, Stage 2/7) · Archive educational (all) · historical conflicting catalogue docs retained and marked superseded (F-22, Stage 11) · editions on hold (F-46) · claims need evidence (F-41) · ET-02 title resolved (F-32, Stage 2) · captions "Tradition — role" (F-12, Stage 7) · credit fields now, visible attribution deferred (F-42, Stage 2).

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
| D-18 | **On hold** (editions) → F-46 |
| D-19 | Approved: legacy slugs resolve → Stage 2 |
| D-20 | Fields now, visible credit text deferred → Stage 2 |
| D-21 | **Pending owner**: approve replacement copy → B-5, Stage 9 |
| D-22 | Resolved by this roadmap |

## E. Findings F-01…F-46
Status key: **Impl** implement; **Verify** confirm only; **Hold** blocked by an open decision/evidence; **Closed** resolved by an approved decision.

| ID | Finding | Disposition | Stage | Files / routes | Tests | Merged refs |
|---|---|---|---|---|---|---|
| F-01 | Story Flow fold missing | Impl | 8 | `HomePage.tsx`, `ArchivePage.tsx`, `HousePage.tsx`, `useEditorialScroll.ts`, `animations.css` (unused `.fabric-*`) | E2E-MOTION-01…04 | V3-01…04, CL-446 |
| F-02 | Home journey/thread continuity | Impl | 6 (structure), 8 (motion) | `HomePage.tsx` | E2E-HOME-01, MOTION | V3-05, V3-07 |
| F-03 | Archive overview uniform grid | Impl | 7 | `ArchivePage.tsx`, styles | E2E-ARCH-01 | — |
| F-04 | Exhibition 5-step opening | Impl | 7 (hooks), 8 (choreography) | `TraditionExhibitionModal.tsx` | E2E-MOTION-01, ARCH-02 | V3-06 |
| F-05 | Archive Acquire mapping unsafe | Impl | 2 (remove, data), 7 (UI) | `TraditionExhibitionModal.tsx` L27+, `archive-commerce-guidance.test.tsx`, `phase-7-3…test.tsx` | UT-ARCH-01, E2E-ARCH-03 | DEF D-01 |
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
| F-17 | Newest sort | Closed (deferred) | — | — | — | — |
| F-18 | Gallery/Compass/accordion transitions unverified | Verify | 3 (gallery), 10 (Compass, accordions) | PDP, `CompassPage.tsx` | E2E-A11Y, MAN-REC | CL-296…308 |
| F-19 | Compass browser verification | Verify | 10 | `CompassPage.tsx`, `compassMatcher.ts` | E2E-COMP-01 | CL-140/307 |
| F-20 | Bag index API; unknown IDs; minus at 1 | Impl | 4 | `CartContext.tsx`, `BagPage.tsx` | UT-CART-01, E2E-CART-03 | DEF D-10 |
| F-21 | Icon font fallback | Impl | 10 | components using Material Symbols, `index.html` | E2E-DEPLOY-01 (fonts blocked) | V3-10 |
| F-22 | Documentation contradictions | Impl | 11 | `docs/` | MAN | DEF D-15, V3-12 |
| F-23 | Chunk size, asset weight | Verify | 10 | `vite.config.ts` | build log | DEF D-16 |
| F-24 | Live deployment | Hold (owner) | 10, 11 | — | MAN-LIVE | V3-14 |
| F-25 | Phase 6.0 documents missing | Hold | 1 record, 8 | — | — | V3-11 |
| F-26 | CTA "Enter the Archive" | Impl | 6 | `HomePage.tsx` | E2E-HOME-01 | — |
| F-27 | Uppercase product IDs | Impl | 2 | `products.ts` lookup | E2E-ROUTE-04 | DEF D-14 |
| F-28 | `?tradition` persists after close | Impl | 7 | `ArchivePage.tsx` | E2E-ARCH-02 | DEF D-12 |
| F-29 | Focus ring contrast | Impl | 10 | `main.css` | E2E-A11Y-03 | DEF D-13 |
| F-30 | Newsletter input label | Impl | 10 | footer component | E2E-A11Y-01 | — |
| F-31 | No E2E/a11y tests; tests encode wrong behaviour | Impl | 1 (tooling), every stage | `src/tests/*`, `e2e/` | all | — |
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
| F-42 | Credits incomplete | Impl (fields) | 2; visible text deferred | data types | UT-DATA-02 | — |
| F-43 | Phase 6.0 homepage critiques | Verify | 6, 8 | `HomePage.tsx` | MAN-REC | — |
| F-44 | Test debt | Impl | 1 list; each stage | tests | all | — |
| F-45 | Process rows (Git, deploy, report) | Impl | roadmap §5; 11 | — | — | CL-029, 582–593 |
| F-46 | Editions conflict | Hold (DEC D-18) | 9 verify | `products.ts` | MAN-CLAIMS | — |

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
