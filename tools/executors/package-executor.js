#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const PM_DETECTORS = [
  { manager: 'pnpm', lockfiles: ['pnpm-lock.yaml'] },
  { manager: 'yarn', lockfiles: ['yarn.lock'] },
  { manager: 'npm', lockfiles: ['package-lock.json', 'npm-shrinkwrap.json'] },
  { manager: 'uv', lockfiles: ['uv.lock'] },
  { manager: 'pip', lockfiles: ['requirements.txt', 'poetry.lock', 'Pipfile.lock'] },
];

function detectPackageManager(cwd) {
  for (const entry of PM_DETECTORS) {
    for (const lf of entry.lockfiles) {
      if (fs.existsSync(path.join(cwd, lf))) {
        return { manager: entry.manager, lockfile: lf };
      }
    }
  }
  return { manager: 'unknown', lockfile: null };
}

function installCheckCommand(manager) {
  if (manager === 'npm') return 'npm install --package-lock-only --ignore-scripts';
  if (manager === 'pnpm') return 'pnpm install --lockfile-only';
  if (manager === 'yarn') return 'yarn install --mode=skip-build';
  if (manager === 'pip') return 'python -m pip install -r requirements.txt --dry-run';
  if (manager === 'uv') return 'uv sync --frozen';
  return null;
}

function runCommand(command, cwd, timeoutMs) {
  if (!command) return { status: null, stdout: '', stderr: '', skipped: true };
  const res = spawnSync('bash', ['-lc', command], {
    cwd,
    encoding: 'utf8',
    timeout: timeoutMs,
    maxBuffer: 10 * 1024 * 1024,
  });
  return {
    status: res.status,
    stdout: res.stdout || '',
    stderr: res.stderr || '',
    skipped: false,
  };
}

function runPackageExecutor(manifest = {}, options = {}) {
  const cwd = path.resolve(options.cwd || process.cwd());
  const outputFile = path.resolve(cwd, options.outputFile || 'package_report.json');
  const timeoutMs = Number.isFinite(Number(manifest.timeout_ms)) ? Math.max(0, Math.floor(Number(manifest.timeout_ms))) : 180000;

  const detection = detectPackageManager(cwd);
  const buildCommand = typeof manifest.build_command === 'string' ? manifest.build_command.trim() : '';
  const testCommand = typeof manifest.test_command === 'string' ? manifest.test_command.trim() : '';

  const report = {
    task_id: typeof manifest.task_id === 'string' ? manifest.task_id : 'unknown-task',
    executor: 'package executor',
    status: 'FAIL',
    package_manager: detection.manager,
    lockfile: detection.lockfile,
    install_check: { status: 'NOT_RUN' },
    build: { status: 'NOT_RUN' },
    test: { status: 'NOT_RUN' },
    commit_allowed: false,
    error: null,
  };

  if (detection.manager === 'unknown') {
    report.error = 'No supported package manager lockfile detected.';
    fs.writeFileSync(outputFile, JSON.stringify(report, null, 2) + '\n');
    return report;
  }

  if (detection.lockfile) {
    const installCmd = installCheckCommand(detection.manager);
    if (installCmd) {
      const ins = runCommand(installCmd, cwd, timeoutMs);
      report.install_check = {
        status: ins.status === 0 ? 'PASS' : 'FAIL',
        exit_code: ins.status,
        stdout: ins.stdout,
        stderr: ins.stderr,
      };
      if (ins.status !== 0) {
        report.error = ins.stderr || 'Install check failed.';
        fs.writeFileSync(outputFile, JSON.stringify(report, null, 2) + '\n');
        return report;
      }
    }
  }

  if (buildCommand) {
    const b = runCommand(buildCommand, cwd, timeoutMs);
    report.build = { status: b.status === 0 ? 'PASS' : 'FAIL', exit_code: b.status, stdout: b.stdout, stderr: b.stderr };
    if (b.status !== 0) {
      report.error = b.stderr || 'Build failed.';
      fs.writeFileSync(outputFile, JSON.stringify(report, null, 2) + '\n');
      return report;
    }
  } else {
    report.build = { status: 'NOT_CONFIGURED' };
  }

  if (testCommand) {
    const t = runCommand(testCommand, cwd, timeoutMs);
    report.test = { status: t.status === 0 ? 'PASS' : 'FAIL', exit_code: t.status, stdout: t.stdout, stderr: t.stderr };
    if (t.status !== 0) {
      report.error = t.stderr || 'Test command failed.';
      fs.writeFileSync(outputFile, JSON.stringify(report, null, 2) + '\n');
      return report;
    }
  } else {
    report.test = { status: 'NOT_CONFIGURED' };
  }

  report.status = 'PASS';
  report.commit_allowed = true;
  fs.writeFileSync(outputFile, JSON.stringify(report, null, 2) + '\n');
  return report;
}

if (require.main === module) {
  const manifestPath = process.argv[2];
  if (!manifestPath) {
    process.stdout.write(JSON.stringify({ status: 'FAIL', error: 'Usage: node tools/executors/package-executor.js <manifest.json>' }, null, 2) + '\n');
    process.exit(1);
  }
  const manifest = JSON.parse(fs.readFileSync(path.resolve(manifestPath), 'utf8'));
  const result = runPackageExecutor(manifest, { cwd: process.cwd() });
  process.stdout.write(JSON.stringify(result, null, 2) + '\n');
  process.exit(result.status === 'PASS' ? 0 : 1);
}

module.exports = { runPackageExecutor, detectPackageManager, installCheckCommand };
