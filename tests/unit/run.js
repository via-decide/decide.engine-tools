#!/usr/bin/env node
/**
 * Unit test runner — no external dependencies
 * Tests real shared utilities from the repo
 */

console.log('═══════════════════════════════════');
console.log('  ViaDecide Studio — Unit Tests');
console.log('═══════════════════════════════════');

const suites = [
  { name: 'EngineUtils',  file: './engine-utils.test.js' },
  { name: 'ToolBridge',   file: './tool-bridge.test.js' },
  { name: 'Router',       file: './router.test.js' },
  { name: 'SmokeTools',   file: './smoke-tools.test.js' },
  { name: 'StudyOSAuthFallback', file: './studyos-auth-fallback.test.js' },
  { name: 'StudyOSNexIntegration', file: './studyos-nex-integration.test.js' },
  { name: 'HighwaySimulation', file: './highway-simulation.test.js' },
  { name: 'ProtocolEvolution', file: './protocol-evolution.test.js' },
  { name: 'HighwayV2ILab', file: './highway-v2i-lab.test.js' },
  { name: 'ZayvoraPipelineScaffold', file: './zayvora-pipeline-scaffold.test.js' },
  { name: 'OrchadeFoundation', file: './orchade-foundation.test.js' },
  { name: 'DashboardModuleLoader', file: './dashboard-module-loader.test.js' },
  { name: 'AISimulationPipeline', file: './ai-simulation-pipeline.test.js' },
  { name: 'AIWorldPipeline', file: './ai-world-pipeline.test.js' },
  { name: 'SimulationMarketplace', file: './simulation-marketplace.test.js' },
  { name: 'DaxBundleForge', file: './dax-bundle-forge.test.js' },
  { name: 'PluginSystem', file: './plugin-system.test.js' },
  { name: 'Runtime', file: './runtime.test.js' },
  { name: 'TraceEngine', file: './trace-engine.test.js' },
  { name: 'StateRegistry', file: './state-registry.test.js' },
  { name: 'AgentManager', file: './agent-manager.test.js' },
  { name: 'ZayvoraConstraintRuntime', file: './zayvora-constraint-runtime.test.js' },
  { name: 'ZayvoraConstraintsPhase2to4', file: './zayvora-constraints-phase2-4.test.js' },
  { name: 'ReplayEngineArchitecture', file: './replay-engine-architecture.test.js' },
  { name: 'ConstraintLab', file: './constraint-lab.test.js' },
  { name: 'LivingArchive', file: './living-archive.test.js' },
  { name: 'SignalCapture', file: './signal-capture.test.js' },
  { name: 'ConstraintStudio', file: './constraint-studio.test.js' },
  { name: 'LocalCommitExecutor', file: './local-commit-executor.test.js' },
  { name: 'PEARunner', file: './pea-runner.test.js' },
  { name: 'ValidateTaskManifest', file: './validate-task-manifest.test.js' },
  { name: 'ToolTaskRouter', file: './tool-task-router.test.js' },
];

let totalPassed = 0;
let totalFailed = 0;

for (const suite of suites) {
  try {
    const result = require(suite.file);
    totalPassed += result.passed || 0;
    totalFailed += result.failed || 0;
  } catch (err) {
    console.error(`\n✗ Suite "${suite.name}" crashed:`, err.message);
    totalFailed++;
  }
}

console.log('\n═══════════════════════════════════');
console.log(`  Passed: ${totalPassed}  Failed: ${totalFailed}`);
console.log('═══════════════════════════════════\n');

process.exit(totalFailed > 0 ? 1 : 0);
