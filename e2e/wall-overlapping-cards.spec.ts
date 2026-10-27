import { test, expect } from '@playwright/test';
import { gotoRoute, waitForAppReady } from './helpers.ts';

test.describe('EverThread Collection Wall Overlapping-Card Visual Enhancement E2E Suite', () => {
  test.setTimeout(60000);

  /* --------------------------------------------------------------------------
     1. Desktop Layered Editorial Stacking & Automatic Reversal (1440px)
     -------------------------------------------------------------------------- */
  test('WALL-OVERLAP-01: Desktop layered composition with foreground active card, background tucked inactive card, and automatic reversal', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === 'mobile', 'Desktop/tablet layered geometry tested on desktop viewport');

    await gotoRoute(page, 'collections');
    await waitForAppReady(page);

    const contemporarySlide = page.locator('[data-testid="wall-slide-contemporary"]');
    const livingSlide = page.locator('[data-testid="wall-slide-living-inheritance"]');
    const contemporaryInner = contemporarySlide.locator('.wall-panel-inner');
    const livingInner = livingSlide.locator('.wall-panel-inner');

    // 1. Initial State: Contemporary Active
    await expect(contemporarySlide).toHaveClass(/is-active/);
    await expect(livingSlide).not.toHaveClass(/is-active/);

    // Verify z-index layering
    const contemporaryZ = await contemporarySlide.evaluate(el => window.getComputedStyle(el).zIndex);
    const livingZ = await livingSlide.evaluate(el => window.getComputedStyle(el).zIndex);
    expect(parseInt(contemporaryZ, 10)).toBeGreaterThan(parseInt(livingZ, 10));

    // Verify vertical lift: active card sits lower than background card
    const cBox1 = await contemporaryInner.boundingBox();
    const lBox1 = await livingInner.boundingBox();
    expect(cBox1).not.toBeNull();
    expect(lBox1).not.toBeNull();
    if (cBox1 && lBox1) {
      expect(cBox1.y).toBeGreaterThan(lBox1.y); // Contemporary top is lower than Living top
    }

    // Verify horizontal tuck: Living is tucked behind Contemporary's right edge
    if (cBox1 && lBox1) {
      expect(lBox1.x).toBeLessThan(cBox1.x + cBox1.width); // Overlap exists!
    }

    // 2. Click exposed sliver of Living card to switch
    await livingSlide.click({ position: { x: (lBox1?.width || 800) - 40, y: 100 } });
    await page.waitForURL(/.*\/collections\/the-living-inheritance/);
    await page.waitForTimeout(600); // Wait for transition and scroll to settle

    // 3. Reversed State: Living Active
    await expect(livingSlide).toHaveClass(/is-active/);
    await expect(contemporarySlide).not.toHaveClass(/is-active/);

    const reversedLivingZ = await livingSlide.evaluate(el => window.getComputedStyle(el).zIndex);
    const reversedContemporaryZ = await contemporarySlide.evaluate(el => window.getComputedStyle(el).zIndex);
    expect(parseInt(reversedLivingZ, 10)).toBeGreaterThan(parseInt(reversedContemporaryZ, 10));

    const cBox2 = await contemporaryInner.boundingBox();
    const lBox2 = await livingInner.boundingBox();
    expect(cBox2).not.toBeNull();
    expect(lBox2).not.toBeNull();
    if (cBox2 && lBox2) {
      expect(lBox2.y).toBeGreaterThan(cBox2.y); // Living top is lower than Contemporary top
      expect(cBox2.x + cBox2.width).toBeGreaterThan(lBox2.x); // Contemporary tucked behind Living
    }

    // 4. Click exposed sliver of Contemporary card to switch back
    await contemporarySlide.click({ position: { x: 30, y: 100 } });
    await page.waitForURL(url => url.pathname.endsWith('/collections') || url.pathname.endsWith('/collections/'));
    await page.waitForTimeout(600);

    await expect(contemporarySlide).toHaveClass(/is-active/);
  });

  /* --------------------------------------------------------------------------
     2. Keyboard Accessibility & Obscured Element Isolation
     -------------------------------------------------------------------------- */
  test('WALL-OVERLAP-02: Obscured controls inside inactive card have tabIndex -1, while active card controls and tabs remain accessible', async ({ page }) => {
    await gotoRoute(page, 'collections');
    await waitForAppReady(page);

    const activeBrowseBtn = page.locator('[data-testid="browse-contemporary-btn"]');
    const inactiveBrowseBtn = page.locator('[data-testid="browse-living-btn"]');

    // Active browse button is focusable (tabIndex 0)
    await expect(activeBrowseBtn).toHaveAttribute('tabindex', '0');
    // Inactive browse button is not in keyboard order (tabIndex -1)
    await expect(inactiveBrowseBtn).toHaveAttribute('tabindex', '-1');

    // Inactive slide has role="button" and tabIndex="0" so keyboard users can switch
    const livingSlide = page.locator('[data-testid="wall-slide-living-inheritance"]');
    await expect(livingSlide).toHaveAttribute('role', 'button');
    await expect(livingSlide).toHaveAttribute('tabindex', '0');
    await expect(livingSlide).toHaveAttribute('aria-label', 'Switch to The Living Inheritance collection');

    // Focus inactive card and press Enter
    await livingSlide.focus();
    await page.keyboard.press('Enter');
    await page.waitForURL(/.*\/collections\/the-living-inheritance/);

    // Now Living is active: its browse button becomes tabIndex 0
    await expect(inactiveBrowseBtn).toHaveAttribute('tabindex', '0');
    await expect(activeBrowseBtn).toHaveAttribute('tabindex', '-1');
  });

  /* --------------------------------------------------------------------------
     3. Signature Thread Layering and Continuity
     -------------------------------------------------------------------------- */
  test('WALL-OVERLAP-03: Wall signature thread floats along bottom plinth with z-index 3 and pointer-events none', async ({ page }) => {
    await gotoRoute(page, 'collections');
    await waitForAppReady(page);

    const threadSvg = page.locator('[data-testid="wall-thread-svg"]');
    await expect(threadSvg).toBeVisible();

    const threadContainer = page.locator('.wall-thread-container');
    const style = await threadContainer.evaluate(el => {
      const computed = window.getComputedStyle(el);
      return {
        zIndex: computed.zIndex,
        pointerEvents: computed.pointerEvents,
        position: computed.position,
      };
    });

    expect(parseInt(style.zIndex, 10)).toBe(3);
    expect(style.pointerEvents).toBe('none');
    expect(style.position).toBe('absolute');
  });

  /* --------------------------------------------------------------------------
     4. Mobile Responsiveness & Zero Page Overflow (390px)
     -------------------------------------------------------------------------- */
  test('WALL-OVERLAP-04: Mobile viewport has zero horizontal page overflow and exposed sliver remains interactive', async ({ page }) => {
    await gotoRoute(page, 'collections');
    await waitForAppReady(page);

    // Verify document does not horizontally overflow window
    const hasHorizontalOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    expect(hasHorizontalOverflow).toBe(false);

    // Verify both panels exist and active panel has .is-active
    const contemporarySlide = page.locator('[data-testid="wall-slide-contemporary"]');
    const livingSlide = page.locator('[data-testid="wall-slide-living-inheritance"]');
    await expect(contemporarySlide).toHaveClass(/is-active/);

    // On mobile, click inactive living slide
    await livingSlide.click({ position: { x: 10, y: 100 } });
    await page.waitForURL(/.*\/collections\/the-living-inheritance/);
    await expect(livingSlide).toHaveClass(/is-active/);

    // Page still has zero horizontal overflow
    const hasHorizontalOverflowAfter = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    expect(hasHorizontalOverflowAfter).toBe(false);
  });

  /* --------------------------------------------------------------------------
     5. Reduced Motion Compliance
     -------------------------------------------------------------------------- */
  test('WALL-OVERLAP-05: Under prefers-reduced-motion, card transition is disabled', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await gotoRoute(page, 'collections');
    await waitForAppReady(page);

    const contemporaryInner = page.locator('[data-testid="wall-slide-contemporary"] .wall-panel-inner');
    const transition = await contemporaryInner.evaluate(el => window.getComputedStyle(el).transitionDuration);

    // Either 0s or empty/none
    expect(transition === '0s' || transition === '0.001s' || transition === '').toBe(true);
  });
});
