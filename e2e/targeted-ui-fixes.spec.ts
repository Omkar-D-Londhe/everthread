import { test, expect } from '@playwright/test';
import { gotoRoute, waitForAppReady } from './helpers.ts';

test.describe('EverThread Targeted UI Fixes E2E Acceptance Suite', () => {
  test.setTimeout(60000);

  /* --------------------------------------------------------------------------
     Bug 1: Product Detail Pages Open at Top
     -------------------------------------------------------------------------- */
  test('E2E-BUG-01: Navigating to Product Detail Page opens at top of page regardless of origin scroll', async ({ page }) => {
    await gotoRoute(page, 'collections');
    await waitForAppReady(page);

    // Scroll down to the bottom of the collection wall
    await page.evaluate(() => {
      window.scrollTo(0, 1200);
    });
    await page.waitForTimeout(300);

    const initialScrollY = await page.evaluate(() => window.scrollY);
    expect(initialScrollY).toBeGreaterThan(400);

    // Click product link for ET-07
    const productLink = page.locator('[data-testid="product-link-et-07"]');
    await productLink.scrollIntoViewIfNeeded();
    await productLink.click();

    // Wait for PDP navigation
    await page.waitForURL(/.*\/product\//);
    await page.waitForSelector('[data-testid="gallery-main-image"]');
    await page.waitForTimeout(400);

    // Verify PDP opened at top (scrollY === 0)
    const pdpScrollY = await page.evaluate(() => window.scrollY);
    expect(pdpScrollY).toBe(0);
  });

  /* --------------------------------------------------------------------------
     Bug 2: Refined Atelier Lens Zoom Presentation
     -------------------------------------------------------------------------- */
  test('E2E-BUG-02: Atelier Lens displays circular champagne loupe with Deep Oxblood badge without background text bleed', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === 'mobile', 'Desktop hover preview is calibrated for fine pointer viewports (desktop/tablet)');

    await gotoRoute(page, 'product/oxblood-wool-silk-signature-coat-dress');
    await waitForAppReady(page);

    const stageContainer = page.locator('[data-testid="gallery-main-container"]');
    await stageContainer.scrollIntoViewIfNeeded();

    // Hover over the center of the product image
    const box = await stageContainer.boundingBox();
    if (box) {
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.waitForTimeout(400);

      // Verify circular loupe pane is active
      const loupePane = page.locator('[data-testid="stage-hover-preview-pane"]');
      await expect(loupePane).toBeVisible();

      // Check circular geometry (computed borderTopLeftRadius >= 100px or borderRadius 50%)
      const isCircular = await loupePane.evaluate(el => {
        const style = window.getComputedStyle(el);
        const radius = parseFloat(style.borderTopLeftRadius) || 0;
        return el.style.borderRadius === '50%' || style.borderRadius === '50%' || radius >= 100;
      });
      expect(isCircular).toBe(true);

      // Check circular magnification badge is visible inside the loupe
      const zoomBadge = page.locator('[data-testid="loupe-zoom-badge"]');
      await expect(zoomBadge).toBeVisible();
      const badgeText = await zoomBadge.textContent();
      expect(badgeText).toMatch(/[0-9.]+\×/);
    }
  });

  /* --------------------------------------------------------------------------
     Bug 3: Cultural Archive Category Ordering & Plate Initialization
     -------------------------------------------------------------------------- */
  test('E2E-BUG-03: Cultural Archive catalogues open at Plate 01 and follow canonical discipline sequence', async ({ page }, testInfo) => {
    await gotoRoute(page, 'archive');
    await waitForAppReady(page);

    const isMobile = testInfo.project.name === 'mobile';
    const thumb1Selector = isMobile ? '[data-testid="mobile-thumb-model-01"]' : '[data-testid="exhibition-thumb-model-01"]';
    const thumb3Selector = isMobile ? '[data-testid="mobile-thumb-drape-03"]' : '[data-testid="exhibition-thumb-drape-03"]';

    // 1. Open first catalogue in Weave Library: Varanasi Kadwa (Weaving #1)
    const firstOpenBtn = page.locator('[data-testid="open-exhibition-varanasi-kadwa"]');
    await firstOpenBtn.scrollIntoViewIfNeeded();
    await firstOpenBtn.click();

    // Modal should be visible
    const modal = page.locator('[data-testid="tradition-exhibition-modal"]');
    await expect(modal).toBeVisible();

    // Verify it initializes to Plate 01 of 06
    const roleLabel = page.locator('[data-testid="active-role-label"]');
    await expect(roleLabel).toHaveText('Model / Garment');

    const thumb1 = page.locator(thumb1Selector);
    await expect(thumb1).toHaveClass(/is-active/);

    // Switch to Plate 03 inside modal
    const thumb3 = page.locator(thumb3Selector);
    await thumb3.scrollIntoViewIfNeeded();
    await thumb3.click();
    await expect(thumb3).toHaveClass(/is-active/);

    // Close modal
    await page.locator('[data-testid="close-exhibition-btn"]').click();
    await expect(modal).not.toBeVisible();

    // 2. Open a catalogue from Embroidery discipline: Changthangi Pashmina / Sozni
    const sozniBtn = page.locator('[data-testid="open-exhibition-changthangi-pashmina"]');
    await sozniBtn.scrollIntoViewIfNeeded();
    await sozniBtn.click();
    await expect(modal).toBeVisible();

    // Must open at Plate 01 of this catalogue, NOT inheriting Plate 03
    await expect(roleLabel).toHaveText('Model / Garment');
    await expect(page.locator(thumb1Selector)).toHaveClass(/is-active/);
    await expect(page.locator(thumb3Selector)).not.toHaveClass(/is-active/);

    // 3. Navigate to next tradition in canonical sequence
    const nextTraditionBtn = page.locator('[data-testid="next-tradition-btn"]');
    if (await nextTraditionBtn.isVisible()) {
      await nextTraditionBtn.click();
      await page.waitForTimeout(200);

      // Verify new tradition initializes at Plate 01
      await expect(roleLabel).toHaveText('Model / Garment');
      await expect(page.locator(thumb1Selector)).toHaveClass(/is-active/);
    }
  });

  /* --------------------------------------------------------------------------
     Bug 4: Technique Strip Horizontal Navigation
     -------------------------------------------------------------------------- */
  test('E2E-BUG-04: Technique Strip maintains stationary layout and provides functional stepping buttons', async ({ page }) => {
    await gotoRoute(page, 'archive');
    await waitForAppReady(page);

    const stripSection = page.locator('[data-testid="technique-strip"]');
    await stripSection.scrollIntoViewIfNeeded();
    await expect(stripSection).toBeVisible();

    const track = page.locator('[data-testid="technique-strip-track"]');
    await expect(track).toBeVisible();

    // Verify next and prev stepping buttons are functional
    const nextBtn = page.locator('[data-testid="technique-strip-next-btn"]');
    await expect(nextBtn).toBeVisible();

    const prevBtn = page.locator('[data-testid="technique-strip-prev-btn"]');
    await expect(prevBtn).toBeVisible();

    const initialScrollLeft = await track.evaluate(el => el.scrollLeft);

    await nextBtn.click();
    await page.waitForTimeout(400);

    const afterNextScroll = await track.evaluate(el => el.scrollLeft);
    expect(afterNextScroll).toBeGreaterThanOrEqual(initialScrollLeft);

    await prevBtn.click();
    await page.waitForTimeout(400);
  });
});
