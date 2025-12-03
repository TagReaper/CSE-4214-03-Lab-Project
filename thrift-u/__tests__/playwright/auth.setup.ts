import { test as setup } from "@playwright/test";

const buyerAuthFile = "playwright/.auth/buyer.json";
const sellerAuthFile = "playwright/.auth/seller.json";
const adminAuthFile = "playwright/.auth/admin.json";

// setup buyer authentication
setup("authenticate as buyer", async ({ page }) => {
  if (!process.env.BUYER_EMAIL || !process.env.BUYER_PASSWORD) {
    throw new Error("BUYER_EMAIL and BUYER_PASSWORD must be set in .env.test");
  }

  await page.goto("/login");

  await page.fill('input[type="email"]', process.env.BUYER_EMAIL);
  await page.fill('input[type="password"]', process.env.BUYER_PASSWORD);
  await page.getByRole("button", { name: "Sign In" }).click();
  await page.waitForURL("/");

  await page.context().storageState({ path: buyerAuthFile });
});

// setup seller authentication
setup("authenticate as seller", async ({ page }) => {
  if (!process.env.SELLER_EMAIL || !process.env.SELLER_PASSWORD) {
    throw new Error(
      "SELLER_EMAIL and SELLER_PASSWORD must be set in .env.test"
    );
  }

  await page.goto("/login");

  await page.fill('input[type="email"]', process.env.SELLER_EMAIL);
  await page.fill('input[type="password"]', process.env.SELLER_PASSWORD);
  await page.getByRole("button", { name: "Sign In" }).click();
  await page.waitForURL("/");

  await page.context().storageState({ path: sellerAuthFile });
});

// setup admin authentication
setup("authenticate as admin", async ({ page }) => {
  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env.test");
  }

  await page.goto("/login");

  await page.fill('input[type="email"]', process.env.ADMIN_EMAIL);
  await page.fill('input[type="password"]', process.env.ADMIN_PASSWORD);
  await page.getByRole("button", { name: "Sign In" }).click();
  await page.waitForURL("/");

  await page.context().storageState({ path: adminAuthFile });
});
