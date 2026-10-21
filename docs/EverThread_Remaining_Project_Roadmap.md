# EverThread --- Remaining Project Roadmap

**Roadmap version:** 1.0\
**Date:** 21 October 2026\
**Project directory:** `C:\Users\omkar\OneDrive\Desktop\FE Case Study`\
**Status:** Planning contract for the remaining phases; no application
changes authorized by this document alone.

------------------------------------------------------------------------

## 1. Purpose

This roadmap organizes the remaining work after completion of the
immersive textile exhibition and its visual/content correction passes.
It preserves the established EverThread direction and the previously
agreed remaining phases:

-   **Phase 6.4 --- Smooth Compass & Product Detail Interactions**
-   **Phase 6.5 --- Cultural Archive Exhibition Polish**
-   **Phase 6.6 --- Final Verification, Performance & Accessibility
    Gate**

The phases must be executed in order, one at a time. Review each phase's
report and evidence before approving the next phase. Do not combine all
remaining phases into one implementation run.

This is a planning and acceptance document. It does not authorize
implementation until the user approves the specific phase prompt.

## 2. Project state and protected decisions

### 2.1 Completed work, based on reported results

The following work has been reported as implemented and verified:

-   React + TypeScript + Vite single-page application, React Router,
    shared state, and agreed route structure.
-   Seven canonical products and their approved catalogue records.
-   Collections, Product Detail, Thread Compass, Saved Pieces, Bag, and
    simulated Checkout.
-   Homepage editorial redesign and asymmetric Collections layout.
-   Shared design system and restrained motion system.
-   Approved watercolor-hand ThreadLoader and separate SVG thread motif.
-   Archive, The House, Journal, and individual editorial routes.
-   Six image roles for each of 13 textile traditions and the immersive
    exhibition gallery.
-   Visual polish covering icon rendering, mobile overflow, image-stage
    sizing, thread placement, and wording corrections.
-   Catalogue-wide audit replacing unsupported numerical/material
    claims.
-   Most recent reported checks: 228 tests passing, TypeScript clean,
    and production build successful.

These results are reports from the working environment, not a fresh
independent execution in this document. Each remaining phase must rerun
the relevant checks.

### 2.2 Brand and experience principles

-   Brand: EverThread, contemporary heritage luxury.
-   Brand lines: "An heirloom, not a trend." and "Every thread carries a
    story."
-   Narrative spine: **Thread → Textile → Craft → Garment → Story**.
-   Palette: warm ivory `#FEF9F0`, oxblood `#49232D`, espresso
    `#30231F`, champagne `#B49A70`, with warm stone/taupe.
-   Typography: Playfair Display for editorial headlines and Hanken
    Grotesk for body/UI.
-   Visual language: editorial asymmetry, tactile imagery, generous
    whitespace, restrained rules, quiet luxury, purposeful motion.
-   Motion arc: **Initiate → Glide → Settle**.
-   Commerce pages should remain quick, legible, and conventional enough
    to use comfortably. Motion must not impede reading or task
    completion.

### 2.3 Hard invariants

Do not change any of the following without explicit user approval:

1.  Product IDs ET-01 through ET-07, product slugs, titles, prices,
    editions, colourways, and approved primary asset bindings.
2.  Thread Compass's deterministic, transparent, attribute-grounded
    matching/scoring behavior.
3.  Bag and Saved Pieces persistence, item merge behavior, quantity
    controls, counts, and totals.
4.  Checkout's frontend-only demo status. Do not add payment processing,
    collect real card details, or imply a real order was placed.
5.  The approved ThreadLoader, its artwork, timing, styles, tests, and
    initial-load-only lifecycle.
6.  Six-role mapping for all 13 textile traditions, legacy
    tradition/story identifiers, and `weave-14` as a separate general
    monograph.
7.  Archive routes, filters, story links, and the approved immersive
    exhibition interactions.
8.  Reduced-motion support, keyboard access, focus management, and the
    no-scroll-trapping principle.
9.  Existing local assets and original source materials. Do not delete
    or overwrite originals.
10. No new dependencies unless the existing approved stack is
    demonstrably insufficient and the user approves the addition.

### 2.4 Content integrity rules

-   Do not invent artisan partnerships, provenance, fibre composition,
    precious-metal purity, laboratory measurements, manufacturing
    statistics, sustainability claims, or cultural/historical
    assertions.
-   Specific claims must be supported by approved project sources. If
    they cannot be substantiated, use neutral wording rather than
    inventing a replacement fact.
-   Keep distinctions between techniques accurate; for example, resist
    dyeing, block printing, embroidery, weaving, and garment draping are
    not interchangeable.
-   Preserve existing verified citations and image credits.
-   Automated tests can prevent known claim patterns from returning but
    do not prove that every descriptive phrase is historically correct.

------------------------------------------------------------------------

## 3. Execution model

Each phase follows this loop:

1.  **Inspect:** Read the relevant source files, current working-tree
    changes, existing tests, and prior phase report. Do not assume the
    repository is identical to an earlier snapshot.
2.  **Bound:** Confirm the requested scope and protected files before
    editing.
3.  **Implement:** Make the smallest coherent set of changes needed for
    that phase.
4.  **Verify:** Run targeted tests, the full suite, TypeScript, and
    production build as required.
5.  **Inspect visually:** Capture real browser screenshots at stated
    viewport sizes and open/inspect them where tooling permits. Do not
    equate screenshot generation with visual review.
6.  **Report:** Record files changed, actual commands/results,
    screenshot paths, limitations, and unresolved issues.
7.  **Stop:** Do not start the next phase until the user reviews and
    approves the current phase.

If a requested improvement conflicts with a protected invariant, stop
and explain the conflict rather than silently weakening the invariant.

------------------------------------------------------------------------

## 4. Phase 6.4 --- Smooth Compass & Product Detail Interactions

### Objective

Make the consultation and product-inspection interactions feel more
fluid without changing their underlying behavior or adding decorative
motion for its own sake.

### Scope A --- Thread Compass

-   Inspect the current Compass flow, step state, progress indicator,
    keyboard behavior, and `prefers-reduced-motion` handling.
-   Replace abrupt step changes with restrained horizontal slide/fade
    transitions.
-   Evolve the progress indicator into a champagne-thread motif that
    lengthens or advances as the visitor progresses.
-   Ensure the current step remains readable and the transition does not
    cause distracting layout shifts.
-   Keep previous/next navigation, answer state, backtracking, and final
    results intact.
-   Keep matching deterministic and based on the existing attributes and
    scoring rules.
-   Do not add new questions, scoring dimensions, arbitrary fallback
    recommendations, or product data.

### Scope B --- Product Detail

-   Inspect the current product gallery, image loading, variant controls
    where supported, accordions, Save Piece, and Add to Bag.
-   Add restrained image cross-dissolves when changing gallery images.
-   Add accessible accordion open/close transitions that do not conceal
    content or delay use.
-   Preserve image aspect ratios and approved focal points. Avoid crop
    regressions on ET-03 and ET-04.
-   Preserve all product information, prices, slugs, image bindings,
    Save Piece behavior, and Add to Bag behavior.
-   Keep interactions functional without hover and on touch devices.

### Accessibility and motion

-   Respect `prefers-reduced-motion: reduce`; transitions should become
    instant or otherwise non-animated while preserving state changes.
-   Keep focus visible and logical throughout transitions.
-   Do not trap scrolling, delay keyboard input, or require animation to
    understand progress.
-   Ensure transitions clean up correctly when a step changes, a route
    changes, or a component unmounts.
-   Avoid unnecessary GSAP timelines if existing CSS/React patterns can
    do the job cleanly.

### Likely areas to inspect

-   `src/pages/CompassPage.tsx`
-   `src/pages/ProductDetailPage.tsx`
-   Existing animation styles and design tokens
-   Compass matcher and its tests
-   Product detail and gallery tests

These are inspection targets, not permission for broad refactoring.
Verify actual paths in the repository before editing.

### Acceptance criteria

-   Compass choices, back/forward movement, progress, and final
    recommendations behave exactly as before.
-   Matcher code and scoring semantics are unchanged.
-   Product gallery images switch reliably and retain correct aspect
    ratios.
-   Accordions remain accessible and work by keyboard, pointer, and
    touch.
-   Reduced-motion mode suppresses nonessential movement.
-   No console errors, stuck transitions, focus loss, or layout shifts
    are observed in tested states.
-   All seven product records, prices, slugs, and asset mappings remain
    unchanged.
-   Full tests, TypeScript, and production build pass.

### Required visual QA

Capture and inspect at minimum: - Desktop: `1440 × 900` - Intermediate:
`1024 × 768` - Mobile: `390 × 844`

Capture the Compass at an initial step, a middle step, and the results
state. Capture Product Detail before and after gallery changes, with an
accordion open, and with reduced motion enabled. If any requested state
cannot be tested, report it explicitly.

### Deliverable

`phase_6_4_compass_product_interaction_report.md`

Include summary, changed files, proof that matching and commerce logic
were preserved, exact test/type/build results, screenshot paths,
reduced-motion findings, and unresolved limitations.

### Stop condition

Finish Phase 6.4 and stop. Do not start Phase 6.5.

------------------------------------------------------------------------

## 5. Phase 6.5 --- Cultural Archive Exhibition Polish

### Objective

Refine the existing four monograph folios and diagram-switching
experience so they feel consistent with the immersive exhibition while
keeping the already-approved six-plate gallery intact.

### Scope A --- Four monograph folios

-   Inspect the four existing foundational-study folios and their
    current content, sources, image credits, and responsive layout.
-   Improve exhibition-plinth framing and visual hierarchy without
    making every folio identical.
-   Add subtle scroll-driven image parallax only where it materially
    improves the editorial presentation.
-   Keep the effect restrained, brief, and subordinate to reading.
-   Ensure content remains readable and usable if JavaScript or
    animation is unavailable.
-   Avoid large image movement, forced scroll sequences, or
    scroll-jacking.

### Scope B --- Technical Weave Library diagrams

-   Inspect the existing diagram switcher and the nine approved SVG
    diagrams with PNG fallbacks.
-   Refine the switcher with restrained warp/weft guide motion where
    semantically appropriate.
-   Do not animate technical lines in a way that changes or
    misrepresents the diagram.
-   Keep diagram labels legible and maintain a clear static state.
-   Reuse existing diagrams. Do not generate or download replacements.
-   Do not associate a diagram with a particular tradition unless the
    existing approved content supports that association.

### Protected exhibition experience

-   Do not redesign or replace `TraditionExhibitionModal.tsx` and its
    six-plate interaction.
-   Preserve all 13 tradition mappings, all six roles, legacy IDs/slugs,
    the `weave-14` monograph, deep links, diagram drawer, and mobile
    thumbnail strip.
-   Avoid changing Archive content or story identifiers merely to make a
    layout easier.
-   Keep verified citations and image credits intact.
-   Do not reintroduce unsupported material, purity, precious-metal,
    density, or production claims.

### Acceptance criteria

-   All four folios remain accessible and their story links work.
-   Diagram selection and fallback behavior continue to work.
-   Parallax is subtle, responsive, and disabled or neutralized under
    reduced motion.
-   No layout shift, clipped text, image cropping regression, or
    horizontal overflow is introduced.
-   The immersive exhibition opens, navigates, changes traditions,
    opens/closes the diagram drawer, and closes with focus restoration
    as before.
-   Existing content and citations are preserved.
-   Full tests, TypeScript, and production build pass.

### Required visual QA

Capture and inspect: - Archive landing/folios at `1440 × 900` - Archive
at `1024 × 768` - Archive at `390 × 844` - At least one monograph while
scrolling - Diagram switcher in static/reduced-motion and normal-motion
states - Existing immersive exhibition at desktop and mobile to
demonstrate no regression

### Deliverable

`phase_6_5_archive_polish_report.md`

Include changed files, folio and diagram behavior, source/citation
preservation, reduced-motion checks, screenshots, exact test/type/build
results, and known limitations.

### Stop condition

Finish Phase 6.5 and stop. Do not start Phase 6.6.

------------------------------------------------------------------------

## 6. Phase 6.6 --- Final Verification, Performance & Accessibility Gate

### Objective

Verify the integrated website as a whole. This is primarily an audit and
correction phase, not an invitation to redesign approved pages or add
features.

### Route and navigation audit

Test all agreed routes:

-   `/`
-   `/collections`
-   `/product/:slug`
-   `/compass`
-   `/archive`
-   `/archive/:storySlug`
-   `/the-house`
-   `/journal`
-   `/journal/:articleSlug`
-   `/saved`
-   `/bag`
-   `/checkout`
-   Branded not-found route

Check direct URL entry, internal navigation, refresh behavior, browser
back/forward, invalid slugs, and empty/missing states. Verify that query
parameters used by Archive exhibition deep links resolve correctly.

### State and commerce audit

-   Add/remove products from Bag and Saved Pieces.
-   Verify counts and totals.
-   Verify quantity controls and duplicate-product/variant merging.
-   Refresh and verify persistence.
-   Confirm Saved and Bag remain synchronized with product cards and
    product detail.
-   Verify empty Bag, checkout validation, confirmation, and simulated
    checkout disclosures.
-   Confirm no real payment processing or sensitive payment collection
    exists.
-   Test Compass results for determinism and valid product links.

### Responsive and visual audit

At minimum test: - `1440 × 900` - `1024 × 768` - `390 × 844`

Review every route for horizontal overflow, clipped controls, image
crop/focal point issues, broken images, awkward wrapping, overlapping
thread graphics, inconsistent spacing, and unreadable text. Inspect both
the page and any nested horizontal scrollers separately.

### Accessibility audit

-   Keyboard-only navigation and visible focus.
-   Dialog focus entry, focus containment where required, Escape
    behavior, and focus restoration.
-   Accessible names for icon-only controls.
-   Meaningful image alt text and appropriate decorative-image handling.
-   Form labels, error messages, and validation.
-   Reduced-motion behavior across loader, homepage, Compass, Product
    Detail, Archive, and exhibition.
-   No essential information conveyed only by motion, color, hover, or
    imagery.
-   Touch target and responsive interaction checks.
-   No scroll trapping.

### Content and asset audit

-   Check product catalogue IDs, titles, prices, slugs, and approved
    assets against the protected baseline.
-   Check all 13 traditions and six semantic image roles.
-   Check diagram relevance, alt text, image failures, and responsive
    image source selection.
-   Search for unsupported fibre-purity, precious-metal,
    technical-density, production, sustainability, partnership, and
    provenance claims.
-   Confirm that any remaining claim has a source or uses neutral
    wording.
-   Confirm citations and image credits are preserved.

### Performance and stability

-   Run production build and test the production preview, not only the
    development server.
-   Inspect image sizes/source selection, avoidable eager loading, and
    console/network errors.
-   Check for obvious layout shifts and repeated/unnecessary animation
    initialization.
-   Evaluate performance with available browser tooling and report
    measured results.
-   Do not claim a sustained 60 FPS or CLS = 0 unless a suitable
    measurement was actually performed. Distinguish observed
    measurements from estimates.
-   Avoid adding performance dependencies unless approved.

### Required automated checks

Run the project's actual scripts, expected to include:

-   `npm test -- --run`
-   `npx tsc --noEmit`
-   `npm run build`

If a script differs or fails, report the exact command and result. Do
not weaken or delete tests merely to make the suite pass.

### Final deliverables

-   `phase_6_6_final_acceptance_report.md`
-   Screenshot index with viewport, route, and state for every capture
-   Final list of changed files from Phase 6.6
-   Exact automated test/type/build results
-   Measured performance/accessibility findings and tooling limitations
-   Remaining known issues, clearly prioritized
-   Final route and feature checklist

### Stop condition

Do not introduce new features during final acceptance. Fix only verified
defects within scope. If a defect requires a broad redesign or a change
to a protected invariant, document it and request approval. Stop after
presenting the report.

------------------------------------------------------------------------

## 7. Suggested order and review gates

  --------------------------------------------------------------------------
  Order             Phase             Main purpose         Required user
                                                           gate
  ----------------- ----------------- -------------------- -----------------
  1                 6.4               Compass and Product  Review report and
                                      Detail               screenshots;
                                      motion/interaction   approve before
                                      refinement           continuing

  2                 6.5               Four Archive folios  Review report and
                                      and technical        screenshots;
                                      diagram switcher     approve before
                                      polish               continuing

  3                 6.6               Whole-site route,    Review final
                                      state, responsive,   acceptance report
                                      accessibility,       before declaring
                                      content, and         project complete
                                      performance          
                                      acceptance           
  --------------------------------------------------------------------------

No phase should start automatically when the preceding phase finishes.

## 8. What is explicitly not in this remaining plan

The approved project is a frontend-only case-study experience. Do not
silently expand scope to include:

-   Backend services or a database
-   User accounts or authentication
-   Real payment gateway or payment-card collection
-   CMS or inventory/order management
-   Real order placement, shipping integration, or customer notification
    services
-   New product catalogue entries
-   New textile traditions, unsupported cultural claims, or replacement
    imagery
-   Unapproved dependencies or a wholesale redesign

If the project brief or course requirements later establish a need for
any excluded item, treat it as a separate proposal requiring approval.

## 9. Definition of done

EverThread is ready to be considered complete when:

1.  Phases 6.4, 6.5, and 6.6 have each been reviewed and approved.
2.  The full automated test suite, TypeScript check, and production
    build pass on the final integrated code.
3.  All agreed routes and core user journeys work from direct navigation
    and in-app navigation.
4.  Bag, Saved Pieces, Compass, and simulated Checkout preserve their
    agreed behavior.
5.  Responsive layouts and nested scrolling are usable without
    unintended page overflow.
6.  Keyboard access, focus management, accessible labels, and
    reduced-motion behavior are verified.
7.  Product, image, and cultural content integrity checks pass.
8.  The approved loader, signature thread, six-role exhibition, product
    catalogue, and core design system remain intact.
9.  Screenshot evidence and reports reflect actual testing, with
    limitations honestly recorded.
10. No known critical or high-priority defect remains unresolved. Any
    lower-priority limitation is documented and accepted.

**Final rule:** quality over phase count. Do not create additional
phases simply to keep iterating. Once the acceptance criteria are met,
freeze the approved work and close the project.
