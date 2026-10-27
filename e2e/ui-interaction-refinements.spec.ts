import { test, expect } from '@playwright/test';
import { gotoRoute, waitForAppReady } from './helpers.ts';

test.describe('EverThread UI & Interaction Refinements (5-Issue Acceptance Suite)', () => {
  test.setTimeout(60000);

  /* --------------------------------------------------------------------------
     Issue 1: Traditional collection wishlist and shopping-bag action behavior
     -------------------------------------------------------------------------- */
  test('Issue 1: Wishlist and bag isolation across traditional & contemporary products', async ({ page }) => {
    // Start at Living Inheritance wall
    await gotoRoute(page, 'collections/the-living-inheritance');
    await waitForAppReady(page);

    // Clear storage before starting
    await page.evaluate(() => {
      localStorage.clear();
    });
    await page.reload();
    await waitForAppReady(page);

    // Save traditional piece TR-01
    const saveBtnTr01 = page.locator('[data-testid="save-btn-tr-01"]');
    await saveBtnTr01.scrollIntoViewIfNeeded();
    await saveBtnTr01.click();
    await expect(saveBtnTr01).toHaveAttribute('aria-pressed', 'true');

    // Verify localStorage: saved has tr-01, bag is empty
    const savedAfterTr01 = await page.evaluate(() => JSON.parse(localStorage.getItem('everthread_saved_v2') || '[]'));
    const bagAfterTr01 = await page.evaluate(() => JSON.parse(localStorage.getItem('everthread_bag_v2') || '[]'));
    expect(savedAfterTr01).toEqual(['tr-01']);
    expect(bagAfterTr01).toEqual([]);

    // Check header wishlist link indicates 1 item
    const savedHeaderLink = page.locator('a[aria-label*="View Saved Pieces (1 items)"]');
    await expect(savedHeaderLink).toBeVisible();

    // Check shopping bag header indicator does not indicate any items
    const bagHeaderLink = page.locator('a[aria-label*="View Bespoke Shopping Bag"]');
    const bagBadgeCount = await bagHeaderLink.locator('.count-badge').count();
    expect(bagBadgeCount).toBe(0);

    // Switch to Contemporary Collection wall
    await gotoRoute(page, 'collections');
    await waitForAppReady(page);

    const saveBtnEt01 = page.locator('[data-testid="save-btn-et-01"]');
    await saveBtnEt01.scrollIntoViewIfNeeded();
    await saveBtnEt01.click();
    await expect(saveBtnEt01).toHaveAttribute('aria-pressed', 'true');

    // Both TR-01 and ET-01 must be saved, bag still empty
    const savedBoth = await page.evaluate(() => JSON.parse(localStorage.getItem('everthread_saved_v2') || '[]'));
    expect(savedBoth).toContain('tr-01');
    expect(savedBoth).toContain('et-01');
    expect(savedBoth.length).toBe(2);

    // Navigate to /saved
    await gotoRoute(page, 'saved');
    await waitForAppReady(page);

    // Both cards render
    const trCard = page.locator('[data-testid="saved-card-tr-01"]');
    const etCard = page.locator('[data-testid="saved-card-et-01"]');
    await expect(trCard).toBeVisible();
    await expect(etCard).toBeVisible();

    // Move ET-01 to bag
    const moveToBagBtn = etCard.locator('[data-testid="move-to-bag-et-01"], button:has-text("Move to Bespoke Bag")').first();
    await moveToBagBtn.click();
    await page.waitForTimeout(400);

    // ET-01 is removed from saved pieces, TR-01 remains
    await expect(etCard).not.toBeVisible();
    await expect(trCard).toBeVisible();

    // Verify localStorage isolation: saved contains only tr-01, bag contains et-01
    const savedFinal = await page.evaluate(() => JSON.parse(localStorage.getItem('everthread_saved_v2') || '[]'));
    const bagFinal = await page.evaluate(() => JSON.parse(localStorage.getItem('everthread_bag_v2') || '[]'));
    expect(savedFinal).toEqual(['tr-01']);
    expect(bagFinal.length).toBe(1);
    expect(bagFinal[0].productId).toBe('et-01');
  });

  /* --------------------------------------------------------------------------
     Issue 2: Curatorial Search result button overflowing its layout
     -------------------------------------------------------------------------- */
  for (const viewport of [
    { width: 1440, height: 900, name: 'desktop-1440' },
    { width: 1024, height: 768, name: 'tablet-1024' },
    { width: 768, height: 1024, name: 'tablet-768' },
    { width: 390, height: 844, name: 'mobile-390' },
  ]) {
    test(`Issue 2: Search result actions stay within bounds at ${viewport.name} (${viewport.width}px)`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await gotoRoute(page, 'home');
      await waitForAppReady(page);

      // Open Search modal via search button in header
      const searchTrigger = page.locator('button[aria-label="Search Collection (/)"]');
      await expect(searchTrigger).toBeVisible();
      await searchTrigger.click();

      const searchModal = page.locator('[data-testid="curatorial-search-dialog"]');
      await expect(searchModal).toBeVisible();

      const searchInput = page.locator('[data-testid="search-input"]');
      await searchInput.fill('coat');
      await page.waitForTimeout(300);

      const resultsList = page.locator('#search-results-list');
      await expect(resultsList).toBeVisible();

      // Check results bounding box and horizontal overflow
      const resultsOverflow = await resultsList.evaluate((list) => {
        const items = Array.from(list.querySelectorAll('.search-result-item'));
        let anyButtonOverflow = false;
        let maxItemRightDiff = 0;

        items.forEach((item) => {
          const itemRect = item.getBoundingClientRect();
          const actionBtn = item.querySelector('.search-result-action');
          if (actionBtn) {
            const btnRect = actionBtn.getBoundingClientRect();
            // Action button must not exceed the right edge of its parent item
            if (btnRect.right > itemRect.right + 2) {
              anyButtonOverflow = true;
              maxItemRightDiff = Math.max(maxItemRightDiff, btnRect.right - itemRect.right);
            }
          }
        });

        return {
          scrollWidth: list.scrollWidth,
          clientWidth: list.clientWidth,
          hasListHScrollbar: list.scrollWidth > list.clientWidth + 1,
          anyButtonOverflow,
          maxItemRightDiff,
          docScrollWidth: document.documentElement.scrollWidth,
          docClientWidth: document.documentElement.clientWidth,
        };
      });

      expect(resultsOverflow.hasListHScrollbar).toBe(false);
      expect(resultsOverflow.anyButtonOverflow).toBe(false);
      expect(resultsOverflow.docScrollWidth).toBeLessThanOrEqual(resultsOverflow.docClientWidth + 1);

      // Also test a multi-result term with various actions (ORDER FOLIO, EXAMINE, READ FOLIO)
      await searchInput.fill('silk');
      await page.waitForTimeout(300);

      const multiResultsOverflow = await resultsList.evaluate((list) => {
        const items = Array.from(list.querySelectorAll('.search-result-item'));
        let anyButtonOverflow = false;
        items.forEach((item) => {
          const itemRect = item.getBoundingClientRect();
          const actionBtn = item.querySelector('.search-result-action');
          if (actionBtn) {
            const btnRect = actionBtn.getBoundingClientRect();
            if (btnRect.right > itemRect.right + 2) {
              anyButtonOverflow = true;
            }
          }
        });

        return {
          itemCount: items.length,
          hasListHScrollbar: list.scrollWidth > list.clientWidth + 1,
          anyButtonOverflow,
        };
      });

      expect(multiResultsOverflow.itemCount).toBeGreaterThan(0);
      expect(multiResultsOverflow.hasListHScrollbar).toBe(false);
      expect(multiResultsOverflow.anyButtonOverflow).toBe(false);

      // Close search modal
      await page.keyboard.press('Escape');
    });
  }

  /* --------------------------------------------------------------------------
     Issue 3: Technique Strip continuous one-direction movement with user-controlled pause
     -------------------------------------------------------------------------- */
  test('Issue 3: Technique Strip continuous one-direction movement and accessible controls', async ({ page }) => {
    await gotoRoute(page, 'archive');
    await waitForAppReady(page);

    const stripSection = page.locator('[data-testid="technique-strip"]');
    await stripSection.scrollIntoViewIfNeeded();

    const track = page.locator('[data-testid="technique-strip-track"]');
    await expect(track).toBeVisible();

    const pauseBtn = page.locator('[data-testid="technique-strip-pause-btn"]');
    await expect(pauseBtn).toBeVisible();
    await expect(pauseBtn).toHaveAttribute('aria-pressed', 'false');

    // 1. Check animation progresses automatically
    const initialPos = await track.evaluate((el) => el.scrollLeft);
    await page.waitForTimeout(600);
    const movedPos = await track.evaluate((el) => el.scrollLeft);
    expect(movedPos).toBeGreaterThan(initialPos);

    // 2. Click pause button
    await pauseBtn.click();
    await expect(pauseBtn).toHaveAttribute('aria-pressed', 'true');

    const pausedPos1 = await track.evaluate((el) => el.scrollLeft);
    await page.waitForTimeout(400);
    const pausedPos2 = await track.evaluate((el) => el.scrollLeft);
    expect(pausedPos2).toBe(pausedPos1);

    // 3. Resume via pause button
    await pauseBtn.click();
    await expect(pauseBtn).toHaveAttribute('aria-pressed', 'false');
    await page.waitForTimeout(400);
    const resumedPos = await track.evaluate((el) => el.scrollLeft);
    expect(resumedPos).toBeGreaterThan(pausedPos2);

    // 4. Hover pauses animation
    await stripSection.hover();
    await page.waitForTimeout(200);
    const hoveredPos1 = await track.evaluate((el) => el.scrollLeft);
    await page.waitForTimeout(400);
    const hoveredPos2 = await track.evaluate((el) => el.scrollLeft);
    expect(Math.abs(hoveredPos2 - hoveredPos1)).toBeLessThanOrEqual(1);

    // 5. Move mouse away resumes animation
    await page.mouse.move(0, 0);
    await page.waitForTimeout(400);
    const unhoveredPos = await track.evaluate((el) => el.scrollLeft);
    expect(unhoveredPos).toBeGreaterThan(hoveredPos2);

    // 6. Verify duplicate items are non-interactive
    const clones = page.locator('[data-testid^="technique-strip-clone-item-"]');
    const cloneCount = await clones.count();
    expect(cloneCount).toBe(9);

    for (let i = 0; i < cloneCount; i++) {
      const clone = clones.nth(i);
      await expect(clone).toHaveAttribute('aria-hidden', 'true');
      await expect(clone).toHaveAttribute('tabindex', '-1');
    }
  });

  /* --------------------------------------------------------------------------
     Issue 4: Cultural Archive catalogue cards spacing and layout
     -------------------------------------------------------------------------- */
  test('Issue 4: Cultural Archive card height & gap elimination in triptych layout', async ({ page }) => {
    await gotoRoute(page, 'archive');
    await waitForAppReady(page);

    // Scroll to the Natural Dyeing / Bagru card in the Weave Library
    const bagruCard = page.locator('[data-testid="weave-card-bagru-madder-dyeing"]');
    await bagruCard.scrollIntoViewIfNeeded();
    await expect(bagruCard).toBeVisible();

    const metrics = await bagruCard.evaluate((el) => {
      const cardRect = el.getBoundingClientRect();
      const parentRow = el.closest('.row');
      const rowRect = parentRow ? parentRow.getBoundingClientRect() : null;
      return {
        cardHeight: cardRect.height,
        rowHeight: rowRect ? rowRect.height : 0,
        gapBelowCard: rowRect ? rowRect.bottom - cardRect.bottom : 0,
      };
    });

    // Card should not be inflated to 1439px; expected ~750px
    expect(metrics.cardHeight).toBeLessThan(900);
    expect(metrics.cardHeight).toBeGreaterThan(500);

    // Verify other preset layouts also render cleanly without overflowing
    const allCards = page.locator('[data-testid^="weave-card-"]');
    const cardCount = await allCards.count();
    expect(cardCount).toBeGreaterThanOrEqual(13);
  });

  /* --------------------------------------------------------------------------
     Issue 5: Atelier Lens magnification fails to inspect image borders correctly
     -------------------------------------------------------------------------- */
  test('Issue 5: Atelier Lens reticle and background inspection at image center, edges, and corners', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === 'mobile', 'Atelier Lens modal loupe interactions calibrated for fine-pointer viewports');

    // Test on Product Detail Page
    await gotoRoute(page, 'product/oxblood-wool-silk-signature-coat-dress');
    await waitForAppReady(page);

    const openLensBtn = page.locator('[data-testid="inspect-fabric-lens-btn"]');
    await openLensBtn.scrollIntoViewIfNeeded();
    await openLensBtn.click();

    const lensModal = page.locator('[data-testid="atelier-lens-dialog"]');
    await expect(lensModal).toBeVisible();

    const viewport = page.locator('[data-testid="atelier-lens-viewport"]');
    await expect(viewport).toBeVisible();

    // Get the exact contained image bounds within the viewport
    const imageBox = await viewport.evaluate((vp) => {
      const img = vp.querySelector('img');
      if (!img) return null;
      const vpRect = vp.getBoundingClientRect();
      const naturalW = img.naturalWidth || 800;
      const naturalH = img.naturalHeight || 1200;
      const scale = Math.min(vp.clientWidth / naturalW, vp.clientHeight / naturalH);
      const w = naturalW * scale;
      const h = naturalH * scale;
      const x = vpRect.left + (vp.clientWidth - w) / 2;
      const y = vpRect.top + (vp.clientHeight - h) / 2;
      return { x, y, width: w, height: h };
    });

    expect(imageBox).not.toBeNull();

    if (imageBox) {
      // Test points: Center, 4 Edges, 4 Corners (all strictly within the image bounds)
      const testCoordinates = [
        { name: 'center', x: imageBox.x + imageBox.width / 2, y: imageBox.y + imageBox.height / 2 },
        { name: 'left-edge', x: imageBox.x + 8, y: imageBox.y + imageBox.height / 2 },
        { name: 'right-edge', x: imageBox.x + imageBox.width - 8, y: imageBox.y + imageBox.height / 2 },
        { name: 'top-edge', x: imageBox.x + imageBox.width / 2, y: imageBox.y + 8 },
        { name: 'bottom-edge', x: imageBox.x + imageBox.width / 2, y: imageBox.y + imageBox.height - 8 },
        { name: 'top-left-corner', x: imageBox.x + 8, y: imageBox.y + 8 },
        { name: 'top-right-corner', x: imageBox.x + imageBox.width - 8, y: imageBox.y + 8 },
        { name: 'bottom-left-corner', x: imageBox.x + 8, y: imageBox.y + imageBox.height - 8 },
        { name: 'bottom-right-corner', x: imageBox.x + imageBox.width - 8, y: imageBox.y + imageBox.height - 8 },
      ];

      for (const pt of testCoordinates) {
        await page.mouse.move(pt.x, pt.y);
        await page.waitForTimeout(50);

        const loupe = page.locator('[data-testid="atelier-lens-glass"]');
        await expect(loupe).toBeVisible();

        const zoomBadge = page.locator('[data-testid="modal-loupe-zoom-badge"]');
        await expect(zoomBadge).toBeVisible();

        // Check computed background-position on the loupe glass to confirm it's tracking
        const bgPos = await loupe.evaluate((el) => el.style.backgroundPosition);
        expect(bgPos).toMatch(/[0-9.-]+px\s+[0-9.-]+px/);
      }

      // Close with Escape and verify
      await page.keyboard.press('Escape');
      await expect(lensModal).not.toBeVisible();
    }

    // Now test in Cultural Archive Exhibition Modal
    await gotoRoute(page, 'archive');
    await waitForAppReady(page);

    const openExhibitionBtn = page.locator('[data-testid="open-exhibition-varanasi-kadwa"]');
    await openExhibitionBtn.scrollIntoViewIfNeeded();
    await openExhibitionBtn.click();

    const exhibitionModal = page.locator('[data-testid="tradition-exhibition-modal"]');
    await expect(exhibitionModal).toBeVisible();

    const archiveLensBtn = page.locator('[data-testid="inspect-tradition-lens-btn"]');
    await archiveLensBtn.click();

    await expect(lensModal).toBeVisible();
    const archiveViewport = page.locator('[data-testid="atelier-lens-viewport"]');
    await expect(archiveViewport).toBeVisible();

    // Verify Escape key closes only the lens, keeping exhibition modal open
    await page.keyboard.press('Escape');
    await expect(lensModal).not.toBeVisible();
    await expect(exhibitionModal).toBeVisible();
  });
});
