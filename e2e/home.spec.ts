import { test, expect } from '@playwright/test';
import { gotoRoute, waitForAppReady } from './helpers.ts';

test.describe('EverThread Stage 06: Home Information Architecture & Editorial Scenes', () => {

  test.beforeEach(async ({ page }) => {
    await gotoRoute(page, '/');
    await waitForAppReady(page);
  });

  test('E2E-HOME-01: Verifies the 8 approved scenes render in exact chronological order with scene markers', async ({ page }) => {
    const expectedSceneIds = [
      'home-hero',
      'home-index',
      'home-compass',
      'home-craft',
      'home-walls',
      'home-making',
      'home-journal',
      'home-closing'
    ];

    // Fetch all elements with matching data-testids in document order
    const sceneElements = await page.locator(
      expectedSceneIds.map(id => `[data-testid="${id}"]`).join(', ')
    ).all();

    expect(sceneElements.length).toBe(8);

    for (let i = 0; i < expectedSceneIds.length; i++) {
      const testId = await sceneElements[i].getAttribute('data-testid');
      expect(testId).toBe(expectedSceneIds[i]);
    }

    // Verify Stage 8 structural scene markers
    await expect(page.locator('[data-testid="home-index"]')).toHaveAttribute('data-scene', 'H1');
    await expect(page.locator('[data-testid="home-walls"]')).toHaveAttribute('data-scene', 'H2');
    await expect(page.locator('[data-testid="home-making"]')).toHaveAttribute('data-scene', 'H3');
  });

  test('E2E-HOME-02: Hero ET-01 data binding, exact CTAs, and absence of unverified claims', async ({ page }) => {
    const hero = page.locator('[data-testid="home-hero"]');
    await expect(hero).toBeVisible();

    // Primary CTA
    const primaryCta = page.locator('[data-testid="hero-primary-cta"]');
    await expect(primaryCta).toHaveAttribute('href', /(?:\/everthread)?\/collections/);
    await expect(primaryCta).toContainText('Explore the collection');

    // Secondary CTA: exactly "Enter the Archive", linking /archive (no "Discover the stories")
    const secondaryCta = page.locator('[data-testid="hero-secondary-cta"]');
    await expect(secondaryCta).toHaveAttribute('href', /(?:\/everthread)?\/archive/);
    await expect(secondaryCta).toHaveText('Enter the Archive');

    // Hero archival metadata bound to ET-01
    const metadata = page.locator('[data-testid="hero-metadata"]');
    await expect(metadata).toBeVisible();
    await expect(metadata).toContainText('MATERIAL');
    await expect(metadata).toContainText('70% Fine Merino Wool, 30% Wild Mulberry Silk');
    await expect(metadata).toContainText('CONSTRUCTION');
    await expect(metadata).toContainText('Pit-Loomed 2/2 Twill with Kadwa Facing');
    await expect(metadata).toContainText('PIECE');
    await expect(metadata).toContainText('Outerwear');

    // Forbidden / unverified claims in Hero
    await expect(metadata).not.toContainText('EDITION');
    await expect(metadata).not.toContainText('Numbered');
    await expect(metadata).not.toContainText('100% Unblended');

    // Loupe badge text checks
    const badge = page.locator('[data-testid="atelier-lens-badge-trigger"]');
    await expect(badge).toBeVisible();
    await expect(badge).toContainText('70% Fine Merino Wool');
    await expect(badge).not.toContainText('Cashmere');
  });

  test('E2E-HOME-03: Headings hierarchy and exactly one h2 containing "Thread Compass"', async ({ page }) => {
    // Exactly one h1 on page
    const h1s = page.locator('h1');
    await expect(h1s).toHaveCount(1);
    await expect(h1s).toContainText(/An heirloom,\s*not a trend\./);

    // Exactly one h2 containing "Thread Compass"
    const compassH2s = page.locator('h2', { hasText: 'Thread Compass' });
    await expect(compassH2s).toHaveCount(1);
    await expect(page.locator('[data-testid="home-compass"] h2')).toContainText('The Thread Compass');

    // Chapter index cards must use h3 headings, not h2
    const indexSection = page.locator('[data-testid="home-index"]');
    await expect(indexSection.locator('h3', { hasText: 'Thread Compass' })).toHaveCount(1);
    await expect(indexSection.locator('h2')).toHaveCount(0);
  });

  test('E2E-HOME-04: Craft scene Living Loom and three diagram thumbnails linking to /archive', async ({ page }) => {
    const craft = page.locator('[data-testid="home-craft"]');
    await expect(craft).toBeVisible();
    await expect(craft.locator('h2')).toContainText('The Living Loom');

    // 3 technical diagram thumbnails
    const thumbWarpWeft = page.locator('[data-testid="diagram-thumb-warp-weft"]');
    const thumbVocab = page.locator('[data-testid="diagram-thumb-vocab"]');
    const thumbTechnique = page.locator('[data-testid="diagram-thumb-technique"]');

    await expect(thumbWarpWeft).toBeVisible();
    await expect(thumbWarpWeft).toHaveAttribute('href', /(?:\/everthread)?\/archive/);
    await expect(thumbWarpWeft.locator('img')).toHaveAttribute('src', /library-warp-weft-diagram-01\.svg/);

    await expect(thumbVocab).toBeVisible();
    await expect(thumbVocab).toHaveAttribute('href', /(?:\/everthread)?\/archive/);
    await expect(thumbVocab.locator('img')).toHaveAttribute('src', /library-textile-vocabulary-01\.svg/);

    await expect(thumbTechnique).toBeVisible();
    await expect(thumbTechnique).toHaveAttribute('href', /(?:\/everthread)?\/archive/);
    await expect(thumbTechnique.locator('img')).toHaveAttribute('src', /library-technique-comparison-01\.svg/);
  });

  test('E2E-HOME-05: WallsPreview component with approved door assets and collection links', async ({ page }) => {
    const walls = page.locator('[data-testid="home-walls"]');
    await expect(walls).toBeVisible();

    const doorContemporary = page.locator('[data-testid="wall-door-contemporary"]');
    await expect(doorContemporary).toBeVisible();
    await expect(doorContemporary).toHaveAttribute('href', /(?:\/everthread)?\/collections/);
    await expect(doorContemporary.locator('img')).toHaveAttribute('src', /contemporary-collection-plate\.webp/);

    const doorLiving = page.locator('[data-testid="wall-door-living-inheritance"]');
    await expect(doorLiving).toBeVisible();
    await expect(doorLiving).toHaveAttribute('href', /(?:\/everthread)?\/collections\/the-living-inheritance/);
    await expect(doorLiving.locator('img')).toHaveAttribute('src', /living-inheritance-campaign-r1\.webp/);
  });

  test('E2E-HOME-06: The Making & The Promise composite scene with claim-free narrative spine and brand lines', async ({ page }) => {
    const makingSection = page.locator('[data-testid="home-making"]');
    await expect(makingSection).toBeVisible();

    // Narrative Spine links
    const spineThread = page.locator('[data-testid="spine-step-thread"]');
    const spineTextile = page.locator('[data-testid="spine-step-textile"]');
    const spineCraft = page.locator('[data-testid="spine-step-craft"]');
    const spineGarment = page.locator('[data-testid="spine-step-garment"]');
    const spineStory = page.locator('[data-testid="spine-step-story"]');

    await expect(spineThread).toHaveAttribute('href', /(?:\/everthread)?\/compass/);
    await expect(spineTextile).toHaveAttribute('href', /(?:\/everthread)?\/archive/);
    await expect(spineCraft).toHaveAttribute('href', /(?:\/everthread)?\/archive/);
    await expect(spineGarment).toHaveAttribute('href', /(?:\/everthread)?\/collections/);
    await expect(spineStory).toHaveAttribute('href', /(?:\/everthread)?\/journal/);

    // Verbatim Brand Promise lines
    await expect(page.locator('[data-testid="promise-line-1"]')).toContainText('An heirloom, not a trend.');
    await expect(page.locator('[data-testid="promise-line-2"]')).toContainText('Every thread carries a story.');
    await expect(page.locator('[data-testid="promise-line-3"]')).toContainText('One thread. A world of stories.');

    // Complete absence of the six removed unverified claim headings
    const fullBody = await page.textContent('body');
    expect(fullBody).not.toContain('Pit-Loomed Humidity');
    expect(fullBody).not.toContain('Floating Canvases');
    expect(fullBody).not.toContain('Honoring Artisan Lineage');
    expect(fullBody).not.toContain('Uncut Botanical Purity');
    expect(fullBody).not.toContain('Generational Inlay Margins');
    expect(fullBody).not.toContain('Documented Provenance');
  });

  test('E2E-HOME-07: Home closing scene with deliberate departure links', async ({ page }) => {
    const closing = page.locator('[data-testid="home-closing"]');
    await expect(closing).toBeVisible();
    await expect(closing).toContainText('One thread. A world of stories.');

    const archiveCta = page.locator('[data-testid="home-closing-archive-cta"]');
    await expect(archiveCta).toHaveAttribute('href', /(?:\/everthread)?\/archive/);
    await expect(archiveCta).toContainText('Enter the Archive');

    const collectionsCta = page.locator('[data-testid="home-closing-collections-cta"]');
    await expect(collectionsCta).toHaveAttribute('href', /(?:\/everthread)?\/collections/);
    await expect(collectionsCta).toContainText('Explore the collections');
  });

  test('E2E-RESP-01: Zero horizontal layout overflow at 390px mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.evaluate(() => window.scrollTo(0, 0));

    // Evaluate scroll width vs client width across document
    const isOverflowing = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });

    expect(isOverflowing).toBe(false);
  });
});
