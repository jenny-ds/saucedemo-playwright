import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { USERS } from '../utils/users';

test.describe('로그인', () => {
  test('정상 계정으로 로그인하면 상품 목록이 보인다', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    await loginPage.goto();
    await loginPage.login(USERS.standard.username, USERS.standard.password);

    await inventoryPage.expectLoaded();
  });

  test('잠긴 계정으로 로그인하면 에러 메시지가 보인다', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(USERS.locked.username, USERS.locked.password);

    await loginPage.expectError('locked out');
  });
});
