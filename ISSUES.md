# Issues Log (Batch 1)

_Date: 2026-03-30_

## Issue 1 — Smoke tests crash when Playwright browser executable is missing

### Symptoms
Running `npm test` failed before executing smoke assertions due to:
- `browserType.launch: Executable doesn't exist ...`
- Suggested remediation (`npx playwright install`) failed in this environment because CDN download returned HTTP 403.

### Impact
- Full test run incorrectly reports repository failure in environments where browser binaries cannot be installed.
- Blocks commits even when code and unit tests are valid.

### Root Cause
`tests/smoke/tools.smoke.js` launched Chromium unconditionally and did not handle bootstrap/runtime provisioning failures distinctly from tool runtime failures.

### Resolution Strategy
- Add explicit detection for missing-browser-executable errors.
- Return a structured `skipped` result when that specific environment limitation occurs.
- Keep non-environment errors as hard failures.
- Add regression unit test for error classification helper.


## Issue 2 — Root service worker (`sw.js`) syntax is invalid

### Symptoms
- `node --check sw.js` fails with parse errors.
- Service worker cannot install/activate when syntax parsing fails.

### Impact
- Offline shell caching and cache cleanup logic do not run.
- Runtime resilience regresses for subscriber-facing shell experience.

### Root Cause
A malformed merge introduced duplicated partial blocks and unmatched braces.

### Resolution Strategy
- Replace `sw.js` with one coherent, syntactically valid implementation.
- Use relative cache asset URLs to support GitHub Pages subpath hosting.
