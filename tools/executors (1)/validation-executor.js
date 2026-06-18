#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const DEFAULT_TIMEOUT_MS = 120000;

function toNonNegativeInt(value, fallback) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) return fallback;
  return Math.floor(parsed);
}

function normalizeTaskManifest(manifest) {
  const input = manifest && typeof manifest === 'object' && !Array.isArray(manifest) ? manifest : {};
  const validationCommand = typeof input.validation_command === 'string' ? input.validation_command.trim() : '';
  return {
    task_id: typeof input.task_id === 'string' && input.task_id.length > 0 ? input.task_id : 'unknown-task',
    repo: typeof input.repo === 'string' ? input.repo : '',
    mode: typeof input.mode === 'string' ? input.mode : '',
    validation_command: validationCommand,
    timeout_ms: toNonNegativeInt(input.timeout_ms, DEFAULT_TIMEOUT_MS),
  };
}

function writeValidationResult(outputPath, payload) {
  fs.writeFileSync(outputPath, JSON.stringify(payload, null, 2) + '\n', 'utf8');
}

function runValidationExecutor(manifest, options = {}) {
  const normalized = normalizeTaskManifest(manifest);
  const cwd = path.resolve(options.cwd || process.cwd());
  const outputPath = path.resolve(cwd, options.outputFile || 'validation_result.json');

  const result = {
    task_id: normalized.task_id,
    repo: normalized.repo,
    mode: normalized.mode,
    executor: 'validation executor',
    validation_command: normalized.validation_command,
    timeout_ms: normalized.timeout_ms,
    status: 'FAIL',
    timed_out: false,
    exit_code: null,
    stdout: '',
    stderr: '',
    commit_hash: null,
    error: null,
  };

  if (!normalized.validation_command) {
    result.error = 'validation_command is required.';
    writeValidationResult(outputPath, result);
    return result;
  }

  const child = spawnSync('bash', ['-lc', normalized.validation_command], {
    cwd,
    encoding: 'utf8',
    timeout: normalized.timeout_ms,
    maxBuffer: 10 * 1024 * 1024,
  });

  result.stdout = child.stdout || '';
  result.stderr = child.stderr || '';
  result.exit_code = Number.isInteger(child.status) ? child.status : null;
  result.timed_out = child.error && child.error.code === 'ETIMEDOUT';

  if (child.error && !result.timed_out) {
    result.error = child.error.message;
  }

  result.status = result.exit_code === 0 && !result.timed_out ? 'PASS' : 'FAIL';

  writeValidationResult(outputPath, result);
  return result;
}

function runCli() {
  const inputPath = process.argv[2];
  if (!inputPath) {
    const output = {
      task_id: 'unknown-task',
      repo: '',
      mode: '',
      executor: 'validation executor',
      validation_command: '',
      timeout_ms: DEFAULT_TIMEOUT_MS,
      status: 'FAIL',
      timed_out: false,
      exit_code: null,
      stdout: '',
      stderr: '',
      commit_hash: null,
      error: 'Usage: node tools/executors/validation-executor.js <task-manifest.json>',
    };
    process.stdout.write(JSON.stringify(output, null, 2) + '\n');
    process.exitCode = 1;
    return;
  }

  try {
    const manifest = JSON.parse(fs.readFileSync(path.resolve(inputPath), 'utf8'));
    const result = runValidationExecutor(manifest, {
      cwd: process.env.VALIDATION_EXECUTOR_CWD || process.cwd(),
      outputFile: process.env.VALIDATION_EXECUTOR_OUTPUT || 'validation_result.json',
    });
    process.stdout.write(JSON.stringify(result, null, 2) + '\n');
    process.exitCode = result.status === 'PASS' ? 0 : 1;
  } catch (error) {
    const output = {
      task_id: 'unknown-task',
      repo: '',
      mode: '',
      executor: 'validation executor',
      validation_command: '',
      timeout_ms: DEFAULT_TIMEOUT_MS,
      status: 'FAIL',
      timed_out: false,
      exit_code: null,
      stdout: '',
      stderr: '',
      commit_hash: null,
      error: error.message,
    };
    process.stdout.write(JSON.stringify(output, null, 2) + '\n');
    process.exitCode = 1;
  }
}

if (require.main === module) {
  runCli();
}

module.exports = {
  runValidationExecutor,
  normalizeTaskManifest,
  DEFAULT_TIMEOUT_MS,
};
