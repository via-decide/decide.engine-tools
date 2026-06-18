const fs = require('fs');
const path = require('path');

class TraceWriter {
  constructor(repoPath) {
    this.repoPath = path.resolve(repoPath);
    this.tracesDir = path.join(this.repoPath, 'vault', 'traces');
  }

  async write(traceData) {
    console.log('[Trace Writer] Preparing execution trace file...');
    try {
      // Ensure vault/traces directory exists
      await fs.promises.mkdir(this.tracesDir, { recursive: true });

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `trace-${timestamp}.json`;
      const fullPath = path.join(this.tracesDir, filename);

      const logPayload = {
        timestamp: new Date().toISOString(),
        mission: traceData.mission || 'Unknown Mission',
        elapsedMs: traceData.elapsedMs || 0,
        tokensEstimate: traceData.tokensEstimate || 0,
        creditsSaved: traceData.creditsSaved || 0,
        metrics: {
          filesScanned: traceData.filesScanned || 0,
          techDebtScore: traceData.techDebtScore || 0,
          todosCount: traceData.todosCount || 0,
          emptyCatchesCount: traceData.emptyCatchesCount || 0,
          evalsCount: traceData.evalsCount || 0,
          duplicatesCount: traceData.duplicatesCount || 0
        },
        verification: {
          success: traceData.verificationSuccess ?? false,
          testsPassed: traceData.testsPassed || 0,
          testsFailed: traceData.testsFailed || 0,
          lintPassed: traceData.lintPassed ?? false
        },
        planPath: traceData.planPath || '',
        patchProposed: traceData.patchProposed || null,
        logs: traceData.logs || []
      };

      await fs.promises.writeFile(fullPath, JSON.stringify(logPayload, null, 2), 'utf8');
      console.log(`[Trace Writer] Trace successfully recorded: ${fullPath}`);

      return {
        success: true,
        tracePath: fullPath,
        filename
      };
    } catch (err) {
      console.error('[Trace Writer] Failed writing execution trace:', err);
      return {
        success: false,
        error: err.message
      };
    }
  }
}

module.exports = TraceWriter;
