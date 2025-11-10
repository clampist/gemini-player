import { test } from '@playwright/test';
import { GeminiSettingsPage } from './pages/GeminiSettingsPage';
import { Locales, Themes, SettingsScreenshots } from './data/testData';

test.describe('Gemini settings switching', () => {
  test('Renders Japanese locale and switches back to English', async ({ page }) => {
    const settingsPage = new GeminiSettingsPage(page, test.info());

    await test.step('Open Japanese locale', async () => {
      await settingsPage.openWithLocale(Locales.japanese);
      await settingsPage.expectLocale(Locales.japanese);
      await settingsPage.takeScreenshot(SettingsScreenshots.localeJapanese);
    });

    await test.step('Switch back to English locale', async () => {
      await settingsPage.openWithLocale();
      await settingsPage.expectLocale(Locales.english);
      await settingsPage.takeScreenshot(SettingsScreenshots.localeEnglish);
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
      await settingsPage.switchTheme(Themes.dark);
      await settingsPage.expectTheme(Themes.dark);
      await settingsPage.takeScreenshot(SettingsScreenshots.themeDark);
    });

    await test.step('Switch theme to Light', async () => {
      await settingsPage.switchTheme(Themes.light);
      await settingsPage.expectTheme(Themes.light);
      await settingsPage.takeScreenshot(SettingsScreenshots.themeLight);
    });
  });
});

