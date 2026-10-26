import csv
import re
import os

def generate_tracker():
    # 1. Read everthread_requirements_matrix_v3.csv for full descriptions and metadata
    matrix_v3 = {}
    v3_path = 'docs/reference/Historical matrices and decisions/everthread_requirements_matrix_v3.csv'
    if os.path.exists(v3_path):
        with open(v3_path, encoding='utf-8') as f:
            for r in csv.DictReader(f):
                matrix_v3[r['Requirement ID']] = r

    # 2. Read 01a_CHECKLIST_ROW_TO_STAGE_MAP.csv
    rows_01a = []
    with open('docs/implementation/01a_CHECKLIST_ROW_TO_STAGE_MAP.csv', encoding='utf-8') as f:
        rows_01a = list(csv.DictReader(f))

    # 3. Read 01_REQUIREMENTS_AND_DECISION_TRACEABILITY.md
    with open('docs/implementation/01_REQUIREMENTS_AND_DECISION_TRACEABILITY.md', encoding='utf-8') as f:
        tr_text = f.read()

    # Findings F-01..F-54
    f_part = tr_text.split('## E. Findings')[1].split('## F. New requirements')[0]
    findings = re.findall(r'^\|\s*(F-\d+)\s*\|\s*([^|]+)\|\s*([^|]+)\|\s*([^|]+)\|\s*([^|]+)\|\s*([^|]+)\|\s*([^|]+)\|', f_part, re.MULTILINE)

    # New reqs N-01..N-10
    n_part = tr_text.split('## F. New requirements')[1].split('## G. Acceptance-checklist')[0]
    new_reqs = re.findall(r'^\|\s*(N-\d+)\s*\|\s*([^|]+)\|\s*([^|]+)\|', n_part, re.MULTILINE)

    # Owner decisions O-1..O-14
    o_part = tr_text.split('## B. Owner decisions')[1].split('## C. Settled decisions')[0]
    owner_decs = re.findall(r'^\|\s*(O-\d+)\s*\|\s*([^|]+)\|\s*([^|]+)\|\s*([^|]+)\|\s*([^|]+)\|\s*([^|]+)\|\s*([^|]+)\|', o_part, re.MULTILINE)

    # DEC D-01..D-25
    d_part = tr_text.split('## D. Decision-register dispositions')[1].split('## E. Findings')[0]
    dec_items = re.findall(r'^\|\s*(D-\d+)[^|]*\|\s*([^|]+)\|', d_part, re.MULTILINE)

    # Blockers B-1..B-11 from 00 roadmap
    with open('docs/implementation/00_MASTER_IMPLEMENTATION_ROADMAP.md', encoding='utf-8') as f:
        rm_text = f.read()
    b_part = rm_text.split('## 7. Blockers and external evidence')[1].split('\n## ')[0]
    blockers = re.findall(r'^\|\s*(B-\d+)\s*\|\s*([^|]+)\|\s*([^|]+)\|\s*([^|]+)\|', b_part, re.MULTILINE)

    # Build finding-to-ref map
    finding_merged_refs = {}
    for f_row in findings:
        fid = f_row[0].strip()
        refs = f_row[6].strip()
        finding_merged_refs[fid] = refs

    tracker_rows = []

    # 4. Process CHECKLIST_ROW and V3_ROW from 01a (369 rows)
    for r in rows_01a:
        row_id = r['Row ID'].strip()
        is_v3 = row_id.startswith('V3-')
        item_type = 'V3_ROW' if is_v3 else 'CHECKLIST_ROW'
        
        v3_meta = matrix_v3.get(row_id, {})
        desc = v3_meta.get('Requirement', r['Requirement (truncated)'].strip())
        source = v3_meta.get('Source (file L# / section)', f"01a Group {r.get('Group', '').strip()}")
        priority = v3_meta.get('Severity / recommended action', '')
        v3_status = r['v3 status'].strip()
        assigned_stage = r['Stage(s)'].strip().strip('"')

        # Link to canonical finding if mentioned in findings merged refs
        canonical_fid = ''
        for fid, refs in finding_merged_refs.items():
            if row_id in refs:
                canonical_fid = fid
                break

        # Seeding per 6.5
        notes = f"Seed from 01a v3_status={v3_status}"
        awaiting_owner = 'FALSE'
        final_disp = 'OPEN'

        if v3_status == 'PASS':
            impl_status = 'IMPLEMENTED'
            verif_status = 'NOT VERIFIED'
            notes = f"historical PASS (local build), re-verify in Stage {assigned_stage}"
        elif v3_status == 'FAIL':
            impl_status = 'NOT STARTED'
            verif_status = 'FAIL'
            notes = f"historical FAIL (commit ebf7b6b); re-confirm in Stage 1 / Stage {assigned_stage}"
        elif v3_status in ['PARTIAL', 'SOURCE RISK']:
            impl_status = 'PARTIALLY IMPLEMENTED'
            verif_status = 'NOT VERIFIED'
        elif v3_status == 'SOURCE VERIFIED':
            impl_status = 'IMPLEMENTED'
            verif_status = 'NOT VERIFIED'
        elif v3_status == 'NOT VERIFIED':
            impl_status = 'NOT STARTED'
            verif_status = 'NOT VERIFIED'
        elif v3_status in ['NEEDS APPROVAL', 'BLOCKED']:
            impl_status = 'BLOCKED'
            verif_status = 'BLOCKED — EVIDENCE OR APPROVAL REQUIRED'
            awaiting_owner = 'TRUE'
        else:
            impl_status = 'NOT STARTED'
            verif_status = 'NOT VERIFIED'

        tracker_rows.append({
            'item_id': row_id,
            'item_type': item_type,
            'canonical_finding_id': canonical_fid,
            'other_ids': '',
            'checklist_row_id': row_id,
            'source_file_and_section': source,
            'description': desc,
            'priority_severity': priority,
            'owner_decision_ids': '',
            'assigned_stage': assigned_stage,
            'required_action': v3_meta.get('Runtime test needed', ''),
            'acceptance_test_ids': '',
            'implementation_status': impl_status,
            'verification_status': verif_status,
            'awaiting_owner_approval': awaiting_owner,
            'evidence_paths': '',
            'outstanding_work': 'To be implemented/verified per stage roadmap',
            'dependencies_blockers': '',
            'final_disposition': final_disp,
            'discovered_in_stage': '',
            'last_updated': 'STAGE-01 2026-10-26',
            'notes': notes
        })

    # 5. Process FINDING rows F-01..F-54 (54 rows)
    for f_row in findings:
        fid = f_row[0].strip()
        f_desc = f_row[1].strip()
        f_disp = f_row[2].strip()
        f_stage = f_row[3].strip()
        f_files = f_row[4].strip()
        f_tests = f_row[5].strip()
        f_refs = f_row[6].strip()

        awaiting_owner = 'FALSE'
        final_disp = 'OPEN'

        if 'Hold' in f_disp:
            impl_status = 'BLOCKED'
            verif_status = 'BLOCKED — EVIDENCE OR APPROVAL REQUIRED'
            awaiting_owner = 'TRUE'
        elif f_disp in ['Impl', 'Verify', 'Impl (behaviour)', 'Impl (fields)', 'Impl/verify']:
            impl_status = 'NOT STARTED'
            verif_status = 'NOT VERIFIED'
        elif 'Closed' in f_disp:
            if 'keep' in f_disp or 'separate collection' in f_disp or 'deferred' in f_disp:
                impl_status = 'IMPLEMENTED'
                verif_status = 'NOT VERIFIED'
            else:
                impl_status = 'NOT STARTED'
                verif_status = 'NOT VERIFIED'
        else:
            impl_status = 'NOT STARTED'
            verif_status = 'NOT VERIFIED'

        tracker_rows.append({
            'item_id': fid,
            'item_type': 'FINDING',
            'canonical_finding_id': fid,
            'other_ids': f_refs,
            'checklist_row_id': '',
            'source_file_and_section': '01_REQUIREMENTS_AND_DECISION_TRACEABILITY.md §E',
            'description': f_desc,
            'priority_severity': '',
            'owner_decision_ids': '',
            'assigned_stage': f_stage,
            'required_action': f_disp,
            'acceptance_test_ids': f_tests,
            'implementation_status': impl_status,
            'verification_status': verif_status,
            'awaiting_owner_approval': awaiting_owner,
            'evidence_paths': '',
            'outstanding_work': f"Files: {f_files}",
            'dependencies_blockers': '',
            'final_disposition': final_disp,
            'discovered_in_stage': '',
            'last_updated': 'STAGE-01 2026-10-26',
            'notes': f"Disposition: {f_disp}"
        })

    # 6. Process NEW_REQUIREMENT rows N-01..N-10 (10 rows)
    for n_row in new_reqs:
        nid = n_row[0].strip()
        n_desc = n_row[1].strip()
        n_stage = n_row[2].strip()

        tracker_rows.append({
            'item_id': nid,
            'item_type': 'NEW_REQUIREMENT',
            'canonical_finding_id': '',
            'other_ids': '',
            'checklist_row_id': '',
            'source_file_and_section': '01_REQUIREMENTS_AND_DECISION_TRACEABILITY.md §F',
            'description': n_desc,
            'priority_severity': '',
            'owner_decision_ids': '',
            'assigned_stage': n_stage,
            'required_action': 'Implement per stage specification',
            'acceptance_test_ids': '',
            'implementation_status': 'NOT STARTED',
            'verification_status': 'NOT VERIFIED',
            'awaiting_owner_approval': 'FALSE',
            'evidence_paths': '',
            'outstanding_work': f"Assigned to Stage {n_stage}",
            'dependencies_blockers': '',
            'final_disposition': 'OPEN',
            'discovered_in_stage': '',
            'last_updated': 'STAGE-01 2026-10-26',
            'notes': ''
        })

    # 7. Process OWNER_DECISION rows O-1..O-14 (14 rows)
    for o_row in owner_decs:
        oid = o_row[0].strip()
        o_letter = o_row[1].strip()
        o_text = o_row[2].strip()
        o_status = o_row[3].strip()
        o_effect = o_row[4].strip()
        o_blocks = o_row[5].strip()
        o_stage = o_row[6].strip()

        # Update O-6 and O-7 per Master Prompt §5 confirmed instructions
        awaiting_owner = 'FALSE'
        notes = f"Letter: {o_letter}; Status: {o_status}; Effect: {o_effect}"
        if oid == 'O-6':
            o_status = 'CONFIRMED BY OWNER TEXT (O-6-C)'
            notes = 'O-6-C confirmed by owner in Master Prompt §5: evaluate every image individually; images remain unapproved until owner reviews'
            impl_status = 'PARTIALLY IMPLEMENTED'
            verif_status = 'BLOCKED — EVIDENCE OR APPROVAL REQUIRED'
            awaiting_owner = 'TRUE'
        elif oid == 'O-7':
            o_status = 'CONFIRMED BY OWNER TEXT'
            notes = 'O-7 confirmed by owner in Master Prompt §5: related link only when genuinely similar defensible product is listed'
            impl_status = 'PARTIALLY IMPLEMENTED'
            verif_status = 'NOT VERIFIED'
            awaiting_owner = 'FALSE'
        elif oid in ['O-13', 'O-14']:
            impl_status = 'IMPLEMENTED'
            verif_status = 'NOT VERIFIED'
            awaiting_owner = 'FALSE'
        elif 'BLOCKED' in o_status:
            impl_status = 'BLOCKED'
            verif_status = 'BLOCKED — EVIDENCE OR APPROVAL REQUIRED'
            awaiting_owner = 'TRUE'
        elif 'DEFAULT APPLIED' in o_status:
            impl_status = 'PARTIALLY IMPLEMENTED'
            verif_status = 'NOT VERIFIED'
            awaiting_owner = 'TRUE'
        else:
            impl_status = 'NOT STARTED'
            verif_status = 'NOT VERIFIED'

        tracker_rows.append({
            'item_id': oid,
            'item_type': 'OWNER_DECISION',
            'canonical_finding_id': '',
            'other_ids': '',
            'checklist_row_id': '',
            'source_file_and_section': '01_REQUIREMENTS_AND_DECISION_TRACEABILITY.md §B',
            'description': o_text,
            'priority_severity': '',
            'owner_decision_ids': oid,
            'assigned_stage': o_stage,
            'required_action': o_status,
            'acceptance_test_ids': '',
            'implementation_status': impl_status,
            'verification_status': verif_status,
            'awaiting_owner_approval': awaiting_owner,
            'evidence_paths': '',
            'outstanding_work': f"Blocks: {o_blocks}",
            'dependencies_blockers': o_blocks,
            'final_disposition': 'OPEN',
            'discovered_in_stage': '',
            'last_updated': 'STAGE-01 2026-10-26',
            'notes': notes
        })

    # 8. Process DECISION_REGISTER rows DEC D-01..D-25 (25 rows)
    for d_row in dec_items:
        did = f"DEC {d_row[0].strip()}"
        d_disp = d_row[1].strip()

        awaiting_owner = 'FALSE'
        final_disp = 'OPEN'
        notes = d_disp

        if d_row[0].strip() == 'D-24':
            notes = 'resolved by owner instruction in the master prompt'
            impl_status = 'IMPLEMENTED'
            verif_status = 'NOT VERIFIED'
        elif d_row[0].strip() == 'D-12':
            final_disp = 'DEFERRED BY DECISION'
            impl_status = 'IMPLEMENTED'
            verif_status = 'NOT VERIFIED'
        elif d_row[0].strip() == 'D-15':
            final_disp = 'SUPERSEDED (Stage 2 related-piece pattern)'
            impl_status = 'IMPLEMENTED'
            verif_status = 'NOT VERIFIED'
        elif 'On hold' in d_disp or 'Pending owner' in d_disp:
            impl_status = 'BLOCKED'
            verif_status = 'BLOCKED — EVIDENCE OR APPROVAL REQUIRED'
            awaiting_owner = 'TRUE'
        elif 'Not recoverable' in d_disp:
            impl_status = 'BLOCKED'
            verif_status = 'BLOCKED — EVIDENCE OR APPROVAL REQUIRED'
            awaiting_owner = 'TRUE'
        elif 'Approved' in d_disp or 'Resolved' in d_disp or 'Closed' in d_disp:
            impl_status = 'NOT STARTED'
            verif_status = 'NOT VERIFIED'
        else:
            impl_status = 'NOT STARTED'
            verif_status = 'NOT VERIFIED'

        tracker_rows.append({
            'item_id': did,
            'item_type': 'DECISION_REGISTER',
            'canonical_finding_id': '',
            'other_ids': d_row[0].strip(),
            'checklist_row_id': '',
            'source_file_and_section': '01_REQUIREMENTS_AND_DECISION_TRACEABILITY.md §D',
            'description': d_disp,
            'priority_severity': '',
            'owner_decision_ids': '',
            'assigned_stage': '',
            'required_action': d_disp,
            'acceptance_test_ids': '',
            'implementation_status': impl_status,
            'verification_status': verif_status,
            'awaiting_owner_approval': awaiting_owner,
            'evidence_paths': '',
            'outstanding_work': '',
            'dependencies_blockers': '',
            'final_disposition': final_disp,
            'discovered_in_stage': '',
            'last_updated': 'STAGE-01 2026-10-26',
            'notes': notes
        })

    # 9. Process BLOCKER rows B-1..B-11 (11 rows)
    for b_row in blockers:
        bid = b_row[0].strip()
        b_desc = b_row[1].strip()
        b_affects = b_row[2].strip()
        b_handling = b_row[3].strip()

        notes = f"Handling: {b_handling}"
        final_disp = 'OPEN'
        if bid == 'B-11':
            notes = 'Resolved by owner instruction in master prompt'
            impl_status = 'IMPLEMENTED'
            verif_status = 'NOT VERIFIED'
            awaiting_owner = 'FALSE'
        else:
            impl_status = 'BLOCKED'
            verif_status = 'BLOCKED — EVIDENCE OR APPROVAL REQUIRED'
            awaiting_owner = 'TRUE'

        tracker_rows.append({
            'item_id': bid,
            'item_type': 'BLOCKER',
            'canonical_finding_id': '',
            'other_ids': '',
            'checklist_row_id': '',
            'source_file_and_section': '00_MASTER_IMPLEMENTATION_ROADMAP.md §7',
            'description': b_desc,
            'priority_severity': 'Blocker',
            'owner_decision_ids': '',
            'assigned_stage': b_affects,
            'required_action': b_handling,
            'acceptance_test_ids': '',
            'implementation_status': impl_status,
            'verification_status': verif_status,
            'awaiting_owner_approval': awaiting_owner,
            'evidence_paths': '',
            'outstanding_work': b_handling,
            'dependencies_blockers': b_affects,
            'final_disposition': final_disp,
            'discovered_in_stage': '',
            'last_updated': 'STAGE-01 2026-10-26',
            'notes': notes
        })

    # Write out to docs/implementation/01b_AUDIT_TRACKER.csv
    fields = [
        'item_id', 'item_type', 'canonical_finding_id', 'other_ids', 'checklist_row_id',
        'source_file_and_section', 'description', 'priority_severity', 'owner_decision_ids',
        'assigned_stage', 'required_action', 'acceptance_test_ids', 'implementation_status',
        'verification_status', 'awaiting_owner_approval', 'evidence_paths', 'outstanding_work',
        'dependencies_blockers', 'final_disposition', 'discovered_in_stage', 'last_updated', 'notes'
    ]

    out_path = 'docs/implementation/01b_AUDIT_TRACKER.csv'
    with open(out_path, 'w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fields)
        writer.writeheader()
        writer.writerows(tracker_rows)

    print(f"Successfully generated {out_path} with {len(tracker_rows)} rows.")

if __name__ == '__main__':
    generate_tracker()
