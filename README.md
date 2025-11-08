# Gemini Homepage Playwright Tests

This project contains a lightweight Playwright Test setup to validate that the Gemini homepage is reachable and can accept a basic search query without authentication.

## Prerequisites

- Node.js 18 or newer
- npm 9 or newer

## Install

```bash
npm install
```

## Run Tests

```bash
npm test
```

### Useful Variants

- `npm run test:headed` &mdash; executes tests in a visible browser window.
- `npm run test:ui` &mdash; opens the Playwright test runner UI for debugging.

## Project Layout

- `playwright.config.ts` &mdash; shared Playwright configuration with Gemini base URL.
- `tests/gemini-home.spec.ts` &mdash; smoke test covering homepage load and a simple search submission.

## Notes

- The search flow relies on common Gemini selectors. If the public site changes, update the locators in `tests/gemini-home.spec.ts`.
- Browser binaries are managed via `npx playwright install`. Re-run the command if you delete the Playwright cache.

