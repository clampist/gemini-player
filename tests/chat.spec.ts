import { test, expect } from '@playwright/test';
import { selectors } from './data/selectors';
import {
  expectResponseContains,
  getResponseList,
  submitChatPrompt,
  waitForStreamingToFinish,
  waitForStreamingToStart
} from './support/chat';
import { getBaseOrigin } from './support/utils';
import { attachText, captureScreenshot } from './support/artifacts';
import { logMessage } from './support/logger';

const SEARCH_QUERY = 'Nvidia Blackwell chip demand surge';

test.describe('Chat with Gemini without login', () => {
  test.beforeEach(async ({ context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write'], {
      origin: getBaseOrigin()
    });
  });

  test('Ask Gemini in English and Japanese, then redo and copy', async ({ page }) => {
    await test.step('Open Gemini chat', async () => {
      await page.goto('/');
      await expect(page).toHaveTitle(/gemini/i);
      await expect(page.locator('body')).toBeVisible();
    });

    await test.step('Submit search request', async () => {
      await submitChatPrompt(page, SEARCH_QUERY, test.info());
    });

    await test.step('Confirm search response', async () => {
      const firstResponseIndex = 0;
      await expectResponseContains(
        page,
        { index: firstResponseIndex, matcher: /Nvidia[\s\S]*Blackwell/i },
        { testInfo: test.info() }
      );

      await captureScreenshot(test.info(), page, 'chat-1-primary-response');
    });

    await test.step('Submit search request in Japanese', async () => {
      const searchPreference = 'Please answer me in Japanese';
      await submitChatPrompt(page, searchPreference, test.info());
    });

    await test.step('Confirm search response in Japanese', async () => {
      const secondResponseIndex = 1;
      await expectResponseContains(
        page,
        { index: secondResponseIndex, expectJapanese: true },
        { timeout: 20_000, testInfo: test.info() }
      );
  
        await captureScreenshot(test.info(), page, 'chat-2-japanese-response');
    });

    await test.step('Redo latest Japanese response', async () => {
      const responseList = getResponseList(page);
      const responseRegion = responseList.last();
      await expect(responseRegion).toBeVisible({ timeout: 10_000 });

      const redoButton = responseRegion.locator(selectors.chat.redoButton).first();

      await redoButton.waitFor({ state: 'visible', timeout: 5_000 }).catch(() => undefined);
      await expect(redoButton).toBeEnabled({ timeout: 5_000 });
      await redoButton.click();

      await waitForStreamingToStart(page, test.info());
      await waitForStreamingToFinish(page, test.info());

      await expect(responseList.last()).toBeVisible({ timeout: 20_000 });

      await captureScreenshot(test.info(), page, 'chat-3-redo-response');
    });

    await test.step('Copy redo response', async () => {
      const responseRegion = getResponseList(page).last();
      await expect(responseRegion).toBeVisible({ timeout: 5_000 });

      const copyButton = responseRegion.locator(selectors.chat.copyButton).first();
      await expect(copyButton).toBeVisible({ timeout: 5_000 });
      await expect(copyButton).toBeEnabled({ timeout: 5_000 });

      await copyButton.click();

      const copiedText = await page.evaluate(async () => {
        return navigator.clipboard.readText();
      });
      expect(copiedText).toMatch(/Blackwell/i);

      await attachText(test.info(), 'chat-copied-text', copiedText);
      await logMessage(test.info(), 'Copied redo response to clipboard');
    });

  });
});
