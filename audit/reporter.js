'use strict';

function createAuditReport(results) {
  const errors = [];
  const byName = Object.create(null);

  for (const result of results) {
    byName[result.name] = result;
    for (const error of result.errors || []) errors.push(`${result.name}: ${error}`);
    for (const error of result.globalLeakErrors || []) errors.push(`globalLeak: ${error}`);
  }

  return {
    pluginLifecycle: byName.pluginLifecycle && byName.pluginLifecycle.passed ? 'PASS' : 'FAIL',
    determinism: byName.determinism && byName.determinism.passed ? 'PASS' : 'FAIL',
    globalLeak: byName.isolation && byName.isolation.globalLeakPassed ? 'PASS' : 'FAIL',
    isolation: byName.isolation && byName.isolation.passed ? 'PASS' : 'FAIL',
    errors
  };
}

function printAuditReport(report) {
  console.log(JSON.stringify(report, null, 2));
}

module.exports = {
  createAuditReport,
  printAuditReport
};
