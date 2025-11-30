import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";

// load test environment variables
dotenv.config({ path: ".env.test" });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./__tests__/playwright",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: "html",
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    baseURL: "http://localhost:3000",

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
  },

  /* Configure projects for major browsers */
  projects: [
    // setup project
    { name: "setup", testMatch: /.*\.setup\.ts/ },

    // tests that require buyer authentication
    {
      name: "buyer",
      use: {
        ...devices["Desktop Chrome"],
        storageState: "playwright/.auth/buyer.json",
      },
      dependencies: ["setup"],
      testMatch: /.*buyer.*\.spec\.ts/,
    },

    // tests that require seller authentication
    {
      name: "seller",
      use: {
        ...devices["Desktop Chrome"],
        storageState: "playwright/.auth/seller.json",
      },
      dependencies: ["setup"],
      testMatch: /.*seller.*\.spec\.ts/,
    },

    // tests that require admin authentication
    {
      name: "admin",
      use: {
        ...devices["Desktop Chrome"],
        storageState: "playwright/.auth/admin.json",
      },
      dependencies: ["setup"],
      testMatch: /.*admin.*\.spec\.ts/,
    },

    // tests that don't require authentication
    {
      name: "unauthenticated",
      use: { ...devices["Desktop Chrome"] },
      testMatch: /.*\/(login|signup)\.spec\.ts/,
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: "npm run start",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
});
