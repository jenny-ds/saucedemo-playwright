import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { USERS } from '../utils/users';

test.describe('상품 정렬', () => {
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);

    await loginPage.goto();
    await loginPage.login(USERS.standard.username, USERS.standard.password);
    await inventoryPage.expectLoaded();
  });

  test('이름 Z to A로 정렬하면 내림차순이다', async () => {
    await inventoryPage.sortBy('za');

    const names = await inventoryPage.getItemNames();
    expect(names).toEqual([...names].sort().reverse());
  });

  test('가격 낮은 순으로 정렬하면 오름차순이다', async () => {
    await inventoryPage.sortBy('lohi');

    const prices = await inventoryPage.getItemPrices();
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  test('가격 높은 순으로 정렬하면 내림차순이다', async () => {
    await inventoryPage.sortBy('hilo');

    const prices = await inventoryPage.getItemPrices();
    expect(prices).toEqual([...prices].sort((a, b) => b - a));
  });
});
