import { test } from '@playwright/test';
import { GeminiSettingsPage } from './pages/GeminiSettingsPage';

test.describe('Gemini settings switching', () => {
  test('Renders Japanese locale and switches back to English', async ({ page }) => {
    const settingsPage = new GeminiSettingsPage(page, test.info());

    await test.step('Open Japanese locale', async () => {
      await settingsPage.openWithLocale('ja');
      await settingsPage.expectLocale('ja');
      await settingsPage.takeScreenshot('settings-1-locale-ja');
    });

    await test.step('Switch back to English locale', async () => {
      await settingsPage.openWithLocale();
      await settingsPage.expectLocale('en');
      await settingsPage.takeScreenshot('settings-2-locale-en');
    });
  });

  test('Switch theme to Dark back to Light', async ({ page }) => {
    const settingsPage = new GeminiSettingsPage(page, test.info());

    await test.step('Open homepage', async () => {
      await settingsPage.openWithLocale();
    });

    await test.step('Open settings panel', async () => {
      await settingsPage.openSettingsPanel();
    });

    await test.step('Switch theme to Dark', async () => {
      await settingsPage.switchTheme('dark');
      await settingsPage.expectTheme('dark');
      await settingsPage.takeScreenshot('settings-3-theme-dark');
    });

    await test.step('Switch theme to Light', async () => {
      await settingsPage.switchTheme('light');
      await settingsPage.expectTheme('light');
      await settingsPage.takeScreenshot('settings-4-theme-light');
    });
  });
});

