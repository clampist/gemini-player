import { expect, Page, TestInfo } from '@playwright/test';
import { selectors } from '../data/selectors';
import { BasePage } from './BasePage';

export class GeminiSearchPage extends BasePage {
  constructor(page: Page, testInfo?: TestInfo) {
    super(page, testInfo);
  }

  async open() {
    await this.goto('/search');
  }

  async expectEmptyState() {
    const emptyState = this.page.locator('text=No recent threads.');
    await expect(emptyState).toBeVisible({ timeout: 10_000 });
    await this.log('Confirmed empty state on search page');
  }

  async searchFor(query: string) {
    const searchInput = this.page.locator(selectors.search.input);
    await expect(searchInput).toBeVisible({ timeout: 10_000 });
    await searchInput.fill(query);
    await this.log(`Searched for: ${query}`);
  }

  async expectProgressBar() {
    const progressBar = this.page.locator(selectors.search.progressBar);
    await expect(progressBar).toBeVisible({ timeout: 5_000 });
    await this.log('Progress bar is visible');
  }
}

