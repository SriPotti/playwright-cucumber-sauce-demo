import { expect, Page } from '@playwright/test';

export class ProductPage {
  constructor(private readonly page: Page) {}

  async expectTitle(title: string) {
    await expect(
      this.page.getByRole('heading', { level: 1, name: title })
    ).toBeVisible();
  }

  async expectPrice(price: string) {
    await expect(this.page.getByText(price, { exact: true }).first()).toBeVisible();
  }

  /**
   * Intentionally incorrect locator used only by @broken_locator scenarios.
   * The data-test attribute does not exist in the application.
   */
  async expectHeadingUsingBadLocator() {
    await expect(
      this.page.locator('h1[data-test="wrong-product-heading"]')
    ).toBeVisible({ timeout: 5_000 });
  }
}
