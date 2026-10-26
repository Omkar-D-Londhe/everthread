# EverThread Documentation Directory

## 1. Authority Hierarchy (Order of Precedence)
When documents disagree or requirements conflict, the authoritative order of precedence is strictly defined as:

1. **Owner Decisions:** Recorded in `authoritative/requirements/01_REQUIREMENTS_AND_DECISION_TRACEABILITY.md` §B–§D (O-1 through O-14) and confirmed decision register entries.
2. **Approved Project Briefs & Invariants:**
   - `authoritative/specifications/EverThread_Implementation_Brief.md`
   - `authoritative/project/00_MASTER_IMPLEMENTATION_ROADMAP.md` §2.3 (Non-negotiable invariants)
   - `authoritative/specifications/EverThread_Phase_6_3_2_2_Immersive_Textile_Exhibition_Spec.md`
3. **Acceptance Checklist & Traceability:**
   - `authoritative/requirements/01_REQUIREMENTS_AND_DECISION_TRACEABILITY.md`
   - `authoritative/requirements/01a_CHECKLIST_ROW_TO_STAGE_MAP.csv`
   - `implementation/tracker/01b_AUDIT_TRACKER.csv` (Canonical tracker: 433 items)
4. **Authoritative Revision 2 Package:**
   - Asset Manifest & Registry (`02_ASSET_MANIFEST_AND_MAPPING.md`, `02a_ASSET_REGISTRY.csv`)
   - Motion Specification (`03_MOTION_AND_TRAVERSAL_SPECIFICATION.md`)
   - Test Plan (`04_TEST_AND_ACCEPTANCE_PLAN.md`)
   - Stage Specifications (`authoritative/specifications/stages/STAGE-01` through `STAGE-11`)
   - Final Reconciliation Report (`00_MASTER_IMPLEMENTATION_ROADMAP.md`, `FINAL_RECONCILIATION_REPORT.md`)
5. **Historical Reports & Phase Logs (Evidence Only):**
   - Retained in `historical/superseded/` and `historical/drafts/` for context and audit history. They do not override authoritative specifications.

---

## 2. Directory Structure

```
docs/
├── README.md                                 # This navigation guide
├── MASTER_RESOURCE_INDEX.md                 # Complete project and resource index
├── PHASE-0-DISCOVERY-REPORT-2026-10-26.md    # Master Phase 0 discovery audit
├── authoritative/                            # Tier 1 & Tier 2 authoritative files
│   ├── project/                              # Roadmap (00), Index, Reconciliation
│   ├── requirements/                         # Traceability (01), Stage Map (01a)
│   ├── decisions/                            # Owner decisions index (O-1 to O-14)
│   ├── specifications/                       # Briefs, motion (03), test plan (04)
│   │   └── stages/                           # STAGE-01 through STAGE-11 specs
│   └── assets/                               # Asset manifest (02), registry (02a)
├── implementation/                           # Active operational files & evidence
│   ├── current/                              # Current stage status & handover
│   ├── tracker/                              # Canonical audit tracker (01b)
│   ├── evidence/                             # STAGE-01..05 execution evidence & HTML reports
│   └── baseline/                             # Baseline audits (claims, tooling, debt)
├── historical/                               # Preserved archival documentation
│   ├── superseded/                           # 17 superseded Phase 6.x/7.x reports
│   ├── drafts/                               # 11 draft audit reports & proposals
│   └── reference/                            # Legacy matrices and screenshots
└── tools/                                    # Reconciled Python audit scripts
```

---

## 3. Active Operational Bridge
To ensure that automated test runners, CI scripts, and existing commands continue running without breaking:
- `docs/implementation/` retains all original file paths (`00_...`, `01_...`, `01b_AUDIT_TRACKER.csv`, `02_...`, `02a_ASSET_REGISTRY.csv`, `tools/`).
- Python scripts in `docs/implementation/tools/` and `docs/tools/` remain fully functional.
