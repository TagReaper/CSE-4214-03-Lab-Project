import { test, expect } from "@playwright/test";

test.describe("Login Feature Tests", () => {
  const LOGIN_URL = "/login";

  test.beforeEach(async ({ page }) => {
    await page.goto(LOGIN_URL);
  });

  test("should successfully login with valid credentials", async ({ page }) => {
    if (!process.env.BUYER_EMAIL || !process.env.BUYER_PASSWORD) {
      throw new Error(
        "BUYER_EMAIL and BUYER_PASSWORD must be set in .env.test"
      );
    }
    await page.fill('input[type="email"]', process.env.BUYER_EMAIL);
    await page.fill('input[type="password"]', process.env.BUYER_PASSWORD);

    await page.click('input[type="submit"]');

    await page.waitForURL("/");
    await expect(page).toHaveURL("/");
  });

  test("should display error message with invalid credentials", async ({
    page,
  }) => {
    await page.fill('input[type="email"]', "invalid@example.com");
    await page.fill('input[type="password"]', "WrongPassword");

    await page.click('input[type="submit"]');

    await page.waitForSelector('p[style*="color: red"]', { timeout: 5000 });

    const errorMessage = await page.textContent('p[style*="color: red"]');
    expect(errorMessage).toContain("Failed to log in");

    await expect(page).toHaveURL(LOGIN_URL);
  });

  test("should not submit form with empty required fields", async ({
    page,
  }) => {
    await page.click('input[type="submit"]');

    const emailInput = page.locator('input[type="email"]');
    const isEmailInvalid = await emailInput.evaluate(
      (el: HTMLInputElement) => !el.validity.valid
    );

    expect(isEmailInvalid).toBeTruthy();
    await expect(page).toHaveURL(LOGIN_URL);
  });

  test("should navigate to signup page when clicking register link", async ({
    page,
  }) => {
    const registerLink = page.locator("a.underline", { hasText: "Register" });
    await registerLink.click();

    await expect(page).toHaveURL("/signup");
  });
});
// test with buyer authenticated
test.describe("Login Page, User Already Authenticated", () => {
  test.use({ storageState: "playwright/.auth/buyer.json" });

  test("should redirect already logged-in user to home page", async ({
    page,
  }) => {
    await page.goto("/login");

    await page.waitForURL("/");
    await expect(page).toHaveURL("/");
  });
});
