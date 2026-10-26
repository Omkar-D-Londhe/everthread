import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';
import { gotoRoute, waitForAppReady } from './helpers.ts';

const ARTIFACT_DIR = 'C:/Users/omkar/.gemini/antigravity/brain/14fb5151-8883-4aaa-a2ee-64cbb5bf5ce9';
const EVIDENCE_DIR = 'docs/implementation/evidence/STAGE-08';

test.describe('Stage 08 Evidence Capture', () => {

  test.beforeAll(() => {
    if (!fs.existsSync(EVIDENCE_DIR)) {
      fs.mkdirSync(EVIDENCE_DIR, { recursive: true });
    }
  });

  test('01 & 02: Desktop Scene Folds H1, H2 (Thread Crossing) & H3', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await gotoRoute(page, '/');
    await waitForAppReady(page);

    // H1
    const foldH1 = page.locator('[data-scene-fold="H1"]');
    await foldH1.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);

    const dest1 = path.join(EVIDENCE_DIR, '01_desktop_fold_h1_highlights.png');
    const dest1Art = path.join(ARTIFACT_DIR, '01_desktop_fold_h1_highlights.png');
    await page.screenshot({ path: dest1 });
    await page.screenshot({ path: dest1Art });

    // H2 with crossing thread
    const foldH2 = page.locator('[data-scene-fold="H2"]');
    await foldH2.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);

    const dest2 = path.join(EVIDENCE_DIR, '02_desktop_fold_h2_walls_crossing_thread.png');
    const dest2Art = path.join(ARTIFACT_DIR, '02_desktop_fold_h2_walls_crossing_thread.png');
    await page.screenshot({ path: dest2 });
    await page.screenshot({ path: dest2Art });

    // H3
    const foldH3 = page.locator('[data-scene-fold="H3"]');
    await foldH3.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);

    const dest3 = path.join(EVIDENCE_DIR, '03_desktop_fold_h3_making.png');
    const dest3Art = path.join(ARTIFACT_DIR, '03_desktop_fold_h3_making.png');
    await page.screenshot({ path: dest3 });
    await page.screenshot({ path: dest3Art });
  });

  test('04: Archive A2 & Curve Thread Hand-off', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await gotoRoute(page, '/archive');
    await waitForAppReady(page);

    const curveThread = page.locator('[data-testid="strand-thread-curve"]');
    await curveThread.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);

    const dest4 = path.join(EVIDENCE_DIR, '04_desktop_archive_fold_a2_thread_curve.png');
    const dest4Art = path.join(ARTIFACT_DIR, '04_desktop_archive_fold_a2_thread_curve.png');
    await page.screenshot({ path: dest4 });
    await page.screenshot({ path: dest4Art });
  });

  test('05: Exhibition 5-Step Choreography Opening', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await gotoRoute(page, '/archive');
    await waitForAppReady(page);

    await page.locator('#weave-library').scrollIntoViewIfNeeded();
    const openBtn = page.locator('[data-testid^="open-exhibition-"]').first();
    await openBtn.scrollIntoViewIfNeeded();
    await openBtn.click();

    const modal = page.locator('[data-testid="tradition-exhibition-modal"]');
    await expect(modal).toBeVisible();
    await page.waitForTimeout(1300); // Wait for full 1.2s opening choreography to settle

    const dest5 = path.join(EVIDENCE_DIR, '05_desktop_exhibition_5step_opening.png');
    const dest5Art = path.join(ARTIFACT_DIR, '05_desktop_exhibition_5step_opening.png');
    await page.screenshot({ path: dest5 });
    await page.screenshot({ path: dest5Art });
  });

  test('06: Mobile 390px Fold & Content Settled State', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await gotoRoute(page, '/');
    await waitForAppReady(page);

    const foldH1 = page.locator('[data-scene-fold="H1"]');
    await foldH1.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);

    const dest6 = path.join(EVIDENCE_DIR, '06_mobile_390px_fold_settled.png');
    const dest6Art = path.join(ARTIFACT_DIR, '06_mobile_390px_fold_settled.png');
    await page.screenshot({ path: dest6 });
    await page.screenshot({ path: dest6Art });
  });

  test('07: Reduced Motion Settled State', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 1440, height: 900 });
    await gotoRoute(page, '/');
    await waitForAppReady(page);

    const foldH2 = page.locator('[data-scene-fold="H2"]');
    await foldH2.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);

    const dest7 = path.join(EVIDENCE_DIR, '07_reduced_motion_settled_state.png');
    const dest7Art = path.join(ARTIFACT_DIR, '07_reduced_motion_settled_state.png');
    await page.screenshot({ path: dest7 });
    await page.screenshot({ path: dest7Art });
  });
});
