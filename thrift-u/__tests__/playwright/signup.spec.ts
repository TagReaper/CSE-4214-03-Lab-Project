import { test, expect } from "@playwright/test";

// generate unique email for each test run
const generateEmail = () =>
  `test.${Date.now()}.${Math.random().toString(36).substring(7)}@example.com`;

test.describe("Signup Feature Tests", () => {
  const SIGNUP_URL = "/signup";

  test.beforeEach(async ({ page }) => {
    await page.goto(SIGNUP_URL);
  });

  test("should successfully create a buyer account with valid information", async ({
    page,
  }) => {
    await page.getByLabel("First Name").fill("John");
    await page.getByLabel("Last Name").fill("Doe");
    await page.getByLabel("Email").fill(generateEmail());
    await page.getByLabel("Password", { exact: true }).fill("ValidPass123!");
    await page.getByLabel("Confirm Password").fill("ValidPass123!");

    const sellerCheckbox = page.getByRole("checkbox");
    await expect(sellerCheckbox).not.toBeChecked();

    await page.getByRole("button", { name: "Create Account" }).click();

    const successToast = page.locator("text=Account created successfully!");
    await expect(successToast).toBeVisible();

    await page.waitForURL("/");
  });

  test("should successfully create a seller account when seller checkbox is checked", async ({
    page,
  }) => {
    await page.getByLabel("First Name").fill("Jane");
    await page.getByLabel("Last Name").fill("Smith");
    await page.getByLabel("Email").fill(generateEmail());
    await page.getByLabel("Password", { exact: true }).fill("ValidPass456!");
    await page.getByLabel("Confirm Password").fill("ValidPass456!");

    await page.getByRole("checkbox").check();
    await expect(page.getByRole("checkbox")).toBeChecked();

    await page.getByRole("button", { name: "Create Account" }).click();

    // confirmation step for seller account
    await expect(
      page.getByRole("button", { name: "Confirm Seller Account Request" })
    ).toBeVisible();

    await page
      .getByRole("button", { name: "Confirm Seller Account Request" })
      .click();

    const successToast = page.locator("text=Account created successfully!");
    await expect(successToast).toBeVisible();

    await page.waitForURL("/");
  });

  test("should display error when passwords do not match", async ({ page }) => {
    await page.getByLabel("First Name").fill("Test");
    await page.getByLabel("Last Name").fill("User");
    await page.getByLabel("Email").fill(generateEmail());
    await page.getByLabel("Password", { exact: true }).fill("ValidPass123!");
    await page.getByLabel("Confirm Password").fill("DifferentPass123!");

    await page.getByRole("button", { name: "Create Account" }).click();

    const errorMessage = page.locator("text=Passwords do not match");
    await expect(errorMessage).toBeVisible();
  });

  test("should display error when email is already registered", async ({
    page,
  }) => {
    const duplicateEmail = generateEmail();

    await page.getByLabel("First Name").fill("First");
    await page.getByLabel("Last Name").fill("User");
    await page.getByLabel("Email").fill(duplicateEmail);
    await page.getByLabel("Password", { exact: true }).fill("ValidPass123!");
    await page.getByLabel("Confirm Password").fill("ValidPass123!");

    await page.getByRole("button", { name: "Create Account" }).click();

    await page.waitForURL("/");

    await page.goto(SIGNUP_URL);

    await page.getByLabel("First Name").fill("Second");
    await page.getByLabel("Last Name").fill("User");
    await page.getByLabel("Email").fill(duplicateEmail);
    await page.getByLabel("Password", { exact: true }).fill("ValidPass456!");
    await page.getByLabel("Confirm Password").fill("ValidPass456!");

    await page.getByRole("button", { name: "Create Account" }).click();

    const errorMessage = page.locator(".bg-red-50");
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText("already registered");
  });

  test("show validation error for empty first name", async ({ page }) => {
    await page.getByLabel("Last Name").fill("Doe");
    await page.getByLabel("Email").fill(generateEmail());
    await page.getByLabel("Password", { exact: true }).fill("ValidPass123!");
    await page.getByLabel("Confirm Password").fill("ValidPass123!");

    await page.getByRole("button", { name: "Create Account" }).click();

    const errorMessage = page.locator(
      "text=First name must be at least 2 characters"
    );
    await expect(errorMessage).toBeVisible();
  });

  test("show validation error for invalid email format", async ({ page }) => {
    await page.getByLabel("First Name").fill("Invalid");
    await page.getByLabel("Last Name").fill("Email");
    await page.getByLabel("Email").fill("not-an-email");
    await page.getByLabel("Password", { exact: true }).fill("ValidPass123!");
    await page.getByLabel("Confirm Password").fill("ValidPass123!");

    await page.getByRole("button", { name: "Create Account" }).click();

    const errorMessage = page.locator(
      "text=Please enter a valid email address"
    );
    await expect(errorMessage).toBeVisible();
  });

  test("should show password validation requirements changing", async ({
    page,
  }) => {
    const passwordInput = page.getByLabel("Password", { exact: true });

    await passwordInput.focus();

    // initially all requirements should be red/unchecked
    await expect(page.locator("text=✗ At least 10 characters")).toBeVisible();

    await passwordInput.fill("short");
    await expect(page.locator("text=✗ At least 10 characters")).toBeVisible();

    await passwordInput.fill("ValidPass123!");

    // all requirements should turn green/checked
    await expect(page.locator("text=✓ At least 10 characters")).toBeVisible();
    await expect(page.locator("text=✓ A lowercase letter")).toBeVisible();
    await expect(page.locator("text=✓ An uppercase letter")).toBeVisible();
    await expect(page.locator("text=✓ A number")).toBeVisible();
    await expect(
      page.locator("text=✓ A special character (!@#$%^&*)")
    ).toBeVisible();
  });
});
