# STAGE-07 — Archive Overview, Technique Strip and Exhibition Fixes

## 1. Purpose and rationale
Turn the uniform 14-tile Archive overview into a discipline-led, asymmetric exhibition; present the nine technical diagrams as a quiet scroll-driven strip; and fix the exhibition modal's focus, captions, related-piece links and URL handling. The Archive remains educational: no merchandise, no Add to Bag.

## 2. Prerequisites
STAGE-02 PASS (relations, legacy routes, no Acquire) and STAGE-03 PASS (`useDialogFocus`). Stage 6 recommended (Home links to the diagram viewer are updated here).

## 3. Scope and exclusions
In: `ArchivePage.tsx` layout, discipline groups, technique strip, diagram viewer deep link, exhibition modal behaviour (focus, Esc, captions, URL param, thumbnail labels, related links), alt text, credit fields, tests. Out: changing exhibition content, plate roles or IDs; inventing diagram-to-tradition associations; fold and opening choreography (Stage 8); new cultural copy.

## 4. IDs
F-03, F-04 (structure hooks), F-05 (UI), F-08 (Exhibition), F-10 (story-page button), F-12, F-28, F-33, F-36, F-38; N-06, N-10; O-5, O-7; CL-409…428.

## 5. Current-state evidence
Archive is about 7,819 px tall (31 buttons, 19 images): intro, "Four Foundational Studies", "The Weave Library" (14 equal tiles in 3 columns with filters), Technical Diagram Library (select + viewer). 13 traditions (folders with six base roles) plus the weave-14 record. Nine diagrams in `DIAGRAM_ASSETS` (`id`, `title`, `svg`, `fallbackPng`, `description` only; **no tradition mapping**). The modal shows `activeItem.alt` as the plate caption (filename-derived, e.g. "archive muga silk model 01"); focus escapes after about 14 Tabs and `Esc` then fails; `?tradition=` persists after close; on the story page a button extends 38 px past 390 px; plate-label thumbnails truncate ("MODEL / …"). Approved links to preserve: weave-14 → `/archive/the-art-of-the-drape`; Folio 1.1 → `/archive?tradition=banarasi-brocade`; 9 legacy slugs (Stage 2).

## 6. Files affected
`src/pages/ArchivePage.tsx`, `src/pages/ArchiveStoryPage.tsx`, `src/components/TraditionExhibitionModal.tsx`, **new** `src/components/archive/DisciplineGroup.tsx`, `TechniqueStrip.tsx`, `src/data/archiveDisciplines.ts`, `src/data/assetMap.ts` (caption helper, credit fields), `src/styles/*.css`, tests `editorial-archive`, `tradition-exhibition`, `archive-commerce-guidance`, new `e2e/archive.spec.ts`.

## 7. Ordered implementation instructions
1. Branch per §15. Gate baseline. Capture before-screenshots of `/archive` at 3 viewports.
2. **Disciplines.** Read the existing discipline filter values and the discipline of each of the 14 records from current data; create `archiveDisciplines.ts` mapping discipline → ordered record ids **using existing data only** (do not reclassify). Each group: heading, one existing descriptive line if the data has it (otherwise none), then cards.
3. **Asymmetric layout.** Each group renders one **feature card** (≈7/12 columns, larger image) plus smaller cards (5/12 or 4/12) using layout presets `feature-left`, `feature-right`, `triptych`. Vary by group so no two adjacent groups repeat exactly. The existing filter chips remain, filtering across groups; when a filter is active, hide non-matching cards and empty groups; "all" restores the editorial layout. Card content unchanged (image, region, title, plate count, "Examine 6-plate folio" action, same `data-testid`s).
4. **Technique Strip** (`TechniqueStrip`, between Foundational Studies and the Weave Library): all nine diagrams in this order — Warp Weft, Textile Vocabulary, Technique Comparison, Embroidery–Weaving Comparison, Resist Dyeing, Double Ikat, Block Printing, Garment Construction, Textile-to-Garment Sequence. Each item: thumbnail (SVG, PNG fallback on error), visible title, link to `/archive?diagram=<id>` which opens the existing diagram viewer (add reading of the `diagram` query param to `ArchivePage`, scrolling the viewer into view and selecting the diagram; unknown ids ignored). No tradition labels or "related tradition" text (no metadata exists). Desktop: scroll-driven drift is added in Stage 8; in this stage the strip is a horizontally scrollable snap strip with keyboard-focusable items (`scrollIntoView` on focus). Mobile and reduced motion: same native strip. Update Home's three thumbnails to link to `?diagram=<id>`.
5. **Modal focus.** Apply `useDialogFocus` to `TraditionExhibitionModal`: focus to Close on open, Tab trap including thumbnails and controls, `Esc` handled at document level and always closes, focus restored to the opener element (or the card for deep links), body scroll behaviour unchanged. On close remove `tradition` from the query with `replace` (F-28).
6. **Captions (F-12).** Add `getPlateCaption(record, role)` → `"{Tradition title} — {role label}"` using existing tradition and role label data. The modal's caption element uses it; never show `activeItem.alt` as visible caption. Keep image `alt` descriptive using the same words plus "(AI-generated interpretive image)" **only if** the owner confirms the disclosure wording (B-4); otherwise alt = caption text.
7. **Related links.** Replace the Stage 2 placeholder with the final `RelatedPiece` block in the modal: ET relationships (text link "View related piece" for Banarasi→ET-01 and Kota Doria→ET-04 with the provisional wording constants; Sozni informational text only; Muga nothing) and the "design inspired by" link for the matching TR product **only when that product `isListed`**. No buttons that look like purchase buttons; no Add to Bag.
8. **Labels and overflow.** Exhibition plate thumbnails show the full label (wrap to two lines or use a tooltip pattern with accessible name; no ellipsis that hides the role). On `ArchiveStoryPage` make the offending button `max-width: 100%` and allow text wrap; verify 390 px.
9. **Structure hooks for Stage 8.** Add stable `data-step` attributes to the five opening elements (`cover`, `surface`, `main-image`, `views`, `thread`) and `data-scene="A1"`/`"A2"` on the intro→Studies and Studies→Library boundaries. No animation changes.
10. **Credit fields.** Add `provenance` (`ai-interpretive-textile` for archive plates, `technical-diagram` for diagrams) and empty `creditText` to the image/diagram records; no visible change.
11. Update tests (§10), gate, after-screenshots, commit.

## 8. Expected behaviour
The overview is grouped by discipline with varied card prominence; the strip lists nine diagrams and opens the viewer; the exhibition keeps focus inside, closes with Esc, restores focus, clears the URL param, shows neutral captions and the approved related links.

## 9. Data integrity, accessibility, failure
IDs, filters, deep links and legacy slugs unchanged. Broken diagram SVG falls back to PNG; both failing shows the title text. No fabricated associations.

## 10. Tests
`E2E-ARCH-01…05`, `E2E-ROUTE-04` (legacy), `E2E-LINK-01`, `E2E-RESP-01` for `/archive` and a story page; `UT-ARCH-01` extended for the modal; update `editorial-archive`, `tradition-exhibition`, `archive-commerce-guidance` (assert **absence** of Acquire).

## 11. Manual checks
Open each of the 13 traditions, plus weave-14 link and Folio 1.1; keyboard-only walk; mobile review of the overview and thumbnails; check every caption.

## 12. Acceptance criteria
- 13 deep links and 14 weave records still work; weave-14 and Folio 1.1 unchanged.
- Overview shows discipline groups with a larger feature card in each; no uniform 14-tile grid.
- Strip: nine items, documented order, readable titles, opens viewer.
- Modal: 20 Tabs never leave it; Esc closes; focus restored; query param cleared.
- No caption or alt text looks like a filename.
- Zero Add to Bag/Acquire in Archive.
- 390 px: no overflow, no truncated plate labels.

## 13. Evidence
Before/after screenshots, Playwright report, caption list dump (all 78 plates) in `RESULT.md`.

## 14. Risks and mitigation
Filtering plus asymmetric presets can leave odd empty gaps: test each filter. Query param handling can conflict with `tradition`: support both together. Large page weight: lazy-load below-the-fold images.

## 15. Git
Create branch `stage-07-archive` from the **current head of `integration/everthread-v1`**; confirm `git status` is clean first. Commit in small logical groups with message `stage-07: <summary>`; review `git diff` before each commit and exclude unrelated files. **Do not commit to or push `main`** (a push deploys); no force-push, reset or history rewrite without owner approval. After owner approval: merge the stage branch into `integration/everthread-v1` with `--no-ff` and tag `stage-07-approved`. Record `git status`, `git log --oneline -n 10` and `git diff --stat` in `RESULT.md`.

## 16. Stop conditions
Stop if a discipline cannot be derived from existing data; if diagram association would need invented metadata (use none).

## 17. Exit gate
PASS when §12 holds and the owner approves the overview composition screenshots.

## 18. Reconciliation addendum (Revision 2)
**18.1 Asset dependencies (manifest IDs, status from `02a_ASSET_REGISTRY.csv`).** `REPO-DIAG-*` all 9 (`library-block-printing-process-01`, `-double-ikat-process-01`, `-embroidery-weaving-comparison-01`, `-garment-construction-01`, `-resist-dyeing-process-01`, `-technique-comparison-01`, `-textile-to-garment-sequence-01`, `-textile-vocabulary-01`, `-warp-weft-diagram-01`); 13 tradition folders × 6 base roles; TR images only through the related link's product (if listed).

**18.2 Data-model and route implications.** `archiveDisciplines.ts`, `?diagram=` query, caption helper, credit fields.

**18.3 Desktop / tablet / mobile behaviour.** Desktop: discipline groups with feature card (≈7/12) plus smaller cards; strip with native horizontal scroll (drift added Stage 8). Tablet: feature card full-width then 2-up. Mobile: single column; strip swipeable; thumbnails labelled in full.

**18.4 Component state matrix (initial, hover, focus, active, selected, completed, loading, empty, error as applicable).** Card: default, hover, focus, active, filtered-out. Strip item: default, hover, focus (scrolls into view), selected (viewer open), image-error (PNG fallback then title). Modal: opening (hooks only), open, closing, error. Related link: default/hover/focus/absent. Filter chip: default, hover, focus, selected.

**18.5 Interaction and motion contract.** Stage 7 adds no motion; it adds `data-step`/`data-scene` hooks. Exhibition close/Esc must be instantaneous. Pointer, touch and keyboard parity is mandatory for every interactive control; all numeric values not established by an approved source are marked `OWNER_APPROVAL_REQUIRED` in `03_…` §9.

**18.6 Regression checks for previously working features.** 13 deep links, weave-14, Folio 1.1, legacy slugs, filters, Technical Diagram Library viewer, search.

**18.7 Source files.** Known (verified): `src/pages/ArchivePage.tsx`, `src/pages/ArchiveStoryPage.tsx`, `src/components/TraditionExhibitionModal.tsx`, `src/data/assetMap.ts` (`DIAGRAM_ASSETS`), `src/data/stories.ts`. To verify: discipline field names in the weave records and where the diagram viewer state lives. Antigravity must report the actual paths found before editing; unknown locations are not to be invented.

**18.8 Outstanding blockers and owner decisions.** O-5 (BLOCKED — strip), F-52 (Banarasi/Kota links), F-38 (human review of plates), DEC D-20.

**18.9 Stop condition.** Stop if disciplines cannot be derived from existing data or a diagram association would need invented metadata.

**18.10 End-of-stage report.** Present the 8 items in roadmap §5 item 5 and request explicit owner approval. Do not start the next stage.

**18.11 Evidence-integrity table (fill with actual results only).**
| Check | Planned | Executed | Passed | Failed | Not run | Unverifiable |
|---|---|---|---|---|---|---|
| (one row per check listed in §10–§11, filled with actual results only) | | | | | | |

**18.12 Exit-criteria matrix (copy of §12, to be completed).**
| # | Exit criterion | Result (PASS/FAIL/BLOCKED) | Evidence file |
|---|---|---|---|
| 1 | 13 deep links and 14 weave records still work; weave-14 and Folio 1.1 unchanged. | _to be filled by Antigravity_ | _path_ |
| 2 | Overview shows discipline groups with a larger feature card in each; no uniform 14-tile grid. | _to be filled by Antigravity_ | _path_ |
| 3 | Strip: nine items, documented order, readable titles, opens viewer. | _to be filled by Antigravity_ | _path_ |
| 4 | Modal: 20 Tabs never leave it; Esc closes; focus restored; query param cleared. | _to be filled by Antigravity_ | _path_ |
| 5 | No caption or alt text looks like a filename. | _to be filled by Antigravity_ | _path_ |
| 6 | Zero Add to Bag/Acquire in Archive. | _to be filled by Antigravity_ | _path_ |
| 7 | 390 px: no overflow, no truncated plate labels. | _to be filled by Antigravity_ | _path_ |
