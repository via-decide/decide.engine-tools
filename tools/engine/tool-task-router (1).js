#!/usr/bin/env node
'use strict';

const EXECUTOR_BY_MODE = Object.freeze({
  generate: 'generator executor',
  refactor: 'refactor executor',
  debug: 'debug executor',
  validate: 'validation executor',
  test: 'test executor',
  document: 'doc executor',
  package: 'package executor',
  security_scan: 'security executor',
});

function normalizeTask(task = {}) {
  return {
    task_id: typeof task.task_id === 'string' && task.task_id.length > 0 ? task.task_id : 'unknown-task',
    mode: typeof task.mode === 'string' ? task.mode : '',
    files_changed: Array.isArray(task.files_changed)
      ? task.files_changed.filter((f) => typeof f === 'string').slice().sort()
      : [],
    commit_hash: task.commit_hash == null ? null : String(task.commit_hash),
  };
}

function routeToolTask(task = {}) {
  const normalized = normalizeTask(task);
  const executor = EXECUTOR_BY_MODE[normalized.mode] || null;

  if (!executor) {
    return {
      task_id: normalized.task_id,
      mode: normalized.mode,
      executor: 'unknown',
      status: 'FAIL',
      files_changed: [],
      commit_hash: null,
      error: `Unsupported mode: ${normalized.mode || '<empty>'}`,
    };
  }

  return {
    task_id: normalized.task_id,
    mode: normalized.mode,
    executor,
    status: 'PASS',
    files_changed: normalized.files_changed,
    commit_hash: normalized.commit_hash,
  };
}

function runCli() {
  const raw = process.argv[2];
  if (!raw) {
    process.stdout.write(JSON.stringify({
      task_id: 'unknown-task',
      mode: '',
      executor: 'unknown',
      status: 'FAIL',
      files_changed: [],
      commit_hash: null,
      error: 'Usage: node tools/engine/tool-task-router.js "{\"task_id\":\"...\",\"mode\":\"...\"}"',
    }, null, 2) + '\n');
    process.exitCode = 1;
    return;
  }

  try {
    const payload = JSON.parse(raw);
    const result = routeToolTask(payload);
    process.stdout.write(JSON.stringify(result, null, 2) + '\n');
    process.exitCode = result.status === 'PASS' ? 0 : 1;
  } catch (error) {
    process.stdout.write(JSON.stringify({
      task_id: 'unknown-task',
      mode: '',
      executor: 'unknown',
      status: 'FAIL',
      files_changed: [],
      commit_hash: null,
      error: error.message,
    }, null, 2) + '\n');
    process.exitCode = 1;
  }
}

if (require.main === module) {
  runCli();
}

module.exports = {
  routeToolTask,
  normalizeTask,
  EXECUTOR_BY_MODE,
};
