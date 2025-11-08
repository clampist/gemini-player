import { test, expect, Page } from '@playwright/test';

const SEARCH_QUERY = 'Playwright smoke test';

async function locateSearchInput(page: Page) {
  const placeholderLocator = page.getByPlaceholder(/(search|ask)/i);
  if (await placeholderLocator.count()) {
    return placeholderLocator.first();
  }

  const roleLocator = page.getByRole('textbox', { name: /(search|ask)/i });
  if (await roleLocator.count()) {
    return roleLocator.first();
  }

  return page.getByRole('textbox').first();
}

async function submitSearch(page: Page, query: string) {
  const searchInput = await locateSearchInput(page);
  await expect(searchInput, 'search input should be visible').toBeVisible();

  await searchInput.fill(query);

  const submitButton = page
    .getByRole('button', { name: /(search|ask|send|submit)/i })
    .first();

  if (await submitButton.isVisible()) {
    await submitButton.click();
    return;
  }

  await searchInput.press('Enter');
}

test.describe('Gemini homepage', () => {
  test('loads and handles a basic search query', async ({ page }) => {
    await test.step('Open Gemini homepage', async () => {
      await page.goto('/');
      await expect(page).toHaveTitle(/gemini/i);
      await expect(page.locator('body')).toBeVisible();
    });

    await test.step('Submit search request', async () => {
      await submitSearch(page, SEARCH_QUERY);
    });

    await test.step('Confirm search response', async () => {
      const responseRegion = page
        .locator('model-response.ng-star-inserted')
        .first();
      await expect(responseRegion).toBeVisible({ timeout: 20_000 });
      await expect(responseRegion).toContainText(/Playwright/i);

      const screenshotPath = `artifacts/gemini-home-${Date.now()}.png`;
      await page.screenshot({ path: screenshotPath, fullPage: true });
      test.info().attach('result-screenshot', {
        path: screenshotPath,
        contentType: 'image/png'
      });
    });
  });
});
