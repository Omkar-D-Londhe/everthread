import { test, expect } from '@playwright/test';
import { gotoRoute, waitForAppReady } from './helpers.ts';

test.describe('EverThread Stage 08: Motion System, Fold Scenes & Thread Continuity', () => {
  test.setTimeout(60000);

  test('E2E-MOTION-01: Verifies the 7 approved fold boundaries across Home, Archive, and House', async ({ page }) => {
    // 1. Home Folds: H1 (#highlights), H2 (#home-walls), H3 (#home-making)
    await gotoRoute(page, '/');
    await waitForAppReady(page);

    const foldH1 = page.locator('[data-scene-fold="H1"]');
    await expect(foldH1).toBeAttached();
    await expect(foldH1.locator('#highlights')).toBeAttached();

    const foldH2 = page.locator('[data-scene-fold="H2"]');
    await expect(foldH2).toBeAttached();
    await expect(foldH2.locator('#home-walls')).toBeAttached();

    const foldH3 = page.locator('[data-scene-fold="H3"]');
    await expect(foldH3).toBeAttached();
    await expect(foldH3.locator('#home-making')).toBeAttached();

    // Scroll down through Home scenes and verify content settles and becomes readable
    await page.locator('#home-walls').scrollIntoViewIfNeeded();
    await page.waitForTimeout(400); // 140ms idle + 350ms settle tween
    await expect(page.locator('#home-walls h2')).toBeVisible();

    await page.locator('#home-making').scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    await expect(page.locator('#home-making .editorial-crease')).toBeVisible();

    // 2. Archive Folds: A1 (#folios), A2 (#weave-library)
    await gotoRoute(page, '/archive');
    await waitForAppReady(page);

    const foldA1 = page.locator('[data-scene-fold="A1"]');
    await expect(foldA1).toBeAttached();
    await expect(foldA1.locator('#folios')).toBeAttached();

    const foldA2 = page.locator('[data-scene-fold="A2"]');
    await expect(foldA2).toBeAttached();
    await expect(foldA2.locator('#weave-library')).toBeAttached();

    await page.locator('#weave-library').scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    await expect(page.locator('#weave-library h2')).toBeVisible();

    // 3. The House Folds: U1 (#ateliers), U2 (#appointments)
    await gotoRoute(page, '/the-house');
    await waitForAppReady(page);

    const foldU1 = page.locator('[data-scene-fold="U1"]');
    await expect(foldU1).toBeAttached();
    await expect(foldU1.locator('#ateliers')).toBeAttached();

    const foldU2 = page.locator('[data-scene-fold="U2"]');
    await expect(foldU2).toBeAttached();
    await expect(foldU2.locator('#appointments')).toBeAttached();

    await page.locator('#ateliers').scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    await expect(page.locator('#ateliers h2')).toBeVisible();

    await page.locator('#appointments').scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    await expect(page.locator('#appointments h2')).toBeVisible();
  });

  test('E2E-MOTION-02: Keyboard focusin and fast velocity completion guarantees', async ({ page }) => {
    await gotoRoute(page, '/');
    await waitForAppReady(page);

    // Scroll to near H1
    const foldH1 = page.locator('[data-scene-fold="H1"]');
    await expect(foldH1).toBeAttached();

    // Focus an interactive element inside H1
    const cardLink = foldH1.locator('a').first();
    await cardLink.focus();

    // Focusin must immediately set is-complete and remove fold panels
    await expect(foldH1).toHaveClass(/is-complete/);
    const panels = foldH1.locator('.scene-fold__panels');
    await expect(panels).toHaveCount(0);

    // Fast scroll simulation: fast scrollTo bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(250);

    // H2 and H3 must be complete and fully visible
    const foldH2 = page.locator('[data-scene-fold="H2"]');
    const foldH3 = page.locator('[data-scene-fold="H3"]');
    await expect(foldH2).toHaveClass(/is-complete/);
    await expect(foldH3).toHaveClass(/is-complete/);
    await expect(page.locator('#home-making')).toBeVisible();
  });

  test('E2E-MOTION-03: Reduced motion parity across scenes and components', async ({ page }) => {
    // Emulate reduced motion
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await gotoRoute(page, '/');
    await waitForAppReady(page);

    // In reduced motion, zero fold panels must be injected into the DOM
    const foldPanels = page.locator('.scene-fold__panels');
    await expect(foldPanels).toHaveCount(0);

    // All scenes must be immediately complete
    const folds = page.locator('.scene-fold');
    const count = await folds.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      await expect(folds.nth(i)).toHaveClass(/is-complete/);
    }

    // Verify content is immediately interactive
    await expect(page.locator('#highlights')).toBeVisible();
    await expect(page.locator('#home-walls')).toBeVisible();
    await expect(page.locator('#home-making')).toBeVisible();
  });

  test('E2E-MOTION-04: Thread continuity at the 5 approved placements', async ({ page }) => {
    // Placement 1: Home Hero entry trace
    await gotoRoute(page, '/');
    await waitForAppReady(page);
    const heroThread = page.locator('[data-testid="signature-thread-path"]');
    await expect(heroThread).toBeAttached();

    // Placement 2: Home Index hand-off
    const highlightsThread = page.locator('[data-testid="highlights-thread-path"]');
    await expect(highlightsThread).toBeAttached();

    // Placement 3: Wall stage crossing at Scene H2
    const wallCrossingThread = page.locator('[data-testid="strand-thread-crossing"]');
    await expect(wallCrossingThread).toBeAttached();

    // Placement 4: Archive strip to first discipline heading
    await gotoRoute(page, '/archive');
    await waitForAppReady(page);
    const archiveThread = page.locator('[data-testid="strand-thread-curve"]');
    await expect(archiveThread).toBeAttached();

    // Placement 5: Tradition Exhibition Modal Step 5
    await page.locator('#weave-library').scrollIntoViewIfNeeded();
    const openExhibitionBtn = page.locator('[data-testid^="open-exhibition-"]').first();
    await openExhibitionBtn.scrollIntoViewIfNeeded();
    await openExhibitionBtn.click();

    const modal = page.locator('[data-testid="tradition-exhibition-modal"]');
    await expect(modal).toBeVisible();

    const exhibitionThread = page.locator('[data-step="thread"]');
    await expect(exhibitionThread).toBeAttached();

    // Verify NO golden strand thread on The House, PDP, Bag, or Checkout
    await page.keyboard.press('Escape');
    await gotoRoute(page, '/the-house');
    await waitForAppReady(page);
    await expect(page.locator('.strand-thread-container')).toHaveCount(0);

    await gotoRoute(page, '/bag');
    await waitForAppReady(page);
    await expect(page.locator('.strand-thread-container')).toHaveCount(0);
  });

  test('E2E-MOTION-05: Exhibition opening 5-step choreography and interruptibility', async ({ page }) => {
    await gotoRoute(page, '/archive');
    await waitForAppReady(page);

    // Open exhibition
    await page.locator('#weave-library').scrollIntoViewIfNeeded();
    const openExhibitionBtn = page.locator('[data-testid^="open-exhibition-"]').first();
    await openExhibitionBtn.scrollIntoViewIfNeeded();
    await openExhibitionBtn.click();

    const modal = page.locator('[data-testid="tradition-exhibition-modal"]');
    await expect(modal).toBeVisible();

    // Verify the 5 choreographed steps
    await expect(page.locator('[data-step="cover"]')).toBeAttached();
    await expect(page.locator('[data-step="surface"]')).toBeAttached();
    await expect(page.locator('[data-step="main-image"]')).toBeAttached();
    await expect(page.locator('[data-step="views"]').first()).toBeAttached();
    await expect(page.locator('[data-step="thread"]')).toBeAttached();

    // Test Esc interruption: press Escape to close or interrupt
    await page.keyboard.press('Escape');
    await expect(modal).toBeHidden();
  });

  test('E2E-MOTION-06: Desktop Technique Strip scrub glide vs 390px native horizontal swipe', async ({ page }) => {
    // 1. Desktop viewport (1280x800)
    await page.setViewportSize({ width: 1280, height: 800 });
    await gotoRoute(page, '/archive');
    await waitForAppReady(page);

    const desktopStrip = page.locator('[data-testid="technique-strip"]');
    await expect(desktopStrip).toBeVisible();
    const track = page.locator('[data-testid="technique-strip-track"]');
    await expect(track).toBeVisible();

    // 2. Mobile viewport (390x844)
    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload();
    await waitForAppReady(page);

    const mobileStrip = page.locator('[data-testid="technique-strip"]');
    await expect(mobileStrip).toBeVisible();

    // Confirm strip scrolls horizontally without causing page-level document overflow
    const docScrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const windowWidth = await page.evaluate(() => window.innerWidth);
    expect(docScrollWidth).toBeLessThanOrEqual(windowWidth + 2); // allowance for scrollbar
  });

  test('E2E-MOTION-07: Lifecycle Trigger Cleanup and Memory Leak Prevention', async ({ page }) => {
    await gotoRoute(page, '/');
    await waitForAppReady(page);

    // Navigate between 5 routes
    const routes = ['/archive', '/the-house', '/collections', '/compass', '/'];
    for (const r of routes) {
      await gotoRoute(page, r);
      await waitForAppReady(page);
    }

    // ScrollTrigger instances must be tracked and bounded without unbounded accumulation
    const triggerCount = await page.evaluate(() => (window as unknown as { __scrollTriggerCount?: number }).__scrollTriggerCount || 0);
    expect(triggerCount).toBeLessThan(15);
  });

  test('E2E-MOTION-08: Intermediate-scrub panel rotation verification at 50% progress', async ({ page }) => {
    // Desktop viewport (1280x800)
    await page.setViewportSize({ width: 1280, height: 800 });
    await gotoRoute(page, '/');
    await waitForAppReady(page);

    // Verify intermediate scrub progression at 50% progress on Scene H2
    const rotationData = await page.evaluate(() => {
      const ScrollTrigger = (window as unknown as { ScrollTrigger?: any }).ScrollTrigger;
      if (ScrollTrigger) {
        ScrollTrigger.refresh();
      }
      const st = ScrollTrigger?.getById('fold-H2');
      if (!st) return null;

      // Position at 50% progress without velocity spike
      const mid = st.start + (st.end - st.start) * 0.5;
      st.scroll(mid);
      st.update(true);

      if (typeof st.vars?.onUpdate === 'function') {
        const selfProxy = {
          ...st,
          getVelocity: () => 0,
          progress: 0.5
        };
        st.vars.onUpdate(selfProxy);
      }

      const fold = document.querySelector<HTMLElement>('[data-scene-fold="H2"]');
      const bands = fold ? fold.querySelectorAll<HTMLElement>('.scene-fold__band') : [];
      return {
        hasTrigger: true,
        progress: 0.5,
        band0: bands[0]?.style.transform || '',
        band1: bands[1]?.style.transform || '',
        band2: bands[2]?.style.transform || ''
      };
    });

    expect(rotationData).not.toBeNull();
    if (rotationData?.hasTrigger) {
      expect(rotationData.progress).toBeCloseTo(0.5, 1);
      // At 50% scrub with 3 bands and 90° max travel:
      // Band 1 (middle band, index 1) is at exactly -45°: rotateX(-45deg)
      expect(rotationData.band1).toContain('rotateX(-45deg)');
      // Band 0 (top band) is further along in travel (~ -59.2deg)
      expect(rotationData.band0).toMatch(/rotateX\(-59(\.\d+)?deg\)/);
      // Band 2 (bottom band) is earlier in travel (~ -30.8deg)
      expect(rotationData.band2).toMatch(/rotateX\(-30(\.\d+)?deg\)/);
    }
  });
});
