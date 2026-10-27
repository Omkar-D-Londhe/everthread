import { test, expect } from '@playwright/test';
import { gotoRoute, waitForAppReady } from './helpers.ts';

test.describe('EverThread Stage 10 Acceptance Suite', () => {

  test('E2E-WALL-THREAD: Collection-switching moving thread visibility and smooth travel', async ({ page }) => {
    await gotoRoute(page, 'collections');
    await waitForAppReady(page);

    const threadSvg = page.locator('[data-testid="wall-thread-svg"]');
    await expect(threadSvg).toBeVisible();

    // Verify stroke styling tactile upgrade
    const path = threadSvg.locator('path');
    await expect(path).toBeVisible();
    const strokeWidth = await path.getAttribute('stroke-width');
    expect(Number(strokeWidth)).toBeGreaterThanOrEqual(2.5);

    // Switch to Living Inheritance wall via tab
    const livingTab = page.locator('[data-testid="wall-tab-living-inheritance"]');
    await expect(livingTab).toBeVisible();
    await livingTab.click();

    // Wait for route and scroll animation to complete and settle
    await page.waitForTimeout(800);

    // Settled class applies pulse effect
    const container = page.locator('.wall-thread-container');
    await expect(container).toHaveClass(/wall-thread-settled/);
  });

  test('E2E-RESP-01: Responsive overflow audit across 320px–1440px with overflow-x visible', async ({ page }) => {
    test.setTimeout(120000);
    const viewports = [
      { width: 320, height: 600 },
      { width: 390, height: 844 },
      { width: 1440, height: 900 }
    ];

    const testRoutes = ['', 'collections', 'archive', 'the-house', 'compass', 'product/tr-01'];

    for (const vp of viewports) {
      await page.setViewportSize(vp);
      for (const route of testRoutes) {
        await gotoRoute(page, route);
        await waitForAppReady(page);

        // Override overflow-x: hidden to visible to expose any uncontained overflow
        const overflowDetails = await page.evaluate(() => {
          document.body.style.overflowX = 'visible';
          document.documentElement.style.overflowX = 'visible';
          const elList = document.querySelectorAll('*');
          const bad = [];
          for (const el of elList) {
            // F-10: Exclude intentional horizontal strips and offscreen overlay drawers per spec
            const isInsideIntentionalScroll = el.closest(
              '.wall-stage-track, .wall-stage-panels-wrap, .wall-tabs-container, .technique-strip-track, .technique-strip-container, .gallery-thumbs, .compass-stepper, .compass-stepper-inner, .filter-drawer-content, .offcanvas, [style*="overflow-x: auto"], [style*="overflow-x: scroll"], .overflow-x-auto'
            );
            if (isInsideIntentionalScroll) continue;

            const r = el.getBoundingClientRect();
            if (r.right > window.innerWidth + 1.5) {
              bad.push({
                tag: el.tagName,
                cls: (el.className || '').toString().slice(0, 50),
                id: el.id,
                right: r.right,
                text: el.textContent?.slice(0, 30)
              });
            }
          }
          return bad;
        });

        if (overflowDetails.length > 0) {
          console.log(`OVERFLOW [${route}] at ${vp.width}px:`, overflowDetails.slice(0, 5));
        }

        expect(overflowDetails.length, `Route ${route} has horizontal overflow at width ${vp.width}px`).toBe(0);
      }
    }
  });

  test('E2E-A11Y-03: Focus ring contrast ≥ 3:1 with Deep Oxblood (#49232D)', async ({ page }) => {
    await gotoRoute(page, 'collections');
    await waitForAppReady(page);

    // Tab into interactive navigation link via keyboard
    // Focus brand mark and press Tab into header action or navigation
    const targetLink = page.locator('.brand-mark');
    await targetLink.focus();

    // Trigger keyboard mode by pressing Tab
    await page.keyboard.press('Tab');

    // Get active element and check outline
    const outlineInfo = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement;
      if (!el) return null;
      const cs = window.getComputedStyle(el);
      return {
        tag: el.tagName,
        className: el.className,
        outlineColor: cs.outlineColor,
        outlineWidth: cs.outlineWidth,
        outlineOffset: cs.outlineOffset,
        outline: cs.outline
      };
    });

    console.log('ACTIVE KEYBOARD ELEMENT OUTLINE:', outlineInfo);

    expect(outlineInfo).not.toBeNull();
    // Deep Oxblood is rgb(73, 35, 45) = #49232D (contrast 12.8:1 on ivory)
    if (outlineInfo) {
      expect(outlineInfo.outlineColor).toContain('rgb(73, 35, 45)');
      expect(outlineInfo.outlineWidth).toBe('2px');
      expect(outlineInfo.outlineOffset).toBe('2px');
    }
  });

  test('E2E-A11Y-NEWSLETTER: Footer newsletter email input has accessible name and label', async ({ page }) => {
    await gotoRoute(page, '');
    await waitForAppReady(page);

    const emailInput = page.locator('#gazette-email-input');
    await emailInput.scrollIntoViewIfNeeded();
    await expect(emailInput).toBeAttached();
    await expect(emailInput).toHaveAttribute('aria-label', 'Email address');

    const label = page.locator('label[for="gazette-email-input"]');
    await expect(label).toBeAttached();
    await expect(label).toHaveText('Email address');
  });

  test('E2E-A11Y-ICONS: Material Symbols font fallback and decorative aria-hidden protection', async ({ page }) => {
    await gotoRoute(page, '');
    await waitForAppReady(page);

    const icons = page.locator('.material-symbols-outlined');
    const iconCount = await icons.count();
    expect(iconCount).toBeGreaterThan(0);

    for (let i = 0; i < iconCount; i++) {
      const icon = icons.nth(i);
      const ariaHidden = await icon.getAttribute('aria-hidden');
      const parentButton = icon.locator('xpath=ancestor::button[1]');
      const hasParentBtn = (await parentButton.count()) > 0;

      if (hasParentBtn) {
        const btnAriaLabel = await parentButton.getAttribute('aria-label');
        const hasAria = !!btnAriaLabel || ariaHidden === 'true';
        expect(hasAria).toBe(true);
      } else {
        expect(ariaHidden).toBe('true');
      }
    }
  });

  test('E2E-LOAD-01: ThreadLoader maintains verified timing (1900ms active, 400ms fade)', async ({ page }) => {
    // Navigate without skipping loader to test timing
    const startTime = Date.now();
    await page.goto('http://127.0.0.1:4173/everthread/');
    
    const loader = page.locator('.thread-loader-backdrop');
    if (await loader.isVisible()) {
      await expect(loader).toBeHidden({ timeout: 4000 });
      const elapsed = Date.now() - startTime;
      expect(elapsed).toBeGreaterThanOrEqual(1800);
      expect(elapsed).toBeLessThanOrEqual(3500);
    }
  });

});
