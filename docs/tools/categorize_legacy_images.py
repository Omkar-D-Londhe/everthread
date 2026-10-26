import os
import hashlib
import csv
from collections import defaultdict
from PIL import Image

def run():
    with open('docs/implementation/02a_ASSET_REGISTRY.csv', encoding='utf-8') as f:
        registry = list(csv.DictReader(f))
    reg_by_sha = {r['sha'].strip(): r for r in registry if r['sha'].strip()}

    # Also collect all existing public/ image shas
    pub_by_sha = {}
    for root, dirs, files in os.walk('public'):
        for f in files:
            fp = os.path.join(root, f)
            with open(fp, 'rb') as fp_in:
                sha12 = hashlib.sha256(fp_in.read()).hexdigest()[:12]
            pub_by_sha[sha12] = os.path.relpath(fp, 'public').replace('\\', '/')

    archive_dir = r'_legacy_archive\Images'
    archive_inventory = []

    for root, dirs, files in os.walk(archive_dir):
        for f in files:
            if f.lower() == 'desktop.ini':
                continue
            fp = os.path.join(root, f)
            rel = os.path.relpath(fp, archive_dir).replace('\\', '/')
            size_kb = os.path.getsize(fp) // 1024
            with open(fp, 'rb') as fp_in:
                data = fp_in.read()
            sha12 = hashlib.sha256(data).hexdigest()[:12]
            try:
                img = Image.open(fp)
                dims = f"{img.width}x{img.height}"
                mode = img.mode
                fmt = img.format
            except Exception as e:
                dims = "N/A"
                mode = "N/A"
                fmt = "N/A"

            reg_match = reg_by_sha.get(sha12)
            pub_match = pub_by_sha.get(sha12)

            archive_inventory.append({
                'rel_path': rel,
                'filename': f,
                'dims': dims,
                'mode': mode,
                'fmt': fmt,
                'size_kb': size_kb,
                'sha12': sha12,
                'reg_id': reg_match['id'] if reg_match else None,
                'reg_status': reg_match['status'] if reg_match else None,
                'pub_path': pub_match
            })

    print(f"Total valid image files in _legacy_archive/Images: {len(archive_inventory)}")
    in_reg = [x for x in archive_inventory if x['reg_id']]
    print(f"Matches in 02a registry: {len(in_reg)}")
    in_pub = [x for x in archive_inventory if x['pub_path']]
    print(f"Matches in public/ (exact binary match): {len(in_pub)}")
    unique_archive = [x for x in archive_inventory if not x['reg_id'] and not x['pub_path']]
    print(f"Unique to _legacy_archive/Images (not in registry and not in public): {len(unique_archive)}")

    print("\nUnique archive files summary by directory:")
    by_dir = defaultdict(list)
    for x in unique_archive:
        d = os.path.dirname(x['rel_path']) or 'root'
        by_dir[d].append(x)

    for d, items in sorted(by_dir.items()):
        print(f"\n  Directory: {d} ({len(items)} files):")
        for it in items:
            bname = it['filename']
            print(f"    {bname} | {it['dims']} | {it['size_kb']}KB | sha={it['sha12']}")

if __name__ == '__main__':
    run()
