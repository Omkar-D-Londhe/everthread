import os
import hashlib
import csv
from PIL import Image

def run():
    # Read 02a registry
    with open('docs/implementation/02a_ASSET_REGISTRY.csv', encoding='utf-8') as f:
        registry = list(csv.DictReader(f))

    reg_by_sha = {r['sha'].strip(): r for r in registry if r['sha'].strip()}

    print("=== TR PRODUCTS IN _legacy_archive/Images/products ===")
    tr_dir = r'_legacy_archive\Images\products'
    for folder in sorted(os.listdir(tr_dir)):
        if folder.startswith('tr-'):
            p = os.path.join(tr_dir, folder)
            files = sorted(os.listdir(p))
            print(f"\n{folder} ({len(files)} files):")
            for f in files:
                fp = os.path.join(p, f)
                with open(fp, 'rb') as fp_in:
                    data = fp_in.read()
                    sha12 = hashlib.sha256(data).hexdigest()[:12]
                    size_kb = len(data) // 1024
                img = Image.open(fp)
                match_row = reg_by_sha.get(sha12)
                if match_row:
                    match_info = f"MATCHES REGISTRY: {match_row['id']} ({match_row['status']})"
                else:
                    match_info = "NEW / NOT IN REGISTRY"
                print(f"  {f} | {img.width}x{img.height} | {img.mode} | {size_kb}KB | sha={sha12} | {match_info}")

    print("\n=== HOME IMAGES IN _legacy_archive/Images/home ===")
    home_dir = r'_legacy_archive\Images\home'
    for f in sorted(os.listdir(home_dir)):
        fp = os.path.join(home_dir, f)
        with open(fp, 'rb') as fp_in:
            data = fp_in.read()
            sha12 = hashlib.sha256(data).hexdigest()[:12]
            size_kb = len(data) // 1024
        try:
            img = Image.open(fp)
            dims = f"{img.width}x{img.height}"
            mode = img.mode
        except Exception as e:
            dims = f"ERR: {e}"
            mode = "N/A"
        match_row = reg_by_sha.get(sha12)
        if match_row:
            match_info = f"MATCHES REGISTRY: {match_row['id']} ({match_row['status']})"
        else:
            match_info = "NOT IN REGISTRY"
        print(f"  {f} | {dims} | {mode} | {size_kb}KB | sha={sha12} | {match_info}")

if __name__ == '__main__':
    run()
