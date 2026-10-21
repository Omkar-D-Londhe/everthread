# EverThread — Phase 6.3.2.2.3: Catalogue-Wide Claim Audit Report

**Project Directory:** `C:\Users\omkar\OneDrive\Desktop\FE Case Study`  
**Execution Date:** 2026-10-21  
**Status:** Completed, Verified, and Documented  

---

## 1. Executive Summary & Objective

In accordance with Phase 6.3.2.2.3, a catalogue-wide audit of all material, technical, and structural claims was conducted across all 13 canonical textile traditions in EverThread's cultural archive and exhibition data.

The objective was to identify and neutralize all unsupported numerical and purity assertions—such as unverified Threads Per Inch (`TPI`), knot densities, precious metal assertions (`24k gold`, `pure silver`, `real gold`), and dogmatic purity percentages—replacing them with accurate, craft-substantiated descriptions that reflect authentic handloom and dyeing heritage without inventing false specifications.

---

## 2. Investigation of the Patan Patola `190 TPI` Claim

### Finding
The intermediate and desktop exhibition screenshots previously displayed:
> `Loom Sett / Structure: 190 TPI`

### Verification Against Approved Project Sources
An investigation of the repository, archival monographs, and census documents confirmed:
1. **No Approved Empirical Testing:** There are no laboratory fiber reports, thread-counter analyses, or census certifications establishing `190 TPI` for the Patan Patola archive specimens.
2. **Craft Nature of Double-Ikat:** Traditional Patan Patola (woven by the Salvi silk master guild) is a balanced plain weave constructed with plied silk yarns where both warp and weft are individually resist-dyed before mounting on a slanted rosewood harness loom. Loom sett varies naturally between pieces and weavers, rather than conforming to an arbitrary standardized industrial metric of 190 TPI.
3. **Correction:**
   - **Prior Sett:** `190 TPI` $\rightarrow$ **Corrected Sett:** `Balanced Double-Ikat Plain-Weave Sett`
   - **Prior Fiber:** `Eight-ply raw silk with natural madder, indigo, and turmeric` $\rightarrow$ **Corrected Fiber:** `Multi-Ply Handloom Silk with Natural Botanical Dyes`

---

## 3. Complete Catalogue Audit Across All 13 Traditions

Every tradition was audited across both `src/data/assetMap.ts` (`TRADITION_METADATA_RECORD`) and `src/data/stories.ts` (`WEAVE_LIBRARY`).

| # | Tradition Key | Title & Discipline | Prior Claims (Audited) | Corrected Substantiated Description | Rationale |
|---|---|---|---|---|---|
| **01** | `banarasi-brocade` | **Varanasi Kadwa Jacquard** *(Weaving)* | • Fiber: *Pure Mulberry Silk with 24k Gold & Silver Zari*<br>• Sett: *180 TPI* | • **Fiber:** `Traditional Handloom Silk with Brocade Zari`<br>• **Sett:** `Traditional Handloom Sett` | Corrected in Phase 6.3.2.2.1/2; eliminates unverified 24k gold assay, mulberry purity, and TPI numbers. |
| **02** | `kota-doria` | **Chanderi & Kota Doria Sheer Weave** *(Weaving)* | • Fiber: *70% Mulberry Silk warp, 30% Fine Cotton weft*<br>• Sett: *160 TPI* | • **Fiber:** `Handloom Silk Warp with Fine Cotton Weft`<br>• **Sett:** `Traditional Khat Square Open Sett` | Replaces unverified blend percentages and 160 TPI with the defining architectural feature of Kota Doria: its square *khat* open check sett. |
| **03** | `kashmiri-sozni` | **Kashmiri Sozni on Changthangi Pashmina** *(Embroidery)* | • Fiber: *100% Changthangi Capra Cashmere with Silk Needlework*<br>• Sett: *95 TPI* | • **Fiber:** `Hand-Spun Cashmere Ground with Silk Needlework`<br>• **Sett:** `Hand-Spun Fine Twill Sett` | Eliminates unverified 100% purity assertion and 95 TPI; accurately describes hand-spun cashmere twill base. |
| **04** | `muga-silk` | **Assam Muga Wild Silk Twill** *(Weaving)* | • Fiber: *100% Antheraea assamensis (Muga Golden Silk)*<br>• Sett: *140 TPI* | • **Fiber:** `Wild Assam Muga Silk (Antheraea assamensis)`<br>• **Sett:** `Traditional Diagonal Ridge Twill Sett` | Removes 100% laboratory claim and 140 TPI; preserves botanical taxonomy and diagonal twill structure. |
| **05** | `chikankari` | **Lucknow Chikankari Needlework** *(Embroidery)* | • Fiber: *Fine untwisted cotton threads on gossamer muslin*<br>• Sett: *Surface needlework* | • **Fiber:** `Fine untwisted cotton threads on gossamer muslin`<br>• **Sett:** `Surface needlework` | Verified: Already accurate and neutral craft description without numerical claims. |
| **06** | `bagru` | **Bagru Natural Madder & Dabu Resist** *(Dyeing)* | • Fiber: *Alum mordanted Rubia cordifolia on unbleached cloth*<br>• Sett: *Cellular molecular dye bond* | • **Fiber:** `Natural Madder Root Dye on Unbleached Cotton`<br>• **Sett:** `Hand-Block Dabu Resist on Cotton Ground` | Replaces poetic "cellular molecular dye bond" with the exact craft technique: mud resist (dabu) on plain-weave cotton ground. |
| **07** | `ajrakh` | **Kutch Ajrakh Double-Sided Resist** *(Dyeing)* | • Fiber: *Natural indigo and wild iron mordant on fine cotton*<br>• Sett: *Subterranean river wash saturation* | • **Fiber:** `Natural Indigo and Mineral Mordants on Fine Cotton`<br>• **Sett:** `Double-Sided Block Resist on Cotton Ground` | Accurately describes the double-sided mordant block print structure on cotton ground. |
| **08** | `bandhani` | **Kutch & Jamnagar Bandhani** *(Dyeing)* | • Fiber: *Pure Gaji Silk and Georgette with natural dyes*<br>• Sett: *Up to 2,000 hand-tied knots per square inch* | • **Fiber:** `Traditional Gaji Silk with Natural Botanical Dyes`<br>• **Sett:** `High-Density Hand-Plucked Micro-Resist` | Eliminates unsubstantiated "2,000 knots per square inch" numerical count and unverified "Pure" purity claim. |
| **09** | `kanchipuram-silk` | **Kanchipuram Korvai Temple Silk** *(Weaving)* | • Technique: *...with pure silver zari*<br>• Fiber: *Double-warp mulberry silk with pure silver-gilt zari*<br>• Sett: *240 TPI (Triple-ply heavy weight)* | • **Technique:** `Three-shuttle interlocking joint with traditional zari`<br>• **Fiber:** `Double-Warp Handloom Silk with Metallic Zari`<br>• **Sett:** `Heavyweight Triple-Ply Handloom Sett` | Eliminates unverified pure silver metal purity and 240 TPI; retains the heavy triple-ply korvai handloom structure. |
| **10** | `paithani-silk` | **Paithani Tapestry Silk** *(Weaving)* | • Fiber: *Fine filature silk warp with real gold zari border*<br>• Sett: *200 TPI*<br>• Alt: *...pure gold zari tapestry...* | • **Fiber:** `Fine Filature Silk Warp with Traditional Brocade Zari`<br>• **Sett:** `Interlocking Tapestry Weft Handloom Sett`<br>• **Alt:** `...traditional metallic zari tapestry...` | Eliminates unverified "real gold" and "pure gold" claims without assay certificate, as well as 200 TPI. |
| **11** | `patan-patola` | **Patan Patola Double-Ikat** *(Weaving)* | • Fiber: *Eight-ply raw silk with natural madder...*<br>• Sett: *190 TPI* | • **Fiber:** `Multi-Ply Handloom Silk with Natural Botanical Dyes`<br>• **Sett:** `Balanced Double-Ikat Plain-Weave Sett` | Neutralizes dogmatic "Eight-ply" and unsupported "190 TPI"; accurately represents double-ikat plain weave. |
| **12** | `pochampally-ikat` | **Pochampally Tie-Dye Ikat** *(Weaving)* | • Fiber: *Fine mercerized cotton and wild tussar silk*<br>• Sett: *120 TPI* | • **Fiber:** `Fine Cotton Warp with Wild Tussar Silk Weft`<br>• **Sett:** `Traditional Ikat Handloom Sett` | Removes unverified 120 TPI; details cotton warp and tussar weft construction. |
| **13** | `sambalpuri-ikat` | **Sambalpuri Bandha Curvilinear Ikat** *(Weaving)* | • Fiber: *Fine tussar silk and hand-spun desi cotton*<br>• Sett: *130 TPI* | • **Fiber:** `Wild Tussar Silk and Hand-Spun Cotton`<br>• **Sett:** `Pit-Loom Bandha Handloom Sett` | Removes unverified 130 TPI; describes traditional pit-loom bandha sett. |

### Additional Stories Data Neutralization
- In `src/data/stories.ts` under `STORIES[0]` (`the-living-loom`), line 21:
  - **Prior:** `{ label: 'Zari Composition', value: 'Pure Silver Wire Gilded in 24k Fine Gold' }`
  - **Corrected:** `{ label: 'Zari Composition', value: 'Traditional Silver-Gilt Metallic Zari' }`

---

## 4. Verification & Regression Prevention

### A. New Regression Tests
Added regression tests to `src/tests/tradition-exhibition.test.tsx`:
1. **Catalogue-Wide Purity & Density Check:** Iterates over all 13 records in `getAllTraditionAssets()`:
   - Asserts that `warpDensity` contains no numerical TPI regex `/\d+\s*TPI/i`.
   - Asserts that `warpDensity` contains no knot metrics `knots per square inch`.
   - Asserts that `fiber` contains no unverified percentages `/\d+%/`.
   - Asserts that `fiber` contains no unverified precious metal claims `/24k|real gold|pure silver/i`.
2. **Patan Patola Specific Assertion:** Asserts that Patan Patola strictly displays:
   - `warpDensity`: `"Balanced Double-Ikat Plain-Weave Sett"` (does not contain `"190 TPI"`).
   - `fiber`: `"Multi-Ply Handloom Silk with Natural Botanical Dyes"`.
3. **Component Render Test:** Mounts `<TraditionExhibitionModal traditionKeyOrSlug="patan-patola" />` and confirms footer elements render the substantiated text without `"190 TPI"`.

### B. Test Suite Execution
```bash
npm test -- --run
# Test Files: 12 passed (12)
# Tests:      228 passed (228)
# Duration:   9.05s
```

### C. TypeScript Type Check
```bash
npx tsc --noEmit
# Exit code 0 (0 errors)
```

### D. Production Build
```bash
npm run build
# Built in 4.21s (dist/ verified)
```

---

## 5. Visual QA & Screenshot Evidence

A fresh automated headless Chrome session with DevTools Protocol was executed against the production build preview (`http://localhost:4173`):

1. **Desktop View (1440 × 900):**
   - **Path:** `artifacts/phase-6-3-2-2/08_exhibition_modal_patan_patola_desktop_1440x900.png` (753 KB)
   - **Footer Text Verified:**
     ```
     Fiber Base: Multi-Ply Handloom Silk with Natural Botanical Dyes
     •
     Loom Sett / Structure: Balanced Double-Ikat Plain-Weave Sett
     Use ← → to browse plates, ESC to exit
     ```
2. **Intermediate Tablet View (1024 × 768):**
   - **Path:** `artifacts/phase-6-3-2-2/05_exhibition_modal_intermediate_1024x768.png` (492 KB)
   - Refreshed to display the neutral craft sett on intermediate viewports.

---

## 6. Scope Boundaries Preserved

- Canonical product data in `src/data/products.ts` (`ET-01` to `ET-07`), pricing, slugs, and primary assets remained untouched.
- Approved `ThreadLoader.tsx`, `thread-loader.css`, and watercolor hand assets remained untouched.
- All 13 traditions, 6-role mappings, routes, bag, checkout, and compass features remain fully operational.
- Phase 6.4 has not been started.
