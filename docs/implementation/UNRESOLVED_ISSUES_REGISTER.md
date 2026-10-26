# EverThread — Unresolved Issues Register

**Generated:** 2026-10-27  
**Baseline Commit:** `8a61e4d` (`stage-08-motion`)  
**Scope:** Authoritative register of all non-closed tracker items, categorized by row type, with closure criteria, evidence requirements, and stage gating.

---

## 1. Summary of Unresolved Tracker Rows (448 Total Non-Closed)

Recalculated directly from the current authoritative audit tracker (483 total data rows):
- **Total Non-Closed Rows:** **448 rows** (483 total data rows minus 35 `CLOSED` rows)
  - **`OPEN` Records:** **439 rows**
  - **`RESOLVED` Records (Pre-Closure Verification):** **4 rows** (`F-47`, `F-48`, `F-49`, `B-2`)
  - **`RESOLVED BY OWNER DECISION` Records:** **3 rows** (`O-4`, `O-6`, `B-3`)
  - **`DEFERRED BY DECISION` Records:** **1 row** (`DEC D-12`)
  - **`SUPERSEDED` Records:** **1 row** (`DEC D-15`)

### Cross-Tabulation of Unresolved Rows by Row Type and Status

| Row Type | OPEN | RESOLVED | RESOLVED BY OWNER DECISION | DEFERRED BY DECISION | SUPERSEDED | Total Non-Closed |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **`CHECKLIST_ROW`** | 344 | 0 | 0 | 0 | 0 | **344** |
| **`FINDING`** | 41 | 3 | 0 | 0 | 0 | **44** |
| **`DECISION_REGISTER`** | 21 | 0 | 0 | 1 | 1 | **23** |
| **`OWNER_DECISION`** | 12 | 0 | 2 | 0 | 0 | **14** |
| **`BLOCKER`** | 9 | 1 | 1 | 0 | 0 | **11** |
| **`V3_ROW`** | 6 | 0 | 0 | 0 | 0 | **6** |
| **`NEW_REQUIREMENT`** | 6 | 0 | 0 | 0 | 0 | **6** |
| **Total** | **439** | **4** | **3** | **1** | **1** | **448** |

*Note: The 35 `CLOSED` rows in the tracker (11 `CHECKLIST_ROW`, 8 `V3_ROW`, 10 `FINDING`, 4 `NEW_REQUIREMENT`, 2 `DECISION_REGISTER`) are accounted for in `RESOLVED_ISSUES_REGISTER.md` and complete the mathematical total of $448 + 35 = 483$ data rows.*

---

## 2. Mandatory Unresolved Anchor Items

The following four anchor items are strictly retained as **OPEN** per owner instructions:

### 1. `F-04` — Exhibition 5-Step Opening Choreography
- **Item Type:** `FINDING`
- **Current Status:** `IMPLEMENTED | PASS | OPEN`
- **Responsible Stage:** Stage 08 / Stage 10
- **Stage Gating:** Does **NOT** block Stage 09.
- **Remaining Work & Closure Criteria:** While technical code execution and E2E automated timing tests (`E2E-MOTION-05`) pass, final closure requires explicit owner review and acceptance of the choreography rhythm, modal entry feel, and visual dignity.
- **Evidence Required:** Formal owner sign-off recording acceptance of the 5-step exhibition opening sequence.

### 2. `CL-446` — Signature Motion: Initiate → Glide → Settle
- **Item Type:** `CHECKLIST_ROW`
- **Current Status:** `PARTIALLY IMPLEMENTED | NOT VERIFIED | OPEN`
- **Responsible Stage:** Stage 10 (Holistic Signature Moment Pass)
- **Stage Gating:** Blocks Stage 10 final sign-off.
- **Remaining Work & Closure Criteria:** Cross-viewport end-to-end qualitative review of the fold and settle experience across high-DPI desktop, standard laptop, tablet, and mobile devices.
- **Evidence Required:** Stage 10 interactive screen capture and multi-device audit report.

### 3. `B-4` — Concept Disclosure Exact Wording
- **Item Type:** `BLOCKER`
- **Current Status:** `BLOCKED | BLOCKED — EVIDENCE OR APPROVAL REQUIRED | OPEN`
- **Responsible Stage:** Stage 09 (Editorial Voice & Claims)
- **Stage Gating:** **ACTIVE BLOCKER FOR STAGE 09**.
- **Remaining Work & Closure Criteria:** Code currently exports provisional constant `CONCEPT_NOTICE_TEXT`. Owner must supply or explicitly confirm the exact approved disclosure copy.
- **Evidence Required:** Written owner approval of the canonical concept disclosure string.

### 4. `B-5` — Claim-by-Claim Factual Disposition
- **Item Type:** `BLOCKER`
- **Current Status:** `BLOCKED | BLOCKED — EVIDENCE OR APPROVAL REQUIRED | OPEN`
- **Responsible Stage:** Stage 09 (Editorial Voice & Claims)
- **Stage Gating:** **ACTIVE BLOCKER FOR STAGE 09**.
- **Remaining Work & Closure Criteria:** Unsubstantiated claims in The House (e.g. 60-year operational history) and Journal must be formally decided (approve as-is, edit with specific replacement text, or delete). Only supported claims may ship.
- **Evidence Required:** Owner sign-off on the claim inventory remediation table in `CLAIMS_INVENTORY.md`.

---

## 3. Core Open Architectural Scope Items (`V3_ROW` — 6 items)

| ID | Title / Scope | Responsible Stage | Status | Blocker For | Remaining Work / Closure Criteria |
| :--- | :--- | :---: | :---: | :---: | :--- |
| **`V3-08`** | Cultural Collection discovery & dedicated shopping | Stage 10 | OPEN | Stage 10 | Validate end-to-end dedicated shopping surface and routing clarity. |
| **`V3-10`** | Clear provenance and cultural context disclosures | Stage 09 | OPEN | Stage 09 | Integrate approved B-4 disclosure copy on TR detail and collection walls. |
| **`V3-11`** | Cohesive editorial voice across all brand touchpoints | Stage 09 | OPEN | Stage 09 | Reconcile brand voice, House chapters, and Journal essays. |
| **`V3-12`** | Search, filter, and archive discovery ergonomics | Stage 10 | OPEN | Stage 10 | Verify cross-filter performance, deep-linking, and technique strip integration. |
| **`V3-13`** | Performance budget (Lighthouse, Core Web Vitals) | Stage 11 | OPEN | Stage 11 | Audit bundle size, GSAP animation thread efficiency, and image loading. |
| **`V3-14`** | WCAG 2.1 AA Accessibility compliance | Stage 11 | OPEN | Stage 11 | Comprehensive screen-reader, keyboard trap, and ARIA attribute verification. |

---

## 4. Key Open Findings (`FINDING` — 41 OPEN Rows + 3 RESOLVED)

* **`F-03`** (Story Flow navigation / history state): Stage 10 review of edge-case history transitions.
* **`F-05`** (Exhibition modal image aspect ratio): Stage 10 image framing verification.
* **`F-06`** (Technique strip mobile horizontal scroll): Stage 10 mobile touch ergonomics pass.
* **`F-07`** (Living Inheritance wall layout): Stage 10 visual density review.
* **`F-10`** (Bag item line calculation): Stage 10 commerce edge cases.
* **`F-12`** (PDP zoom modal focus trap): Stage 11 accessibility audit.
* **`F-38`** (Human image and plate review): Stage 10 asset review.
* **`F-41`** (Claims audit beyond Archive): Stage 09 editorial pass.
* **`F-42`** (Visible credit and provenance text): Stage 09 editorial display.
* **`F-46`** (Editions conflict): Stage 09; held under `DEC D-18`.
* **`F-47`, `F-48`, `F-49`** (Status `RESOLVED`): Image and plate asset verifications completed, awaiting final stage wrap-up sign-off.

---

## 5. Open Owner Decisions & Governance Blockers

| ID | Topic | Current Tracker State | Stage Gating | Required Owner Action |
| :--- | :--- | :--- | :---: | :--- |
| **`B-4`** | Concept Disclosure Copy | `BLOCKED \| BLOCKED \| OPEN` | **Blocks Stage 09** | Confirm exact wording for TR disclosures. |
| **`B-5`** | Claims Remediation | `BLOCKED \| BLOCKED \| OPEN` | **Blocks Stage 09** | Confirm factual disposition of House/Journal claims. |
| **`O-1`** | Phase 6.0 Source Documents | `BLOCKED \| BLOCKED \| OPEN` | Stage 10 | Confirm closure based on synthesized motion spec. |
| **`O-2`** | Wall URLs (`/collections/...`) | `BLOCKED \| BLOCKED \| OPEN` | Stage 10 | Formal confirmation of `/collections/the-living-inheritance`. |
| **`O-3`** | Wall Switch Interaction | `BLOCKED \| BLOCKED \| OPEN` | Stage 10 | Formal confirmation of horizontal snap track with zero hijacking. |
| **`O-5`** | Technical Diagrams Inventory | `IMPLEMENTED \| PASS \| OPEN` | Stage 10 | Formal sign-off on 9-diagram technique strip presentation. |
| **`O-7`** | Archive-to-Traditional Relations | `IMPLEMENTED \| PASS \| OPEN` | Stage 10 | Formal sign-off on relation link mapping. |
| **`O-8`** | Navigation Menu Structure | `BLOCKED \| BLOCKED \| OPEN` | Stage 10 | Confirm final mobile navigation drawer layout. |
| **`O-9`** | AI Concept Policy Sign-off | `PARTIALLY IMPLEMENTED \| OPEN` | **Blocks Stage 09** | Formal policy sign-off linked to B-4. |
| **`O-10`** | Contemporary Garment Scarcity | `BLOCKED \| BLOCKED \| OPEN` | Stage 10 | Confirm ET edition numbering policy. |
| **`O-11`** | TR Concept Status Policy | `IMPLEMENTED \| PASS \| OPEN` | Stage 09 | Formal sign-off on omission of fabricated scarcity data. |
| **`O-12`** | Making / Promise Treatment | `PARTIALLY IMPLEMENTED \| OPEN` | Stage 09 | Formal sign-off on homage-only copy framing. |
| **`O-13`** | Performance Budget Thresholds | `BLOCKED \| BLOCKED \| OPEN` | Stage 11 | Establish target Core Web Vitals thresholds. |
| **`O-14`** | Cross-Browser Matrix Scope | `BLOCKED \| BLOCKED \| OPEN` | Stage 11 | Confirm target browser and device support tier. |
| **`B-2`** | Asset Approvals | `IMPLEMENTED \| PASS \| RESOLVED` | Resolved | Clean contemporary plates verified. |
| **`B-3`** | TR Spec & Gallery Handling | `RESOLVED BY OWNER DECISION` | Resolved | Confirmed 4:5 presentation. |
| **`O-4`** | Motion Parameters | `RESOLVED BY OWNER DECISION` | Resolved | Section 9 tokens established. |
| **`O-6`** | TR Product Imagery Mismatch | `RESOLVED BY OWNER DECISION` | Resolved | Commercial readiness approved. |

---

## 6. Open Checklist Rows (`CHECKLIST_ROW` — 344 Items)

All 344 open checklist rows remain active across their respective assigned stages:
* **Stage 09 (Editorial & Narrative):** 42 rows covering tone of voice, claim remediation, credit display, and cultural disclosure positioning.
* **Stage 10 (Interactive Polish & Synthesis):** 118 rows covering cross-viewport motion refinement, signature moment review (`CL-446`), bag interactions, search filtering, and navigation drawer ergonomics.
* **Stage 11 (Accessibility & Performance):** 134 rows covering WCAG 2.1 AA compliance, screen reader assertions, keyboard traps, bundle optimizations, and Core Web Vitals.
* **Stage 12 (Final Verification & Deployment Gate):** 50 rows covering production build validation, clean Git history, evidence compilation, and sign-off reporting.
