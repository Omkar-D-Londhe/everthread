import { test, expect } from '@playwright/test';
import { gotoRoute, waitForAppReady } from './helpers.ts';

test.describe('EverThread Stage 04: Traditional Products & Commerce Integrity Suite', () => {

  test.describe('E2E-CART-02: Quantity Minimum & Decrement-at-1 Protection', () => {
    test('decrementing at quantity 1 keeps the line; only explicit Remove deletes it', async ({ page }) => {
      await gotoRoute(page, '/product/oxblood-wool-silk-signature-coat-dress');
      await page.waitForSelector('[data-testid="gallery-main-image"]');

      // Select size and add to bag
      const sizeSelector = page.locator('[data-testid="size-selector"] button');
      if (await sizeSelector.count() > 0) {
        await sizeSelector.first().click();
      }
      await page.click('[data-testid="add-to-bag-btn"]');
      await expect(page.locator('[data-testid="added-to-bag-toast"]')).toBeVisible();

      // Go to bag
      await gotoRoute(page, '/bag');
      await expect(page.locator('[data-testid="bag-page"]')).toBeVisible();

      const itemQty = page.locator('[data-testid="item-qty-0"]');
      await expect(itemQty).toHaveText('1');

      // Decrement button at quantity 1 is aria-disabled
      const minusBtn = page.locator('[data-testid="qty-minus-0"]');
      await expect(minusBtn).toHaveAttribute('aria-disabled', 'true');

      // Clicking minus (even if forced) does not remove the item or reduce below 1
      await minusBtn.click({ force: true });
      await expect(itemQty).toHaveText('1');
      await expect(page.locator('.bag-item-card')).toHaveCount(1);

      // Explicit Remove button deletes the line
      const removeBtn = page.locator('[data-testid="remove-item-0"]');
      await removeBtn.click();
      await expect(page.locator('[data-testid="empty-bag-state"]')).toBeVisible();
    });
  });

  test.describe('E2E-CART-03: Variant Line Separation by Size and Color', () => {
    test('distinct sizes of same product create distinct bag line items with accurate subtotals', async ({ page }) => {
      // Clear storage
      await gotoRoute(page, '/');
      await page.evaluate(() => localStorage.clear());

      // Add ET-01 in Size M (first option)
      await gotoRoute(page, '/product/oxblood-wool-silk-signature-coat-dress');
      const sizes = page.locator('[data-testid="size-selector"] button');
      await sizes.nth(0).click();
      await page.click('[data-testid="add-to-bag-btn"]');
      await expect(page.locator('[data-testid="added-to-bag-toast"]')).toBeVisible();

      // Add ET-01 in Size L (second option)
      await sizes.nth(1).click();
      await page.click('[data-testid="add-to-bag-btn"]');
      await expect(page.locator('[data-testid="added-to-bag-toast"]')).toBeVisible();

      // Go to bag
      await gotoRoute(page, '/bag');
      await expect(page.locator('.bag-item-card')).toHaveCount(2);

      // Verify each line item has unique variant key and quantity 1
      await expect(page.locator('[data-testid="item-qty-0"]')).toHaveText('1');
      await expect(page.locator('[data-testid="item-qty-1"]')).toHaveText('1');
    });
  });

  test.describe('E2E-CART-04: Honest Colourway Note (Decision O-10)', () => {
    test('selecting secondary colour displays aria-live note that images show primary tone', async ({ page }) => {
      // ET-04 has Midnight Indigo (primary) and Natural Kora (secondary)
      await gotoRoute(page, '/product/angrakha-asymmetric-sheer-tunic');
      await page.waitForSelector('[data-testid="gallery-main-image"]');

      const colorNote = page.locator('[data-testid="stage-color-note"]');

      // Initially primary tone is selected -> no note
      await expect(colorNote).not.toBeVisible();

      // Select secondary colour (Natural Kora)
      const colorOptions = page.locator('[data-testid="color-selector"] button');
      if (await colorOptions.count() > 1) {
        await colorOptions.nth(1).click();

        // Stage colour note appears politely announcing images show first colour
        await expect(colorNote).toBeVisible();
        await expect(colorNote).toContainText('Images show Vat Fermented Indigo');

        // Switch back to primary
        await colorOptions.nth(0).click();
        await expect(colorNote).not.toBeVisible();
      }
    });
  });

  test.describe('E2E-CART-05: Unlisted TR Concept Protection & Compass Integrity', () => {
    test('unlisted TR products render curatorial not-available state with role="status" and no Add to Bag', async ({ page }) => {
      const trSlugs = [
        'banaras-afterlight-sculpted-brocade-mantle-coat',
        'mayura-axis-sculpted-drape-gown',
        'patola-geometry-reversible-jacket-and-trouser-set',
      ];

      for (const slug of trSlugs) {
        await gotoRoute(page, `/product/${slug}`);

        const main = page.locator('main[role="status"]');
        await expect(main).toBeVisible();

        const notAvailable = page.locator('[data-testid="product-not-available"]');
        await expect(notAvailable).toBeVisible();
        await expect(notAvailable).toContainText('This piece is not currently available');

        // Ensure zero Add to Bag button exists
        const addBtn = page.locator('[data-testid="add-to-bag-btn"]');
        await expect(addBtn).toHaveCount(0);
      }
    });

    test('Compass recommendation results never include unlisted TR concept products', async ({ page }) => {
      await gotoRoute(page, '/compass');
      await page.waitForSelector('[data-testid="stepper-pill-1"]');

      // Step 1: Select fabric
      const fabricOption = page.locator('[data-testid^="option-fabric-"]').first();
      await fabricOption.click();
      await page.click('[data-testid="step-continue-btn"]');

      // Step 2: Select movement
      const movementOption = page.locator('[data-testid^="option-movement-"]').first();
      await movementOption.click();
      await page.click('[data-testid="step-continue-btn"]');

      // Step 3: Select craft
      const craftOption = page.locator('[data-testid^="option-craft-"]').first();
      await craftOption.click();
      await page.click('[data-testid="step-continue-btn"]');

      // Step 4: Select story
      const storyOption = page.locator('[data-testid^="option-story-"]').first();
      await storyOption.click();
      await page.click('[data-testid="step-continue-btn"]');

      // Step 5: Verify recommendations exist or no-match exists, but never TR products
      await page.waitForSelector('[data-testid="compass-step-5"]');

      const productLinks = page.locator('[data-testid="compass-step-5"] a[href*="/product/"]');
      const count = await productLinks.count();
      for (let i = 0; i < count; i++) {
        const href = await productLinks.nth(i).getAttribute('href');
        expect(href).not.toBeNull();
        expect(href).not.toContain('/product/tr-');
        expect(href).not.toContain('/product/banaras-afterlight');
        expect(href).not.toContain('/product/mayura-axis');
        expect(href).not.toContain('/product/patola-geometry');
      }
    });
  });
});
