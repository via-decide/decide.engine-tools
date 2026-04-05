/**
 * Smoke tests — load key tools in headless browser
 * Uses Playwright. Run: npm run test:smoke
 *
 * Tests the REAL tools at their REAL paths.
 * No mocking. If a tool loads without console errors → pass.
 */

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const ROOT = path.join(__dirname, '../..');

// Key tools to smoke test — one per category
// These are the tools paying subscribers will hit first
const SMOKE_TARGETS = [
  // Games (core Play Store draw)
  { id: 'snake-game',           path: 'tools/games/snake-game/index.html' },
  { id: 'hex-wars',             path: 'tools/games/hex-wars/index.html' },
  { id: 'freecell-classic',     path: 'tools/games/freecell-classic/index.html' },

  // Productivity (subscription value)
  { id: 'json-formatter',       path: 'tools/json-formatter/index.html' },
  { id: 'pomodoro',             path: 'tools/pomodoro/index.html' },
  { id: 'color-palette',        path: 'tools/color-palette/index.html' },
  { id: 'prompt-alchemy',       path: 'prompt-alchemy/index.html' },
  { id: 'idea-remixer',         path: 'tools/idea-remixer/index.html' },

  // Engine / Simulations
  { id: 'seed-quality-scorer',  path: 'tools/engine/seed-quality-scorer/index.html' },
  { id: 'daily-quest-generator',path: 'tools/engine/daily-quest-generator/index.html' },
  { id: 'highway-v2i-lab',       path: 'Highway-V2I dashboard simulation.html' },

  // Home shell
  { id: 'home',                 path: 'index.html' },
  { id: 'dashboard',            path: 'dashboard/index.html' },
  { id: 'workspace',            path: 'workspace/index.html' },
  { id: 'tool-catalog',         path: 'tools/index.html' },
];

function isMissingBrowserExecutableError(error) {
  if (!error || typeof error.message !== 'string') return false;
  return error.message.includes('Executable doesn\'t exist');
}

async function runSmokeTests() {
  console.log('\n── Smoke Tests (Playwright) ──\n');

  let browser;
  try {
    browser = await chromium.launch({ headless: true });
  } catch (error) {
    if (isMissingBrowserExecutableError(error)) {
      console.warn('  ⚠ Skipping smoke tests: Playwright browser executable is not installed.');
      console.warn('  ⚠ Run `npx playwright install chromium` in a network-enabled environment to enable smoke tests.');
      return { passed: 0, failed: 0, skipped: true, reason: 'missing-browser-executable' };
    }
    throw error;
  }

  const context = await browser.newContext();

  let passed = 0;
  let failed = 0;
  const failures = [];

  for (const tool of SMOKE_TARGETS) {
    const fullPath = path.join(ROOT, tool.path);

    // Verify file exists before browser load
    if (!fs.existsSync(fullPath)) {
      console.error(`  ✗ FILE MISSING: ${tool.id} → ${tool.path}`);
      failed++;
      failures.push({ id: tool.id, reason: 'File does not exist' });
      continue;
    }

    const page = await context.newPage();
    const criticalErrors = [];

    page.on('pageerror', err => {
      // Ignore Firebase/Google auth errors (expected without network)
      const msg = err.message || '';
      if (
        msg.includes('firebase') ||
        msg.includes('googleapis') ||
        msg.includes('gstatic') ||
        msg.includes('firestore') ||
        msg.includes('auth') ||
        msg.includes('CORS') ||
        msg.includes('Failed to fetch')
      ) return;
      criticalErrors.push(msg);
    });

    try {
      const fileUrl = `file://${fullPath}`;
      await page.goto(fileUrl, { timeout: 8000, waitUntil: 'domcontentloaded' });

      // Check document title exists (basic render test)
      const title = await page.title();
      const hasContent = title.length > 0;

      // Check for visible body content
      const bodyText = await page.evaluate(() => document.body?.innerText?.length || 0);

      if (criticalErrors.length > 0) {
        console.error(`  ✗ ${tool.id} — JS errors: ${criticalErrors[0]}`);
        failed++;
        failures.push({ id: tool.id, reason: criticalErrors[0] });
      } else if (!hasContent || bodyText < 10) {
        console.error(`  ✗ ${tool.id} — Blank page (title: "${title}", body: ${bodyText} chars)`);
        failed++;
        failures.push({ id: tool.id, reason: 'Blank page' });
      } else {
        console.log(`  ✓ ${tool.id} — "${title}" (${bodyText} chars)`);
        passed++;
      }
    } catch (err) {
      console.error(`  ✗ ${tool.id} — Load timeout or crash: ${err.message}`);
      failed++;
      failures.push({ id: tool.id, reason: err.message });
    } finally {
      await page.close();
    }
  }

  await browser.close();

  if (failures.length > 0) {
    console.log('\n  Failures:');
    failures.forEach(f => console.error(`    - ${f.id}: ${f.reason}`));
  }

  return { passed, failed, skipped: false };
}

module.exports = { runSmokeTests, SMOKE_TARGETS, isMissingBrowserExecutableError };

if (require.main === module) {
  runSmokeTests().then(({ passed, failed }) => {
    console.log(`\n  Smoke: ${passed} passed, ${failed} failed\n`);
    process.exit(failed > 0 ? 1 : 0);
  });
}
