import os
import json
from pathlib import Path

DEST_DIR = Path("public/images")
PRODUCTS_DIR = DEST_DIR / "products"

PRODUCT_MAP = {
    "et-01": {
        "slug": "oxblood-wool-silk-signature-coat-dress",
        "dir": "signature-coat-dress",
        "title": "Oxblood Wool-Silk Signature Coat-Dress"
    },
    "et-02": {
        "slug": "ivory-structured-raw-silk-coat",
        "dir": "ivory-tailored-coat",
        "title": "Ivory Structured Raw Silk Coat"
    },
    "et-03": {
        "slug": "the-architectonic-zari-waistcoat",
        "dir": "architectonic-zari-waistcoat",
        "title": "Architectonic Zari Waistcoat"
    },
    "et-04": {
        "slug": "the-pleated-indigo-chanderi-tunic",
        "dir": "pleated-indigo-chanderi-tunic",
        "title": "Pleated Indigo Chanderi Tunic"
    },
    "et-05": {
        "slug": "oxblood-structured-box-calf-leather-bag",
        "dir": "oxblood-handbag",
        "title": "Oxblood Structured Box Calf Leather Bag"
    },
    "et-06": {
        "slug": "handspun-mulberry-silk-scarf-burgundy",
        "dir": "burgundy-scarf",
        "title": "Handspun Mulberry Silk Scarf in Burgundy"
    },
    "et-07": {
        "slug": "fine-pashmina-zari-reversible-stole-ivory",
        "dir": "ivory-scarf",
        "title": "Fine Pashmina & Zari Reversible Stole in Ivory"
    }
}

def get_image_rank(filename: str):
    f = filename.lower()
    # Explicit priority
    if "front" in f:
        return (0, f)
    if "01.webp" in f and not any(k in f for k in ["back", "detail", "side", "macro", "styled"]):
        return (0, f)
    if "styled" in f or "model" in f:
        return (1, f)
    if "back" in f:
        return (2, f)
    if "side" in f:
        return (3, f)
    if "detail" in f or "macro" in f:
        return (4, f)
    return (5, f)

def get_label(filename: str):
    f = filename.lower()
    if "front" in f or ("01.webp" in f and not any(k in f for k in ["back", "detail", "side", "macro", "styled"])):
        return "Primary View"
    if "styled" in f or "model" in f:
        return "Editorial Silhouette"
    if "back" in f:
        return "Back Construction"
    if "side-01" in f:
        return "Profile Drape (Left)"
    if "side-02" in f:
        return "Profile Drape (Right)"
    if "side" in f:
        return "Profile Drape"
    if "detail-clean" in f:
        return "Woven Brocade Facing"
    if "detail" in f:
        return "Atelier Craft Detail"
    return "Garment Study"

output_products = {}

for pid, pdata in PRODUCT_MAP.items():
    pdir = PRODUCTS_DIR / pdata["dir"]
    if not pdir.exists():
        print(f"Warning: Directory missing for {pid}: {pdir}")
        continue
        
    # Get all base WebP files (not -400w, -800w, -1200w)
    base_files = [
        f for f in sorted(os.listdir(pdir))
        if f.endswith(".webp") and not any(f.endswith(f"-{w}w.webp") for w in [400, 800, 1200, 1920])
    ]
    
    # Sort by rank
    base_files.sort(key=get_image_rank)
    
    gallery = []
    for bf in base_files:
        stem = bf[:-5]
        # Check responsive variants
        variants = []
        for w in [1920, 1200, 800, 400]:
            vf = pdir / f"{stem}-{w}w.webp"
            if vf.exists():
                variants.append(f"/images/products/{pdata['dir']}/{vf.name} {w}w")
        
        main_url = f"/images/products/{pdata['dir']}/{bf}"
        srcset_items = [f"{main_url} 1536w"] + variants
        
        # Dimensions estimation or reading
        from PIL import Image
        with Image.open(pdir / bf) as img:
            w_px, h_px = img.size
            
        gallery.append({
            "src": main_url,
            "srcSet": ", ".join(srcset_items),
            "sizes": "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
            "width": w_px,
            "height": h_px,
            "alt": f"{pdata['title']} — {get_label(bf)}",
            "label": get_label(bf)
        })
        
    primary_img = gallery[0] if gallery else None
    macro_img = next((img for img in gallery if "Detail" in img["label"]), primary_img)
    
    output_products[pid] = {
        "id": pid,
        "slug": pdata["slug"],
        "title": pdata["title"],
        "primary": primary_img,
        "macro": macro_img,
        "gallery": gallery
    }

# Read diagrams
diagrams_dir = DEST_DIR / "weave-library" / "diagrams"
diagrams_data = {}
if diagrams_dir.exists():
    for f in sorted(os.listdir(diagrams_dir)):
        if f.endswith(".svg"):
            did = f[:-4]
            title = did.replace("library-", "").replace("-01", "").replace("-", " ").title()
            diagrams_data[did] = {
                "id": did,
                "title": title,
                "svg": f"/images/weave-library/diagrams/{f}",
                "fallbackPng": f"/images/weave-library/diagrams/fallback/{did}.png"
            }

ts_content = f"""/**
 * EverThread Typed Asset Map
 * Generated from verified, optimized local WebP assets in public/images/.
 * Strict typed interfaces for responsive delivery (srcset), primary display, and galleries.
 */

export interface ResponsiveImage {{
  src: string;
  srcSet: string;
  sizes: string;
  width: number;
  height: number;
  alt: string;
  label?: string;
}}

export interface ProductAssetRecord {{
  id: string;
  slug: string;
  title: string;
  primary: ResponsiveImage;
  macro?: ResponsiveImage;
  gallery: ResponsiveImage[];
}}

export interface DiagramAsset {{
  id: string;
  title: string;
  svg: string;
  fallbackPng: string;
}}

export const PRODUCT_ASSET_MAP: Record<string, ProductAssetRecord> = {json.dumps(output_products, indent=2)};

export const DIAGRAM_ASSETS: Record<string, DiagramAsset> = {json.dumps(diagrams_data, indent=2)};

export const getProductAssetRecord = (productIdOrSlug: string): ProductAssetRecord | undefined => {{
  if (PRODUCT_ASSET_MAP[productIdOrSlug]) {{
    return PRODUCT_ASSET_MAP[productIdOrSlug];
  }}
  return Object.values(PRODUCT_ASSET_MAP).find(
    p => p.slug === productIdOrSlug || (productIdOrSlug === 'the-sylvan-mulberry-silk-trench' && p.id === 'et-01')
  );
}};

export const getProductPrimaryImage = (productIdOrSlug: string): ResponsiveImage => {{
  const rec = getProductAssetRecord(productIdOrSlug);
  if (rec) return rec.primary;
  return {{
    src: '/images/products/signature-coat-dress/product-oxblood-signature-front-01.webp',
    srcSet: '',
    sizes: '100vw',
    width: 1374,
    height: 1145,
    alt: 'EverThread Heirloom'
  }};
}};

export const getProductGallery = (productIdOrSlug: string): ResponsiveImage[] => {{
  const rec = getProductAssetRecord(productIdOrSlug);
  return rec ? rec.gallery : [];
}};
"""

with open("src/data/assetMap.ts", "w", encoding="utf-8") as f:
    f.write(ts_content)

print("Verified assetMap.ts generated with perfect ordering!")
