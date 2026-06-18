const fs = require('fs');
const path = require('path');

const global_mock = {
  localStorage: {
    _data: {},
    getItem(key) { return this._data[key] || null; },
    setItem(key, value) { this._data[key] = String(value); }
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

loadIIFE(path.join(__dirname, '../../ai/environment-builder.js'), /\}\)\(window\);?\s*$/);
loadIIFE(path.join(__dirname, '../../ai/game-scaffold-generator.js'), /\}\)\(window\);?\s*$/);
loadIIFE(path.join(__dirname, '../../ai/simulation-generator.js'), /\}\)\(window\);?\s*$/);
loadIIFE(path.join(__dirname, '../../ai/pipeline.js'), /\}\)\(window\);?\s*$/);

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

console.log('\n── AISimulationPipeline ──');

const parsed = global_mock.AISimulationPipeline.parseRequest('Create a city simulation');
assert('parseRequest extracts readable name', parsed.name === 'a city simulation');

const selected = global_mock.AISimulationPipeline.selectTemplate(parsed, '');
assert('selectTemplate infers simulation template', selected === 'simulation');

const generated = global_mock.AISimulationPipeline.generateModule(parsed, selected, { creator: 'zayvora' });
assert('generated module has normalized name', generated.name === 'a-city-simulation');
assert('generated config has creator metadata', generated.config.creator === 'zayvora');
assert('generated state factory exists', typeof generated.definition.gameFactory === 'function');

const all = global_mock.SimulationGenerator.getAllGenerated();
assert('generated module persisted in store', all.length === 1);

module.exports = { passed, failed };
