# Testing Guide (Batch 1)

## Setup
```bash
npm ci
```

## Commands
```bash
# Full suite
npm test

# Unit-only
npm run test:unit

# Smoke-only
npm run test:smoke
```

## Expected Behavior
- If Playwright browser executable exists:
  - smoke tests execute and must pass/fail based on tool behavior.
- If executable is missing:
  - smoke tests report **skipped** with warning,
  - process exits successfully,
  - unit tests remain mandatory and must pass.

## Manual Verification Commands
```bash
node tests/smoke/run.js
node tests/unit/run.js
```

## Regression Covered
- Missing browser executable now follows a controlled skip path rather than crashing the test runner.
