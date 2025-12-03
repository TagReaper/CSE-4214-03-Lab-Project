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

    await page.getByRole("button", { name: "Sign In" }).click();

    await page.waitForURL("/");
    await expect(page).toHaveURL("/");
  });

  test("should display error message with invalid credentials", async ({
    page,
  }) => {
    await page.getByLabel("Email").fill("invalid@example.com");
    await page.getByLabel("Password").fill("WrongPassword");

    await page.getByRole("button", { name: "Sign In" }).click();

    const errorMessage = page.locator(".bg-red-50.text-\\[\\#8B1538\\]");
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText("Failed to log in");

    await expect(page).toHaveURL(LOGIN_URL);
  });

  test("should prevent login and show banned message for banned account", async ({
    page,
  }) => {
    await page.getByLabel("Email").fill("banneduser@example.com");
    await page.getByLabel("Password").fill("ValidPassword123#");

    await page.getByRole("button", { name: "Sign In" }).click();
    await page.getByRole("button", { name: "Sign In" }).click();

    const errorMessage = page.locator(".bg-red-50.text-\\[\\#8B1538\\]");
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText(
      "banned from, or was denied access to, ThriftU"
    );

    await expect(page).toHaveURL(LOGIN_URL);
  });

  test("should show validation error for empty email field", async ({
    page,
  }) => {
    await page.getByLabel("Password").fill("ValidPassword123");
    await page.getByRole("button", { name: "Sign In" }).click();

    const errorMessage = page.locator(
      "text=Please enter a valid email address"
    );
    await expect(errorMessage).toBeVisible();
  });

  test("should show validation error for empty password field", async ({
    page,
  }) => {
    await page.getByLabel("Email").fill("test@example.com");
    await page.getByRole("button", { name: "Sign In" }).click();

    const errorMessage = page.locator("text=Password is required");
    await expect(errorMessage).toBeVisible();
  });

  test("should navigate to signup page when clicking sign up link", async ({
    page,
  }) => {
    await page.getByRole("link", { name: "Sign up" }).click();

    await expect(page).toHaveURL("/signup");
  });

  test("should show loading state during login", async ({ page }) => {
    await page.getByLabel("Email").fill("validbuyer@example.com");
    await page.getByLabel("Password").fill("ValidPassword123");

    await page.getByRole("button", { name: "Sign In" }).click();

    const button = page.getByRole("button", { name: "Signing in..." });
    await expect(button).toBeVisible();
    await expect(button).toBeDisabled();
  });

  test("should disable form inputs during loading", async ({ page }) => {
    await page.getByLabel("Email").fill("validbuyer@example.com");
    await page.getByLabel("Password").fill("ValidPassword123");

    await page.getByRole("button", { name: "Sign In" }).click();

    const emailInput = page.getByLabel("Email");
    const passwordInput = page.getByLabel("Password");

    await expect(emailInput).toBeDisabled();
    await expect(passwordInput).toBeDisabled();
  });
});

test.describe("Login Page - Authenticated User Redirect", () => {
  test.use({ storageState: "playwright/.auth/buyer.json" });

  test("should redirect already logged-in user to home page", async ({
    page,
  }) => {
    await page.goto("/login");

    await page.waitForURL("/");
    await expect(page).toHaveURL("/");
  });
});
