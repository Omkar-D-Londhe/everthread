# EverThread — Reassessment Summary (read this first)

Commit `ebf7b6b`, clean tree, unchanged since v2. Browser evidence = local production build, not the live site.

**What v2 got right:** Bag identity, quantity, removal, subtotal, persistence, simulated checkout; ET-01…07 names and prices; Lens uses the wrong source after gallery change; Archive Acquire adds an unrelated garment; search dead link; legacy Chanderi alt text; mobile clipping; filename-like captions; build and tests green.

**What v2 overlooked or mis-framed:**
- It never evaluated the approved **Story Flow** (Brief §7).
- It called the **loader delay** a defect, but Roadmap §2.3 protects its timing.
- It treated the **Cultural Collection** as a missing feature; it exists only in your latest checklist.
- It implied the **colour swatches** were faulty; colourways are protected approved data.
- It missed the **Home hero claims** ("Numbered 01–64" vs ET-01 "Edition of 30") and the icon-font dependency.

**Is the signature motion missing?** Yes, the panel fold/roll "Glide" scene transition is **MISSING** on Home, Archive and The House. Only ordinary fade/rise reveals exist; a fold CSS class is unused; measured 0 3D/clip/perspective effects on all three routes at 1440/1024/390 px. The "exact-frame" wording and the Phase 6.0 storyboard are not in the project, so the destination frame cannot be defined yet.

**Is a separate Cultural Collection required?** Not established. It appears only in the attached checklist; "Traditional Collection" appears nowhere. Recommended: decide the naming and whether sellable cultural products exist, keep the Archive educational meanwhile, build nothing until you supply data.

**Is the build healthy?** Yes: 251/251 tests, `tsc` clean, production build succeeds (large-chunk warning). **Live deployment is not verified**: the GitHub Pages host does not resolve from my environment; Actions run 10 succeeded on this commit.

**Top corrective tasks (none started):**
1. Lens: use the selected gallery image (no approval needed).
2. Search: send the weave-14 result to `/archive/the-art-of-the-drape` (no approval needed).
3. Archive mappings: approve or remove each; never auto-add an unrelated product.
4. Story Flow: implement only after you supply the storyboard.
5. Mobile overflow, Lens focus/mapping, legacy alt text, captions.

**Decisions I need from you:**
1. Send `phase_6_0_experience_redesign_audit.md` and `phase_6_0_cinematic_motion_storyboard.md`.
2. Cultural vs Traditional Collection: same thing? Do sellable cultural products exist, and with what data?
3. Approve or reject each Archive→product mapping (Banarasi→ET-01, Kota Doria→ET-04, Sozni→ET-07, Muga→ET-02).
4. Loader: keep the protected ~2.3 s, or approve shortening?
5. Colourways: keep names only, or supply colourway images?
6. Which Home hero claims and edition numbers are approved?
7. Approved caption copy for the plates.
8. Open the live site (or send screenshots) so I can verify deployment.
