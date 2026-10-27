# EverThread — Unresolved Issues Register

**Generated:** 2026-10-27  
**Baseline Commit:** `c60f99b` (`stage-08-motion`)  
**Status of this Register:** Authoritative record of all non-closed tracker items, reconciled with `EverThread_Consolidated_Owner_Decisions.md` (Pass A: Documentation Reconciliation).

---

## 1. Summary of Unresolved Tracker Rows (448 Total Non-Closed)

Recalculated directly from the authoritative audit tracker (483 total data rows):
- **Total Non-Closed Rows:** **448 rows** (483 total data rows minus 35 `CLOSED` rows)
  - **`OPEN` Records:** **433 rows**
  - **`RESOLVED` Records (Pre-Closure Verification):** **4 rows** (`F-47`, `F-48`, `F-49`, `B-2`)
  - **`RESOLVED BY OWNER DECISION` Records:** **9 rows** (`O-4`, `O-6`, `B-3`, `B-4`, `B-5`, `O-9`, `O-11`, `O-12`, `F-41`)
  - **`DEFERRED BY DECISION` Records:** **1 row** (`DEC D-12`)
  - **`SUPERSEDED` Records:** **1 row** (`DEC D-15`)

### Cross-Tabulation of Unresolved Rows by Row Type and Status

| Row Type | OPEN | RESOLVED | RESOLVED BY OWNER DECISION | DEFERRED BY DECISION | SUPERSEDED | Total Non-Closed |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **`CHECKLIST_ROW`** | 344 | 0 | 0 | 0 | 0 | **344** |
| **`FINDING`** | 40 | 3 | 1 | 0 | 0 | **44** |
| **`DECISION_REGISTER`** | 21 | 0 | 0 | 1 | 1 | **23** |
| **`OWNER_DECISION`** | 9 | 0 | 5 | 0 | 0 | **14** |
| **`BLOCKER`** | 7 | 1 | 3 | 0 | 0 | **11** |
| **`V3_ROW`** | 6 | 0 | 0 | 0 | 0 | **6** |
| **`NEW_REQUIREMENT`** | 6 | 0 | 0 | 0 | 0 | **6** |
| **Total** | **433** | **4** | **9** | **1** | **1** | **448** |

---

## 2. Mandatory Unresolved Anchor Items & Consolidated Rulings

The following anchor items are updated to reflect verified outcomes from Stage 09 implementation and explicit owner decisions:

### 1. `B-4` — Concept Disclosure Exact Wording
- **Item Type:** `BLOCKER`
- **Current Status:** `IMPLEMENTED | PASS | RESOLVED BY OWNER DECISION`
- **Owner Ruling Status:** **VERIFIED IMPLEMENTATION COMPLETE (STAGE 09)**
- **Approved Canonical Copy:**
  > “Traditional products shown are AI-generated conceptual designs demonstrating archival craft techniques.”
- **Approved Placements (`DEC D-21`):**
  1. Traditional product detail: canonical disclosure beneath the image gallery (`data-testid="tr-concept-disclosure-gallery"`).
  2. Living Inheritance wall header: canonical disclosure (`data-testid="living-inheritance-concept-disclosure"`).
  3. Traditional Archive search subtitle: approved shorter disclosure (`CONCEPT_NOTICE_SHORT_TEXT`).
- **Implemented Code Paths:** `src/data/traditionalProducts.ts`, `src/pages/ProductDetailPage.tsx`, `src/pages/collections/LivingInheritanceWall.tsx`, `src/components/SearchModal.tsx`.
- **Test Evidence:** `src/tests/stage09-editorial-claims.test.tsx` (8/8 passed), Vitest suite (352 passed), Playwright E2E suite (78 passed).
- **Remaining Work:** None.

### 2. `B-5` — Claim-by-Claim Factual Dispositions
- **Item Type:** `BLOCKER`
- **Current Status:** `IMPLEMENTED | PASS | RESOLVED BY OWNER DECISION`
- **Owner Ruling Status:** **VERIFIED IMPLEMENTATION COMPLETE (STAGE 09)**
- **Approved Claim Dispositions:**
  - **CLM-H05–CLM-H09 (Global Ateliers):** Reframed as conceptual design studies (“Paris Design Study”, “New Delhi Guild Study”, “Kyoto Research Study”, “Milan Tailoring Study”). Removed operational and partnership claims.
  - **CLM-H01 (Generational Inlays):** Reframed as engineering specification (“Generational Inlay Specification”) without guaranteeing universal 1.5-inch inlays.
  - **CLM-J01–CLM-J05 (Journal Monographs):** Academic and curatorial essays preserved with `contentFlags.isEditorialPersona`, composite notes, and academic bibliography sources.
- **Implemented Code Paths:** `src/pages/HousePage.tsx`, `src/data/journal.ts`.
- **Test Evidence:** `src/tests/stage09-editorial-claims.test.tsx` (8/8 passed), Vitest suite (352 passed), Playwright E2E suite (78 passed).
- **Remaining Work:** None.

### 3. `F-04` — Exhibition 5-Step Opening Choreography
- **Item Type:** `FINDING`
- **Current Status:** `IMPLEMENTED | PASS | CLOSED`
- **Owner Ruling Status:** **VERIFIED & ACCEPTED BY OWNER (2026-10-27)**
- **Responsible Stage:** Stage 08 / Stage 10 / Stage 11
- **Stage Gating:** Fully satisfied and closed.
- **Implemented Work:** 5-step opening choreography implemented with `data-step` hooks (`cover`, `surface`, `main-image`, `views`, `thread`) coordinated by `useExhibitionOpening.ts`. Sequence settles within $\le 1.2\text{s}$ and is smoothly interruptible by pressing `Escape`.
- **Evidence Paths & Test References:** `src/components/TraditionExhibitionModal.tsx`, `src/hooks/useExhibitionOpening.ts`, `e2e/motion.spec.ts` (`E2E-MOTION-05` — 3/3 passed across desktop, tablet, and mobile), `docs/implementation/evidence/STAGE-08/RESULT.md`.
- **Remaining Work:** None. Explicit owner visual acceptance granted on 2026-10-27.

### 4. `CL-446` — Signature Motion: Initiate → Glide → Settle
- **Item Type:** `CHECKLIST_ROW`
- **Current Status:** `IMPLEMENTED | PASS | CLOSED`
- **Owner Ruling Status:** **VERIFIED IMPLEMENTATION COMPLETE (STAGE 10)**
- **Responsible Stage:** Stage 10 (Holistic Signature Moment Pass)
- **Stage Gating:** Completed and verified in Stage 10.
- **Implemented Work:** Signature motion calibrated across fold and settle transitions. Moving thread lead and glide physics refined in `WallThread.tsx` with smooth cubic-bezier transition, beacon head settle, and reduced-motion instant snap. Verified in `e2e/stage10-acceptance.spec.ts` (`E2E-WALL-THREAD`) across desktop, tablet, and mobile viewports.
- **Remaining Work:** None.

---

## 3. Consolidated Structural & Policy Decisions

### A. `DEC D-20` — Six-Section House Structure Preserved
- **Owner Ruling:** **APPROVED — PRESERVE 6-SECTION STRUCTURE EXACTLY**.
- **Requirement:** The current six-section House structure (`Hero`, `Foundational Creed`, `Material Integrity`, `Global Ateliers [Scene U1]`, `Bespoke Concierge [Scene U2]`, `Transparency Notice`) must be preserved exactly. No condensing to four chapters, merging, or section removals. Scene fold boundaries U1 and U2 remain intact.

### B. `O-6-C` — Existing-Image-Only Policy
- **Owner Ruling:** **APPROVED — EXISTING IMAGES ONLY**.
- **Requirement:** No new image generation, editing, or requests for replacement imagery. For TR-01, TR-03, and TR-07, the best-fitting existing assets already present in the project are retained. Assessment is not blocked for want of perfect imagery; obvious mismatches are documented honestly without altering product specifications.

### C. `O-7` — Archive-to-Traditional Product Mappings & Commercial Status
- **Owner Ruling:** **APPROVED — PRESERVE PROJECT MAPPINGS; TR PURCHASABILITY CONFIRMED**.
- **Requirement:** Preserve the existing mappings in `src/data/archiveRelations.ts` exactly. TR products are confirmed commercially purchasable. Older audit statements claiming TR products are unlisted or non-purchasable are **SUPERSEDED**. Archive entries remain strictly educational with no direct "Acquire" buttons.

### D. `DEC D-18 / F-46` — Assessment-Specific Edition Claims Policy
- **Owner Ruling:** **ASSESSMENT-SPECIFIC OWNER RISK ACCEPTANCE**.
- **Requirement:** Existing Contemporary (ET) edition claims are accepted as-is for the current assessment submission without representing them as factually verified. Traditional (TR) products carry zero edition numbers. No new edition counts or scarcity claims may be invented.

---

## 4. Completed Stage 10 Motion Quality Task

### Collection-Switching Moving Thread / String Animation Check
- **Status:** **`VERIFIED IMPLEMENTATION COMPLETE (STAGE 10)`**
- **Implemented Work:** Calibrated moving thread in `WallThread.tsx` with `strokeWidth: 2.75`, lead bezier tip dynamic lead, `0.16s cubic-bezier(0.22, 1, 0.36, 1)` smooth glide, luminous head circle bead, and full reduced-motion instant snap. Verified in `e2e/stage10-acceptance.spec.ts` (`E2E-WALL-THREAD`) across desktop, tablet, and mobile viewports.
- **Remaining Work:** None.

---

## 5. Core Architectural Scope Items (`V3_ROW` — 6 items)

| ID | Title / Scope | Responsible Stage | Status | Blocker For | Remaining Work / Closure Criteria |
| :--- | :--- | :---: | :---: | :---: | :--- |
| **`V3-08`** | Cultural Collection discovery & dedicated shopping | Stage 10 | CLOSED | Stage 10 | Validated end-to-end dedicated shopping surface and routing clarity in Stage 10. |
| **`V3-10`** | Clear provenance and cultural context disclosures / icon fallback | Stage 09/10 | CLOSED | Stage 09/10 | Implemented and verified in Stage 09 per B-4 & D-21; icon font fallback verified in Stage 10 (E2E-A11Y-ICONS). |
| **`V3-11`** | Cohesive editorial voice across all brand touchpoints | Stage 09 | CLOSED | Stage 09 | Implemented and verified in Stage 09 per B-5 claim reframing. |
| **`V3-12`** | Search, filter, and archive discovery ergonomics | Stage 10 | CLOSED | Stage 10 | Verified cross-filter performance, deep-linking, and technique strip integration in Stage 10. |
| **`V3-13`** | Production build healthy & bundle verification | Stage 10/11 | CLOSED | Stage 10/11 | Production build passes cleanly (`vite build` exit 0 in 4.23s); chunk sizes recorded. |
| **`V3-14`** | Live deployment verified (GitHub Pages) | Stage 11 | RESOLVED BY OWNER DECISION (ACCEPTED LIMITATION) | None | Closed as accepted limitation by Owner Decision 2026-10-27; local production build (`vite build` exit 0) and static server pass; live 8-route MAN-LIVE verification deferred for assessment submission. |

---

## 6. Open Checklist Rows & Handover State

With Stage 11 complete and Owner Acceptance granted:
* **Stage 09 (Editorial & Narrative):** 42 rows verified and closed.
* **Stage 10 (Interactive Polish & Synthesis):** 118 rows verified and closed (moving thread calibration, CL-446 signature moment, F-10 zero overflow sweep, F-19 Compass browser tests, F-21 icon fallbacks, F-29 Deep Oxblood focus rings, F-30 newsletter label, F-14 loader invariance).
* **Stage 11 (Audit Closure, Supersession & Handover):** 134 rows reconciled and closed in `docs/CLOSURE_MATRIX.md`; supersession index `docs/SUPERSEDED.md` created; `docs/HANDOVER.md` delivered.
* **Outstanding Owner-Gated Actions:**
  1. `F-04` (Exhibition 5-step opening): **CLOSED** — Owner explicit acceptance granted on 2026-10-27; automated tests (`E2E-MOTION-05`) pass.
  2. `F-24` / `B-7` / `V3-14` (Live GitHub Pages deployment): **RESOLVED BY OWNER DECISION** — Closed as accepted limitation / deferred live verification by Owner Decision 2026-10-27. Local production build and static server pass cleanly; live domain 8-route audit deferred for assessment handover.
  3. `DEC D-18` / `F-46` (Edition Claims Risk Acceptance): **RESOLVED BY OWNER DECISION** — Explicit assessment-specific risk acceptance recorded. Contemporary edition claims retained as-is without representing them as factually verified. TR products carry zero edition numbers.
  4. `O-6-C` (Existing Image Only Policy): **RESOLVED BY OWNER DECISION** — Best-fitting existing images retained for TR-01, TR-03, TR-07. No new image generation. Obvious mismatches documented honestly.
  5. `F-17` (Newest Sort): **RESOLVED BY OWNER DECISION** — Deferral confirmed; negative check verified in UT-COLL-01.
  6. `F-42` (Visible Credit Text): **RESOLVED BY OWNER DECISION** — Deferral confirmed; data model fields implemented and verified in UT-DATA-02.
  7. `ThreadLoader` Timing Invariance: **CLOSED & PRESERVED** — 1900ms active / 400ms fade verified in E2E-LOAD-01.
* **Zero Outstanding Owner Decisions Remaining:** All governance items are formally settled and reconciled.
