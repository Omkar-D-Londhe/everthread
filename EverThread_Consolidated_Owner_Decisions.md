# EVERTHREAD — CONSOLIDATED OWNER DECISIONS & ANTIGRAVITY HANDOFF

**Purpose:** This is the single consolidated record of the owner rulings made in the current decision session. Use it together with the supplied `EverThread_Documentation_Updates.zip`. The latest explicit owner instructions in this record take precedence over older, conflicting audit snapshots and prompts.

**Current task boundary:** Reconcile documentation and decision records only. Keep the repository read-only for this task except for documentation-only edits explicitly requested below. Do not implement application changes, modify product data, edit assets, or perform visual redesign in this pass.

## 1. Required precedence rules

1. The owner's latest explicit decisions in this file.
2. Earlier owner decisions listed in Section 2.
3. Current authoritative project documentation and roadmap, after discovering the actual paths in the repository.
4. Historical audits, stale prompts, copied manifests, and older reports as evidence only.

Do not claim a file was inspected unless it was actually opened. Do not claim a test passed unless it was actually run and evidence exists. Preserve historical records and mark conflicting statements as superseded instead of deleting audit history.

## 2. Consolidated owner decisions

### B-4 — Canonical concept disclosure

Approved canonical wording:

> Traditional products shown are AI-generated conceptual designs demonstrating archival craft techniques.

Use this wording for the Traditional Collection concept disclosure, with the shorter approved variant in the Archive search subtitle. Do not imply the designs are verified physical inventory or proof of actual manufacture.

### B-5 — Claim dispositions

- **CLM-H05–CLM-H09, Global Ateliers:** Reframe as conceptual design studies (for example, “Paris Design Study” or “New Delhi Guild Study”). Remove operational or partnership claims, including claims about coordination centres or master handloom families.
- **CLM-H01, Inlay Covenant:** Use engineering-specification wording. Do not promise that every garment universally includes 1.5-inch inlays. Describe the tailoring specification accurately and narrowly.
- **CLM-J01–CLM-J05, Journal monographs:** Academic/curatorial essays are approved. Preserve `isEditorialPersona`, illustrative-composite notes, and the published bibliography. This approves the framing; it does not independently verify every historical claim.

### D-20 — House structure

Preserve the current six-section House structure exactly. No condensing to four sections, merges, removals, or restructuring. Preserve scene boundaries, motion, navigation, and layout. Only approved factual claim corrections may be applied later.

### D-21 — Disclosure placement

All three placements are approved:
1. Traditional product detail: canonical disclosure beneath the image stage.
2. Living Inheritance wall header: canonical disclosure.
3. Traditional Archive search subtitle: shorter disclosure.

### O-1 — Missing Phase 6.0 source documents

Proceed using requirements and choreography already documented in the project. Do not fabricate the missing Phase 6.0 source documents or claim to have found them. Label any derived choreography as derived. The missing originals do not prevent documenting the already-approved motion direction. The actual exhibition opening (F-04) remains pending the owner's manual review of its recording.

### O-2 — Collection routes

- `/collections` remains the canonical Contemporary Collection route.
- `/collections/the-living-inheritance` is the Living Inheritance route.
- Preserve legacy links and redirects.

### O-3 — Collection-wall switching

Approved: native horizontal scroll-snap with a visible edge of the next wall, clearly labelled accessible tabs, route synchronization, keyboard navigation, and natural vertical scrolling. Do not hijack vertical wheel/touch scrolling.

### O-4 — Motion direction

Approved: restrained hybrid motion with the fold-based Story Flow and the sequence **Initiate → Glide → Settle**. Preserve the no-pinning/no-vertical-snapping rule. Motion recording review is separate from this direction decision.

### O-5 — Technique Strip

Approved: scroll-driven Technique Strip containing all nine diagrams, with no autoplay. Preserve the interaction. Defer minor visual refinements until final polish. Do not invent tradition metadata for diagrams where it is absent.

### O-6-C — Existing-image fit policy for TR-01, TR-03, TR-07

The owner does **not** want new image generation and will not supply replacement imagery. Use images already available in the project. Where an existing image is a reasonable fit for the product and intended presentation, retain it. Do not block the assessment solely because an ideal replacement is unavailable. Do not generate or edit images.

If an image is an obvious mismatch with the product identity or included pieces, flag it in the documentation/asset review and use the best-fitting existing asset where one is available. Do not silently alter product specifications to fit an image. Do not mark an image as individually owner-approved unless the owner has actually reviewed and approved that image. This is an assessment-pragmatic asset policy, not a claim that every existing image has been verified as exact.

### O-7 — Archive ↔ Traditional Collection mappings

The owner confirms that the clothing-piece mappings from Archive traditions to the appropriate Traditional Collection products have already been supplied to Antigravity. **Preserve the existing owner-supplied/current-project mapping exactly; do not recreate, remap, or replace it with older hard-coded mappings from historical reports.** The owner also confirms the relevant Traditional Collection products have already been made purchasable. Older audit notes claiming those products are unlisted or non-purchasable are superseded for current status and must not be presented as current truth.

Keep Archive content educational. Where the existing approved mapping is shown, describe the relationship as “related” or “inspired by” where appropriate; do not claim that a conceptual product is literally made using a tradition or technique unless that is supported. Do not add an “Acquire” or “Add to Bag” action to an educational Archive entry itself. Preserve the user's mapping as the source of truth; if the current repository appears to contradict it, document the discrepancy without changing the mapping and request owner review only if a real conflict prevents proceeding.

### O-8 — Curator's Compass scope

Preserve existing Compass behaviour, matcher, tags, and tests. Compass reads contemporary products only. Do not broaden it to Traditional Collection products.

### O-9 / O-11 — Concept disclosure and Traditional Collection status

Use the canonical disclosure and D-21 placements above. Do not imply physical inventory, verified manufacturing, artisan identities or partnerships, production arrangements, dispatch guarantees, or other unsupported operational claims. Do not fabricate biographies or identities. Keep concept status clear.

### O-10 — Colour selection

Selected colour, displayed image, Bag line, and checkout must remain consistent. Never imply the image shows a colour that it does not. If no per-colour image exists, use an honest note such as “Images show {default colour}”. Colourways remain names-only; do not invent per-colour images.

### O-12 — Making/Promise and craft claims

Use the conservative craft-homage approach. Preserve the existing Home scene structure. Use respectful heritage/technique descriptions and only supported claims. Do not assert unsupported artisan commissions, production arrangements, facilities, or partnerships. Apply approved claim corrections consistently across Home and Archive.

### O-13 — Implementation/verification scope

Approved: implement the project scope fully, with a narrow verification gate for the risky wall interaction. The specified spike tests are E2E-WALL-02, E2E-WALL-03, and E2E-WALL-05. This is not permission to bypass stage approval or to claim verification without evidence.

### O-14 — Approval sequence

Approved: proceed serially, one stage at a time, with owner approval. Do not skip ahead or treat this documentation reconciliation as permission to implement a later stage.

### D-18 / F-46 — Edition claims for this assessment

The owner says edition claims are not a priority for the current assessment submission and is comfortable if existing edition claims remain. Record this as an **assessment-specific owner risk acceptance**, not as factual verification. Do not invent new edition numbers, scarcity counts, or additional claims. For a future commercial release, this should be revisited.

### F-04 — Exhibition opening choreography

Keep F-04 pending. The owner wants to inspect the actual recording manually first. Do not mark the exhibition opening approved, do not ask the owner to re-decide the general motion direction, and do not block unrelated documentation work on this item.

### Collection-switching moving thread/string — added motion-quality check

Inspect the existing right-moving thread/string animation during switching between the two collection walls. The owner reports that during normal scrolling the animation can be so fast or subtle that it is barely visible. Check:

1. Visibility at natural/normal scroll speed.
2. Whether the duration should be lengthened slightly so the movement is perceptible without feeling sluggish.
3. Smoothness, easing, continuity, stutter, flicker, abrupt acceleration, and synchronization with wall movement.
4. Slow, normal, and fast scrolling on desktop; touch/mobile behaviour as appropriate.
5. Reduced-motion support, route sync, keyboard access, and native vertical scrolling.

This is a requested **future implementation/verification task**, not permission to change code during this documentation-only pass. When its stage is authorized, inspect the existing `WallThread.tsx`, `WallStage.tsx`, `walls.css`, and related motion hooks first. Prefer a small timing/easing/progress-mapping adjustment over a rewrite. Capture before/after recordings at normal scroll speed. Do not add autoplay, wheel hijacking, or a competing animation system.

### D-23 — Large original PNG masters

Approved: keep large original PNG masters out of Git by default; retain them in the handover archive with SHA-256 hashes. This does not prevent committing appropriate optimized runtime assets or documentation.

## 3. Other settled decisions to preserve

- Home CTA: “Enter the Archive”.
- Loader timing remains unchanged; verify it in the final acceptance pass rather than redesigning it.
- No “Newest” sort until real dates exist.
- Quantity decrement at quantity 1 does not delete the item.
- Legacy Archive/product routes continue to resolve/redirect as specified.
- GitHub Pages and simulated checkout remain the assessment deployment assumptions.
- Journal/editorial persona and illustrative-composite safeguards remain.
- Preserve product specifications and IDs; do not repurpose ET IDs.
- Preserve the approved six-section House structure.
- Keep visual refinements until final polish.

## 4. Status categories for the final record

Use these distinct statuses:
- **APPROVED — owner decision:** the direction is settled.
- **DOCUMENTATION RECONCILIATION REQUIRED:** documents need updating to reflect the decision.
- **PENDING MANUAL REVIEW:** F-04 recording, which the owner wants to inspect.
- **PENDING VERIFICATION:** actual behaviour/tests/assets have not yet been independently checked.
- **ASSESSMENT RISK ACCEPTED:** edition claims may remain for this submission, without being represented as verified facts.
- **SUPERSEDED:** historical audit statements contradicted by a newer explicit owner instruction; retain the historical record but mark it superseded.

## 5. Instructions to Antigravity — execute in this order

### Pass A: Discover and reconcile documentation only

1. Inspect the actual current repository tree, current branch, working tree, and existing documentation before relying on paths or filenames. Do not overwrite unrelated local work.
2. Read `EverThread_Documentation_Updates.zip` and this consolidated decision record. Discover the active authoritative roadmap, traceability register, decision register, asset registry, stage files, motion specification, test plan, index, and audit coverage review (if present).
3. Update the authoritative decision register and traceability records with all decisions in Section 2. Mark old contradictory statements as superseded; preserve history.
4. Update references wherever needed so no active document still treats O-2, O-3, O-5, O-7, O-9/O-11, O-12, O-13, or O-14 as unresolved. Keep O-1 recorded as resolved for the derived-design approach while documenting that the original files were unavailable. Keep F-04 pending manual recording review.
5. Preserve the current owner-supplied Archive-to-TR clothing mapping. Do not substitute older mappings from the historical documents. Record the owner confirmation that the relevant Traditional Collection products are purchasable and mark conflicting older unlisted/non-purchasable notes as superseded.
6. Record the existing-image-only policy, no image generation/replacement request, and the assessment-specific edition-claim risk acceptance.
7. Add the collection-switching moving-thread motion-quality check to the appropriate issue/stage/test documentation, without implementing it in this pass.
8. Keep the repository's application code, product data, styles, routes, assets, tests, and database unchanged.
9. Do not commit or push changes unless separately authorized.

### Pass B: Report back

Provide:
- a list of every documentation file changed;
- a concise before/after summary for each change;
- a list of historical claims marked superseded;
- confirmation that no application code, product data, asset, test, or database file changed;
- any remaining evidence-dependent items, especially F-04 manual recording review and actual test verification;
- any genuine contradiction found in the current owner-supplied mapping, without silently resolving it.

Do not report the task as complete if the documentation changes were not actually saved. Do not claim that assets, motion, or tests were verified unless they were inspected/run and the evidence is reported.

## 6. What is explicitly not authorized in this pass

- No source-code implementation.
- No collection/product remapping.
- No product-specification changes.
- No image generation, editing, or requests for replacement imagery.
- No visual redesign or final polish.
- No automatic approval of F-04.
- No claim that edition assertions are factually verified.
- No deployment, commit, or push.

**End of consolidated owner decisions and handoff.**
