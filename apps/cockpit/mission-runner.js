const path = require('path');
const fs = require('fs');
const RepoScanner = require('./missions/scanner');
const ImprovementPlanner = require('./missions/planner');
const VerificationEngine = require('./missions/verifier');
const TraceWriter = require('./missions/tracer');

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class MissionRunner {
  constructor(repoPath, missionName = "Default Mission") {
    this.repoPath = path.resolve(repoPath);
    this.missionName = missionName;
    this.statePath = path.join(this.repoPath, 'cockpit', 'dashboard', 'cockpit-state.json');
    
    this.scanner = new RepoScanner(this.repoPath);
    this.planner = new ImprovementPlanner(this.repoPath);
    this.verifier = new VerificationEngine(this.repoPath);
    this.tracer = new TraceWriter(this.repoPath);

    this.state = {
      lastRun: null,
      mission: this.missionName,
      status: 'Idle',
      liveTask: 'None',
      agentHealth: { successRate: 'N/A', tokenUsage: 0, executionTimeMs: 0, creditsSaved: 0 },
      repoHealth: { complexityScore: 0, techDebtScore: 0, todoCount: 0, emptyCatchCount: 0, evalCount: 0, duplicateCount: 0 },
      queue: [],
      logs: []
    };
    this.logs = [];
    this.startTime = Date.now();
  }

  logMessage(msg) {
    const formatted = `[${new Date().toLocaleTimeString()}] ${msg}`;
    console.log(formatted);
    this.logs.push(formatted);
    this.state.logs = this.logs.slice(-30);
    this.updateDashboardState();
  }

  async updateDashboardState(status = 'Active', phase = 'Running') {
    try {
      this.state.lastRun = new Date().toISOString();
      this.state.status = status;
      this.state.liveTask = phase;
      await fs.promises.mkdir(path.dirname(this.statePath), { recursive: true });
      await fs.promises.writeFile(this.statePath, JSON.stringify(this.state, null, 2), 'utf8');
    } catch (e) {
      console.error('[Mission Runner] Failed to update dashboard state', e);
    }
  }

  async execute() {
    this.logMessage(`Mission Control Sequence Initiated: ${this.missionName}`);
    await this.updateDashboardState('Active', 'Initializing');

    // 1. Scanner (Measure)
    this.logMessage('Phase 1: Scanner (Measuring codebase)...');
    await this.updateDashboardState('Active', 'Scanning');
    const scanResult = await this.scanner.scan();
    
    const todosCount = scanResult.techDebt.todoList.length;
    const evalsCount = scanResult.techDebt.evalList.length;
    const duplicatesCount = scanResult.techDebt.duplicateBlocks.length;
    const emptyCatchesCount = scanResult.techDebt.emptyCatches.length;
    
    const debtScore = todosCount * 1 + emptyCatchesCount * 3 + evalsCount * 10 + duplicatesCount * 5;
    this.state.repoHealth = {
      complexityScore: scanResult.architecture.totalFiles > 50 ? 35 : 15,
      techDebtScore: debtScore,
      todoCount: todosCount,
      emptyCatchCount: emptyCatchesCount,
      evalCount: evalsCount,
      duplicateCount: duplicatesCount
    };
    this.logMessage(`Scan Complete. Files: ${scanResult.filesScanned}, Debt Score: ${debtScore}`);

    // 2. Planner (Improve)
    this.logMessage('Phase 2: Planner (Formulating improvements)...');
    await this.updateDashboardState('Active', 'Planning');
    const planResult = await this.planner.plan(scanResult, this.missionName);
    
    // Update queue mock
    this.state.queue = scanResult.techDebt.todoList.slice(0, 3).map(item => ({
      issue: `TODO: ${item.file}`,
      impact: "Medium",
      complexity: "Low",
      status: "Proposed"
    }));

    this.logMessage(`Plan Complete: ${planResult.planPath}`);

    // 3. Verifier (Verify)
    this.logMessage('Phase 3: Verifier (Running tests & syntax checks)...');
    await this.updateDashboardState('Active', 'Verifying');
    const verifyResult = await this.verifier.verify();
    
    if (verifyResult.success) {
      this.logMessage('Verification Passed ✅');
    } else {
      this.logMessage('Verification Failed ❌');
    }

    // Metrics calculation
    this.logMessage('Phase 4: Metrics (Computing token/time savings)...');
    const executionTimeMs = Date.now() - this.startTime;
    const tokenUsage = Math.round(scanResult.filesScanned * 150 + todosCount * 80 + 4000);
    const creditsSaved = Math.round(((scanResult.filesScanned * 0.05 + 5) * 100)) / 100;

    this.state.agentHealth = {
      successRate: verifyResult.success ? '100%' : '0%',
      tokenUsage,
      executionTimeMs,
      creditsSaved
    };

    // 4. Trace (Vault)
    this.logMessage('Phase 5: Trace & Vault (Saving execution trace)...');
    await this.updateDashboardState('Active', 'Tracing');
    
    const tracePayload = {
      mission: this.missionName,
      elapsedMs: executionTimeMs,
      tokensEstimate: tokenUsage,
      creditsSaved,
      filesScanned: scanResult.filesScanned,
      techDebtScore: debtScore,
      todosCount,
      emptyCatchesCount,
      evalsCount,
      duplicatesCount,
      verificationSuccess: verifyResult.success,
      testsPassed: verifyResult.passedCount,
      testsFailed: verifyResult.failedCount,
      lintPassed: verifyResult.lintPassed,
      planPath: planResult.planPath,
      logs: this.logs
    };
    
    const vaultResult = await this.tracer.write(tracePayload);
    this.logMessage(`Trace written to: ${vaultResult.filename}`);

    // 5. Dashboard (Final update)
    this.logMessage(`Mission Sequence Complete. Total Time: ${(executionTimeMs / 1000).toFixed(2)}s`);
    await this.updateDashboardState('Idle', 'Completed');
    
    return vaultResult;
  }
}

// Run if called from CLI
if (require.main === module) {
  const targetRepo = process.argv[2] ? path.resolve(process.cwd(), process.argv[2]) : path.join(__dirname, '..');
  const runner = new MissionRunner(targetRepo, 'Cockpit v0.2 Verification Mission');
  runner.execute().catch(e => {
    console.error('Fatal execution error:', e);
    process.exit(1);
  });
}

module.exports = MissionRunner;
