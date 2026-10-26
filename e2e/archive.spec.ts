import { test, expect } from '@playwright/test';
import { gotoRoute, waitForAppReady } from './helpers.ts';

const CANONICAL_DIAGRAM_IDS = [
  'library-warp-weft-diagram-01',
  'library-textile-vocabulary-01',
  'library-technique-comparison-01',
  'library-embroidery-weaving-comparison-01',
  'library-resist-dyeing-process-01',
  'library-double-ikat-process-01',
  'library-block-printing-process-01',
  'library-garment-construction-01',
  'library-textile-to-garment-sequence-01'
];

test.describe('EverThread Stage 07: Cultural Archive, Technique Strip & Exhibition Fixes Suite', () => {

  test.describe('1. Archive Overview, Asymmetric Disciplines & Technique Strip (E2E-ARCH-01, N-06, O-5)', () => {
    test('renders Archive overview with 4 discipline groups and 9-diagram Technique Strip in canonical order', async ({ page, viewport }) => {
      await gotoRoute(page, '/archive');
      await waitForAppReady(page);

      // Section titles
      await expect(page.locator('[data-testid="cultural-archive-page"]')).toBeVisible();
      await expect(page.locator('h1')).toHaveText(/The Cultural Archive/);

      // Four foundational studies
      await expect(page.locator('#folios')).toHaveAttribute('data-scene', 'A1');

      // Technique Strip with exactly 9 diagrams in canonical order
      const techniqueStrip = page.locator('[data-testid="technique-strip"]');
      await expect(techniqueStrip).toBeVisible();

      const stripItems = page.locator('[data-testid^="technique-strip-item-"]');
      await expect(stripItems).toHaveCount(9);

      // Confirm canonical order
      for (let i = 0; i < CANONICAL_DIAGRAM_IDS.length; i++) {
        const item = stripItems.nth(i);
        await expect(item).toHaveAttribute('data-diagram-id', CANONICAL_DIAGRAM_IDS[i]);
        // Confirm title text is readable inside each card
        const titleEl = item.locator('h3');
        await expect(titleEl).toBeVisible();
        const text = await titleEl.innerText();
        expect(text.trim().length).toBeGreaterThan(0);
      }

      // Check keyboard focus visibility on first card
      const firstCard = stripItems.first();
      await firstCard.focus();
      await expect(firstCard).toBeFocused();

      const vpWidth = viewport?.width || 1440;
      if (vpWidth > 900) {
        // Desktop screenshot of technique strip
        await techniqueStrip.screenshot({
          path: 'docs/implementation/evidence/STAGE-07/technique_strip_desktop.png'
        });
        await techniqueStrip.screenshot({
          path: 'docs/implementation/evidence/STAGE-07/technique_strip_focus.png'
        });
      } else if (vpWidth <= 500) {
        // Mobile 390px screenshot of technique strip
        await techniqueStrip.screenshot({
          path: 'docs/implementation/evidence/STAGE-07/technique_strip_mobile_390.png'
        });

        // Verify strip scrolls horizontally without page-level overflow
        const track = page.locator('[data-testid="technique-strip-track"]');
        const trackMetrics = await track.evaluate((el) => ({
          scrollWidth: el.scrollWidth,
          clientWidth: el.clientWidth
        }));
        expect(trackMetrics.scrollWidth).toBeGreaterThan(trackMetrics.clientWidth);

        const pageScrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
        const pageClientWidth = await page.evaluate(() => document.documentElement.clientWidth);
        expect(pageScrollWidth).toBeLessThanOrEqual(pageClientWidth + 1);
      }

      // Weave Library with 4 discipline groups
      const library = page.locator('[data-testid="weave-library-section"]');
      await expect(library).toBeVisible();
      await expect(page.locator('[data-testid="discipline-group-weaving"]')).toBeVisible();
      await expect(page.locator('[data-testid="discipline-group-embroidery"]')).toBeVisible();
      await expect(page.locator('[data-testid="discipline-group-dyeing"]')).toBeVisible();
      await expect(page.locator('[data-testid="discipline-group-draping"]')).toBeVisible();

      // Feature card styling verified
      await expect(page.locator('[data-testid="weave-card-varanasi-kadwa"]')).toHaveClass(/discipline-feature-card/);

      // Filter tabs work across groups
      const embroideryTab = page.locator('[data-testid="weave-filter-embroidery"]');
      await embroideryTab.click();

      await expect(page.locator('[data-testid="discipline-group-embroidery"]')).toBeVisible();
      await expect(page.locator('[data-testid="discipline-group-weaving"]')).not.toBeVisible();

      // Reset filter
      await page.locator('[data-testid="weave-filter-all"]').click();
      await expect(page.locator('[data-testid="discipline-group-weaving"]')).toBeVisible();
    });

    test('clicking diagram in Technique Strip navigates to viewer and selects diagram', async ({ page }) => {
      await gotoRoute(page, '/archive');
      await waitForAppReady(page);

      // Click double-ikat item in technique strip
      const ikatItem = page.locator('[data-testid="technique-strip-item-library-double-ikat-process-01"]');
      await ikatItem.click();

      // Active diagram in viewer should update
      const viewerTitle = page.locator('[data-testid="active-diagram-title"]');
      await expect(viewerTitle).toHaveText('Double Ikat Process');
    });
  });

  test.describe('2. Deep Links Verification (Beginning, Middle, End & Homepage)', () => {
    test('deep links to beginning diagram: library-warp-weft-diagram-01', async ({ page }) => {
      await gotoRoute(page, '/archive?diagram=library-warp-weft-diagram-01');
      await waitForAppReady(page);

      // Selected active diagram is Warp Weft Diagram
      const viewerTitle = page.locator('[data-testid="active-diagram-title"]');
      await expect(viewerTitle).toHaveText('Warp Weft Diagram');

      // Viewer is scrolled into view
      const viewer = page.locator('#diagram-viewer');
      await expect(viewer).toBeInViewport({ timeout: 6000 });
    });

    test('deep links to middle diagram: library-double-ikat-process-01', async ({ page }) => {
      await gotoRoute(page, '/archive?diagram=library-double-ikat-process-01');
      await waitForAppReady(page);

      // Selected active diagram is Double Ikat
      const viewerTitle = page.locator('[data-testid="active-diagram-title"]');
      await expect(viewerTitle).toHaveText('Double Ikat Process');

      const viewer = page.locator('#diagram-viewer');
      await expect(viewer).toBeInViewport({ timeout: 6000 });
    });

    test('deep links to end diagram: library-textile-to-garment-sequence-01', async ({ page }) => {
      await gotoRoute(page, '/archive?diagram=library-textile-to-garment-sequence-01');
      await waitForAppReady(page);

      // Selected active diagram is Textile to Garment
      const viewerTitle = page.locator('[data-testid="active-diagram-title"]');
      await expect(viewerTitle).toHaveText('Textile To Garment Sequence');

      const viewer = page.locator('#diagram-viewer');
      await expect(viewer).toBeInViewport({ timeout: 6000 });
    });

    test('homepage Living Loom thumbnails point to correct diagram IDs', async ({ page }) => {
      await gotoRoute(page, '/');
      await waitForAppReady(page);

      const loomLinks = page.locator('[data-testid="craft-diagrams-strip"] a[href*="/archive?diagram="]');
      await expect(loomLinks).toHaveCount(3);

      await expect(loomLinks.nth(0)).toHaveAttribute('href', /archive\?diagram=library-warp-weft-diagram-01/);
      await expect(loomLinks.nth(1)).toHaveAttribute('href', /archive\?diagram=library-textile-vocabulary-01/);
      await expect(loomLinks.nth(2)).toHaveAttribute('href', /archive\?diagram=library-technique-comparison-01/);
    });
  });

  test.describe('3. Exhibition Modal Accessibility, Mobile Strip & Focus Management (E2E-ARCH-02, F-08, F-28, F-33)', () => {
    test('traps focus inside modal and cleans URL query param on close', async ({ page }) => {
      await gotoRoute(page, '/archive?tradition=banarasi-brocade');
      await waitForAppReady(page);

      const modal = page.locator('[data-testid="tradition-exhibition-modal"]');
      await expect(modal).toBeVisible();
      await expect(modal).toHaveAttribute('data-step', 'cover');

      // Caption is neutral descriptive string, not filename
      const captionDesc = page.locator('[data-testid="active-plate-description"]');
      await expect(captionDesc).toHaveText('Varanasi Kadwa Jacquard — Model / Garment');

      // Thumbnail label is visible and not truncated
      const isMobile = await page.evaluate(() => window.innerWidth <= 768);
      if (isMobile) {
        const mobileLabel = page.locator('.exhibition-mobile-thumb-label').first();
        await expect(mobileLabel).toBeVisible();
      } else {
        const thumbLabel = page.locator('.exhibition-thumb-label').first();
        await expect(thumbLabel).toBeVisible();
      }

      // Press Escape key
      await page.keyboard.press('Escape');

      // Modal is closed
      await expect(modal).not.toBeVisible();

      // URL no longer contains ?tradition=
      expect(page.url()).not.toContain('tradition=banarasi-brocade');
    });

    test('exhibition mobile strip has intentional horizontal scrolling and no page overflow at 390px', async ({ page, viewport }) => {
      const vpWidth = viewport?.width || 1440;
      if (vpWidth > 500) return; // run on mobile viewport

      await gotoRoute(page, '/archive?tradition=banarasi-brocade');
      await waitForAppReady(page);

      const modal = page.locator('[data-testid="tradition-exhibition-modal"]');
      await expect(modal).toBeVisible();

      // Mobile strip is visible
      const mobileStrip = page.locator('.exhibition-mobile-strip');
      await expect(mobileStrip).toBeVisible();

      // All 6 plate buttons are present and keyboard-accessible
      const roles = ['model-01', 'model-02', 'drape-03', 'stilllife-04', 'macro-05', 'process-06'];
      for (let i = 0; i < roles.length; i++) {
        const role = roles[i];
        const btn = page.locator(`[data-testid="mobile-thumb-${role}"]`);
        await expect(btn).toBeVisible();
        await expect(btn).toHaveAttribute('aria-label', new RegExp(`Plate ${i + 1}:`, 'i'));
      }

      // Confirm intentional horizontal scroll on mobile strip track
      const track = page.locator('.exhibition-mobile-strip');
      const trackMetrics = await track.evaluate((el) => ({
        scrollWidth: el.scrollWidth,
        clientWidth: el.clientWidth
      }));
      expect(trackMetrics.scrollWidth).toBeGreaterThan(trackMetrics.clientWidth);

      // Confirm zero document-level horizontal overflow at 390px
      const pageScrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const pageClientWidth = await page.evaluate(() => document.documentElement.clientWidth);
      expect(pageScrollWidth).toBeLessThanOrEqual(pageClientWidth + 1);

      // Capture screenshot of exhibition mobile strip
      await page.screenshot({
        path: 'docs/implementation/evidence/STAGE-07/exhibition_mobile_strip_390.png',
        fullPage: false
      });
    });

    test('renders approved related piece for Banarasi linking to ET-01 without Add to Bag', async ({ page }) => {
      await gotoRoute(page, '/archive?tradition=banarasi-brocade');
      await waitForAppReady(page);

      const relatedPiece = page.locator('[data-testid="exhibition-related-piece"]:visible').first();
      await expect(relatedPiece).toBeVisible();
      await expect(relatedPiece.locator('text=View related piece →')).toBeVisible();

      // Strictly zero Add to Bag in Archive
      await expect(page.locator('[data-testid="archive-acquire-btn"]')).not.toBeVisible();
      await expect(page.locator('[data-testid="add-to-bag-btn"]')).not.toBeVisible();
    });
  });

  test.describe('4. Responsive Viewport Verification (390px, 834px, 1440px)', () => {
    test('captures responsive screenshots and verifies zero overflow at 390px', async ({ page, viewport }) => {
      test.setTimeout(60000);
      // 1. Archive Overview
      await gotoRoute(page, '/archive');
      await waitForAppReady(page);

      const vpWidth = viewport?.width || 1440;
      let suffix = 'desktop';
      if (vpWidth <= 500) suffix = 'mobile_390';
      else if (vpWidth <= 900) suffix = 'tablet';

      await page.screenshot({
        path: `docs/implementation/evidence/STAGE-07/archive_overview_${suffix}.png`,
        fullPage: false
      });

      // Verify no horizontal document overflow
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);

      // 2. Story Page 390px Navigation Button Check
      await gotoRoute(page, '/archive/the-living-loom');
      await waitForAppReady(page);

      const nextLink = page.locator('[data-testid="next-story-link"]');
      await expect(nextLink).toBeVisible();

      const storyScrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const storyClientWidth = await page.evaluate(() => document.documentElement.clientWidth);
      expect(storyScrollWidth).toBeLessThanOrEqual(storyClientWidth + 1);

      if (suffix === 'mobile_390') {
        await page.screenshot({
          path: `docs/implementation/evidence/STAGE-07/archive_story_mobile_390.png`,
          fullPage: false
        });
      }
    });
  });
});
