/**
 * Unit tests for dashboard launcher module wiring.
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

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

console.log('\n── Dashboard Module Loader ──');

const root = path.join(__dirname, '../..');
const dashboardHtml = fs.readFileSync(path.join(root, 'dashboard/index.html'), 'utf8');
assert('dashboard workspace container is present', dashboardHtml.includes('id="workspace"'));
assert('dashboard includes module cards', dashboardHtml.includes('data-module="tools"') && dashboardHtml.includes('data-module="hex-wars"'));

const moduleLoaderCode = fs.readFileSync(path.join(root, 'ui/module-loader.js'), 'utf8');
const sandbox = { window: {}, console };
vm.createContext(sandbox);
vm.runInContext(moduleLoaderCode, sandbox);
const paths = sandbox.window.VDModuleLoader && sandbox.window.VDModuleLoader.MODULE_PATHS;

assert('module loader exports MODULE_PATHS map', typeof paths === 'object' && !!paths);
assert('module loader maps core dashboard modules', paths.workspace === '../workspace/index.html' && paths.tools === '../tools/index.html');
assert('module loader maps game modules', paths['hex-wars'] === '../tools/games/hex-wars/index.html');

module.exports = { passed, failed };
