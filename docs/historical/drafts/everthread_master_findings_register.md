SUPERSEDED in part — see docs/SUPERSEDED.md

# EverThread — Master Findings Register (canonical)

Commit `ebf7b6b`. One row per issue; v2 (`D-nn`), v3 (`V3-nn`, `CL-nnn`) and new IDs are merged here. Evidence: [B] browser on local production build, [S] source, [M] measured, [SS] screenshot, [R] reused from v2/v3 (valid: unchanged commit).
**Class:** CD confirmed defect · CM confirmed missing feature · II incomplete implementation · UV unverified · UX design/UX problem · DOC documentation inconsistency · PO product-owner decision · ENV environment limitation. **Pri:** P0 build/core break · P1 missing approved signature/major defect · P2 medium · P3 low. There is **no P0**.

| ID | Finding | Class | Pri | Merged refs | Evidence | Stage (provisional) |
|---|---|---|---|---|---|---|
| F-01 | Story Flow panel fold/roll scene transition not implemented on Home, Archive, House (ordinary fade/rise only; `.fabric-panel` CSS unused) | CM | P1 | V3-01..04, CL-446 | [S][B][M] 0 3D/clip/perspective on 9 runs; Brief §7 | 4 |
| F-02 | Home journey and thread: sections exist in approved order; thread is a hero scrub parallax plus highlights draw, absent on other routes; Phase 6.0 critiques unverifiable | UV/II | P2 | V3-05, V3-07 | [S] | 4 |
| F-03 | Archive overview is a uniform 3-column tile grid (14 equal tiles + diagram block), contrary to Brief "curated exhibition rather than generic grid" and Spec "avoid six equal tiles" | UX | P2 | new | [SS] | 3 |
| F-04 | Exhibition five-step opening absent (only fade keyframes) | II | P2 | V3-06 | [S] | 3/4 |
| F-05 | Archive "Acquire to Bag" adds a garment with no approved relationship (Muga→ET-02) and silently picks first size/colour; existing tests assert this as correct | CD + PO | P1 | D-01, CL-040/193 | [B][S] | 1 (interim guard) / 3 |
| F-06 | Lens ignores active gallery image (`imageSrc={product.macroImage‖currentImage.src}`) | CD | P1 | D-03, CL-064/238/246 | [B] 5/6 wrong | 1 |
| F-07 | Lens loupe stretched vs `object-fit:cover` crop (up to ≈5% offset), ~2× upscale beyond 1536 px native, generic alt | CD | P2 | D-04 | [M] | 2 |
| F-08 | Dialog focus: Lens and Exhibition modal have `aria-modal` but no focus trap; in Exhibition, after tabbing out, Esc no longer closes; focus not restored to opener | CD | P2 | D-04, D-12, CL-244 | [B] | 2 |
| F-09 | Search result for weave-14 goes to `/archive?tradition=radial-bias-draping` (no exhibition). Root cause `SearchModal.tsx:101` uses `traditionKey‖slug`; weave-14 has no traditionKey. Approved target `/archive/the-art-of-the-drape`. Only dead result among 28 | CD | P2 | D-07, CL-395 | [B][S] | 1 |
| F-10 | 390 px overflow: PDP gallery strip, Archive story button (+38 px), Journal link (+13 px), header icon (+5 px) clipped by `body{overflow-x:hidden}` (main.css:29, baseline). A past report claims it was solved without global clipping | CD | P2 | D-08, CL-515 | [M] | 2 |
| F-11 | ET-04 gallery alt text uses legacy "Pleated Indigo Chanderi Tunic" (5 images; `assetMap.ts`); folder name and legacy slug are legitimate | CD | P3 | D-06, CL-101 | [B] | 1 |
| F-12 | Plate captions are filename-derived alt text ("archive muga silk model 01"); no approved caption copy | CD + PO | P2 | D-09, CL-410/423 | [SS][S] | 3 |
| F-13 | Home hero claims contradict ET-01 data (see claim table in solution proposal): "Numbered 01–64" vs Edition of 30; "100% Unblended" vs 70% merino/30% silk; "Mulberry Silk & Cashmere" vs no cashmere; "Pit-Loomed Jacquard" vs "2/2 Twill with Kadwa Facing" | CD | P2 | V3-09 | [S][SS] | 1 |
| F-14 | Loader ≈2.3–2.6 s (`minDisplayTimeMs` 1900 + 400 ms fade); Roadmap §2.3 #5 protects timing; checklist §2.7 and instructions.md disagree | PO | P2 | D-05, CL-114 | [M][S] | Hold |
| F-15 | Colourways: names/Bag variant change, image does not; colourways are protected data; no per-colour assets | PO | P2 | D-11, CL-462 | [B][S] | Hold |
| F-16 | Cultural Collection (checklist only) vs "Traditional Collection" (nowhere): unresolved scope; no sellable cultural data | PO | P1 | D-02, V3 | [S] | Hold |
| F-17 | Sort lacks "newest" required by Brief §8 (needs release-date data) | II/PO | P3 | new | [B] | Hold |
| F-18 | Gallery/Compass/accordion transitions exist as CSS keyframes; abruptness and visuals unverified | UV | P3 | CL-296..299, 303..308 | [S] | 5 |
| F-19 | Compass behaviour unverified in browser (24 unit/UI tests exist) | UV | P2 | CL-140/307 | none | 2 |
| F-20 | Bag: index-based mutations, unknown IDs silently ignored, minus at qty 1 deletes; Saved move-to-Bag untested | CD-risk | P3 | D-10, CL-205/229 | [S][B] | 2 |
| F-21 | Icons rely on Google Material Symbols; font failure shows literal "ARROW_FORWARD"/"loupe"; a past report claims SVG replacement | II | P3 | V3-10 | [SS][S] | 2 |
| F-22 | Documentation contradictions (4 catalogues; old routes; stale reports) | DOC | P3 | D-15, V3-12 | [S] | 5 |
| F-23 | Build chunk >500 kB warning; Archive ≈3.7 MB per page | UV | P3 | D-16 | [M] | 5 |
| F-24 | Live deployment unverified (host unresolvable; Actions run 10 success) | ENV | P2 | V3-14 | — | 5 |
| F-25 | Phase 6.0 documents not recoverable in this session | ENV/DOC | P1 | V3-11 | search | blocks F-01/F-02 |
| F-26 | Hero secondary CTA "Discover the Stories" vs Brief "Enter the Archive" | DOC/PO | P3 | new | [B] | 1 after approval |
| F-27 | `/product/ET-01` (uppercase) not found; legacy slugs resolve without canonical redirect | CD | P3 | D-14 | [B] | 2 |
| F-28 | Exhibition deep-link URL param persists after close | CD | P3 | D-12 | [B] | 2 |
| F-29 | Champagne focus ring 2.57:1 on ivory | CD | P3 | D-13 | [computed] | 2 |
| F-30 | Newsletter email input has no accessible label (every page) | CD | P3 | new | [B] | 2 |
| F-31 | No browser/E2E/a11y tests; jsdom tests cannot catch F-06, F-09, F-10; some tests encode wrong behaviour (F-05) | UV | P2 | new | [S] | 1 (baseline) |
| F-32 | ET-02 title "Raw Tussar" vs fibre "100% Hand-Spun Matka Raw Silk" | DOC/PO | P2 | new | [S] | decision |
| F-33 | Mobile Archive/PDP plate-label truncation ("MODEL / …") | UX | P3 | CL-093 | [SS] | 3 |

## Previous findings accounted for
All v2 D-01…D-16 and v3 V3-01…V3-14 map to the rows above. Items verified working and left unchanged: Bag identity/quantity/subtotal/persistence, simulated checkout (validation, summary, confirmation, disclosure), canonical names/prices, 13 exhibitions loading, 9 diagrams present, route direct access, history, 0 broken internal links, reduced-motion visibility.
