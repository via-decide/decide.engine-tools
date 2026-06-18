const https = require('https');
const fs = require('fs');
const path = require('path');

const REPO_OWNER = 'via-decide';
const REPO_NAME = 'decide.engine-tools';
const API_BASE = 'https://api.github.com';
const USER_AGENT = 'AntiGravity-Execution-Engine/1.0';

const OBSOLETE_PATHS = ['tools/', 'shared/', 'StudyOS/'];

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': USER_AGENT } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function runAudit() {
  console.log('[PR Auditor] Fetching open PRs...');
  const prs = await fetchJson(`${API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/pulls?state=open&per_page=100`);
  
  if (!Array.isArray(prs)) {
    throw new Error('Failed to fetch PRs: ' + JSON.stringify(prs));
  }
  
  console.log(`[PR Auditor] Found ${prs.length} open PRs. Analyzing files...`);
  
  let report = `# PR Audit Report (Generated autonomously)\n\n`;
  report += `*Total Open PRs: ${prs.length}*\n\n`;
  report += `| PR # | Title | Author | Status | Target Branch | Notes |\n`;
  report += `|---|---|---|---|---|---|\n`;

  for (const pr of prs) {
    process.stdout.write(`Analyzing PR #${pr.number}... `);
    const files = await fetchJson(`${API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/pulls/${pr.number}/files`);
    
    let isConflicted = false;
    let conflictPaths = [];
    
    if (Array.isArray(files)) {
      for (const file of files) {
        for (const obsolete of OBSOLETE_PATHS) {
          if (file.filename.startsWith(obsolete)) {
            isConflicted = true;
            if (!conflictPaths.includes(obsolete)) conflictPaths.push(obsolete);
          }
        }
      }
    }
    
    let status = 'MERGEABLE ✅';
    let notes = 'Appears safe';
    if (isConflicted) {
      status = 'CONFLICTED ❌';
      notes = `Targets obsolete paths: ${conflictPaths.join(', ')}. Requires migration to apps/ or packages/.`;
    }
    
    console.log(status);
    
    report += `| [#${pr.number}](${pr.html_url}) | ${pr.title} | @${pr.user.login} | **${status}** | \`${pr.base.ref}\` | ${notes} |\n`;
  }
  
  const reportPath = path.resolve(__dirname, '../../vault/reports/PR_AUDIT_REPORT.md');
  await fs.promises.mkdir(path.dirname(reportPath), { recursive: true });
  await fs.promises.writeFile(reportPath, report, 'utf8');
  
  console.log(`\n[PR Auditor] Audit complete. Report generated at: ${reportPath}`);
}

runAudit().catch(console.error);
