import { test, expect } from '@playwright/test';
import { gotoRoute, waitForAppReady } from './helpers.ts';

test.describe('E2E-COMP-01: Thread Compass Determinism & Zero-TR Gate', () => {
  test('completes consultation flow deterministically, verifies reasons, back/restart, and zero TR', async ({ page }) => {
    test.setTimeout(60000);
    // 1. Navigate to /compass via helper
    await gotoRoute(page, 'compass');
    await waitForAppReady(page);

    // Assert on Step 1
    const step1 = page.locator('[data-testid="compass-step-1"]');
    await expect(step1).toBeVisible();

    // Select Fabric: Fine Merino & Wild Mulberry Blend (id: merino-wool)
    const merinoOpt = page.locator('[data-testid="option-fabric-merino-wool"]');
    await merinoOpt.click();
    await page.locator('[data-testid="step-continue-btn"]').click();

    // Step 2: Movement & Form (id: architectural)
    await expect(page.locator('[data-testid="compass-step-2"]')).toBeVisible();
    await page.locator('[data-testid="option-movement-architectural"]').click();
    await page.locator('[data-testid="step-continue-btn"]').click();

    // Step 3: Hands & Craft (id: saddle-stitch)
    await expect(page.locator('[data-testid="compass-step-3"]')).toBeVisible();
    await page.locator('[data-testid="option-craft-saddle-stitch"]').click();
    await page.locator('[data-testid="step-continue-btn"]').click();

    // Step 4: Story & Lineage (id: architecture)
    await expect(page.locator('[data-testid="compass-step-4"]')).toBeVisible();
    await page.locator('[data-testid="option-story-architecture"]').click();
    await page.locator('[data-testid="step-continue-btn"]').click();

    // Step 5: Curated Matches
    await expect(page.locator('[data-testid="compass-step-5"]')).toBeVisible();
    const recList = page.locator('[data-testid="recommendations-list"]');
    await expect(recList).toBeVisible();

    // Extract recommended product IDs
    const cards = page.locator('[data-testid^="recommendation-card-"]');
    const cardCount = await cards.count();
    expect(cardCount).toBeGreaterThan(0);

    const firstRunIds: string[] = [];
    for (let i = 0; i < cardCount; i++) {
      const testId = await cards.nth(i).getAttribute('data-testid');
      const prodId = testId?.replace('recommendation-card-', '');
      if (prodId) {
        firstRunIds.push(prodId);
        // STRICT O-8 / V3-07 ASSERTION: Zero Traditional (TR) garments in Compass
        expect(prodId.toUpperCase()).not.toContain('TR-');
        expect(prodId.toUpperCase()).toContain('ET-');
      }
    }

    // Verify Match Reasons are visible
    const matchReasons = page.locator('[data-testid^="match-reasons-"]').first();
    await expect(matchReasons).toBeVisible();

    // Test Back via Stepper Navigation Pill to Step 4
    const pill4 = page.locator('[data-testid="stepper-pill-4"]');
    await pill4.click();
    await expect(page.locator('[data-testid="compass-step-4"]')).toBeVisible();

    // Step back to Step 3 via step-back-btn
    const stepBackBtn = page.locator('[data-testid="step-back-btn"]');
    await stepBackBtn.click();
    await expect(page.locator('[data-testid="compass-step-3"]')).toBeVisible();

    // Navigate forward back to results
    await page.locator('[data-testid="step-continue-btn"]').click();
    await page.locator('[data-testid="step-continue-btn"]').click();
    await expect(page.locator('[data-testid="compass-step-5"]')).toBeVisible();

    // Test Adjust Inquiries button (returns to Step 1)
    const tweakBtn = page.locator('[data-testid="results-tweak-btn"]');
    await tweakBtn.click();
    await expect(page.locator('[data-testid="compass-step-1"]')).toBeVisible();

    // DETERMINISM CHECK: Repeat identical selections
    await page.locator('[data-testid="option-fabric-merino-wool"]').click();
    await page.locator('[data-testid="step-continue-btn"]').click();

    await page.locator('[data-testid="option-movement-architectural"]').click();
    await page.locator('[data-testid="step-continue-btn"]').click();

    await page.locator('[data-testid="option-craft-saddle-stitch"]').click();
    await page.locator('[data-testid="step-continue-btn"]').click();

    await page.locator('[data-testid="option-story-architecture"]').click();
    await page.locator('[data-testid="step-continue-btn"]').click();

    await expect(page.locator('[data-testid="compass-step-5"]')).toBeVisible();
    const secondRunCards = page.locator('[data-testid^="recommendation-card-"]');
    const secondCardCount = await secondRunCards.count();
    expect(secondCardCount).toBe(firstRunIds.length);

    for (let i = 0; i < secondCardCount; i++) {
      const testId = await secondRunCards.nth(i).getAttribute('data-testid');
      const prodId = testId?.replace('recommendation-card-', '');
      expect(prodId).toBe(firstRunIds[i]);
    }

    // DIFFERENT INPUTS CHECK: Restart and select completely different criteria
    await page.locator('[data-testid="results-reset-btn"]').click();
    await expect(page.locator('[data-testid="compass-step-1"]')).toBeVisible();

    await page.locator('[data-testid="option-fabric-pashmina"]').click();
    await page.locator('[data-testid="step-continue-btn"]').click();

    await page.locator('[data-testid="option-movement-fluid"]').click();
    await page.locator('[data-testid="step-continue-btn"]').click();

    await page.locator('[data-testid="option-craft-diamond-twill"]').click();
    await page.locator('[data-testid="step-continue-btn"]').click();

    await page.locator('[data-testid="option-story-drape"]').click();
    await page.locator('[data-testid="step-continue-btn"]').click();

    await expect(page.locator('[data-testid="compass-step-5"]')).toBeVisible();
    const altCards = page.locator('[data-testid^="recommendation-card-"]');
    const altFirstId = (await altCards.first().getAttribute('data-testid'))?.replace('recommendation-card-', '');
    expect(altFirstId).toBe('et-07');
    expect(altFirstId).not.toBe(firstRunIds[0]);
  });
});
