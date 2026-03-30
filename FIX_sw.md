# Fix: `sw.js` Syntax and Runtime Recovery

## Issue
`sw.js` contained broken/duplicated code fragments that caused syntax errors and prevented the service worker from loading.

## Root Cause
A malformed merge left partial duplicate blocks and mismatched braces in the service worker file.

## Solution
- Reconstructed a single valid service-worker implementation with:
  - install cache warmup (`SHELL_ASSETS`)
  - activate cache cleanup
  - fetch strategy (network-first for navigation, cache-first for static assets)
- Converted shell asset paths to relative (`./...`) to be compatible with GitHub Pages subpath hosting (`/decide.engine-tools/`).

## Code Changes
### Before
```javascript
const SHELL = [

const CACHE_NAME = 'viadecide-v1';
...
fetch(request).catch(() => caches.match('/index.html'))
'/shared/tool-registry.js'
];
```

### After
```javascript
const CACHE_NAME = 'viadecide-v1';
const SHELL_ASSETS = [
  './',
  './index.html',
  './router.js',
  ...
];
```

## Testing
```bash
node --check sw.js
npm test
```

## Expected Output
- `node --check sw.js` emits no syntax errors.
- `npm test` completes successfully (with smoke skipped only if Playwright browser binaries are unavailable).
