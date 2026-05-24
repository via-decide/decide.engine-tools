const fs = require('fs');
const os = require('os');
const path = require('path');

let passed = 0;
let failed = 0;

function assert(label, condition) {
  if (condition) { console.log(`  ✓ ${label}`); passed++; }
  else { console.error(`  ✗ FAIL: ${label}`); failed++; }
}

console.log('\n── LivingArchive ──');

const root = path.join(__dirname, '../../packages/living-archive');
[
  'README.md',
  'src/archive/archiveExperiment.ts',
  'src/indexing/indexExperiment.ts',
  'src/notes/emotionalNotes.ts',
  'src/lineage/lineageGraph.ts',
  'src/timeline/timelineView.ts',
  'src/replay/replayArchive.ts',
  'src/search/searchExperiments.ts',
  'src/discovery/discoveryMode.ts'
].forEach((f) => assert(`exists: ${f}`, fs.existsSync(path.join(root, f))));

const readme = fs.readFileSync(path.join(root, 'README.md'), 'utf8');
assert('readme forbids ranking', readme.includes('No ranking or scoring systems'));

const archiveSource = fs.readFileSync(path.join(root, 'src/archive/archiveExperiment.ts'), 'utf8');
assert('archive writes replay', archiveSource.includes('replay.json'));
assert('archive writes lineage', archiveSource.includes('lineage.json'));

module.exports = { passed, failed };
