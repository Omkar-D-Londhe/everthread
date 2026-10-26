# EverThread — Audit Reassessment v3

**Source:** uploaded ZIP, git HEAD `ebf7b6b`, working tree clean (same commit as v2). Because the source is unchanged, I reused v2's runtime evidence and ran only new checks: signature-motion measurement at 3 widths, Home hero frame, live-site reachability, Actions status, document history searches. Existing artifacts were not overwritten.
Evidence labels: **[source] [browser] [measured] [screenshot] [prior]** (= v2 evidence reused). Browser = headless Chromium on a local production build, **not** the live site.

## 1. Executive summary

- **The v2 audit missed a documented, approved signature requirement.** Brief §7 defines Story Flow: Initiate → Glide → *architectural panels fold/roll to reveal a scene* → Settle, strongest on Home, Archive, The House. It is **not implemented** (verdict **MISSING**). v2 never evaluated it.
- **Two v2 defects were wrongly framed.** The loader's ~2.3 s is *protected approved timing* (Roadmap §2.3 #5), so it is a spec conflict, not a defect. "Cultural Collection missing" is an **unresolved product decision**, not a confirmed omission: the term appears only in your attached checklist.
- **Colour swatches** are protected approved data (Roadmap §2.3 #1 lists colourways); I should not have implied a defect.
- **Newly found:** Home hero claims ("Numbered 01–64", "100% Unblended", "Mulberry Silk & Cashmere") are inconsistent with ET-01's data ("Edition of 30") and with the content-claim rules; a fourth contradictory catalogue sits in the Phase 7.2 report; the Phase 6.0 documents are not in the project.
- **Still reproducible (source unchanged):** Archive mapping mismatch, Lens source, search dead link, legacy alt text, mobile clipping, filename-like captions.
- **Build healthy** (reused: 251/251 tests, tsc 0, build OK; chunk-size warning). **Live deployment not verified** (host unresolvable from my sandbox; Actions run 10 succeeded on `ebf7b6b`).

## 2. Documents and sources inspected

| Source | Status |
|---|---|
| v2 report, matrix md/csv, runtime scripts | Fully reviewed (my own artifacts) |
| `EverThread_Complete_Functionality_Acceptance_Checklist.md` | Fully reviewed (v2); §4, §7, §16–17 re-read |
| `EverThread_Implementation_Brief.md` | Relevant sections read: §4 routes, §6–7 content and signature experience, rules |
| `EverThread_Phase_6_3_2_2_..._Spec.md` | §1 motion arc, "Opening", §13 protected data read |
| `EverThread_Remaining_Project_Roadmap.md` | §2.2–2.3 (principles, hard invariants) read |
| `instructions.md` | Fully reviewed (v2); §4, §9 re-checked |
| `phase_6_3_2_2_3_claim_audit_report.md` | First 60 lines (claim corrections) |
| `phase_6_3_2_2_1_visual_polish_report.md` | Items 1–4 |
| `phase_7_2_functionality_motion_lens_report.md` | §5 commerce history |
| `phase_7_3_*` (two reports), `phase_6_6_preflight_audit.md` | Relevant sections |
| Remaining 11 phase reports, README, PROJECT_STRUCTURE, FILE_USAGE_AUDIT | Covered by v2 title/grep level only; searched by keyword for motion, collection, claims — nothing material found |
| **`phase_6_0_experience_redesign_audit.md`, `phase_6_0_cinematic_motion_storyboard.md`** | **Unavailable**: absent from ZIP, git history and uploads |
| Source, tests, package, workflow, build config | Inspected as needed |

## 3. Previous findings: status now

| v2 ID | v2 finding | Status | Notes |
|---|---|---|---|
| D-01 | Archive Acquire adds unrelated garment | **Remains** | Muga sari → Ivory Raw Tussar Cocoon Trench [prior]. History: Phase 7.2 invented a 6-tradition mapping with a different catalogue; 7.3 rewrote it; no approval record. Correct behaviour is not decidable by me: see §6 and decisions. |
| D-02 | No Cultural Collection | **Reclassified → unresolved product decision** | §5 |
| D-03 | Lens ignores gallery selection | **Remains** (source unchanged) | `imageSrc={product.macroImage||currentImage.src}` |
| D-04 | Lens mapping/focus/resolution | **Remains** | Measured previously; not re-run |
| D-05 | Loader forced 2.3 s | **Reclassified → spec conflict** | Roadmap protects timing; checklist and instructions disagree. NEEDS APPROVAL |
| D-06 | Legacy Chanderi alt text | **Remains** | Legacy slug redirects are legitimate; alt text on current product is misleading |
| D-07 | Radial-bias search dead link | **Remains, root cause found** | `SearchModal.tsx:101` uses `traditionKey||slug`; weave-14 has no traditionKey. Approved target `/archive/the-art-of-the-drape` |
| D-08 | Mobile clipping | **Remains; contradicts a past claim** | `body{overflow-x:hidden}` main.css:29 since baseline; phase_6_3_2_2_1 report says overflow was fixed without it |
| D-09 | Filename-like captions | **Remains** | Shown text is `activeItem.alt` (filename-derived); no approved caption copy exists |
| D-10 | Index-based Bag API etc. | **Remains (risk)** | |
| D-11 | Swatch changes name not image | **Reclassified → approval** | Colourways are protected approved data; per-colour images do not exist |
| D-12–D-16 | Minor items | **Remain** | |
| Bag/Saved/checkout | Working | **Reused, still valid** | Checkout simulated only |
| Catalogue ET-01…07 | Names/prices match | **Confirmed** [source] | |

## 4. New findings (each traceable)

1. **Story Flow missing** (Brief §7): §7 below and motion record.
2. **Home hero claim inconsistency:** "Numbered 01–64", "100% Unblended", "Pit-Loomed Jacquard", "Mulberry Silk & Cashmere" beside ET-01 whose data says "Edition of 30" [source + screenshot]. The Claim Audit (6.3.2.2.3) corrected only the 13 Archive traditions. Editions are protected approved data, so the *hero* must be reconciled or approved.
3. **Icon font dependency:** report 6.3.2.2.1 says literal icon names were replaced with inline SVG, but 12 files still use Google Material Symbols; with the font blocked, the hero showed literal "ARROW_FORWARD" and "loupe" [screenshot]. Live behaviour with the font reachable is unverified.
4. **Fourth contradictory catalogue** in the Phase 7.2 report (six traditions incl. "jamdani", ET-02 ₹52,000, ET-04 "Changthangi Reversible Pashmina Shawl"). Superseded; should be labelled.
5. **Exhibition opening** specified as a five-step choreography; only a fade keyframe found [source]: SOURCE RISK.
6. **Phase 6.0 documents unavailable.**
7. Build emits a >500 kB chunk warning (informational).

## 5. Cultural Collection vs Traditional Collection

Evidence:
- "Cultural Collection" appears **only** in the attached checklist (§1, §2.2, §4, §7, §16). It is absent from the Brief, Roadmap, Exhibition Spec, instructions.md and every phase report.
- "Traditional Collection" appears **nowhere**. "Traditional Outfit" appears in Phase 7.3 and code comments, meaning *Archive plates that carry a mapped Acquire action* (e.g. `AtelierLensModal.tsx` "Sellable Repertoire Piece").
- The approved architecture keeps the Archive educational (Roadmap §2.3 #6–7, Spec §13; checklist §9). Phase 7.2/7.3 added an Archive→Repertoire bridge on its own initiative; no document records you approving it.
- Checklist §4 itself says to list required user decisions rather than inventing products when approved cultural products/prices do not exist.

Conclusion: the two names are **not established to be the same or different concepts**. The Cultural Collection is a requirement in your latest checklist, but no approved sellable cultural data exists. Recommended path: **Option 3 first** (decide naming and whether such products exist), **Option 1 meanwhile** (keep the Archive as is, without presenting unrelated catalogue items as the natural purchase). Option 2 only after you supply data. I did not invent IDs, prices or provenance.

## 6. Archive-to-product relationship (recommendation, not implementation)
The Muga page offers an unrelated regular product as the natural purchase. A mapping is supportable only if you approve an explicit association. Until then the safest options are an Archive-only experience or a clearly labelled "related heirloom" link without "Acquire", never an automatic Bag add. Each of the four mappings needs your decision.

## 7. Signature motion
Verdict **MISSING** for the Initiate → Glide → Settle panel fold/roll scene transition; ordinary reveals **PARTIAL**. Full evidence and per-component table: `everthread_motion_verification_v3.md`.

## 8. Build and deployment
- Source unchanged: `ebf7b6b`, `git status` clean. Reused: `npm ci` ok; Vitest 15 files/251 tests passed; `tsc --noEmit` exit 0; `vite build` succeeded with a large-chunk warning; 0 un-prefixed `/images/` in JS; 544/544 referenced images exist.
- CI can detect: type errors, failing tests, build failure. It cannot detect: wrong live base path, Pages 404 fallback, fonts, visual/behavioural defects (every item in §3).
- Live site: `omkar-d-londhe.github.io` unresolvable again (HTTP 000). GitHub Actions page: runs 7–10 "completed successfully", run 10 on `ebf7b6b`. **Deployment NOT verified.**

## 9. Remaining uncertainties
Phase 6.0 documents; human judgement of motion; Lens touch-drag on a device; live fonts and fallback; tablet visual review; 11 phase reports read only by keyword.

## 10. Prioritised corrective work (none started)
No P0 (build and core navigation work).

| P | ID | Action | Approval? | Test |
|---|---|---|---|---|
| P1 | V3-01 | Implement Story Flow on Home/Archive/House with existing GSAP only | Storyboard/design needed | Recording at 1440/390, reduced-motion, keyboard, history |
| P1 | D-01 | Remove or approve each Archive→product mapping; no auto-add | Yes | Archive tests for approved set only |
| P1 | D-03 | Lens uses active gallery image | Already required (checklist §6) | Select image N → Lens src = N |
| P1 | D-02 | Resolve Cultural/Traditional scope and data | Yes | — |
| P2 | D-07 | Route weave-14 search result to `/archive/the-art-of-the-drape` (preserve approved link) | No | Click every search result |
| P2 | D-04 | Loupe sizing, focus trap/restore, per-image alt | No | Keyboard + landmark tests |
| P2 | D-08 | Fix overflowing elements (PDP gallery, story button, journal link, header icon) without hiding content | No | 390 px overflow = 0 elements |
| P2 | V3-09 | Reconcile hero claims with product data | Yes | Hero vs ET-01 data |
| P2 | D-09 | Approved captions or remove filename-style text | Copy approval | — |
| P2 | D-05, D-11 | Loader timing and colourway decisions | Yes | — |
| P2 | D-06 | Rename alt text, keep legacy slugs | No | No alt contains legacy name |
| P3 | V3-10, D-10, D-12–D-16, docs | Icon fallback, Bag ID API, URL param on close, contrast, mark stale docs | Mostly no | — |

## 11. Final decision table

| Question | Answer | Evidence | Next action |
|---|---|---|---|
| v2 explicitly identified Initiate → Glide → Settle as missing? | **No** | v2 report/matrix never cite Brief §7; motion rows NOT VERIFIED | Corrected here |
| Approved spec requires it? | **Yes** (fold/roll, Home/Archive/House); "exact-frame" wording **not established** | Brief §7; Spec §1; Roadmap §2.2 | Supply Phase 6.0 storyboard |
| Complete effect in current source? | **No** (ordinary reveals only) | useEditorialScroll.ts L64–192; unused `.fabric-panel` CSS | Approve design, implement |
| Glides to correct frame and settles? | **No fold/roll present; visual feel not verified** | 0 3D/clip/perspective on 9 runs [browser] | Recording after implementation |
| Routes required / absent | Home, Archive, The House: all absent | as above | — |
| Previous audit overlooked other requirements? | **Yes** | §4 | — |
| Cultural Collection confirmed or unresolved? | **Unresolved product decision** | Only in attached checklist | Decide naming/scope/data |
| Previously reported defects still reproducible? | **Yes** except reclassified D-02, D-05, D-11 | §3 | — |
| Production build passes? | **Yes** (same commit, reused) | 251/251, tsc 0, build ok | — |
| Live deployment verified? | **No** | DNS failure; Actions run 10 success only | Open live site / send evidence |
| Minimum approved corrective work | D-03; D-07; D-04; D-08; D-06 | no approval needed | — |
| Decisions needed | See summary | | |
