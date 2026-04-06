const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '../..');
const indexHtml = fs.readFileSync(path.join(root, 'StudyOS/index.html'), 'utf8');
const nexClient = fs.readFileSync(path.join(root, 'StudyOS/api/nex_client.ts'), 'utf8');
const summaryEngine = fs.readFileSync(path.join(root, 'StudyOS/services/summary_engine.ts'), 'utf8');

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

console.log('\n── StudyOS Nex Integration ──');

assert('Index includes Research tab', indexHtml.includes('data-tab="research"'));
assert('Index includes Sources tab', indexHtml.includes('data-tab="sources"'));
assert('Index includes Notes tab', indexHtml.includes('data-tab="notes"'));
assert('Index includes Corpus Stats tab', indexHtml.includes('data-tab="corpus-stats"'));

assert('Nex client wires /search endpoint', nexClient.includes("request('/search'"));
assert('Nex client wires /document endpoint', nexClient.includes("request('/document'"));
assert('Nex client wires /sources endpoint', nexClient.includes("request('/sources'"));
assert('Nex client wires /summary endpoint', nexClient.includes("request('/summary'"));
assert('Nex client wires /status endpoint', nexClient.includes("request('/status'"));

assert('Summary engine exposes generateSummary', summaryEngine.includes('async function generateSummary'));
assert('Summary engine returns structured output keys', summaryEngine.includes('bullet_points') && summaryEngine.includes('sources'));

module.exports = { passed, failed };
