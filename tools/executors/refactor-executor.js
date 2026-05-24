#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { spawnSync, execSync } = require('child_process');

function parseStatus(raw) {
  return raw.split('\n').filter(Boolean).map((line) => line.slice(3).trim());
}

function gitChangedFiles(cwd) {
  const out = execSync('git status --porcelain', { cwd, encoding: 'utf8' });
  return parseStatus(out).sort();
}

function isWithinTargets(file, targets) {
  const normalized = file.replace(/\\/g, '/');
  return targets.some((t) => {
    const base = String(t).replace(/\\/g, '/').replace(/\/$/, '');
    return normalized === base || normalized.startsWith(base + '/');
  });
}

function runCmd(command, cwd, timeoutMs) {
  return spawnSync('bash', ['-lc', command], {
    cwd,
    encoding: 'utf8',
    timeout: timeoutMs,
    maxBuffer: 10 * 1024 * 1024,
  });
}

function runRefactorExecutor(manifest = {}, options = {}) {
  const cwd = path.resolve(options.cwd || process.cwd());
  const reportFile = path.resolve(cwd, options.outputFile || 'refactor_report.json');

  const targetFiles = Array.isArray(manifest.target_files) ? manifest.target_files.filter((f) => typeof f === 'string' && f) : [];
  const allowRepoWide = manifest.allow_repo_wide === true;
  const formatterCommand = typeof manifest.formatter_command === 'string' ? manifest.formatter_command.trim() : '';
  const validationCommand = typeof manifest.validation_command === 'string' ? manifest.validation_command.trim() : '';
  const behaviorClaim = typeof manifest.behavior_preservation_claim === 'string' && manifest.behavior_preservation_claim
    ? manifest.behavior_preservation_claim
    : 'Refactor intended to preserve behavior.';
  const timeoutMs = Number.isFinite(Number(manifest.timeout_ms)) ? Math.max(0, Math.floor(Number(manifest.timeout_ms))) : 120000;

  const report = {
    task_id: typeof manifest.task_id === 'string' ? manifest.task_id : 'unknown-task',
    executor: 'refactor executor',
    status: 'FAIL',
    files_changed: [],
    behavior_preservation_claim: behaviorClaim,
    validation_status: 'NOT_RUN',
    formatter_status: 'NOT_RUN',
    error: null,
  };

  if (targetFiles.length === 0 && !allowRepoWide) {
    report.error = 'Refusing broad refactor: target_files required unless allow_repo_wide=true.';
    fs.writeFileSync(reportFile, JSON.stringify(report, null, 2) + '\n');
    return report;
  }

  const before = gitChangedFiles(cwd);

  if (formatterCommand) {
    const fmt = runCmd(formatterCommand, cwd, timeoutMs);
    report.formatter_status = fmt.status === 0 ? 'PASS' : 'FAIL';
    if (fmt.status !== 0) {
      report.error = fmt.stderr || 'Formatter failed.';
      fs.writeFileSync(reportFile, JSON.stringify(report, null, 2) + '\n');
      return report;
    }
  }

  const after = gitChangedFiles(cwd);
  const filesChanged = Array.from(new Set([...before, ...after])).sort();
  report.files_changed = filesChanged;

  if (!allowRepoWide) {
    const outOfScope = filesChanged.filter((f) => !isWithinTargets(f, targetFiles));
    if (outOfScope.length > 0) {
      report.error = `Out-of-scope changes detected: ${outOfScope.join(', ')}`;
      fs.writeFileSync(reportFile, JSON.stringify(report, null, 2) + '\n');
      return report;
    }
  }

  if (validationCommand) {
    const validation = runCmd(validationCommand, cwd, timeoutMs);
    report.validation_status = validation.status === 0 ? 'PASS' : 'FAIL';
    if (validation.status !== 0) {
      report.error = validation.stderr || 'Validation failed.';
      fs.writeFileSync(reportFile, JSON.stringify(report, null, 2) + '\n');
      return report;
    }
  } else {
    report.validation_status = 'NOT_CONFIGURED';
  }

  report.status = 'PASS';
  fs.writeFileSync(reportFile, JSON.stringify(report, null, 2) + '\n');
  return report;
}

if (require.main === module) {
  const manifestPath = process.argv[2];
  if (!manifestPath) {
    process.stdout.write(JSON.stringify({ status: 'FAIL', error: 'Usage: node tools/executors/refactor-executor.js <manifest.json>' }, null, 2) + '\n');
    process.exit(1);
  }
  const manifest = JSON.parse(fs.readFileSync(path.resolve(manifestPath), 'utf8'));
  const result = runRefactorExecutor(manifest, { cwd: process.cwd() });
  process.stdout.write(JSON.stringify(result, null, 2) + '\n');
  process.exit(result.status === 'PASS' ? 0 : 1);
}

module.exports = { runRefactorExecutor, gitChangedFiles, isWithinTargets };
