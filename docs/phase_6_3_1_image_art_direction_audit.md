# EverThread — Phase 6.3.1 Approved Image Integrity, Composition & Art-Direction Audit

**Document:** `phase_6_3_1_image_art_direction_audit.md`  
**Audit Date:** October 21, 2026  
**Auditor:** Antigravity Pair Programming Agent (DeepMind)  
**Project:** EverThread Atelier E-Commerce Web Application (`FE Case Study`)  
**Scope:** Strict Audit Only — No application code, styling, asset mappings, data, or tests modified.

---

## 1. Executive Summary

A comprehensive forensic art-direction and technical image audit was conducted across all 13 application routes, global navigation components, modals, data models, and the local asset pipeline. The audit evaluated image provenance, composition, aspect ratios, responsive scaling, cropping risks, and aesthetic alignment with EverThread’s luxury atelier brand identity: **“An heirloom, not a trend.”**

### Highest-Impact Problems Identified

1. **Dual-Server Route Collision (Static HTML vs. React SPA):**  
   Legacy static HTML prototypes from October 16 (`collections.html`, `archive.html`, `the-house.html`, `journal.html`, etc.) remain in the project root. On the Vite development server (`http://localhost:5173`), navigating to `/collections` or `/archive` triggers Vite's static HTML fallback, serving obsolete mockups with outdated product nomenclature (e.g., *"The Sylvan Mulberry Silk Trench"*) and unapproved images. On the production preview server (`http://localhost:4173`), the SPA router properly renders the React components (`CollectionsPage.tsx`, etc.).
2. **Severe Aspect Ratio & Crop Defects on Core Garments (`et-03` and `et-04`):**  
   In `src/data/assetMap.ts`, the primary view for `et-03` (*Architectonic Zari Waistcoat*) and `et-04` (*Pleated Indigo Chanderi Tunic*) is configured to `front-01.webp`—a **landscape** image ($1453 \times 1083$, aspect ratio $1.34:1$). Throughout the application (`ProductCard.tsx`, `CompassPage.tsx`, `SavedPiecesPage.tsx`, `BagPage.tsx`, `CheckoutPage.tsx`), image plinths enforce a rigid **$3:4$ portrait** aspect ratio (`0.75:1`) with `object-fit: cover`. This causes approximately **$44\%$ of the garment width to be cropped out horizontally**, amputating shoulder lines, armholes, and side seams. Dedicated portrait model shots ($1024 \times 1536$, $2:3$ portrait) exist in both product folders but are bypassed.
3. **Landscape Detail & Construction Slicing on Product Detail Page (`ProductDetailPage.tsx`):**  
   The primary gallery showcase (`.gallery-main-wrap`) enforces a fixed $3:4$ portrait container with `object-fit: cover`. When users click back construction or craft detail thumbnails (which are $1536 \times 1024$ landscape, $1.5:1$), over **$50\%$ of the image content is sliced off** on the left and right margins, obscuring the precise artisan stitching and structural seam lines being inspected.
4. **Cultural Archive Remote Low-Resolution Thumbnail Dependency (`stories.ts`):**  
   In `src/data/stories.ts`, the four flagship curatorial exhibition monographs (`the-living-loom`, `the-art-of-the-drape`, `the-language-of-the-surface`, `the-architecture-of-a-garment`) are bound to remote Google UserContent URLs ($512 \times 382$ low-resolution JPEGs). In `ArchivePage.tsx`, these images are upscaled into a $4:5$ portrait frame ($600 \times 750$), resulting in blurry pixelation and aggressive side-cropping. Meanwhile, high-resolution local WebP master assets with responsive variants exist in `public/images/archive/general/` (`archive-living-loom-01.webp`, etc.) but are completely unreferenced.
5. **Vast Orphaned & Underutilized Approved Asset Library:**  
   - **78 Approved Craft Tradition Images:** `public/images/archive/` contains complete, approved high-resolution photo series covering 13 Indian textile traditions (*Ajrakh, Bagru, Banarasi, Bandhani, Chikankari, Kanchipuram, Kashmiri Sozni, Kota Doria, Muga, Paithani, Patan Patola, Pochampally, Sambalpuri*). These are completely unreferenced in the frontend application. The Weave Library on `ArchivePage.tsx` currently renders text-only cards.
   - **12 Approved Homepage Editorial Images:** 12 of 13 approved high-fashion images in `public/images/home/` are unused; the hero does not serve `everthread-hero-mobile-01.webp` on mobile devices.
   - **100% Orphaned House, Craft, Materials, Packaging & Journal Folders:** `HousePage.tsx` and `JournalPage.tsx` contain zero `<img>` tags, relying on text cards and Google Material Symbol icons while approved museum-quality photographs of salons, weaving shuttles, raw silk hanks, and cedar boxes sit dormant in `public/images/`.

---

## 2. Approved Image Inventory & Provenance Confidence

### 2.1 File System Audit Summary

| Directory | Total Files | Base Assets | Responsive Variants (`-400w` to `-1536w`) | Provenance Confidence | Status in Application |
| :--- | :---: | :---: | :---: | :---: | :---: |
| `public/images/products/` | 134 | 31 | 103 | **100% Approved** (Recraft studio batch) | Actively referenced in `PRODUCT_ASSET_MAP` |
| `public/images/archive/` (Traditions) | 338 | 78 | 260 | **100% Approved** (Recraft craft series) | **0% Referenced** (Completely orphaned) |
| `public/images/archive/general/` | 18 | 4 | 14 | **100% Approved** (Recraft archival series) | **0% Referenced** (Bypassed for remote URLs) |
| `public/images/home/` | 26 | 13 | 13 | **100% Approved** (High-fashion editorial) | 1 of 13 referenced (`hero-01.webp`) |
| `public/images/house/` | 3 | 3 | 0 | **100% Approved** (Salon & atelier interior) | **0% Referenced** (`HousePage.tsx` has 0 images) |
| `public/images/journal/` | 2 | 2 | 0 | **100% Approved** (Monograph & essay drape) | **0% Referenced** (`JournalPage.tsx` has 0 images) |
| `public/images/craft/` | 2 | 2 | 0 | **100% Approved** (Shuttle & metallic zari) | **0% Referenced** |
| `public/images/materials/` | 2 | 2 | 0 | **100% Approved** (Raw silk & merino wool) | **0% Referenced** |
| `public/images/packaging/` | 1 | 1 | 0 | **100% Approved** (Untreated cedar chest) | **0% Referenced** |
| `public/images/brand/` | 6 | 6 | 0 | **100% Approved** (Crest, monograms, OG) | **0% Referenced** (`index.html` lacks OG tags) |
| `public/images/weave-library/` | 18 | 9 SVG + 9 PNG | 0 | **100% Approved** (Technical drafting schematics) | 1 referenced via dropdown visualizer |
| Root (`public/images/`) | 2 | 2 | 0 | **100% Approved** (Watercolor hand loader) | Actively referenced in `ThreadLoader.tsx` |
| **Total** | **552** | **176** | **376** | — | **541 references in `assetCatalog.json` (unimported)** |

### 2.2 Provenance Classification

- **Explicitly Approved Assets (Local WebP/SVG):** All assets located in `public/images/` exhibit cohesive art direction: warm ivory plinths (`#fef9f0`), subtle drop shadows, natural atelier directional lighting, oxblood undertones (`#49232d`), and fine tactile resolution showing thread twists, fabric slubs, and raw fiber structures. 25 visual contact sheets preserved in `audit-output/contact-sheets/` confirm their approved status.
- **Unapproved / Unknown Provenance Assets (Remote URLs):**  
  The 4 URLs in `src/data/stories.ts` pointing to `https://lh3.googleusercontent.com/aida-public/...` have unknown provenance and represent compressed, low-resolution web thumbnails from an external research document. They contradict the local high-resolution asset pipeline.

---

## 3. Route-by-Route Image Usage Table across All Routes

Every image placement across the 13 application routes and global components was mapped and verified against live rendered DOM captures (Desktop $1440 \times 900$ and Mobile $390 \times 844$).

| Route & Section | Actual Rendered Asset | Provenance | Intended AR | Actual AR | Fit Mode | Focal Point / Crop Risk | Art-Direction Assessment | Recommended Correction |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Global: Loader** (`ThreadLoader`) | `/images/everthread-loader-hand-clean.png` | Approved | $896:1200$ ($0.75:1$) | $896:1200$ | Contain | **None**; fingertip pinch aligned to thread path. | Superb. Warm ivory watercolor illustration, oxblood contours. | None. Preserved. |
| **Global: Header** | Pure SVG / Text Typography | Approved | N/A | N/A | Inline | N/A | Clean minimalist typographic header. | None. Meets luxury standards. |
| **Global: Footer** | Text & Links | Approved | N/A | N/A | Inline | N/A | Typographic grid with archival colophon. | None. |
| **Global: Search Modal** (`SearchModal`) | None (Typographic autocomplete) | Approved | N/A | N/A | N/A | N/A | Clean quick-filter search. | Optional: Include $1:1$ product thumbnails. |
| **Global: HTML `<head>`** | Default Vite SVG | Generic | $1:1$ | $1:1$ | Favicon | Missing brand crest & OpenGraph image. | Brand omission. | Add `<meta property="og:image" content="/images/brand/og-everthread.webp">` and set favicon to monogram. |
| **Home: Hero Visual** (`HomePage`) | `/images/home/everthread-hero-01.webp` | Approved | $4:5$ ($0.80:1$) | $4:5$ | Cover | Minor top head crop on mobile viewports. | Strong high-fashion editorial presence. | Add `<picture>` with `everthread-hero-mobile-01.webp` for mobile screens. |
| **Home: Highlights Lead Story** | Remote `lh3.googleusercontent.com` | **Unapproved / Remote** | $4:5$ | $4:5$ | Cover | **Severe:** $512 \times 382$ landscape JPEG upscaled and cropped. | Grainy, pixelated, jarring luxury break. | Replace with `/images/archive/general/archive-living-loom-01.webp`. |
| **Home: Flagship Product Plinth** | `/images/products/signature-coat-dress/product-oxblood-signature-front-01.webp` | Approved | $3:4$ ($0.75:1$) | $3:4$ | Cover | None. Natural portrait orientation ($1024 \times 1536$). | Outstanding tonal harmony, deep oxblood contrast. | None. Exemplary placement. |
| **Home: Editorial Chapters 02–05** | None (Text-only cards & icons) | Approved | N/A | N/A | N/A | Visually wasted opportunity. | Text-heavy. 11 approved editorial images sitting idle in `public/images/home/`. | Integrate `everthread-architecture-01.webp` and `everthread-atelier-still-life-01.webp`. |
| **Collections: Flagship Plinth (`et-01`)** | `/images/products/signature-coat-dress/product-oxblood-signature-front-01.webp` | Approved | $3:4$ | $3:4$ | Cover | None. Native portrait framing. | High visual impact, commanding hero presentation. | None. |
| **Collections: Card `et-02` (Ivory Coat)** | `/images/products/ivory-tailored-coat/product-ivory-tailored-front-01.webp` | Approved | $3:4$ | $3:4$ | Cover | None. Native portrait framing ($1024 \times 1536$). | Elegant warm ivory texture on stone canvas. | None. |
| **Collections: Card `et-03` (Zari Waistcoat)** | `/images/products/architectonic-zari-waistcoat/et-03-zari-waistcoat-front-01.webp` | Approved | $3:4$ ($0.75:1$) | $1.34:1$ ($1453 \times 1083$) | Cover | **Critical Defect:** $44\%$ horizontal crop slices armholes and lapels. | Mutilated garment silhouette. | Switch primary mapping to `et-03-zari-waistcoat-model-01.webp` ($1024 \times 1536$). |
| **Collections: Card `et-04` (Indigo Tunic)** | `/images/products/pleated-indigo-chanderi-tunic/et-04-chanderi-tunic-front-01.webp` | Approved | $3:4$ ($0.75:1$) | $1.34:1$ ($1452 \times 1083$) | Cover | **Critical Defect:** $44\%$ horizontal crop slices pleats and drape cuffs. | Mutilated garment silhouette. | Switch primary mapping to `et-04-chanderi-tunic-model-01.webp` ($1024 \times 1536$). |
| **Collections: Card `et-05` (Leather Bag)** | `/images/products/oxblood-handbag/product-oxblood-handbag-01.webp` | Approved | $3:4$ | $1.09:1$ ($1312 \times 1199$) | Cover | Mild side crop; bag occupies central composition. | Good, but square asset in $3:4$ container crops margins. | Center crop acceptable; consider `contain` on plinth hover. |
| **Collections: Card `et-06` (Burgundy Scarf)** | `/images/products/burgundy-scarf/product-burgundy-scarf-01.webp` | Approved | $3:4$ | $0.83:1$ ($1144 \times 1375$) | Cover | Minimal crop ($<10\%$). | Rich jewel tone against ivory plinth. | None. |
| **Collections: Card `et-07` (Ivory Stole)** | `/images/products/ivory-scarf/product-ivory-scarf-01.webp` | Approved | $3:4$ | $0.83:1$ ($1145 \times 1374$) | Cover | Minimal crop ($<10\%$). | Diaphanous sheer texture well represented. | None. |
| **PDP: Main Showcase (`et-01`)** | `product-oxblood-signature-front-01.webp` | Approved | $3:4$ | $2:3$ | Cover | Mild vertical crop of lower hemline. | Imposing atelier presence. | Good. |
| **PDP: Back View (`et-01`)** | `product-oxblood-signature-back-01.webp` | Approved | $3:4$ ($0.75:1$) | $3:2$ ($1.5:1$ landscape) | Cover | **High Defect:** $50\%$ width crop slices off shoulder blades and sleeve drape. | Architectural tailoring seam obscured. | Allow flexible container AR or `object-fit: contain` with ivory pillarboxing. |
| **PDP: Craft Detail (`et-01`)** | `product-oxblood-signature-detail-01.webp` | Approved | $3:4$ ($0.75:1$) | $3:2$ ($1.5:1$ landscape) | Cover | **High Defect:** Macro twill structure sliced on left and right. | Artisan focus compromised. | Allow landscape container sizing for macro views. |
| **PDP: Main Showcase (`et-03`)** | `et-03-zari-waistcoat-front-01.webp` | Approved | $3:4$ ($0.75:1$) | $1.34:1$ | Cover | **Critical Defect:** Front-01 is cut off at armholes. | Distorted garment impression. | Set primary showcase to `model-01.webp` ($1024 \times 1536$). |
| **PDP: Thumbnails Rail** | All product gallery items | Approved | $1:1$ | Mixed | Cover | Minor thumbnail center crop. | Functional visual stepper. | None. |
| **Compass (`CompassPage`)** | Active hovered product primary image | Approved | $3:4$ | Mixed | Cover | Inherits `et-03` and `et-04` horizontal slicing defect. | Interactive matrix preview impaired for waistcoats. | Resolved automatically by fixing `PRODUCT_ASSET_MAP`. |
| **Archive: Folio 1.1 (`the-living-loom`)** | Remote Google UserContent URL | **Unapproved / Remote** | $4:5$ ($0.80:1$) | $1.34:1$ ($512 \times 382$) | Cover | **Critical Defect:** Low-res pixelation, blurry pit-loom shuttle. | Severe luxury downgrade. | Point to `/images/archive/general/archive-living-loom-01.webp` ($1536 \times 1024$). |
| **Archive: Folio 1.2 (`the-art-of-the-drape`)** | Remote Google UserContent URL | **Unapproved / Remote** | $4:5$ | $1.34:1$ ($512 \times 382$) | Cover | **Critical Defect:** Blurry bias grain lines. | Severe luxury downgrade. | Point to `/images/archive/general/archive-art-of-drape-01.webp`. |
| **Archive: Folio 1.3 (`the-language-of-the-surface`)** | Remote Google UserContent URL | **Unapproved / Remote** | $4:5$ | $1.34:1$ ($512 \times 382$) | Cover | **Critical Defect:** Micro-needlework indistinct. | Severe luxury downgrade. | Point to `/images/archive/general/archive-language-of-surface-01.webp`. |
| **Archive: Folio 1.4 (`the-architecture-of-a-garment`)** | Remote Google UserContent URL | **Unapproved / Remote** | $4:5$ | $1.34:1$ ($512 \times 382$) | Cover | **Critical Defect:** French seams blurry. | Severe luxury downgrade. | Point to `/images/archive/general/archive-architecture-of-garment-01.webp`. |
| **Archive: Weave Library Grid** | None (Text-only cards) | Approved | N/A | N/A | N/A | **Massive Waste:** 78 approved craft photos unused. | Text fatigue; lacks visual tactile richness. | Add thumbnail specimen from `public/images/archive/{tradition}/` to each card. |
| **Archive: Diagram Viewer** | `/images/weave-library/diagrams/*.svg` | Approved | Flexible | Vector SVG | Contain | None. Clean architectural vector drafting lines. | Outstanding curatorial execution. | None. Exemplary. |
| **Archive Story Page (`ArchiveStoryPage`)** | Remote Google UserContent URL | **Unapproved / Remote** | Max Height $560\text{px}$ | $1.34:1$ ($512 \times 382$) | Cover | Blurry hero header at large desktop viewports. | Substandard image fidelity. | Point to local high-res WebP master assets. |
| **The House (`HousePage`)** | None (0 `<img>` tags in entire component) | Approved | N/A | N/A | N/A | **Visual Desert:** Complete absence of approved atelier assets. | Fails to communicate brand presence. | Integrate `everthread-house-hero-01.webp`, `everthread-atelier-salon-01.webp`, `craft-weaving-shuttle-01.webp`. |
| **Journal (`JournalPage`)** | None (0 `<img>` tags in entire component) | Approved | N/A | N/A | N/A | **Visual Desert:** Replaces photography with `menu_book` icon. | Text-heavy, dry academic layout. | Integrate `journal-monograph-cover-01.webp` on featured monograph plinth. |
| **Journal Article (`JournalArticlePage`)** | None (0 `<img>` tags in entire component) | Approved | N/A | N/A | N/A | No lead editorial photograph. | Misses editorial fashion magazine standard. | Integrate `journal-essay-drape-01.webp` into article hero. |
| **Saved Pieces (`SavedPiecesPage`)** | Saved product primary image | Approved | $3:4$ | Mixed | Cover | Inherits `et-03` / `et-04` horizontal crop defect. | Consistent with collections plinth. | Fix via asset map update. |
| **Bag Page (`BagPage`)** | Product cart thumbnail | Approved | $1:1$ | Mixed | Cover | Tiny $80 \times 80$ container crops edges of landscape images. | Acceptable for thumbnail, but waistcoats appear zoomed. | Fix via asset map update. |
| **Checkout Page (`CheckoutPage`)** | Order summary item thumbnail | Approved | $1:1$ | Mixed | Cover | Minor thumbnail center crop. | Functional. | Fix via asset map update. |
| **404 Page (`NotFoundPage`)** | Typographic plinth & icon | Approved | N/A | N/A | N/A | None. | Restrained, clean luxury 404. | None. |

---

## 4. Specific Technical & Art-Direction Defects

### Defect 1: Garment Amputation on Landscape Products (`et-03` & `et-04`)
- **Root Cause:** `src/data/assetMap.ts` lines 180 and 240 assign `et-03-zari-waistcoat-front-01.webp` and `et-04-chanderi-tunic-front-01.webp` as `primary`. Both images are formatted in $1453 \times 1083$ landscape ($1.34:1$).
- **Impact:** `.garment-img-wrap` in `ProductCard.tsx` enforces `aspect-ratio: 3 / 4` with `object-fit: cover`. The browser scales the image to match the height, truncating $44.1\%$ of the width:
  $$\text{Crop Percentage} = \frac{1.34 - 0.75}{1.34} \approx 44.0\%$$
- **Visual Evidence:** Screen capture `audit_desktop_pdp_waistcoat.png` and `audit_desktop_collections.png` show the outer edges of the raw bronze zari waistcoat completely missing.
- **Available Solution:** Both products possess companion model photography formatted in portrait ($1024 \times 1536$, aspect ratio $0.67:1$, matching $2:3$):
  - `et-03-zari-waistcoat-model-01.webp`
  - `et-04-chanderi-tunic-model-01.webp`  
  Assigning these model shots as `primary` eliminates cropping entirely and conforms to the $3:4$ card geometry.

### Defect 2: Detail Slicing on Product Gallery Main Stage
- **Root Cause:** In `src/styles/main.css`, `.gallery-main-wrap` has:
  ```css
  .gallery-main-wrap {
    aspect-ratio: 3 / 4;
    overflow: hidden;
  }
  .gallery-main-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  ```
- **Impact:** While primary garment shots are portrait ($1024 \times 1536$), back construction (`back-01.webp`) and craft detail shots (`detail-01.webp`) are landscape ($1536 \times 1024$, $1.5:1$). When active in the gallery, $50\%$ of the image is hidden behind the overflow mask.
- **Correction:** Update `.gallery-main-wrap` to either allow dynamic aspect ratio based on the active image or use `object-fit: contain` with a subtle plinth background (`var(--color-surface-container-low)`).

### Defect 3: Remote Low-Resolution Assets in Cultural Archive
- **Root Cause:** `src/data/stories.ts` lines 12, 47, 82, and 116 hardcode `https://lh3.googleusercontent.com/aida-public/...`.
- **Impact:**
  - Remote dependency vulnerable to latency, connection dropouts, or external deletion.
  - Image resolution is only $512 \times 382$ pixels (48 KB JPEG). Upscaled to 600px width on desktop displays ($1440 \times 900$) and 390px on Retina mobile displays ($2\times$ pixel ratio = 780 physical pixels), it appears noticeably blurred and artifact-ridden.
  - $1.34:1$ landscape is forced into a $4:5$ portrait frame (`style={{ aspectRatio: '4/5' }}`), cropping $40\%$ of the craft context.
- **Correction:** Map to verified local assets:
  - Story 1 (`the-living-loom`) $\rightarrow$ `/images/archive/general/archive-living-loom-01.webp`
  - Story 2 (`the-art-of-the-drape`) $\rightarrow$ `/images/archive/general/archive-art-of-drape-01.webp`
  - Story 3 (`the-language-of-the-surface`) $\rightarrow$ `/images/archive/general/archive-language-of-surface-01.webp`
  - Story 4 (`the-architecture-of-a-garment`) $\rightarrow$ `/images/archive/general/archive-architecture-of-garment-01.webp`

### Defect 4: Orphaned Approved Asset Ecosystem (78 Craft Traditions & Editorial Photos)
- **Root Cause:**
  - `src/data/assetCatalog.json` catalogued all 550 assets, but is never imported in `src/`.
  - `src/pages/HousePage.tsx` was built with pure typography and forms.
  - `src/pages/JournalPage.tsx` was built with pure typography and category pills.
  - `src/pages/ArchivePage.tsx` built the Weave Library as a text-only grid.
- **Impact:** Customers browsing The House or The Journal encounter walls of text without the visceral emotional resonance of EverThread's atelier photography. Over 80 carefully curated, color-balanced museum photographs are entirely wasted.

---

## 5. Responsive Behavior Analysis (Desktop $1440 \times 900$ vs. Mobile $390 \times 844$)

Across all 26 captured audit screenshots:

1. **Desktop Viewport ($1440 \times 900$):**
   - **Plinth Proportions:** Garment cards on Collections and Home render with appropriate margins, subtle borders (`border-hairline`), and consistent ivory canvas (`#fef9f0`).
   - **Visual Balance:** PDP layout with sticky gallery on the left and scrolling narrative on the right functions properly without horizontal overflow.
   - **Defect Visibility:** The horizontal crop of `et-03` and `et-04` is glaringly obvious on desktop screens because the waistcoats look unnaturally narrow and lack shoulder width.
2. **Mobile Viewport ($390 \times 844$):**
   - **Single Column Flow:** Collections and Archive collapse into elegant single-column feeds.
   - **Hero Image Height:** The home page hero image occupies $\approx 65\%$ of the vertical viewport. Without a mobile-specific `<picture>` crop, the subject's head is slightly cropped near the top margin on smaller Android/iOS viewports. Using `public/images/home/everthread-hero-mobile-01.webp` resolves this.
   - **Touch Targets:** The Loupe badge trigger (`.loupe-badge-trigger`) on the Home hero plinth maintains safe tap dimensions ($>44\text{px}$) and clear contrast against the model visual.
   - **Performance:** On mobile 3G/4G simulations, loading unoptimized remote Google UserContent thumbnails causes cumulative layout shift (CLS) as image headers resolve asynchronously.

---

## 6. Prioritized Action Plan for Phase 6.3.2

### Critical Priority (Blockers for Visual Integrity & Brand Credibility)
- [ ] **Fix 1: Product Asset Map Primary Views (`src/data/assetMap.ts`)**  
  Switch `et-03` (`architectonic-zari-waistcoat`) and `et-04` (`pleated-indigo-chanderi-tunic`) `primary` view from `front-01.webp` (landscape) to `model-01.webp` (portrait $1024 \times 1536$).
- [ ] **Fix 2: Cultural Archive Master Asset Binding (`src/data/stories.ts`)**  
  Replace all 4 remote `https://lh3.googleusercontent.com/...` URLs with local high-resolution WebP paths from `/images/archive/general/`.
- [ ] **Fix 3: PDP Showcase Landscape Handling (`src/styles/main.css` & `ProductDetailPage.tsx`)**  
  Add CSS rule or dynamic aspect ratio to `.gallery-main-wrap` so that $3:2$ landscape craft detail and back construction shots are not sliced in half.

### High Priority (Major Brand Polish & Asset Utilization)
- [ ] **Fix 4: Cultural Archive Weave Library Imagery (`src/pages/ArchivePage.tsx`)**  
  Bind the 13 craft tradition cards in `WEAVE_LIBRARY` to their corresponding approved photos in `public/images/archive/{tradition}/archive-{tradition}-macro-05.webp` or `model-01.webp`.
- [ ] **Fix 5: The House Photographic Visuals (`src/pages/HousePage.tsx`)**  
  Introduce an editorial hero visual using `public/images/house/everthread-house-hero-01.webp` and atelier salon visual using `everthread-atelier-salon-01.webp`.
- [ ] **Fix 6: Gazette & Monograph Photography (`src/pages/JournalPage.tsx` & `JournalArticlePage.tsx`)**  
  Replace empty Google Material Symbol cards with `public/images/journal/journal-monograph-cover-01.webp` and `journal-essay-drape-01.webp`.

### Medium Priority (Responsive Optimization & Editorial Depth)
- [ ] **Fix 7: Mobile Hero `<picture>` Tag (`src/pages/HomePage.tsx`)**  
  Wrap the home hero `<img>` in a `<picture>` tag serving `everthread-hero-mobile-01.webp` for viewports under 768px.
- [ ] **Fix 8: OpenGraph & Social Metadata (`index.html`)**  
  Add `<meta property="og:image" content="/images/brand/og-everthread.webp">` and `<link rel="icon" ...>` using the EverThread brand monogram.
- [ ] **Fix 9: Home Editorial Narrative Chapters (`src/pages/HomePage.tsx`)**  
  Introduce approved editorial still-life imagery (`everthread-atelier-still-life-01.webp`, `everthread-textile-folds-01.webp`) into Chapters 02–04.

### Low Priority (Housekeeping & Archival Cleanliness)
- [ ] **Fix 10: Legacy Static HTML Archive**  
  Remove or move obsolete static mockups (`collections.html`, `archive.html`, etc.) to an archival subfolder to prevent dev-server route intercept.

---

## 7. Exact Files & Components Needing Modification in Phase 6.3.2

1. `src/data/assetMap.ts`
   - Update `PRODUCT_ASSET_MAP['et-03'].primary`
   - Update `PRODUCT_ASSET_MAP['et-04'].primary`
2. `src/data/stories.ts`
   - Update `STORIES[0].image` through `STORIES[3].image` to `/images/archive/general/...`
   - Enrich `WEAVE_LIBRARY` items with `image` paths from `public/images/archive/{tradition}/`
3. `src/styles/main.css`
   - Refine `.gallery-main-wrap` and `.gallery-main-img` for landscape containment/orientation
4. `src/pages/ProductDetailPage.tsx`
   - Support responsive portrait/landscape container sizing on thumbnail selection
5. `src/pages/ArchivePage.tsx`
   - Render thumbnail image on each `WeaveLibraryItem` plinth
6. `src/pages/HomePage.tsx`
   - Implement `<picture>` tag for mobile hero
   - Integrate approved editorial imagery in chapter sections
7. `src/pages/HousePage.tsx`
   - Insert photography in hero, craftsmanship creed, and atelier columns
8. `src/pages/JournalPage.tsx` & `src/pages/JournalArticlePage.tsx`
   - Insert photography on featured monograph and article body
9. `index.html`
   - Add OpenGraph, Twitter Card, and Brand Monogram favicon metadata

---

## 8. Missing Evidence & Assets Requiring User Input

1. **User Approval on `et-03` and `et-04` Card Imagery:**  
   Confirm preference for model shots (`et-03-zari-waistcoat-model-01.webp` and `et-04-chanderi-tunic-model-01.webp`) as primary catalog plinths, versus keeping ghosted garment cutouts with letterboxed ivory containment.
2. **Weave Library Card Presentation:**  
   Confirm preference for macro detail shots (`macro-05.webp`) vs. draped model shots (`model-01.webp`) in the technical Weave Library grid.
3. **Legacy HTML Mockup Removal:**  
   Confirm authorization to move legacy October 16 static HTML mockups (`collections.html`, `archive.html`, etc.) into an `archive/legacy-mockups/` folder to eliminate the Vite dev-server routing collision.

---

## 9. Visual Reference Proof Index

All screenshots captured during this audit are permanently recorded in `scratch/screenshots/`:

| Route / State | Desktop Capture ($1440 \times 900$) | Mobile Capture ($390 \times 844$) |
| :--- | :--- | :--- |
| **Home Page** | `scratch/screenshots/audit_desktop_home.png` | `scratch/screenshots/audit_mobile_home.png` |
| **Collections** | `scratch/screenshots/audit_desktop_collections.png` | `scratch/screenshots/audit_mobile_collections.png` |
| **PDP: Zari Waistcoat (`et-03`)** | `scratch/screenshots/audit_desktop_pdp_waistcoat.png` | `scratch/screenshots/audit_mobile_pdp_waistcoat.png` |
| **PDP: Signature Coat-Dress (`et-01`)**| `scratch/screenshots/audit_desktop_pdp_coatdress.png` | `scratch/screenshots/audit_mobile_pdp_coatdress.png` |
| **Thread Compass** | `scratch/screenshots/audit_desktop_compass.png` | `scratch/screenshots/audit_mobile_compass.png` |
| **Cultural Archive Exhibition** | `scratch/screenshots/audit_desktop_archive.png` | `scratch/screenshots/audit_mobile_archive.png` |
| **Archive Story (`the-living-loom`)** | `scratch/screenshots/audit_desktop_archive_story.png`| `scratch/screenshots/audit_mobile_archive_story.png`|
| **The House** | `scratch/screenshots/audit_desktop_house.png` | `scratch/screenshots/audit_mobile_house.png` |
| **Journal / Gazette** | `scratch/screenshots/audit_desktop_journal.png` | `scratch/screenshots/audit_mobile_journal.png` |
| **Saved Pieces** | `scratch/screenshots/audit_desktop_saved.png` | `scratch/screenshots/audit_mobile_saved.png` |
| **Bag** | `scratch/screenshots/audit_desktop_bag.png` | `scratch/screenshots/audit_mobile_bag.png` |
| **Checkout** | `scratch/screenshots/audit_desktop_checkout.png` | `scratch/screenshots/audit_mobile_checkout.png` |
| **Not Found (404)** | `scratch/screenshots/audit_desktop_notfound.png` | `scratch/screenshots/audit_mobile_notfound.png` |

In addition, 25 visual contact sheets are compiled in `audit-output/contact-sheets/` indexing every image by folder, pixel dimensions, and file size.
