import zipfile
import hashlib
import csv
import os
import re
from PIL import Image
import io

def verify():
    zip_path = r'C:\Users\omkar\OneDrive\Desktop\EverThread_Asset_Handover.zip'
    if not os.path.exists(zip_path):
        print(f"Error: {zip_path} not found.")
        return

    with zipfile.ZipFile(zip_path, 'r') as z:
        infolist = z.infolist()
        png_files = [f for f in infolist if f.filename.endswith('.png')]

        with open('docs/implementation/02a_ASSET_REGISTRY.csv', encoding='utf-8') as f:
            registry = list(csv.DictReader(f))

        reg_by_zip = {}
        for r in registry:
            zpath = r['zip'].replace('\\', '/').strip()
            if zpath:
                reg_by_zip[zpath] = r

        differences = []
        verified_assets = []

        for f in png_files:
            fname = f.filename.replace('\\', '/').strip()
            data = z.read(f.filename)
            sha = hashlib.sha256(data).hexdigest()[:12]
            size_kb = len(data) // 1024
            img = Image.open(io.BytesIO(data))
            dims = f"{img.width}x{img.height}"

            reg_row = reg_by_zip.get(fname)
            if not reg_row:
                differences.append(f"File in zip not in registry: {fname}")
            else:
                reg_sha = reg_row['sha'].strip()
                # parse registry dims
                m = re.search(r'(\d+)[^\d]+(\d+)', reg_row['dims'])
                if m:
                    reg_w, reg_h = int(m.group(1)), int(m.group(2))
                    dims_match = (img.width == reg_w and img.height == reg_h)
                else:
                    dims_match = False
                sha_match = (sha == reg_sha)

                verified_assets.append({
                    'id': reg_row['id'],
                    'fname': fname,
                    'dims': dims,
                    'mode': img.mode,
                    'sha': sha,
                    'reg_sha': reg_sha,
                    'sha_match': sha_match,
                    'dims_match': dims_match,
                    'status': reg_row['status'],
                    'limit': reg_row['limit']
                })

                if not sha_match or not dims_match:
                    differences.append(f"Mismatch for {reg_row['id']}: dims={dims} (reg={reg_row['dims']}), sha={sha} (reg={reg_sha})")

        print(f"Total PNG files in ZIP: {len(png_files)}")
        print(f"Verified assets matched to registry: {len(verified_assets)}")
        print(f"Total differences / mismatches: {len(differences)}")
        if differences:
            for d in differences:
                print("  ", d)

        # Check repository and public/ for TR assets
        repo_tr_files = []
        for root, dirs, files in os.walk('public'):
            for file in files:
                if 'tr-0' in file.lower() or 'living-inheritance' in file.lower():
                    repo_tr_files.append(os.path.join(root, file))

        print(f"TR assets in public/: {len(repo_tr_files)}")

        # Check AST-HOME-PLATE (expected NOT_YET_SUPPLIED)
        home_plate = [r for r in registry if r['id'] == 'AST-HOME-PLATE']
        print(f"AST-HOME-PLATE in registry: {len(home_plate)} row, status: {home_plate[0]['status'] if home_plate else 'N/A'}")

        # Check REPO-DIAG-* (9 diagrams in repo)
        repo_diags = [r for r in registry if r['id'].startswith('REPO-DIAG-')]
        print(f"REPO-DIAG-* in registry: {len(repo_diags)} rows")

if __name__ == '__main__':
    verify()
