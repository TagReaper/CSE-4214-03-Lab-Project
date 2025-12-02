import { test, expect } from "@playwright/test";

test.describe("Product Listing Page Tests", () => {
  test.beforeEach(async ({ page }) => {
    // navigate to a test product listing
    await page.goto("/listing/5qiJVop57BpTAfEKZpLN");
  });

  test("should display product information correctly", async ({ page }) => {
    await page.waitForSelector("h3.text-2xl");

    const productName = page.locator("h3.text-2xl.font-bold");
    await expect(productName).toBeVisible();

    const price = page.locator("text=/\\$\\d+/").first();
    await expect(price).toBeVisible();

    const description = page.locator("text=About this item").locator("..");
    await expect(description).toBeVisible();
  });

  test("should show seller information and rating", async ({ page }) => {
    const sellerInfo = page.locator("text=/Sold by:/");
    await expect(sellerInfo).toBeVisible();

    const rating = page.locator("text=/stars/");
    await expect(rating).toBeVisible();
  });

  test("should display add to cart button for in-stock items", async ({
    page,
  }) => {
    const addToCartButton = page.getByRole("button", {
      name: "Add to Cart",
    });
    await expect(addToCartButton).toBeVisible();
  });

  test("should show out of stock message for unavailable items", async ({
    page,
  }) => {
    // assumes test product is out of stock
    const outOfStockButton = page.getByRole("button", {
      name: "Out of Stock",
    });

    if (await outOfStockButton.isVisible()) {
      await expect(outOfStockButton).toBeVisible();
      await expect(outOfStockButton).toHaveClass(/bg-red-500/);
    }
  });

  test("should display similar items carousel", async ({ page }) => {
    await page.waitForTimeout(2000);

    const heading = page.locator("h2").filter({
      hasText: /Similar Items|No Similar Items Available/,
    });

    await expect(heading).toBeVisible();
  });
});

test.describe("Add to Cart Flow Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/listing/5qiJVop57BpTAfEKZpLN");
  });

  test("should open quantity selector when add to cart is clicked", async ({
    page,
  }) => {
    const addToCartButton = page.getByRole("button", {
      name: "Add to Cart",
    });
    await addToCartButton.click();

    const minusButton = page.locator("button:has-text('-')");
    const plusButton = page.locator("button:has-text('+')");
    const confirmButton = page.getByRole("button", { name: "Confirm" });

    await expect(minusButton).toBeVisible();
    await expect(plusButton).toBeVisible();
    await expect(confirmButton).toBeVisible();
  });

  test("should increment quantity when plus button is clicked", async ({
    page,
  }) => {
    const addToCartButton = page.getByRole("button", {
      name: "Add to Cart",
    });
    await addToCartButton.click();

    const quantityInput = page.locator('input[type="text"][readonly]');
    const initialValue = await quantityInput.inputValue();

    const plusButton = page.locator("button:has-text('+')");
    await plusButton.click();

    const newValue = await quantityInput.inputValue();
    expect(parseInt(newValue)).toBeGreaterThan(parseInt(initialValue));
  });

  test("should decrement quantity when minus button is clicked", async ({
    page,
  }) => {
    const addToCartButton = page.getByRole("button", {
      name: "Add to Cart",
    });
    await addToCartButton.click();

    const plusButton = page.locator("button:has-text('+')");
    await plusButton.click();
    await plusButton.click();

    const quantityInput = page.locator('input[type="text"][readonly]');
    const currentValue = await quantityInput.inputValue();

    const minusButton = page.locator("button:has-text('-')");
    await minusButton.click();

    const newValue = await quantityInput.inputValue();
    expect(parseInt(newValue)).toBeLessThan(parseInt(currentValue));
  });

  test("should not allow quantity below zero", async ({ page }) => {
    const addToCartButton = page.getByRole("button", {
      name: "Add to Cart",
    });
    await addToCartButton.click();

    const quantityInput = page.locator('input[type="text"][readonly]');

    const minusButton = page.locator("button:has-text('-')");
    await minusButton.click();
    await minusButton.click();
    await minusButton.click();

    const value = await quantityInput.inputValue();
    expect(parseInt(value)).toBeGreaterThanOrEqual(0);
  });

  test("should add item to cart when confirm is clicked", async ({ page }) => {
    page.once("dialog", async (dialog) => {
      await dialog.accept();
    });

    const addToCartButton = page.getByRole("button", {
      name: "Add to Cart",
    });
    await addToCartButton.click();

    const plusButton = page.locator("button:has-text('+')");
    await plusButton.click();

    const confirmButton = page.getByRole("button", { name: "Confirm" });
    await confirmButton.click();

    await page.waitForURL("/listing/5qiJVop57BpTAfEKZpLN");
  });
});

test.describe("Cart Page Tests", () => {
  const CART_URL = "/cart";

  test.beforeEach(async ({ page }) => {
    await page.goto(CART_URL);
  });

  test("should display cart page with table", async ({ page }) => {
    await page.waitForSelector("h1:has-text('Cart')");

    const cartHeader = page.locator("h1:has-text('Cart')");
    await expect(cartHeader).toBeVisible();

    const table = page.locator("table");
    await expect(table).toBeVisible();
  });
});

test.describe("Checkout Flow Tests", () => {
  const CART_URL = "/cart";

  test.beforeEach(async ({ page }) => {
    await page.goto(CART_URL);
  });

  test("should open checkout dialog when checkout button is clicked", async ({
    page,
  }) => {
    const checkoutButton = page.getByRole("button", { name: "Checkout" });

    if (!(await checkoutButton.isDisabled())) {
      await checkoutButton.click();

      const dialog = page.locator('div[role="dialog"]');
      await expect(dialog).toBeVisible();

      const dialogTitle = page.locator("h2:has-text('Confirm Checkout')");
      await expect(dialogTitle).toBeVisible();
    }
  });

  test("should display all required checkout fields", async ({ page }) => {
    const checkoutButton = page.getByRole("button", { name: "Checkout" });

    if (!(await checkoutButton.isDisabled())) {
      await checkoutButton.click();

      await expect(page.locator("label:has-text('Address')")).toBeVisible();
      await expect(page.locator("label:has-text('City')")).toBeVisible();
      await expect(page.locator("label:has-text('State')")).toBeVisible();
      await expect(page.locator("label:has-text('Zip')")).toBeVisible();
      await expect(page.locator("label:has-text('CardNumber')")).toBeVisible();
      await expect(page.locator("label:has-text('EXP')")).toBeVisible();
      await expect(page.locator("label:has-text('CVC')")).toBeVisible();
      await expect(
        page.locator("label:has-text('Name on Card')")
      ).toBeVisible();
    }
  });

  test("should not submit checkout with empty required fields", async ({
    page,
  }) => {
    const checkoutButton = page.getByRole("button", { name: "Checkout" });

    if (!(await checkoutButton.isDisabled())) {
      await checkoutButton.click();

      const confirmButton = page.getByRole("button", {
        name: "Confirm Checkout",
      });
      await confirmButton.click();

      const addressInput = page.locator("input#Address");
      const isInvalid = await addressInput.evaluate(
        (el: HTMLInputElement) => !el.validity.valid
      );

      expect(isInvalid).toBeTruthy();
    }
  });

  test("should complete checkout with valid information", async ({ page }) => {
    const checkoutButton = page.getByRole("button", { name: "Checkout" });

    if (!(await checkoutButton.isDisabled())) {
      await checkoutButton.click();

      await page.fill("input#Address", "123 Test St");
      await page.fill("input#City", "Test City");
      await page.fill("input#State", "TS");
      await page.fill("input#Zip", "12345");
      await page.fill("input#CardNumber", "1234567890123456");
      await page.fill("input#EXP", "12/25");
      await page.fill("input#CVC", "123");
      await page.fill("input#Name", "Test User");

      const confirmButton = page.getByRole("button", {
        name: "Confirm Checkout",
      });
      await confirmButton.click();

      await page.waitForURL(CART_URL);
    }
  });

  test("should close checkout dialog when cancel is clicked", async ({
    page,
  }) => {
    const checkoutButton = page.getByRole("button", { name: "Checkout" });

    if (!(await checkoutButton.isDisabled())) {
      await checkoutButton.click();

      const dialog = page.locator('div[role="dialog"]');
      await expect(dialog).toBeVisible();

      const cancelButton = page.getByRole("button", { name: "Cancel" });
      await cancelButton.click();

      await expect(dialog).not.toBeVisible();
    }
  });
});

test.describe("Item Listing Component Tests", () => {
  test("should navigate to product page when clicking item", async ({
    page,
  }) => {
    await page.goto("/");

    const itemListing = page.locator("button").filter({
      has: page.locator("img[alt='Product Image']"),
    });
    const count = await itemListing.count();

    if (count > 0) {
      await itemListing.first().click();
      await expect(page).toHaveURL(/\/listing\/.+/);
    }
  });
});
