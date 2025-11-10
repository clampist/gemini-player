import { expect, Page, TestInfo } from '@playwright/test';
import { selectors } from '../data/selectors';
import { BasePage } from './BasePage';

export class GeminiSettingsPage extends BasePage {
  constructor(page: Page, testInfo?: TestInfo) {
    super(page, testInfo);
  }

  async openWithLocale(locale?: string) {
    const url = locale ? `/?hl=${locale}` : '/';
    await this.goto(url);
    await this.log(`Opened page with locale: ${locale ?? 'default'}`);
  }

  async expectLocale(locale: string) {
    await expect(this.page.locator('html')).toHaveAttribute('lang', new RegExp(locale, 'i'));
    await this.log(`Confirmed locale: ${locale}`);
  }

  async openSettingsPanel() {
    const settingsButton = this.page.locator(selectors.settings.panelTrigger).first();
    await expect(settingsButton).toBeVisible({ timeout: 10_000 });
    await settingsButton.click();
    await this.log('Opened settings panel');
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

    await this.log(`Selected ${theme} theme`);
  }

  async expectTheme(theme: 'dark' | 'light') {
    await expect
      .poll(async () =>
        this.page.evaluate(() => document.body?.className ?? '')
      )
      .toContain(`${theme}-theme`);
    
    await this.log(`Confirmed ${theme} theme applied`);
  }
}

