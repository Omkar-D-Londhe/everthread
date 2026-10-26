# EverThread — Motion Verification Record v3

Commit `ebf7b6b` (clean tree). Evidence: **[source]** code read · **[browser]** headless Chromium on a local production build · **[screenshot]** one static frame viewed · **[prior]** reused from v2 (source unchanged).
**Limit:** I cannot watch motion. Browser evidence below is measurement of DOM/computed styles during scripted scrolling plus single frames. Smoothness, timing feel and visual alignment of any transition remain **NOT VERIFIED** by a human eye.
**Unavailable documents:** `phase_6_0_experience_redesign_audit.md` and `phase_6_0_cinematic_motion_storyboard.md` are not in the ZIP, its git history (all branches) or your uploads. The words "exact-frame" appear in none of the 24 available Markdown files. The approved definition I could find is below.

## 1. What the approved documents actually say

| Source | Text (paraphrased closely) |
|---|---|
| Implementation Brief §7 "Story Flow" | Three phases **Initiate → Glide → Settle**. Initiate: deliberate scroll/click. Glide: *architectural panels fold/roll to reveal a scene*. Settle: motion resolves into a readable position and returns control. **Strongest on Home, Archive, and The House.** Commerce pages stay conventional. Must be interruptible, keyboard-accessible, reduced-motion-friendly, mobile-appropriate, never trap scrolling or block links/history. |
| Exhibition Spec §1; Roadmap §2.2 | The motion arc is Initiate → Glide → Settle; the signature thread is a separate SVG/motion layer that guides attention during transitions without becoming a permanent web. |
| Roadmap §2.3 #5, #8 | ThreadLoader artwork **and timing** protected; reduced motion, keyboard, no scroll trapping are invariants. |
| Checklist §7 | Restates the signature; adds SNITCH-style continuity as inspiration only. Does not define fold/roll. |
| Exhibition Spec "Opening" | Five-step opening: cover anchors → surface settles → main image reveals → five views fan/stack/settle → champagne thread briefly connects. Interruptible. |

## 2. Verdict on the signature transition

| Question | Answer |
|---|---|
| Required by approved spec? | **Yes** (Brief §7; Spec §1; Roadmap §2.2). The "exact-frame" detail and storyboard are **not established** (documents unavailable). |
| Did the v2 audit identify it as missing? | **No.** v2 never cited Brief §7; it marked motion rows NOT VERIFIED and said perceptibility was untested. That was an oversight, not a finding. |
| Implemented in source? | **No for the fold/roll scene transition.** The three words are used as code comments on ordinary reveals (`useEditorialScroll.ts` L64–68, L172: opacity 0→1 and 16–24 px rise, power2.out, `once: true`). No panels, pinning, destination frame, snap, clip-path or 3D transform. A fold style exists (`.fabric-fold-container`, `.fabric-panel`, `.folded-up` rotateX 15°, `animations.css` L40–54) but **no component uses it** (dead since baseline `2c8a3cd`). |
| Present at runtime? | **No.** Maximum count per frame of elements with matrix3d, rotateX, clip-path or perspective while scrolling the full page: **0** on `/`, `/archive`, `/the-house` at 1440, 1024 and 390 px [browser]. |
| Routes where required | Home, Archive, The House (strongest); all three have only ordinary reveals. |
| Classification | **MISSING** (the three-phase panel fold/roll scene transition). The generic Initiate/Settle principle exists as **PARTIAL** ordinary reveals. |
| Needs approval? | Design intent does: the storyboard is unavailable, so I cannot define the destination frame or panel behaviour. The requirement itself is approved. |

## 3. Component-by-component record

| Route / component | Approved behavior | Current implementation evidence | Runtime / visual evidence | Verdict | Required action |
|---|---|---|---|---|---|
| **Signature Story Flow** (Home, Archive, House) | Panels fold/roll to reveal a scene; settle in readable frame; return control | Not implemented; `.fabric-panel` CSS unused [source] | 0 3D/clip/perspective on 9 route×width runs [browser] | **MISSING** | P1: approve storyboard, then implement minimally with existing GSAP |
| Destination frame / settle alignment | Defined resolved composition | No snap/pin/scrollTo [source] | Not measurable (nothing to settle) | **MISSING** | Part of the above |
| Ordinary section reveals (12 pages) | Fade/rise, settle, no overshoot | `useEditorialScroll.ts`: 24 px rise 0.65 s, `once` [source] | Hidden-at-load nodes become visible after scroll on PDP/Archive/House/Journal; 0 invisible after full scroll on 13 routes [prior] | **PASS (mechanics)** / NOT VERIFIED (feel) | Retain; not a substitute for Story Flow |
| Home hero choreography | Cinematic hero, then hand-off to next scene | ~2.4 s timeline then `clearProps` [source] (HomePage.tsx L212–230) | Static hero frame viewed: composed, thread visible [screenshot]; motion not watched | **PARTIAL / NOT VERIFIED** | Human review |
| Thread continuity | Spine across pages; restrained on commerce | Home: scrub hand-off moves thread 80/110 px and fades; highlights thread draws on scroll (L336–395) [source]. No thread layer on other routes found | Not watched | **PARTIAL** | Decide whether Archive/House should carry the thread (part of Story Flow) |
| Home → next-section transition | Scene transition after hero | Plain scroll + stagger cards (scrub 0.8, 24 px) [source] | — | **PARTIAL** (ordinary) | Covered by Story Flow decision |
| Product/Archive image parallax | Subtle photographic scale settle | Scale-settle selector in hook [source] | Not watched | **NOT VERIFIED** | Human review |
| Collections cards | Entrance and hover | Reveals via hook; hover CSS [source] | 7/7 cards visible after sort [prior] | **PARTIAL** | None required |
| Thread Compass steps | Step transitions, progress indicator | `compassSlideForward/Backward` keyframes [source] | Step buttons render [prior]; transitions not watched | **NOT VERIFIED** | Human review |
| Product gallery | 280 ms cross-dissolve, no blank flash | `galleryCrossDissolve` keyframe [source] | Main image tracked all 6 thumbs [prior] | **PARTIAL** | Human review for flash |
| Archive overview / Weave Library | Quiet reveal, drawers | `diagramDrawerSlide` [source] | 0 hidden after scroll [prior] | **PARTIAL** | None |
| Exhibition modal opening | 5-step choreographed opening, interruptible | Only `exhibitionFadeIn` / `plinthEntrance` keyframes found [source] | Opens/closes immediately [prior] | **SOURCE RISK** | Compare with spec; likely PARTIAL |
| Loader "The Thread Between Fingers" | Approved artwork; protected timing | `minDisplayTimeMs` 1900 + 400 ms fade; App timer 750 ms [source] | 2.3–2.6 s measured; 1.04 s reduced motion [prior]; artwork viewed [prior] | **PASS to spec / NEEDS APPROVAL** | Conflict: Roadmap protects timing vs checklist §2.7 and instructions "no forced loader delay" |
| Page-entry transitions | Quiet entry | Hook "page entrance" [source] | — | **NOT VERIFIED** | Human review |
| Reduced motion | Content visible, motion minimal | Hook/Home short-circuit [source] | 13 routes: all visible; loader shortened [prior] | **PASS** | None |
| Mobile (390 px) | Appropriate | Same code; no mobile-specific scene [source] | No 3D/clip effects [browser]; overflow clipping separate (D-08) | **PARTIAL** | None for motion |
| Cleanup / route change | Timelines killed on unmount | `ctx.revert()` in hook and Home [source] | Not tested with history navigation | **SOURCE VERIFIED** | Back/forward test |
| Scroll trapping / native scroll | Never trapped | No pin/snap/Lenis; modal restores body scroll [source; prior] | Page scrolled normally in all runs [browser] | **PASS** | None |

## 4. Retain / refine / add / refer

- **Retain:** ordinary reveals (commerce and secondary pages), reduced-motion handling, cleanup pattern, Home hero timeline, restrained thread parallax.
- **Refine:** Archive and House thread continuity; exhibition opening toward the specified five steps.
- **Add (needs approval of storyboard):** the Story Flow panel fold/roll scene transition on Home, Archive, The House only.
- **Refer for approval:** loader timing conflict; whether the thread appears on non-Home routes.
- **Do not remove** scroll effects wholesale; do not substitute more fades for the signature.

## 5. Smallest runtime test still needed
Record Home, Archive and The House at 1440 and 390 px while scrolling at normal speed (screen recording), plus reduced-motion; review against the Phase 6.0 storyboard once supplied.
