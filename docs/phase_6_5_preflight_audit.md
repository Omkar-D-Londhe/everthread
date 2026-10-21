# EverThread — Phase 6.5 Preflight Audit Report: Archive Monographs & Educational Diagrams

**Project:** EverThread  
**Project Directory:** `C:\Users\omkar\OneDrive\Desktop\FE Case Study`  
**Audit Timestamp:** October 21, 2026 — 21:05 IST  
**Audit Mode:** STRICT READ-ONLY AUDIT — NO IMPLEMENTATION CHANGES  
**Authoritative Guidelines:** `EverThread_Remaining_Project_Roadmap.md` & Prior Phase Reports  
**Deliverable File:** `phase_6_5_preflight_audit.md`  

---

## 1. Executive Summary

### 1.1 Objective & Scope
This preflight audit evaluates the current state of the **Cultural Archive** (`/archive`), individual **Archive Monograph Folios** (`/archive/:storySlug`), the **Immersive Textile Exhibition** modal (`TraditionExhibitionModal.tsx`), and the nine **Educational Weave Diagrams** in the EverThread codebase before Phase 6.5 implementation begins.

The purpose of this audit is to:
1. Establish the actual working-tree baseline of the Archive experience.
2. Verify that the completed 13-tradition, 6-plate exhibition gallery remains intact and robust.
3. Assess the storytelling coherence between foundational monograph folios and the Weave Library.
4. Audit the technical diagrams, their contextual associations, accessibility, and fallback mechanisms.
5. Identify genuine defects, unrendered ligatures, missing links, or mobile captioning gaps.
6. Provide an authoritative classification matrix and define the minimal safe scope for Phase 6.5B.

### 1.2 Overall Assessment
The EverThread Archive architecture is mature, stable, and visually compelling:
- **13-Tradition Exhibition Gallery:** Fully operational with all 78 canonical WebP plates ($13 \times 6$) and 260 responsive variants. The adaptive stage plinth (`object-fit: contain` on ivory surface `#fef9f0`) handles landscape exceptions (e.g. Banarasi $1536 \times 1024$ and Bandhani $1374 \times 1145$) without cropping.
- **Nine Technical Diagrams:** All 9 SVGs and matching PNG fallbacks are present on disk, load reliably, and feature runtime fallback handling.
- **Foundational Monograph Folios:** All 4 deep folios (`the-living-loom`, `the-art-of-the-drape`, `the-language-of-the-surface`, `the-architecture-of-a-garment`) are rendered with technical drafting tables, academic citations, and valid related product recommendations.
- **Verification Baseline:** 234 passing tests across 12 suites, 0 TypeScript compilation errors, and clean production build in 3.27 seconds.

### 1.3 Key Deficiencies & Opportunities Identified
1. **Unrendered Font Ligature in `ArchiveStoryPage.tsx`:** The 404/not-found state on `/archive/:storySlug` renders `<span className="material-symbols-outlined">auto_stories</span>`. If webfonts stall or fail, it displays the raw word "auto_stories".
2. **Storytelling Disconnect Between Folios and Exhibition:** The 4 deep monograph folios on `/archive/:storySlug` do not provide any link or action to launch the 6-plate exhibition modal for their corresponding traditions (e.g. Folio 1.1 does not link to the Banarasi Brocade exhibition).
3. **`weave-14` Dead-End Card:** Unlike the 13 traditions which provide a "6 Plates" badge and "Examine 6-Plate Folio" CTA, `weave-14` ("Uncut Radial Bias Draping") has no action button and no link to Folio 1.2 ("The Art of the Drape").
4. **Mobile Captioning Loss:** On mobile viewports ($\le 767$px), the exhibition stage caption hides the descriptive alt text (`d-none d-md-inline`), displaying only the generic role label (e.g. "Weave Detail") without explaining what the plate actually shows.
5. **Generic Diagram Drawer Text:** When the diagram drawer is opened inside `TraditionExhibitionModal`, a single hardcoded generic sentence is displayed for all diagrams, rather than explaining the specific mechanics of the active technical schematic.
6. **Hero Introduction Omits 6-Plate Suites:** The Archive overview hero introduces the 4 folios and the Weave Library, but does not inform visitors that the Weave Library contains an interactive 6-plate photographic exhibition suite.

### 1.4 Recommendation
**SCOPED GO**: Proceed with Phase 6.5 under a tightly bounded scope. Address the identified defects (icon ligature hardening, mobile caption visibility, folio-to-exhibition cross-links, `weave-14` link to Folio 1.2, and diagram-specific curatorial descriptions) while strictly protecting existing tradition IDs, slugs, canonical products, and diagrams.

---

## 2. Current Implementation Inventory

| Module / Asset Layer | Source File(s) | Verified Working Tree State | Status |
|---|---|---|---|
| **Archive Overview Page** | `src/pages/ArchivePage.tsx` | Renders hero header, 4 monograph cards, distinction filter tabs (`all`, `weaving`, `embroidery`, `dyeing`, `draping`), 14 Weave Library cards, diagram viewer, and transparent curatorial footer. | Protected & Active |
| **Deep Monograph Page** | `src/pages/ArchiveStoryPage.tsx` | Dynamic route `/archive/:storySlug` rendering breadcrumbs, chapter/folio header, primary specimen image, curatorial prose, drafting parameters table, citations, adjacent folio stepper, and related product cards. | Protected & Active |
| **Exhibition Modal** | `src/components/TraditionExhibitionModal.tsx` | Museum-grade modal dialog featuring adaptive stage plinth, champagne thread SVG animation, stage chevrons, 5 supporting plates column (desktop/tablet), mobile horizontal strip, and focus trap. | Protected & Active |
| **Tradition Asset Catalogue** | `src/data/assetMap.ts` | Complete 6-role mappings for 13 traditions (78 base WebP + 260 variants). Configures roles `model-01` through `process-06`. | Protected Invariant |
| **Educational Diagrams** | `public/images/weave-library/diagrams/` | 9 SVGs and 9 matching PNG fallbacks in `/fallback/`. Referenced via `DIAGRAM_ASSETS` in `assetMap.ts`. | Protected Invariant |
| **Archive Stories & Weaves** | `src/data/stories.ts` | 4 foundational studies (`STORIES`) and 14 Weave Library items (`WEAVE_LIBRARY`). | Protected Invariant |
| **Animation & Layout Styles** | `src/styles/animations.css` & `src/styles/main.css` | Backdrop blur, stage containment, diagram drawer slide, mobile strip scroll, and `@media (prefers-reduced-motion: reduce)` rules. | Protected & Active |

---

## 3. Audit A — Archive Monograph Storytelling Findings

### 3.1 Tradition Accuracy & Description Quality
All 14 items in `WEAVE_LIBRARY` were inspected against their craft distinctions, technical parameters, and image bindings:
- **Accuracy:** Craft distinctions are rigorously partitioned: 8 weaving traditions, 2 embroidery traditions, 3 resist-dyeing traditions, and 1 bias draping study.
- **Technical Grounding:** Each record includes precise fiber composition, loom sett / structure specifications, and tactile structural profiles.
- **Image Association:** Every tradition's card displays its verified macro craft photograph (`macro-05.webp`) as its cover specimen, establishing immediate tactile connection to the textile's physical reality.

### 3.2 Archive Introduction & Navigation Guidance
- **Current Observation:** The hero section on `/archive` introduces the "Curatorial Exhibition Series • Volume I" and provides two anchor jump buttons:
  - `Explore Exhibition Folios (1.1 – 1.4)` -> jumps to `#folios`
  - `Technical Weave Library & Diagrams` -> jumps to `#weave-library`
- **Deficiency:** The hero copy does not explain how to interact with the 13 textile traditions. A visitor reading the header has no indication that the Weave Library cards expand into full-screen 6-plate photographic exhibitions with technical schematics until they scroll down to the cards.
- **Safe Improvement:** Add a concise explanatory line or badge in the hero introducing the 13-Tradition 6-Plate Archival Suites.

### 3.3 Six Image Role Identification & Communication
The six image roles established in Phase 6.3.2.2 follow an architectural progression:
1. `model-01` — Primary Silhouette / Model Portrait
2. `model-02` — Alternate Silhouette / Model View
3. `drape-03` — Anatomic Drape & Gravitational Fall
4. `stilllife-04` — Folded Textile Still Life Object
5. `macro-05` — Microscopic Weave, Fiber & Surface Relief
6. `process-06` — Artisanal Making, Looms & Botanical Vats

**Findings:**
- **Unused Purpose Metadata:** In `src/data/assetMap.ts`, `TRADITION_ROLE_CONFIG` defines an educational `purpose` string for each role (e.g. `stilllife-04`: "Material arranged as an object", `process-06`: "Tools, process, or making context"). This metadata is attached to `rolesRecord[roleKey]` as `item.purpose`, but is **never rendered anywhere in the UI**.
- **Mobile Alt Text Stripping:** On mobile screens ($\le 767$px), `.exhibition-stage-caption` applies `d-none d-md-inline` to `— {activeItem?.alt}`. Consequently, mobile users see only the role name ("Process & Making") without knowing what the photo depicts (e.g. "Subterranean pit-loom in Madanpura weaving gold zari").
- **Desktop Stage Caption:** Displays `Plate N of 6`, the role label, and the alt text cleanly.

### 3.4 Cross-Linking & Interactive Continuity Gaps
1. **Monograph Folio to Exhibition Disconnect:**
   - On `/archive/:storySlug`, reading a foundational study (e.g. Folio 1.1 "The Living Loom") provides deep context on Varanasi Kadwa brocades.
   - However, the folio page contains **no link or button to launch the Varanasi Kadwa 6-plate exhibition modal** (`/archive?tradition=banarasi-brocade`).
   - Adding a contextual CTA button ("Launch 6-Plate Exhibition: Varanasi Kadwa") in the folio sidebar or footer would seamlessly unify the monograph and exhibition layers.
2. **`weave-14` Dead-End Card:**
   - In the Weave Library, cards for items 1–13 feature an interactive "6 Plates" badge and "Examine 6-Plate Folio" button.
   - `weave-14` ("Uncut Radial Bias Draping") is a pan-cultural draping study that does not have a 6-image folder. Because `item.traditionKey` is undefined, the card renders no action button at all.
   - It directly corresponds to Folio 1.2 "The Art of the Drape".
   - Adding a CTA button ("Read Foundational Folio 1.2") linking to `/archive/the-art-of-the-drape` resolves the appearance of a dead-end card.

### 3.5 Legacy Slugs & Identifier Invariant Analysis
- `weave-05` retains `slug: 'kutch-ari-embroidery'`, but displays `title: 'Lucknow Chikankari Needlework'` and maps to `traditionKey: 'chikankari'`.
- `weave-02` retains `slug: 'chanderi-handloom'`, but displays `title: 'Chanderi & Kota Doria Sheer Weave'` and maps to `traditionKey: 'kota-doria'`.
- **Audit Conclusion:** These mismatches are internal identifier artifacts from earlier stages preserved to protect existing unit test bindings (`src/tests/tradition-exhibition.test.tsx`). The visitor sees the correct editorial title in the UI, and URL queries use `tradition=chikankari`. **These slugs must NOT be modified in Phase 6.5.**

---

## 4. Audit B — Educational Diagrams Findings

### 4.1 Diagram Inventory & Content Analysis
Nine educational diagrams are defined in `DIAGRAM_ASSETS` in `src/data/assetMap.ts`. All 9 SVGs and 9 PNG fallbacks were verified on disk in `public/images/weave-library/diagrams/`:

| Diagram ID | Title | Depicted Subject & Technical Focus | Associated Traditions |
|---|---|---|---|
| `library-block-printing-process-01` | Block Printing Process | 16-stage relief block carving, mordant fixation, dabu mud resist, and vat immersion. | `ajrakh`, `bagru` |
| `library-double-ikat-process-01` | Double Ikat Process | Independent tie-dye calculation on warp and weft; perpendicular intersection mechanics. | `patan-patola`, `pochampally-ikat` |
| `library-embroidery-weaving-comparison-01` | Embroidery Weaving Comparison | Structural cross-section contrasting loom-integrated yarn structures with needlework surface relief. | `chikankari`, `kashmiri-sozni` |
| `library-garment-construction-01` | Garment Construction | Pattern anatomy, double rhombus underarm gussets, French seams, and zero-fusible tailoring. | *None (General Study)* |
| `library-resist-dyeing-process-01` | Resist Dyeing Process | Nakhla fingernail pinching, continuous thread binding, and localized color resist points. | `bandhani` |
| `library-technique-comparison-01` | Technique Comparison | Comparative analysis of discontinuous tapestry weft interlocking (dhada) vs. continuous brocade shuttles. | `paithani-silk` |
| `library-textile-to-garment-sequence-01` | Textile To Garment Sequence | Chronological atelier flow: raw sericulture/cotton -> hand-spinning -> warp dressing -> loom weaving -> pattern assembly. | *None (General Study)* |
| `library-textile-vocabulary-01` | Textile Vocabulary | Structural taxonomy diagram illustrating warp, weft, selvedge, bias grain, and diagonal stretch. | *None (General Study)* |
| `library-warp-weft-diagram-01` | Warp Weft Diagram | Fundamental perpendicular yarn interlacing on handloom reed and heddle frames. | `banarasi-brocade`, `kanchipuram-silk`, `kota-doria`, `muga-silk`, `sambalpuri-ikat` |

### 4.2 Diagram Contextualization Deficiencies
1. **Generic Boilerplate in Exhibition Drawer:**
   In `TraditionExhibitionModal.tsx`, when the drawer is toggled, it renders:
   ```tsx
   <p className="body-sm text-muted-editorial mb-0">
     Archival educational schematic illustrating foundational weave geometry and thread interlacing taxonomy, presented as an academic craft reference for comparative textile analysis.
   </p>
   ```
   This exact identical paragraph is displayed for *every* diagram. A visitor inspecting the Patan Patola double-ikat diagram receives no explanation of why independent warp/weft tie-dyeing creates razor-sharp geometric alignment.
2. **Missing Curatorial Notes in Overview Visualizer:**
   On `/archive`, the bottom visualizer allows selecting any of the 9 diagrams via a `<select>` dropdown, but renders zero descriptive text beyond the selected title.
3. **Absence of Diagrams on Monograph Folios:**
   On `/archive/the-architecture-of-a-garment` (Folio 1.4), the entire article discusses interior tailoring anatomy, yet `library-garment-construction-01` is not embedded or linked. Similarly, Folio 1.2 ("The Art of the Drape") could directly reference `library-textile-vocabulary-01`.

### 4.3 Fallback & Interaction Reliability
- **SVG-to-PNG Fallback:** Tested and verified. Both `ArchivePage.tsx` and `TraditionExhibitionModal.tsx` include `onError` handlers that automatically rewrite `.src` to `.fallbackPng` if the vector file fails to render.
- **State Preservation:** In `TraditionExhibitionModal.tsx`, opening and closing the diagram drawer does not reset the selected image plate, tradition, or zoom state.
- **Escape Key Handling:** Pressing `Escape` while the diagram drawer is open closes the drawer first (`setShowDiagram(false)`), keeping the exhibition modal open. Pressing `Escape` a second time closes the exhibition modal.
- **Distinction from Photography:** The diagram container features a stark white `#ffffff` canvas with clean borders and drafting typography, distinctly differentiated from the ivory `#fef9f0` photographic stage plinth.

---

## 5. Audit C — Visual and Responsive Quality Findings

Automated browser traversal using Chrome DevTools Protocol was executed against the local production build (`http://localhost:4173`). All 12 screenshots were captured and visually verified.

| # | Screenshot Filename | Viewport | Target Route / State | File Size | Key Observations |
|---|---|---|---|---|---|
| 1 | `01_archive_overview_desktop_1440x900.png` | 1440 × 900 | `/archive` — Hero & Folio 1.1 | 216.5 KB | Clean serif hero, alternating 16:10 folio cards, sharp typography, zero horizontal overflow. |
| 2 | `02_archive_overview_tablet_1024x768.png` | 1024 × 768 | `/archive` — Tablet Overview | 81.1 KB | Responsive 2-column Weave Library grid, clean card padding, legible metadata tags. |
| 3 | `03_archive_overview_mobile_390x844.png` | 390 × 844 | `/archive` — Mobile Overview | 63.2 KB | Single-column cards stack naturally; filter pills scroll smoothly; touch targets $\ge 44$px. |
| 4 | `04_monograph_story_desktop_1440x900.png` | 1440 × 900 | `/archive/the-living-loom` | 874.8 KB | Breadcrumbs intact; high-res primary specimen; drafting specs table; citations; related waistcoat card. |
| 5 | `05_tradition_exhibition_opening_desktop_1440x900.png` | 1440 × 900 | `/archive?tradition=banarasi-brocade` | 1111.9 KB | Dominant adaptive stage; Banarasi landscape model ($1536 \times 1024$) fits ivory plinth without cropping; 5 supporting views column on right. |
| 6 | `06_tradition_exhibition_drape_desktop_1440x900.png` | 1440 × 900 | Modal — Drape Role (`drape-03`) | 1367.2 KB | Instant promotion of Plate 03 to stage; active thumb card highlighted with 2px oxblood border. |
| 7 | `07_tradition_exhibition_macro_desktop_1440x900.png` | 1440 × 900 | Modal — Macro Role (`macro-05`) | 1567.4 KB | Microscopic zari weave shown in high fidelity; champagne thread trace visible at plinth base. |
| 8 | `08_tradition_exhibition_diagram_drawer_desktop_1440x900.png` | 1440 × 900 | Modal — Diagram Drawer Open | 1433.5 KB | 480px drawer slides over stage from right; Warp/Weft diagram displayed cleanly with close button. |
| 9 | `09_diagram_library_viewer_desktop_1440x900.png` | 1440 × 900 | `/archive` — Bottom Diagram Visualizer | 677.1 KB | Double Ikat Process SVG rendered in white display box; dropdown selector fully functional. |
| 10 | `10_tradition_exhibition_mobile_390x844.png` | 390 × 844 | Modal — Mobile Exhibition | 190.8 KB | Supporting column hidden; horizontal thumbnail strip with touch targets $\ge 58 \times 52$px; stage chevrons accessible. |
| 11 | `11_tradition_exhibition_mobile_diagram_390x844.png` | 390 × 844 | Modal — Mobile Diagram Drawer | 87.9 KB | Drawer occupies 90vw; diagram scales without horizontal scroll; close button reachable. |
| 12 | `12_tradition_exhibition_tablet_1024x768.png` | 1024 × 768 | Modal — Tablet Exhibition (Patan Patola) | 474.5 KB | Supporting column narrowed to 260px; Patan Patola portrait model centered with room to breathe. |

All captured screenshots are stored permanently in `artifacts/phase-6-5/`.

---

## 6. Content-Integrity Concerns Requiring Verification

All descriptive text, citations, and metadata in `src/data/stories.ts` and `src/data/assetMap.ts` were audited against project integrity standards:

1. **Numerical & Density Claims:**
   - As verified during Phase 6.3.2.2.3, arbitrary numerical sett measurements (e.g. `180 TPI`, `190 TPI`) were previously replaced with neutral, defensible craft descriptions:
     - `Traditional Handloom Sett`
     - `Traditional Khat Square Open Sett`
     - `Balanced Double-Ikat Plain-Weave Sett`
     - `Heavyweight Triple-Ply Handloom Sett`
   - **Finding:** No unverified numeric warp density or laboratory thread count claims remain.
2. **Purity Claims:**
   - Previous claims asserting unverified "100% Pure Mulberry Silk" were replaced with neutral terminology ("Traditional Handloom Silk", "Traditional Gaji Silk", "Fine Filature Silk").
   - **Finding:** No unsubstantiated metallurgical or biochemical purity claims remain.
3. **Illustrative Personas & Simulated Locations:**
   - In `STORIES`, all illustrative artisan personas (`Maqbool Hasan`, `Claire Vance`, `Kutch Artisanal Guild`) and conceptual workshop addresses (Paris Rue de Rivoli) are explicitly marked with `isPersonaIllustrative: true` and documented under `unsupportedClaims`.
   - The UI explicitly renders an "Illustrative Guild Persona" badge and editorial disclaimer box.
   - **Finding:** Complete transparency is maintained; no fictional claims are presented as authenticated historical fact.

---

## 7. Existing Defects & Missing Functionality Summary

| # | Item | Location | Defect Type | Severity | Recommended Correction |
|---|---|---|---|---|---|
| 1 | `auto_stories` Font Ligature | `src/pages/ArchiveStoryPage.tsx`:19 | Fragile font ligature string | Low / Visual | Replace `<span className="material-symbols-outlined">auto_stories</span>` with an inline SVG open book icon (`aria-hidden="true"`). |
| 2 | Mobile Alt Text Stripping | `src/components/TraditionExhibitionModal.tsx`:385 | Accessibility / Editorial loss | Medium | On viewports $\le 767$px, render a compact descriptive subtitle or expose `activeItem.alt` so mobile visitors understand what each plate depicts. |
| 3 | Unused Plate Purpose Metadata | `src/data/assetMap.ts` / `TraditionExhibitionModal.tsx` | Missing editorial feature | Low | Render `roleItem.purpose` in the desktop supporting view cards or caption plinth to articulate the photographic role. |
| 4 | Disconnected Monograph Folios | `src/pages/ArchiveStoryPage.tsx` | Navigation disconnect | Medium | Add an "Examine 6-Plate Exhibition" CTA button linking to `/archive?tradition={key}` for corresponding traditions. |
| 5 | `weave-14` Dead-End Card | `src/pages/ArchivePage.tsx`:312 | Incomplete interaction | Low | Add an action button linking `weave-14` to Folio 1.2 "The Art of the Drape" (`/archive/the-art-of-the-drape`). |
| 6 | Generic Diagram Drawer Description | `src/components/TraditionExhibitionModal.tsx`:487 | Repetitive boilerplate | Low | Add a `description` field to `DIAGRAM_ASSETS` so that each diagram in the drawer and bottom visualizer displays specific technical commentary. |
| 7 | Archive Hero Exploration Guidance | `src/pages/ArchivePage.tsx`:76 | Missing visitor onboarding | Low | Add a brief sentence in the hero copy noting that each of the 13 traditions features a comprehensive 6-plate photographic folio. |

---

## 8. Classification Matrix of Proposed Phase 6.5 Items

| Proposed Item | Area | Classification | Justification & Architectural Boundary |
|---|---|---|---|
| **1. Icon Ligature Hardening (`auto_stories`)** | `ArchiveStoryPage.tsx` | **REQUIRED** | Eliminates the final remaining Material Symbols font ligature string in the Archive routes, matching Phase 6.4 icon hardening standards. |
| **2. Mobile Caption & Image Description Polish** | `TraditionExhibitionModal.tsx` | **REQUIRED** | Mobile users currently only see role names ("Weave Detail") without any image description. Must be exposed cleanly without causing layout shift. |
| **3. `weave-14` Link to Folio 1.2** | `ArchivePage.tsx` | **REQUIRED** | Removes the perception of a dead-end un-interactive card by linking it to its corresponding deep monograph. |
| **4. Diagram-Specific Curatorial Descriptions** | `assetMap.ts`, `TraditionExhibitionModal.tsx`, `ArchivePage.tsx` | **OPTIONAL** | Replaces generic boilerplate with authentic educational descriptions explaining what each schematic actually depicts. |
| **5. Monograph-to-Exhibition Cross-Linking** | `ArchiveStoryPage.tsx` | **OPTIONAL** | Connects deep folios to their corresponding 6-plate traditions (e.g. Folio 1.1 -> Banarasi Brocade). Highly cohesive. |
| **6. Hero Copy Guidance Polish** | `ArchivePage.tsx` | **OPTIONAL** | Briefly informs visitors that Weave Library cards open interactive 6-plate suites. |
| **7. Scroll-Driven Image Parallax on Folios** | `ArchivePage.tsx`, `animations.css` | **OPTIONAL** | Subtle CSS-driven parallax for monograph cover images. MUST strictly disable under `prefers-reduced-motion: reduce`. |
| **8. Renaming Legacy Slugs / IDs** | `stories.ts`, `assetMap.ts` | **BLOCKED / PROHIBITED** | Modifying `kutch-ari-embroidery` or `chanderi-handloom` will break existing unit tests and deep links. |
| **9. Redrawing or Generating New Diagrams** | `public/images/weave-library/diagrams/` | **BLOCKED / PROHIBITED** | All 9 diagrams are approved. No new SVGs or AI-generated replacements are permitted. |
| **10. Modifying Product Data or Pricing** | `products.ts`, `assetMap.ts` | **BLOCKED / PROHIBITED** | Products `ET-01` through `ET-07` are frozen invariants. |

---

## 9. Exact Files Likely to Need Changes in Phase 6.5B

1. `src/data/assetMap.ts`:
   - Enhance `DIAGRAM_ASSETS` records with an authentic `description` field for each of the 9 schematics.
2. `src/pages/ArchivePage.tsx`:
   - Add action button on `weave-14` card linking to `/archive/the-art-of-the-drape`.
   - Update bottom diagram visualizer to render `activeDiagram.description`.
   - Refine hero paragraph slightly to introduce the 13-tradition 6-plate suites.
3. `src/pages/ArchiveStoryPage.tsx`:
   - Replace `<span className="material-symbols-outlined">auto_stories</span>` with inline SVG open book icon.
   - Add cross-link CTA button to the corresponding 6-plate tradition exhibition when applicable.
4. `src/components/TraditionExhibitionModal.tsx`:
   - Display diagram-specific description in the drawer (`linkedDiagram.description`).
   - Render plate description/alt text cleanly on mobile viewports.
5. `src/styles/animations.css`:
   - Subtle parallax or transition refinements for monograph cards, with full `prefers-reduced-motion: reduce` overrides.
6. `src/tests/editorial-archive.test.tsx` / `src/tests/tradition-exhibition.test.tsx`:
   - Add unit tests verifying cross-linking, diagram descriptions, and icon hardening.

---

## 10. Regression Risks & Test Recommendations

| Risk | Likelihood | Impact | Mitigation Strategy |
|---|---|---|---|
| **Legacy Slug Breakage** | Medium | High | Do NOT change `slug` or `traditionKey` values. Keep `kutch-ari-embroidery` and `chanderi-handloom` exactly as defined. |
| **Mobile Overflow in Drawer or Strip** | Medium | High | Ensure any mobile caption or description additions do not exceed container bounds or introduce horizontal page scrollbars. |
| **Modal Focus Trap Disruption** | Low | High | Ensure new CTA buttons or links inside the modal or folios maintain correct `tabIndex` and focus management. |
| **Reduced-Motion Violations** | Low | Medium | Enforce `@media (prefers-reduced-motion: reduce)` across any new transition or parallax rules. |

---

## 11. Verification Baseline Metrics

- **TypeScript Compilation (`npx tsc --noEmit`):**
  - Exit Code: `0` (Zero type errors)
- **Vitest Suite (`npm test -- --run`):**
  - Exit Code: `0`
  - Suites: 12 passed (12)
  - Tests: **234 passed (234)**
  - Execution Duration: 6.72s
- **Vite Production Build (`npm run build`):**
  - Exit Code: `0`
  - Duration: **3.27s**
  - Output Assets:
    - `dist/index.html`: 2.23 kB
    - `dist/assets/index-BZ5cgnA4.css`: 287.22 kB (gzip: 40.71 kB)
    - `dist/assets/index-wW1pl3SS.js`: 646.88 kB (gzip: 171.98 kB)

---

## 12. Recommendation & Sign-Off

### 12.1 Recommendation: SCOPED GO
The EverThread Cultural Archive and Immersive Textile Exhibition are architecturally complete, high-performing, and thoroughly verified. We recommend proceeding to **Phase 6.5B** under a strictly bounded scope:
1. Harden the final `auto_stories` ligature in `ArchiveStoryPage.tsx`.
2. Connect `weave-14` to Folio 1.2 and add reciprocal links between folios and 6-plate exhibitions.
3. Replace generic diagram drawer boilerplate with diagram-specific curatorial descriptions.
4. Improve mobile stage caption visibility to prevent image context loss.
5. Strictly preserve all existing tradition IDs, slugs, canonical products, and diagrams.

**Official Status:** **SCOPED GO**
