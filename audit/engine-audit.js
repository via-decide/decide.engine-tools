'use strict';

const { runPluginLifecycleAudit } = require('./tests/plugin.lifecycle.test');
const { runRuntimeDeterminismAudit } = require('./tests/runtime.determinism.test');
const { runIsolationAudit } = require('./tests/isolation.test');
const { createAuditReport, printAuditReport } = require('./reporter');

function runEngineAudit() {
  const results = [
    runPluginLifecycleAudit(),
    runRuntimeDeterminismAudit(),
    runIsolationAudit()
  ];

  const report = createAuditReport(results);
  printAuditReport(report);
  return report;
}

if (require.main === module) {
  runEngineAudit();
}

module.exports = {
  runEngineAudit
};
