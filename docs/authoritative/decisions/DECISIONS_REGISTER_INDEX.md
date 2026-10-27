# EverThread Decisions Register Index

## Canonical Decision Sources
All authoritative project decisions are formally recorded in:
[01_REQUIREMENTS_AND_DECISION_TRACEABILITY.md](file:///c:/Users/omkar/OneDrive/Desktop/FE%20Case%20Study/docs/authoritative/requirements/01_REQUIREMENTS_AND_DECISION_TRACEABILITY.md)

### 1. Owner Decisions (O-1 through O-14)
- **O-1 (Phase 6.0 Sources):** Inaccessible; derived choreography in `03_MOTION_...` applied.
- **O-2 (Collection Wall URLs):** Default applied: `/collections` and `/collections/the-living-inheritance`.
- **O-3 (Wall Switching):** Default applied: native tabs and smooth CSS scroll snap; zero scroll hijacking.
- **O-4 (Motion Direction):** Restrained hybrid editorial motion.
- **O-5 (Technical Diagrams):** Inline SVG diagrams with PNG fallbacks (9 diagrams verified).
- **O-6 / O-6-C (Option C & Existing Images Only):** Confirmed by owner (2026-10-26 & 2026-10-27). Retain best-fitting existing imagery for TR-01, TR-03, and TR-07; no new image generation authorized. Obvious mismatches documented honestly as accepted project policy without altering product specifications.
- **O-7 (Archive Links):** Confirmed by owner. Links only where historically accurate.
- **O-8 (Compass Scope):** Default applied. Repertoire only (`et-01` to `et-07`); TR excluded.
- **O-9 (AI Disclosure):** Canonical AI concept disclosure implemented across PDP, Wall, and Search in Stage 09 per B-4 & DEC D-21.
- **O-10 (Color Consistency):** Default applied. Color tags match product tone; no false photographic claims.
- **O-11 (Concept Policy):** Default applied. Zero edition/hours/origin claims for TR.
- **O-12 (Making/Promise):** Default applied. Claims audit compliance; conservative craft-homage approach implemented.
- **O-13 (Collection Walls Spike):** Confirmed by owner. Full implementation, zero proposal-only downgrade.
- **O-14 (Stage Approval Protocol):** Confirmed by owner. Serial stage-by-stage approval.

### 2. Settled Implementation & Governance Decisions (D-01 through D-25)
- Documented in `01_REQUIREMENTS_AND_DECISION_TRACEABILITY.md` §C.
- **DEC D-18 / F-46 (Edition Claims Risk Acceptance):** Resolved by Owner Risk Acceptance (2026-10-27). Contemporary ET edition claims ("Edition of 12") accepted as-is for assessment submission without asserting independent factual verification. TR products carry zero edition numbers.
- **F-04 / V3-06 (Exhibition 5-Step Opening Choreography):** Resolved by Owner Acceptance (2026-10-27). Granted explicit visual owner acceptance; automated timing (<= 1.2s) and interruptibility verified in `E2E-MOTION-05`.
- **F-24 / B-7 / V3-14 (Live Deployment Verification):** Resolved by Owner Decision (2026-10-27). Closed as accepted limitation / deferred live verification for assessment handover. Local production build (`vite build` exit 0) and static server emulation pass cleanly; live 8-route MAN-LIVE verification deferred.
- **F-17 (Newest Sort):** Resolved by Owner Deferral. Newest sort permanently deferred; negative check verified in UT-COLL-01.
- **F-42 (Visible Credit Text):** Resolved by Owner Deferral. Front-end visible credit overlay deferred; data model fields implemented and verified in UT-DATA-02.
- **F-14 (ThreadLoader Invariance):** Preserved strictly at 1900ms active / 400ms fade; verified in `E2E-LOAD-01`.
