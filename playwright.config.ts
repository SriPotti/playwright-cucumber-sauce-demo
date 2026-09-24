import { defineConfig } from "@playwright/test";

/**
 * Suite-root marker for `qafix doctor`. Cucumber remains the test runner;
 * Playwright Test is not used to execute scenarios.
 */
export default defineConfig({
  testDir: "./src",
  testMatch: /a^/,
  fullyParallel: false,
  retries: 0,
  use: {
    baseURL: process.env.BASE_URL || "https://sauce-demo.myshopify.com",
    browserName: "chromium",
    headless: process.env.HEADLESS !== "false",
    screenshot: "off",
    trace: "retain-on-failure",
    video: "off",
  },
});
