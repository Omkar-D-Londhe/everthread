import { test, expect } from '@playwright/test';
import { gotoRoute, waitForAppReady } from './helpers.ts';

test.describe('EverThread Cultural Archive Atelier Lens E2E Suite', () => {
  test.setTimeout(60000);

  test('E2E-ARCHIVE-LENS-01: Activating Inspect with Atelier Lens opens modal with active plate and working loupe', async ({ page }, testInfo) => {
    await gotoRoute(page, 'archive');
    await waitForAppReady(page);

    // Scroll to weave library
    await page.locator('#weave-library').scrollIntoViewIfNeeded();

    // Open Varanasi Kadwa exhibition via the folio button
    const openBtn = page.locator('[data-testid="open-exhibition-varanasi-kadwa"]');
    await openBtn.scrollIntoViewIfNeeded();
    await openBtn.click();

    // Wait for exhibition modal and settle GSAP animation
    const exhibitionDialog = page.locator('[data-testid="tradition-exhibition-modal"]');
    await expect(exhibitionDialog).toBeVisible();
    await page.waitForTimeout(1000);

    // Verify stage image is visible
    const stageImg = page.locator('[data-testid="exhibition-active-image"]');
    await expect(stageImg).toBeVisible();
    const stageSrc = await stageImg.getAttribute('src');
    expect(stageSrc).toContain('archive-banarasi-brocade-model-01');

    // Click "Inspect with Atelier Lens" button
    const lensBtn = page.locator('[data-testid="inspect-tradition-lens-btn"]');
    await expect(lensBtn).toBeVisible();
    await lensBtn.click();

    // Verify Atelier Lens Dialog is open
    const lensDialog = page.locator('[data-testid="atelier-lens-dialog"]');
    await expect(lensDialog).toBeVisible();
    await page.waitForTimeout(400);

    // Verify the lens main image has the active plate's src
    const lensImg = page.locator('[data-testid="atelier-lens-image"]');
    await expect(lensImg).toBeVisible();
    const lensSrc = await lensImg.getAttribute('src');
    expect(lensSrc).toBe(stageSrc);

    // On fine pointer devices, activate loupe glass
    if (testInfo.project.name !== 'mobile') {
      const lensViewport = page.locator('[data-testid="atelier-lens-viewport"]');
      await expect(lensViewport).toBeVisible();

      await lensViewport.hover();
      await lensViewport.click();
      await page.waitForTimeout(300);

      const loupeGlass = page.locator('[data-testid="atelier-lens-glass"]');
      await expect(loupeGlass).toBeVisible();

      // Verify specular sheen, Deep Oxblood zoom badge, and center reticle exist inside glass
      const specularArc = page.locator('.atelier-lens-specular-arc');
      await expect(specularArc).toBeVisible();
      const reticle = page.locator('.atelier-lens-reticle');
      await expect(reticle).toBeVisible();
      const zoomBadge = page.locator('[data-testid="modal-loupe-zoom-badge"]');
      await expect(zoomBadge).toBeVisible();
    }

    // Close lens dialog via close button
    const closeLensBtn = page.locator('[data-testid="atelier-lens-close-btn"]');
    await closeLensBtn.click();
    await expect(lensDialog).not.toBeVisible();

    // Verify exhibition dialog remains open and active plate is still plate 01
    await expect(exhibitionDialog).toBeVisible();
    await expect(stageImg).toBeVisible();
    const preservedSrc = await stageImg.getAttribute('src');
    expect(preservedSrc).toBe(stageSrc);
  });

  test('E2E-ARCHIVE-LENS-02: Plate switching updates the Atelier Lens image and Escape closes lens without closing exhibition', async ({ page }) => {
    await gotoRoute(page, 'archive');
    await waitForAppReady(page);

    await page.locator('#weave-library').scrollIntoViewIfNeeded();

    // Open Chanderi exhibition
    const openBtn = page.locator('[data-testid="open-exhibition-chanderi-handloom"]');
    await openBtn.scrollIntoViewIfNeeded();
    await openBtn.click();

    const exhibitionDialog = page.locator('[data-testid="tradition-exhibition-modal"]');
    await expect(exhibitionDialog).toBeVisible();
    await page.waitForTimeout(1000);

    // Switch to Plate 05 (Weave Detail: macro-05) via thumb if visible or chevron navigation
    const plate05Thumb = page.locator('[data-testid="exhibition-thumb-macro-05"]');
    if (await plate05Thumb.isVisible()) {
      await plate05Thumb.click();
    } else {
      // Use next plate button 4 times from Plate 1 to Plate 5
      const nextBtn = page.locator('[data-testid="next-plate-btn"]');
      for (let i = 0; i < 4; i++) {
        await nextBtn.click();
        await page.waitForTimeout(200);
      }
    }
    await page.waitForTimeout(300);

    const stageImg = page.locator('[data-testid="exhibition-active-image"]');
    await expect(stageImg).toBeVisible();
    const stageSrc = await stageImg.getAttribute('src');
    expect(stageSrc).toContain('macro-05');

    // Open Atelier Lens
    const lensBtn = page.locator('[data-testid="inspect-tradition-lens-btn"]');
    await lensBtn.click();

    const lensDialog = page.locator('[data-testid="atelier-lens-dialog"]');
    await expect(lensDialog).toBeVisible();
    await page.waitForTimeout(400);

    // Verify lens displays plate 05
    const lensImg = page.locator('[data-testid="atelier-lens-image"]');
    await expect(lensImg).toBeVisible();
    const lensSrc = await lensImg.getAttribute('src');
    expect(lensSrc).toContain('macro-05');

    // Press Escape: should close lens dialog ONLY, not the underlying exhibition
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);

    await expect(lensDialog).not.toBeVisible();
    await expect(exhibitionDialog).toBeVisible();

    // Active plate remains Plate 05
    const currentStageSrc = await stageImg.getAttribute('src');
    expect(currentStageSrc).toContain('macro-05');
  });

  test('E2E-ARCHIVE-LENS-03: Cross-discipline support (Surface Needlework / Resist Dyeing)', async ({ page }) => {
    await gotoRoute(page, 'archive');
    await waitForAppReady(page);

    await page.locator('#weave-library').scrollIntoViewIfNeeded();

    // Open Kutch Ari Embroidery (Surface Needlework discipline)
    const openBtn = page.locator('[data-testid="open-exhibition-kutch-ari-embroidery"]');
    await openBtn.scrollIntoViewIfNeeded();
    await openBtn.click();

    const exhibitionDialog = page.locator('[data-testid="tradition-exhibition-modal"]');
    await expect(exhibitionDialog).toBeVisible();
    await page.waitForTimeout(1000);

    // Open lens on active plate
    const lensBtn = page.locator('[data-testid="inspect-tradition-lens-btn"]');
    await lensBtn.click();

    const lensDialog = page.locator('[data-testid="atelier-lens-dialog"]');
    await expect(lensDialog).toBeVisible();
    await page.waitForTimeout(400);

    const lensImg = page.locator('[data-testid="atelier-lens-image"]');
    await expect(lensImg).toBeVisible();
    const lensSrc = await lensImg.getAttribute('src');
    expect(lensSrc).toContain('chikankari');

    // Close lens
    const closeLensBtn = page.locator('[data-testid="atelier-lens-close-btn"]');
    await closeLensBtn.click();
    await expect(lensDialog).not.toBeVisible();
    await expect(exhibitionDialog).toBeVisible();
  });
});
