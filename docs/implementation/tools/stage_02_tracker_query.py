import csv
import sys

sys.stdout.reconfigure(encoding="utf-8")

with open("docs/implementation/01b_AUDIT_TRACKER.csv", "r", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    stage2_rows = [row for row in reader if any(s.strip() in ["2", "STAGE-02", "Stage 2"] for s in row.get("assigned_stage", "").split(","))]
    print(f"Total Stage 2 rows: {len(stage2_rows)}")
    for r in stage2_rows:
        print(f"{r['item_id']} | {r['canonical_finding_id']} | {r['assigned_stage']} | {r['implementation_status']} | {r['verification_status']} | {r['final_disposition']} | {r['description'][:50]}")
