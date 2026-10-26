# STAGE-05 — Collection Walls: Stage, Routes and The Living Inheritance Composition

## 1. Purpose and rationale
Give visitors an effortless, premium way to move between the Contemporary Collection and The Living Inheritance using native horizontal scrolling, with real URLs and a visible, labelled fallback. The thread is a visual continuity cue, never the control.

## 2. Prerequisites
STAGE-04 PASS or PARTIAL (the wall shows only **listed** products). Owner confirmation of decisions O-2 and O-3 (both currently `BLOCKED — OWNER CLARIFICATION REQUIRED`). Stage art status taken from `02a_ASSET_REGISTRY.csv`.

## 3. Scope and exclusions
In: `/collections` and `/collections/the-living-inheritance`, the shared wall stage, route sync, composition of the new wall, shared filters/sort, tests. Out: Home preview (Stage 6), fold transitions (Stage 8), changes to the Contemporary wall's layout, filters or sorting, custom wheel capture, thread-follow drag, vertical hand-off, three- or four-finger gestures.

## 4. IDs
N-01, F-16, F-18; O-2, O-3, O-13; CL-163…170; DEC D-05.

## 5. Current-state evidence
Router has a single `/collections` route (`App.tsx`). `CollectionsPage.tsx` holds the flagship layout (7/5 column pattern, 4 sections, 17 buttons) with filters (category, fibre, colour, craft, price), sorting (Featured, price asc/desc) and test ids `product-card-*`, `desktop-filter-toggle`, `sort-select`, `product-count-indicator`. The header NavLink points to `/collections`. Existing card widths differ (478–753 px) and must be preserved. The audited panorama must **not** be used.

## 6. Files affected
`src/App.tsx`, `src/pages/CollectionsPage.tsx` (wrapped, not rewritten), **new** `src/pages/collections/CollectionWallsLayout.tsx`, `ContemporaryWall.tsx`, `LivingInheritanceWall.tsx`, **new** `src/components/walls/WallStage.tsx`, `WallThread.tsx`, `src/data/wallMoments.ts`, `src/components/Header.tsx` (active state only), `src/styles/walls.css`, tests `collections` (update), new `e2e/walls.spec.ts`.

## 7. Ordered implementation instructions
1. Branch per §15. Gate baseline.
2. **Routes.** Nested: `<Route path="/collections" element={<CollectionWallsLayout/>}><Route index element={<ContemporaryWall/>}/><Route path="the-living-inheritance" element={<LivingInheritanceWall/>}/></Route>`. `ContemporaryWall` renders the **existing** `CollectionsPage` content unchanged (move into a component; keep every test id). Header "Collections" NavLink stays active on both (`end={false}`). Document title: "Contemporary Collection · EverThread" / "The Living Inheritance · EverThread".
3. **Spike first (O-13 verification gate).** Build `WallStage` with plain panels (no art), the route sync and keyboard tabs, then write and run `E2E-WALL-02`, `E2E-WALL-03`, `E2E-WALL-05` before any styling or composition. If any fails and cannot be fixed within this stage → BLOCKED and report; do not replace the approach with custom gesture capture.
4. **WallStage structure.** A full-width band: header row with a `role="tablist"` of two tabs ("Contemporary Collection", "The Living Inheritance"; `aria-selected`, `aria-controls="wall-products"`); a horizontal track `overflow-x: auto; scroll-snap-type: x mandatory; overscroll-behavior-x: contain; scrollbar-width: none` with two panels each `flex: 0 0 88vw` (the next panel's edge peeks ≈12%) and `scroll-snap-align: start`. Each panel: wall title (`h2`), one factual line, "Browse the collection" anchor that scrolls to `#wall-products`. Edge cue text: "The Living Inheritance →" on the first panel, "← Contemporary Collection" on the second. Below the stage: `<div id="wall-products" role="tabpanel" aria-labelledby={activeTab}>` holding the route's content.
5. **Route ↔ scroll sync.**
   a. On mount set `scrollLeft` to the route's panel **instantly** (no animation).
   b. Settle detection: listen for `scrollend` (fallback debounce 140 ms after the last `scroll`); the settled panel is the one with `IntersectionObserver` ratio ≥ 0.6. If it differs from the route's wall and no programmatic scroll is in flight, `navigate()` (push) to that wall's path.
   c. Route change from elsewhere (Back/Forward, tab click, link): programmatic `scrollTo({left, behavior: reduced ? 'auto' : 'smooth'})` with `isProgrammaticScroll` ref true until `scrollend`/600 ms timeout so (b) does not push again.
   d. Back/Forward restores the previous wall; refresh keeps the wall.
6. **Tabs.** Click activates; ArrowLeft/ArrowRight move focus and activate (automatic activation); Home/End select first/last; roving `tabindex`; focus ring visible. Tab order: tabs → stage anchor → products.
7. **No scroll hijacking.** Do not attach `wheel` handlers. Vertical wheel and touch pan over the stage must scroll the page. Horizontal trackpad and touch swipe scroll the track natively; mouse users use tabs or Shift+wheel.
8. **Nudge.** Implement a single 6% scroll nudge once per session behind `const WALL_NUDGE_ENABLED = false` (owner approval pending); never when `prefers-reduced-motion`.
9. **Thread.** `WallThread` is an `aria-hidden` SVG positioned inside the scrolling track (so it moves with the panels), path crossing the panel boundary; stroke-dashoffset tied to `scrollLeft / maxScroll`; one 400 ms glow pulse when settled; reduced motion: fully drawn, static. Champagne `#B49A70`. Not interactive (`pointer-events:none`).
10. **Stage art (per the registry).** Living Inheritance panel: `AST-HOME-HERO` **only if its status is `APPROVED`**; otherwise the approved TR product primary as an editorial crop, or a typographic panel. Contemporary panel: `AST-HOME-PLATE` is `NOT_YET_SUPPLIED`, so use the existing ET-01 primary image crop or a typographic panel. **Never** use `AST-HOME-CAMP` or the earlier panorama on the stage (baked thread, non-catalogue figures, F-48). Provisional art is flagged in `RESULT.md` and makes the stage PARTIAL. `alt` text per the registry; no place, workshop or artisan claim (F-51).
11. **Living Inheritance composition** (`wallMoments.ts`; listed products only; moments with no listed product are omitted):
    - `mantle-drape` "The Mantle and the Drape": tr-01 (≈7/12 columns), tr-02 (5/12, offset down) — layout `feature-offset`.
    - `geometry` "Geometry": tr-03, tr-04 — layout `staggered-pair`.
    - `veil-print` "Veil and Print": tr-05, tr-06, tr-07 (tr-07 larger) — layout `triptych-lead-last`.
    Captions (provisional, factual, no cultural claims): "Sculpted outerwear and fluid drape.", "Tailored sets.", "Sheer layers, printed pieces and a draped dress."
    Cards reuse the existing `ProductCard` pattern and portrait crops; each shows image, title, price, category only. A new product is added by appending an id to a moment or adding a moment; no component change.
12. **Shared toolbar.** Sort (Featured, price low→high, high→low) and filters (category, colour, price; **no** craft or fibre facet on the TR wall). When any sort/filter other than "Featured/none" is active, replace moments with a single sorted list; clearing restores moments.
13. **Responsive.** Mobile: panel width 92vw, tabs full width, one-column cards with the lead card first. No horizontal overflow outside the track.
14. Add tests (§10), gate, commit.

## 8. Expected behaviour
Swiping or trackpad-scrolling the stage moves to the other wall and the URL updates; labels and arrow keys do the same; Back returns; direct URLs and refresh work; vertical scrolling is untouched; the Contemporary wall behaves exactly as before.

## 9. Data integrity, accessibility, failure
Only listed products appear; no unavailable card is clickable. Tab semantics correct; wall titles are real headings; reduced-motion = instant, thread static, no nudge. Missing art falls back to product image and is reported.

## 10. Tests
`E2E-WALL-01…06`, `E2E-ROUTE-02`, `E2E-ROUTE-03`, `E2E-RESP-01` on both walls, `E2E-A11Y-02` for the wall, `E2E-LINK-01`. Update `collections.test.tsx` (still passes for `ContemporaryWall`). For touch use CDP `Input.synthesizeScrollGesture` or touch emulation; document the method used.

## 11. Manual checks
At 1440/1024/390 with trackpad, mouse and touch: discover the second wall without instruction, switch both ways, use Back, refresh on each wall, tab to the tabs and use arrows, test reduced motion; record a screen capture.

## 12. Acceptance criteria
- `/collections` is the Contemporary wall and unchanged; `/collections/the-living-inheritance` is directly loadable and refreshable.
- Swipe/horizontal scroll switches wall and pushes the URL; Back/Forward consistent; no push loops.
- Vertical wheel/touch scroll over the stage scrolls the page.
- Tabs, arrows, Home/End work; focus visible.
- Living wall shows listed TR products in the three moments, never a uniform grid; unlisted products absent.
- Reduced-motion verified.
- No horizontal page overflow at 320–1440 px.

## 13. Evidence
Playwright report, trace for the spike tests, recordings of switching (desktop and mobile), screenshots of both walls at 3 viewports, `RESULT.md` (art status, method used for touch).

## 14. Risks and mitigation
`scrollend` support varies: debounce fallback is mandatory and tested. Scroll/route loops: guard flag and test. macOS history swipe: `overscroll-behavior-x: contain`; verify manually. Sticky header overlap with tabs: test.

## 15. Git
Create branch `stage-05-walls` from the **current head of `integration/everthread-v1`**; confirm `git status` is clean first. Commit in small logical groups with message `stage-05: <summary>`; review `git diff` before each commit and exclude unrelated files. **Do not commit to or push `main`** (a push deploys); no force-push, reset or history rewrite without owner approval. After owner approval: merge the stage branch into `integration/everthread-v1` with `--no-ff` and tag `stage-05-approved`. Record `git status`, `git log --oneline -n 10` and `git diff --stat` in `RESULT.md`.

## 16. Stop conditions
Stop if the spike gate cannot pass without capturing wheel events or hijacking scroll; if the Contemporary wall changes behaviour; if stage art would require using the panorama.

## 17. Exit gate
PASS when §12 holds and the owner has reviewed the recording. PARTIAL (art provisional) is allowed to proceed to Stage 6 only with the owner's explicit approval.

## 18. Reconciliation addendum (Revision 2)
**18.1 Asset dependencies (manifest IDs, status from `02a_ASSET_REGISTRY.csv`).** `AST-HOME-HERO` (`OWNER_APPROVAL_REQUIRED`), `AST-HOME-PLATE` (`NOT_YET_SUPPLIED`), `AST-HOME-CAMP` (`MISMATCH`, not used on the stage); card images are the approved `AST-TR*-PRI` of listed products and existing ET images.

**18.2 Data-model and route implications.** Nested routes; `wallMoments.ts`; no change to product data.

**18.3 Desktop / tablet / mobile behaviour.** Desktop and tablet: panels 88vw with ~12% peek of the next panel, tabs above, cards in asymmetric layouts. Mobile 390 px: panels 92vw, full-width tabs, one-column cards with the lead card first. No horizontal page overflow outside the track.

**18.4 Component state matrix (initial, hover, focus, active, selected, completed, loading, empty, error as applicable).** Tab: default, hover, focus-visible, selected, active (pressed). Track: idle, scrolling, settling, programmatic scroll. Panel: loading image, loaded, art-missing fallback. Moment: populated, partially populated (unlisted product omitted), empty (moment omitted). Wall products area: Featured layout, filtered/sorted list, empty result message.

**18.5 Interaction and motion contract.** Trigger: horizontal scroll/swipe (native), tab click or arrows. Sequence: native scroll to the panel; thread draws with `scrollLeft`; one 400 ms pulse on settle; product area settles 24 px / 250 ms. Easing: native scroll, then tokens. Interruption: a new scroll cancels the pending route push; programmatic scroll flagged. Reduced motion: instant jump, no pulse, thread fully drawn, no nudge. No wheel capture. Pointer, touch and keyboard parity is mandatory for every interactive control; all numeric values not established by an approved source are marked `OWNER_APPROVAL_REQUIRED` in `03_…` §9.

**18.6 Regression checks for previously working features.** Contemporary wall layout, filters, sorting and its tests; header active state; Back/Forward; search; product links.

**18.7 Source files.** Known (verified): `src/App.tsx`, `src/pages/CollectionsPage.tsx`, `src/components/Header.tsx`. To verify: how `CollectionsPage` reads filters (state vs URL) and where `ProductCard` lives. Antigravity must report the actual paths found before editing; unknown locations are not to be invented.

**18.8 Outstanding blockers and owner decisions.** O-2 and O-3 (BLOCKED — block the start), DEC D-24, art approvals, nudge approval, parameters (`03_…` §9).

**18.9 Stop condition.** Stop if the spike tests fail without capturing wheel events, the Contemporary wall changes behaviour, or stage art requires the rejected panorama.

**18.10 End-of-stage report.** Present the 8 items in roadmap §5 item 5 and request explicit owner approval. Do not start the next stage.

**18.11 Evidence-integrity table (fill with actual results only).**
| Check | Planned | Executed | Passed | Failed | Not run | Unverifiable |
|---|---|---|---|---|---|---|
| (one row per check listed in §10–§11, filled with actual results only) | | | | | | |

**18.12 Exit-criteria matrix (copy of §12, to be completed).**
| # | Exit criterion | Result (PASS/FAIL/BLOCKED) | Evidence file |
|---|---|---|---|
| 1 | `/collections` is the Contemporary wall and unchanged; `/collections/the-living-inheritance` is directly loadable and refreshable. | _to be filled by Antigravity_ | _path_ |
| 2 | Swipe/horizontal scroll switches wall and pushes the URL; Back/Forward consistent; no push loops. | _to be filled by Antigravity_ | _path_ |
| 3 | Vertical wheel/touch scroll over the stage scrolls the page. | _to be filled by Antigravity_ | _path_ |
| 4 | Tabs, arrows, Home/End work; focus visible. | _to be filled by Antigravity_ | _path_ |
| 5 | Living wall shows listed TR products in the three moments, never a uniform grid; unlisted products absent. | _to be filled by Antigravity_ | _path_ |
| 6 | Reduced-motion verified. | _to be filled by Antigravity_ | _path_ |
| 7 | No horizontal page overflow at 320–1440 px. | _to be filled by Antigravity_ | _path_ |
