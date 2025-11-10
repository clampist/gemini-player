import { Locator, expect, Page, TestInfo } from '@playwright/test';
import { selectors } from '../data/selectors';
import { containsJapanese } from '../support/utils';
import { BasePage } from './BasePage';

export class GeminiChatPage extends BasePage {
  constructor(page: Page, testInfo?: TestInfo) {
    super(page, testInfo);
  }

  // Navigation
  async open() {
    await this.goto('/');
    await expect(this.page).toHaveTitle(/gemini/i);
    await expect(this.page.locator('body')).toBeVisible();
    await this.log('Opened Gemini chat page');
  }

  // Chat input operations
  private async locateChatInput(): Promise<Locator> {
    const roleLocator = this.page.getByRole('textbox', { name: /(prompt|search|ask)/i });
    if (await roleLocator.count()) {
      return roleLocator.first();
    }
    return this.page.getByRole('textbox').first();
  }

  async submitPrompt(prompt: string) {
    const input = await this.locateChatInput();
    await expect(input, 'chat input should be visible').toBeVisible();
    await input.fill(prompt);
    
    await this.log(`Submitting prompt: ${prompt}`);

    // Try primary button
    const primaryButton = this.page.locator(selectors.chat.sendButton).first();
    const usedPrimary = await primaryButton
      .waitFor({ state: 'visible', timeout: 5_000 })
      .then(async () => {
        await expect(primaryButton).toBeEnabled({ timeout: 5_000 });
        await primaryButton.click({ force: true });
        return await this.waitForStreamingToStart();
      })
      .catch(() => false);

    if (usedPrimary) {
      return;
    }

    // Try fallback button
    const fallbackButton = this.page.locator('button.send-button').first();
    if (await fallbackButton.isVisible()) {
      await expect(fallbackButton).toBeEnabled({ timeout: 5_000 });
      await fallbackButton.click();
      const usedFallback = await this.waitForStreamingToStart();
      if (usedFallback) {
        return;
      }
    }

    // Final fallback: Enter key
    await input.press('Enter');
    await this.log('Fallback to Enter key submission');
  }

  private async waitForStreamingToStart(): Promise<boolean> {
    const stopButton = this.page.getByRole('button', selectors.chat.stopButtonRole);
    try {
      await stopButton.waitFor({ state: 'visible', timeout: 10_000 });
      await this.log('Streaming started (Stop button visible)');
      return true;
    } catch {
      await this.log('Streaming did not start (Stop button not visible)');
      return false;
    }
  }

  private async waitForStreamingToFinish() {
    const stopButton = this.page.getByRole('button', selectors.chat.stopButtonRole);
    await stopButton.waitFor({ state: 'hidden', timeout: 40_000 }).catch(() => undefined);
    await this.log('Streaming finished (Stop button hidden)');
  }

  // Response operations
  private getResponseList(): Locator {
    return this.page.locator(selectors.chat.responseItem);
  }

  async expectResponseAt(index: number, matcher?: RegExp, options?: { timeout?: number; expectJapanese?: boolean }) {
    await this.waitForStreamingToFinish();

    const responses = this.getResponseList();
    await expect(responses).toHaveCount(index + 1, {
      timeout: options?.timeout ?? 20_000
    });

    const response = responses.nth(index);
    await expect(response).toBeVisible({ timeout: options?.timeout ?? 20_000 });
    
    if (matcher) {
      await expect(response).toContainText(matcher, { timeout: options?.timeout ?? 20_000 });
    }

    if (options?.expectJapanese) {
      await expect
        .poll(
          async () => {
            const text = await response.textContent();
            return text ? containsJapanese(text) : false;
          },
          { timeout: options?.timeout ?? 20_000 }
        )
        .toBe(true);
    }

    await this.log(`Validated response #${index + 1} contains: ${matcher ?? 'JP characters'}`);

    return response;
  }

  async redoLatestResponse() {
    const responseList = this.getResponseList();
    const responseRegion = responseList.last();
    await expect(responseRegion).toBeVisible({ timeout: 10_000 });

    const redoButton = responseRegion.locator(selectors.chat.redoButton).first();
    await redoButton.waitFor({ state: 'visible', timeout: 5_000 }).catch(() => undefined);
    await expect(redoButton).toBeEnabled({ timeout: 5_000 });
    await redoButton.click();

    await this.waitForStreamingToStart();
    await this.waitForStreamingToFinish();

    await expect(responseList.last()).toBeVisible({ timeout: 20_000 });

    await this.log('Redid latest response');
  }

  async copyLatestResponse(): Promise<string> {
    const responseRegion = this.getResponseList().last();
    await expect(responseRegion).toBeVisible({ timeout: 5_000 });

    const copyButton = responseRegion.locator(selectors.chat.copyButton).first();
    await expect(copyButton).toBeVisible({ timeout: 5_000 });
    await expect(copyButton).toBeEnabled({ timeout: 5_000 });
    await copyButton.click();

    const copiedText = await this.page.evaluate(async () => {
      return navigator.clipboard.readText();
    });

    await this.log('Copied latest response to clipboard');

    return copiedText;
  }

  async startNewChat() {
    let newChatButton = this.page.locator(selectors.chat.newChatButton).first();
    if (!(await newChatButton.count())) {
      newChatButton = this.page
        .getByRole('button', { name: selectors.chat.newChatFallbackRole })
        .filter({ hasNot: this.page.locator('[disabled]') })
        .first();
    }

    await expect(newChatButton, 'new chat trigger should exist').toBeVisible({
      timeout: 10_000
    });
    await expect(newChatButton).toBeEnabled({ timeout: 10_000 });
    await newChatButton.click();

    const confirmButton = this.page.locator(selectors.chat.confirmNewChatButton).first();
    await expect(confirmButton).toBeVisible({ timeout: 10_000 });
    await expect(confirmButton).toBeEnabled({ timeout: 10_000 });
    await confirmButton.click();

    await this.log('Started new chat');
  }
}

