const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');
const https = require('https');
const MissionRunner = require('../mission-runner');

const REPO_OWNER = 'via-decide';
const REPO_NAME = 'decide.engine-tools';

function fetchPatch(prNumber) {
  const url = `https://patch-diff.githubusercontent.com/raw/${REPO_OWNER}/${REPO_NAME}/pull/${prNumber}.patch`;
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        if (res.statusCode === 301 || res.statusCode === 302) {
            https.get(res.headers.location, (redirRes) => {
                let data = '';
                redirRes.on('data', chunk => data += chunk);
                redirRes.on('end', () => resolve(data));
            }).on('error', reject);
        } else {
            return reject(new Error(`Failed to fetch patch: ${res.statusCode}`));
        }
        return;
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function consolidatePRs() {
  console.log('[PR Consolidation Mission] Starting execution...');
  
  const reportPath = path.resolve(__dirname, '../../../vault/reports/PR_AUDIT_REPORT.md');
  const report = await fs.promises.readFile(reportPath, 'utf8');
  
  // Extract MERGEABLE PRs
  const mergeablePrs = [];
  const lines = report.split('\n');
  for (const line of lines) {
    if (line.includes('MERGEABLE ✅')) {
      const match = line.match(/\[#(\d+)\]/);
      if (match && match[1]) {
        mergeablePrs.push(match[1]);
      }
    }
  }
  
  console.log(`[PR Consolidation Mission] Found ${mergeablePrs.length} mergeable PRs.`);
  
  let successCount = 0;
  let failCount = 0;
  
  for (const pr of mergeablePrs) {
    console.log(`\nFetching patch for PR #${pr}...`);
    try {
      const patchData = await fetchPatch(pr);
      const patchFile = path.resolve(__dirname, `../../../.git/pr-${pr}.patch`);
      await fs.promises.writeFile(patchFile, patchData);
      
      console.log(`Applying PR #${pr}...`);
      try {
        execSync(`git am -3 ${patchFile}`, { stdio: 'pipe' });
        console.log(`✅ Successfully applied PR #${pr}`);
        successCount++;
      } catch (applyError) {
        console.error(`❌ Conflict applying PR #${pr}. Aborting am...`);
        execSync('git am --abort', { stdio: 'pipe' });
        failCount++;
      }
      
      await fs.promises.unlink(patchFile);
    } catch (err) {
      console.error(`Failed to fetch/apply PR #${pr}:`, err.message);
      failCount++;
    }
  }
  
  console.log(`\n[PR Consolidation Mission] Application Phase Complete.`);
  console.log(`Applied: ${successCount} | Failed: ${failCount}`);
  
  console.log('\n[PR Consolidation Mission] Handing over to Cockpit MissionRunner for verification...');
  
  const repoPath = path.resolve(__dirname, '../../..');
  const runner = new MissionRunner(repoPath, 'Mega PR Consolidation');
  
  // We attach custom logic to the logs so we can see the cockpit output
  runner.logMessage(`Starting Mega PR Validation. Merged ${successCount} PRs.`);
  
  try {
    const trace = await runner.execute();
    console.log('\n[PR Consolidation Mission] Cockpit Validation Complete!');
    console.log(`Trace saved to: ${trace.filename}`);
    
    if (trace.verificationSuccess) {
      console.log('✅ REPOSITORY HEALTH IS NOMINAL. READY TO PUSH.');
    } else {
      console.log('❌ REPOSITORY VALIDATION FAILED. CHECK TRACE LOGS.');
    }
  } catch (err) {
    console.error('Cockpit validation failed fatally:', err);
  }
}

if (require.main === module) {
  consolidatePRs().catch(console.error);
}
