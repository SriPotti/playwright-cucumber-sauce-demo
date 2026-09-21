# Proposed Architecture
Proposed Architecture
<img width="487" height="687" alt="Screenshot 2026-09-21 at 5 32 06 PM" src="https://github.com/user-attachments/assets/14b772e2-35f8-4d27-b8ae-3b86de975f2f" />



# Playwright + Cucumber BDD: Sauce Demo

A public-repository-ready TypeScript framework for testing [Sauce Demo](https://sauce-demo.myshopify.com/) with Playwright browser automation and Cucumber BDD.

## Included

- Gherkin feature files
- Cucumber step definitions
- Page Object Model classes
- Chromium, Firefox, or WebKit selection through an environment variable
- Cucumber HTML and JSON reports
- Screenshots and Playwright traces on failure
- GitHub Actions CI
- Passing smoke scenarios
- Deliberately broken-locator and application-failure scenarios, isolated with `@known_failure`

## Project structure

```text
features/                  Business-readable Gherkin scenarios
src/pages/                 Page Object Model classes
src/step_definitions/      Step implementation
src/support/               Custom World and lifecycle hooks
scripts/                   Report generator
.github/workflows/         CI pipeline
reports/                   Generated reports, ignored by Git
```

## Setup

```bash
npm install
npx playwright install --with-deps chromium
cp .env.example .env
```

Environment variables are optional. The framework defaults to the public Sauce Demo URL, Chromium, and headless execution.

## Run

```bash
npm test                    # normal tests, excludes known failures
npm run test:smoke          # smoke suite
npm run test:known-failures # deliberately failing examples
npm run test:all            # everything
npm run typecheck
```

Open `reports/cucumber-report.html` for Cucumber's built-in report. The post-test script also creates the richer report under `reports/html/` when the standard `npm test` command reaches `posttest`.

## Why the failing tests are separated

`features/known_failures.feature` is intentionally red. It demonstrates:

1. **Broken locator:** `HomePage` and `ProductPage` contain clearly marked negative-test methods that use IDs or attributes that do not exist.
2. **Application/data failure:** the test expects a different demo product that is absent.
3. **Business expectation failure:** the test expects an empty cart to be populated.

These examples are useful for reporting, screenshots, traces, and debugging workshops. They are tagged `@known_failure` and excluded from default CI so failures are explicit rather than accidental.

## Create the public GitHub repository

```bash
git init
git add .
git commit -m "feat: add Playwright Cucumber BDD framework"
git branch -M main
gh repo create playwright-cucumber-sauce-demo --public --source=. --remote=origin --push
```

If GitHub CLI is unavailable, create an empty public repository in GitHub, then run:

```bash
git remote add origin https://github.com/YOUR_USERNAME/playwright-cucumber-sauce-demo.git
git push -u origin main
```

## Locator guidance

Production POMs prefer Playwright's user-facing locators such as `getByRole`, `getByLabel`, and `getByText`. Intentionally brittle selectors are kept inside the relevant Page Objects and are clearly labeled as educational anti-patterns. `HomePage.ts` contains the incorrect catalog locator, while `ProductPage.ts` contains the incorrect product-heading locator.

## Responsible use

This framework targets a public demo shop. Keep traffic low, avoid load testing, and do not automate checkout/payment activity without site-owner permission.
