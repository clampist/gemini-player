import { test, expect } from '@playwright/test';
import { selectors } from './data/selectors';
import { captureScreenshot } from './support/artifacts';
import { logMessage } from './support/logger';

test.describe('Gemini settings switching', () => {
  test('Renders Japanese locale and switches back to English', async ({ page }) => {
    await test.step('Open Japanese locale', async () => {
      await page.goto('/?hl=ja');
      
      await expect(page.locator('html')).toHaveAttribute('lang', /ja/i);
      await logMessage(test.info(), 'Opened homepage with hl=ja');

      await captureScreenshot(test.info(), page, 'settings-1-locale-ja');
    });

    await test.step('Switch back to English locale', async () => {
      await page.goto('/');
      
      await expect(page.locator('html')).toHaveAttribute('lang', /en/i);
      await logMessage(test.info(), 'Navigated back to default locale');

      await captureScreenshot(test.info(), page, 'settings-2-locale-en');
    });
  });

  test('Switch theme to Dark back to Light', async ({ page }) => {
    
    await test.step('Open settings panel', async () => {
      await page.goto('/');
      const settingsButton = page.locator(selectors.settings.panelTrigger).first();
      await expect(settingsButton).toBeVisible({ timeout: 10_000 });
      await settingsButton.click();
      await logMessage(test.info(), 'Opened settings panel');
    });

    await test.step('Switch theme to Dark', async () => {
      const themeButton = page.locator(selectors.settings.themeMenuTrigger).first();
      await expect(themeButton).toBeVisible({ timeout: 5_000 });
      await themeButton.click();

      const darkOption = page
        .getByRole('menuitem', selectors.settings.menuItem(/\bdark\b/i))
        .first();
      await expect(darkOption).toBeVisible({ timeout: 5_000 });
      await darkOption.click();
      await logMessage(test.info(), 'Selected dark theme');

      await expect
        .poll(async () =>
          page.evaluate(() => document.body?.className ?? '')
        )
        .toContain('dark-theme');

      await captureScreenshot(test.info(), page, 'settings-3-theme-dark');
    });

    await test.step('Switch theme to Light', async () => {
      const themeButton = page.locator(selectors.settings.themeMenuTrigger).first();
      await expect(themeButton).toBeVisible({ timeout: 5_000 });
      await themeButton.click();

      const lightOption = page
        .getByRole('menuitem', selectors.settings.menuItem(/\blight\b/i))
        .first();
      await expect(lightOption).toBeVisible({ timeout: 5_000 });
      await lightOption.click();
      await logMessage(test.info(), 'Selected light theme');

      await expect
        .poll(async () =>
          page.evaluate(() => document.body?.className ?? '')
        )
        .toContain('light-theme');

      await captureScreenshot(test.info(), page, 'settings-4-theme-light');
    });
  });
});

