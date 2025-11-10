import { test, expect } from '@playwright/test';
import { GeminiChatPage } from './pages/GeminiChatPage';
import { getBaseOrigin } from './support/utils';
import { attachText } from './support/artifacts';

const SEARCH_QUERY = 'Nvidia Blackwell chip demand surge';

test.describe('Chat with Gemini without login', () => {
  test.beforeEach(async ({ context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write'], {
      origin: getBaseOrigin()
    });
  });

  test('Ask Gemini in English and Japanese, then redo and copy', async ({ page }) => {
    const chatPage = new GeminiChatPage(page, test.info());

    await test.step('Open Gemini chat', async () => {
      await chatPage.open();
    });

    await test.step('Submit search request', async () => {
      await chatPage.submitPrompt(SEARCH_QUERY);
    });

    await test.step('Confirm search response', async () => {
      await chatPage.expectResponseAt(0, /Nvidia[\s\S]*Blackwell/i);
      await chatPage.takeScreenshot('chat-1-primary-response');
    });

    await test.step('Submit search request in Japanese', async () => {
      await chatPage.submitPrompt('Please answer me in Japanese');
    });

    await test.step('Confirm search response in Japanese', async () => {
      await chatPage.expectResponseAt(1, undefined, { 
        timeout: 20_000, 
        expectJapanese: true 
      });
      await chatPage.takeScreenshot('chat-2-japanese-response');
    });

    await test.step('Redo latest Japanese response', async () => {
      await chatPage.redoLatestResponse();
      await chatPage.takeScreenshot('chat-3-redo-response');
    });

    await test.step('Copy redo response', async () => {
      const copiedText = await chatPage.copyLatestResponse();
      expect(copiedText).toMatch(/Blackwell/i);
      await attachText(test.info(), 'chat-copied-text', copiedText);
    });
  });
});

