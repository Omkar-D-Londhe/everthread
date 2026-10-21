**Purpose:** A practical implementation brief for Antigravity. Use this alongside the existing repository, README, approved Stitch screens, and local `Images/` directory. This is not permission to rebuild the project from scratch.

## 1. Project goal

Build **EverThread**, a contemporary heritage-luxury fashion-house frontend.

- **Brand line:** “An heirloom, not a trend.”
- **Supporting line:** “Every thread carries a story.”
- **Story progression:** thread → textile → craft → garment → story.
- **Experience metaphor:** a knowledgeable curator helps visitors discover how textile traditions connect to contemporary clothing.

The result should combine real ecommerce clarity with the pacing and imagery of a high-end editorial publication.

## 2. Work process and guardrails

1. Inspect the existing project, README, package scripts, routes, components, state, tests and asset setup before editing.
2. Reuse the existing React/Vite/TypeScript architecture where it is sound. Do not replace working infrastructure without a clear reason.
3. Treat Stitch as the **visual reference** and the repository as the **technical source of truth**.
4. Inspect actual asset paths before wiring them up. Preserve the source `Images/` directory unchanged.
5. Implement in small, runnable stages. Run the available tests, type checks and production build after meaningful changes.
6. Report what was actually changed and which checks were actually run. Never claim a test or build passed without running it.

## 3. Shared design system

### Palette
Use existing project tokens if defined. Intended palette:
- Warm ivory `#FEF9F0`
- Deep oxblood `#49232D`
- Espresso `#30231F` (or existing approved dark-text token)
- Champagne gold `#B49A70`
- Warm stone/taupe for secondary surfaces

Avoid bright saturated accents, excessive gradients, heavy shadows, generic SaaS styling, and repetitive rounded-card layouts.

### Typography and visual language
- **Playfair Display:** editorial/display headings, article titles and pull quotes.
- **Hanken Grotesk:** navigation, labels, forms, body copy and commerce controls.
- Editorial asymmetry, generous whitespace, fine dividers, restrained borders, and tactile image-led compositions.
- Keep product-image ratios consistent (usually portrait 4:5 or 3:4).
- Sharp rectangular controls and subtle hover states; no unnecessary pill-shaped buttons.
- Shared header, footer, navigation, spacing and icon style must be consistent.
- Mobile is a deliberate composition, not a compressed desktop page.
- Include visible keyboard focus, accessible labels, useful alt text and reduced-motion support.

### Motion
The signature thread is a separate SVG/motion element, never baked into product photography. Use restrained CSS transitions for ordinary interactions. Use GSAP only where appropriate for purposeful scroll/story transitions. Respect `prefers-reduced-motion`; do not block navigation or impose a long loader delay.

## 4. Content accuracy is mandatory

The Stitch screens include illustrative text and unsupported claims. Do **not** copy all mockup text into the application blindly.

Never invent or present as verified:
- Artisan names, guilds, partnerships, signatures or lineage records.
- Real atelier locations or branch locations.
- Sourcing/provenance claims, certifications or guarantees.
- Sustainability or ethical claims.
- Limited-edition status, edition numbers, stock quantities or reservation windows.
- Fabric composition, material origin, GSM, weave density, production hours, tailoring services or care instructions unless approved data supports them.
- Shipping, tax, delivery, duties, discounts or returns promises.
- Journal authors, publication dates, citations, research findings or artisan testimony.

Use approved product names and prices. Omit unsupported details or clearly label fictional case-study copy as illustrative. Do not fabricate citations.

Cultural descriptions must distinguish techniques correctly:
- Patan Patola is associated with double-ikat weaving.
- Chikankari and Kashmiri Sozni are embroidery traditions, not weaving techniques.
- Bandhani and Ajrakh involve resist-dye processes; Ajrakh also uses block printing.
- Paithani weaving and Nauvari/Kashta draping are separate topics, although they may be discussed together in styling context.
- Do not imply all pashmina is embroidered with Sozni.

Use project-approved sources for cultural facts. If sources are unavailable, keep copy conservative and report what needs verification.

## 5. Approved product catalogue

Use these seven products only unless the repository contains a newer, explicitly approved catalogue:

| ID | Product | Approved displayed price |
|---|---|---:|
| ET-01 | Oxblood Wool-Silk Signature Coat-Dress | ₹68,500 |
| ET-02 | Ivory Structured Raw Silk Coat | ₹1,12,000 |
| ET-03 | Architectonic Zari Waistcoat | ₹44,000 |
| ET-04 | Pleated Indigo Chanderi Tunic | ₹32,000 |
| ET-05 | Oxblood Structured Box Calf Leather Bag | ₹54,000 |
| ET-06 | Handspun Mulberry Silk Scarf in Burgundy | ₹24,500 |
| ET-07 | Fine Pashmina & Zari Reversible Stole in Ivory | ₹38,000 |

Use one shared product data source rather than duplicating records across pages. Format INR prices consistently.

### Known image mapping
Verify each path in the actual repository before using it:
- ET-01: `Images/products/signature-coat-dress/product-oxblood-signature-front-01.png`, plus approved back/side/detail variants.
- ET-02: `Images/products/ivory-tailored-coat/product-ivory-tailored-front-01.png`
- ET-03: `Images/products/architectonic-zari-waistcoat/et-03-zari-waistcoat-front-01.png`
- ET-04: `Images/products/pleated-indigo-chanderi-tunic/et-04-chanderi-tunic-front-01.png`
- ET-05: `Images/products/oxblood-handbag/product-oxblood-handbag-01.png`
- ET-06: `Images/products/burgundy-scarf/product-burgundy-scarf-01.png`
- ET-07: `Images/products/ivory-scarf/product-ivory-scarf-01.png`

Do not use the retired ET-01 editorial variant `product-signature-coat-dress-editorial-03.png`, which has a known belt inconsistency. Prefer the approved front/back/side/detail-clean variants that exist. Use a central asset map (existing `assetMap.ts` or equivalent); avoid scattered hard-coded paths and remote hotlinks. Keep original `Images/` unchanged. Optimize derivative copies only if the current project structure calls for it; do not upscale images.

## 6. Shared shell and navigation

Maintain the approved wordmark and shared shell. Primary navigation:
- Collections
- Compass
- The Archive
- The House
- Journal
- Search
- Saved Pieces
- Shopping Bag

Use a compact, usable mobile navigation. Header icons and counters must reflect actual app state, not hard-coded demo counts. Footer links must lead to real routes or clearly implemented placeholders. Remove unsupported “provenance certification” and “ethical charter” links unless those claims/pages genuinely exist.

## 7. Page-by-page design and functionality

### A. Homepage — `/`
**Intent:** editorial introduction to the brand, not a generic ecommerce landing page.

Preserve the approved Stitch direction:
- Hero with editorial fashion image and headline.
- Brand statement and signature thread motif.
- Compass discovery entry point.
- Archive feature with an oxblood visual anchor.
- Permanent Collection preview.
- Craft/design-process or “Making” section.
- Brand promise, Journal preview and shared footer.

Keep the approved layout; do not redesign from scratch. Make every CTA navigate to a working route. Add motion after layout and navigation are stable.

### B. Collections — `/collections`
**Intent:** “The Permanent Collection,” an editorial product catalogue.

Required:
- Introductory heading and concise description.
- Product count, category filters and sorting.
- All seven approved products in the approved order.
- Consistent portrait imagery, product name, price, Save Piece control and clear product navigation.
- Functional filters/sorting based only on real catalogue attributes.
- Active filter count and clear/reset action.
- Desktop three-column grid where appropriate.
- Mobile single-column list and a readable Filter & Sort drawer/control.
- Empty/no-results state.
- Avoid unsupported claims such as “single-origin”, sourcing, stock or craft metadata.
- Use “View Piece” for product navigation. If “Acquire” remains, its action must be unambiguous; Add to Bag is a separate action.

### C. Product Detail — `/products/:productId`
**Intent:** image-led premium product page.

Required:
- Main image gallery with thumbnails and correct product-specific views.
- Product name, approved price, concise description and verified details only.
- Apparel size selection only when supported by the product data; bags and scarves should not show apparel sizes.
- Size guide only if implemented and useful.
- Save Piece and Add to Bag actions.
- Expandable material, construction and care sections only where data supports them.
- Related products from the seven-product catalogue.
- Accessible gallery controls and responsive mobile layout.
- No invented edition, provenance, origin, production-hour, artisan or composition claims.

### D. Saved Pieces — `/saved`
**Intent:** personal editorial selection/wishlist.

Required:
- Starts empty on first use.
- Saved product image, name, price and Product Detail link.
- Remove-from-saved and move-to-bag actions.
- Empty state linking to Collections.
- Persist state locally using the existing project approach.
- No invented reservation countdowns or availability guarantees.

### E. Shopping Bag — `/bag`
**Intent:** clear, elegant shopping summary.

Required:
- Starts empty on first use.
- Line items with correct image, name, price and quantity.
- Increase/decrease quantity, remove item, continue shopping.
- Subtotal calculated from actual prices and quantities.
- Checkout CTA and designed empty state.
- Persist state locally.
- Do not invent shipping, duties, taxes, discounts, delivery dates or stock claims. Omit unconfigured values or clearly indicate they are not yet calculated.
- Header bag count must be derived from actual state.

### F. Checkout — `/checkout`
**Intent:** calm, trustworthy, multi-section frontend checkout.

Required:
- Contact, delivery address, order review and a clearly simulated payment/demo section.
- Client-side validation and clear error messages.
- Order summary derived from actual bag state.
- Demo-only completion/confirmation state.
- Do not integrate real payments or collect/store/transmit real card numbers, CVCs or bank credentials.
- Do not prefill realistic personal identities, addresses, phone numbers or card details. Use neutral placeholders.
- Clearly state it is a demo; never claim a real order was placed.
- Handle an empty bag gracefully.

### G. Compass — `/compass`
**Intent:** guided discovery with the feel of a knowledgeable curator.

Required:
- Simple steps for occasion/context, silhouette, colour and material/craft interest.
- Progress indicator and Back, Continue, Reset and result controls.
- Accessible, stateful selections.
- Compute results from the seven approved products and only attributes actually present in the product data.
- No-match state with a way to broaden preferences.
- Result links to Product Detail and Save Piece action.
- Do not claim AI-powered recommendations if rule-based.
- Do not use invented origins, GSM, edition counts or provenance in preference/result cards.

### H. The Archive — `/archive`
**Intent:** editorial index of textile traditions.

Required:
- Introductory hero, searchable/filterable archive grid.
- Entries based on traditions represented in approved content/assets.
- Functional search, filters and clear/reset controls.
- Each entry has a title, conservative verified description, image and story link.
- Appropriate alt text and local imagery.
- Remove invented institutional affiliations, named conservators, guilds, provenance records and certification labels.
- Empty/no-results state.

### I. Textile Story — `/archive/:slug`
**Intent:** reusable long-form textile tradition story.

Required:
- Tradition title, hero, introduction, cultural/technical context, technique sections, supporting imagery/diagrams and related archive entries/products.
- Correctly distinguish weaving, embroidery, printing and dyeing.
- Source notes only when verified sources are actually available.
- Use approved local archive assets and SVG diagrams where appropriate.
- Generated/stylized imagery is not documentary evidence.
- Back-to-Archive navigation and readable mobile article layout.
- Unknown slug shows a graceful not-found state.

### J. The House — `/house`
**Intent:** brand philosophy and design approach.

Required:
- Editorial hero and philosophy statement.
- Thread → textile → craft → garment → story narrative.
- Design principles and construction/material stories only where supported.
- Links to Collections, Archive and Journal.
- No invented atelier locations, real artisans, partnerships, certifications, production statistics or sustainability claims.

### K. Journal — `/journal`
**Intent:** refined editorial publication.

Required:
- Featured story and article grid.
- Category filters only if supported.
- Titles, excerpts, authors and dates only when supplied/approved.
- Newsletter UI. If no backend exists, use a clearly simulated/local demo response; never imply a real subscription.
- Links to Archive and products where relevant.

### L. Journal Article — `/journal/:slug`
**Intent:** reusable long-form editorial article.

Required:
- Title, subtitle, hero, headings, paragraphs, pull quotes, image captions and related articles.
- Readable article column and comfortable line length.
- Contents navigation only for sufficiently long articles.
- Source notes for verified claims.
- Do not fabricate authors, dates, research, quotations, citations or artisan testimony.
- Unknown slug shows a graceful not-found state.

### M. Search and shared system states
Implement:
- Search overlay/page with useful product, archive and journal results.
- Empty Saved Pieces and Bag.
- Compass no-match state.
- Archive/Journal no-results states.
- Form validation errors.
- Add-to-Bag feedback.
- Checkout demo confirmation.
- Loading states only while work is genuinely pending.
- 404/not-found route.

All states must use the shared design system.

## 8. Routing, state and persistence

Reuse existing architecture where sound. Established direction:
- React Router.
- React Context/hooks for shared bag and saved state.
- Local persistence for Bag and Saved Pieces.
- Bag and Saved Pieces start empty.
- Checkout is frontend simulation only.
- No unnecessary backend.

Functional expectations:
- Product catalogue is defined once.
- Asset map is centralized.
- Header counts and subtotal are derived from state.
- Bag quantity and totals update correctly.
- Saved and bag state survive refresh.
- Add/remove/move-to-bag actions stay synchronized across routes.
- Route parameters resolve the correct product, story and article.
- Invalid IDs/slugs show not-found states.
- Forms are controlled and validated.
- Avoid new dependencies if existing packages solve the problem.

## 9. Motion pass

Only after routes and core interactions work:
- Separate SVG thread motif.
- Short, restrained fades and image/section reveals.
- Purposeful GSAP story/scroll motion only if suitable.
- Reduced-motion alternative.
- No scroll hijacking, blocking animations or forced loader delay.
- Verify mobile behavior and avoid layout shifts.

## 10. Accessibility, responsiveness and performance

- Test mobile, tablet and desktop.
- No horizontal overflow, clipped controls or tiny filter labels.
- Touch targets must be comfortable.
- Use semantic landmarks, headings, links and buttons.
- Label every form input and explain validation errors.
- Visible keyboard focus and adequate contrast, especially for small uppercase text.
- Meaningful image alt text; empty alt for decorative images.
- Keyboard operation for navigation, menus, filters, galleries, drawers and forms.
- Respect `prefers-reduced-motion`.
- Use local assets, avoid remote hotlinks and lazy-load below-the-fold images where sensible.
- Avoid duplicate image files and prevent layout shifts.

## 11. Verification checklist

### Code/build
- [ ] Run existing tests and report actual results.
- [ ] Run TypeScript checks if configured.
- [ ] Run production build.
- [ ] Check console errors, broken imports and missing assets.
- [ ] Do not delete tests to force success.

### Navigation and state
- [ ] All primary navigation routes work.
- [ ] Product cards open the correct product detail.
- [ ] Search and Archive filters work.
- [ ] Compass results derive from actual product data.
- [ ] Save/remove/move-to-bag work.
- [ ] Bag quantities, totals and header counters update correctly.
- [ ] Bag and saved state persist after refresh.
- [ ] Checkout handles valid, invalid and empty-bag cases.

### Visual and content
- [ ] Desktop/tablet/mobile reviewed.
- [ ] Correct local images appear on all pages.
- [ ] Shared shell is consistent.
- [ ] Empty, error and confirmation states are designed.
- [ ] Reduced-motion behavior works.
- [ ] Unsupported claims removed or explicitly labelled as fictional demo copy.
- [ ] Cultural descriptions distinguish techniques correctly.
- [ ] No real payment data is collected or stored.

## 12. Required handoff report

At the end, report:
1. Routes completed.
2. Shared components and state architecture used.
3. Asset mapping changes.
4. Functional interactions completed.
5. Exact tests, type checks and build commands run, with results.
6. Remaining bugs, incomplete routes and content requiring verification.

Keep the app runnable throughout. Do not claim completion while major routes or flows remain unfinished. Prioritize a cohesive, accurate, accessible implementation over decorative additions.
"""
