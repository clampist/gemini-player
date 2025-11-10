import { test, expect } from '@playwright/test';
import { GeminiChatPage } from './pages/GeminiChatPage';
import { getBaseOrigin } from './support/utils';
import { attachText } from './support/artifacts';
import {
  ChatPrompts,
  ChatResponsePatterns,
  ChatTimeouts,
  ChatScreenshots,
  ChatArtifacts
} from './data/testData';

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
      await chatPage.submitPrompt(ChatPrompts.nvidia);
    });

    await test.step('Confirm search response', async () => {
      await chatPage.expectResponseAt(0, ChatResponsePatterns.nvidia);
      await chatPage.takeScreenshot(ChatScreenshots.primaryResponse);
    });

    await test.step('Submit search request in Japanese', async () => {
      await chatPage.submitPrompt(ChatPrompts.japaneseRequest);
    });

    await test.step('Confirm search response in Japanese', async () => {
      await chatPage.expectResponseAt(1, undefined, { 
        timeout: ChatTimeouts.japaneseResponse, 
        expectJapanese: true 
      });
      await chatPage.takeScreenshot(ChatScreenshots.japaneseResponse);
    });

    await test.step('Redo latest Japanese response', async () => {
      await chatPage.redoLatestResponse();
      await chatPage.takeScreenshot(ChatScreenshots.redoResponse);
    });

    await test.step('Copy redo response', async () => {
      const copiedText = await chatPage.copyLatestResponse();
      expect(copiedText).toMatch(ChatResponsePatterns.blackwell);
      await attachText(test.info(), ChatArtifacts.copiedText, copiedText);
    });
  });
});

