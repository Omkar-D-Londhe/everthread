# EverThread — Phase 6.4 Preflight Audit Report: Thread Compass & Product Detail Interactions

**Project:** EverThread  
**Project Directory:** `C:\Users\omkar\OneDrive\Desktop\FE Case Study`  
**Audit Timestamp:** October 21, 2026 — 20:20 IST  
**Audit Mode:** STRICT AUDIT ONLY — NO CODE MODIFICATIONS  
**Deliverable File:** `phase_6_4_preflight_audit.md`  

---

## 1. Executive Summary

### 1.1 Objective & Scope
This audit conducts an exhaustive preflight inspection of the **Thread Compass** (`/compass`) and **Product Detail** (`/product/:slug`) interaction layers before Phase 6.4 implementation begins. 

The initial roadmap proposed four primary enhancements:
1. Fluid horizontal slide/fade transitions between Compass consultation steps.
2. An animated champagne-thread progress indicator connecting the stepper nodes.
3. Image cross-dissolves in the Product Detail gallery upon thumbnail selection.
4. Smooth height/accordion transitions in Product Detail specification drawers.

In accordance with strict audit directives, this evaluation inspects the active working tree without modifying application code, CSS, tokens, product data (`ET-01`–`ET-07`), or tests. All conclusions are verified against live code, passing unit tests (`228 passed`), production build logs (`dist/`), and genuine Chrome browser screenshots across Desktop (`1440 × 900`), Tablet (`1024 × 768`), and Mobile (`390 × 844`).

### 1.2 Overall Assessment
The existing codebase is substantially more mature, stable, and functionally complete than previously assumed:
- **Thread Compass:** Features a complete 5-phase guided consultation, robust deterministic matching algorithm (`compassMatcher.ts`), stepper navigation with history support, full mobile responsiveness, and transparent content integrity disclosures. Steps swap instantaneously via React conditional mounting without animation; no champagne-thread SVG trace is present.
- **Product Detail:** Implements dynamic aspect-ratio containment (`gallery-main-wrap--landscape` with `object-fit: contain` on neutral stone surface), perfectly integrates approved portrait model assets for `ET-03` and `ET-04`, manages state-synchronized swatch/size matrix selectors, and enforces commerce invariants with `CartContext` and `SavedContext`. Accordions and gallery images toggle instantaneously; a legacy CSS rule (`transition: opacity 0.3s ease`) exists on the main image, but because React updates the `img.src` synchronously without toggling opacity from `0` to `1`, no visible cross-dissolve occurs in practice.
- **Discovered Defect (Material Symbols Ligature Vulnerability):** In both `CompassPage.tsx` and `ProductDetailPage.tsx`, several action buttons and badges render plain text ligatures (`verified`, `bookmark`, `bookmark_border`, `arrow_forward`, `tune`, `refresh`, `arrow_back`, `expand_more`) inside `<span className="material-symbols-outlined">`. If the webfont fails, stalls, or renders in fallback mode, these appear as literal text strings (identical to the defect previously resolved in Phase 6.3.2.2.1 on the Archive).

### 1.3 Recommendation
**SCOPED GO**: Proceed with Phase 6.4 under a tightly controlled, minimal scope. Only implement verified gaps (CSS-driven accordion height animation, CSS-based gallery cross-dissolve, subtle slide/fade for Compass steps with reduced-motion overrides, and ligature icon hardening). Strictly forbid changes to product data, catalogue attributes, or recommendation logic.

---

## 2. Code Inventory & Architectural Baseline

| File Path | Role & Primary Responsibility | Line Count | Key Components / Functions | Test Coverage |
|---|---|---|---|---|
| `src/pages/CompassPage.tsx` | Guided 5-phase interactive textile consultation page | 659 | `CompassPage`, `handleSelectFabric`, `handleSelectMovement`, `handleSelectCraft`, `handleSelectStory`, `safeScrollToTop` | Covered in `src/tests/compass.test.tsx` (17 tests) |
| `src/utils/compassMatcher.ts` | Deterministic attribute matching engine & data options | 143 | `matchProductsToPreferences`, `FABRIC_OPTIONS`, `MOVEMENT_OPTIONS`, `CRAFT_OPTIONS`, `STORY_OPTIONS` | Covered in `src/tests/compass.test.tsx` |
| `src/pages/ProductDetailPage.tsx` | Archival garment detail view with gallery, swatches, accordions | 735 | `ProductDetailPage`, `toggleAccordion`, `handleAddToBag`, `activeImageIndex`, `openAccordions` | Covered in `src/tests/product-detail.test.tsx` (18 tests) |
| `src/data/products.ts` | Authoritative 7-garment catalog (`ET-01` through `ET-07`) | 337 | `PRODUCTS`, `getProductById`, `getProductBySlug`, `getProductsByCategory` | Core catalog invariant |
| `src/data/assetMap.ts` | Approved asset mappings, dimensions, responsive variants | 458 | `PRODUCT_ASSET_MAP`, `TRADITION_ASSET_MAP`, `ResponsiveImage` | Core asset invariant |
| `src/styles/main.css` | Global styling, design tokens, layout, typography, components | 2,120 | `.compass-stepper`, `.compass-step-pill`, `.compass-option-card`, `.gallery-main-img`, `.accordion-editorial-btn` | Tested visually & via build |
| `src/context/CartContext.tsx` | Global bag state, item accumulation, quantity tracking | 120 | `CartProvider`, `useCart`, `addToBag`, `cartCount` | Integrated commerce invariant |
| `src/context/SavedContext.tsx` | Wishlist / saved pieces persistence | 85 | `SavedProvider`, `useSaved`, `toggleSaved`, `isSaved` | Integrated commerce invariant |

### Baseline Verification Status
- **TypeScript Compiler (`npx tsc --noEmit`):** Exit Code `0` (Zero type errors).
- **Vitest Suite (`npm test -- --run`):** Exit Code `0` (12 test suites, 228 tests passed).
- **Vite Production Build (`npm run build`):** Exit Code `0` (Clean build in 3.62s; JS chunk: 640.35 kB, CSS bundle: 285.36 kB).

---

## 3. Thread Compass Current State

### 3.1 Stepper Architecture & Transition Mechanism
The Thread Compass renders steps 1 through 5 using conditional React rendering inside `src/pages/CompassPage.tsx`:
```tsx
{currentStep === 1 && ( <div data-testid="compass-step-1">...</div> )}
{currentStep === 2 && ( <div data-testid="compass-step-2">...</div> )}
{currentStep === 3 && ( <div data-testid="compass-step-3">...</div> )}
{currentStep === 4 && ( <div data-testid="compass-step-4">...</div> )}
{currentStep === 5 && ( <div data-testid="compass-step-5">...</div> )}
```
- **Observed Behavior:** When the user clicks "Continue" (`button[data-testid="step-continue-btn"]`) or "Back" (`button[data-testid="step-back-btn"]`), `currentStep` increments or decrements. The previous step unmounts instantly and the next step mounts instantly in the DOM.
- **Scroll Behavior:** A helper `safeScrollToTop()` is invoked on step transitions, executing `window.scrollTo({ top: 0, behavior: 'smooth' })`.
- **Transitions / Animations:** There are **no CSS transitions, no opacity fades, no horizontal slide transforms, and no GSAP timelines** applied to the step wrappers.

### 3.2 Visual Movement & Browser Observations
Browser verification at `1440 × 900` confirms:
1. Stepping between Phase 01 (`Fabric & Fiber`), Phase 02 (`Movement & Form`), and Phase 03 (`Hands & Craft`) creates an immediate visual swap.
2. The page content shifts immediately to the new form fields while the viewport smoothly scrolls to top.
3. Stepper navigation bar (`nav.compass-stepper`) updates node numbers: completed steps show bronze circle badges with `✓`, the active step has a bold serif number with a bottom accent bar, and future steps are muted and disabled.
4. There is no horizontal sliding track, carousel, or animated champagne thread between pills.

### 3.3 State Model & Preference Persistence
The state model is maintained cleanly via React hooks:
```tsx
const [currentStep, setCurrentStep] = useState<number>(1);
const [preferences, setPreferences] = useState<CompassPreferences>({
  fabric: undefined,
  movement: undefined,
  craft: undefined,
  story: undefined
});
```
- **State Retention:** When the user advances to Step 3 and then clicks "Back" or clicks a completed stepper pill (`[data-testid="stepper-pill-1"]`), the previously selected option retains its active state (`aria-checked="true"`, `.active` class).
- **Validation Gate:** Advancing to the next step is gated by `isCurrentStepValid`:
  - Step 1 requires `preferences.fabric !== undefined`.
  - Step 2 requires `preferences.movement !== undefined`.
  - Step 3 requires `preferences.craft !== undefined`.
  - Step 4 requires `preferences.story !== undefined`.
- **Reset Capability:** Clicking "Reset" (`handleReset`) completely clears all four preferences and sets `currentStep` to 1.

### 3.4 Reduced-Motion Handling
- Because no CSS transitions or JavaScript animations currently exist on `CompassPage`, `prefers-reduced-motion` is not yet actively utilized in this component.
- The project possesses an approved hook `src/hooks/usePrefersReducedMotion.ts` which is successfully used in `ThreadLoader.tsx` and `WeaveDiagramDrawer.tsx`. Any motion added in Phase 6.4 must integrate this hook or use `@media (prefers-reduced-motion: reduce)` in CSS.

### 3.5 Recommendations Presentation (Step 5)
When Step 4 advances to Step 5, `matchProductsToPreferences(preferences)` computes affinity scores across all 7 products in `PRODUCTS`:
- **Affinity Bar:** Displays four summary pills (`Fiber`, `Form`, `Craft`, `Lineage`) with chosen labels.
- **Heading:** Displays `Recommended Heirlooms (N)` with subtitle `Deterministic attribute rank • Ranked by affinity score`.
- **Content Integrity Banner:** Prominently states:
  > *"Recommendations derive strictly from verified physical textile attributes (fiber purity, weave technique, drape form, and archival story folios). Artisan labor hours and edition counts are curated case-study models."*
- **Recommendation Cards:** Each card renders:
  - Garment primary image from `PRODUCT_ASSET_MAP`.
  - Silhouette name and subtitle.
  - Price valuation (`₹44,000 House Ledger Valuation`).
  - Affinity match score badge (`100% Affinity Match`, `75% Affinity Match`).
  - Match justification pills (e.g. `Matching Fiber: Wild & Raw Sericulture Silk`).
  - Direct links: `Inspect Silhouette & Weave Architecture` and `Explore Artisan Folio`.
  - "Save to Repertoire" bookmark toggle button integrated with `SavedContext`.

### 3.6 Deficiencies Found (Real vs Proposed)
| Feature / Defect | Roadmap Proposed | Verified Reality | Deficiency Status |
|---|---|---|---|
| Step Slide/Fade | Fluid horizontal slide/fade | Instant unmount/mount swap | **Missing (Optional Enhancement)**: Functional without it, but lacks luxury softness |
| Champagne-Thread Trace | Connected progress thread | Individual stepper pills | **Missing (Optional Enhancement)**: Current stepper is functional, but lacks editorial line art |
| Option Selection & Persistence | Store user choices | Fully implemented & tested | **Already Satisfied**: Back navigation preserves selections |
| Deterministic Matching | Attribute-based ranking | Pure deterministic function | **Already Satisfied**: 100% deterministic, zero AI |
| Material Symbols Ligatures | Not identified in roadmap | Text ligatures in buttons | **Genuine Vulnerability (Required Fix)**: `verified`, `arrow_forward`, `tune`, `refresh`, `arrow_back` risk text flashes |

---

## 4. Product Detail Current State

### 4.1 Gallery Architecture & Dissolve Mechanism
The Product Detail gallery (`src/pages/ProductDetailPage.tsx`) renders the primary active image and a row of thumbnails:
```tsx
<div className={`gallery-main-wrap ${isLandscape ? 'gallery-main-wrap--landscape' : ''}`} data-testid="gallery-main-container">
  <img
    src={currentImage.src}
    alt={currentImage.alt}
    width={currentImage.width}
    height={currentImage.height}
    className={`gallery-main-img ${isLandscape ? 'gallery-main-img--contain' : ''}`}
    data-testid="gallery-main-image"
  />
</div>
```
- **Thumbnail Interaction:** Clicking thumbnail index `idx` triggers `setActiveImageIndex(idx)`. React re-renders with `currentImage = galleryImages[idx]`.
- **Cross-Dissolve Analysis:** In `src/styles/main.css`, line 1572:
  ```css
  .gallery-main-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: opacity 0.3s ease;
  }
  ```
  While `transition: opacity 0.3s ease` is written in CSS, **no cross-dissolve occurs in practice**. When thumbnail index changes, React updates `src` directly on the existing `<img>` DOM node without changing `opacity`. The browser immediately paints the new image as soon as it decodes, resulting in an instantaneous cut.

### 4.2 Image Sizing, Aspect Ratios & Containment
The gallery dynamically inspects image dimensions from `PRODUCT_ASSET_MAP`:
```tsx
const isLandscape = currentImage.width > currentImage.height;
```
- **Portrait Images:** Default to `object-fit: cover` within the high-aspect container.
- **Landscape Images:** Receive `.gallery-main-wrap--landscape` and `.gallery-main-img--contain`, which enforces `object-fit: contain` inside a neutral-toned stone frame (`--color-surface-container-low`). This prevents unwanted zooming or cropping of landscape lay-flat compositions.

### 4.3 Approved Model Asset Verification
Verified in `src/data/assetMap.ts` lines 14–48:
- **`ET-03` (Architectonic Zari Waistcoat):**
  - Primary image: `/images/products/et-03-zari-waistcoat-model-01.webp` (`1024 × 1536`, portrait model shot).
  - Gallery Index 0: `et-03-zari-waistcoat-model-01.webp` (Primary portrait model).
  - Gallery Index 1: `et-03-zari-waistcoat-stilllife-01.webp` (Front architecture on stone).
  - Gallery Index 2: `et-03-zari-waistcoat-back.webp` (Back tailoring on stone).
  - Gallery Index 3: `et-03-zari-waistcoat-macro-01.webp` (Kadwa zari button close-up).
- **`ET-04` (Pleated Indigo Chanderi Tunic):**
  - Primary image: `/images/products/et-04-chanderi-tunic-model-01.webp` (`1024 × 1536`, portrait model shot).
  - Gallery Index 0: `et-04-chanderi-tunic-model-01.webp` (Primary portrait model).
  - Gallery Index 1: `et-04-chanderi-tunic-drape-01.webp` (Micro-knife pleats drape).
  - Gallery Index 2: `et-04-chanderi-tunic-flatlay-01.webp` (Full garment flatlay).
  - Gallery Index 3: `et-04-chanderi-tunic-macro-01.webp` (Hand-carved mother-of-pearl closures).

### 4.4 Accordion Architecture & Height Transitions
The Product Detail specification drawers are managed via `openAccordions` state:
```tsx
const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({
  specs: true,
  care: false,
  allocation: false,
  integrity: false
});

const toggleAccordion = (section: string) => {
  setOpenAccordions(prev => ({ ...prev, [section]: !prev[section] }));
};
```
- **Mounting Mechanism:** The drawer content is conditionally rendered in JSX:
  ```tsx
  {openAccordions.specs && (
    <div id="accordion-body-specs" className="accordion-editorial-body body-sm" data-testid="accordion-content-specs">
      ...
    </div>
  )}
  ```
- **Observed Behavior:** Clicking the accordion header button instantaneously mounts or unmounts the child element. There is **no CSS height animation, no `grid-template-rows: 0fr -> 1fr` transition, and no JavaScript slide down/up**.
- **Accessibility:** `aria-expanded` and `aria-controls` are correctly synchronized with component state.

### 4.5 Commerce & Variant Invariants
- **Size Selection:** Dynamic selector adapts to product category (garments show `I (XS-S)`, `II (M)`, `III (L-XL)`; accessories show `One Size`).
- **Color Selection:** Interactive swatches update `selectedColor` state and reflect active border.
- **Quantity Control:** Stepper buttons increment/decrement between 1 and available limit.
- **Add to Bag:** Dispatches to `CartContext.addToBag()` and displays brief success toast (`data-testid="added-to-bag-toast"`).
- **Save Piece:** Integrates with `SavedContext.toggleSaved()` with persistent heart/bookmark state.
- **Size Guide Modal:** Accessible modal drawer triggered by `Size Matrix Guide` button.

### 4.6 Deficiencies Found (Real vs Proposed)
| Feature / Defect | Roadmap Proposed | Verified Reality | Deficiency Status |
|---|---|---|---|
| Gallery Cross-Dissolve | Image cross-dissolves | Instantaneous `src` cut | **Missing (Optional Enhancement)**: CSS transition exists but does not trigger |
| Accordion Smooth Transition | Smooth height animation | Instant mount/unmount | **Missing (Optional Enhancement)**: Functional, but feels abrupt |
| Model Image Quality | Ensure approved portraits | ET-03 & ET-04 use approved portraits | **Already Satisfied**: Verified in code and visual QA |
| Commerce Invariants | Preserve bag and saved state | Fully integrated & tested | **Already Satisfied**: 100% operational |
| Material Symbols Ligatures | Not identified in roadmap | Plain text ligatures in buttons | **Genuine Vulnerability (Required Fix)**: `shopping_bag`, `bookmark`, `expand_more` risk text flashes |

---

## 5. Visual QA Evidence

All 10 required screenshots were captured using Chrome DevTools Protocol against the local production build running on `http://localhost:4173`. Each capture was taken after waiting for `ThreadLoader` unmounting to eliminate ghost loader artifacts.

| # | Screenshot Filename | Viewport | Target Route / State | File Size | Key Visual Observations |
|---|---|---|---|---|---|
| 1 | `01_compass_step1_desktop_1440x900.png` | 1440 × 900 | `/compass` — Step 1 Initial | 125.9 KB | Serif hero title, 5-pill stepper (`01` active with dark accent bar), 3 fabric cards, clean ivory background, zero layout shift. |
| 2 | `02_compass_step1_mobile_390x844.png` | 390 × 844 | `/compass` — Step 1 Mobile | 70.3 KB | Responsive single-column card stacking, horizontal stepper scrolling with fade boundary, sticky header intact. |
| 3 | `03_compass_step3_desktop_1440x900.png` | 1440 × 900 | `/compass` — Step 3 Intermediate | 137.5 KB | Stepper pills `01` and `02` show completed bronze checkmark badges (`✓`), `03` is active, Kadwa Zari card selected with radio indicator. |
| 4 | `04_compass_step5_recommendations_desktop_1440x900.png` | 1440 × 900 | `/compass` — Step 5 Results | 113.0 KB | All 4 steps checked in stepper, curated affinity summary bar (Fiber, Form, Craft, Lineage), Content Integrity disclosure banner, 7 ranked cards. |
| 5 | `05_compass_step5_recommendations_mobile_390x844.png` | 390 × 844 | `/compass` — Step 5 Results Mobile | 57.9 KB | Affinity tags wrap neatly, integrity notice legible, action buttons full-width touch targets (min 44px height). |
| 6 | `06_product_detail_initial_desktop_1440x900.png` | 1440 × 900 | `/product/the-architectonic-zari-waistcoat` | 811.9 KB | Left column: Approved portrait model photo (`1024 × 1536`) with `EDITORIAL SILHOUETTE` badge. Right column: Title, ₹44,000 price, swatches, bespoke CTA. |
| 7 | `07_product_detail_changed_gallery_desktop_1440x900.png` | 1440 × 900 | `/product/the-architectonic-zari-waistcoat` | 923.3 KB | Thumbnail 1 clicked: Main image switched to `Front Architecture` still life on stone. Active thumbnail highlighted with dark border. |
| 8 | `08_product_detail_expanded_accordion_desktop_1440x900.png` | 1440 × 900 | `/product/the-architectonic-zari-waistcoat` | 988.4 KB | Accordions expanded: `Textile Architecture & Weave Specifications`, `Conservation & Archival Care`, and `Commission Terms & Allocation` all open simultaneously. |
| 9 | `09_product_detail_tablet_1024x768.png` | 1024 × 768 | `/product/the-architectonic-zari-waistcoat` | 535.8 KB | Tablet layout: 2-column grid adapts cleanly; gallery column and product specs maintain balanced proportions. |
| 10 | `10_product_detail_mobile_390x844.png` | 390 × 844 | `/product/the-architectonic-zari-waistcoat` | 316.9 KB | Mobile layout: Hero model image stacked above 4-thumbnail row; size swatches and primary Acquire CTA touch targets accessible. |

### Visual Integrity Summary
- **No layout overflow:** No unintended horizontal scrollbars observed at 1440px, 1024px, or 390px.
- **No text truncation:** Headings and paragraphs render without clipping.
- **Typography hierarchy:** Strict serif headline (`Cinzel` / `Playfair Display`) and clean body (`Plus Jakarta Sans`) pairing maintained across all viewports.
- **Asset Fidelity:** Model imagery for `ET-03` is sharp, authentic, and correctly framed.

---

## 6. Classification Matrix of Proposed Phase 6.4 Items

| Proposed Item | Target Component / Area | Classification | Justification & Implementation Constraints |
|---|---|---|---|
| **1. Horizontal slide/fade between Compass steps** | `CompassPage.tsx`, `main.css` | **Optional** | Current immediate mounting is functional, deterministic, and passes all tests. A gentle slide/fade will elevate the luxury feel, but MUST respect `prefers-reduced-motion` and must not cause focus loss or DOM unmount delays during rapid clicking. |
| **2. Champagne-thread progress indicator** | `CompassPage.tsx`, `main.css` | **Optional** | Stepper pills currently indicate state (`completed`, `active`, `disabled`) with numbers and checkmarks. An SVG connecting thread between nodes is an aesthetic luxury detail; must be marked `aria-hidden="true"`. |
| **3. Product Detail gallery image cross-dissolve** | `ProductDetailPage.tsx`, `main.css` | **Optional** | Current instant image replacement functions cleanly. A subtle cross-dissolve (e.g. 250ms opacity transition) adds polish. Must avoid flash of transparent background or layout shifts between portrait/landscape images. |
| **4. Smooth Product Detail accordion transitions** | `ProductDetailPage.tsx`, `main.css` | **Optional** | Current instant toggle is accessible and functional. A pure CSS `grid-template-rows: 0fr -> 1fr` transition provides smooth expansion without complex JavaScript height calculations or layout thrashing. |
| **5. Material Symbols SVG Icon Hardening** | `CompassPage.tsx`, `ProductDetailPage.tsx` | **Required** | **Critical Defect**: Plain-text ligature strings (`verified`, `bookmark`, `bookmark_border`, `arrow_forward`, `tune`, `refresh`, `arrow_back`, `expand_more`) risk displaying as raw unrendered text words if font loads slowly. Must be replaced with tested inline SVG icons matching Phase 6.3.2.2.1. |
| **6. Modifications to Recommendation Matcher** | `compassMatcher.ts` | **Blocked / Prohibited** | The deterministic scoring logic is verified, covered by unit tests, and satisfies all requirements. Absolutely no changes permitted. |
| **7. Modifications to Product Data or Pricing** | `products.ts`, `assetMap.ts` | **Blocked / Prohibited** | All 7 products (`ET-01`–`ET-07`), descriptions, prices, and asset mappings are approved and protected. |

---

## 7. Architectural Invariants to Protect

During Phase 6.4, the following assets and modules must be strictly protected:

1. **Approved Product Catalogue (`src/data/products.ts`):**
   - Products `ET-01` through `ET-07` must retain exact IDs, names, categories, prices, fiber compositions, and craft attributes.
2. **Approved Asset Mapping (`src/data/assetMap.ts`):**
   - Primary model shot for `ET-03` must remain `et-03-zari-waistcoat-model-01.webp` (`1024 × 1536`).
   - Primary model shot for `ET-04` must remain `et-04-chanderi-tunic-model-01.webp` (`1024 × 1536`).
   - All 4 gallery thumbnails for each product must retain their approved paths and aspect ratios.
3. **Deterministic Recommendation Logic (`src/utils/compassMatcher.ts`):**
   - Pure attribute matching function `matchProductsToPreferences` must not be altered.
   - Zero non-deterministic heuristics or pseudo-AI additions.
4. **Content Integrity Notices & Disclaimers:**
   - Both the Compass Step 5 disclaimer and the Product Detail allocation notes must be preserved verbatim.
5. **Commerce & Archival Integration:**
   - `useCart().addToBag()` and `useSaved().toggleSaved()` contracts must remain intact.
   - Route slugs (`/product/:slug`, `/compass`, `/archive`) must remain unchanged.
6. **Existing Unit Test Suite:**
   - All 228 passing tests must continue to pass without regression.

---

## 8. Proposed Phase 6.4 Implementation Scope

Based strictly on verified gaps, the minimal implementation scope for Phase 6.4 consists of:

### 8.1 Files to Modify
1. `src/pages/CompassPage.tsx`:
   - Replace raw Material Symbols ligatures with tested inline SVGs (`verified`, `arrow_forward`, `arrow_back`, `refresh`, `tune`, `bookmark`, `bookmark_border`).
   - Add transition wrapper classes to the step content container (`compass-step-panel compass-step-panel--enter`).
   - Enhance the stepper indicator with a subtle champagne connecting line SVG (`aria-hidden="true"`).
2. `src/pages/ProductDetailPage.tsx`:
   - Replace raw Material Symbols ligatures with inline SVGs (`shopping_bag`, `bookmark`, `bookmark_border`, `expand_more`, `verified`).
   - Refactor accordion container to keep content mounted in DOM and animate height cleanly using modern CSS Grid (`grid-template-rows: 0fr -> 1fr`).
   - Refactor gallery image container with a two-image or CSS cross-fade animation so image transitions dissolve gently over 250ms without blank flashes.
3. `src/styles/main.css`:
   - Add CSS rules for `.compass-step-panel` (slide/fade keyframe animations with `prefers-reduced-motion` override to `opacity: 1; transform: none`).
   - Add CSS rules for `.accordion-editorial-content` using `display: grid; grid-template-rows: 0fr; transition: grid-template-rows 0.3s cubic-bezier(0.16, 1, 0.3, 1)`.
   - Add gallery cross-dissolve animation classes.

### 8.2 Files That Must NOT Be Touched
- `src/data/products.ts` (Frozen)
- `src/data/assetMap.ts` (Frozen)
- `src/utils/compassMatcher.ts` (Frozen)
- `src/context/CartContext.tsx` (Frozen)
- `src/context/SavedContext.tsx` (Frozen)
- `src/components/ThreadLoader.tsx` (Frozen)
- `src/components/ExhibitionModal.tsx` (Frozen)

### 8.3 Verification & Test Plan
- Run `npx tsc --noEmit` -> Expect 0 errors.
- Run `npm test -- --run` -> Expect all 228 existing tests + new interaction tests to pass.
- Run `npm run build` -> Expect production build to complete in under 5s with clean chunks.
- Capture new visual QA screenshots across Desktop, Tablet, and Mobile to verify smooth transitions and absence of text ligature artifacts.

---

## 9. Risk Assessment

| Risk | Likelihood | Impact | Mitigation Strategy |
|---|---|---|---|
| **Accordion Layout Thrashing** | Medium | Medium | Avoid JavaScript height measurement (`element.scrollHeight`). Use CSS Grid `grid-template-rows: 0fr -> 1fr` which runs on compositor and requires zero layout recalculations. |
| **Gallery Cross-Fade Ghosting / Blank Flash** | Medium | High | Maintain background color `--color-surface-container-low` on container; cross-fade active image using CSS keyframes or subtle opacity layer so the outgoing image remains visible until the incoming image loads. |
| **Focus Loss During Step Transitions** | Low | High | When transitioning Compass steps, retain focus on the step container or the primary heading via React `ref` or native focus management. |
| **Reduced-Motion Violations** | Low | Medium | Enforce `@media (prefers-reduced-motion: reduce)` in CSS, collapsing transition times to `0.01ms` and disabling all `translateX` transforms. |
| **Icon Ligature Regression** | High | High | Completely eliminate `<span className="material-symbols-outlined">text</span>` in modified files by replacing them with inline SVGs containing `aria-hidden="true"`. |

---

## 10. Accessibility Assessment (WCAG 2.1 AA Compliance)

### 10.1 Thread Compass
- **Radio Semantics:** Options utilize `role="radiogroup"` with child `role="radio"` and `aria-checked={isSelected}`. Fully operable via Space and Enter keys.
- **Stepper Semantics:** Steps use `aria-current="step"` on active pill and `disabled` on unreached steps. Completed steps remain keyboard-accessible buttons to allow backtracking.
- **Contrast Ratios:** Text colors `--color-oxblood` (`#2A1810`) and `--color-on-surface` on `--color-canvas` (`#F7F4EE`) exceed `7:1` contrast ratio, surpassing WCAG AAA requirements.
- **Touch Targets:** Option cards are large cards (>100px height); stepper pills are `44px` tall; navigation buttons are `48px` tall.

### 10.2 Product Detail
- **Accordions:** Headers use `<button className="accordion-editorial-btn" aria-expanded={isOpen} aria-controls="accordion-body-section">`.
- **Thumbnail Strip:** Thumbnails use `<button className="gallery-thumb-btn" aria-label="View image N: Description" aria-pressed={isActive}>`.
- **Variant Selectors:** Color swatches and size buttons have explicit text labels and clear active focus rings.
- **Live Regions:** Add to Bag feedback is announced via an accessible status container (`role="status"`).

---

## 11. Performance Baseline

- **Vite Production Build Time:** `3.62 seconds`.
- **CSS Bundle Size:** `285.36 kB` (`40.41 kB` gzipped).
- **JavaScript Bundle Size:** `640.35 kB` (`170.85 kB` gzipped).
- **Test Suite Execution:** 12 suites, 228 unit tests pass in `2.92 seconds`.
- **Image Optimization:** All product assets are modern WebP images with explicit width and height attributes, preventing Cumulative Layout Shift (CLS).
- **Runtime Console:** 0 uncaught exceptions or React warnings during automated browser traversal.

---

## 12. Recommendation & Sign-Off

### 12.1 Preflight Conclusion
The EverThread Thread Compass and Product Detail pages are architecturally sound, thoroughly tested, and visually aligned with the house's luxury aesthetic. The roadmap's proposed transitions are **desirable polish enhancements**, not structural fixes. The only **required defect fix** is replacing fragile font-ligature icon strings with robust inline SVGs.

### 12.2 Sign-Off
- [x] Baseline commands verified (`tsc`, `vitest`, `vite build`).
- [x] Code inspection completed for all Compass and Product Detail files.
- [x] 10 real browser screenshots captured across 3 viewports and inspected.
- [x] Classification matrix completed with explicit justifications.
- [x] Protected invariants catalogued.
- [x] Minimal implementation scope and risk mitigations established.
- [x] Zero application source code modified during this audit phase.

**Official Status:** **READY FOR SCOPED PHASE 6.4 IMPLEMENTATION** upon user instruction.
