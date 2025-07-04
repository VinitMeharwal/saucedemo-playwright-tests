# Swag Labs Playwright Test Automation

## Overview
Hi,

This project demonstrates automated end-to-end testing of the SauceDemo e-commerce website (https://www.saucedemo.com/) using Playwright and TypeScript. It covers login, add-to-cart, and checkout flows with both positive and negative test cases, following best practices such as the Page Object Model and data-driven testing.


## Project Structure

- `src/pages/` – Page Object Model classes for each page (Login, Products, Cart, Checkout, etc.)
- `src/e2e/` – End-to-end test suites:
  - `login.spec.ts` – Login scenarios
  - `cart.spec.ts` – Cart add/remove/verify scenarios
  - `checkout.spec.ts` – Checkout and negative scenarios
  - `price-validation.spec.ts` – Price consistency across pages
  - `e2e.spec.ts` – Full purchase flow
- `playwright.config.ts` – Playwright configuration
- `tsconfig.json` – TypeScript configuration
- `TEST_SCENARIOS.md` – List of all test scenarios and priorities


## Setup Instructions

1. **Install dependencies:**
   ```sh
   npm ci
   ```
2. **Run all tests:**
   ```sh
   npx playwright test
   ```
3. **Run a specific test file:**
   ```sh
   npx playwright test src/e2e/cart.spec.ts
   ```
4. **View HTML report:**
   ```sh
   npx playwright show-report
   ```
5. **Run in CI:**
   - See `.github/workflows/playwright.yml` for GitHub Actions pipeline.

## Test Scenarios

See `TEST_SCENARIOS.md` for a list of covered scenarios and their prioritization.


## Notes

- Node.js (v18 or later) must be installed on your system.
- `package-lock.json` is committed for reproducible CI builds.
- No need for `ts-node`; Playwright runs TypeScript directly.
- Tests use setup/teardown for reliability and independence.
- Reports are uploaded as GitHub Actions artifacts and can be published to GitHub Pages.


# 🧹 Test Lifecycle and Cleanup

This project uses the official [Playwright Test Runner](https://playwright.dev/docs/test-intro), which automatically handles:

- Launching a new browser context for each test
- Creating and disposing of pages
- Performing cleanup (closing pages and contexts) after each test

⚠️ Therefore, explicit calls like `page.close()` or `browser.close()` are not needed in individual test cases unless using custom browser management or advanced use cases.

This ensures that each test runs in an isolated, fresh environment without test leakage or state carryover.

---

For more, see [Playwright documentation](https://playwright.dev/) or the `TEST_SCENARIOS.md` file.
