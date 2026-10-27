SUPERSEDED in part — see docs/SUPERSEDED.md

# EverThread — Solution Proposal (for approval; nothing implemented)

IDs refer to `everthread_master_findings_register.md`. Source paths are real files in `src/`. Exact line numbers must be re-confirmed by the developer at implementation time. Every "regression test" below is **new** unless stated; the repo has no browser/E2E tooling today (see D-17).

## 1. Redesign versus targeted fix (D3)

| Area | Recommendation | Evidence | Preserve |
|---|---|---|---|
| Home | **Focused component redesign** of hero→Highlights transition and the scene transition (F-01, F-02) plus targeted fix of hero claims/CTA (F-13, F-26). Not a page redesign | Sections exist in approved order [S]; transitions are ordinary reveals | Section order, copy lines, hero timeline, thread SVG, all IDs |
| Cultural Archive overview | **Focused structural redesign of the overview page only** (F-03) | 14 equal tiles in a 3-column grid [SS] against Brief §8 and Spec §1 | Exhibition modal, 13 traditions, six-role mapping, IDs, legacy slugs, `weave-14` and Folio 1.1 links, diagrams, filters |
| Exhibition modal | **Targeted fixes** (focus F-08, captions F-12, opening F-04) | Modal layout is already rich and responsive [SS] | Layout, plate roles, keyboard arrows |
| Collections | **No redesign**; add "newest" only if data approved (F-17) | 7/5 asymmetric layout and flagship logic exist [S] | Everything |
| The House | **Targeted**: Story Flow scene only (F-01) | Only generic reveals [S][M] | Content |
| Commerce pages | No change beyond bug fixes | Brief §7 says conventional | Everything |

## 2. Detailed proposals (key findings)

### F-06 Lens source (CD, P1)
- **Current:** `ProductDetailPage.tsx` passes `product.macroImage || currentImage.src` to `AtelierLensModal`, so the macro image wins whenever it exists. **Expected:** Lens shows the image the visitor selected (checklist §6; Brief). **Evidence:** 5 of 6 gallery images opened the same detail image [B]. **Root cause:** precedence of `macroImage` over active image.
- **Solution:** pass the active image (the same state that renders the main image) to the Lens; if a higher-resolution variant exists for that image in `assetMap.ts`, resolve it through one helper; do not add a second selection state. **Alternative:** keep macro image as an optional first gallery plate (rejected: hides user's choice). **Risk:** images with low native resolution look soft (see F-07). **Tests:** component test for each thumbnail; browser test selects thumb N and asserts Lens `src` basename equals main image. **Acceptance:** all 6 images on ET-01 and the primary gallery of ET-02…07 match. **Approval:** none.

### F-07 Lens alignment/resolution (CD, P2)
- **Current:** viewport is 16:10 with `<img object-fit:cover>`, loupe uses `background-size = box×3.5` (stretched). Natural 1536×1024 shown at 878×522 → crop plus stretch; loupe shows 3073 px from a 1536 px source (~2×).
- **Solution:** compute loupe background from the image's *rendered* cover rectangle (natural size, scale, offset) so the loupe samples the exact pixel under the pointer; cap magnification at the point where effective source resolution drops below 1:1 and show nothing misleading; per-image alt text from the gallery data. **Tests:** pointer at 5 landmarks maps to the expected pixel (unit-tested math); visual check. **Acceptance:** loupe content matches the point under the cursor within 2 px for both landscape and portrait sources. **Approval:** none.

### F-08 Dialog focus (CD, P2)
- **Solution:** one shared focus-management helper for Lens, Exhibition and Search: focus first control on open; Tab/Shift+Tab wrap inside; Esc handled at document level while open; on close, restore focus to the opener captured at open time. No new dependency. **Tests:** keyboard E2E: open, Tab×20 stays inside, Esc closes, focus returns to the button. **Approval:** none.

### F-09 Search weave-14 (CD, P2)
- **Solution:** when a weave record has no `traditionKey`, link to its story route (`/archive/the-art-of-the-drape` for weave-14) instead of a tradition query; add a validity check so a result is built only from a resolvable destination. **Tests:** unit test over all search results asserting each destination resolves (the sweep in `runtime_checks` becomes a test). **Acceptance:** 0 dead results; weave-14 → approved route. **Approval:** none (approved link).

### F-10 Mobile overflow (CD, P2)
- **Solution:** fix each overflowing element (PDP thumbnail strip: contain with its own `overflow-x:auto` container; Archive story button: allow wrap/`max-width:100%`; Journal link: wrap; header icon cluster: reduce gap or allow shrink), then remove reliance on `body{overflow-x:hidden}` only after a 390/360/320 px sweep shows zero elements beyond the viewport. Keep intentional horizontal scrollers. **Tests:** browser test measuring `scrollWidth` and elements with `right > clientWidth` on all routes at three widths. **Approval:** none.

### F-11 ET-04 alt text (CD, P3)
- **Solution:** change displayed alt strings in `assetMap.ts` to describe the current product ("Angrakha Asymmetric Sheer Tunic — …"); leave image folder `pleated-indigo-chanderi-tunic/` and the legacy slug alias. **Test:** no alt text on any current product contains the legacy name; legacy slug still resolves.

### F-13 Home hero claims (CD, P2) — claim reconciliation
| Hero text | ET-01 canonical data | Verdict |
|---|---|---|
| "Numbered 01–64" | `edition: 'Edition of 30'` | Contradiction |
| "Fiber purity 100% Unblended" | 70% Fine Merino Wool, 30% Wild Mulberry Silk | Contradiction |
| "Mulberry Silk & Cashmere" | no cashmere in fibre data | Contradiction |
| "Pit-Loomed Jacquard" | "Pit-Loomed 2/2 Twill with Kadwa Facing" | Inconsistent |

- **Solution:** bind the hero metadata to the ET-01 record (single source of truth) so no new claim is introduced. I do not guess; if you want different copy it must come from you. **Test:** hero text equals fields from `products.ts`. **Approval:** confirm ET-01 record is canonical (Roadmap §2.3 #1 says yes).

### F-05 / D-04 Archive→product relationships (CD + PO, P1)
Data in `products.ts` vs Archive record titles:
| Tradition | Product | Support in approved data | Recommendation |
|---|---|---|---|
| Banarasi brocade | ET-01 | Weave "Pit-Loomed 2/2 Twill with Kadwa Facing" (kadwa technique) | Candidate: informational "related heirloom" link |
| Kota Doria (record "Chanderi & Kota Doria Sheer Weave") | ET-04 | Product weave "Chanderi Handloom Weave" | Candidate, wording must say Chanderi, not Kota Doria |
| Kashmiri Sozni | ET-07 | Pashmina material only; no Sozni needlework in product data | Material-level link only, or none |
| Assam Muga | ET-02 | Product is "Hand-Spun Matka Raw Silk"; not muga | **Remove association** |
- **Proposed pattern (needs approval):** replace direct "Acquire to Bag" with "View related piece" (opens the product page where size/colour are chosen), only for associations you approve; nothing auto-adds; remove stale mapping keys `chanderi` and `pashmina` (unused). **Interim safeguard (needs approval D-15):** hide the Acquire action for all four until D-04 is answered. **Tests:** Archive test asserting no purchase action for unapproved traditions; update `phase-7-3-commerce-lens` and `archive-commerce-guidance` tests, which currently assert the old behaviour.

### F-03 Archive overview redesign (UX, P2)
- **Purpose:** curated exhibition where a visitor understands the four disciplines and enters a folio, instead of scanning 14 identical tiles.
- **Proposed hierarchy (wireframe level):** (1) Intro (keep). (2) Foundational Studies as an editorial spread (keep content). (3) **Weave Library by discipline** (Weaving, Embroidery, Dyeing, Draping — existing filter data): each discipline opens with a short heading line and a 12-column asymmetric arrangement: one large feature card + smaller cards, varied sizes, no equal grid; each card keeps image, region, title, plate count, "Examine 6-plate folio". (4) Technical Diagram Library (keep). (5) Cross-link strip to Compass/House.
- **Mobile:** single column, discipline chips as horizontal scroller, large card first. **Keyboard/reduced motion:** unchanged semantics; reveals via existing hook. **Preserve:** all IDs/slugs/query links, `weave-14`, Folio 1.1, exhibition modal, filters, search. **New content needed:** none (reuses existing titles/regions); **no new cultural claims**. **Alternative A:** CSS-only retune of the grid (rejected: does not change hierarchy). **Alternative B:** full Archive redesign including modal (rejected: modal already rich, higher risk). **Test:** all 13 deep links still open; layout at 3 widths; screenshot review. **Approval:** D-03.

### F-01 Story Flow (CM, P1) — design decision required
The approved definition (Brief §7) is fixed; the storyboard that would specify frames is missing. **Smallest design decision I propose for approval (not implementing):** a *scrubbed fold* scene transition, no pinning or snapping — as a scene enters between 85% and 35% of the viewport it unfolds from a top-hinged panel (rotateX about the top edge with perspective on the container) to identity, revealing its content with the thread tracing alongside; at completion transforms are cleared (Settle) and control is already the user's (it is native scroll). Click-initiated variant: primary hero CTAs glide to the next scene with a short eased scroll. Routes: Home (Hero→Compass→Archive→Capsule), Archive (intro→Studies→Weave Library), House (chapters). Commerce pages untouched. Reduced motion: scenes appear immediately. Mobile: reduced rotation (≤6°), same sequence. Cleanup via existing GSAP context. **Alternatives:** (a) pinned panel sequences (rejected: scroll-trap risk); (b) more fades (rejected by spec). **Tests:** frame-sampling test that the transform reaches `none` and the section's top aligns within 1 px of its settled position; recordings at 1440/390; reduced-motion test. **Approval:** D-02 (and ideally the storyboard, D-01).

### F-04 Exhibition opening (II, P2)
- Implement the five steps from the Spec with existing GSAP: cover anchors, surface settles, main image reveals, five supporting views fan/stack into the asymmetric arrangement, brief champagne thread, all within ~1.2 s, skippable (Esc/close mid-sequence), reduced-motion = instant. **Test:** closing during the sequence leaves no stuck state. Depends on F-08 and approval of motion timing (D-02).

### F-12 Captions (CD + PO)
Replace filename text with approved copy; interim non-assertive fallback built only from existing metadata: `"{Tradition title} — {role label}"` (the `caption` field already generated). No history/provenance claims. List for your review is produced from the 78 plates after D-09.

## 3. Remaining findings (compact)

| ID | Proposal | Files | Tests | Approval |
|---|---|---|---|---|
| F-02 | Hero→Highlights thread hand-off refinement per storyboard; no change until D-01 | `HomePage.tsx` | recording | D-01 |
| F-14 | Keep protected timing unless you approve a shorter minimum; if approved, minimum ≤ asset-ready + short fade; reduced-motion stays 1 s | `ThreadLoader.tsx`, `App.tsx`, `thread-loader.test` | timing test | D-06 |
| F-15 | Option A keep names-only variants and relabel honestly; B supply colourway images | `ProductDetailPage.tsx`, `products.ts`, `assetMap.ts` | selection test | D-07 |
| F-16 | Keep Archive educational; no collection until data | — | — | D-05 |
| F-17 | Add "newest" only if release dates supplied | `CollectionsPage.tsx`, `products.ts` | sort test | D-12 |
| F-19 | Browser E2E for Compass: same inputs → same results; reasons shown; reset; back | `CompassPage.tsx` | E2E | none |
| F-20 | Bag UI uses `variantId`; surface add failures; decide minus at 1 | `BagPage.tsx`, `CartContext.tsx` | unit | D-13 |
| F-21 | Inline SVG icons where lacking, or text-free fallback via CSS when font fails | many | font-block test | none |
| F-22 | Mark superseded docs; list proposed edits | `docs/` | — | D-16 |
| F-23 | Review chunking/asset weight; do not change visuals | `vite.config.ts` | build log | none |
| F-24 | Open live site; run Stage 5 live checklist | — | live | user |
| F-26 | Change to "Enter the Archive" if confirmed | `HomePage.tsx` | text test | D-11 |
| F-27 | Case-insensitive lookup; optional redirect from legacy slug | `products.ts` | unit | none |
| F-28 | Clear `?tradition` on close | `ArchivePage.tsx` | E2E | none |
| F-29 | Focus ring colour with ≥3:1 on ivory (e.g. oxblood) | `main.css` | computed contrast | none |
| F-30 | Label newsletter input | `Footer.tsx` | a11y test | none |
| F-31 | Add E2E/a11y tests (see D-17); correct tests that encode wrong behaviour | `src/tests` | — | D-17 |
| F-32 | Reconcile ET-02 title vs fibre only with your input | `products.ts` | data test | D-14 |

## 4. Provisional stage outline (NOT approved)
1. **Stage 1** — F-31 baseline tests, F-06, F-09, F-11, F-13, F-26, interim guard F-05.
2. **Stage 2** — F-07, F-08, F-10, F-19, F-20, F-21, F-27–F-30.
3. **Stage 3** — F-03 overview redesign, F-12 captions, F-05 final mappings, F-04 (static parts).
4. **Stage 4** — F-01 Story Flow, F-02, F-04 motion, reduced-motion equivalents.
5. **Stage 5** — integration, regression, F-18, F-22–F-24, live verification, handover.
Dependencies: Stage 3 captions and mappings need D-04/D-09; Stage 4 needs D-01/D-02; F-14/F-15/F-16/F-17 stay on hold until decided.

## 5. Efficiency note
No new tests beyond Phase 1. This proposal reuses the v2/v3 registers; source facts for the relationship table came from one read of `products.ts` fields and the exhibition mapping.
