#!/usr/bin/env node

const { runSmokeTests } = require('./tools.smoke.js');

console.log('═══════════════════════════════════');
console.log('  ViaDecide Studio — Smoke Tests');
console.log('  (Loads real tools in headless Chrome)');
console.log('═══════════════════════════════════');

runSmokeTests().then(({ passed, failed, skipped }) => {
  console.log('═══════════════════════════════════');
  if (skipped) {
    console.log('  Smoke tests skipped (missing browser runtime)');
    console.log('═══════════════════════════════════\n');
    process.exit(0);
  }

  console.log(`  Passed: ${passed}  Failed: ${failed}`);
  console.log('═══════════════════════════════════\n');
  process.exit(failed > 0 ? 1 : 0);
});
