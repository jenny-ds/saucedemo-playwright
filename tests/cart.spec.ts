import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { USERS } from '../utils/users';

const BACKPACK = 'Sauce Labs Backpack';
const BIKE_LIGHT = 'Sauce Labs Bike Light';

test.describe('장바구니', () => {
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;

  // 각 테스트 시작 전에 로그인까지 끝내 둔다. (pytest의 fixture/setup과 비슷)
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);

    await loginPage.goto();
    await loginPage.login(USERS.standard.username, USERS.standard.password);
    await inventoryPage.expectLoaded();
  });

  test('상품을 담으면 장바구니에 표시된다', async () => {
    await inventoryPage.addToCart(BACKPACK);
    await inventoryPage.addToCart(BIKE_LIGHT);
    await inventoryPage.expectCartCount(2);

    await inventoryPage.openCart();
    await cartPage.expectLoaded();
    await cartPage.expectItems([BACKPACK, BIKE_LIGHT]);
  });

  test('장바구니에서 상품을 삭제할 수 있다', async () => {
    await inventoryPage.addToCart(BACKPACK);
    await inventoryPage.addToCart(BIKE_LIGHT);
    await inventoryPage.openCart();

    await cartPage.removeItem(BACKPACK);

    await cartPage.expectItems([BIKE_LIGHT]);
  });

  test('목록 화면에서 담은 상품을 다시 뺄 수 있다', async () => {
    await inventoryPage.addToCart(BACKPACK);
    await inventoryPage.expectCartCount(1);

    await inventoryPage.removeFromCart(BACKPACK);

    await inventoryPage.expectCartCount(0);
  });
});
