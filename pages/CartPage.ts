import { type Page, type Locator, expect } from '@playwright/test';

// 장바구니 화면
export class CartPage {
  readonly page: Page;
  readonly cartItems: Locator;
  readonly itemNames: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartItems = page.locator('[data-test="inventory-item"]');
    this.itemNames = page.locator('[data-test="inventory-item-name"]');
  }

  async expectLoaded() {
    await expect(this.page).toHaveURL(/cart\.html/);
  }

  async removeItem(name: string) {
    await this.cartItems
      .filter({ hasText: name })
      .getByRole('button', { name: 'Remove' })
      .click();
  }

  async expectItems(names: string[]) {
    await expect(this.itemNames).toHaveText(names);
  }
}
