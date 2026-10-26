# EverThread — Claims and Provenance Inventory

**Date:** 2026-10-26  
**Scope:** Visible copy, product catalogue data, editorial prose, metadata fields, and image captions across Home, The House, Journal, Contemporary Products (ET-01..ET-07), Traditional Concept Products (TR-01..TR-07), and the Cultural Archive.

---

## 1. Classification Methodology

Visible claims and copy across the EverThread frontend are audited against the Master Operating Prompt §1, §3, §5, §15, findings F-41, F-46, and owner decisions O-9, O-11, O-12:

1. **Supported by Approved Sources:** Established brand taglines, canonical contemporary specifications, approved editorial narrative spine, and simulated demonstration checkout notices.
2. **Unsupported / On Hold (F-41, F-46, DEC D-18):** Unverified workshop locations, specific artisan hours, origin claims, certification marks, and limited edition allocations.
3. **AI Concept Disclosure Required (O-9, O-11):** All generated fashion imagery, traditional concept products (TR-01..TR-07), and illustrative artisan profiles.

---

## 2. Inventory by Location

### 2.1 Brand Headlines & Global Shell (Header, Footer, Loader)
| Location | Visible Text / Claim | Category | Current Status & Handling |
|---|---|---|---|
| Loader / Hero | "An heirloom, not a trend." | Supported | Approved brand tagline. Protected concept. |
| Hero Subtitle | "Every thread carries a story." | Supported | Approved supporting brand line. |
| Brand Spine | "One thread. A world of stories." | Supported | Core conceptual brand line. |
| Home Secondary CTA | "Enter the Archive" | Supported | Exactly matches approved invariant. |
| Checkout Banner | "EverThread is a demonstration frontend..." | Supported | Honest simulated checkout disclosure. |
| Footer | "All sales, orders, and inquiries are simulated..." | Supported | Mandatory scope limit notice. |

### 2.2 Contemporary Collection (ET-01 through ET-07)
| Location | Visible Text / Claim | Category | Current Status & Handling |
|---|---|---|---|
| ET-01 PDP | "Oxblood Wool-Silk Signature Coat-Dress" / ₹68,500 | Supported | Approved canonical product name and pricing. |
| ET-02 PDP | "Ivory Raw Tussar Cocoon Trench" | Unsupported (Pending Retitle) | F-32: Retitle to "Ivory Hand-Spun Matka Silk Cocoon Trench" (100% Hand-Spun Matka Raw Silk; never call it Tussar) in Stage 2. |
| ET-03 PDP | "Architectonic Zari Waistcoat" / ₹44,000 | Supported | Approved canonical product name and pricing. |
| ET-04 PDP | "Angrakha Asymmetric Sheer Tunic" / ₹32,000 | Supported | Approved canonical product name and pricing. |
| ET-05 PDP | "Box-Calf Structured Frame Bag" / ₹54,000 | Supported | Approved canonical product name and pricing. |
| ET-06 PDP | "Hand-Rolled Mulberry Twill Scarf" / ₹24,500 | Supported | Approved canonical product name and pricing. |
| ET-07 PDP | "High-Altitude Hand-Spun Pashmina Stole" / ₹38,000 | Supported | Approved canonical product name and pricing. |
| ET-01..07 PDPs | `edition: "Numbered Edition of 24"` | Unsupported / On Hold | **DEC D-18 / F-46: ON HOLD.** Do not add, remove, approve, or endorse edition numbers. Preserve data as-is until owner confirmation in Stage 9. |
| ET-01..07 PDPs | `artisanHours: 120` | Unsupported | Unverified estimate; must not be represented as an audited labor record. Handled via schema optionality in Stage 2/9. |
| ET-01..07 PDPs | `origin: "Varanasi Guild Workshop 4"` | Unsupported | Concept/demonstration attribution; must not be claimed as verified physical supply chain. |

### 2.3 Traditional Collection "The Living Inheritance" (TR-01 through TR-07)
| Location | Visible Text / Claim | Category | Current Status & Handling |
|---|---|---|---|
| TR-01..TR-07 | Concept Product Specifications (TR-01 Banaras Afterlight ₹128,000, TR-02 Mayura Axis ₹142,000, etc.) | Concept Specification | N-02: Concept products, not verified manufacturing records. Must never invent edition, artisan-hour, origin, or dispatch claims. |
| TR-01..TR-07 Imagery | 40 Handover PNG Masters (`AST-TR01-*` through `AST-TR07-*`) | AI Concept Disclosure Required | O-6-C / O-9: All affected images are AI-generated concept images. Must be disclosed via `CONCEPT_NOTICE_TEXT` and specific alt text ("AI-generated concept image"). Products remain unlisted until approved. |
| Status Disclosure | `TR_STATUS_TEXT` | AI Concept Disclosure Required | Provisional text in named constant: "Concept specification for creative exploration; not verified artisan or manufacturing provenance." Owner approval required in Stage 9. |

### 2.4 Cultural Archive & Weave Monographs
| Location | Visible Text / Claim | Category | Current Status & Handling |
|---|---|---|---|
| Monograph Folios | "Varanasi Brocade Guild (Maqbool Hasan Representative Persona)" | Supported Disclosed Concept | Accurately flagged in `stories.ts` (`isPersonaIllustrative: true`, `unsupportedClaims` disclosed). |
| Archive Plates | 13 Textile Tradition Plates | Educational Artwork | F-38: Historical accuracy and terminology require human expert review. Must never claim AI illustrations represent authentic historical artifacts or artisan processes. |
| Related Product Links | Archive Folio to Product relationships | Conditional (Rule O-7) | Must follow O-7 rule: related links appear ONLY when genuinely similar defensible product is listed. Banarasi and Kota Doria relations held pending owner choice. |

### 2.5 Editorial Pages (The House & Journal)
| Location | Visible Text / Claim | Category | Current Status & Handling |
|---|---|---|---|
| The House | Making / Brand Promise Section | Supported (Safe Default) | O-12: Use claim-free scene (narrative-spine links plus approved brand lines). Owner copy approval required before Stage 9 PASS. |
| Journal | "On Unbroken Heirlooms", "Varanasi at Dawn", "Botanical Alchemy" | Editorial Prose | Narrative essays; keep cultural storytelling respectful, avoiding unsubstantiated historical provenance claims. |

---

## 3. Mandatory Remediation Rules for Upcoming Stages

1. **Stage 2:** Implement ET-02 retitle to "Ivory Hand-Spun Matka Silk Cocoon Trench". Implement flexible schema for TR records allowing omission of unverified `artisanHours`, `edition`, and `origin`.
2. **Stage 4:** Enforce `isListed: false` for all TR products whose images remain unapproved or mismatched under Decision O-6-C.
3. **Stage 6 & 9:** Replace unsupported claims in House and Journal with owner-approved copy (O-12, B-5).
4. **Stage 9:** Final audit and disclosure notice lock (O-9, O-11, DEC D-18, DEC D-21).
