/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * EverThread Vite Configuration
 *
 * The app is deployed at https://omkar-d-londhe.github.io/everthread/
 * so `base` is always '/everthread/'.
 *
 * Image paths throughout the codebase (assetMap.ts, products.ts, etc.) are
 * written as root-relative strings like '/images/...'. Vite's dev server
 * serves public/ files at the root path, so these work locally as-is.
 *
 * In production builds, the two plugins below fix the two places where
 * hardcoded '/images/' paths would otherwise break on GitHub Pages:
 *
 *   1. everthread-asset-path-rewriter  — rewrites '/images/' → '/everthread/images/'
 *      inside the JavaScript bundle (renderChunk, build-only).
 *
 *   2. everthread-html-path-rewriter   — rewrites '/images/' → '/everthread/images/'
 *      inside the generated index.html for favicon / preload links
 *      (transformIndexHtml, build-only).
 *
 * In dev, a redirect middleware sends requests to bare '/' straight to
 * '/everthread/' so you don't have to type the subpath manually.
 */

const BASE = '/everthread/';

export default defineConfig({
  base: BASE,

  plugins: [
    react(),

    /* ── DEV ONLY: handle root redirect and /images/ alias in dev ── */
    {
      name: 'everthread-dev-middleware',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === '/' || req.url === '') {
            res.writeHead(302, { Location: BASE });
            res.end();
            return;
          }
          // In dev, if browser requests un-prefixed /images/..., internally route to /everthread/images/...
          if (req.url?.startsWith('/images/')) {
            req.url = `${BASE}${req.url.slice(1)}`;
          }
          next();
        });
      }
    },

    /* ── BUILD ONLY: rewrite /images/ → /everthread/images/ in JS bundle ── */
    {
      name: 'everthread-asset-path-rewriter',
      enforce: 'post',
      renderChunk(code) {
        // Replace every /images/ path with /everthread/images/.
        // Uses negative lookbehind to avoid double-prefacing.
        // Matches inside src, srcSet (e.g. ", /images/"), CSS url(), etc.
        const fixed = code.replace(/(?<!\/everthread)\/images\//g, '/everthread/images/');
        return { code: fixed, map: null };
      }
    },

    /* ── BUILD ONLY: rewrite /images/ → /everthread/images/ in index.html ── */
    {
      name: 'everthread-html-path-rewriter',
      transformIndexHtml: {
        order: 'post' as const,
        handler(html: string, ctx: { server?: unknown }) {
          // ctx.server is defined in dev mode and undefined during build.
          // Only rewrite in production builds.
          if (ctx.server) return html;
          return html
            .replace(/href="\/images\//g, `href="${BASE}images/`)
            .replace(/href='\/images\//g, `href='${BASE}images/`);
        }
      }
    }
  ],

  server: {
    port: 5173,
    open: false
  },

  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/tests/**/*.test.{ts,tsx}']
  }
});
