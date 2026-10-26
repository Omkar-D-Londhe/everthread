import csv

def update_stage_02_tracker():
    tracker_path = 'docs/implementation/01b_AUDIT_TRACKER.csv'
    with open(tracker_path, encoding='utf-8') as f:
        rows = list(csv.DictReader(f))

    # Explicit map of item_id -> updates
    # We update implementation_status, verification_status, evidence_paths, outstanding_work, last_updated, notes
    updates = {
        'F-05': {
            'implementation_status': 'IMPLEMENTED',
            'verification_status': 'PASS',
            'awaiting_owner_approval': 'TRUE',
            'evidence_paths': 'src/data/archiveRelations.ts; src/components/TraditionExhibitionModal.tsx; src/tests/stage02-unit.test.ts; e2e/stage02.spec.ts',
            'outstanding_work': 'Stage 2 removal of Acquire complete. Banarasi & Kota Doria relation entries held per DEC D-25 / F-52. Stage 7 exhibition UI redesign remains.',
            'last_updated': 'STAGE-02 2026-10-26',
            'notes': 'Acquire to Bag removed from Archive modal. Banarasi and Kota Doria entries set to blocked. Sozni info-only and Muga none verified in UT-ARCH-01 and E2E-ARCH-03.'
        },
        'F-09': {
            'implementation_status': 'IMPLEMENTED',
            'verification_status': 'PASS',
            'awaiting_owner_approval': 'FALSE',
            'final_disposition': 'CLOSED',
            'evidence_paths': 'src/components/SearchModal.tsx; src/tests/stage02-unit.test.ts; e2e/stage02.spec.ts',
            'outstanding_work': 'None; weave-14 correctly maps to /archive/the-art-of-the-drape and is verified.',
            'last_updated': 'STAGE-02 2026-10-26',
            'notes': 'WEAVE_STORY_ROUTES maps weave-14 to /archive/the-art-of-the-drape. Verified in UT-SEARCH-01 and E2E-SEARCH-01.'
        },
        'F-11': {
            'implementation_status': 'IMPLEMENTED',
            'verification_status': 'PASS',
            'awaiting_owner_approval': 'FALSE',
            'final_disposition': 'CLOSED',
            'evidence_paths': 'src/data/assetMap.ts; src/tests/stage02-unit.test.ts',
            'outstanding_work': 'None; ET-04 alt text updated in assetMap.ts.',
            'last_updated': 'STAGE-02 2026-10-26',
            'notes': 'Alt text for ET-04 updated to "Angrakha Asymmetric Sheer Tunic — {view}". Verified in UT-DATA-01.'
        },
        'F-16': {
            'implementation_status': 'IMPLEMENTED',
            'verification_status': 'PASS',
            'awaiting_owner_approval': 'FALSE',
            'evidence_paths': 'src/types/catalog.ts; src/data/traditionalProducts.ts; src/data/products.ts; src/tests/stage02-unit.test.ts',
            'outstanding_work': 'Stage 4 TR commerce activation and Stage 5 Living Inheritance wall UI remain.',
            'last_updated': 'STAGE-02 2026-10-26',
            'notes': 'Stage 2 catalogue boundaries implemented: ProductBase, TraditionalProduct, collection="traditional", ALL_PRODUCTS separation. Verified in UT-DATA-01 and UT-DATA-02.'
        },
        'F-27': {
            'implementation_status': 'IMPLEMENTED',
            'verification_status': 'PASS',
            'awaiting_owner_approval': 'FALSE',
            'final_disposition': 'CLOSED',
            'evidence_paths': 'src/data/products.ts; src/tests/stage02-unit.test.ts; e2e/stage02.spec.ts',
            'outstanding_work': 'None; case-insensitive ID and slug lookups verified.',
            'last_updated': 'STAGE-02 2026-10-26',
            'notes': 'getProductById and getProductBySlug normalize input to lowercase. /product/ET-01 resolves to ET-01. Verified in UT-DATA-01 and E2E-ROUTE-04.'
        },
        'F-32': {
            'implementation_status': 'IMPLEMENTED',
            'verification_status': 'PASS',
            'awaiting_owner_approval': 'FALSE',
            'final_disposition': 'CLOSED',
            'evidence_paths': 'src/data/products.ts; src/data/assetMap.ts; src/pages/HousePage.tsx; src/tests/stage02-unit.test.ts; e2e/stage02.spec.ts',
            'outstanding_work': 'None; ET-02 title, fiber, and legacy slug alias verified.',
            'last_updated': 'STAGE-02 2026-10-26',
            'notes': 'ET-02 retitled to "Ivory Hand-Spun Matka Silk Cocoon Trench", fiber "100% Hand-Spun Matka Raw Silk", legacy slug preserved. Verified in UT-DATA-01 and E2E-ROUTE-04.'
        },
        'F-39': {
            'implementation_status': 'IMPLEMENTED',
            'verification_status': 'PASS',
            'awaiting_owner_approval': 'FALSE',
            'final_disposition': 'CLOSED',
            'evidence_paths': 'src/components/SearchModal.tsx; src/tests/stage02-unit.test.ts; e2e/stage02.spec.ts',
            'outstanding_work': 'None; multi-token search matching implemented and verified.',
            'last_updated': 'STAGE-02 2026-10-26',
            'notes': 'SearchModal splits query into tokens (AND logic). "Indigo Chanderi Tunic" finds ET-04. Verified in UT-SEARCH-01 and E2E-SEARCH-01.'
        },
        'F-40': {
            'implementation_status': 'IMPLEMENTED',
            'verification_status': 'PASS',
            'awaiting_owner_approval': 'FALSE',
            'final_disposition': 'CLOSED',
            'evidence_paths': 'src/data/legacyRoutes.ts; src/pages/ArchiveStoryPage.tsx; src/tests/stage02-unit.test.ts; e2e/stage02.spec.ts',
            'outstanding_work': 'None; 9 legacy archive routes redirect to canonical queries.',
            'last_updated': 'STAGE-02 2026-10-26',
            'notes': 'Legacy tradition slugs redirect to /archive?tradition={canonicalKey}. Verified in UT-ROUTE-01 and E2E-ROUTE-04.'
        },
        'F-42': {
            'implementation_status': 'IMPLEMENTED',
            'verification_status': 'PASS',
            'awaiting_owner_approval': 'FALSE',
            'evidence_paths': 'src/data/assetMap.ts; src/types/catalog.ts; src/data/traditionalProducts.ts; src/tests/stage02-unit.test.ts',
            'outstanding_work': 'Stage 9 visible credit text review deferred by decision.',
            'last_updated': 'STAGE-02 2026-10-26',
            'notes': 'ImageProvenance and creditText fields added to data models and verified in UT-DATA-02.'
        },
        'N-02': {
            'implementation_status': 'IMPLEMENTED',
            'verification_status': 'PASS',
            'awaiting_owner_approval': 'FALSE',
            'evidence_paths': 'src/data/traditionalProducts.ts; src/tests/stage02-unit.test.ts',
            'outstanding_work': 'Stage 4 commerce activation and listing once assets are approved.',
            'last_updated': 'STAGE-02 2026-10-26',
            'notes': 'TR-01..TR-07 concept specifications added with isListed: false and no fabricated fields. Verified in UT-DATA-02.'
        },
        'N-09': {
            'implementation_status': 'IMPLEMENTED',
            'verification_status': 'PASS',
            'awaiting_owner_approval': 'FALSE',
            'final_disposition': 'CLOSED',
            'evidence_paths': 'src/data/traditionalProducts.ts; src/data/assetMap.ts; src/tests/stage02-unit.test.ts',
            'outstanding_work': 'None for data layer; visible text placements occur in Stages 4 & 9.',
            'last_updated': 'STAGE-02 2026-10-26',
            'notes': 'TR_STATUS_TEXT and CONCEPT_NOTICE_TEXT constants exported and attached to TR products. Verified in UT-DATA-02.'
        },
        'N-10': {
            'implementation_status': 'IMPLEMENTED',
            'verification_status': 'PASS',
            'awaiting_owner_approval': 'FALSE',
            'evidence_paths': 'src/data/archiveRelations.ts; src/tests/stage02-unit.test.ts',
            'outstanding_work': 'Stage 7 Exhibition folio UI integration and unhiding once products are listed.',
            'last_updated': 'STAGE-02 2026-10-26',
            'notes': 'TRADITION_INSPIRED_DESIGNS maps 6 traditions (Banarasi omitted per hold). Verified in UT-ARCH-01.'
        },
        'O-7': {
            'implementation_status': 'IMPLEMENTED',
            'verification_status': 'PASS',
            'awaiting_owner_approval': 'TRUE',
            'evidence_paths': 'src/data/archiveRelations.ts; src/components/TraditionExhibitionModal.tsx; src/tests/stage02-unit.test.ts; e2e/stage02.spec.ts',
            'outstanding_work': 'Owner resolution of DEC D-25 / F-52 (Banarasi and Kota Doria candidates) remains.',
            'last_updated': 'STAGE-02 2026-10-26',
            'notes': 'O-7 rule applied: Sozni info-only, Muga none, Banarasi and Kota Doria blocked pending resolution. Verified in UT-ARCH-01 and E2E-ARCH-03.'
        },
        'O-8': {
            'implementation_status': 'IMPLEMENTED',
            'verification_status': 'PASS',
            'awaiting_owner_approval': 'TRUE',
            'evidence_paths': 'src/utils/compassMatcher.ts; src/tests/stage02-unit.test.ts; src/tests/compass.test.tsx',
            'outstanding_work': 'Owner confirmation of O-8 default (Compass scope: contemporary products only).',
            'last_updated': 'STAGE-02 2026-10-26',
            'notes': 'O-8 default applied: Compass queries only contemporary PRODUCTS. Verified in UT-COMP-01 and compass.test.tsx.'
        },
        'O-11': {
            'implementation_status': 'IMPLEMENTED',
            'verification_status': 'PASS',
            'awaiting_owner_approval': 'TRUE',
            'evidence_paths': 'src/data/traditionalProducts.ts; src/tests/stage02-unit.test.ts',
            'outstanding_work': 'Stage 4 PDP display and owner confirmation of final wording.',
            'last_updated': 'STAGE-02 2026-10-26',
            'notes': 'O-11 default applied: TR status is concept specification; no fabricated edition, hours, or origin fields. Verified in UT-DATA-02.'
        },
        # Checklist rows
        'CL-099': {
            'implementation_status': 'IMPLEMENTED',
            'verification_status': 'PASS',
            'evidence_paths': 'src/components/SearchModal.tsx; src/tests/stage02-unit.test.ts; e2e/stage02.spec.ts',
            'last_updated': 'STAGE-02 2026-10-26',
            'notes': 'Inspected search results; all results map to canonical records.'
        },
        'CL-100': {
            'implementation_status': 'IMPLEMENTED',
            'verification_status': 'PASS',
            'evidence_paths': 'src/components/SearchModal.tsx; src/data/products.ts; src/tests/stage02-unit.test.ts',
            'last_updated': 'STAGE-02 2026-10-26',
            'notes': 'Confirmed products exist in canonical catalogue before display.'
        },
        'CL-101': {
            'implementation_status': 'IMPLEMENTED',
            'verification_status': 'PASS',
            'evidence_paths': 'src/components/SearchModal.tsx; src/tests/stage02-unit.test.ts',
            'last_updated': 'STAGE-02 2026-10-26',
            'notes': 'Stale fallback /archive?tradition=slug removed; weave-14 mapped to drape story.'
        },
        'CL-102': {
            'implementation_status': 'IMPLEMENTED',
            'verification_status': 'PASS',
            'evidence_paths': 'src/components/SearchModal.tsx; src/tests/stage02-unit.test.ts; e2e/stage02.spec.ts',
            'last_updated': 'STAGE-02 2026-10-26',
            'notes': 'No silent substitution; token matching maps accurately to ET-04.'
        },
        'CL-103': {
            'implementation_status': 'IMPLEMENTED',
            'verification_status': 'PASS',
            'evidence_paths': 'src/components/SearchModal.tsx; src/tests/stage02-unit.test.ts',
            'last_updated': 'STAGE-02 2026-10-26',
            'notes': 'Search labels, images, and categories verified.'
        },
        'CL-137': {
            'implementation_status': 'IMPLEMENTED',
            'verification_status': 'PASS',
            'evidence_paths': 'src/data/products.ts; src/tests/stage02-unit.test.ts',
            'last_updated': 'STAGE-02 2026-10-26',
            'notes': 'Contemporary IDs, prices, and assets kept intact; ET-02 title updated.'
        },
        'CL-138': {
            'implementation_status': 'IMPLEMENTED',
            'verification_status': 'PASS',
            'evidence_paths': 'src/data/products.ts; src/tests/stage02-unit.test.ts',
            'last_updated': 'STAGE-02 2026-10-26',
            'notes': 'No arbitrary product substitution.'
        },
        'CL-139': {
            'implementation_status': 'IMPLEMENTED',
            'verification_status': 'PASS',
            'evidence_paths': 'src/data/products.ts; src/data/traditionalProducts.ts; src/tests/stage02-unit.test.ts',
            'last_updated': 'STAGE-02 2026-10-26',
            'notes': 'Canonical records kept separate from archive traditions and TR records.'
        },
        'CL-140': {
            'implementation_status': 'IMPLEMENTED',
            'verification_status': 'PASS',
            'evidence_paths': 'src/utils/compassMatcher.ts; src/tests/stage02-unit.test.ts',
            'last_updated': 'STAGE-02 2026-10-26',
            'notes': 'Curator Compass matcher logic and options preserved; verified in UT-COMP-01.'
        },
        'CL-152': {
            'implementation_status': 'IMPLEMENTED',
            'verification_status': 'PASS',
            'evidence_paths': 'src/types/catalog.ts; src/data/traditionalProducts.ts; src/tests/stage02-unit.test.ts',
            'outstanding_work': 'Stage 4 activation of commerce fields.',
            'last_updated': 'STAGE-02 2026-10-26',
            'notes': 'ProductBase and TraditionalProduct data models established.'
        },
        'CL-153': {
            'implementation_status': 'IMPLEMENTED',
            'verification_status': 'PASS',
            'evidence_paths': 'src/data/traditionalProducts.ts; src/tests/stage02-unit.test.ts',
            'last_updated': 'STAGE-02 2026-10-26',
            'notes': 'Stable unique IDs tr-01 through tr-07 established.'
        },
        'CL-154': {
            'implementation_status': 'IMPLEMENTED',
            'verification_status': 'PASS',
            'evidence_paths': 'src/data/traditionalProducts.ts; src/data/stories.ts; src/tests/stage02-unit.test.ts',
            'last_updated': 'STAGE-02 2026-10-26',
            'notes': 'Product records kept separate from educational tradition records.'
        },
        'CL-155': {
            'implementation_status': 'IMPLEMENTED',
            'verification_status': 'PASS',
            'evidence_paths': 'src/data/traditionalProducts.ts; src/tests/stage02-unit.test.ts',
            'last_updated': 'STAGE-02 2026-10-26',
            'notes': 'Only known concept fields included; no fabricated hours/origin/density.'
        },
        'CL-156': {
            'implementation_status': 'IMPLEMENTED',
            'verification_status': 'PASS',
            'evidence_paths': 'src/data/traditionalProducts.ts; src/tests/stage02-unit.test.ts',
            'last_updated': 'STAGE-02 2026-10-26',
            'notes': 'Tradition inspiration mapped explicitly via inspiration field.'
        },
        'CL-157': {
            'implementation_status': 'IMPLEMENTED',
            'verification_status': 'PASS',
            'evidence_paths': 'src/data/traditionalProducts.ts; src/tests/stage02-unit.test.ts',
            'last_updated': 'STAGE-02 2026-10-26',
            'notes': 'Prices and descriptions match approved concept specifications.'
        },
        'CL-158': {
            'implementation_status': 'IMPLEMENTED',
            'verification_status': 'PASS',
            'evidence_paths': 'src/data/traditionalProducts.ts; src/tests/stage02-unit.test.ts',
            'last_updated': 'STAGE-02 2026-10-26',
            'notes': 'False claims avoided; TR-06 described as geometric print, not hand block-printed.'
        },
        'CL-159': {
            'implementation_status': 'IMPLEMENTED',
            'verification_status': 'PASS',
            'evidence_paths': 'src/data/traditionalProducts.ts; src/pages/ProductDetailPage.tsx; e2e/stage02.spec.ts',
            'last_updated': 'STAGE-02 2026-10-26',
            'notes': 'TR products marked isListed: false and isPurchasable: false; PDP shows not available.'
        },
        'CL-188': {
            'implementation_status': 'IMPLEMENTED',
            'verification_status': 'PASS',
            'evidence_paths': 'src/components/TraditionExhibitionModal.tsx; src/tests/stage02-unit.test.ts; e2e/stage02.spec.ts',
            'last_updated': 'STAGE-02 2026-10-26',
            'notes': 'Archive preserved as educational exhibition; Acquire button removed.'
        },
        'CL-190': {
            'implementation_status': 'IMPLEMENTED',
            'verification_status': 'PASS',
            'evidence_paths': 'src/components/TraditionExhibitionModal.tsx; src/data/archiveRelations.ts; e2e/stage02.spec.ts',
            'last_updated': 'STAGE-02 2026-10-26',
            'notes': 'Where no product is mapped (e.g. Muga), no piece is implied.'
        },
        'CL-191': {
            'implementation_status': 'IMPLEMENTED',
            'verification_status': 'PASS',
            'evidence_paths': 'src/components/TraditionExhibitionModal.tsx; src/data/archiveRelations.ts; e2e/stage02.spec.ts',
            'last_updated': 'STAGE-02 2026-10-26',
            'notes': 'Curatorial notices clearly distinguish educational folios from commercial repertoire.'
        },
        'CL-192': {
            'implementation_status': 'IMPLEMENTED',
            'verification_status': 'PASS',
            'evidence_paths': 'src/components/TraditionExhibitionModal.tsx; src/data/archiveRelations.ts; e2e/stage02.spec.ts',
            'last_updated': 'STAGE-02 2026-10-26',
            'notes': 'Related piece link only appears for listed products and links to verified slug.'
        },
        'CL-387': {
            'implementation_status': 'IMPLEMENTED',
            'verification_status': 'PASS',
            'evidence_paths': 'src/components/SearchModal.tsx; e2e/stage02.spec.ts',
            'last_updated': 'STAGE-02 2026-10-26',
            'notes': 'Search modal opens and closes reliably from header trigger.'
        },
        'CL-388': {
            'implementation_status': 'IMPLEMENTED',
            'verification_status': 'PASS',
            'evidence_paths': 'src/components/SearchModal.tsx; e2e/stage02.spec.ts',
            'last_updated': 'STAGE-02 2026-10-26',
            'notes': 'Keyboard focus moves into search input on open.'
        },
        'CL-389': {
            'implementation_status': 'IMPLEMENTED',
            'verification_status': 'PASS',
            'evidence_paths': 'src/components/SearchModal.tsx; src/tests/stage02-unit.test.ts',
            'last_updated': 'STAGE-02 2026-10-26',
            'notes': 'Search queries across verified contemporary products, traditions, stories, and journal.'
        },
        'CL-390': {
            'implementation_status': 'IMPLEMENTED',
            'verification_status': 'PASS',
            'evidence_paths': 'src/components/SearchModal.tsx; src/tests/stage02-unit.test.ts',
            'last_updated': 'STAGE-02 2026-10-26',
            'notes': 'Results sourced directly from real data models.'
        },
        'CL-391': {
            'implementation_status': 'IMPLEMENTED',
            'verification_status': 'PASS',
            'evidence_paths': 'src/components/SearchModal.tsx; src/tests/stage02-unit.test.ts',
            'last_updated': 'STAGE-02 2026-10-26',
            'notes': 'Result categories clearly indicated with badges.'
        },
        'CL-392': {
            'implementation_status': 'IMPLEMENTED',
            'verification_status': 'PASS',
            'evidence_paths': 'src/components/SearchModal.tsx; e2e/stage02.spec.ts',
            'last_updated': 'STAGE-02 2026-10-26',
            'notes': 'Product results display verified names and prices.'
        },
        'CL-394': {
            'implementation_status': 'IMPLEMENTED',
            'verification_status': 'PASS',
            'evidence_paths': 'src/components/SearchModal.tsx; e2e/stage02.spec.ts',
            'last_updated': 'STAGE-02 2026-10-26',
            'notes': 'Selecting result navigates to correct destination URL.'
        },
        'CL-395': {
            'implementation_status': 'IMPLEMENTED',
            'verification_status': 'PASS',
            'evidence_paths': 'src/components/SearchModal.tsx; src/tests/stage02-unit.test.ts; e2e/stage02.spec.ts',
            'last_updated': 'STAGE-02 2026-10-26',
            'notes': 'Zero dead links; weave-14 maps to /archive/the-art-of-the-drape; unlisted TR products omitted.'
        },
        'CL-396': {
            'implementation_status': 'IMPLEMENTED',
            'verification_status': 'PASS',
            'evidence_paths': 'src/components/SearchModal.tsx; src/tests/search.test.tsx',
            'last_updated': 'STAGE-02 2026-10-26',
            'notes': 'Empty query shows curated suggestions.'
        },
        'CL-397': {
            'implementation_status': 'IMPLEMENTED',
            'verification_status': 'PASS',
            'evidence_paths': 'src/components/SearchModal.tsx; e2e/stage02.spec.ts',
            'last_updated': 'STAGE-02 2026-10-26',
            'notes': 'Search input, result navigation, and close behaviors verified.'
        },
        'CL-398': {
            'implementation_status': 'IMPLEMENTED',
            'verification_status': 'PASS',
            'evidence_paths': 'src/components/SearchModal.tsx; e2e/stage02.spec.ts',
            'last_updated': 'STAGE-02 2026-10-26',
            'notes': 'Search modal usable on mobile viewport without overflow.'
        },
        'CL-399': {
            'implementation_status': 'IMPLEMENTED',
            'verification_status': 'PASS',
            'evidence_paths': 'src/components/SearchModal.tsx; src/tests/stage02-unit.test.ts; e2e/stage02.spec.ts',
            'last_updated': 'STAGE-02 2026-10-26',
            'notes': 'Chanderi search result maps cleanly to ET-04 Angrakha Asymmetric Sheer Tunic.'
        }
    }

    updated_count = 0
    for r in rows:
        iid = r['item_id']
        if iid in updates:
            for k, v in updates[iid].items():
                r[k] = v
            updated_count += 1

    fieldnames = list(rows[0].keys())
    with open(tracker_path, 'w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    print(f"Successfully updated {updated_count} rows in {tracker_path}.")

if __name__ == '__main__':
    update_stage_02_tracker()
