SUPERSEDED in part — see docs/SUPERSEDED.md

# EverThread — Phase 7.1 GitHub Pages Deployment Report

**Project:** EverThread — Contemporary Heritage Luxury Atelier\
**Phase:** 7.1 GitHub Pages Deployment Configuration\
**Repository:** `https://github.com/Omkar-D-Londhe/everthread`\
**Default Branch:** `main`\
**Expected Deployment URL:** `https://omkar-d-londhe.github.io/everthread/`\
**Date:** October 2026\
**Final Determination:** **READY TO PUSH**

---

## 1. Files Changed & Added

| File Path | Status | Operational Role |
|---|:---:|---|
| `vite.config.ts` | **Modified** | Configured `base: '/everthread/'` and post-render Rollup chunk asset resolver. |
| `src/main.tsx` | **Modified** | Attached `basename={import.meta.env.BASE_URL}` to `<BrowserRouter>`. |
| `src/vite-env.d.ts` | **Created** | Provided TypeScript client type declarations for `import.meta.env`. |
| `public/404.html` | **Created** | Minimal GitHub Pages SPA redirect preserving paths, queries, and hashes. |
| `index.html` | **Modified** | Added URL restoration script to restore paths before React Router mounts. |
| `public/images/site-icons/site.webmanifest` | **Modified** | Converted icon paths to relative URLs (`android-chrome-*.png`). |
| `.github/workflows/deploy.yml` | **Created** | Official GitHub Actions CI/CD workflow deploying `dist/` to GitHub Pages. |
| `README.md` | **Modified** | Added live deployment URL, workflow architecture, and routing explanations. |
| `docs/PROJECT_STRUCTURE.md` | **Modified** | Updated directory tree to document `.github/workflows/` and `404.html`. |

---

## 2. Vite Base-Path Configuration

In [`vite.config.ts`](file:///c:/Users/omkar/OneDrive/Desktop/FE%20Case%20Study/vite.config.ts), Vite is configured for the repository subpath:

```typescript
export default defineConfig({
  base: '/everthread/',
  plugins: [
    react(),
    {
      name: 'everthread-base-asset-resolver',
      enforce: 'post',
      renderChunk(code) {
        return code.replace(/(?<!\/everthread)\/images\//g, '/everthread/images/');
      }
    }
  ],
  // ...
});
```

### Key Effects:
- `import.meta.env.BASE_URL` evaluates to `'/everthread/'`.
- All bundled JavaScript chunks, stylesheets, and favicon links in `dist/index.html` automatically reference `/everthread/assets/...` and `/everthread/images/...`.
- Preserves all existing plugins, port settings, and Vitest test configuration.

---

## 3. Router Basename & SPA Deep-Link Strategy

### 3.1 React Router Basename
In [`src/main.tsx`](file:///c:/Users/omkar/OneDrive/Desktop/FE%20Case%20Study/src/main.tsx), `<BrowserRouter>` binds dynamically to `import.meta.env.BASE_URL`:
```tsx
<BrowserRouter basename={import.meta.env.BASE_URL}>
  <CartProvider>
    <SavedProvider>
      <App />
    </SavedProvider>
  </CartProvider>
</BrowserRouter>
```

### 3.2 GitHub Pages SPA Fallback Architecture
GitHub Pages defaults to static file serving without native SPA rewrites. EverThread implements a battle-tested, zero-dependency fallback mechanism:

1. **Fallback Entry (`public/404.html`):**
   When a visitor enters a deep route directly or refreshes (e.g. `https://omkar-d-londhe.github.io/everthread/archive?tradition=banarasi-brocade`), GitHub Pages serves `404.html`.
   A lightweight script encodes the sub-route and query parameters into a query string:
   `https://omkar-d-londhe.github.io/everthread/?/archive&tradition=banarasi-brocade`
2. **URL Restoration (`index.html`):**
   Before React mounts, an inline script in `<head>` intercepts the encoded query string, decodes parameters, and executes `window.history.replaceState` to seamlessly restore the true route:
   `https://omkar-d-londhe.github.io/everthread/archive?tradition=banarasi-brocade`
3. **Route Resolution:**
   React Router matches `/archive`, reads `searchParams.get('tradition')`, and immediately opens the modal exhibition without redirect loops or layout flickers.
4. **Invalid Route Handling:**
   Genuinely invalid routes (e.g. `/everthread/non-existent`) restore cleanly and trigger EverThread's branded `<NotFoundPage />` plinth.

---

## 4. Asset-Path Audit Results

An audit was performed across all 474 asset references in the application:

1. **`index.html` Metadata & Favicons:**
   Vite transforms `/images/...` in `index.html` to `/everthread/images/...`.
   Verified: `<meta property="og:image" content="/everthread/images/brand/og-everthread.webp">`.
2. **Compiled JavaScript Bundles (`dist/assets/*.js`):**
   Hardcoded strings in data catalogs (`assetCatalog.json`, `assetMap.ts`, `stories.ts`, `journal.ts`) are rewritten during the post-render chunk hook:
   - **Bare `/images/` references in production bundle:** **0**
   - **Base-prefixed `/everthread/images/` references:** **309**
3. **CSS Stylesheets (`dist/assets/*.css`):**
   Zero external root-relative image URLs exist; all styling relies on inline SVG data URLs.
4. **Web Manifest (`site.webmanifest`):**
   Updated icons to relative filenames (`android-chrome-192x192.png`), resolving cleanly on any host.

---

## 5. GitHub Actions Workflow Details

Created [`.github/workflows/deploy.yml`](file:///c:/Users/omkar/OneDrive/Desktop/FE%20Case%20Study/.github/workflows/deploy.yml) following GitHub Pages best practices:
- **Triggers:** Push to `main` branch, and manual execution via `workflow_dispatch`.
- **Least-Privilege Permissions:**
  ```yaml
  permissions:
    contents: read
    pages: write
    id-token: write
  ```
- **Concurrency Guard:** `concurrency: { group: 'pages', cancel-in-progress: false }` protects production rollouts.
- **Verification Gates:**
  1. `actions/checkout@v4`
  2. `actions/setup-node@v4` (Node.js 20 with `npm` cache)
  3. `npm ci`
  4. `npm test -- --run` (all 238 tests required to pass)
  5. `npx tsc --noEmit` (strict type check required to pass)
  6. `npm run build` (compilation with subpath base)
- **Deployment Action:** Official `actions/upload-pages-artifact@v3` and `actions/deploy-pages@v4` targeting the `github-pages` environment. Zero secrets or personal access tokens exposed.

---

## 6. Actual Test, TypeScript, and Build Results

| Verification Check | Tool / Command | Result |
|---|---|---|
| **TypeScript Validation** | `npx tsc --noEmit` | **0 errors** (Pass) |
| **Vitest Automated Tests** | `npm test -- --run` | **12 / 12 suites passed, 238 / 238 tests passing** (0 failed, 0 skipped) |
| **Vite Production Build** | `npm run build` | **Completed in 3.48s** (`dist/index.html`: 2.73 kB, `dist/404.html`: 0.81 kB, CSS: 287.80 kB, JS: 659.24 kB) |

---

## 7. Local Subpath Verification Results

A local server was run using Vite's preview engine under `http://localhost:4173/everthread/`:

1. `GET http://localhost:4173/everthread/` $\rightarrow$ **HTTP 200** (serves index HTML with base script).
2. `GET http://localhost:4173/everthread/assets/index-DJqYWANd.js` $\rightarrow$ **HTTP 200** (valid JS bundle).
3. `GET http://localhost:4173/everthread/images/brand/og-everthread.webp` $\rightarrow$ **HTTP 200** (37,002 bytes).
4. `GET http://localhost:4173/everthread/images/archive/banarasi-brocade/archive-banarasi-brocade-model-01.webp` $\rightarrow$ **HTTP 200** (258,272 bytes).
5. `GET http://localhost:4173/everthread/images/weave-library/diagrams/library-block-printing-process-01.svg` $\rightarrow$ **HTTP 200** (SVG diagram).
6. `GET http://localhost:4173/everthread/404.html` $\rightarrow$ **HTTP 200** (contains SPA redirect script).
7. `GET http://localhost:4173/everthread/archive?tradition=banarasi-brocade` $\rightarrow$ **HTTP 200** (SPA deep-link resolved).

---

## 8. Unresolved Risks & Limitations

1. **One-Time GitHub Repository Setting:**
   In the GitHub web UI, the user must ensure GitHub Pages is enabled:
   **Repository Settings $\rightarrow$ Pages $\rightarrow$ Build and deployment $\rightarrow$ Source: GitHub Actions**.
   *(If not set to GitHub Actions, the workflow cannot deploy).*
2. **Browser History State:**
   The `404.html` redirect briefly executes a client-side redirect when deep links are accessed on fresh browser tabs. This is standard behavior for static GitHub Pages SPAs.

---

## 9. Exact Git Commands for Review, Commit, and Push

The working tree changes are staged and ready. To review, commit, and push:

```bash
# 1. Review status and staged changes
git status
git diff

# 2. Stage the verified deployment files
git add .github/workflows/deploy.yml
git add public/404.html
git add public/images/site-icons/site.webmanifest
git add index.html
git add src/main.tsx
git add src/vite-env.d.ts
git add vite.config.ts
git add README.md
git add docs/PROJECT_STRUCTURE.md
git add docs/phase_7_1_github_pages_report.md

# 3. Commit with structured conventional message
git commit -m "feat(deploy): configure GitHub Pages deployment and SPA subpath routing"

# 4. Push to GitHub main branch (triggers automated deployment)
git push origin main
```

---

## 10. Final Determination

**STATUS: READY TO PUSH**

All files have been configured, verified locally under `/everthread/`, and documented. Ready for explicit user authorization to commit and push to `origin/main`.
