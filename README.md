# SauceDemo Playwright 자동화

공개 데모 쇼핑몰 [SauceDemo](https://www.saucedemo.com)를 대상으로 만든 **Playwright + TypeScript** E2E 테스트 프레임워크입니다.
Page Object Model(POM)로 구조를 나누고, GitHub Actions에서 push 때마다 테스트를 실행합니다.

## 목적

- 테스트 자동화 프레임워크를 직접 설계하고 구축한 경험을 보여주기 위한 포트폴리오입니다.
- 테스트 대상은 공개 데모 사이트 하나뿐이며, 그 밖의 서비스나 내부 정보는 사용하지 않습니다.

## 기술 스택

| 구분 | 내용 |
|---|---|
| 테스트 도구 | Playwright (`@playwright/test`) |
| 언어 | TypeScript |
| 설계 패턴 | Page Object Model |
| CI | GitHub Actions |
| 브라우저 | Chromium |

## 폴더 구조

```
.
├── pages/                  # Page Object (화면별 locator와 동작)
│   ├── LoginPage.ts
│   ├── InventoryPage.ts
│   └── CartPage.ts
├── tests/                  # 시나리오별 spec 파일
│   ├── login.spec.ts
│   ├── cart.spec.ts
│   └── sort.spec.ts
├── utils/
│   └── users.ts            # SauceDemo 공개 데모 계정
├── .github/workflows/
│   └── playwright.yml      # push 시 테스트 실행
├── playwright.config.ts
├── .env.example
└── package.json
```

테스트 코드(`tests/`)에는 셀렉터를 직접 쓰지 않고, 셀렉터는 `pages/` 안에서만 관리합니다.
화면이 바뀌어도 해당 Page Object 한 파일만 고치면 됩니다.

## 설치 및 실행

Node.js(LTS)가 필요합니다.

```bash
# 1. 의존성 설치
npm ci

# 2. Playwright 브라우저 설치 (최초 1회)
npx playwright install chromium

# 3. 전체 테스트 실행
npx playwright test
```

자주 쓰는 실행 옵션입니다.

```bash
npx playwright test tests/login.spec.ts   # 파일 하나만 실행
npx playwright test --headed              # 브라우저 창을 띄워서 실행
npx playwright test --ui                  # UI 모드 (단계별 화면 확인)
npx playwright show-report                # 실행 후 HTML 리포트 열기
```

## 환경 변수

`.env.example`을 복사해서 `.env`를 만들면 대상 URL을 바꿀 수 있습니다. 설정하지 않으면 기본값(SauceDemo)을 사용합니다.

```bash
cp .env.example .env
```

| 변수 | 설명 | 기본값 |
|---|---|---|
| `BASE_URL` | 테스트 대상 주소 | `https://www.saucedemo.com` |

`.env`는 git에 올라가지 않습니다. SauceDemo 로그인 계정은 사이트 첫 화면에 공개된 데모 계정이라 코드(`utils/users.ts`)에 들어 있습니다.

## 테스트 시나리오

| 파일 | 시나리오 |
|---|---|
| `login.spec.ts` | 정상 계정으로 로그인하면 상품 목록이 보인다 |
| | 잠긴 계정으로 로그인하면 에러 메시지가 보인다 |
| `cart.spec.ts` | 상품을 담으면 장바구니에 표시된다 |
| | 장바구니에서 상품을 삭제할 수 있다 |
| | 목록 화면에서 담은 상품을 다시 뺄 수 있다 |
| `sort.spec.ts` | 이름 Z to A로 정렬하면 내림차순이다 |
| | 가격 낮은 순으로 정렬하면 오름차순이다 |
| | 가격 높은 순으로 정렬하면 내림차순이다 |

총 8개 테스트입니다. `cart.spec.ts`와 `sort.spec.ts`는 `beforeEach`에서 로그인을 먼저 처리합니다.

## CI

`.github/workflows/playwright.yml`이 `main`/`master` 브랜치에 push하거나 PR을 올릴 때 테스트를 실행하고, 결과 리포트를 아티팩트로 저장합니다.
