const fs = require('fs');
const path = require('path');

const protocolCore = fs.readFileSync(path.join(__dirname, '../../engine/protocol-core.js'), 'utf8');
const protocolEvolution = fs.readFileSync(path.join(__dirname, '../../engine/protocol-evolution.js'), 'utf8');

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

console.log('\n── ProtocolEvolution ──');

assert('Protocol core defines DSRC model', protocolCore.includes('DSRC_Model'));
assert('Protocol core defines C-V2X model', protocolCore.includes('CV2X_Model'));
assert('Protocol core defines AM-V2X model', protocolCore.includes('AMV2X_Model'));
assert('Protocol core contains AM-V2X relay policy', protocolCore.includes('shouldRelayAMV2X'));
assert('Evolution engine defaults generations to 200', protocolEvolution.includes('generations || 200'));
assert('Evolution engine supports protocol+infrastructure genomes', protocolEvolution.includes('createInfrastructureGenome'));
assert('Evolution engine exposes CSV export', protocolEvolution.includes('toCsvRows'));
assert('Evolution engine calculates improvements against DSRC baseline', protocolEvolution.includes('vsDSRC'));

module.exports = { passed, failed };
