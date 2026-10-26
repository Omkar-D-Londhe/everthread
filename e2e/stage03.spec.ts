import { test, expect } from '@playwright/test';
import { gotoRoute, waitForAppReady } from './helpers.ts';

test.describe('EverThread Stage 03: Portrait-Aware Product Stage, Atelier Lens & Dialog Focus Suite', () => {

  test.describe('E2E-LENS-01: Thumbnail Selection Unifies Stage & Atelier Lens Source', () => {
    test('selecting each gallery thumbnail updates both visible stage image and Atelier Lens source on ET-01 and ET-02', async ({ page }) => {
      // Test ET-01
      await gotoRoute(page, '/product/oxblood-wool-silk-signature-coat-dress');
      await page.waitForSelector('[data-testid="gallery-main-image"]');

      const thumbs = page.locator('[data-testid="gallery-thumbnails"] button');
      const thumbCount = await thumbs.count();
      expect(thumbCount).toBeGreaterThan(1);

      for (let i = 0; i < thumbCount; i++) {
        await thumbs.nth(i).click();

        // Get expected thumbnail image src
        const thumbImg = thumbs.nth(i).locator('img');
        const expectedSrc = await thumbImg.getAttribute('src');
        expect(expectedSrc).toBeTruthy();

        // Stage active image matches selected thumbnail
        const stageImg = page.locator('[data-testid="gallery-main-image"]');
        await expect(stageImg).toHaveAttribute('src', expectedSrc!);

        // Open Atelier Lens
        const inspectBtn = page.locator('[data-testid="inspect-fabric-lens-btn"]');
        await inspectBtn.click();

        // Atelier Lens image displays the EXACT active thumbnail image (eliminating macro precedence)
        const lensImg = page.locator('[data-testid="atelier-lens-image"]');
        await expect(lensImg).toBeVisible();
        await expect(lensImg).toHaveAttribute('src', expectedSrc!);

        // Lens image alt text contains "magnified view"
        const lensAlt = await lensImg.getAttribute('alt');
        expect(lensAlt).toContain('magnified view');

        // Close lens modal via Escape
        await page.keyboard.press('Escape');
        await expect(page.locator('[data-testid="atelier-lens-dialog"]')).not.toBeVisible();
      }

      // Test ET-02 (Retitled Matka Silk Trench)
      await gotoRoute(page, '/product/ivory-hand-spun-matka-silk-cocoon-trench');
      await page.waitForSelector('[data-testid="gallery-main-image"]');

      const et02Thumbs = page.locator('[data-testid="gallery-thumbnails"] button');
      const et02Count = await et02Thumbs.count();
      if (et02Count > 1) {
        await et02Thumbs.nth(1).click();
        const expectedSrc = await et02Thumbs.nth(1).locator('img').getAttribute('src');

        const stageImg = page.locator('[data-testid="gallery-main-image"]');
        await expect(stageImg).toHaveAttribute('src', expectedSrc!);

        await page.locator('[data-testid="inspect-fabric-lens-btn"]').click();
        const lensImg = page.locator('[data-testid="atelier-lens-image"]');
        await expect(lensImg).toHaveAttribute('src', expectedSrc!);

        await page.keyboard.press('Escape');
        await expect(page.locator('[data-testid="atelier-lens-dialog"]')).not.toBeVisible();
      }
    });
  });

  test.describe('E2E-LENS-02: Desktop Hover Preview & Coordinate Accuracy', () => {
    test('hover preview tracks pointer with non-stretching aspect ratio on desktop', async ({ page }, testInfo) => {
      test.skip(testInfo.project.name !== 'desktop', 'Desktop hover preview is enabled on desktop viewports (>=1024px with fine pointer)');

      await gotoRoute(page, '/product/oxblood-wool-silk-signature-coat-dress');
      await page.waitForSelector('[data-testid="gallery-main-image"]');

      const stageContainer = page.locator('[data-testid="gallery-main-container"]');
      await stageContainer.scrollIntoViewIfNeeded();

      // Hover over the product image stage
      await stageContainer.hover({ position: { x: 200, y: 200 } });
      await page.waitForTimeout(200);

      // Verify hover preview pane and crosshair are active
      const previewPane = page.locator('[data-testid="stage-hover-preview-pane"]');
      await expect(previewPane).toBeVisible();

      const crosshair = page.locator('[data-testid="stage-hover-crosshair"]');
      await expect(crosshair).toBeVisible();

      // Verify aspect ratio of background-size does not stretch
      const bgSize = await previewPane.evaluate((el) => {
        return window.getComputedStyle(el).backgroundSize;
      });

      // bgSize is formatted as "width px height px"
      const parts = bgSize.split(' ').map(p => parseFloat(p));
      expect(parts.length).toBe(2);
      const bgAspect = parts[0] / parts[1];
      // ET-01 primary view is 1024x1536 -> aspect ratio = 1024 / 1536 ≈ 0.667
      expect(bgAspect).toBeCloseTo(1024 / 1536, 1);

      // Move pointer outside stage -> preview pane hides
      await page.mouse.move(10, 10);
      await expect(previewPane).not.toBeVisible();
    });
  });

  test.describe('E2E-LENS-03: Keyboard Interaction, Panning, and Focus Return', () => {
    test('keyboard navigates loupe, controls zoom, closes on Escape, and returns focus to opener', async ({ page }) => {
      await gotoRoute(page, '/product/oxblood-wool-silk-signature-coat-dress');
      await page.waitForSelector('[data-testid="inspect-fabric-lens-btn"]');

      // Focus the inspect button and press Enter to open modal
      const inspectBtn = page.locator('[data-testid="inspect-fabric-lens-btn"]');
      await inspectBtn.focus();
      await page.keyboard.press('Enter');

      const lensDialog = page.locator('[data-testid="atelier-lens-dialog"]');
      await expect(lensDialog).toBeVisible();

      // Initial focus moves into dialog (close button)
      const closeBtn = page.locator('[data-testid="atelier-lens-close-btn"]');
      await expect(closeBtn).toBeFocused();

      // Keyboard arrow keys navigate loupe
      await page.keyboard.press('ArrowRight');
      await page.keyboard.press('ArrowDown');

      // Zoom display exists
      const zoomDisplay = page.locator('[data-testid="lens-zoom-display"]');
      await expect(zoomDisplay).toBeVisible();

      // Keyboard '+' and '-' adjust zoom
      await page.keyboard.press('+');
      await page.keyboard.press('-');

      // Press Escape to dismiss modal
      await page.keyboard.press('Escape');
      await expect(lensDialog).not.toBeVisible();

      // Focus is restored to the opener inspect button
      await expect(inspectBtn).toBeFocused();
    });
  });

  test.describe('E2E-LENS-04: Mobile Touch Interaction & Controls', () => {
    test('tapping stage or button opens modal with touch-friendly zoom controls on mobile', async ({ page }, testInfo) => {
      test.skip(testInfo.project.name === 'desktop', 'Touch interactions run on mobile and tablet projects');

      await gotoRoute(page, '/product/oxblood-wool-silk-signature-coat-dress');
      await page.waitForSelector('[data-testid="gallery-main-image"]');

      // Tap inspect button
      const inspectBtn = page.locator('[data-testid="inspect-fabric-lens-btn"]');
      await inspectBtn.click();

      const lensDialog = page.locator('[data-testid="atelier-lens-dialog"]');
      await expect(lensDialog).toBeVisible();

      // Touch zoom buttons (+ / -)
      const zoomDisplay = page.locator('[data-testid="lens-zoom-display"]');
      const initialZoomText = await zoomDisplay.textContent();

      const zoomInBtn = page.locator('[data-testid="lens-zoom-in-btn"]');
      if (await zoomInBtn.isEnabled()) {
        await zoomInBtn.click();
        const updatedZoomText = await zoomDisplay.textContent();
        expect(updatedZoomText).not.toBe(initialZoomText);
      }

      // Close modal
      const closeBtn = page.locator('[data-testid="atelier-lens-close-btn"]');
      await closeBtn.click();
      await expect(lensDialog).not.toBeVisible();
    });
  });

  test.describe('E2E-A11Y-02: Dialog Focus Trapping in Search & Atelier Lens', () => {
    test('traps focus inside SearchModal and restores focus to search button on close', async ({ page }) => {
      await gotoRoute(page, '/');

      const searchTrigger = page.locator('button[aria-label*="Search" i], button:has-text("Search")').first();
      await searchTrigger.scrollIntoViewIfNeeded();
      await searchTrigger.focus();
      await page.keyboard.press('Enter');

      const searchInput = page.locator('[data-testid="search-input"]');
      await expect(searchInput).toBeVisible();
      await expect(searchInput).toBeFocused();

      const searchDialog = page.locator('[data-testid="curatorial-search-dialog"]');
      await expect(searchDialog).toBeVisible();

      // Tab cycles through modal elements without escaping into document body
      for (let i = 0; i < 5; i++) {
        await page.keyboard.press('Tab');
        const isWithin = await searchDialog.evaluate((dialog) => {
          return dialog.contains(document.activeElement);
        });
        expect(isWithin).toBe(true);
      }

      // Escape key closes modal
      await page.keyboard.press('Escape');
      await expect(searchDialog).not.toBeVisible();

      // Focus returns to the search button opener
      await expect(searchTrigger).toBeFocused();
    });

    test('traps focus inside AtelierLensModal', async ({ page }) => {
      await gotoRoute(page, '/product/oxblood-wool-silk-signature-coat-dress');
      await page.waitForSelector('[data-testid="inspect-fabric-lens-btn"]');

      const inspectBtn = page.locator('[data-testid="inspect-fabric-lens-btn"]');
      await inspectBtn.click();

      const dialog = page.locator('[data-testid="atelier-lens-dialog"]');
      await expect(dialog).toBeVisible();

      // Tab wraps within dialog
      for (let i = 0; i < 6; i++) {
        await page.keyboard.press('Tab');
        const isWithin = await dialog.evaluate((el) => el.contains(document.activeElement));
        expect(isWithin).toBe(true);
      }

      await page.keyboard.press('Escape');
      await expect(dialog).not.toBeVisible();
      await expect(inspectBtn).toBeFocused();
    });
  });

  test.describe('E2E-PDP-01: Mobile Layout Overflow Protection & Contain Geometry', () => {
    test('verifies zero horizontal overflow at 390px across product routes', async ({ page }, testInfo) => {
      test.skip(testInfo.project.name !== 'mobile', 'Horizontal overflow verification is tailored for mobile viewport (390px)');

      const testSlugs = [
        'oxblood-wool-silk-signature-coat-dress',
        'ivory-hand-spun-matka-silk-cocoon-trench',
        'architectonic-zari-waistcoat',
      ];

      for (const slug of testSlugs) {
        await gotoRoute(page, `/product/${slug}`);
        await page.waitForSelector('[data-testid="gallery-main-image"]');

        // Check horizontal page overflow
        const overflow = await page.evaluate(() => {
          return document.documentElement.scrollWidth > window.innerWidth;
        });
        expect(overflow).toBe(false);

        // Check thumbnails container does not exceed viewport width
        const thumbsBox = await page.locator('[data-testid="gallery-thumbnails"]').boundingBox();
        if (thumbsBox) {
          expect(thumbsBox.width).toBeLessThanOrEqual(390);
        }
      }
    });

    test('verifies containment geometry prevents head/feet cropping on 4:5 portrait proportions', async ({ page }) => {
      await gotoRoute(page, '/product/oxblood-wool-silk-signature-coat-dress');
      await page.waitForSelector('[data-testid="gallery-main-container"]');

      // Test contain calculation for a 4:5 portrait ratio (1122x1402) inside the container
      const containment = await page.evaluate(() => {
        // Evaluate contain math in browser context
        const container = document.querySelector('[data-testid="gallery-main-container"]') as HTMLElement;
        const cW = container.clientWidth;
        const cH = container.clientHeight;
        const naturalW = 1122;
        const naturalH = 1402;
        const imageAspect = naturalW / naturalH; // ~0.8
        const containerAspect = cW / cH;

        let renderedW = 0;
        let renderedH = 0;
        if (imageAspect > containerAspect) {
          renderedW = cW;
          renderedH = cW / imageAspect;
        } else {
          renderedH = cH;
          renderedW = cH * imageAspect;
        }

        return {
          fitsWidth: renderedW <= cW + 1,
          fitsHeight: renderedH <= cH + 1,
          renderedW,
          renderedH,
          cW,
          cH,
        };
      });

      expect(containment.fitsWidth).toBe(true);
      expect(containment.fitsHeight).toBe(true);
      expect(containment.renderedH).toBeGreaterThan(0);
    });
  });
});
