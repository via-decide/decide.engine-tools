/**
 * Unit tests for tests/smoke/tools.smoke.js helper logic.
 * Regression: missing Playwright browser executable should be handled gracefully.
 */

const { isMissingBrowserExecutableError } = require('../smoke/tools.smoke.js');

let passed = 0;
let failed = 0;

function assert(label, condition) {
  if (condition) {
    console.log(`  ✓ ${label}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${label}`);
    failed++;
  }
}

console.log('\n── Smoke Tools ──');

assert(
  'detects missing browser executable error signature',
  isMissingBrowserExecutableError({ message: 'browserType.launch: Executable doesn\'t exist at /tmp/chrome' }) === true
);

assert(
  'ignores generic runtime errors',
  isMissingBrowserExecutableError({ message: 'Timeout 30000ms exceeded' }) === false
);

assert(
  'returns false for malformed error objects',
  isMissingBrowserExecutableError({}) === false
);

module.exports = { passed, failed };
