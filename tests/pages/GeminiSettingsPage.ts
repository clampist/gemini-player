import { Page, expect, TestInfo } from '@playwright/test';
import { selectors } from '../data/selectors';
import { logMessage } from '../support/logger';
import { captureScreenshot } from '../support/artifacts';

export class GeminiSettingsPage {
  readonly page: Page;
  private testInfo?: TestInfo;

  constructor(page: Page, testInfo?: TestInfo) {
    this.page = page;
    this.testInfo = testInfo;
  }

  async openWithLocale(locale?: string) {
    const url = locale ? `/?hl=${locale}` : '/';
    await this.page.goto(url);
    if (this.testInfo) {
      await logMessage(this.testInfo, `Opened page with locale: ${locale ?? 'default'}`);
    }
  }

  async expectLocale(locale: string) {
    await expect(this.page.locator('html')).toHaveAttribute('lang', new RegExp(locale, 'i'));
    if (this.testInfo) {
      await logMessage(this.testInfo, `Confirmed locale: ${locale}`);
    }
  }

  async openSettingsPanel() {
    const settingsButton = this.page.locator(selectors.settings.panelTrigger).first();
    await expect(settingsButton).toBeVisible({ timeout: 10_000 });
    await settingsButton.click();
    if (this.testInfo) {
      await logMessage(this.testInfo, 'Opened settings panel');
    }
  }

  async switchTheme(theme: 'dark' | 'light') {
    const themeButton = this.page.locator(selectors.settings.themeMenuTrigger).first();
    await expect(themeButton).toBeVisible({ timeout: 5_000 });
    await themeButton.click();

    const themePattern = new RegExp(`\\b${theme}\\b`, 'i');
    const themeOption = this.page
      .getByRole('menuitem', selectors.settings.menuItem(themePattern))
      .first();
    await expect(themeOption).toBeVisible({ timeout: 5_000 });
    await themeOption.click();

    if (this.testInfo) {
      await logMessage(this.testInfo, `Selected ${theme} theme`);
    }
  }

  async expectTheme(theme: 'dark' | 'light') {
    await expect
      .poll(async () =>
        this.page.evaluate(() => document.body?.className ?? '')
      )
      .toContain(`${theme}-theme`);
    
    if (this.testInfo) {
      await logMessage(this.testInfo, `Confirmed ${theme} theme applied`);
    }
  }

  async takeScreenshot(name: string) {
    if (this.testInfo) {
      await captureScreenshot(this.testInfo, this.page, name);
    }
  }
}

