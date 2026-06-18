const path = require('path');
const VerificationEngine = require('../../../agents/antigravity-code/verification-engine');

const repoPath = path.resolve(__dirname, '../..');

async function runCheck() {
  console.log('[Commit Gate] Initializing pre-commit validation tests...');
  const verifier = new VerificationEngine(repoPath);
  
  try {
    const result = await verifier.verify();
    
    if (!result.success) {
      console.error('\n[Commit Gate] ❌ VALIDATION FAILURE: One or more checks failed. Commit aborted.');
      result.errors.forEach(err => {
        console.error(`  - ${err}`);
      });
      process.exit(1);
    } else {
      console.log('\n[Commit Gate]  VALIDATION SUCCESS: All syntax checks and unit tests passed. Commit authorized.');
      process.exit(0);
    }
  } catch (err) {
    console.error('[Commit Gate] ❌ Fatal verification engine exception:', err.message);
    process.exit(1);
  }
}

runCheck();
