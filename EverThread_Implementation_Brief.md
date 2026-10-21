# EverThread — Project Brief for Antigravity

> **Purpose:** Place this file in the root of the existing `FE Case Study` project folder. It records the approved decisions and working rules for the EverThread frontend rebuild. It is not an instruction to implement the entire project in one pass.

## 1. Project status and working folder

The current working folder is the extracted **`FE Case Study`** project from the existing ZIP. Preserve the original project and its useful code, assets, and references. Do not delete or overwrite the original ZIP.

The visible structure currently includes:

- `css/`: `animations.css`, `design-tokens.css`, `main.css`
- `js/`: `collections.js`, `compass.js`, `navigation.js`, `product-detail.js`, `store.js`, `thread-animations.js`
- `scratch/`: `acceptance_test.js`, `dom_audit.py`
- `stitch_everthread_luxury.../` reference/design folders
- Existing HTML pages such as `index.html`, `collections.html`, `product-detail.html`, `curators-compass.html`, `archive.html`, `archive-story.html`, `the-house.html`, `journal.html`, `saved-pieces.html`, `bag.html`, and `checkout.html`.

This is a partial view of the Explorer; inspect the actual folder before assuming that the list is complete.

## 2. Brand and design direction

- **Brand:** EverThread
- **Tagline:** “An heirloom, not a trend.”
- **Supporting line:** “Every thread carries a story.”
- **Core concept:** One thread. A world of stories.
- **Positioning:** Contemporary heritage luxury, cultural storytelling, refinement, craft, and artistic meaning.
- **Palette:** warm ivory `#FEF9F0`, deep oxblood `#49232D`, espresso `#30231F`, champagne `#B49A70`, and warm stone/taupe.
- **Typography:** Playfair Display for headlines; Hanken Grotesk for body and UI.
- **Visual character:** editorial compositions, tactile fabric imagery, architectural settings, generous whitespace, restrained shadows, intentional asymmetry, and minimal UI.
- Avoid generic rounded-card layouts, unnecessary interface complexity, repetitive imagery, and spectacle that harms usability.

The brand journey is **thread → textile → craft → garment → story**. The signature thread is a separate SVG/motion element and must not be baked into photos.

## 3. Approved technical decisions

- React + TypeScript + Vite single-page application.
- React Router for routes and browser history.
- React Context + hooks for shared state.
- `localStorage` for Bag and Saved Pieces persistence.
- GSAP/ScrollTrigger for selected Story Flow scenes; SVG for the signature thread; restrained CSS transitions.
- Bootstrap 5, custom CSS, HTML5, and accessible JavaScript/React interactions.
- Local, reviewed, optimized image assets.
- Frontend-only checkout simulation.
- Full agreed frontend scope; do not add an unnecessary backend, authentication system, CMS, payment integration, or real commerce platform.

Do not install extra libraries without first checking whether the approved stack already supports the need.

## 4. Agreed routes

- `/` — Home
- `/collections` — Collections
- `/product/:slug` — Product detail
- `/compass` — Thread Compass
- `/archive` — Cultural Archive and Weave Library entry point
- `/archive/:storySlug` — Archive story
- `/the-house` — The House
- `/journal` — Journal
- `/journal/:articleSlug` — Journal article
- `/saved` — Saved Pieces
- `/bag` — Bag
- `/checkout` — Simulated checkout
- unmatched routes — branded not-found page

The Weave Library belongs inside the Archive experience; it is not a separate top-level route.

Every route must support direct navigation and refresh. Browser Back/Forward, internal links, responsive layouts, keyboard access, reduced-motion preferences, and shared counts must behave consistently.

## 5. State and functional rules

- New visitors must see an empty Bag and empty Saved Pieces.
- Never seed the bag with mock products.
- Persist Bag and Saved Pieces in localStorage, validate stored data, and recover gracefully if data is invalid.
- Store saved product IDs; store bag product ID, variant ID, and quantity.
- Merge identical product/variant combinations.
- Derive prices and totals from the catalogue rather than trusting stale values in storage.
- Collections filters must use real product attributes; sorting should be meaningful.
- Thread Compass must use attribute-based matching and explain why results match. No arbitrary fallback products and no false claims of AI.
- Product pages should link to genuinely related Archive stories where the data supports that relationship.
- Checkout must clearly state that it is a demo. Do not collect payment card/CVV data, process payments, create real orders, reserve inventory, or falsely claim a transaction succeeded.

## 6. Content integrity

Use a hybrid content model:
- Cultural facts must be verified and carefully worded.
- Fictional product storytelling must be clearly labelled as editorial/fictional where appropriate.
- Do not invent sourcing, sustainability, ethical, artisan-partnership, production-hour, geographic-origin, limited-edition, inventory, or manufacturing claims.
- Distinguish weaving, embroidery, printing, dyeing, textiles, and draping accurately.
- Label illustrative/generated images where viewers might otherwise mistake them for documentary evidence of a real garment, artisan, or process.
- Store article/story sources, image credits, captions, and useful alt text with the relevant content.
- If a claim cannot be supported, flag it for review instead of guessing.

## 7. Signature experience

### Signature thread
The thread is the narrative spine, not generic decoration. Its context can change across pages without restarting unrelated animation. Use restrained treatments on commerce pages.

### Story Flow
Three phases: **Initiate → Glide → Settle**.
- Initiate: deliberate scroll/click.
- Glide: architectural panels fold/roll to reveal a scene.
- Settle: motion resolves into a readable position and returns control.
- Strongest on Home, Archive, and The House.
- Commerce pages should remain conventional.
- Motion must be interruptible, keyboard-accessible, reduced-motion-friendly, mobile-appropriate, and must never trap scrolling or block direct links/history.

### Atelier Lens cursor
An optional context-aware cursor with labels such as “View piece”, “Look closer”, or “Discover story”.
- Use predefined light/dark/image contexts rather than pixel-by-pixel contrast detection.
- Preserve native text-selection and form cursors.
- Touch users retain native interaction.
- Keyboard users must have equivalent functionality.
- It must never be required to use the site.

## 8. Page content direction

### Home
1. Hero
2. Thread Compass
3. Cultural Archive
4. Permanent Capsule
5. The Making
6. EverThread Promise
7. Journal/footer

Hero copy:
- “An heirloom, not a trend.”
- “Every thread carries a story.”
- Primary CTA: “Explore the collection”
- Secondary CTA: “Enter the Archive”

Compass paths: Fabric, Movement, Hands/Craft, Story.

### Collections and product detail
Collections needs actual attribute filters (category/material/colour/craft/price), meaningful sorting (featured/newest/price ascending/descending), and product previews with image/name/price/save action.

Product detail needs a gallery, description, options/variants, availability wording that does not imply real inventory, care information, add-to-bag, and related Archive stories where appropriate.

The signature coat-dress concept is oxblood, with an asymmetric woven front panel and structured tailoring; avoid a prominent belt.

### Thread Compass
Guided discovery, not filters disguised as a quiz. Explain matches using actual attributes.

### Cultural Archive and Weave Library
Create a curated exhibition rather than a country directory or endless generic grid. Stories can cover regional context, technique, materials/motifs, construction/wearing, regional variation, sourced history, and related products when genuine. Research and verify details before publishing.

### The House
Editorial story about beliefs, design approach, cultural storytelling, and the making perspective. Avoid unsupported factual claims about real operations or supply chains.

### Journal
Landing page with featured article, browsable articles, search, and categories only where published content supports them. Article data should support title, slug, intro, category, author/date where appropriate, reading time, structured body, image captions/alt text, sources/credits, and related content.

### Saved Pieces, Bag, Checkout
Build useful empty states, persistent saved items, variant-aware bag lines, accurate totals, and a validated checkout demo. Clearly communicate that no payment or real order is made.

## 9. Staged workflow and verification gates

Build in stages, with substantial visible progress at each stage:

1. **Audit and foundation:** inspect existing code/assets/references; create a migration map; establish Vite/React/TypeScript, router, design tokens, and shared responsive shell.
2. **Data and state:** typed models, shared state, localStorage validation, asset manifest, motion foundation.
3. **Commerce and discovery:** Collections, Product Detail, Compass, Saved Pieces, Bag, Checkout.
4. **Editorial and culture:** Home, Archive/story pages, Weave Library, The House, Journal/article pages.
5. **Motion and refinement:** thread, Story Flow, cursor, image optimization, responsive and performance refinement.
6. **Acceptance:** test all routes, direct links/history, persistence, calculations, errors, accessibility basics, responsiveness, and production build.

At the end of each stage, report:
- What changed and which files were changed.
- What is visibly working.
- Commands/tests run and their actual results.
- Failures, blockers, and known issues.
- Whether the stage passes or fails its acceptance gate.

Do not silently continue into the next stage. Stop for review after each gate. Do not claim a test passed unless it was actually run.

## 10. Instructions for Antigravity

**First task: AUDIT ONLY. Do not modify implementation files yet.**

Inspect the actual folder, including nested reference folders and available assets. Review the HTML/CSS/JS and existing tests. Identify reusable code, broken or incomplete behavior, external dependencies, image references, unsupported factual claims, and conflicts with this brief.

Produce a concise migration/audit report containing:
1. Actual project tree (relevant files only).
2. Reusable work versus work needing replacement.
3. Risks and defects to address.
4. Asset inventory and unresolved image references.
5. Proposed target folder structure.
6. Stage 1 implementation checklist and exact verification commands.

Do not generate images, build every page, delete old files, or implement later stages during this audit. Preserve the existing project. Stop and wait for approval after reporting the findings.

## 11. Short-command protocol

For future Antigravity/Stitch tasks, issue one bounded command at a time. Every command should specify:
- Scope.
- Boundaries (what not to do).
- Deliverable.
- Verification.
- Stop condition.

Use Stitch for page/layout design references and Antigravity for implementation, integration, and testing. Do not ask either tool to do the entire project in one command.

## Current status

**Stage 1 — audit and migration map: not started.**
