const fs = require('fs');
const path = require('path');

const global_mock = {
  localStorage: {
    _data: {},
    getItem(key) { return this._data[key] || null; },
    setItem(key, value) { this._data[key] = String(value); },
    removeItem(key) { delete this._data[key]; }
  }
};

global_mock.window = global_mock;
global.window = global_mock;
global.localStorage = global_mock.localStorage;

function loadIIFE(filePath, replacePattern) {
  const source = fs.readFileSync(filePath, 'utf8');
  const sandboxed = source.replace(replacePattern, '})(global_mock);');
  eval(sandboxed);
}

loadIIFE(path.join(__dirname, '../../shared/tool-storage.js'), /\}\)\(window\);?\s*$/);
loadIIFE(path.join(__dirname, '../../marketplace/simulation-manifest.js'), /\}\)\(window\);?\s*$/);
loadIIFE(path.join(__dirname, '../../marketplace/security-check.js'), /\}\)\(window\);?\s*$/);
loadIIFE(path.join(__dirname, '../../marketplace/simulation-packager.js'), /\}\)\(window\);?\s*$/);
loadIIFE(path.join(__dirname, '../../marketplace/marketplace-client.js'), /\}\)\(window\);?\s*$/);
loadIIFE(path.join(__dirname, '../../marketplace/publish-simulation.js'), /\}\)\(window\);?\s*$/);

let passed = 0;
let failed = 0;

function assert(label, condition) {
  if (condition) {
    console.log(`  ✓ ${label}`);
    passed += 1;
  } else {
    console.error(`  ✗ FAIL: ${label}`);
    failed += 1;
  }
}

console.log('\n── SimulationMarketplace ──');

const manifest = global_mock.SimulationManifest.buildManifest({
  name: 'Mars Colony Economy',
  creator: 'user_id',
  engine: 'decide-engine',
  entry: 'games/mars/game-entry.js',
  version: '1.0',
  assets: ['games/mars/config/config.json']
});

assert('manifest creation includes required fields',
  manifest.name === 'Mars Colony Economy'
  && manifest.creator === 'user_id'
  && manifest.engine === 'decide-engine'
  && manifest.entry === 'games/mars/game-entry.js'
  && manifest.version === '1.0'
  && Array.isArray(manifest.assets)
  && typeof manifest.created_at === 'string');

const packaged = global_mock.SimulationPackager.packageSimulation({
  name: 'Mars Colony Economy',
  config: {
    title: 'Mars Colony Economy',
    creator: 'user_id',
    entry: 'games/mars/game-entry.js',
    type: 'simulation'
  },
  definition: {
    scripts: ['games/mars/scripts/simulation.js']
  },
  assets: ['games/mars/config/config.json']
});

assert('package generation creates dist pkg path', packaged.package_path === 'dist/mars-colony-economy.pkg');
assert('package contains manifest entry point', packaged.manifest.entry === 'games/mars/game-entry.js');

const launchUrl = global_mock.SimulationPublisher.buildLaunchUrl('Mars Colony Economy', { marketplaceBaseUrl: 'https://daxini.space' });
assert('launch URL generation is stable', launchUrl === 'https://daxini.space/simulations/mars-colony-economy');

global_mock.fetch = async (url) => {
  return {
    ok: true,
    async json() { return { ok: true, url }; },
    async text() { return ''; }
  };
};

const publishPromise = global_mock.SimulationPublisher.exportSimulation('mars', { creator: 'user_id' });
assert('publish pipeline returns a Promise', publishPromise && typeof publishPromise.then === 'function');

module.exports = { passed, failed };
