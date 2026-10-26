# EverThread — Test Debt & Remediation Register

**Date:** 2026-10-26  
**Reference:** `04_TEST_AND_ACCEPTANCE_PLAN.md` §3  
**Policy:** Tests that assert superseded or obsolete behavior must be **corrected** to assert approved specifications in their owning stages. Tests must **never** be deleted or skipped to obtain a passing suite.

---

## 1. Test Debt Catalogue by Stage

| Test File | Current Assertion / Debt Description | Governing Finding / Decision | Owning Stage | Required Remediation |
|---|---|---|---|---|
| `src/tests/product-detail.test.tsx` | Asserts ET-02 title is `"Ivory Raw Tussar Cocoon Trench"` and slug is `ivory-raw-tussar-cocoon-trench`. | F-32, DEC D-14 | **Stage 02** | Update test assertion to verify approved title `"Ivory Hand-Spun Matka Silk Cocoon Trench"` (fiber: 100% Hand-Spun Matka Raw Silk). Retain legacy route test as a redirect check. |
| `src/tests/asset-binding.test.tsx` | Asserts ET-04 alt text contains `"Pleated Indigo Chanderi Tunic"` (superseded name). | F-09, CL-018 | **Stage 02** | Correct alt text expectation to canonical title `"Angrakha Asymmetric Sheer Tunic"` without breaking image asset binding tests. |
| `src/tests/search.test.tsx` | Searches for legacy term `"Indigo Chanderi Tunic"` and expects old product routes. | F-09, F-39, UT-SEARCH-01 | **Stage 02** | Update search tests to verify token-based matching finds ET-04 (`angrakha-asymmetric-sheer-tunic`), weave-14 destination resolves to `/archive/the-art-of-the-drape`, and all search results resolve. |
| `src/tests/archive-commerce-guidance.test.tsx` | Asserts fixed Archive-to-commerce mappings with direct purchasing / "Add to Bag" actions inside Archive. | F-05, F-52, O-7, DEC D-15 | **Stage 02 / Stage 07** | Correct tests to enforce Decision O-7: Archive entries are educational and distinct from sellable collections. Related-piece links appear only for listed products; zero "Add to Bag" buttons on Archive entries. |
| `src/tests/phase-7-3-commerce-lens.test.tsx` | Asserts legacy Chanderi and old folio associations. | F-08, F-52, DEC D-25 | **Stage 02 / Stage 07** | Align assertions with settled canonical products and O-7 related-link rules. |
| `src/tests/collections.test.tsx` | Asserts single collection wall structure, tests order options. | N-01, UT-COLL-01 | **Stage 05** | Retain all existing `ContemporaryWall` test IDs; verify sort options are exactly Featured, price low→high, price high→low (no "Newest"); add second wall tests. |
| `src/tests/saved-and-bag.test.tsx` | Asserts 7 contemporary products only; does not support multi-piece sizing for traditional sets. | N-03, UT-CART-01 | **Stage 04** | Extend cart tests to assert set lines with independent top/bottom sizing without regressing existing single-item cart behavior. |

---

## 2. Baseline Status

- In **Stage 01**, all 15 existing test files / 251 tests run and pass without modification.
- Playwright characterization tests in `e2e/baseline.spec.ts` (78 tests) assert current baseline behavior only.
- Test debt items listed above remain active in their current passing state until their respective owning stages (Stages 2, 4, 5, 7) implement the approved functional changes.

---

## 3. Documentation & Evidence Debt Register

| Logged Stage | Scope / Document | Item / Discrepancy Description | Resolution / Target Stage |
|---|---|---|---|
| **Stage 02** | `docs/implementation/evidence/STAGE-02/RESULT.md` §6 | Discrepancy between RESULT.md prose (which quoted an earlier draft string mentioning bespoke wraps/House inquiry) and the actual source code `src/data/archiveRelations.ts` (which safely implemented the factual string: `'Pashmina is the ground fabric discussed in this folio.'`). | **Stage 09** (Claims Audit) or next documentation reconciliation pass. Do not treat provisional wording as owner-approved. |

