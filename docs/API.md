# API Notes (Batch 1)

## Smoke Test Helper API

### `isMissingBrowserExecutableError(error)`
- **Input:** error-like object
- **Output:** boolean
- **Purpose:** identifies Playwright bootstrap failure caused by missing browser binary.

### `runSmokeTests()`
- **Output:** object with fields:
  - `passed` (number)
  - `failed` (number)
  - `skipped` (boolean)
  - `reason` (string, optional)
