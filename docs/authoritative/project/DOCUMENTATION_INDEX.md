# Documentation Index — read this first

## 1. Reading order for Antigravity
1. `00_MASTER_IMPLEMENTATION_ROADMAP.md` (entry point, protocol, blockers)
2. The current `STAGE-NN-*.md` (only after the owner approves that stage)
3. `02_ASSET_MANIFEST_AND_MAPPING.md` and `02a_ASSET_REGISTRY.csv` (assets; the manifest inside the ZIP is stale, ignore it)
4. `03_MOTION_AND_TRAVERSAL_SPECIFICATION.md` (Stages 5, 8)
5. `04_TEST_AND_ACCEPTANCE_PLAN.md` (all stages)
6. `01_REQUIREMENTS_AND_DECISION_TRACEABILITY.md` and `01a_CHECKLIST_ROW_TO_STAGE_MAP.csv` (look-up only)
7. `FINAL_RECONCILIATION_REPORT.md` (status and gaps; owner-facing)

## 2. Authority order when documents conflict
1. Explicit owner decisions recorded in `01_…` §B–§D (a letter whose option text cannot be verified is **not** authoritative until clarified) and settled decisions §C.
2. The approved Implementation Brief, Roadmap invariants (§2.3) and Exhibition Specification (in the repository `docs/`).
3. The acceptance checklist (`EverThread_Complete_Functionality_Acceptance_Checklist.md`, supplied by the owner).
4. This package (Revision 2).
5. Historical audit reports and phase reports: evidence only.
Disagreements are recorded as findings (e.g. F-46, F-52), never resolved silently.

## 3. Package files
| File | Purpose |
|---|---|
| `00_MASTER_IMPLEMENTATION_ROADMAP.md` | scope, baseline, stage order, Git/evidence protocol, blockers |
| `01_REQUIREMENTS_AND_DECISION_TRACEABILITY.md` | decisions, findings F-01…F-54, new requirements |
| `01a_CHECKLIST_ROW_TO_STAGE_MAP.csv` | all 369 checklist/V3 rows → stage(s) |
| `02_ASSET_MANIFEST_AND_MAPPING.md` / `02a_ASSET_REGISTRY.csv` | authoritative asset registry (50 rows) and import protocol |
| `03_MOTION_AND_TRAVERSAL_SPECIFICATION.md` | motion contract, derived parameter register |
| `04_TEST_AND_ACCEPTANCE_PLAN.md` | test catalogue, route availability by stage, evidence rules |
| `STAGE-01…11-*.md` | one stage each (18 sections) |
| `FINAL_RECONCILIATION_REPORT.md` | readiness, coverage, gaps |

## 4. Reference-only and superseded material (retained, not deleted)
| Item | Status | Governed by |
|---|---|---|
| `everthread_audit_report_v2.md`, `…_reassessment_v3.md`, `…_reassessment_summary.md` | historical evidence | findings register / this package |
| `everthread_master_findings_register.md` (F-01…F-33) and `everthread_completeness_check.md` (F-34…F-46) | historical; IDs preserved in `01_…` | `01_…` §E |
| `everthread_decision_register.md` (D-01…D-22) | historical; mapped in `01_…` §D (prefix **DEC**) | `01_…` §D |
| `everthread_requirements_matrix*.md/csv` (v1, v3) | historical evidence; v3 mapped by `01a_…csv` | `01a_…csv` |
| `docs/instructions.md` (repo) | **superseded in part**: old ET names, `/products/:productId`, `/house` | `products.ts`, Brief routes |
| `docs/phase_6_6_preflight_audit.md` §4.2 | **superseded/erroneous catalogue** | `products.ts` |
| `docs/phase_7_2_functionality_motion_lens_report.md` §5 | **superseded** (Archive-commerce mapping, old catalogue) | this package |
| `docs/phase_7_3_visual_commerce_corrections_report.md` | **superseded** (Chanderi tunic as canonical) | `products.ts` |
| Package Revision 1 asset manifest (copy inside the ZIP) | **stale** | `02_…` Revision 2 |
| Earlier eight uploaded PNGs and the two-wall panorama | reference only | `02a_…csv` |
Supersession notices are added to repository documents only in Stage 11, as a single line each.

## 5. Not available (do not assume)
`_legacy_archive/Images`; Phase 6.0 experience audit and cinematic storyboard; original option text behind owner decisions 1–12; the live site; any owner approval of images.

## 6. ID namespaces
`F-nn` findings · `O-n` owner decisions · `DEC D-nn` decision-register items (DEF D-nn = v2 defects) · `N-nn` new requirements · `CL-nnn` checklist line numbers · `V3-nn` reassessment rows · `AST-*`/`REPO-*` assets · `B-n` blockers · test IDs `UT-`, `E2E-`, `MAN-`.
