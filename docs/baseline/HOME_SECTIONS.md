# EverThread Baseline: Homepage Sections & Claims Inventory (Pre-Stage 06)

- **Date:** 2026-10-26
- **Source File:** [`src/pages/HomePage.tsx`](file:///c:/Users/omkar/OneDrive/Desktop/FE%20Case%20Study/src/pages/HomePage.tsx)
- **Base Commit:** `39fd662`
- **Specification:** STAGE-06 §7 Item 1

---

## 1. Baseline Section Inventory

| Section / Element | Line Range in `HomePage.tsx` | Headings & Identifiers | Documented Baseline Issues / Specification Action |
| :--- | :--- | :--- | :--- |
| **Hero Section** | Lines 430–647 | H1 *"An heirloom, not a trend."*<br>`data-testid="hero-headline"` | Hardcoded metadata cells: "Numbered 01–64", "100% Unblended", "Pit-Loomed Jacquard", caption "Mulberry Silk & Cashmere". Secondary CTA reads "Discover the Stories".<br>→ **Action:** Bind `getProductById('et-01')`, remove edition cell, remove "cashmere"/"unblended" claims, change secondary CTA to "Enter the Archive". |
| **Folio / Highlights** | Lines 652–770 | H2 *"Thread Compass"*, *"Cultural Archive & Weave Library"*, *"The Permanent Capsule"* | H2 headings create duplicate H2 "Thread Compass".<br>→ **Action:** Transform into `home-index` with numbered Chapter cards (I, II, III) using H3s. |
| **Compass Chapter** | Lines 775–856 | H2 *"The Thread Compass"*<br>`data-testid="chapter-compass-section"` | Redundant copy.<br>→ **Action:** Retain as single `home-compass` teaser with first question and link to `/compass`. |
| **Archive Chapter** | Lines 861–927 | H2 *"The Living Loom"*<br>`data-testid="chapter-archive-section"` | Lacks verified technical diagram strip.<br>→ **Action:** Retain Living Loom and add 3 static diagram thumbnails linking `/archive`. |
| **Capsule Chapter** | Lines 932–1003 | H2 *"Oxblood Wool-Silk Signature Coat-Dress"* | Single contemporary product grid/card on Home (unapproved per brief).<br>→ **Action:** Replace with `WallsPreview.tsx` (`home-walls`) featuring both contemporary and heritage gateway doors. |
| **The Making Chapter** | Lines 1008–1053 | H2 *"Architectural Tailoring"*<br>H3 *"Pit-Loomed Humidity"*, *"Floating Canvases"*, *"Honoring Artisan Lineage"* | Unverified production and artisan claims.<br>→ **Action:** Replace with claim-free narrative spine (Thread, Textile, Craft, Garment, Story). |
| **The Promise Chapter** | Lines 1058–1102 | H2 *"The EverThread Promise"*<br>H3 *"Uncut Botanical Purity"*, *"Generational Inlay Margins"*, *"Documented Provenance"* | Unverified sustainability and provenance claims.<br>→ **Action:** Replace with 3 approved verbatim brand lines. |
| **Gazette / Journal** | Lines 1107–1156 | H2 *"On Unbroken Heirlooms: A Manifesto of Slow Thread"* | Lacks closing sequence.<br>→ **Action:** Retain title/link as `home-journal`, add `home-closing`. |

---

## 2. Removed Claims Inventory (To be recorded in RESULT.md per Stage 6 §7.10)

1. *"Pit-Loomed Humidity"* and associated paragraph.
2. *"Floating Canvases"* and associated paragraph.
3. *"Honoring Artisan Lineage"* and associated paragraph.
4. *"Uncut Botanical Purity"* and associated paragraph.
5. *"Generational Inlay Margins"* and associated paragraph.
6. *"Documented Provenance"* and associated paragraph.
7. Hardcoded Hero claims: *"Numbered 01–64"*, *"100% Unblended"*, *"Cashmere"*.
