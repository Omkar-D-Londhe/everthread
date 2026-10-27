# EverThread — Superseded Documentation Index

**Specification Reference:** `docs/implementation/STAGE-11-AUDIT-CLOSURE-HANDOVER.md` §7.5  
**Baseline Commit:** `c60f99b` on branch `stage-08-motion`  
**Generated Date:** 2026-10-27  

---

## 1. Purpose & Policy

In accordance with **Owner Decision O-1** and `EverThread_Consolidated_Owner_Decisions.md` §1:
> *"Preserve historical records and mark conflicting statements as superseded instead of deleting audit history."*

Historical documents, preflight reports, and initial implementation briefs are preserved in full within the repository to maintain historical traceability. Where specific statements, route schemes, product names, or readiness claims in older documents conflict with the current authoritative codebase or approved owner decisions, they are indexed below as **superseded in part**.

No historical document has been deleted or rewritten. Conflicting documents have been tagged with a single prepended header notice:
```markdown
SUPERSEDED in part — see docs/SUPERSEDED.md
```

---

## 2. Superseded Document Index

| Conflicting Document | Specific Superseded Content | Authoritative Superseding Source | Rationale & Context |
|---|---|---|---|
| `docs/instructions.md` | - Plural `/products/:productId` route schema<br>- Legacy product titles and fiber descriptions<br>- Older House section structure assumptions | - `src/App.tsx`<br>- `src/data/products.ts`<br>- `src/data/traditionalProducts.ts`<br>- `00_MASTER_IMPLEMENTATION_ROADMAP.md` | The canonical product route is singular `/product/:productId`. Canonical product titles (e.g., ET-02 *"Ivory Hand-Spun Matka Silk Cocoon Trench"*) and six-section House structure are authoritative. |
| `docs/historical/superseded/phase-reports/phase_6_6_preflight_audit.md` | - §4.2 Erroneous product catalog boundaries<br>- Statements declaring full readiness prior to Living Inheritance wall addition | - `src/data/products.ts`<br>- `src/data/traditionalProducts.ts`<br>- `STAGE-05-COLLECTION-WALLS.md` | Phase 6.6 pre-dated the implementation of the second collection wall (The Living Inheritance, TR-01–TR-07) and B-4 canonical concept disclosure. |
| `docs/historical/superseded/phase-reports/phase_7_2_functionality_motion_lens_report.md` | - §5 Direct commercial acquisition links in Archive<br>- Older assumptions that TR products are unlisted or non-purchasable | - `src/data/archiveRelations.ts`<br>- `EverThread_Consolidated_Owner_Decisions.md` §B-4 / O-7 | Educational archive entries remain non-transactional (zero "Acquire" buttons). Related pieces link to PDPs where TR products are commercially purchasable concept pieces. |
| `docs/historical/superseded/phase-reports/phase_7_3_visual_commerce_corrections_report.md` | - Chanderi Tunic canonical naming and sizing assumptions | - `src/data/products.ts`<br>- `src/data/traditionalProducts.ts` | Product catalog schemas and variant models in `products.ts` and `traditionalProducts.ts` are the source of truth. |
| `docs/historical/superseded/phase-reports/phase_7_3_comprehensive_audit_report.md` | - Premature "100% Complete" declaration prior to Revision 2 requirements | - `01_REQUIREMENTS_AND_DECISION_TRACEABILITY.md`<br>- `00_MASTER_IMPLEMENTATION_ROADMAP.md` | Replaced by Revision 2 audit suite, identifying unverified motions and missing collection wall requirements. |
| `docs/historical/superseded/phase-reports/phase_7_2_deployment_verification_report.md` | - Claims of verified live deployment | - `01b_AUDIT_TRACKER.csv` (`F-24`) | Live deployment on GitHub Pages is owner-gated and maintained as UNVERIFIED pending manual owner live testing. |
| `docs/historical/superseded/phase-reports/phase_7_1_github_pages_report.md` | - Static hosting verification assumptions | - `e2e/pagesServer.mjs`<br>- `STAGE-11-AUDIT-CLOSURE-HANDOVER.md` | Deployment verification protocol formalized under Stage 11. |
| `docs/historical/superseded/phase-reports/phase_7_0_release_readiness_report.md` | - Release readiness declared before Living Inheritance and motion system | - `STAGE-08-MOTION-AND-THREAD.md`<br>- `STAGE-09-HOUSE-JOURNAL-CLAIMS.md`<br>- `STAGE-10-ACCESSIBILITY-REGRESSION-RESPONSIVE.md` | Required subsequent stages for motion, editorial claims, and accessibility compliance. |
| `docs/historical/drafts/everthread_audit_report_v2.md` | - Provisional defect IDs (`DEF D-xx`) and incomplete test matrices | - `01_REQUIREMENTS_AND_DECISION_TRACEABILITY.md` §D | Defect IDs were systematically re-mapped to canonical `DEC D-xx` and `F-xx` finding IDs in Revision 2. |
| `docs/historical/drafts/everthread_audit_reassessment_v3.md` | - Preliminary V3 reassessment statuses (`V3-01`…`V3-14`) | - `docs/implementation/01b_AUDIT_TRACKER.csv`<br>- `docs/CLOSURE_MATRIX.md` | Authoritative statuses tracked in `01b_AUDIT_TRACKER.csv`. |
| `docs/historical/drafts/everthread_reassessment_summary.md` | - Preliminary gap calculations | - `00_MASTER_IMPLEMENTATION_ROADMAP.md` | Replaced by Master Implementation Roadmap Revision 3. |
| `docs/historical/drafts/everthread_solution_proposal.md` | - Proposal for scroll pinning and custom scrollbar interception | - `03_MOTION_AND_TRAVERSAL_SPECIFICATION.md`<br>- Owner Decision `O-4` | Scroll pinning and vertical snapping were explicitly rejected by the owner in favor of 100% native scrolling. |
| `docs/historical/drafts/everthread_phase1_verification_gap_report.md` | - Initial gap inventory | - `docs/implementation/baseline/BASELINE.md` | Formalized in Stage 01 baseline tooling and verification package. |
| `docs/historical/drafts/everthread_master_findings_register.md` | - Initial `F-01`–`F-33` register | - `01_REQUIREMENTS_AND_DECISION_TRACEABILITY.md` §E | Expanded to `F-01`–`F-54` in Revision 2 without renumbering. |
| `docs/historical/drafts/everthread_completeness_check.md` | - Initial `F-34`–`F-46` register | - `01_REQUIREMENTS_AND_DECISION_TRACEABILITY.md` §E | Incorporated into canonical findings register in Revision 2. |

---

## 3. Preservation Verification

All 15 superseded historical documents retain their original markdown headings, paragraphs, and analyses unaltered beneath the single-line supersession banner. Zero historical lines have been deleted.
