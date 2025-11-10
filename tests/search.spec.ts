import { test } from '@playwright/test';
import { GeminiChatPage } from './pages/GeminiChatPage';
import { GeminiSearchPage } from './pages/GeminiSearchPage';
import {
  ScriptQueries,
  SearchQueries,
  ScriptResponsePattern,
  SearchScreenshots
} from './data/testData';

test.describe('Gemini search handling without login', () => {
  test('Handle script-like input safely, then search for "AI"', async ({ page }) => {
    const chatPage = new GeminiChatPage(page, test.info());
    const searchPage = new GeminiSearchPage(page, test.info());

    await test.step('Open homepage', async () => {
      await chatPage.open();
    });

    await test.step('Submit script-like input', async () => {
      await chatPage.submitPrompt(ScriptQueries.alert);
    });

    await test.step('Validate script-like response', async () => {
      await chatPage.expectResponseAt(0, ScriptResponsePattern);
      await chatPage.takeScreenshot(SearchScreenshots.initialResponse);
    });

    await test.step('Start new chat flow', async () => {
      await chatPage.startNewChat();
    });

    await test.step('Submit script input in new chat', async () => {
      await chatPage.submitPrompt(ScriptQueries.alertAgain);
    });

    await test.step('Validate script response in new chat', async () => {
      await chatPage.expectResponseAt(0, ScriptResponsePattern);
      await chatPage.takeScreenshot(SearchScreenshots.newChatResponse);
    });

    await test.step('Visit search page for empty state', async () => {
      await searchPage.open();
      await searchPage.expectEmptyState();
    });

    await test.step('Search page shows pending state for AI query', async () => {
      await searchPage.searchFor(SearchQueries.simple);
      await searchPage.expectProgressBar();
      await searchPage.expectEmptyState();
      await searchPage.takeScreenshot(SearchScreenshots.progressBar);
    });
  });
});

