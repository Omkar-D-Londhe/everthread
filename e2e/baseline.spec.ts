import { test, expect } from '@playwright/test';
import { gotoRoute, waitForAppReady } from './helpers.ts';

test.describe('EverThread Stage 01: Baseline Characterization Suite', () => {

  test.describe('E2E-ROUTE-01: Baseline Route Integrity & Console Cleanliness', () => {
    const baselineRoutes = [
      { name: 'Home', path: '/' },
      { name: 'Collections', path: '/collections' },
      { name: 'ET-01 Coat Dress', path: '/product/oxblood-wool-silk-signature-coat-dress' },
      { name: 'ET-02 Trench', path: '/product/ivory-raw-tussar-cocoon-trench' },
      { name: 'ET-03 Waistcoat', path: '/product/architectonic-zari-waistcoat' },
      { name: 'ET-04 Tunic', path: '/product/angrakha-asymmetric-sheer-tunic' },
      { name: 'ET-05 Frame Bag', path: '/product/box-calf-structured-frame-bag' },
      { name: 'ET-06 Scarf', path: '/product/hand-rolled-mulberry-twill-scarf' },
      { name: 'ET-07 Pashmina Stole', path: '/product/high-altitude-hand-spun-pashmina-stole' },
      { name: 'Curators Compass', path: '/compass' },
      { name: 'Cultural Archive', path: '/archive' },
      { name: 'Story 01 Living Loom', path: '/archive/the-living-loom' },
      { name: 'Story 02 Art of the Drape', path: '/archive/the-art-of-the-drape' },
      { name: 'Story 03 Language of Surface', path: '/archive/the-language-of-the-surface' },
      { name: 'Story 04 Garment Architecture', path: '/archive/the-architecture-of-a-garment' },
      { name: 'Tradition Filter: Ajrakh', path: '/archive?tradition=ajrakh' },
      { name: 'Tradition Filter: Banarasi', path: '/archive?tradition=banarasi-brocade' },
      { name: 'The House', path: '/the-house' },
      { name: 'Journal', path: '/journal' },
      { name: 'Journal Article: On Heirlooms', path: '/journal/on-unbroken-heirlooms' },
      { name: 'Saved Pieces', path: '/saved' },
      { name: 'Shopping Bag', path: '/bag' },
      { name: 'Checkout', path: '/checkout' },
      { name: 'Branded 404 (Unknown route)', path: '/unrecorded-folio-404-test' }
    ];

    for (const r of baselineRoutes) {
      test(`loads route ${r.name} (${r.path}) with one h1 and zero page errors`, async ({ page }) => {
        const pageErrors: Error[] = [];
        page.on('pageerror', (err) => pageErrors.push(err));

        await gotoRoute(page, r.path);

        // Verify exactly one h1 is present
        const h1Count = await page.locator('h1').count();
        expect(h1Count, `Expected exactly 1 <h1> on ${r.path}, found ${h1Count}`).toBe(1);

        // Verify no uncaught page errors
        expect(pageErrors, `Uncaught page errors on ${r.path}: ${pageErrors.map(e => e.message).join('; ')}`).toHaveLength(0);
      });
    }
  });

  test.describe('E2E-BASE-01: The Living Inheritance Route is Branded 404 at Baseline', () => {
    test('asserts /collections/the-living-inheritance displays branded 404 page', async ({ page }) => {
      const pageErrors: Error[] = [];
      page.on('pageerror', (err) => pageErrors.push(err));

      await gotoRoute(page, '/collections/the-living-inheritance');

      const h1 = page.locator('h1');
      await expect(h1).toHaveText('404');
      await expect(page.locator('text=Folio Unrecorded')).toBeVisible();
      await expect(page.locator('text=This thread has not yet been woven into the archive.')).toBeVisible();

      expect(pageErrors).toHaveLength(0);
    });
  });

  test.describe('E2E-CART-01: Baseline Mixed Cart & Simulated Checkout Flow', () => {
    test('adds mixed items (ET-01, ET-04, ET-07), manipulates quantity, removes item, persists on reload, and completes checkout', async ({ page }) => {
      // Clear localStorage before starting
      await page.goto('');
      await page.evaluate(() => localStorage.clear());

      // 1. Add ET-01 (Apparel: requires size)
      await gotoRoute(page, '/product/oxblood-wool-silk-signature-coat-dress');
      const sizeSelector01 = page.locator('[data-testid="size-selector"] button');
      if (await sizeSelector01.count() > 0) {
        await sizeSelector01.first().click();
      }
      await page.click('[data-testid="add-to-bag-btn"]');
      await expect(page.locator('[data-testid="added-to-bag-toast"]')).toBeVisible({ timeout: 5000 });

      // 2. Add ET-04 (Apparel: requires size)
      await gotoRoute(page, '/product/angrakha-asymmetric-sheer-tunic');
      const sizeSelector04 = page.locator('[data-testid="size-selector"] button');
      if (await sizeSelector04.count() > 0) {
        await sizeSelector04.first().click();
      }
      await page.click('[data-testid="add-to-bag-btn"]');
      await expect(page.locator('[data-testid="added-to-bag-toast"]')).toBeVisible({ timeout: 5000 });

      // 3. Add ET-07 (Accessory: no size selection required)
      await gotoRoute(page, '/product/high-altitude-hand-spun-pashmina-stole');
      await page.click('[data-testid="add-to-bag-btn"]');
      await expect(page.locator('[data-testid="added-to-bag-toast"]')).toBeVisible({ timeout: 5000 });

      // 4. Navigate to /bag
      await gotoRoute(page, '/bag');
      await expect(page.locator('[data-testid="bag-page"]')).toBeVisible();

      // Check items list has 3 items
      await expect(page.locator('.bag-item-card')).toHaveCount(3);

      // Increase quantity of first item
      await page.click('[data-testid="qty-plus-0"]');
      await expect(page.locator('[data-testid="item-qty-0"]')).toHaveText('2');

      // Remove the second item
      await page.click('[data-testid="remove-item-1"]');
      await expect(page.locator('.bag-item-card')).toHaveCount(2);

      // Verify subtotal is non-empty
      const subtotalText = await page.locator('[data-testid="bag-subtotal"]').innerText();
      expect(subtotalText).toContain('₹');

      // Reload page and check persistence
      await page.reload({ waitUntil: 'domcontentloaded' });
      await waitForAppReady(page);
      await expect(page.locator('.bag-item-card')).toHaveCount(2);
      await expect(page.locator('[data-testid="item-qty-0"]')).toHaveText('2');

      // 5. Proceed to Checkout
      await page.click('[data-testid="checkout-btn"]');
      await expect(page.locator('[data-testid="checkout-page"]')).toBeVisible();

      // Attempt to proceed without required fields -> verify field errors
      await page.click('[data-testid="proceed-to-review-btn"]');
      await expect(page.locator('[data-testid="error-fullName"]')).toBeVisible();

      // Fill in valid details
      await page.fill('[data-testid="input-fullName"]', 'Aditi Sharma');
      await page.fill('[data-testid="input-email"]', 'aditi.sharma@example.com');
      await page.fill('[data-testid="input-phone"]', '+91 98765 43210');
      await page.fill('[data-testid="input-address"]', '42 Heritage Mansions, Pedder Road');
      await page.fill('[data-testid="input-city"]', 'Mumbai');
      await page.fill('[data-testid="input-state"]', 'Maharashtra');
      await page.fill('[data-testid="input-postalCode"]', '400026');
      await page.selectOption('[data-testid="input-country"]', 'India');

      // Proceed to review
      await page.click('[data-testid="proceed-to-review-btn"]');
      await expect(page.locator('[data-testid="checkout-review-step"]')).toBeVisible();
      await expect(page.locator('[data-testid="review-name"]')).toHaveText('Aditi Sharma');

      // Complete demonstration order
      await page.click('[data-testid="complete-demo-order-btn"]');
      await expect(page.locator('[data-testid="checkout-confirmation-step"]')).toBeVisible();
      await expect(page.locator('[data-testid="confirmation-heading"]')).toHaveText('Simulated Concierge Allocation Registered');
      const orderRef = await page.locator('[data-testid="order-reference-code"]').innerText();
      expect(orderRef).toMatch(/^ET-DEMO-/);
    });
  });

});
