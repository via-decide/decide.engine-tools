const fs = require('fs');
const path = require('path');

function read(file) {
  return fs.readFileSync(path.join(__dirname, '../..', file), 'utf8');
}

const html = read('Highway-V2I dashboard simulation.html');
const labEngine = read('highway-v2i-lab/simulation/lab-engine.js');
const evolution = read('highway-v2i-lab/protocols/protocol-evolution.js');
const experiment = read('highway-v2i-lab/experiments/experiment-runner.js');

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

console.log('\n── HighwayV2ILab ──');

assert('protocol lab panel exists', html.includes('Protocol Lab'));
assert('evolution trigger button exists', html.includes('id="run-evolution-btn"'));
assert('generation selector exists', html.includes('id="generation-selector"'));
assert('network selector exists', html.includes('id="network-selector"'));
assert('behavior selector exists', html.includes('id="behavior-selector"'));
assert('architecture discovery button exists', html.includes('id="discover-architecture-btn"'));
assert('lab engine exposes runEvolution', labEngine.includes('function runEvolution(opts)'));
assert('lab engine includes >=5% success fallback logic', labEngine.includes('latencyGain >= 5 || reliabilityGain >= 5 || energyGain >= 5 || safetyGain >= 5'));
assert('evolution engine default population 80', evolution.includes('population: 80'));
assert('evolution engine default generations 200', evolution.includes('generations: 200'));
assert('experiment runner exports CSV helper', experiment.includes('function toCsv(rows)'));
assert('lab engine exposes architecture discovery', labEngine.includes('function discoverArchitecture(options)'));
assert('lab engine exposes invention mode', labEngine.includes('function runInventionMode(options)'));
assert('experiment runner exports architecture batch', experiment.includes('runArchitectureSearchBatch'));

module.exports = { passed, failed };
