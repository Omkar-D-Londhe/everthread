# STAGE-11 — Audit Closure, Documentation Supersession and Handover

## 1. Purpose and rationale
Prove every audit finding and decision has a final, evidenced disposition; mark superseded documents without deleting any; verify the deployment path; hand over a changed-file inventory and known limitations.

## 2. Prerequisites
STAGE-10 PASS. All stage branches reviewed and approved by the owner; merge plan agreed (the owner merges to `main`, which triggers deployment).

## 3. Scope and exclusions
In: closure matrix, supersession notices, final inventories, deployment verification steps, handover. Out: new features, redesign, silent edits to historical audit files, claiming live verification without evidence.

## 4. IDs
All F-01…F-46, DEC D-01…D-22, O-1…O-14, N-01…N-10, F-22, F-24, F-45; CL-675…688.

## 5. Current-state evidence
Historical documents with conflicting catalogue or route information: `docs/instructions.md` (old ET names, `/products/:productId`), `docs/phase_6_6_preflight_audit.md` §4.2 (erroneous catalogue), `docs/phase_7_2_functionality_motion_lens_report.md` §5, `docs/phase_7_3_visual_commerce_corrections_report.md`. Earlier audit artifacts (`everthread_*` v2/v3/etc.) are historical.

## 6. Files affected
`docs/SUPERSEDED.md` (new index), a one-line notice at the top of each superseded repository document (the only edit to those files), `docs/CLOSURE_MATRIX.md` (new), `docs/HANDOVER.md` (new), `docs/stage-evidence/` (final), no `src/` changes except trivial defects found during closure (each logged).

## 7. Ordered implementation instructions
1. Branch per §15. Verify all prior stage `RESULT.md` files exist and show PASS (or approved PARTIAL).
2. Build `docs/CLOSURE_MATRIX.md`: one row for every ID in `01_…` §E, §B, §D, §F with final status (`Fixed`, `Verified-no-change`, `Deferred-by-decision`, `Hold-owner`, `Hold-evidence`, `Blocked`), the stage, evidence file path (test name, screenshot, recording), and the commit hash. No row may be blank.
3. Re-run the whole gate and the whole Playwright suite on the final merged candidate (`main` + all approved stage branches in order). Save outputs.
4. Re-verify the asset manifest: every TR asset path referenced by data exists, dimensions recorded, no master PNG in `public/`, no file larger than the recorded budget; list unused files.
5. **Supersession (F-22).** Create `docs/SUPERSEDED.md` listing each conflicting document, what is superseded (names, routes, mappings, prices) and by which authority (`products.ts`, the Brief, Roadmap §2.3, this package). Prepend to each superseded repository document exactly one line: `> SUPERSEDED in part — see docs/SUPERSEDED.md`. Do not delete or rewrite their content. Do not touch audit files outside the repository.
6. **Deployment verification (F-24, F-45).** After the owner merges to `main`: record the GitHub Actions run URL, commit hash and the status of each step. The owner then performs `MAN-LIVE` (8 routes with reload). Record results. If the owner cannot confirm, the item stays **UNVERIFIED** and is stated as such in the handover. Never write "deployed and verified" from CI alone.
7. Write `docs/HANDOVER.md`: final route table, data boundaries (`PRODUCTS`, `TRADITIONAL_PRODUCTS`, `ALL_PRODUCTS`), how to add a TR product (record + images + moment), how to run tests (`npm test`, `npm run test:e2e`), known limitations (provisional wording constants, any unlisted products, editions on hold, visible credits deferred, B-1…B-7 status), changed-file inventory (`git diff --stat main~N..main`), and the open owner decisions.
8. Commit; do not rewrite history.

## 8. Expected behaviour
No application behaviour change.

## 9. Data integrity, accessibility, failure
Closure matrix is the source of truth; any row without evidence is not Fixed.

## 10. Tests
Final full run of Vitest, `tsc`, build, Playwright (all projects). Add `e2e/smoke-live.spec.ts` (optional) parameterised by `BASE_URL` for the owner to run against the live URL; it must perform only read-only checks.

## 11. Manual checks
Owner runs `MAN-LIVE` and a final visual review at 1440/1024/390.

## 12. Acceptance criteria
- `CLOSURE_MATRIX.md` has a final status and evidence for every ID.
- Superseded documents marked, none deleted.
- Final gate and Playwright results attached and green.
- Handover lists limitations and unresolved items by real IDs.
- Live status recorded as VERIFIED only with the owner's confirmation.

## 13. Evidence
Closure matrix, final reports, Actions run URL, `MAN-LIVE` checklist with results, handover file.

## 14. Risks and mitigation
Merge conflicts between stage branches: merge in numeric order, re-running gates after each. Documentation notice edits touching many files: restrict to the single listed line.

## 15. Git
Create branch `stage-11-closure` from the **current head of `integration/everthread-v1`**; confirm `git status` is clean first. Commit in small logical groups with message `stage-11: <summary>`; review `git diff` before each commit and exclude unrelated files. **Do not commit to or push `main`** (a push deploys); no force-push, reset or history rewrite without owner approval. After owner approval: merge the stage branch into `integration/everthread-v1` with `--no-ff` and tag `stage-11-approved`. Record `git status`, `git log --oneline -n 10` and `git diff --stat` in `RESULT.md`.

## 16. Stop conditions
Stop if any stage was never approved, if a test fails after merge, or if evidence is missing for a "Fixed" claim.

## 17. Exit gate
Owner signs off the handover. Project status is "complete" only when every closure row is Fixed, Verified-no-change, or Deferred-by-decision, and all `Hold`/`Blocked` rows are explicitly accepted by the owner.

## 18. Reconciliation addendum (Revision 2)
**18.1 Asset dependencies (manifest IDs, status from `02a_ASSET_REGISTRY.csv`).** Final registry reconciliation: every `AST-*` row `APPROVED`, `deferred` or `unused`; masters' SHA-256 recorded.

**18.2 Data-model and route implications.** None.

**18.3 Desktop / tablet / mobile behaviour.** Final owner review at three viewports.

**18.4 Component state matrix (initial, hover, focus, active, selected, completed, loading, empty, error as applicable).** Not applicable.

**18.5 Interaction and motion contract.** None. Pointer, touch and keyboard parity is mandatory for every interactive control; all numeric values not established by an approved source are marked `OWNER_APPROVAL_REQUIRED` in `03_…` §9.

**18.6 Regression checks for previously working features.** Whole-site regression on the merge candidate.

**18.7 Source files.** Known: `docs/*`, `.github/workflows/deploy.yml` (read only). Antigravity must report the actual paths found before editing; unknown locations are not to be invented.

**18.8 Outstanding blockers and owner decisions.** Owner sign-off, live verification (owner).

**18.9 Stop condition.** Stop if a stage was never approved, a test fails after merge, or evidence is missing.

**18.10 End-of-stage report.** Present the 8 items in roadmap §5 item 5 and request explicit owner approval. Do not start the next stage.

**18.11 Evidence-integrity table (fill with actual results only).**
| Check | Planned | Executed | Passed | Failed | Not run | Unverifiable |
|---|---|---|---|---|---|---|
| (one row per check listed in §10–§11, filled with actual results only) | | | | | | |

**18.12 Exit-criteria matrix (copy of §12, to be completed).**
| # | Exit criterion | Result (PASS/FAIL/BLOCKED) | Evidence file |
|---|---|---|---|
| 1 | `CLOSURE_MATRIX.md` has a final status and evidence for every ID. | _to be filled by Antigravity_ | _path_ |
| 2 | Superseded documents marked, none deleted. | _to be filled by Antigravity_ | _path_ |
| 3 | Final gate and Playwright results attached and green. | _to be filled by Antigravity_ | _path_ |
| 4 | Handover lists limitations and unresolved items by real IDs. | _to be filled by Antigravity_ | _path_ |
| 5 | Live status recorded as VERIFIED only with the owner's confirmation. | _to be filled by Antigravity_ | _path_ |
