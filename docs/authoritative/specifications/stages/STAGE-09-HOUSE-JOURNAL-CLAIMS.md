# STAGE-09 — The House, Journal, Claims Integrity, Provenance and Concept Disclosure

## 1. Purpose and rationale
Close the content-integrity gap: only supported or owner-approved factual claims remain on The House, Journal, Home remnants and product pages; concept imagery and concept products are disclosed with approved wording; structured provenance and credit fields are complete. This stage edits copy only where the owner has decided.

## 2. Prerequisites
STAGES 6 and 7 PASS. `docs/baseline/CLAIMS_INVENTORY.md` complete. Owner has returned decisions per claim (see step 2) — without them, affected paragraphs are BLOCKED (B-5), not guessed. Disclosure wording (B-4) supplied or provisional.

## 3. Scope and exclusions
In: `HousePage.tsx` chapters and copy, Journal alt text and metadata, visible concept disclosure placement, provenance/credit fields completeness, claims verification tests. Out: inventing copy, rewriting cultural content without sources, edition/availability decisions (held), visible credit text (deferred), motion (Stage 8 wraps House scenes U1/U2 only).

## 4. IDs
F-41, F-42, F-46, F-38; N-09; O-9, O-11, O-12; DEC D-18 (hold), D-20, D-21; CL-410, 414, 445.

## 5. Current-state evidence
House page is about 3,317 px, 6 sections, 2 images, with the heading "Our Global Ateliers". ET records carry flags `isEditionFictional`, `isHoursEstimate`, `isAtelierConcept`, plus `unsupportedClaims` lists and statuses "Limited Reserve"/"Ready to Dispatch" — these are the project's own concept markers. `imageCredit` exists for 7 products and 4 stories only; none for the 78 plates, diagrams or Journal images. Stage 1 inventory lists every visible claim with a status.

## 6. Files affected
`src/pages/HousePage.tsx`, `src/pages/JournalPage.tsx`, `src/pages/JournalArticlePage.tsx`, `src/data/journal.ts`, `src/data/stories.ts` (credit fields only), `src/data/constants/disclosure.ts` (new: `CONCEPT_NOTICE_TEXT`, `TR_STATUS_TEXT`), `src/pages/ProductDetailPage.tsx` and `src/pages/collections/LivingInheritanceWall.tsx` (disclosure placement), tests, `docs/baseline/CLAIMS_DECISIONS.md` (new, owner-filled).

## 7. Ordered implementation instructions
1. Branch per §15. Gate baseline.
2. **Claims decisions file.** From `CLAIMS_INVENTORY.md` create `CLAIMS_DECISIONS.md`: one row per claim with columns ID, location, current text, status, **owner decision** (`keep`, `replace-with: <text>`, `remove`) and evidence reference. Give it to the owner; do not fill the decision column. Apply only rows with a decision. Rows without one stay unchanged and are listed in `RESULT.md` as BLOCKED.
3. **House.** Re-read the Brief's House page requirements before editing. Keep or condense to at most four chapters (Stage 8 will fold two boundaries). Preserve approved sections and layout intent. Apply only decided copy changes. Headings that imply operations or provenance that cannot be evidenced ("Our Global Ateliers", "Documented Provenance", "Honoring Artisan Lineage", "Generational Inlay Margins") are changed only per owner decision.
4. **Journal.** Verify every image has specific `alt`; add `provenance` (`ai-concept-fashion` or `ai-interpretive-textile` as applicable) and empty `creditText` fields; do not change visible credits.
5. **Concept disclosure (O-9).** Put the single approved/provisional constant `CONCEPT_NOTICE_TEXT` in: TR product pages (under the gallery), the Living Inheritance wall header (one line), and TR search results subtitle if the result card has a subtitle slot. `TR_STATUS_TEXT` shows once on TR product pages near the price. Both are plain text in the DOM (not images), the same wording everywhere. Do not add disclosure to ET products unless the owner extends the decision.
6. **Provenance data completeness.** Run a script/test that fails if any image record in `assetMap.ts`, `traditionalProducts.ts`, `stories.ts`, `journal.ts` lacks `alt` or `provenance`. Fill only with the allowed categories; if the category is unknown mark `unset` and list it for the owner.
7. **Edition/availability hold.** Do not modify existing ET `edition`, `status`, `leadTime` values or their display. Add a test that no TR record or TR page contains `edition`, `Ready to Dispatch`, `Limited Reserve`, artisan-hour or origin strings. Record the F-46 conflict (editions treated as approved data by the Roadmap vs forbidden by `instructions.md`) in `RESULT.md` as unresolved.
8. **Claims scan test.** Add `e2e/claims.spec.ts` that loads Home, House, Journal, ET and TR product pages and asserts absence of every string marked `remove` or replaced in `CLAIMS_DECISIONS.md` and presence of replacements.
9. Gate, commit.

## 8. Expected behaviour
Visible copy contains only supported or owner-approved claims; concept products and imagery are disclosed consistently with one wording; provenance metadata complete; no visual credit changes.

## 9. Data integrity, accessibility, failure
No fabricated attribution, workshop, region or process. Alt text specific. Disclosure readable (contrast ≥4.5:1) and not hidden in a tooltip.

## 10. Tests
`UT-DATA-02` extended (provenance/alt completeness), `MAN-CLAIMS`, `e2e/claims.spec.ts`, `E2E-ROUTE-01` for House/Journal, `E2E-A11Y-01`, `E2E-RESP-01` on House and Journal.

## 11. Manual checks
Owner reviews `CLAIMS_DECISIONS.md` results page by page; read every TR page for disclosure placement at 1440 and 390.

## 12. Acceptance criteria
- Every row in `CLAIMS_DECISIONS.md` with an owner decision is applied; undecided rows are listed as BLOCKED, not guessed.
- The disclosure constants appear exactly where specified and nowhere else.
- No TR page shows edition, dispatch, artisan hours, origin or manufacturing claims.
- Every image record has `alt` and `provenance`; `creditText` fields exist and remain empty.
- Existing ET data fields untouched.

## 13. Evidence
Diff of copy changes, Playwright claims report, screenshots of disclosure placements, `RESULT.md` with BLOCKED rows.

## 14. Risks and mitigation
Copy edits break tests asserting old strings: update tests with the owner decision reference. Over-long disclosure harms layout: keep to the owner's text, wrap not truncate.

## 15. Git
Create branch `stage-09-claims` from the **current head of `integration/everthread-v1`**; confirm `git status` is clean first. Commit in small logical groups with message `stage-09: <summary>`; review `git diff` before each commit and exclude unrelated files. **Do not commit to or push `main`** (a push deploys); no force-push, reset or history rewrite without owner approval. After owner approval: merge the stage branch into `integration/everthread-v1` with `--no-ff` and tag `stage-09-approved`. Record `git status`, `git log --oneline -n 10` and `git diff --stat` in `RESULT.md`.

## 16. Stop conditions
Stop if the owner has not supplied decisions for claims that affect page structure; ship the structure with the claim removed only if the owner chose `remove`.

## 17. Exit gate
PASS when §12 holds and the owner approves the final copy list. PARTIAL if rows remain BLOCKED.

## 18. Reconciliation addendum (Revision 2)
**18.1 Asset dependencies (manifest IDs, status from `02a_ASSET_REGISTRY.csv`).** `AST-HOME-HERO` alt text; all image records' `alt`/`provenance` completeness; no new files.

**18.2 Data-model and route implications.** `disclosure.ts` constants; provenance/credit fields completeness.

**18.3 Desktop / tablet / mobile behaviour.** Disclosure text wraps on 390 px without truncation; House chapters single column on mobile.

**18.4 Component state matrix (initial, hover, focus, active, selected, completed, loading, empty, error as applicable).** Disclosure: visible (plain text). Claims rows: applied / blocked. House chapter: default only.

**18.5 Interaction and motion contract.** None beyond Stage 8 scene wrapping. Pointer, touch and keyboard parity is mandatory for every interactive control; all numeric values not established by an approved source are marked `OWNER_APPROVAL_REQUIRED` in `03_…` §9.

**18.6 Regression checks for previously working features.** House layout, Journal, product pages, concept notice only on TR.

**18.7 Source files.** Known (verified): `src/pages/HousePage.tsx`, `src/pages/JournalPage.tsx`, `src/data/journal.ts`, `src/data/stories.ts`. To verify: House section component names. Antigravity must report the actual paths found before editing; unknown locations are not to be invented.

**18.8 Outstanding blockers and owner decisions.** B-4, B-5, DEC D-18 (hold), D-21 (pending), O-9/O-11/O-12.

**18.9 Stop condition.** Stop if the owner has not decided a claim that affects structure.

**18.10 End-of-stage report.** Present the 8 items in roadmap §5 item 5 and request explicit owner approval. Do not start the next stage.

**18.11 Evidence-integrity table (fill with actual results only).**
| Check | Planned | Executed | Passed | Failed | Not run | Unverifiable |
|---|---|---|---|---|---|---|
| (one row per check listed in §10–§11, filled with actual results only) | | | | | | |

**18.12 Exit-criteria matrix (copy of §12, to be completed).**
| # | Exit criterion | Result (PASS/FAIL/BLOCKED) | Evidence file |
|---|---|---|---|
| 1 | Every row in `CLAIMS_DECISIONS.md` with an owner decision is applied; undecided rows are listed as BLOCKED, not guessed. | _to be filled by Antigravity_ | _path_ |
| 2 | The disclosure constants appear exactly where specified and nowhere else. | _to be filled by Antigravity_ | _path_ |
| 3 | No TR page shows edition, dispatch, artisan hours, origin or manufacturing claims. | _to be filled by Antigravity_ | _path_ |
| 4 | Every image record has `alt` and `provenance`; `creditText` fields exist and remain empty. | _to be filled by Antigravity_ | _path_ |
| 5 | Existing ET data fields untouched. | _to be filled by Antigravity_ | _path_ |
