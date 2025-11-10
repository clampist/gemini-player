import { Page, TestInfo } from '@playwright/test';
import { logMessage } from '../support/logger';
import { captureScreenshot } from '../support/artifacts';

/**
 * Base Page Object class that provides common functionality for all page objects.
 * 
 * Features:
 * - Automatic logging integration
 * - Screenshot capture utilities
 * - Common page navigation patterns
 * - Shared test context management
 */
export abstract class BasePage {
  readonly page: Page;
  protected testInfo?: TestInfo;

  constructor(page: Page, testInfo?: TestInfo) {
    this.page = page;
    this.testInfo = testInfo;
  }

  /**
   * Navigate to a specific path relative to the base URL
   */
  protected async goto(path: string = '/') {
    await this.page.goto(path);
    await this.log(`Navigated to ${path}`);
  }

  /**
   * Log a message if testInfo is available
   */
  protected async log(message: string) {
    if (this.testInfo) {
      await logMessage(this.testInfo, message);
    }
  }

  /**
   * Take a screenshot with the given name
   */
  async takeScreenshot(name: string) {
    if (this.testInfo) {
      await captureScreenshot(this.testInfo, this.page, name);
    }
  }

  /**
   * Wait for the page to be in a stable state
   */
  protected async waitForPageStable() {
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForLoadState('networkidle', { timeout: 10_000 }).catch(() => {
      // Network idle is optional, continue if timeout
    });
  }

  /**
   * Get the current page URL
   */
  protected getCurrentUrl(): string {
    return this.page.url();
  }

  /**
   * Execute a page action with automatic logging
   */
  protected async executeWithLog<T>(
    action: () => Promise<T>,
    description: string
  ): Promise<T> {
    await this.log(`Executing: ${description}`);
    const result = await action();
    await this.log(`Completed: ${description}`);
    return result;
  }
}

