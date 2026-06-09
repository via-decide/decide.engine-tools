#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { execSync, spawnSync } = require('child_process');

function gitChangedFiles(cwd) {
  const out = execSync('git status --porcelain', { cwd, encoding: 'utf8' });
  return out.split('\n').filter(Boolean).map((line) => line.slice(3).trim()).sort();
}

function runCommand(command, cwd, timeoutMs) {
  if (!command) {
    return { status: null, stdout: '', stderr: '', skipped: true };
  }
  const result = spawnSync('bash', ['-lc', command], {
    cwd,
    encoding: 'utf8',
    timeout: timeoutMs,
    maxBuffer: 10 * 1024 * 1024,
  });
  return {
    status: result.status,
    stdout: result.stdout || '',
    stderr: result.stderr || '',
    skipped: false,
  };
}

function isWithinTargets(file, targets) {
  const normalized = file.replace(/\\/g, '/');
  return targets.some((t) => {
    const base = String(t).replace(/\\/g, '/').replace(/\/$/, '');
    return normalized === base || normalized.startsWith(base + '/');
  });
}

function runDebugExecutor(manifest = {}, options = {}) {
  const cwd = path.resolve(options.cwd || process.cwd());
  const outputFile = path.resolve(cwd, options.outputFile || 'debug_report.json');

  const bugReport = typeof manifest.bug_report === 'string' ? manifest.bug_report.trim() : '';
  const rootCause = typeof manifest.root_cause === 'string' ? manifest.root_cause.trim() : '';
  const targetFiles = Array.isArray(manifest.target_files) ? manifest.target_files.filter((f) => typeof f === 'string' && f) : [];
  const applyFixCommand = typeof manifest.apply_fix_command === 'string' ? manifest.apply_fix_command.trim() : '';
  const reproductionCommand = typeof manifest.reproduction_command === 'string' ? manifest.reproduction_command.trim() : '';
  const validationCommand = typeof manifest.validation_command === 'string' ? manifest.validation_command.trim() : '';
  const timeoutMs = Number.isFinite(Number(manifest.timeout_ms)) ? Math.max(0, Math.floor(Number(manifest.timeout_ms))) : 120000;

  const report = {
    task_id: typeof manifest.task_id === 'string' ? manifest.task_id : 'unknown-task',
    executor: 'debug executor',
    status: 'FAIL',
    bug_report: bugReport,
    root_cause: rootCause || 'Root cause documented in bug_report and fix context.',
    changed_files: [],
    reproduction: { status: 'NOT_RUN' },
    validation: { status: 'NOT_RUN' },
    error: null,
  };

  if (!bugReport) {
    report.error = 'bug_report is required.';
    fs.writeFileSync(outputFile, JSON.stringify(report, null, 2) + '\n');
    return report;
  }
  if (targetFiles.length === 0) {
    report.error = 'target_files is required.';
    fs.writeFileSync(outputFile, JSON.stringify(report, null, 2) + '\n');
    return report;
  }
  if (!applyFixCommand) {
    report.error = 'apply_fix_command is required.';
    fs.writeFileSync(outputFile, JSON.stringify(report, null, 2) + '\n');
    return report;
  }

  if (reproductionCommand) {
    const pre = runCommand(reproductionCommand, cwd, timeoutMs);
    report.reproduction = {
      status: pre.status === 0 ? 'PASS' : 'FAIL',
      exit_code: pre.status,
      stdout: pre.stdout,
      stderr: pre.stderr,
    };
  }

  const before = gitChangedFiles(cwd);
  const fix = runCommand(applyFixCommand, cwd, timeoutMs);
  if (fix.status !== 0) {
    report.error = fix.stderr || 'Fix command failed.';
    report.changed_files = gitChangedFiles(cwd);
    fs.writeFileSync(outputFile, JSON.stringify(report, null, 2) + '\n');
    return report;
  }

  const after = gitChangedFiles(cwd);
  const changed = Array.from(new Set([...before, ...after])).sort();
  report.changed_files = changed;

  const outOfScope = changed.filter((f) => !isWithinTargets(f, targetFiles));
  if (outOfScope.length > 0) {
    report.error = `Out-of-scope file changes: ${outOfScope.join(', ')}`;
    fs.writeFileSync(outputFile, JSON.stringify(report, null, 2) + '\n');
    return report;
  }

  if (validationCommand) {
    const post = runCommand(validationCommand, cwd, timeoutMs);
    report.validation = {
      status: post.status === 0 ? 'PASS' : 'FAIL',
      exit_code: post.status,
      stdout: post.stdout,
      stderr: post.stderr,
    };
    if (post.status !== 0) {
      report.error = post.stderr || 'Validation failed.';
      fs.writeFileSync(outputFile, JSON.stringify(report, null, 2) + '\n');
      return report;
    }
  } else {
    report.validation = { status: 'NOT_CONFIGURED' };
  }

  report.status = 'PASS';
  fs.writeFileSync(outputFile, JSON.stringify(report, null, 2) + '\n');
  return report;
}

if (require.main === module) {
  const manifestPath = process.argv[2];
  if (!manifestPath) {
    process.stdout.write(JSON.stringify({ status: 'FAIL', error: 'Usage: node tools/executors/debug-executor.js <manifest.json>' }, null, 2) + '\n');
    process.exit(1);
  }
  const manifest = JSON.parse(fs.readFileSync(path.resolve(manifestPath), 'utf8'));
  const result = runDebugExecutor(manifest, { cwd: process.cwd() });
  process.stdout.write(JSON.stringify(result, null, 2) + '\n');
  process.exit(result.status === 'PASS' ? 0 : 1);
}

module.exports = { runDebugExecutor, gitChangedFiles, isWithinTargets };
