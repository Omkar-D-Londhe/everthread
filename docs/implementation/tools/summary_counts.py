import csv
import sys
import re

def compute_summary(stage_filter=None):
    tracker_path = 'docs/implementation/01b_AUDIT_TRACKER.csv'
    with open(tracker_path, encoding='utf-8') as f:
        rows = list(csv.DictReader(f))

    # Types
    # Tracked items: CHECKLIST_ROW + V3_ROW + FINDING + NEW_REQUIREMENT
    tracked_types = {'CHECKLIST_ROW', 'V3_ROW', 'FINDING', 'NEW_REQUIREMENT'}
    
    if stage_filter:
        target = stage_filter.lstrip('0')
        pat = re.compile(rf'(?<!\d)0?{target}(?!\d)')
        def match_stage(r):
            st = r['assigned_stage']
            return bool(pat.search(st))
        filtered_rows = [r for r in rows if match_stage(r)]
    else:
        filtered_rows = rows

    tracked_items = [r for r in filtered_rows if r['item_type'] in tracked_types]
    owner_decisions = [r for r in filtered_rows if r['item_type'] == 'OWNER_DECISION']
    decision_register = [r for r in filtered_rows if r['item_type'] == 'DECISION_REGISTER']
    blockers = [r for r in filtered_rows if r['item_type'] == 'BLOCKER']

    # Primary partition precedence order:
    # 1. Justified not applicable: implementation_status == 'NOT APPLICABLE — JUSTIFIED' or final_disposition.startswith('JUSTIFIED NOT APPLICABLE')
    # 2. Failed: verification_status == 'FAIL'
    # 3. Blocked: implementation_status == 'BLOCKED' or verification_status == 'BLOCKED — EVIDENCE OR APPROVAL REQUIRED'
    # 4. Verified and passed: implementation_status == 'IMPLEMENTED' and verification_status == 'PASS'
    # 5. Implemented but not verified: (implementation_status in ['IMPLEMENTED', 'PARTIALLY IMPLEMENTED']) and (verification_status in ['NOT VERIFIED', 'TESTING'])
    # 6. In progress: implementation_status == 'IN PROGRESS'
    # 7. Not started: all remaining (e.g. implementation_status == 'NOT STARTED')

    b_jna = []
    b_fail = []
    b_blocked = []
    b_pass = []
    b_impl_not_verif = []
    b_in_prog = []
    b_not_started = []

    for r in tracked_items:
        istat = r['implementation_status']
        vstat = r['verification_status']
        fdisp = r['final_disposition']

        if istat == 'NOT APPLICABLE — JUSTIFIED' or fdisp.startswith('JUSTIFIED NOT APPLICABLE'):
            b_jna.append(r)
        elif vstat == 'FAIL':
            b_fail.append(r)
        elif istat == 'BLOCKED' or vstat == 'BLOCKED — EVIDENCE OR APPROVAL REQUIRED':
            b_blocked.append(r)
        elif istat == 'IMPLEMENTED' and vstat == 'PASS':
            b_pass.append(r)
        elif istat in ['IMPLEMENTED', 'PARTIALLY IMPLEMENTED'] and vstat in ['NOT VERIFIED', 'TESTING']:
            b_impl_not_verif.append(r)
        elif istat == 'IN PROGRESS':
            b_in_prog.append(r)
        else:
            b_not_started.append(r)

    total_tracked = len(tracked_items)
    partition_sum = (len(b_jna) + len(b_fail) + len(b_blocked) + len(b_pass) +
                     len(b_impl_not_verif) + len(b_in_prog) + len(b_not_started))

    # Overlays
    awaiting_owner = [r for r in tracked_items if r['awaiting_owner_approval'] == 'TRUE']
    newly_discovered = [r for r in tracked_items if r['discovered_in_stage'] != '']
    fully_closed = [r for r in tracked_items if r['final_disposition'] == 'FULLY CLOSED']

    # Distinct counts
    mapped_to_stage = [r for r in tracked_items if r['assigned_stage'] != '']
    implemented = [r for r in tracked_items if r['implementation_status'] in ['IMPLEMENTED', 'PARTIALLY IMPLEMENTED']]
    verified = [r for r in tracked_items if r['verification_status'] == 'PASS']

    # Decisions classification (whole project or stage)
    # Confirmed / Default applied / Blocked / Pending
    dec_confirmed = 0
    dec_default = 0
    dec_blocked = 0
    dec_pending = 0

    all_decs = owner_decisions + decision_register
    for d in all_decs:
        text = d['required_action'] + ' ' + d['notes'] + ' ' + d['description']
        if 'CONFIRMED' in text.upper() or 'RESOLVED' in text.upper() or 'APPROVED' in text.upper():
            dec_confirmed += 1
        elif 'DEFAULT APPLIED' in text.upper():
            dec_default += 1
        elif 'BLOCKED' in text.upper() or 'ON HOLD' in text.upper() or 'NOT RECOVERABLE' in text.upper():
            dec_blocked += 1
        elif 'PENDING' in text.upper():
            dec_pending += 1
        else:
            dec_confirmed += 1

    scope_name = f"Stage {stage_filter}" if stage_filter else "Whole Project"
    print(f"=== AUDIT TRACKER SUMMARY ({scope_name}) ===")
    print(f"Formula: CHECKLIST_ROW + V3_ROW + FINDING + NEW_REQUIREMENT = Total Tracked Items")
    print(f"Tracked Items breakdown:")
    cl_count = len([r for r in tracked_items if r['item_type'] == 'CHECKLIST_ROW'])
    v3_count = len([r for r in tracked_items if r['item_type'] == 'V3_ROW'])
    f_count = len([r for r in tracked_items if r['item_type'] == 'FINDING'])
    n_count = len([r for r in tracked_items if r['item_type'] == 'NEW_REQUIREMENT'])
    print(f"  CHECKLIST_ROW: {cl_count}")
    print(f"  V3_ROW: {v3_count}")
    print(f"  FINDING: {f_count}")
    print(f"  NEW_REQUIREMENT: {n_count}")
    print(f"  Total Tracked Items: {total_tracked}")
    print(f"Separate categories:")
    print(f"  OWNER_DECISION: {len(owner_decisions)}")
    print(f"  DECISION_REGISTER: {len(decision_register)}")
    print(f"  BLOCKER: {len(blockers)}")
    print(f"")
    print(f"Primary Partition (Precedence: JNA > Fail > Blocked > Verified/Pass > Impl Not Verified > In Progress > Not Started):")
    print(f"  1. Justified not applicable: {len(b_jna)}")
    print(f"  2. Failed (verification FAIL): {len(b_fail)}")
    print(f"  3. Blocked (impl or verif blocked): {len(b_blocked)}")
    print(f"  4. Verified and passed (IMPLEMENTED & PASS): {len(b_pass)}")
    print(f"  5. Implemented but not verified: {len(b_impl_not_verif)}")
    print(f"  6. In progress: {len(b_in_prog)}")
    print(f"  7. Not started: {len(b_not_started)}")
    print(f"  Partition Arithmetic: {len(b_jna)} + {len(b_fail)} + {len(b_blocked)} + {len(b_pass)} + {len(b_impl_not_verif)} + {len(b_in_prog)} + {len(b_not_started)} = {partition_sum} (Total: {total_tracked})")
    assert partition_sum == total_tracked, f"Partition sum {partition_sum} != total {total_tracked}"
    print(f"")
    print(f"Overlays (not part of partition):")
    print(f"  Awaiting owner approval: {len(awaiting_owner)}")
    print(f"  Newly discovered: {len(newly_discovered)}")
    print(f"  Fully closed: {len(fully_closed)}")
    print(f"")
    print(f"Distinct Counts:")
    print(f"  Mapped to a stage: {len(mapped_to_stage)}")
    print(f"  Implemented (IMPLEMENTED or PARTIALLY IMPLEMENTED): {len(implemented)}")
    print(f"  Verified (PASS): {len(verified)}")
    print(f"  Fully closed: {len(fully_closed)}")
    print(f"")
    print(f"Decisions Summary ({len(all_decs)} total decisions):")
    print(f"  Confirmed / Resolved / Approved: {dec_confirmed}")
    print(f"  Default applied: {dec_default}")
    print(f"  Blocked: {dec_blocked}")
    print(f"  Pending owner: {dec_pending}")
    print(f"=================================================")

if __name__ == '__main__':
    stage = sys.argv[1] if len(sys.argv) > 1 else None
    compute_summary(stage)
