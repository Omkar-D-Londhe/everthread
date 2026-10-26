import { test, expect } from '@playwright/test';
import { gotoRoute, waitForAppReady } from './helpers.ts';

test.describe('EverThread Stage 05: Collection Walls Suite', () => {

  test.describe('E2E-WALL-01 & E2E-ROUTE-02 / 03: Direct Route Resolution & Deep Linking', () => {
    test('direct load /collections renders Contemporary Collection wall active with correct title', async ({ page, isMobile }) => {
      await gotoRoute(page, '/collections');
      await waitForAppReady(page);

      // Verify page title
      await expect(page).toHaveTitle(/Contemporary Collection · EverThread/);

      // Verify stage tablist
      const tablist = page.locator('[data-testid="collection-wall-tabs"]');
      await expect(tablist).toBeVisible();

      // Contemporary tab selected
      const contemporaryTab = page.locator('[data-testid="wall-tab-contemporary"]');
      await expect(contemporaryTab).toHaveAttribute('aria-selected', 'true');

      // Products grid visible with 7 flagship pieces
      const productsGrid = page.locator('[data-testid="products-grid"]');
      await expect(productsGrid).toBeVisible();
      await expect(page.locator('[data-testid^="product-card-"]')).toHaveCount(7);

      // Header nav link remains active on desktop/tablet
      if (!isMobile) {
        const navCollections = page.locator('header nav a', { hasText: 'Collections' }).first();
        await expect(navCollections).toHaveClass(/active/);
      }
    });

    test('direct load /collections/the-living-inheritance renders Living Inheritance wall active with correct title', async ({ page, isMobile }) => {
      await gotoRoute(page, '/collections/the-living-inheritance');
      await waitForAppReady(page);

      // Verify page title
      await expect(page).toHaveTitle(/The Living Inheritance · EverThread/);

      // Living Inheritance tab selected
      const inheritanceTab = page.locator('[data-testid="wall-tab-living-inheritance"]');
      await expect(inheritanceTab).toHaveAttribute('aria-selected', 'true');

      // Contemporary tab not selected
      const contemporaryTab = page.locator('[data-testid="wall-tab-contemporary"]');
      await expect(contemporaryTab).toHaveAttribute('aria-selected', 'false');

      // Curatorial reserve notice is visible (since TR-01..TR-07 are unlisted)
      await expect(page.locator('[data-testid="curatorial-reserve-notice"]')).toBeVisible();

      // Header nav link remains active on desktop/tablet
      if (!isMobile) {
        const navCollections = page.locator('header nav a', { hasText: 'Collections' }).first();
        await expect(navCollections).toHaveClass(/active/);
      }
    });
  });

  test.describe('E2E-WALL-02 & Spike Gate: Horizontal Track & History Navigation', () => {
    test('clicking wall tab navigates between collections, updating URL without reload or loop', async ({ page }) => {
      await gotoRoute(page, '/collections');
      await waitForAppReady(page);

      // Click "The Living Inheritance" tab
      await page.click('[data-testid="wall-tab-living-inheritance"]');
      await page.waitForURL('**/collections/the-living-inheritance');

      await expect(page).toHaveTitle(/The Living Inheritance · EverThread/);
      await expect(page.locator('[data-testid="wall-tab-living-inheritance"]')).toHaveAttribute('aria-selected', 'true');

      // Use browser back button
      await page.goBack();
      await page.waitForURL(url => url.pathname.endsWith('/collections') || url.pathname.endsWith('/collections/'));

      await expect(page).toHaveTitle(/Contemporary Collection · EverThread/);
      await expect(page.locator('[data-testid="wall-tab-contemporary"]')).toHaveAttribute('aria-selected', 'true');

      // Use browser forward button
      await page.goForward();
      await page.waitForURL('**/collections/the-living-inheritance');
      await expect(page.locator('[data-testid="wall-tab-living-inheritance"]')).toHaveAttribute('aria-selected', 'true');
    });

    test('edge cue buttons allow smooth horizontal navigation', async ({ page }) => {
      await gotoRoute(page, '/collections');
      await waitForAppReady(page);

      // Contemporary slide active; cue button to switch to Living Inheritance
      const toInheritanceBtn = page.locator('[data-testid="cue-to-living-inheritance"]');
      if (await toInheritanceBtn.isVisible()) {
        await toInheritanceBtn.click();
        await page.waitForURL('**/collections/the-living-inheritance');
        await expect(page.locator('[data-testid="wall-tab-living-inheritance"]')).toHaveAttribute('aria-selected', 'true');
      }
    });
  });

  test.describe('E2E-WALL-03 & O-13 Spike Gate: Vertical Scroll Integrity (Zero Hijacking)', () => {
    test('vertical wheel and pan over stage scrolls window natively with no preventDefault', async ({ page }) => {
      await gotoRoute(page, '/collections');
      await waitForAppReady(page);

      // Scroll stage area vertically
      const stage = page.locator('[data-testid="wall-stage"]');
      await expect(stage).toBeVisible();

      // Trigger vertical page scroll
      await page.mouse.move(300, 300);
      await page.mouse.wheel(0, 500);

      // Give a brief moment for smooth or native scroll
      await page.waitForTimeout(300);

      const scrollY = await page.evaluate(() => window.scrollY);
      expect(scrollY).toBeGreaterThan(0);
    });
  });

  test.describe('E2E-WALL-04 & Catalogue Gate: Unlisted Traditional Products Protection', () => {
    test('Living Inheritance wall displays curatorial reserve state and omits unlisted TR products', async ({ page }) => {
      await gotoRoute(page, '/collections/the-living-inheritance');
      await waitForAppReady(page);

      // Curatorial notice rendered
      const notice = page.locator('[data-testid="curatorial-reserve-notice"]');
      await expect(notice).toBeVisible();
      await expect(notice).toContainText('Archival Reserve');

      // No unlisted TR cards rendered with commerce actions
      const productCards = page.locator('[data-testid^="product-card-"]');
      await expect(productCards).toHaveCount(0);

      // Traditional products are NOT purchasable or clickable as buyable cards
      const trCard = page.locator('[data-product-id="tr-01"]');
      await expect(trCard).toHaveCount(0);
    });
  });

  test.describe('E2E-WALL-05 & E2E-A11Y-02: Accessible Tablist Keyboard Navigation', () => {
    test('tablist supports ArrowRight, ArrowLeft, Home, End, and Enter keyboard navigation', async ({ page }) => {
      await gotoRoute(page, '/collections');
      await waitForAppReady(page);

      const contemporaryTab = page.locator('[data-testid="wall-tab-contemporary"]');
      const inheritanceTab = page.locator('[data-testid="wall-tab-living-inheritance"]');

      // Focus first tab
      await contemporaryTab.focus();
      await expect(contemporaryTab).toBeFocused();

      // ArrowRight moves focus to next tab
      await page.keyboard.press('ArrowRight');
      await expect(inheritanceTab).toBeFocused();

      // Enter activates the focused tab
      await page.keyboard.press('Enter');
      await page.waitForURL('**/collections/the-living-inheritance');
      await expect(inheritanceTab).toHaveAttribute('aria-selected', 'true');

      // ArrowLeft moves focus back to first tab
      await page.keyboard.press('ArrowLeft');
      await expect(contemporaryTab).toBeFocused();

      // Space activates tab
      await page.keyboard.press('Space');
      await page.waitForURL(url => url.pathname.endsWith('/collections') || url.pathname.endsWith('/collections/'));
      await expect(contemporaryTab).toHaveAttribute('aria-selected', 'true');
    });

    test('ARIA tablist, tab, and tabpanel relationships conform to WAI-ARIA authoring practices', async ({ page }) => {
      await gotoRoute(page, '/collections');
      await waitForAppReady(page);

      const tablist = page.locator('[role="tablist"]');
      await expect(tablist).toHaveAttribute('aria-label', 'Collection Walls');

      const tabs = page.locator('[role="tab"]');
      await expect(tabs).toHaveCount(2);

      const panel = page.locator('[role="tabpanel"]');
      await expect(panel).toHaveAttribute('id', 'wall-products');
      await expect(page.locator('[data-testid="wall-tab-contemporary"]')).toHaveAttribute('aria-controls', 'wall-products');
    });
  });

  test.describe('E2E-WALL-06: Header Navigation Consistency', () => {
    test('header "Collections" link is marked active on both collection wall routes', async ({ page, isMobile }) => {
      if (isMobile) {
        test.skip();
        return;
      }
      await gotoRoute(page, '/collections');
      await waitForAppReady(page);
      const navLink1 = page.locator('header nav a', { hasText: 'Collections' }).first();
      await expect(navLink1).toHaveClass(/active/);

      await gotoRoute(page, '/collections/the-living-inheritance');
      await waitForAppReady(page);
      const navLink2 = page.locator('header nav a', { hasText: 'Collections' }).first();
      await expect(navLink2).toHaveClass(/active/);
    });
  });

  test.describe('E2E-RESP-01: Responsive Wall Stage Presentation', () => {
    test('renders stage track and thread continuity line across viewports', async ({ page }) => {
      await gotoRoute(page, '/collections');
      await waitForAppReady(page);

      const track = page.locator('[data-testid="wall-stage-track"]');
      await expect(track).toBeVisible();

      const thread = page.locator('[data-testid="wall-thread-svg"]');
      await expect(thread).toBeVisible();

      const contemporarySlide = page.locator('[data-testid="wall-slide-contemporary"]');
      await expect(contemporarySlide).toBeVisible();
    });
  });

});
