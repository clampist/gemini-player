import { Page, expect, TestInfo } from '@playwright/test';
import { selectors } from '../data/selectors';
import { logMessage } from '../support/logger';
import { captureScreenshot } from '../support/artifacts';

export class GeminiSearchPage {
  readonly page: Page;
  private testInfo?: TestInfo;

  constructor(page: Page, testInfo?: TestInfo) {
    this.page = page;
    this.testInfo = testInfo;
  }

  async open() {
    await this.page.goto('/search');
    if (this.testInfo) {
      await logMessage(this.testInfo, 'Opened search page');
    }
  }

  async expectEmptyState() {
    const emptyState = this.page.locator('text=No recent threads.');
    await expect(emptyState).toBeVisible({ timeout: 10_000 });
    if (this.testInfo) {
      await logMessage(this.testInfo, 'Confirmed empty state on search page');
    }
  }

  async searchFor(query: string) {
    const searchInput = this.page.locator(selectors.search.input);
    await expect(searchInput).toBeVisible({ timeout: 10_000 });
    await searchInput.fill(query);
    if (this.testInfo) {
      await logMessage(this.testInfo, `Searched for: ${query}`);
    }
  }

  async expectProgressBar() {
    const progressBar = this.page.locator(selectors.search.progressBar);
    await expect(progressBar).toBeVisible({ timeout: 5_000 });
    if (this.testInfo) {
      await logMessage(this.testInfo, 'Progress bar is visible');
    }
  }

  async takeScreenshot(name: string) {
    if (this.testInfo) {
      await captureScreenshot(this.testInfo, this.page, name);
    }
  }
}

