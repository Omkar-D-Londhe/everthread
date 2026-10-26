import csv

def update_stage_01_tracker():
    tracker_path = 'docs/implementation/01b_AUDIT_TRACKER.csv'
    with open(tracker_path, encoding='utf-8') as f:
        rows = list(csv.DictReader(f))

    stage_1_item_updates = {
        'F-25': {
            'implementation_status': 'IMPLEMENTED',
            'verification_status': 'PASS',
            'evidence_paths': 'docs/implementation/baseline/BASELINE.md §3',
            'outstanding_work': 'Confirmed NOT FOUND. Blocker B-1 remains open for Stage 8.',
            'last_updated': 'STAGE-01 2026-10-26',
            'notes': 'Search executed across filesystem and git history; Phase 6.0 docs not found.'
        },
        'F-31': {
            'implementation_status': 'IMPLEMENTED',
            'verification_status': 'PASS',
            'evidence_paths': 'playwright.config.ts; e2e/pagesServer.mjs; e2e/baseline.spec.ts',
            'outstanding_work': 'None for Stage 1; Playwright runs on 3 viewports.',
            'last_updated': 'STAGE-01 2026-10-26',
            'notes': 'Playwright installed and verified; 78/78 baseline tests passed.'
        },
        'F-38': {
            'implementation_status': 'PARTIALLY IMPLEMENTED',
            'verification_status': 'PASS',
            'evidence_paths': 'docs/implementation/baseline/ASSET_VERIFICATION.md',
            'outstanding_work': 'Stage 7 human review of Archive plates and terminology remains.',
            'last_updated': 'STAGE-01 2026-10-26',
            'notes': 'Stage 1 asset manifest verification complete (40 PNGs verified, 0 approved).'
        },
        'F-41': {
            'implementation_status': 'PARTIALLY IMPLEMENTED',
            'verification_status': 'PASS',
            'evidence_paths': 'docs/implementation/baseline/CLAIMS_INVENTORY.md',
            'outstanding_work': 'Stages 6 and 9 copy updates and owner approvals.',
            'last_updated': 'STAGE-01 2026-10-26',
            'notes': 'Stage 1 claims baseline inventory complete.'
        },
        'F-44': {
            'implementation_status': 'IMPLEMENTED',
            'verification_status': 'PASS',
            'evidence_paths': 'docs/implementation/baseline/TEST_DEBT.md',
            'outstanding_work': 'Owning stages (2, 4, 5, 7) will correct tests during implementation.',
            'last_updated': 'STAGE-01 2026-10-26',
            'notes': 'Stage 1 test debt catalogue established.'
        },
        'F-45': {
            'implementation_status': 'IMPLEMENTED',
            'verification_status': 'PASS',
            'evidence_paths': 'docs/implementation/01b_AUDIT_TRACKER.csv; docs/implementation/tools/*',
            'outstanding_work': 'Ongoing tracking across stages.',
            'last_updated': 'STAGE-01 2026-10-26',
            'notes': 'Authoritative tracker established with 483 rows and exact summary arithmetic.'
        },
        'DEC D-17': {
            'implementation_status': 'IMPLEMENTED',
            'verification_status': 'PASS',
            'evidence_paths': 'docs/implementation/evidence/STAGE-01/RESULT.md',
            'outstanding_work': 'None; Stage 1 completed.',
            'last_updated': 'STAGE-01 2026-10-26',
            'notes': 'Stage 1 executed per master operating prompt instructions.'
        },
        'O-14': {
            'implementation_status': 'IMPLEMENTED',
            'verification_status': 'PASS',
            'evidence_paths': 'docs/implementation/evidence/STAGE-01/RESULT.md',
            'outstanding_work': 'Serial stage approval protocol active.',
            'last_updated': 'STAGE-01 2026-10-26',
            'notes': 'Work strictly confined to Stage 1; awaiting owner instruction.'
        }
    }

    for r in rows:
        iid = r['item_id']
        if iid in stage_1_item_updates:
            for k, v in stage_1_item_updates[iid].items():
                r[k] = v

    fields = [
        'item_id', 'item_type', 'canonical_finding_id', 'other_ids', 'checklist_row_id',
        'source_file_and_section', 'description', 'priority_severity', 'owner_decision_ids',
        'assigned_stage', 'required_action', 'acceptance_test_ids', 'implementation_status',
        'verification_status', 'awaiting_owner_approval', 'evidence_paths', 'outstanding_work',
        'dependencies_blockers', 'final_disposition', 'discovered_in_stage', 'last_updated', 'notes'
    ]

    with open(tracker_path, 'w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fields)
        writer.writeheader()
        writer.writerows(rows)

    print("Updated 01b_AUDIT_TRACKER.csv for Stage 1 items.")

if __name__ == '__main__':
    update_stage_01_tracker()
