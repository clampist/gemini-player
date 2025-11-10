import { test } from '@playwright/test';
import { GeminiChatPage } from './pages/GeminiChatPage';
import { GeminiSearchPage } from './pages/GeminiSearchPage';

const SCRIPT_QUERY = "<script>alert('Hello AI')</script>";
const SCRIPT_QUERY_AGAIN = "<script>alert('Hello AI again')</script>";

test.describe('Gemini search handling without login (Page Object)', () => {
  test('Handle script-like input safely, then search for "AI"', async ({ page }) => {
    const chatPage = new GeminiChatPage(page, test.info());
    const searchPage = new GeminiSearchPage(page, test.info());

    await test.step('Open homepage', async () => {
      await chatPage.open();
    });

    await test.step('Submit script-like input', async () => {
      await chatPage.submitPrompt(SCRIPT_QUERY);
    });

    await test.step('Validate script-like response', async () => {
      await chatPage.expectResponseAt(0, /(script|cannot|execute|run|code|safe|security|help)/i);
      await chatPage.takeScreenshot('search-1-initial-response');
    });

    await test.step('Start new chat flow', async () => {
      await chatPage.startNewChat();
    });

    await test.step('Submit script input in new chat', async () => {
      await chatPage.submitPrompt(SCRIPT_QUERY_AGAIN);
    });

    await test.step('Validate script response in new chat', async () => {
      await chatPage.expectResponseAt(0, /(script|cannot|execute|run|code|safe|security|help)/i);
      await chatPage.takeScreenshot('search-2-newchat-response');
    });

    await test.step('Visit search page for empty state', async () => {
      await searchPage.open();
      await searchPage.expectEmptyState();
    });

    await test.step('Search page shows pending state for AI query', async () => {
      await searchPage.searchFor('AI');
      await searchPage.expectProgressBar();
      await searchPage.expectEmptyState();
      await searchPage.takeScreenshot('search-3-progress-bar');
    });
  });
});

