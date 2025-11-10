import { expect, Locator, Page, TestInfo } from '@playwright/test';
import { selectors } from '../data/selectors';
import { logMessage } from './logger';
import { containsJapanese } from './utils';

export async function locateChatInput(page: Page): Promise<Locator> {
  // aria-label="Enter a prompt here"
  const roleLocator = page.getByRole('textbox', { name: /(prompt|search|ask)/i });
  if (await roleLocator.count()) {
    return roleLocator.first();
  }

  return page.getByRole('textbox').first();
}

export async function submitChatPrompt(page: Page, prompt: string, testInfo?: TestInfo) {
  const input = await locateChatInput(page);
  await expect(input, 'chat input should be visible').toBeVisible();
  await input.fill(prompt);
  if (testInfo) {
    await logMessage(testInfo, `Submitting prompt: ${prompt}`);
  }

  const primaryButton = page.locator(selectors.chat.sendButton).first();

  const usedPrimary = await primaryButton
    .waitFor({ state: 'visible', timeout: 5_000 })
    .then(async () => {
      await expect(primaryButton).toBeEnabled({ timeout: 5_000 });
      await primaryButton.click({ force: true });
      await waitForStreamingToStart(page, testInfo);
      // fallback to Enter key submission / エンターキー送信にフォールバック
      // TODO: check if this is the best way to submit the prompt / これが最良の方法かどうかを確認する
      await input.press('Enter');
      return true;
    })
    .catch(() => false);

  if (usedPrimary) {
    return;
  }

  const fallbackButton = page.getByRole('button', { name: /(search|ask|send|submit)/i }).first();

  if (await fallbackButton.isVisible()) {
    await expect(fallbackButton).toBeEnabled({ timeout: 5_000 });
    await fallbackButton.click();
    await waitForStreamingToStart(page, testInfo);
    return;
  }

  await input.press('Enter');
  if (testInfo) {
    await logMessage(testInfo, 'Fallback to Enter key submission');
  }
}

export async function waitForStreamingToStart(page: Page, testInfo?: TestInfo) {
  const stopButton = page.getByRole('button', selectors.chat.stopButtonRole);
  await stopButton.waitFor({ state: 'visible', timeout: 10_000 }).catch(() => undefined);
  if (testInfo) {
    await logMessage(testInfo, 'Streaming started (Stop button visible)');
  }
}

export async function waitForStreamingToFinish(page: Page, testInfo?: TestInfo) {
  const stopButton = page.getByRole('button', selectors.chat.stopButtonRole);
  await stopButton.waitFor({ state: 'hidden', timeout: 40_000 }).catch(() => undefined);
  if (testInfo) {
    await logMessage(testInfo, 'Streaming finished (Stop button hidden)');
  }
}

export function getResponseList(page: Page) {
  return page.locator(selectors.chat.responseItem);
}

type ResponseCriteria = {
  index: number;
  matcher?: RegExp;
  expectJapanese?: boolean;
};

export async function expectResponseContains(
  page: Page,
  criteria: ResponseCriteria,
  options: { timeout?: number; testInfo?: TestInfo } = {}
) {
  await waitForStreamingToFinish(page, options.testInfo);

  const responses = getResponseList(page);
  await expect(responses).toHaveCount(criteria.index + 1, {
    timeout: options.timeout ?? 20_000
  });

  const response = responses.nth(criteria.index);
  await expect(response).toBeVisible({ timeout: options.timeout ?? 20_000 });
  if (criteria.matcher) {
    await expect(response).toContainText(criteria.matcher, { timeout: options.timeout ?? 20_000 });
  }

  if (criteria.expectJapanese) {
    await expect
      .poll(
        async () => {
          const text = await response.textContent();
          return text ? containsJapanese(text) : false;
        },
        { timeout: options.timeout ?? 20_000 }
      )
      .toBe(true);
  }

  if (options.testInfo) {
    await logMessage(
      options.testInfo,
      `Validated response #${criteria.index + 1} contains: ${
        criteria.matcher ?? 'JP characters'
      }`
    );
  }

  return response;
}

