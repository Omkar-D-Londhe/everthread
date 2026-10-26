import { Page, expect } from '@playwright/test';

/**
 * Wait for the EverThread initial loader to complete and the app content to become interactive.
 */
export async function waitForAppReady(page: Page) {
  // Wait for loader container to detach or become hidden
  const loader = page.locator('.atelier-thread-loader, [data-testid="thread-loader"], .thread-loader-root');
  if (await loader.count() > 0) {
    await loader.waitFor({ state: 'hidden', timeout: 6000 }).catch(() => {});
  }
  // Ensure atelier site header is visible
  await expect(page.locator('.atelier-header')).toBeVisible({ timeout: 6000 });
}

/**
 * Navigate to a route and wait for the app to settle.
 */
export async function gotoRoute(page: Page, path: string) {
  const url = path.startsWith('/') ? path.slice(1) : path;
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await waitForAppReady(page);
}
