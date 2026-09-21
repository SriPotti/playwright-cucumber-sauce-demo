import { After, Before, Status, setDefaultTimeout } from '@cucumber/cucumber';
import { chromium, firefox, webkit } from '@playwright/test';
import { CustomWorld } from './world';

setDefaultTimeout(30_000);

Before(async function (this: CustomWorld) {
  const name = (process.env.BROWSER || 'chromium').toLowerCase();
  const browserType = name === 'firefox' ? firefox : name === 'webkit' ? webkit : chromium;
  this.browser = await browserType.launch({ headless: process.env.HEADLESS !== 'false' });
  this.context = await this.browser.newContext({
    baseURL: process.env.BASE_URL || 'https://sauce-demo.myshopify.com',
    viewport: { width: 1440, height: 900 }
  });
  await this.context.tracing.start({ screenshots: true, snapshots: true, sources: true });
  this.page = await this.context.newPage();
});

After(async function (this: CustomWorld, scenario) {
  if (!this.context || !this.page) return;
  const failed = scenario.result?.status === Status.FAILED;
  const safeName = scenario.pickle.name.replace(/[^a-z0-9]+/gi, '-').toLowerCase();
  if (failed) {
    const screenshot = await this.page.screenshot({ fullPage: true });
    await this.attach(screenshot, 'image/png');
    await this.context.tracing.stop({ path: `test-results/${safeName}-trace.zip` });
  } else {
    await this.context.tracing.stop();
  }
  await this.context.close();
  await this.browser?.close();
});
