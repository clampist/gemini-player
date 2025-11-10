import { test } from '@playwright/test';
import { GeminiChatPage } from './pages/GeminiChatPage';
import { GeminiSearchPage } from './pages/GeminiSearchPage';
import { GeminiSettingsPage } from './pages/GeminiSettingsPage';

test.describe('Smoke Tests', () => {
  test('Critical path: Homepage loads and basic chat works', async ({ page }) => {
    const chatPage = new GeminiChatPage(page, test.info());

    await test.step('Verify homepage loads', async () => {
      await chatPage.open();
    });

    await test.step('Verify chat accepts input and responds', async () => {
      await chatPage.submitPrompt('Hello');
      await chatPage.expectResponseAt(0);
    });
  });

  test('Search page is accessible', async ({ page }) => {
    const searchPage = new GeminiSearchPage(page, test.info());

    await test.step('Verify search page loads', async () => {
      await searchPage.open();
      await searchPage.expectEmptyState();
    });
  });

  test('Settings can be opened', async ({ page }) => {
    const settingsPage = new GeminiSettingsPage(page, test.info());

    await test.step('Verify settings panel opens', async () => {
      await settingsPage.openWithLocale();
      await settingsPage.openSettingsPanel();
    });
  });
});

