import { test, expect } from '@playwright/test';
import { gotoRoute, waitForAppReady } from './helpers.ts';

test.describe('EverThread Stage 02: Routes, Search, Compatibility & Archive Lineage Suite', () => {

  test.describe('E2E-ROUTE-04: Legacy Archive Redirects & Case-Insensitive Product Lookups', () => {
    test('redirects legacy /archive/varanasi-kadwa to canonical /archive?tradition=banarasi-brocade', async ({ page }) => {
      await gotoRoute(page, '/archive/varanasi-kadwa');
      await waitForAppReady(page);

      // Verify URL redirected to canonical query
      await expect(page).toHaveURL(/.*\/archive\?tradition=banarasi-brocade/);
      // Tradition Exhibition modal is mounted
      await expect(page.locator('#exhibition-title')).toContainText('Varanasi');
    });

    test('redirects legacy /archive/chanderi-handloom to canonical /archive?tradition=kota-doria', async ({ page }) => {
      await gotoRoute(page, '/archive/chanderi-handloom');
      await waitForAppReady(page);

      await expect(page).toHaveURL(/.*\/archive\?tradition=kota-doria/);
      await expect(page.locator('#exhibition-title')).toContainText('Chanderi');
    });

    test('redirects legacy /archive/assam-wild-silk-twill to canonical /archive?tradition=muga-silk', async ({ page }) => {
      await gotoRoute(page, '/archive/assam-wild-silk-twill');
      await waitForAppReady(page);

      await expect(page).toHaveURL(/.*\/archive\?tradition=muga-silk/);
      await expect(page.locator('#exhibition-title')).toContainText('Assam Muga');
    });

    test('resolves uppercase product ID /product/ET-01 to Oxblood Coat-Dress', async ({ page }) => {
      await gotoRoute(page, '/product/ET-01');
      await waitForAppReady(page);

      const h1 = page.locator('h1');
      await expect(h1).toHaveCount(1);
      await expect(h1).toContainText('Oxblood Wool-Silk Signature Coat-Dress');
    });

    test('resolves legacy ET-02 slug /product/ivory-raw-tussar-cocoon-trench to retitled Matka Silk Trench', async ({ page }) => {
      await gotoRoute(page, '/product/ivory-raw-tussar-cocoon-trench');
      await waitForAppReady(page);

      const h1 = page.locator('h1');
      await expect(h1).toHaveCount(1);
      await expect(h1).toContainText('Ivory Hand-Spun Matka Silk Cocoon Trench');
    });

    test('resolves canonical ET-02 slug /product/ivory-hand-spun-matka-silk-cocoon-trench', async ({ page }) => {
      await gotoRoute(page, '/product/ivory-hand-spun-matka-silk-cocoon-trench');
      await waitForAppReady(page);

      const h1 = page.locator('h1');
      await expect(h1).toHaveCount(1);
      await expect(h1).toContainText('Ivory Hand-Spun Matka Silk Cocoon Trench');
    });

    test('renders not-available state with role="status" and no Add to Bag on unlisted TR concept product', async ({ page }) => {
      await gotoRoute(page, '/product/banaras-afterlight-sculpted-brocade-mantle-coat');
      await waitForAppReady(page);

      const statusBox = page.locator('[data-testid="product-not-available"]');
      await expect(statusBox).toBeVisible();
      await expect(statusBox).toContainText('This piece is not currently available');

      // Verify no Add to Bag button exists
      const addBtn = page.locator('button:has-text("Add to Bag"), button:has-text("Commission Piece")');
      await expect(addBtn).toHaveCount(0);
    });
  });

  test.describe('E2E-SEARCH-01: Multi-Token Search & weave-14 Routing', () => {
    test('token matching maps "Indigo Chanderi Tunic" to ET-04 and navigates cleanly', async ({ page }) => {
      await gotoRoute(page, '/');
      await waitForAppReady(page);

      // Open search modal via header button
      const searchTrigger = page.locator('button[aria-label*="Search" i], button:has-text("Search")').first();
      await searchTrigger.click();

      const searchInput = page.locator('[data-testid="search-input"]');
      await expect(searchInput).toBeVisible();

      // Search multi-word query
      await searchInput.fill('Indigo Chanderi Tunic');

      // Verify result appears
      const productResult = page.locator('text=Angrakha Asymmetric Sheer Tunic').first();
      await expect(productResult).toBeVisible();

      // Click the product result
      await productResult.click();
      await waitForAppReady(page);

      await expect(page).toHaveURL(/.*\/product\/angrakha-asymmetric-sheer-tunic/);
      const h1 = page.locator('h1');
      await expect(h1).toContainText('Angrakha Asymmetric Sheer Tunic');
    });

    test('querying "radial" finds weave-14 and opens /archive/the-art-of-the-drape', async ({ page }) => {
      await gotoRoute(page, '/');
      await waitForAppReady(page);

      const searchTrigger = page.locator('button[aria-label*="Search" i], button:has-text("Search")').first();
      await searchTrigger.click();

      const searchInput = page.locator('[data-testid="search-input"]');
      await searchInput.fill('radial');

      const weaveResult = page.locator('text=Uncut Radial Bias Draping').first();
      await expect(weaveResult).toBeVisible();

      await weaveResult.click();
      await waitForAppReady(page);

      await expect(page).toHaveURL(/.*\/archive\/the-art-of-the-drape/);
      const h1 = page.locator('h1');
      await expect(h1).toContainText('The Art of the Drape');
    });

    test('unlisted TR products do not appear in search results', async ({ page }) => {
      await gotoRoute(page, '/');
      await waitForAppReady(page);

      const searchTrigger = page.locator('button[aria-label*="Search" i], button:has-text("Search")').first();
      await searchTrigger.click();

      const searchInput = page.locator('[data-testid="search-input"]');
      await searchInput.fill('Banaras Afterlight');

      // Product section should not list Banaras Afterlight
      const prodMatch = page.locator('[data-testid^="search-result-prod-tr-"]');
      await expect(prodMatch).toHaveCount(0);
    });
  });

  test.describe('E2E-ARCH-03: Archive Commerce Boundaries (Decision O-7 & Removal of Acquire)', () => {
    test('confirms zero Acquire to Bag button and blocked candidate link for Banarasi Brocade', async ({ page }, testInfo) => {
      await gotoRoute(page, '/archive?tradition=banarasi-brocade');
      await waitForAppReady(page);

      // Verify no acquire button exists anywhere
      const acquireBtn = page.locator('[data-testid="archive-acquire-btn"]');
      await expect(acquireBtn).toHaveCount(0);

      // Verify curatorial notice (visible on desktop/tablet, attached in DOM on mobile per responsive design)
      const curatorialNotice = page.locator('[data-testid="exhibition-curatorial-notice"]');
      if (testInfo.project.name === 'mobile') {
        await expect(curatorialNotice).toBeAttached();
      } else {
        await expect(curatorialNotice).toBeVisible();
      }
      await expect(curatorialNotice).toContainText('Curatorial Archival Record');
    });

    test('confirms info-only context for Kashmiri Sozni and no Acquire button', async ({ page }, testInfo) => {
      await gotoRoute(page, '/archive?tradition=kashmiri-sozni');
      await waitForAppReady(page);

      const acquireBtn = page.locator('[data-testid="archive-acquire-btn"]');
      await expect(acquireBtn).toHaveCount(0);

      const infoNotice = page.locator('[data-testid="exhibition-info-notice"]');
      if (testInfo.project.name === 'mobile') {
        await expect(infoNotice).toBeAttached();
      } else {
        await expect(infoNotice).toBeVisible();
      }
      await expect(infoNotice).toContainText('Pashmina is the ground fabric discussed in this folio.');
    });

    test('confirms kind: none for Muga Silk renders curatorial notice without piece link', async ({ page }, testInfo) => {
      await gotoRoute(page, '/archive?tradition=muga-silk');
      await waitForAppReady(page);

      const acquireBtn = page.locator('[data-testid="archive-acquire-btn"]');
      await expect(acquireBtn).toHaveCount(0);

      const curatorialNotice = page.locator('[data-testid="exhibition-curatorial-notice"]');
      if (testInfo.project.name === 'mobile') {
        await expect(curatorialNotice).toBeAttached();
      } else {
        await expect(curatorialNotice).toBeVisible();
      }
    });
  });
});
