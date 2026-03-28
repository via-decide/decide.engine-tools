#!/usr/bin/env node
/**
 * Master test runner
 * Runs unit tests first (fast, no deps), then smoke tests (Playwright)
 */

const { execSync } = require('child_process');

console.log('╔═══════════════════════════════════╗');
console.log('║  ViaDecide Studio — Full Test Run ║');
console.log('╚═══════════════════════════════════╝\n');

let exitCode = 0;

// Unit tests — no install required
console.log('[ 1/2 ] Unit Tests...\n');
try {
  execSync('node tests/unit/run.js', { stdio: 'inherit' });
} catch {
  exitCode = 1;
}

// Smoke tests — requires playwright
console.log('\n[ 2/2 ] Smoke Tests...\n');
try {
  execSync('node tests/smoke/run.js', { stdio: 'inherit' });
} catch {
  exitCode = 1;
}

console.log(exitCode === 0
  ? '\n✓ All tests passed\n'
  : '\n✗ Tests failed — fix before shipping\n'
);
process.exit(exitCode);
