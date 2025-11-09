import { test, expect } from '@playwright/test';
import { selectors } from './data/selectors';
import { expectResponseContains, submitChatPrompt } from './support/chat';
import { captureScreenshot } from './support/artifacts';
import { logMessage } from './support/logger';

const SCRIPT_QUERY = "<script>alert('Hello AI')</script>";

test.describe('Gemini search handling without login', () => {
  test('Handle script-like input safely, then search for "AI"', async ({ page }) => {
    await test.step('Open homepage', async () => {
      await page.goto('/');
      await expect(page).toHaveTitle(/gemini/i);
    });

    await test.step('Submit script-like input', async () => {
      await submitChatPrompt(page, SCRIPT_QUERY, test.info());
      await logMessage(test.info(), 'Submitted script-like prompt');
    });

    await test.step('Validate script-like response', async () => {
      await expectResponseContains(page, { index: 0, matcher: /script/i }, { testInfo: test.info() });
      await captureScreenshot(test.info(), page, 'search-1-initial-response');
    });

    await test.step('Start new chat flow', async () => {
      let newChatButton = page.locator(selectors.chat.newChatButton).first();
      if (!(await newChatButton.count())) {
        newChatButton = page
          .getByRole('button', { name: selectors.chat.newChatFallbackRole })
          .filter({ hasNot: page.locator('[disabled]') })
          .first();
      }

      await expect(newChatButton, 'new chat trigger should exist').toBeVisible({
        timeout: 10_000
      });
      await expect(newChatButton).toBeEnabled({ timeout: 10_000 });
      await newChatButton.click();

      const confirmButton = page.locator(selectors.chat.confirmNewChatButton).first();
      await expect(confirmButton).toBeVisible({ timeout: 10_000 });
      await expect(confirmButton).toBeEnabled({ timeout: 10_000 });
      await confirmButton.click();
      await logMessage(test.info(), 'Confirmed new chat creation');
    });

    await test.step('Submit script input in new chat', async () => {
      await submitChatPrompt(page, SCRIPT_QUERY, test.info());
    });

    await test.step('Validate script response in new chat', async () => {
      await expectResponseContains(page, { index: 0, matcher: /script/i }, { testInfo: test.info() });
      await captureScreenshot(test.info(), page, 'search-2-newchat-response');
    });

    await test.step('Visit search page for empty state', async () => {
      await page.goto('/search');
      const emptyState = page.locator('text=No recent threads.');
      await expect(emptyState).toBeVisible({ timeout: 10_000 });
      await logMessage(test.info(), 'Confirmed empty state on search page');
    });

    await test.step('Search page shows pending state for AI query', async () => {
      const searchInput = page.locator(selectors.search.input);
      await expect(searchInput).toBeVisible({ timeout: 10_000 });
      await searchInput.fill('AI');

      const progressBar = page.locator(selectors.search.progressBar);
      await expect(progressBar).toBeVisible({ timeout: 5_000 });

      const emptyState = page.locator('text=No recent threads.');
      await expect(emptyState).toBeVisible({ timeout: 10_000 });

      await captureScreenshot(test.info(), page, 'search-3-progress-bar');
      await logMessage(test.info(), 'Captured search progress indicator');
    });
  });
});

