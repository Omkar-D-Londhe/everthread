import json

with open("src/data/assetCatalog.json", "r", encoding="utf-8") as f:
    catalog = json.load(f)

# Product mapping: ID -> directory slug in products
# ET-01: signature-coat-dress
# ET-02: ivory-tailored-coat
# ET-03: architectonic-zari-waistcoat
# ET-04: pleated-indigo-chanderi-tunic
# ET-05: oxblood-handbag
# ET-06: burgundy-scarf
# ET-07: ivory-scarf

PRODUCT_DIR_MAP = {
    "et-01": "signature-coat-dress",
    "et-02": "ivory-tailored-coat",
    "et-03": "architectonic-zari-waistcoat",
    "et-04": "pleated-indigo-chanderi-tunic",
    "et-05": "oxblood-handbag",
    "et-06": "burgundy-scarf",
    "et-07": "ivory-scarf",
}

ts_lines = [
    "/**",
    " * EverThread Typed Asset Map",
    " * Generated from verified, optimized local WebP assets in public/images/.",
    " * Strict typed interfaces for responsive delivery (srcset), primary display, and galleries.",
    " */",
    "",
    "export interface ResponsiveImage {",
    "  src: string;",
    "  srcSet: string;",
    "  sizes: string;",
    "  width: number;",
    "  height: number;",
    "  alt: string;",
    "  label?: string;",
    "}",
    "",
    "export interface ProductAssetRecord {",
    "  id: string;",
    "  slug: string;",
    "  primary: ResponsiveImage;",
    "  macro?: ResponsiveImage;",
    "  gallery: ResponsiveImage[];",
    "}",
    "",
    "export interface DiagramAsset {",
    "  id: string;",
    "  title: string;",
    "  svg: string;",
    "  fallbackPng: string;",
    "}",
    "",
    "export const PRODUCT_ASSET_MAP: Record<string, ProductAssetRecord> = {"
]

for pid, dir_slug in PRODUCT_DIR_MAP.items():
    images = catalog["products"].get(dir_slug, [])
    
    # Sort order: front/01 first, model, back, detail, macro
    def sort_key(img):
        src = img["src"].lower()
        if "front" in src or "01.webp" in src:
            return 0
        if "model" in src or "styled" in src:
            return 1
        if "back" in src:
            return 2
        if "side" in src:
            return 3
        if "detail" in src:
            return 4
        return 5
        
    sorted_images = sorted(images, key=sort_key)
    
    # Label views
    for img in sorted_images:
        src = img["src"].lower()
        if "front" in src or "01.webp" in src:
            img["label"] = "Primary View"
        elif "model" in src or "styled" in src:
            img["label"] = "Editorial Silhouette"
        elif "back" in src:
            img["label"] = "Back Construction"
        elif "side" in src:
            img["label"] = "Profile Drape"
        elif "detail" in src:
            img["label"] = "Atelier Detail"
        else:
            img["label"] = "Garment Study"
            
    primary_img = sorted_images[0] if sorted_images else {
        "src": "/images/site-icons/apple-touch-icon.png",
        "srcSet": "",
        "sizes": "",
        "width": 180,
        "height": 180,
        "alt": "EverThread Heirloom"
    }
    
    # Macro image is detail image if present
    macro_img = next((img for img in sorted_images if "detail" in img["src"].lower()), primary_img)
    
    ts_lines.append(f"  '{pid}': {{")
    ts_lines.append(f"    id: '{pid}',")
    ts_lines.append(f"    slug: '{dir_slug}',")
    ts_lines.append(f"    primary: {json.dumps(primary_img, indent=6).strip()},")
    ts_lines.append(f"    macro: {json.dumps(macro_img, indent=6).strip()},")
    ts_lines.append(f"    gallery: {json.dumps(sorted_images, indent=6).strip()}")
    ts_lines.append("  },")

ts_lines.append("};")
ts_lines.append("")

# Diagrams
ts_lines.append("export const DIAGRAM_ASSETS: Record<string, DiagramAsset> = {")
for did, d_data in catalog["diagrams"].items():
    title = did.replace("library-", "").replace("-01", "").replace("-", " ").title()
    ts_lines.append(f"  '{did}': {{")
    ts_lines.append(f"    id: '{did}',")
    ts_lines.append(f"    title: '{title}',")
    ts_lines.append(f"    svg: '{d_data.get('svg', '')}',")
    ts_lines.append(f"    fallbackPng: '{d_data.get('fallbackPng', '')}'")
    ts_lines.append("  },")
ts_lines.append("};")
ts_lines.append("")

# Helpers
ts_lines.append("""
export const getProductAssetRecord = (productIdOrSlug: string): ProductAssetRecord | undefined => {
  if (PRODUCT_ASSET_MAP[productIdOrSlug]) {
    return PRODUCT_ASSET_MAP[productIdOrSlug];
  }
  return Object.values(PRODUCT_ASSET_MAP).find(p => p.slug === productIdOrSlug);
};

export const getProductPrimaryImage = (productIdOrSlug: string): ResponsiveImage => {
  const rec = getProductAssetRecord(productIdOrSlug);
  if (rec) return rec.primary;
  return {
    src: '/images/products/signature-coat-dress/product-oxblood-signature-front-01.webp',
    srcSet: '',
    sizes: '100vw',
    width: 1374,
    height: 1145,
    alt: 'EverThread Heirloom'
  };
};

export const getProductGallery = (productIdOrSlug: string): ResponsiveImage[] => {
  const rec = getProductAssetRecord(productIdOrSlug);
  return rec ? rec.gallery : [];
};
""")

with open("src/data/assetMap.ts", "w", encoding="utf-8") as f:
    f.write("\n".join(ts_lines))

print("Generated src/data/assetMap.ts successfully!")
