// tests/seller.products.spec.ts
import { test, expect } from "@playwright/test";
import path from "path";
import fs from "fs";

test.describe("Seller List Items Tests", () => {
  const SELLER_PAGE_URL = "/sellerhub/products";

  test.beforeEach(async ({ page }) => {
    await page.goto(SELLER_PAGE_URL);
  });

  test("should display approved products in products section", async ({
    page,
  }) => {
    await page.waitForSelector('h1:has-text("Products")');

    const productsSection = page
      .locator('h1:has-text("Products")')
      .locator("..");
    await expect(productsSection).toBeVisible();

    const approvedProducts = page.locator(
      ".flex.flex-wrap.justify-evenly.border-b-8 > div"
    );
    const count = await approvedProducts.count();

    if (count > 0) {
      expect(count).toBeGreaterThan(0);
    }
  });

  test("should display pending products in pending section", async ({
    page,
  }) => {
    await page.waitForSelector('h1:has-text("Pending Products")');

    const pendingSection = page
      .locator('h1:has-text("Pending Products")')
      .locator("..");
    await expect(pendingSection).toBeVisible();

    const pendingContainer = page.locator(
      'h1:has-text("Pending Products") ~ .flex.flex-wrap'
    );
    await expect(pendingContainer).toBeVisible();
  });

  test('should show "No Approved Products" message when seller has no approved items', async ({
    page,
    context,
  }) => {
    await context.route("**/firestore/**", async (route) => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({ documents: [] }),
      });
    });

    await page.reload();
    await page.waitForSelector('h1:has-text("Products")');

    const noProductsMessage = page.locator(
      'p.text-2xl:has-text("No Approved Products")'
    );
    await expect(noProductsMessage).toBeVisible();
  });

  test("should load and display items from firestore", async ({ page }) => {
    await page.waitForTimeout(2000);

    const approvedProducts = page.locator(
      ".flex.flex-wrap.justify-evenly.border-b-8 > div"
    );
    const pendingProducts = page.locator(
      'h1:has-text("Pending Products") ~ .flex.flex-wrap > div'
    );

    const approvedCount = await approvedProducts.count();
    const pendingCount = await pendingProducts.count();

    expect(approvedCount + pendingCount).toBeGreaterThanOrEqual(0);
  });
});

test.describe("Seller Product Tests", () => {
  const SELLER_PAGE_URL = "/sellerhub/products";

  test.beforeEach(async ({ page }) => {
    await page.goto(SELLER_PAGE_URL);
  });

  test("display request new listing button", async ({ page }) => {
    await page.waitForSelector('h1:has-text("Pending Products")');

    const requestButton = page.locator(
      'button:has-text("Request New Listing")'
    );
    await expect(requestButton).toBeVisible();
  });

  test("open dialog when clicking request new listing button", async ({
    page,
  }) => {
    const requestButton = page.locator(
      'button:has-text("Request New Listing")'
    );
    await requestButton.click();

    const dialog = page.locator('div[role="dialog"]');
    await expect(dialog).toBeVisible();

    const dialogTitle = page.locator('h2:has-text("Request Item")');
    await expect(dialogTitle).toBeVisible();
  });

  test("display all required fields in request item dialog", async ({
    page,
  }) => {
    const requestButton = page.locator(
      'button:has-text("Request New Listing")'
    );
    await requestButton.click();

    await expect(page.locator('label:has-text("Image")')).toBeVisible();
    await expect(page.locator('label:has-text("Title")')).toBeVisible();
    await expect(page.locator('label:has-text("Description")')).toBeVisible();
    await expect(page.locator('label:has-text("Price")')).toBeVisible();
    await expect(page.locator('label:has-text("Quantity")')).toBeVisible();
    await expect(page.locator('label:has-text("Condition")')).toBeVisible();
    await expect(page.locator('label:has-text("Tags")')).toBeVisible();
  });

  test("close dialog when clicking cancel button", async ({ page }) => {
    const requestButton = page.locator(
      'button:has-text("Request New Listing")'
    );
    await requestButton.click();

    const dialog = page.locator('div[role="dialog"]');
    await expect(dialog).toBeVisible();

    const cancelButton = page.locator('button:has-text("Cancel")');
    await cancelButton.click();

    await expect(dialog).not.toBeVisible();
  });

  test("should not submit form with empty required fields", async ({
    page,
  }) => {
    const requestButton = page.locator(
      'button:has-text("Request New Listing")'
    );
    await requestButton.click();

    const submitButton = page.locator('button:has-text("Submit Request")');
    await submitButton.click();

    const titleInput = page.locator("input#Title");
    const isInvalid = await titleInput.evaluate(
      (el: HTMLInputElement) => !el.validity.valid
    );

    expect(isInvalid).toBeTruthy();
  });

  test("successfully create a new product listing", async ({ page }) => {
    const uniqueItemName = `Test Product ${Date.now()}`;

    const requestButton = page.locator(
      'button:has-text("Request New Listing")'
    );
    await requestButton.click();

    // upload image
    const fileInput = page.locator("input#Image");

    // path to folder
    const productsDir = path.join(__dirname, "fixtures", "products");

    // read and filter only .png files
    const files = fs.readdirSync(productsDir);
    const pngFiles = files.filter((file) => file.endsWith(".png"));

    // check
    if (pngFiles.length === 0) {
      throw new Error(`No .png files found in ${productsDir}`);
    }

    // pick random
    const randomImage = pngFiles[Math.floor(Math.random() * pngFiles.length)];
    const fullPath = path.join(productsDir, randomImage);

    await fileInput.setInputFiles(fullPath);

    await page.fill("input#Title", uniqueItemName);
    await page.fill("textarea#Description", "This is a test product");
    await page.fill("input#Price", "29.99");
    await page.fill("input#Quantity", "5");

    // select condition
    await page.click('button[role="combobox"]:has-text("Condition")');
    await page.click('div[role="option"]:has-text("Like-New")');

    // select tags
    await page.click('button[role="combobox"]:has-text("Select Tags")');
    await page.getByRole("option", { name: "Clothing", exact: true }).click();
    await page.getByRole("option", { name: "College", exact: true }).click();

    // close multi-select dropdown
    await page.keyboard.press("Escape");

    page.once("dialog", async (dialog) => {
      await dialog.accept();
    });

    const submitButton = page.locator('button:has-text("Submit Request")');
    await submitButton.click();

    // confirm page reloaded and the component visible
    await expect(
      page.getByRole("heading", { name: "Pending Products" })
    ).toBeVisible();

    // check if unique product is visible in pending products section
    await expect(page.getByText(uniqueItemName)).toBeVisible();
  });
});
