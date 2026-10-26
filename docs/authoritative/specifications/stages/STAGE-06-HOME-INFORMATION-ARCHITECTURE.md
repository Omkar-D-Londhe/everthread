# STAGE-06 — Home Information Architecture and Editorial Scenes

## 1. Purpose and rationale
Give Home the approved journey (Brief §8): Hero → Compass → Archive → Capsule/collections → Making → Promise → Journal, without duplicated Compass sections, with the second collection introduced, and with claims that match the product record. Structure only: motion arrives in Stage 8.

## 2. Prerequisites
STAGE-05 PASS (or PARTIAL approved). `docs/baseline/CLAIMS_INVENTORY.md` available.

## 3. Scope and exclusions
In: `HomePage.tsx` section order and content, hero metadata, secondary CTA, walls preview, Making/Promise scene, closing, tests. Out: fold/scrub changes (Stage 8), hero timeline timing, loader, House page copy (Stage 9), any new factual claim, any product grid on Home.

## 4. IDs
F-02, F-13, F-26, F-41, F-43; N-07; O-12; V3-07, V3-09; CL-446 (structure only); DEC D-08, D-11.

## 5. Current-state evidence
Home is about 6,221 px tall with 8 sections. Headings (browser-verified): H1 "An heirloom, not a trend."; H2 "Thread Compass", "Cultural Archive & Weave Library", "The Permanent Capsule" (three highlight cards); H2 "The Thread Compass" (full teaser); H2 "The Living Loom"; H2 flagship product name; H3 "Pit-Loomed Humidity", "Floating Canvases", "Honoring Artisan Lineage", "Uncut Botanical Purity", "Generational Inlay Margins", "Documented Provenance"; H2 "On Unbroken Heirlooms…". There is **no** "The Making" or "Promise" section. Hero metadata (`HomePage.tsx` ≈L574–582) shows "Numbered 01–64", "100% Unblended", "Pit-Loomed Jacquard", caption "Mulberry Silk & Cashmere", while the ET-01 record says Edition of 30, 70% Fine Merino Wool / 30% Wild Mulberry Silk, "Pit-Loomed 2/2 Twill with Kadwa Facing". Secondary CTA reads "Discover the Stories". `flagshipProduct = PRODUCTS[0]` (≈L421).

## 6. Files affected
`src/pages/HomePage.tsx`, **new** `src/components/home/WallsPreview.tsx`, `src/components/home/NarrativeSpine.tsx`, `src/styles/*.css`, tests `motion-homepage`, `foundation`, new `e2e/home.spec.ts`.

## 7. Ordered implementation instructions
1. Branch per §15. Gate baseline. List current sections with line ranges in `docs/baseline/HOME_SECTIONS.md` before editing.
2. **Target order and test ids:** `home-hero` → `home-index` (chapters I–III) → `home-compass` (one teaser) → `home-craft` (Living Loom + diagram thumbnails) → `home-walls` → `home-making` + `home-promise` (one scene, two columns) → `home-journal` → `home-closing`. Add `data-scene="H1"`, `"H2"`, `"H3"` markers on `home-index`, `home-walls`, `home-making` for Stage 8 (no behaviour).
3. **Hero data binding.** Read ET-01 from the catalogue (not `PRODUCTS[0]` by position: use `getProductById('et-01')`). Metadata cells: "Material" = `product.fiberPurity` verbatim; "Construction" = `product.weaveType` verbatim; "Piece" = `product.category`. **Remove the edition cell**: no edition number appears (editions on hold, F-46). Image caption = `product.fiberPurity` (no "cashmere", no "unblended"). Do not hand-type any product claim in `HomePage.tsx`.
4. **CTAs.** Primary unchanged; secondary text exactly "Enter the Archive" linking `/archive`.
5. **Chapter index.** Turn the three highlight cards into numbered chapter entries (I Thread Compass → `/compass`, II Cultural Archive → `/archive`, III Collections → `/collections`) as `h3`/links, **not** `h2`, so the only `h2 "Thread Compass"` is the teaser section. Keep the existing hero→index scrub hand-off untouched.
6. **Compass teaser.** Keep one section with its first question and a link to `/compass`. Delete repeated copy.
7. **Craft scene.** Keep The Living Loom. Add three static, non-moving diagram thumbnails (first three in the documented strip order: Warp Weft, Textile Vocabulary, Technique Comparison) with titles; each links to `/archive` (Stage 7 changes the target to the diagram viewer deep link). Alt text from diagram titles.
8. **Walls preview (`WallsPreview`).** Two equal doors side by side (stacked on mobile): "Contemporary Collection" → `/collections`, "The Living Inheritance" → `/collections/the-living-inheritance`. Art: `AST-HOME-HERO` only if `APPROVED`; otherwise approved product crops or typographic panels. `AST-HOME-CAMP` may appear only as a static still **without** any decorative thread overlay and only if the owner approves it (it has a baked thread and non-catalogue figures, F-48). No prices, no cards, no carousel.
9. **Making and Promise (O-12).** One scene, two columns, **claim-free**:
   - *The Making:* the approved narrative spine as five linked labels — Thread (→ `/compass`), Textile (→ `/archive`), Craft (→ `/archive`), Garment (→ `/collections`), Story (→ `/journal`). No descriptive sentences about production.
   - *The Promise:* the three approved brand lines, verbatim ("An heirloom, not a trend.", "Every thread carries a story.", "One thread. A world of stories.").
   Any additional copy requires the owner's approved text (B-5); do not write it.
10. **Remove from Home** the six attribute headings (Pit-Loomed Humidity … Documented Provenance) and the paragraph claims beneath them. Record their exact text in `RESULT.md` for Stage 9 / owner review. Do not rewrite them.
11. **Journal teaser and closing.** Keep the Journal teaser copy only if its claims are `supported` in the inventory; otherwise show title and link only. Add `home-closing`: the line "One thread. A world of stories." with two links, "Enter the Archive" and "Explore the collections".
12. Update tests; add `e2e/home.spec.ts`; gate; commit.

## 8. Expected behaviour
Home reads as a guided journey; Compass appears once; both collections are introduced; hero metadata equals ET-01 data; "Enter the Archive" appears; the page ends with a deliberate closing.

## 9. Data integrity, accessibility, failure
No hard-coded product facts. One `h1`; headings descend logically; all links have discernible text; images have alt text. If ET-01 cannot be resolved, render nothing for the metadata rather than stale text.

## 10. Tests
`E2E-HOME-01` (order by test ids; exactly one `h2` "Thread Compass"; exact CTA text; metadata strings equal `getProductById('et-01')` fields; absence of "Numbered", "Unblended", "Cashmere", "Pit-Loomed Humidity"); `E2E-ROUTE-01` for `/`; `E2E-RESP-01` for `/`; update `motion-homepage.test.tsx` and `foundation.test.tsx` for the new structure (assert behaviour, not removed copy).

## 11. Manual checks
Scroll `/` at 1440, 1024, 390; confirm the order, links, no dead ends; review for any remaining factual claim.

## 12. Acceptance criteria
- Order and test ids as in step 2.
- Zero hand-typed ET-01 facts; hero shows record values and no edition.
- "Enter the Archive" present; no "Discover the Stories".
- Only one Compass teaser.
- Making/Promise contain only approved/verbatim content.
- Removed claims listed in `RESULT.md`.
- No overflow at 390 px.

## 13. Evidence
Screenshots of `/` at three viewports, Playwright report, section map document, `RESULT.md` with removed-copy list.

## 14. Risks and mitigation
`motion-homepage` tests are DOM-heavy: update with structure, keep GSAP assertions meaningful. The hero scrub depends on section ids: do not rename elements it targets without updating the hook.

## 15. Git
Create branch `stage-06-home` from the **current head of `integration/everthread-v1`**; confirm `git status` is clean first. Commit in small logical groups with message `stage-06: <summary>`; review `git diff` before each commit and exclude unrelated files. **Do not commit to or push `main`** (a push deploys); no force-push, reset or history rewrite without owner approval. After owner approval: merge the stage branch into `integration/everthread-v1` with `--no-ff` and tag `stage-06-approved`. Record `git status`, `git log --oneline -n 10` and `git diff --stat` in `RESULT.md`.

## 16. Stop conditions
Stop if a section requires new factual copy; list it as BLOCKED and continue with claim-free structure.

## 17. Exit gate
PASS when §12 holds and the owner approves the page order and the removed-copy list.

## 18. Reconciliation addendum (Revision 2)
**18.1 Asset dependencies (manifest IDs, status from `02a_ASSET_REGISTRY.csv`).** `AST-HOME-HERO` (if `APPROVED`), existing ET-01 images, diagram records `library-warp-weft-diagram-01`, `library-textile-vocabulary-01`, `library-technique-comparison-01` (`REPO-DIAG-*`), `AST-HOME-CAMP` only per Stage 6 step 8.

**18.2 Data-model and route implications.** No data change; hero reads ET-01 through `getProductById`.

**18.3 Desktop / tablet / mobile behaviour.** Desktop: sections full-bleed with editorial layouts; tablet: two-column sections collapse to one under 1024 px where existing CSS does; mobile: single column, chapter cards stacked. Hero retains the existing layout.

**18.4 Component state matrix (initial, hover, focus, active, selected, completed, loading, empty, error as applicable).** Chapter card: default, hover, focus-visible, active. Diagram thumbnail: default, hover, focus, image-error (title text). Walls preview doors: default, hover, focus. Hero metadata: populated, ET-01 unresolved (omitted).

**18.5 Interaction and motion contract.** None new (markers only). Existing hero timeline and scrub unchanged; reduced-motion behaviour unchanged. Pointer, touch and keyboard parity is mandatory for every interactive control; all numeric values not established by an approved source are marked `OWNER_APPROVAL_REQUIRED` in `03_…` §9.

**18.6 Regression checks for previously working features.** Hero→index scrub, Compass link, Archive link, Journal teaser, `motion-homepage` tests (updated).

**18.7 Source files.** Known (verified): `src/pages/HomePage.tsx` (hero ≈L421–582, scrub ≈L336–395, flagship ≈L421). To verify: component boundaries for each section and CSS files styling the six attribute blocks. Antigravity must report the actual paths found before editing; unknown locations are not to be invented.

**18.8 Outstanding blockers and owner decisions.** O-12 (default claim-free), B-5, F-48/F-51 (art), CLAIMS inventory.

**18.9 Stop condition.** Stop if a section needs new factual copy or if art status prevents the preview without product crops.

**18.10 End-of-stage report.** Present the 8 items in roadmap §5 item 5 and request explicit owner approval. Do not start the next stage.

**18.11 Evidence-integrity table (fill with actual results only).**
| Check | Planned | Executed | Passed | Failed | Not run | Unverifiable |
|---|---|---|---|---|---|---|
| (one row per check listed in §10–§11, filled with actual results only) | | | | | | |

**18.12 Exit-criteria matrix (copy of §12, to be completed).**
| # | Exit criterion | Result (PASS/FAIL/BLOCKED) | Evidence file |
|---|---|---|---|
| 1 | Order and test ids as in step 2. | _to be filled by Antigravity_ | _path_ |
| 2 | Zero hand-typed ET-01 facts; hero shows record values and no edition. | _to be filled by Antigravity_ | _path_ |
| 3 | "Enter the Archive" present; no "Discover the Stories". | _to be filled by Antigravity_ | _path_ |
| 4 | Only one Compass teaser. | _to be filled by Antigravity_ | _path_ |
| 5 | Making/Promise contain only approved/verbatim content. | _to be filled by Antigravity_ | _path_ |
| 6 | Removed claims listed in `RESULT.md`. | _to be filled by Antigravity_ | _path_ |
| 7 | No overflow at 390 px. | _to be filled by Antigravity_ | _path_ |
