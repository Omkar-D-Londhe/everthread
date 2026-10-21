# EVERTHREAD --- PHASE 6.3.2.2

# Immersive Textile Exhibition: Master Implementation Specification

**Project:** EverThread\
**Project directory:** `C:\Users\omkar\OneDrive\Desktop\FE Case Study`\
**Execution mode:** Complete the entire bounded feature in one
coordinated Antigravity run.\
**Deliverable:**
`phase_6_3_2_2_immersive_textile_exhibition_implementation_report.md`

## 0. Mandatory instruction

Read this entire specification, inspect the repository, and then
implement the feature. **Do not stop after an audit, plan, wireframe, or
data model.** Complete data integration, Archive overview, gallery,
transitions, responsive behavior, accessibility, tests, browser QA where
available, and the final report in this phase.

Use the actual repository as ground truth. Verify filenames, asset
counts, dimensions, existing component patterns, routes, test commands,
and current working-tree changes before editing. Do not overwrite
unrelated work or refactor broadly. If a noncritical detail is
ambiguous, choose the least destructive approach consistent with this
specification and document it. Stop only for a genuine blocker that
prevents safe implementation. Do not start Phase 6.4.

## 1. Brand and visual direction

EverThread is a contemporary heritage-luxury fashion house. Its
narrative spine is:

**Thread → Textile → Craft → Garment → Story**

Brand lines: - "An heirloom, not a trend." - "Every thread carries a
story."

Use the existing design tokens and styles: - Warm ivory `#FEF9F0` -
Oxblood `#49232D` - Espresso `#30231F` - Champagne `#B49A70` - Playfair
Display for editorial headings - Hanken Grotesk for body and interface
text

The experience should feel like a carefully curated textile exhibition:
tactile, editorial, quiet, asymmetric, image-led, and premium. Use
deliberate whitespace, restrained rules, subtle states, and a clear
visual hierarchy. Avoid generic ecommerce carousels, dashboard
aesthetics, six equal tiles, excessive rounded cards, large shadows,
gradients over imagery, oversized controls, and decorative clutter.

The signature thread is a separate SVG/motion layer. It must guide
attention during transitions without becoming a permanent web or
obscuring faces, garment silhouettes, borders, or textile details. The
intended motion arc is **Initiate → Glide → Settle**.

**Protected:** the approved initial loader, its artwork,
`ThreadLoader.tsx`, `thread-loader.css`, timing, and tests. Do not alter
them.

## 2. Scope and exclusions

### Included

1.  Repository and asset verification.
2.  Type-safe mapping of six image roles for all 13 textile traditions.
3.  Archive Weave Library overview refinement.
4.  Immersive full-viewport gallery/dialog.
5.  Six-image selection, image navigation, and tradition switching.
6.  Desktop, intermediate, and mobile layouts.
7.  Thread-led transitions and reduced-motion behavior.
8.  Contextual educational-diagram links where supported by verified
    content.
9.  Responsive image loading, performance, and failure handling.
10. Targeted tests, full regression suite, type check, build, browser
    screenshots, and report.

### Excluded

Do not redesign unrelated pages, replace the app architecture, add a
CMS/backend/auth/payment system, add products, alter product data,
rewrite all textile-history content, add unsupported cultural or
sustainability claims, introduce unapproved imagery, add dependencies
without a demonstrated need, change route architecture unnecessarily, or
rename legacy IDs/slugs for neatness. The `weave-14` radial-bias-draping
item is a general monograph, not a fourteenth textile tradition;
preserve its existing identity and behavior.

## 3. Inspect before editing

Inspect at minimum: - `package.json` and lockfile -
`src/types/catalog.ts` - `src/data/assetCatalog.json` -
`src/data/assetMap.ts` - `src/data/stories.ts` - Current Archive page
and its tests - Diagram viewer and diagram assets - Existing
modal/dialog, focus-management, image, and button patterns - Route
definitions - Design tokens, global CSS, motion utilities, and
reduced-motion support - Current working-tree changes

Identify protected files and existing behavior/tests. Prefer the
smallest localized implementation that fits the existing architecture.
Do not duplicate a source of truth or create a parallel gallery
implementation.

## 4. Tradition catalogue and six-role contract

The prior audit reported these 13 traditions. Verify them against the
actual source files and preserve existing IDs, slugs, categories, story
links, and legacy identifiers:

1.  `ajrakh`
2.  `bagru`
3.  `banarasi-brocade`
4.  `bandhani`
5.  `chikankari`
6.  `kanchipuram-silk`
7.  `kashmiri-sozni`
8.  `kota-doria`
9.  `muga-silk`
10. `paithani-silk`
11. `patan-patola`
12. `pochampally-ikat`
13. `sambalpuri-ikat`

The earlier audit reported 78 base images (13 × 6), 260 responsive
variants, and nine diagrams with PNG fallbacks. Treat those as
hypotheses until verified. Record any discrepancy in the final report.

Each tradition should expose these stable role keys:

  -----------------------------------------------------------------------
  Role key                Suggested UI label      Purpose
  ----------------------- ----------------------- -----------------------
  `model-01`              Model / Garment         Primary silhouette or
                                                  garment view

  `model-02`              Alternate View          Secondary model or
                                                  garment view

  `drape-03`              Drape & Movement        Shape, fall, or
                                                  movement

  `stilllife-04`          Textile Still Life      Material arranged as an
                                                  object

  `macro-05`              Weave Detail            Weave, surface,
                                                  embroidery, or fine
                                                  detail

  `process-06`            Process & Making        Tools, process, or
                                                  making context
  -----------------------------------------------------------------------

Use existing `src/data/assetCatalog.json` as canonical if repository
inspection confirms that role. Add the smallest type-safe
lookup/abstraction needed in `src/data/assetMap.ts` and/or existing
types. Do not manually duplicate all paths, dimensions, `srcSet`,
`sizes`, and alt text into a second independent manifest.

Validate that every tradition has all six roles; all local paths and
responsive variants exist; dimensions are positive; alt text is useful;
and no role accidentally points to another tradition or duplicates a
different role without a documented reason. Prefer tests or build-time
checks over filesystem validation in the production browser bundle.

Use verified existing names, descriptions, and metadata. Never infer
material, origin, provenance, artisan partnership, historical period,
production process, or sustainability from a filename alone.

## 5. Image integrity: non-negotiable

The previous audit reported: - Banarasi-brocade `model-01` and
`model-02` are landscape. - Bandhani `model-01` and `model-02` are
landscape. - Many still-life, macro, and process images are landscape. -
Most other model and drape images are portrait.

Verify actual dimensions. **Never stretch an image or force every image
into the same portrait crop.**

Image-fit rules: 1. If full silhouette, garment construction, model, or
complete object matters, use `contain` in a well-proportioned ivory
stage. 2. Use `cover` only when a deliberate crop is safe and verified.
3. Adapt stage/card proportions to image dimensions rather than imposing
a universal aspect ratio. 4. If cropping is unavoidable, choose a
justified focal point and inspect it in a real screenshot. 5. Preserve
image clarity and fine textile detail.

Never routinely crop heads, hems, shoulders, sleeves, borders, important
motifs, or construction details. Avoid a tiny contained image in a huge
blank panel, faded overlays, gradients, heavy borders, and excessive
padding. Do not silently replace a missing image with an unrelated
tradition's image.

Use existing responsive variants and metadata. Reserve image dimensions
to avoid layout shifts. Load only overview covers initially; load
supporting images when needed. Prioritize the visible cover and active
stage image, and lazy-load noncritical views sensibly.

Alt text should describe the actual visible subject and distinguish
roles. Avoid repetitive "textile image" alt text. Use verified
descriptions; where details are unknown, describe visible content
neutrally.

If an image fails, keep the gallery usable and show a neutral accessible
fallback or existing approved fallback. Never let one broken image crash
the whole Archive.

## 6. Archive overview

The Archive is the invitation, not the full exhibition. Preserve
existing page structure, category filters, story links, labels, IDs, and
navigation.

-   Retain all existing traditions and the general monograph item.
-   Use verified `macro-05` as the default tradition cover unless the
    existing approved cover is intentionally different and should
    remain.
-   Use editorial asymmetry, purposeful spacing, readable titles, and a
    visible opening affordance.
-   Avoid a grid of six images per tradition on the overview.
-   Keep hover feedback restrained and keyboard focus equally visible.
-   Use valid button/link semantics. Do not nest interactive controls
    improperly.
-   If an existing card links to a story, preserve that link. Add a
    separate gallery action if needed rather than silently replacing
    navigation.
-   Make it clear that the action opens a gallery if using a dialog.
-   Lazy-load offscreen covers and do not load all 78 high-resolution
    images on initial page load.
-   Keep the Archive recognizable; do not redesign unrelated story
    sections.

## 7. Desktop immersive gallery

### Experience goal

Opening a tradition should feel like entering a curated exhibition of
textile plates. Prefer an accessible full-viewport dialog or an existing
overlay pattern. Do not add a route unless the current architecture
genuinely requires it.

The visual hierarchy is: 1. One dominant selected image. 2. Five
smaller, selectable supporting views arranged asymmetrically. 3.
Tradition title and concise image-role label. 4. Clear close, image
navigation, and optional tradition navigation. 5. A temporary, secondary
thread motif.

At 1440 × 900, the primary stage must receive most of the visual
attention. Supporting views must be large enough to identify and select
but should not compete equally with the main image. Avoid excessive dead
space, a control-heavy interface, or a generic slider.

### Opening

Use a composed sequence: 1. The activated cover becomes the visual
anchor. 2. The gallery surface settles into place. 3. The main image is
revealed. 4. Five supporting views fan, stack, or settle into an
asymmetrical arrangement. 5. A fine champagne thread briefly connects
the transition and then settles/disappears.

Keep the opening responsive and interruptible. The visitor must be able
to close immediately. Avoid flashes, blank gaps, competing overlays, and
slow timelines.

### Selecting a supporting view

Every one of the six views must be directly selectable. Selecting a
support image must: - Promote it into the dominant stage. - Update the
role label and selected state. - Return the previously selected view to
its appropriate supporting position. - Keep the visitor within the same
tradition. - Use a short, smooth transition without remounting the
entire gallery unnecessarily. - Optionally use a brief thread trace that
does not obscure the subject.

The supporting cards cannot be decorative-only.

### Image navigation

Provide visible previous/next image controls. Navigation must remain
within the current tradition. Define predictable boundary behavior (wrap
only if clearly conventional; otherwise disable boundary controls). Do
not confuse image navigation with tradition switching. Keyboard
navigation must not hijack text entry or focused controls.

Provide previous/next tradition controls if they fit cleanly.
Recommended behavior: switching traditions resets selection to
`model-01`. Implement and test the chosen behavior consistently.

### Closing

-   Keep a clear close button visible.
-   Escape closes the gallery unless a nested viewer appropriately
    handles Escape first.
-   Focus moves into the gallery on open and returns to the triggering
    control on close.
-   Background interaction is prevented while the modal is open.
-   Body scrolling is restored on close/unmount.
-   Closing during an animation must safely cancel or complete it.
-   Repeated open/close cycles must not accumulate listeners or
    animation timelines.

## 8. Mobile and intermediate behavior

Do not shrink the desktop fan into a narrow viewport. Mobile is a
separate inspection composition.

### Mobile, target 390 × 844

-   One large, readable image stage.
-   Tradition title and active role label.
-   Clear close control.
-   Visible previous/next controls.
-   Compact selector/thumbnail strip for all six roles.
-   Swipe may be supported but is never the only navigation method.
-   Touch targets at least 44 × 44 CSS pixels.
-   No horizontal page overflow.
-   No controls obscuring important textile details.
-   No tiny text or excessively tall empty space around landscape
    images.
-   Keep close action reachable on short screens.
-   Show the active selection clearly.
-   A thumbnail strip may scroll internally; the page itself must not
    overflow horizontally.

### Swipe requirements

If swipe is implemented, detect deliberate horizontal gestures, ignore
primarily vertical scrolling, avoid treating taps as swipes, use a
reasonable threshold, and ensure buttons produce identical behavior.
Prevent a gesture and click from causing duplicate navigation.

### Intermediate, target 1024 × 768

Use an intentional hybrid layout. Reduce the spread/number of
simultaneously visible supporting cards if needed, but keep all six
views accessible. Keep the main stage large enough and controls visible.
Prevent overlap between title, cards, labels, and thread. Verify using a
real screenshot rather than trusting the CSS alone.

### Modal sizing

Use the existing viewport and safe-sizing conventions. Do not leave the
body locked after close. Avoid inaccessible scroll traps and controls
hidden behind browser chrome. Preserve normal page scrolling when
closed.

## 9. Thread-led motion

Use the existing motion infrastructure where appropriate. The thread
should be a subtle visual bridge between: - Opening the gallery. -
Promoting a selected image. - Switching traditions. - Closing the
gallery.

Keep the stroke fine and champagne-toned. It must not intercept pointer
events, obscure faces/silhouettes/details, or become an endless
decoration. Ensure its coordinate system adapts to resizing without
distortion. Clean up timelines, observers, and listeners on
close/unmount.

As a visual target, the opening may take about 500--900 ms overall with
brief staggered elements; image selection should feel immediate. Treat
this as a design guide, not a rigid requirement. Prefer smooth ease-out
motion. Avoid spinning, springy overshoot, excessive scaling, large
parallax, scroll-jacking, and long delays.

Honor `prefers-reduced-motion: reduce`: remove or sharply reduce travel,
thread drawing, staggering, and scaling. Use immediate state changes or
a very brief opacity transition. Motion must never be required to
discover a control or understand selection.

**Do not change the approved initial loader** or its assets, styling,
tests, timing, or behavior. If global thread utilities are unsuitable,
implement gallery-specific motion rather than risky global changes.

## 10. Educational diagrams

The earlier audit reported nine diagrams with PNG fallbacks, covering
topics such as block printing, double ikat, embroidery versus weaving,
garment construction, resist dyeing, technique comparison,
textile-to-garment relationships, vocabulary, and warp/weft. Inspect
actual diagrams and the existing viewer before using them.

Potential mappings from the prior audit---not automatic assignments: -
Block printing → Bagru and Ajrakh. - Double ikat → Patan Patola and
Pochampally. - Embroidery versus weaving → Chikankari and Sozni. -
Resist dyeing → Bandhani. - Garment construction → existing
garment-construction narrative.

Verify each mapping against the diagram and approved project content. If
unsupported or uncertain, leave it unmapped and document that decision.
Use a secondary "Explore the technique" action or compact contextual
panel. Photography remains primary. Preserve current viewer behavior and
SVG/PNG fallback logic. Do not invent history or claim that a general
diagram fully explains a specific tradition.

## 11. Accessibility

Accessibility is part of implementation, not a final polish task.

-   Use valid semantics and an accessible dialog name where appropriate.
-   All cards/actions and controls are keyboard reachable.
-   Enter/Space work through native button semantics.
-   Escape closes the gallery where appropriate.
-   Previous/next controls have descriptive accessible names.
-   Focus enters the gallery on opening and returns to the originating
    control on close.
-   Use existing tested focus-management utilities if available.
-   Background interaction is prevented while the modal is open.
-   Selected image and role are programmatically identifiable.
-   Icon-only controls have accessible names.
-   Use useful alt text; decorative thread SVG is ignored by assistive
    technology.
-   Avoid repeatedly announcing the whole gallery on every selection.
-   Touch targets are at least 44 × 44 CSS pixels.
-   Hover is never the only way to access functionality.
-   Reduced-motion mode preserves all functionality.
-   No invalid nested interactive elements.
-   Focus indicators remain visible on all relevant surfaces.

## 12. State, performance, and resilience

Keep local state minimal: open/closed, active tradition ID, active role
key, and optionally the selected diagram viewer. Derive metadata from
the active tradition and role rather than duplicating it in state. Use
existing state conventions; do not add global state for a local gallery.

Clean up event listeners, animation timelines, observers, and any
timers. Prevent stale closures, duplicated timelines, state leaks,
body-scroll locks, and state updates after unmount. Handle responsive
resize safely. Use stable React keys.

Avoid rendering all 78 high-resolution images in a hidden DOM tree. Use
responsive sources, lazy loading, dimension reservation, and sensible
priority. Do not add dependencies unless a demonstrated need justifies
one.

A missing image must not crash the experience or silently show an
unrelated tradition's image. The visitor must always be able to close
the gallery.

## 13. Protected data and behavior

The seven canonical products must remain untouched:

  ID      Product                                        Price
  ------- ---------------------------------------- -----------
  ET-01   Oxblood Wool-Silk Signature Coat-Dress       ₹68,500
  ET-02   Ivory Raw Tussar Cocoon Trench             ₹1,12,000
  ET-03   Architectonic Zari Waistcoat                 ₹44,000
  ET-04   Angrakha Asymmetric Sheer Tunic              ₹32,000
  ET-05   Box-Calf Structured Frame Bag                ₹54,000
  ET-06   Hand-Rolled Mulberry Twill Scarf             ₹24,500
  ET-07   High-Altitude Hand-Spun Pashmina Stole       ₹38,000

Do not change product IDs, names, prices, slugs, assets, or matching
behavior. Preserve: - Collections filters, sorting, and navigation. -
Product Detail gallery and purchase actions. - Compass matcher. - Saved
Pieces persistence. - Bag persistence, quantity updates, and merge
behavior. - Simulated checkout behavior. - Archive routes, story links,
filters, and legacy identifiers. - Existing global design tokens and
motion conventions. - Reduced-motion support. - Approved ThreadLoader
and related assets/tests.

Existing routes to protect: `/`, `/collections`, `/product/:slug`,
`/compass`, `/archive`, `/archive/:storySlug`, `/the-house`, `/journal`,
`/journal/:articleSlug`, `/saved`, `/bag`, `/checkout`, and branded
not-found route.

Do not broadly refactor shared styles. Do not delete, skip, or weaken
tests to obtain a passing result. If a test changes due to a genuinely
intended interaction, preserve the underlying invariant and explain why.

## 14. Required automated tests

Inspect `package.json` and the existing test runner. Expected commands
from project context:

``` bash
npm test -- --run
npx tsc --noEmit
npm run build
```

If the repository uses different commands, use the correct equivalents
and report them.

Add tests for: - Six-role mapping for all 13 traditions. - Valid local
asset paths, dimensions, alt text, and responsive variants. - No
unintended duplicate or cross-tradition mappings. - Preservation of
legacy IDs/slugs and monograph separation. - Correct gallery opening for
the selected tradition. - Closing and state restoration. - Selecting
every image role and updating active state/label. - Previous/next image
navigation and boundary behavior. - Switching traditions. - Existing
Archive filters and story links. - Keyboard operation, Escape, and focus
restoration where supported. - Reduced-motion behavior. - Missing image
resilience. - Landscape Banarasi and Bandhani model handling. - Repeated
open/close without leaked state or listeners.

Run the **full existing suite**, not only new tests. Verify protected
product data, Compass, Saved, Bag, Checkout, routes, loader, and motion
behavior through existing tests and focused checks.

Never claim a command passed unless it actually ran and its exit status
was verified.

## 15. Browser visual QA

A passing build does not prove the gallery looks right. Capture and
inspect real browser screenshots if tooling permits.

Required viewports: - Desktop: 1440 × 900 - Intermediate: 1024 × 768 -
Mobile: 390 × 844

Required states: 1. Archive overview on desktop. 2. Gallery
opening/expanded state on desktop. 3. Selected macro/detail image. 4. A
landscape Banarasi or Bandhani model image. 5. Intermediate gallery. 6.
Mobile gallery. 7. Mobile selected-image state showing role selector and
controls.

Use the existing screenshot/evidence convention if present; otherwise
use `artifacts/phase-6-3-2-2/`. Do not add screenshot artifacts to
public app assets unless the project convention requires it.

Wait for image loading before capturing. Inspect: - Destructive crops,
especially landscape model images. - Excessive blank space around
`contain` images. - Main stage too small or supporting images too
tiny. - Overlap of labels, controls, and thread. - Contrast and focus
visibility. - Controls clipped on short screens. - Mobile horizontal
overflow. - Body scroll remaining locked after close. - Thread crossing
faces or key textile details. - Flicker, abrupt remounts, animation
overlap, or layout shifts. - Blank images caused by screenshots captured
too early. - Incorrect selected state or focus returning to the wrong
control.

Fix defects and repeat affected screenshots/tests. If browser tooling is
unavailable, state the exact limitation and do not claim visual
inspection passed.

## 16. Single-run execution order

Complete these steps without asking for approval between them:

1.  Inspect repository and protect existing work.
2.  Verify assets, dimensions, role coverage, and diagrams.
3.  Implement the typed data mapping and validation.
4.  Refine Archive overview and accessible opening controls.
5.  Implement desktop gallery and six-role selection.
6.  Implement image navigation, tradition switching, close, and focus
    handling.
7.  Implement intermediate and mobile layouts.
8.  Add thread transitions and reduced-motion behavior.
9.  Add only verified diagram mappings.
10. Add targeted tests.
11. Run full tests, TypeScript check, and production build.
12. Capture and inspect required browser screenshots where tooling
    permits.
13. Fix issues and rerun affected verification.
14. Write the final report and stop.

Do not stop after step 2 or 3. Do not proceed to another phase.

## 17. Acceptance checklist

In the final report, mark each item **PASS**, **FAIL**, or **NOT
VERIFIED**.

### Data

-   [ ] All 13 traditions expose all six verified image roles.
-   [ ] Asset paths, responsive variants, dimensions, and alt text are
    verified.
-   [ ] No unintended duplicate/cross-tradition mappings.
-   [ ] Legacy IDs, slugs, story relationships, and monograph identity
    preserved.
-   [ ] Landscape exceptions handled correctly.

### Archive

-   [ ] Existing traditions and monograph remain available.
-   [ ] Filters and story links still work.
-   [ ] Approved local imagery is used.
-   [ ] Cards are keyboard accessible with clear opening affordance.
-   [ ] Closed galleries do not load every full-resolution image
    eagerly.

### Gallery

-   [ ] Correct card opens correct tradition.
-   [ ] Desktop has one dominant image and five selectable supporting
    views.
-   [ ] All six roles can be inspected.
-   [ ] Previous/next image controls work.
-   [ ] Tradition switching updates all content correctly.
-   [ ] Close button and Escape work.
-   [ ] Focus restoration works.
-   [ ] Repeated open/close does not leak state or listeners.

### Visual and responsive

-   [ ] Desktop composition is editorial, quiet, and image-led.
-   [ ] Intermediate layout is intentionally composed.
-   [ ] Mobile has a large stage and compact selector.
-   [ ] Landscape images are not destructively cropped.
-   [ ] Main stage adapts to portrait/landscape content.
-   [ ] Thread is subtle and does not obscure imagery.
-   [ ] No overflow, clipped controls, or major layout shifts.

### Accessibility and performance

-   [ ] Keyboard and touch interaction work.
-   [ ] Reduced-motion behavior works.
-   [ ] Labels, selected state, and alt text are accessible.
-   [ ] Image loading is prioritized/lazy-loaded sensibly.
-   [ ] Event listeners and timelines are cleaned up.
-   [ ] Missing image does not crash gallery.

### Regression and verification

-   [ ] Product data and approved product assets unchanged.
-   [ ] Compass, Saved, Bag, Checkout, routes, and loader remain intact.
-   [ ] Full tests pass.
-   [ ] TypeScript check passes.
-   [ ] Production build passes.
-   [ ] Screenshots inspected or limitation documented honestly.
-   [ ] Final report created.

## 18. Final report requirements

Create
`phase_6_3_2_2_immersive_textile_exhibition_implementation_report.md`
with: 1. Outcome: completed, partially completed, or blocked. 2.
Verified repository facts: actual tradition/asset/role/diagram counts
and discrepancies. 3. Final design decisions for desktop, intermediate,
and mobile. 4. Data architecture and validation approach. 5.
Open/select/navigate/switch/close interactions. 6. Motion, reduced
motion, focus management, and cleanup. 7. Changed files with concise
explanations. 8. Exact test commands and results. 9. Exact TypeScript
and build outcomes. 10. Screenshot paths, viewport sizes, and what was
inspected. 11. Regression results for products, Compass, Saved, Bag,
Checkout, routes, and loader. 12. Acceptance checklist with
PASS/FAIL/NOT VERIFIED. 13. Actual remaining limitations. 14. Whether
this phase is ready for review.

## 19. Final instruction

Implement the complete feature in this one bounded run. Prioritize
correct verified assets, excellent image composition, intuitive
inspection, restrained thread-led motion, accessibility, regression
safety, and honest verification.

**Do not stop at planning. Do not expand scope. Do not change protected
work. Do not fabricate evidence. Finish all feasible implementation and
verification, create the report, and stop.**
