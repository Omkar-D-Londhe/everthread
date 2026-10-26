# EverThread — Pre-Implementation Completeness Check

Method: every non-PASS row of `everthread_requirements_matrix_v3.csv` and every v2 (`D-nn`) and v3 (`V3-nn`) ID was compared with the master findings register, solution proposal and decision register. All 16 v2 IDs and all 14 v3 IDs are accounted for. The five stage plans do not exist yet; "plan" below means the provisional outline in `everthread_solution_proposal.md` §4. Only omissions and incorrect dispositions are listed. Nothing existing was edited; on your approval I will merge these as F-34…F-46 and D-18…D-22.

Evidence added in this check: legacy slug test [browser, local build] and credit-field scan [source].

## A. Findings missing from the register

| New ID | Omission | Source | Pri | Stage |
|---|---|---|---|---|
| F-34 | **No task owns route-by-route motion perceptibility, tablet (1024 px) visual review, or the Collections 3-3-1-vs-asymmetric visual check.** Only mechanical visibility was tested; ≈50 matrix rows remain NOT VERIFIED (CL-022, 263–265, 269–270, 273, 277–282, 286–288, 294, 303–306, 308, 312–315, 320–321, 324, 329–331, 336–338, 342–343, 348–350, 354, 360, 363, 367, 373, 378–380; directive C1.15) | v3 matrix; gap report §5 | P2 | Recordings per route in 4; full pass in 5 |
| F-35 | Brand-consistency review unassigned: square-corner geometry, narrative copy, palette in rendered output, **text-font (Playfair/Hanken) failure fallback** | CL-026, 445, 449, 450, 453, 455 | P3 | 5 |
| F-36 | Failure-mode states untested: image load failure, broken SVG/WebP fallback, Lens image failure and unmount, loading/error states | CL-070, 247, 248, 413, 516 | P3 | 2 (tests) |
| F-37 | No screen-reader, contrast (beyond brand colours), touch-target or focus-during-motion audit | CL-507, 511, 513, 518 | P2 | 2 baseline, 5 final (needs D-17) |
| F-38 | Human data/image review not assigned: subject correctness of 78 plates, diagram-to-tradition alignment, search-result thumbnails | CL-393, 410, 414 | P2 | 3 |
| F-39 | **Search matches whole phrase only**: "Indigo Chanderi Tunic" returns 0 results although each word matches. Dropped when D-07 became F-09 | v2 D-07, CL-395 | P3 | 2 |
| F-40 | **Legacy slugs**: all 9 legacy tradition slugs (e.g. `varanasi-kadwa`, `chanderi-handloom`, `assam-wild-silk-twill`) open as `?tradition=` aliases but `/archive/<legacy-slug>` shows "Exhibition Folio Not Found". Roadmap §2.3 #6 requires legacy identifiers be preserved; whether route form was ever required is unknown | Roadmap §2.3 #6; six-image audit; [B] | P3 | 2 after D-19 |
| F-41 | **Claim audit limited to the 13 traditions and ET-01 hero.** Home body copy (e.g. "Pit-Loomed Humidity"), The House, Journal, and PDP availability/edition wording are unaudited against the rule not to invent operations, sourcing, sustainability, limited-edition or production claims | Brief §6, §8; instructions.md §4; Claim Audit 6.3.2.2.3 | P2 | 3 (audit), approval by you |
| F-42 | **Image credits incomplete**: `imageCredit` exists for 7 products and 4 stories only; none for the 78 plates or Journal; exhibition modal does not display credits. Brief §6 requires credits stored with content | Brief §6; [S] | P2 | 3 (needs D-20) |
| F-43 | Phase 6.0 homepage critiques not itemised under F-02: redundant hero inspection triggers, abrupt ending after Highlights, Compass-to-image abruptness, rigid grid. Cannot be verified without D-01 | Directive C1.2 | P2 | 4 (blocked on D-01) |
| F-44 | Regression-test debt is more specific than F-31: tests required for wrong-Bag identity, Lens source, search destinations, checkout summary, loader, mixed cart (CL-535–541). Existing tests that **encode current wrong behaviour** must be listed and corrected: `archive-commerce-guidance`, `phase-7-3-commerce-lens`; alt-text expectations in `asset-binding` need checking | CL-535–541; [S] | P2 | 1 |
| F-45 | Process requirements not in any register: commit/push/deploy verification, Git hygiene, final evidence report (CL-029, 038, 582–589, 592–593, 688) | Checklist §14–15 | P3 | Master plan Git section; 5 |
| F-46 | Documentation conflict not recorded: Roadmap §2.3 #1 treats **editions as approved data**, while instructions.md §4 and Brief §6 forbid inventing limited-edition claims. "Edition of N" appears on PDP/Saved for all seven products | Roadmap vs instructions/Brief | P2 | decision D-18 |

## B. Incorrect or inconsistent dispositions

| Item | Problem | Correction | Source |
|---|---|---|---|
| CL-055 | Still **FAIL** in v3 while sibling cultural rows were moved to NEEDS APPROVAL | Set NEEDS APPROVAL (F-16) | v3 matrix |
| F-13 (hero claims) | Provisional outline puts it in Stage 1 unconditionally; it depends on D-08 | Mark Stage 1 **conditional on D-08** | decision register |
| F-05 interim guard | Same: depends on D-15 | Conditional on D-15 | decision register |
| F-14, F-15, F-17 ("Hold") | No stage owns them after you decide | Assign: F-14 and F-15 and F-17 to Stage 2 (small), F-16 to a separate project after Stage 5 | register §Stage |
| F-33 | In register (Stage 3) but absent from the provisional outline | Add to Stage 3 | outline |
| F-18 | Verification placed in Stage 5 only; gallery/Compass/accordion defects could affect Stage 4 motion work | Verify in Stage 2; fix in Stage 4 if found | register |
| D-08 | Scoped to the hero only | Widen to all displayed editions and material claims (see D-18) | decision register |
| F-22 | Lists contradictory catalogues but omits the editions conflict above | Add F-46 | — |

## C. Decisions to add to the decision register

| ID | Question | Recommended | Blocks |
|---|---|---|---|
| D-18 | Are the "Edition of N" values for ET-01…ET-07 approved public claims? | Confirm if yes, else supply corrections | F-13, F-41, F-46 |
| D-19 | Must legacy slugs also work as `/archive/<legacy-slug>` (redirect to the tradition)? | Yes, redirect | F-40 |
| D-20 | Do Archive plates and Journal images need visible credits, and what credit text is approved? | Supply approved credit text; display in exhibition footer | F-42 |
| D-21 | Who approves rewritten copy for Home, The House, Journal after the claim audit? | You approve a flagged list | F-41 |
| D-22 | Stage ownership of held items (F-14/15/17) once decided | As in table B | planning |

## D. Items the five-stage plans must explicitly include (not defects)
Per-stage Git workflow and clean-tree check; recordings as evidence for every motion task; a test-authoring task list from F-44; a hold-resolution gate after decisions; final acceptance cross-check against CL-675…688.

## E. Confirmed complete
All v2 D-01…D-16, all v3 V3-01…V3-14, all 20 mandatory items in directive Part C1, and all FAIL/SOURCE RISK matrix rows other than CL-055 are covered by an F-ID or decision.

Efficiency note: one scripted comparison of IDs, one browser run (9 legacy slugs), two source greps; no tests, builds or documents re-read.
