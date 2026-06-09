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
assert('Research app TS/TSX script tags are removed', !/src="\.\/.*\.(ts|tsx)"/.test(indexHtml));
assert('StudyOSResearchApp fallback stub is defined', indexHtml.includes('window.StudyOSResearchApp = {'));
assert('Fallback stub references localhost Nex activation hint', indexHtml.includes('Connect local Nex server at localhost:8765'));
assert('Layout preference map routes Analytics Dashboard to dashboard', indexHtml.includes('"Analytics Dashboard": "dashboard"'));
assert('Layout preference map routes Study Engine to engine', indexHtml.includes('"Study Engine": "engine"'));
assert('Tracker rejects mock scores outside 0–100', indexHtml.includes("if (score < 0 || score > 100)"));
assert('Vault download uses data-vault-download listeners', indexHtml.includes('data-vault-download') && indexHtml.includes('querySelectorAll("[data-vault-download]")'));
assert('PhysicsController stores window mouse handlers for cleanup', indexHtml.includes('this._onMouseMove = m;') && indexHtml.includes('this._onMouseUp = e2;'));
assert('PhysicsController cleanup detaches window mouse handlers', indexHtml.includes('window.removeEventListener("mousemove", this._onMouseMove);') && indexHtml.includes('window.removeEventListener("mouseup", this._onMouseUp);'));
assert('Kinetic DOWN swipe path explicitly requeues card', indexHtml.includes('if (dir === "DOWN") {') && indexHtml.includes('this.pool.push(d);'));
assert('Kinetic progress bar is clamped between 0 and 100', indexHtml.includes('Math.min(100, Math.max(0, ((this.total - this.pool.length) / this.total) * 100))'));

assert('Nex client wires /search endpoint', nexClient.includes("request('/search'"));
assert('Nex client wires /document endpoint', nexClient.includes("request('/document'"));
assert('Nex client wires /sources endpoint', nexClient.includes("request('/sources'"));
assert('Nex client wires /summary endpoint', nexClient.includes("request('/summary'"));
assert('Nex client wires /status endpoint', nexClient.includes("request('/status'"));

assert('Summary engine exposes generateSummary', summaryEngine.includes('async function generateSummary'));
assert('Summary engine returns structured output keys', summaryEngine.includes('bullet_points') && summaryEngine.includes('sources'));

module.exports = { passed, failed };
