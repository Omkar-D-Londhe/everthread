import { test, expect } from '@playwright/test';
import path from 'path';

const ARTIFACT_DIR = 'C:/Users/omkar/.gemini/antigravity/brain/14fb5151-8883-4aaa-a2ee-64cbb5bf5ce9';
const EVIDENCE_DIR = 'docs/implementation/evidence/STAGE-06';

test.describe('Stage 06 Responsive Audit & Screenshot Capture', () => {

  test('Desktop Hero Screenshot', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('http://127.0.0.1:4173/everthread/');
    await page.waitForLoadState('networkidle');

    const hero = page.locator('[data-testid="home-hero"]');
    await expect(hero).toBeVisible();

    // Settle motion for crisp screenshot
    await page.evaluate(() => {
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(500);

    const dest1 = path.join(ARTIFACT_DIR, 'updated_stage06_01_desktop_home_hero.png');
    const dest2 = path.join(EVIDENCE_DIR, 'updated_stage06_01_desktop_home_hero.png');
    await hero.screenshot({ path: dest1 });
    await hero.screenshot({ path: dest2 });
  });

  test('Mobile Scenes Inspection and Scaled Screenshots at 390px', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('http://127.0.0.1:4173/everthread/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    // 1. Thread canvas positioning check: must not intersect copy
    const metaBox = await page.locator('[data-testid="hero-metadata"]').boundingBox();
    const canvasContainerBox = await page.locator('.hero-thread-canvas-container').boundingBox();

    expect(metaBox).not.toBeNull();
    expect(canvasContainerBox).not.toBeNull();

    if (metaBox && canvasContainerBox) {
      console.log('Metadata bottom Y:', metaBox.y + metaBox.height);
      console.log('Thread Canvas Container top Y:', canvasContainerBox.y);
      // Canvas container top must be >= metadata bottom (or start at the visual plinth)
      expect(canvasContainerBox.y).toBeGreaterThanOrEqual(metaBox.y + metaBox.height - 20);
    }

    // 2. Horizontal overflow check
    const isOverflowing = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    expect(isOverflowing).toBe(false);

    // 3. Capture mobile hero
    const hero = page.locator('[data-testid="home-hero"]');
    await hero.screenshot({ path: path.join(ARTIFACT_DIR, 'updated_stage06_03_mobile_home_hero.png') });
    await hero.screenshot({ path: path.join(EVIDENCE_DIR, 'updated_stage06_03_mobile_home_hero.png') });
    await hero.screenshot({ path: path.join(ARTIFACT_DIR, 'mobile_01_scene_hero.png') });

    // 4. Capture individual scenes at 390px
    const scenes = [
      { id: 'home-index', name: 'mobile_02_scene_index.png' },
      { id: 'home-compass', name: 'mobile_03_scene_compass.png' },
      { id: 'home-craft', name: 'mobile_04_scene_craft.png' },
      { id: 'home-walls', name: 'mobile_05_scene_walls.png' },
      { id: 'home-making', name: 'mobile_06_scene_making.png' },
      { id: 'home-journal', name: 'mobile_07_scene_journal.png' },
      { id: 'home-closing', name: 'mobile_08_scene_closing.png' },
    ];

    for (const sc of scenes) {
      const loc = page.locator(`[data-testid="${sc.id}"]`);
      await expect(loc).toBeVisible();
      await loc.scrollIntoViewIfNeeded();
      await page.waitForTimeout(300);

      // Verify no horizontal overflow within each scene
      const sceneBox = await loc.boundingBox();
      expect(sceneBox).not.toBeNull();
      if (sceneBox) {
        expect(sceneBox.width).toBeLessThanOrEqual(390);
      }

      await loc.screenshot({ path: path.join(ARTIFACT_DIR, sc.name) });
      await loc.screenshot({ path: path.join(EVIDENCE_DIR, sc.name) });
    }
  });

});
