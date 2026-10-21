import os
import shutil
import json
from pathlib import Path
from PIL import Image

SRC_DIR = Path("Images")
DEST_DIR = Path("public/images")

# Exclusions
EXCLUDE_FILENAMES = {
    "desktop.ini",
    "product-signature-coat-dress-editorial-03.png", # Explicit guard
    "about.txt"
}

RESPONSIVE_WIDTHS = [1200, 800, 400]

def main():
    print("Starting EverThread Asset Optimization Pipeline...")
    
    total_source_bytes = 0
    total_dest_bytes = 0
    processed_images = 0
    variants_generated = 0
    copied_files = 0
    
    # Track metadata for assetMap.ts
    asset_catalog = {
        "products": {},
        "diagrams": {},
        "archive": {},
        "brand": {},
        "editorial": {}
    }
    
    for root, dirs, files in os.walk(SRC_DIR):
        for f in sorted(files):
            if f.lower() in EXCLUDE_FILENAMES or f.lower().endswith(".ini"):
                continue
                
            src_path = Path(root) / f
            rel_path = src_path.relative_to(SRC_DIR)
            parts = rel_path.parts
            section = parts[0]
            
            src_size = src_path.stat().st_size
            total_source_bytes += src_size
            
            dest_subdir = DEST_DIR / rel_path.parent
            dest_subdir.mkdir(parents=True, exist_ok=True)
            
            # Handle SVGs
            if src_path.suffix.lower() == ".svg":
                dest_file = dest_subdir / f
                shutil.copy2(src_path, dest_file)
                dest_size = dest_file.stat().st_size
                total_dest_bytes += dest_size
                copied_files += 1
                
                if section == "weave-library":
                    diagram_id = src_path.stem
                    if diagram_id not in asset_catalog["diagrams"]:
                        asset_catalog["diagrams"][diagram_id] = {}
                    asset_catalog["diagrams"][diagram_id]["svg"] = f"/images/{rel_path.as_posix()}"
                continue
                
            # Handle ICO and WebManifest
            if src_path.suffix.lower() in [".ico", ".webmanifest"]:
                dest_file = dest_subdir / f
                shutil.copy2(src_path, dest_file)
                dest_size = dest_file.stat().st_size
                total_dest_bytes += dest_size
                copied_files += 1
                continue
                
            # Handle Weave Library PNG Fallbacks
            if section == "weave-library" and src_path.suffix.lower() == ".png":
                fallback_dir = DEST_DIR / "weave-library" / "diagrams" / "fallback"
                fallback_dir.mkdir(parents=True, exist_ok=True)
                dest_file = fallback_dir / f
                shutil.copy2(src_path, dest_file)
                dest_size = dest_file.stat().st_size
                total_dest_bytes += dest_size
                copied_files += 1
                
                diagram_id = src_path.stem
                if diagram_id not in asset_catalog["diagrams"]:
                    asset_catalog["diagrams"][diagram_id] = {}
                asset_catalog["diagrams"][diagram_id]["fallbackPng"] = f"/images/weave-library/diagrams/fallback/{f}"
                continue
                
            # Handle Open Graph image (needs PNG retained for social media crawlers + WebP)
            if f == "og-everthread.png":
                dest_file = dest_subdir / f
                shutil.copy2(src_path, dest_file)
                dest_size = dest_file.stat().st_size
                total_dest_bytes += dest_size
                copied_files += 1
                
            # Process visual images (PNG/JPG) to WebP
            if src_path.suffix.lower() in [".png", ".jpg", ".jpeg"]:
                try:
                    with Image.open(src_path) as im:
                        im = im.convert("RGB")
                        orig_w, orig_h = im.size
                        
                        # Primary WebP (capped at 1920w max if larger, never upscale)
                        primary_w, primary_h = orig_w, orig_h
                        if orig_w > 1920:
                            primary_w = 1920
                            primary_h = int(round(orig_h * (1920 / orig_w)))
                            primary_im = im.resize((primary_w, primary_h), Image.Resampling.LANCZOS)
                        else:
                            primary_im = im
                            
                        primary_webp_name = f"{src_path.stem}.webp"
                        primary_dest = dest_subdir / primary_webp_name
                        primary_im.save(primary_dest, "WEBP", quality=85, method=6)
                        
                        p_size = primary_dest.stat().st_size
                        total_dest_bytes += p_size
                        processed_images += 1
                        
                        primary_url = f"/images/{rel_path.parent.as_posix()}/{primary_webp_name}".replace("/.", "")
                        if primary_url.startswith("//"):
                            primary_url = primary_url[1:]
                            
                        # Generate responsive srcset variants
                        srcset_parts = [f"{primary_url} {primary_w}w"]
                        variant_meta = []
                        
                        for target_w in RESPONSIVE_WIDTHS:
                            if orig_w > target_w + 60:
                                target_h = int(round(orig_h * (target_w / orig_w)))
                                var_im = im.resize((target_w, target_h), Image.Resampling.LANCZOS)
                                var_name = f"{src_path.stem}-{target_w}w.webp"
                                var_dest = dest_subdir / var_name
                                var_im.save(var_dest, "WEBP", quality=85, method=6)
                                
                                v_size = var_dest.stat().st_size
                                total_dest_bytes += v_size
                                variants_generated += 1
                                
                                var_url = f"/images/{rel_path.parent.as_posix()}/{var_name}".replace("/.", "")
                                if var_url.startswith("//"):
                                    var_url = var_url[1:]
                                srcset_parts.append(f"{var_url} {target_w}w")
                                variant_meta.append({"width": target_w, "height": target_h, "url": var_url})
                                
                        srcset_str = ", ".join(srcset_parts)
                        
                        # Catalog item metadata
                        item_meta = {
                            "src": primary_url,
                            "srcSet": srcset_str,
                            "sizes": "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
                            "width": primary_w,
                            "height": primary_h,
                            "alt": f.replace("-", " ").replace(".png", "")
                        }
                        
                        # Map to appropriate section in asset_catalog
                        if section == "products":
                            prod_slug = parts[1]
                            if prod_slug not in asset_catalog["products"]:
                                asset_catalog["products"][prod_slug] = []
                            asset_catalog["products"][prod_slug].append(item_meta)
                        elif section == "archive":
                            tradition = parts[1]
                            if tradition not in asset_catalog["archive"]:
                                asset_catalog["archive"][tradition] = []
                            asset_catalog["archive"][tradition].append(item_meta)
                        elif section == "brand":
                            if "brand" not in asset_catalog:
                                asset_catalog["brand"] = {}
                            asset_catalog["brand"][src_path.stem] = item_meta
                        else:
                            if section not in asset_catalog["editorial"]:
                                asset_catalog["editorial"][section] = []
                            asset_catalog["editorial"][section].append(item_meta)
                            
                except Exception as e:
                    print(f"Error processing {src_path}: {e}")
                    
    # Generate statistics
    reduction_bytes = total_source_bytes - total_dest_bytes
    reduction_pct = (reduction_bytes / total_source_bytes * 100) if total_source_bytes > 0 else 0
    
    print("\n--- Optimization Complete ---")
    print(f"Total Source Weight Audited: {total_source_bytes / (1024*1024):.2f} MB")
    print(f"Total Destination Weight:     {total_dest_bytes / (1024*1024):.2f} MB")
    print(f"Net Space Saved:              {reduction_bytes / (1024*1024):.2f} MB")
    print(f"Measured Reduction:           {reduction_pct:.2f}%")
    print(f"Processed Images:             {processed_images}")
    print(f"Responsive Variants Created:  {variants_generated}")
    print(f"Direct Copies (SVG/ICO/etc):  {copied_files}")
    
    # Save asset catalog to JSON and TypeScript
    with open("src/data/assetCatalog.json", "w", encoding="utf-8") as fp:
        json.dump(asset_catalog, fp, indent=2)
        
    return asset_catalog, {
        "source_mb": round(total_source_bytes / (1024*1024), 2),
        "dest_mb": round(total_dest_bytes / (1024*1024), 2),
        "reduction_pct": round(reduction_pct, 2),
        "processed_images": processed_images,
        "variants_generated": variants_generated,
        "copied_files": copied_files
    }

if __name__ == "__main__":
    main()
