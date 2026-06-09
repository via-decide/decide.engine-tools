/**
 * Regression test: StudyOS should not remain black-screen
 * when auth readiness never fires.
 */

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '../..');
const studyOSHtml = fs.readFileSync(path.join(root, 'StudyOS/index.html'), 'utf8');

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

console.log('\n── StudyOS Auth Fallback ──');

assert(
  'Bootloader.init defines one-shot safeStart guard',
  studyOSHtml.includes('const safeStart = () => {') && studyOSHtml.includes('if (started) return;')
);

assert(
  'Bootloader.init sets auth readiness timeout fallback',
  studyOSHtml.includes('Auth readiness timeout') && studyOSHtml.includes('setTimeout(() => {')
);

assert(
  'Bootloader.init handles missing _VD_AUTH.onReady by starting app',
  studyOSHtml.includes('!window._VD_AUTH || typeof _VD_AUTH.onReady !== "function"')
);

module.exports = { passed, failed };
