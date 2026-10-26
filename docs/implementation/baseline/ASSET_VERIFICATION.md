# EverThread — Asset Verification Report

**Date:** 2026-10-26  
**Registry Reference:** `docs/implementation/02a_ASSET_REGISTRY.csv` (50 rows: 40 supplied PNGs, 1 not supplied, 9 repository diagrams)  
**Handover Archive:** `C:\Users\omkar\OneDrive\Desktop\EverThread_Asset_Handover.zip` (verified outside the repository)  

---

## 1. Physical Asset Verification (ZIP vs. Registry)

All 40 PNG master files in `EverThread_Asset_Handover.zip` were inspected and re-measured:

- **Total PNG files in ZIP:** 40
- **Total rows in `02a_ASSET_REGISTRY.csv`:** 50 (40 supplied + 1 not yet supplied + 9 repository diagrams)
- **File property comparison (Dimensions, Color Mode, SHA-256 12-char prefix):** **40 / 40 PERFECT MATCH (0 discrepancies)**
- **TR assets in `public/`:** **0** (strictly verified: no TR images have entered the application codebase)
- **Approved assets count:** **0** (No supplied asset has status `APPROVED`; all remain unapproved awaiting owner review)

---

## 2. Row-by-Row Assessment of Supplied Handover Assets

| Asset ID | File Path in ZIP | Dimensions | Mode | SHA-256 | Registry Status | Independent Visual & Product Audit Assessment |
|---|---|---|---|---|---|---|
| `AST-HOME-CAMP` | `living-inheritance-collection-campaign.png` | 1672×941 | RGBA | `1134a7bb5e41` | `MISMATCH` | **Confirmed MISMATCH.** Pixel-identical to the earlier rejected panorama. A decorative gold thread is baked into the raster pixels (conflicting with the interactive SVG live thread) and depicted figures are not catalogue garments. |
| `AST-HOME-HERO` | `living-inheritance-hero.png` | 1672×941 | RGBA | `57f60831e1e0` | `OWNER_APPROVAL_REQUIRED` | **Confirmed OWNER_APPROVAL_REQUIRED.** Editorial concept artwork (woman seated on stone steps in maroon/gold brocade sari beside river). Setting evokes Varanasi ghats; must not claim authentic location, artisan, or workshop provenance. |
| `AST-TR01-BCK` | `tr-01-banaras-afterlight/tr-01-banaras-afterlight-back.png` | 1122×1402 | RGBA | `166aee764574` | `MISMATCH` | **Confirmed MISMATCH (F-47).** Back view of coat. Trousers and inner top are visible, but specification only defines the Mantle Coat. |
| `AST-TR01-DET` | `tr-01-banaras-afterlight/tr-01-banaras-afterlight-detail.png` | 1122×1402 | RGBA | `220cb2f534c0` | `MISMATCH` | **Confirmed MISMATCH (F-47).** Close-up detail of brocade weave. Styling includes non-specified garments. |
| `AST-TR01-SEAT` | `tr-01-banaras-afterlight/tr-01-banaras-afterlight-editorial-seated.png` | 1122×1402 | RGBA | `80ccb6b2370b` | `MISMATCH` | **Confirmed MISMATCH (F-47).** Editorial seated view showing full layered ensemble not in spec. |
| `AST-TR01-PRI` | `tr-01-banaras-afterlight/tr-01-banaras-afterlight-primary.png` | 1122×1402 | RGBA | `cf95bb182ee2` | `MISMATCH` | **Confirmed MISMATCH (F-47).** Primary frontal view showing trousers and inner top. |
| `AST-TR01-3Q` | `tr-01-banaras-afterlight/tr-01-banaras-afterlight-three-quarter.png` | 1122×1402 | RGBA | `6862bfa51139` | `MISMATCH` | **Confirmed MISMATCH (F-47).** Three-quarter angle showing extra garments. |
| `AST-TR02-BCK` | `tr-02-mayura-axis/tr-02-mayura-axis-back.png` | 1122×1402 | RGBA | `9ff18a127ee7` | `OWNER_APPROVAL_REQUIRED` | **Consistent with specification.** Back view of Angrakha jacket and column skirt set. |
| `AST-TR02-DET` | `tr-02-mayura-axis/tr-02-mayura-axis-detail.png` | 1122×1402 | RGBA | `bfe49ef842d0` | `OWNER_APPROVAL_REQUIRED` | **Consistent with specification.** Close-up embroidery detail. |
| `AST-TR02-SEAT` | `tr-02-mayura-axis/tr-02-mayura-axis-editorial-seated.png` | 1122×1402 | RGBA | `55fbf63901b0` | `OWNER_APPROVAL_REQUIRED` | **Consistent with specification.** Editorial seated pose in architectural alcove. |
| `AST-TR02-PRI` | `tr-02-mayura-axis/tr-02-mayura-axis-primary.png` | 1122×1402 | RGBA | `3ea9f6c73dfa` | `OWNER_APPROVAL_REQUIRED` | **Consistent with specification.** Primary frontal view of jacket and skirt set. |
| `AST-TR02-3Q` | `tr-02-mayura-axis/tr-02-mayura-axis-three-quarter.png` | 1122×1402 | RGBA | `4c8d5be1bc25` | `OWNER_APPROVAL_REQUIRED` | **Consistent with specification.** Three-quarter view. |
| `AST-TR02-DUP` | `tr-02-mayura-axis/tr-02-mayura-axis-draped-pallu.png` | 1122×1402 | RGBA | `95dc6c95c256` | `OWNER_APPROVAL_REQUIRED` | **Consistent with specification.** Detail of draped fabric. |
| `AST-TR03-BCK` | `tr-03-patola-geometry/tr-03-patola-geometry-back.png` | 1122×1402 | RGBA | `18b6283d5a49` | `OWNER_APPROVAL_REQUIRED` | **Consistent.** Back view of jacket and trouser set; inner top hidden by closure. |
| `AST-TR03-DET` | `tr-03-patola-geometry/tr-03-patola-geometry-detail.png` | 1122×1402 | RGBA | `d2c77d61c28c` | `MISMATCH` | **Confirmed MISMATCH (F-47).** Detail view shows layered inner top not in spec. |
| `AST-TR03-SEAT` | `tr-03-patola-geometry/tr-03-patola-geometry-editorial-seated.png` | 1122×1402 | RGBA | `7d3a0d817518` | `MISMATCH` | **Confirmed MISMATCH (F-47).** Seated view shows inner top. |
| `AST-TR03-PRI` | `tr-03-patola-geometry/tr-03-patola-geometry-primary.png` | 1122×1402 | RGBA | `303883a400c0` | `MISMATCH` | **Confirmed MISMATCH (F-47).** Front view shows inner top. Pose is very close to three-quarter view. |
| `AST-TR03-REV` | `tr-03-patola-geometry/tr-03-patola-geometry-reversible.png` | 1122×1402 | RGBA | `37bce7c28234` | `MISMATCH` | **Confirmed MISMATCH (F-47/F-48).** Jacket open showing lining pattern, but does not prove fully reversible garment construction. |
| `AST-TR03-3Q` | `tr-03-patola-geometry/tr-03-patola-geometry-three-quarter.png` | 1122×1402 | RGBA | `5c27fadda79a` | `MISMATCH` | **Confirmed MISMATCH (F-47).** Shows inner top; posture nearly identical to primary. |
| `AST-TR04-BCK` | `tr-04-temple-grid/tr-04-temple-grid-back.png` | 1122×1402 | RGBA | `63736729de9c` | `OWNER_APPROVAL_REQUIRED` | **Consistent with specification.** Back view of tunic and trouser set. |
| `AST-TR04-DET` | `tr-04-temple-grid/tr-04-temple-grid-detail.png` | 1122×1402 | RGBA | `ee418728d7ba` | `OWNER_APPROVAL_REQUIRED` | **Consistent with specification.** Close-up temple border motif. |
| `AST-TR04-SEAT` | `tr-04-temple-grid/tr-04-temple-grid-editorial-seated.png` | 1122×1402 | RGBA | `1e0a2944b036` | `OWNER_APPROVAL_REQUIRED` | **Consistent with specification.** Seated editorial pose. |
| `AST-TR04-PRI` | `tr-04-temple-grid/tr-04-temple-grid-primary.png` | 1122×1402 | RGBA | `630b666a1822` | `OWNER_APPROVAL_REQUIRED` | **Consistent with specification.** Front view of tunic and trousers. |
| `AST-TR04-3Q` | `tr-04-temple-grid/tr-04-temple-grid-three-quarter.png` | 1122×1402 | RGBA | `45ba91696b99` | `OWNER_APPROVAL_REQUIRED` | **Consistent with specification.** Three-quarter view. |
| `AST-TR05-BCK` | `tr-05-moonveil/tr-05-moonveil-back.png` | 1122×1402 | RGBA | `b299c824c9c1` | `OWNER_APPROVAL_REQUIRED` | **Consistent with specification.** Back view of sheer cape-tunic. |
| `AST-TR05-DET` | `tr-05-moonveil/tr-05-moonveil-detail.png` | 1122×1402 | RGBA | `5ce1d2ecf411` | `OWNER_APPROVAL_REQUIRED` | **Consistent with specification.** Sheer fabric and fine zari detail. |
| `AST-TR05-SEAT` | `tr-05-moonveil/tr-05-moonveil-editorial-seated.png` | 1122×1402 | RGBA | `a01ea18a4d70` | `OWNER_APPROVAL_REQUIRED` | **Consistent with specification.** Seated view. |
| `AST-TR05-PRI` | `tr-05-moonveil/tr-05-moonveil-primary.png` | 1122×1402 | RGBA | `8b0c8dc8f47b` | `OWNER_APPROVAL_REQUIRED` | **Consistent with specification.** Primary front view. |
| `AST-TR05-3Q` | `tr-05-moonveil/tr-05-moonveil-three-quarter.png` | 1122×1402 | RGBA | `1e6cbce6743b` | `MISMATCH` | **Confirmed DUPLICATE / NEAR-IDENTICAL (F-49).** Shares virtually identical frontal angle, pose, and framing with primary view (`AST-TR05-PRI`). A distinct three-quarter angle is required. |
| `AST-TR06-BCK` | `tr-06-indigo-orbit/tr-06-indigo-orbit-back.png` | 1122×1402 | RGBA | `69094fe00244` | `OWNER_APPROVAL_REQUIRED` | **Consistent with specification.** Back view of tailored jacket. |
| `AST-TR06-DET` | `tr-06-indigo-orbit/tr-06-indigo-orbit-detail.png` | 1122×1402 | RGBA | `e2a4be6f8510` | `OWNER_APPROVAL_REQUIRED` | **Consistent with specification.** Resist-dye geometric print detail. |
| `AST-TR06-SEAT` | `tr-06-indigo-orbit/tr-06-indigo-orbit-editorial-seated.png` | 1122×1402 | RGBA | `561f7448c417` | `OWNER_APPROVAL_REQUIRED` | **Consistent with specification.** Seated editorial pose. |
| `AST-TR06-PRI` | `tr-06-indigo-orbit/tr-06-indigo-orbit-primary.png` | 1122×1402 | RGBA | `2be69a8e9e1c` | `OWNER_APPROVAL_REQUIRED` | **Consistent with specification.** Frontal view of jacket. |
| `AST-TR06-3Q` | `tr-06-indigo-orbit/tr-06-indigo-orbit-three-quarter.png` | 1122×1402 | RGBA | `b21481b7a783` | `OWNER_APPROVAL_REQUIRED` | **Consistent with specification.** Three-quarter angle. |
| `AST-TR07-BCK` | `tr-07-tidal-bind/tr-07-tidal-bind-back.png` | 1122×1402 | RGBA | `95a895521469` | `MISMATCH` | **Confirmed MISMATCH (F-47).** Back view shows layered inner shirt/garment not in wrap-coat spec. |
| `AST-TR07-DET` | `tr-07-tidal-bind/tr-07-tidal-bind-detail.png` | 1122×1402 | RGBA | `806038167664` | `MISMATCH` | **Confirmed MISMATCH (F-47).** Tie-dye texture detail. Non-specified garments visible. |
| `AST-TR07-SEAT` | `tr-07-tidal-bind/tr-07-tidal-bind-editorial-seated.png` | 1122×1402 | RGBA | `705138cbece4` | `MISMATCH` | **Confirmed MISMATCH (F-47).** Seated editorial pose shows extra layers. |
| `AST-TR07-PRI` | `tr-07-tidal-bind/tr-07-tidal-bind-primary.png` | 1122×1402 | RGBA | `e2a5f77894a4` | `MISMATCH` | **Confirmed MISMATCH (F-47).** Front view shows distinct inner garment. |
| `AST-TR07-3Q` | `tr-07-tidal-bind/tr-07-tidal-bind-three-quarter.png` | 1122×1402 | RGBA | `2e0881d3f443` | `MISMATCH` | **Confirmed MISMATCH (F-47).** Three-quarter angle shows inner garment. |

---

## 3. Missing and Repository Assets Summary

1. **`AST-HOME-PLATE` (Clean Contemporary Collection Plate):** Status is `NOT_YET_SUPPLIED`. No clean contemporary hero plate exists in the ZIP or repository.
2. **`REPO-DIAG-01` through `REPO-DIAG-09` (Archive Technical Diagrams):**
   - 9 SVG/PNG diagram pairs exist in repository at `public/images/archive/diagrams/`.
   - File presence verified. Educational accuracy and tradition mappings require human review (F-38 / O-5).

---

## 4. Integrity Principles Applied

- **No asset promotion:** Zero unapproved assets were moved or converted into `public/`.
- **Master preservation:** Handover ZIP PNGs remain preserved outside the repository with SHA-256 signatures logged.
- **Listing policy:** Per Decision O-6-C and UT-ASSET-01, TR-01, TR-03, and TR-07 cannot be listed as purchasable products until the owner formally decides on image replacements or specification adjustments.
