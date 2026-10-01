import { type Page, type Locator, expect } from '@playwright/test';

// Page Object: 로그인 화면의 "요소(locator)"와 "동작"을 한곳에 모아둔다.
// 테스트 코드에는 셀렉터가 없고, login() 같은 의미 있는 메서드만 호출한다.
export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    // locator는 "찾는 방법"만 저장하고, 실제 동작 시점에 요소를 찾는다.
    // (Selenium의 find_element는 호출 즉시 찾음 → 여기서 auto-wait 차이가 생김)
    this.usernameInput = page.getByPlaceholder('Username');
    this.passwordInput = page.getByPlaceholder('Password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.errorMessage = page.locator('[data-test="error"]');
  }

  async goto() {
    await this.page.goto('/');
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async expectError(text: string) {
    await expect(this.errorMessage).toContainText(text);
  }
}
