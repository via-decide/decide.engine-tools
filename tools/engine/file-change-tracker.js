#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function runGitStatus(cwd) {
  const out = execSync('git status --porcelain', { cwd, encoding: 'utf8' });
  return parseStatus(out);
}

function parseStatus(raw) {
  const map = new Map();
  raw
    .split('\n')
    .filter(Boolean)
    .forEach((line) => {
      const status = line.slice(0, 2);
      const filePath = line.slice(3).trim();
      map.set(filePath, status);
    });
  return map;
}

function isWithinAllowed(filePath, allowedPaths) {
  const normalized = filePath.replace(/\\/g, '/');
  return allowedPaths.some((allowed) => {
    const base = String(allowed).replace(/\\/g, '/').replace(/\/$/, '');
    return normalized === base || normalized.startsWith(base + '/');
  });
}

function computeDiff(beforeMap, afterMap) {
  const all = new Set([...beforeMap.keys(), ...afterMap.keys()]);
  const changedFiles = [];
  const createdFiles = [];
  const deletedFiles = [];

  Array.from(all).sort().forEach((file) => {
    const before = beforeMap.get(file) || null;
    const after = afterMap.get(file) || null;
    if (before === after) return;

    changedFiles.push(file);
    if (!before && after && (after.includes('?') || after.includes('A'))) {
      createdFiles.push(file);
    }
    if (after && after.includes('D')) {
      deletedFiles.push(file);
    }
  });

  return { changed_files: changedFiles, created_files: createdFiles, deleted_files: deletedFiles };
}

function writeReport(reportPath, report) {
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2) + '\n', 'utf8');
}

function trackFileChanges(config = {}) {
  const cwd = path.resolve(config.cwd || process.cwd());
  const reportPath = path.resolve(cwd, config.reportFile || 'file_change_report.json');
  const allowedTargetPaths = Array.isArray(config.allowedTargetPaths) ? config.allowedTargetPaths : [];

  const before = config.beforeSnapshot || runGitStatus(cwd);
  const after = config.afterSnapshot || runGitStatus(cwd);
  const diff = computeDiff(before, after);

  const outOfScopeFiles = diff.changed_files.filter((f) => !isWithinAllowed(f, allowedTargetPaths));

  const report = {
    ok: outOfScopeFiles.length === 0,
    cwd,
    allowed_target_paths: allowedTargetPaths.slice().sort(),
    before_snapshot: Object.fromEntries(Array.from(before.entries()).sort(([a], [b]) => a.localeCompare(b))),
    after_snapshot: Object.fromEntries(Array.from(after.entries()).sort(([a], [b]) => a.localeCompare(b))),
    changed_files: diff.changed_files,
    created_files: diff.created_files,
    deleted_files: diff.deleted_files,
    out_of_scope_files: outOfScopeFiles,
  };

  writeReport(reportPath, report);
  return report;
}

function runCli() {
  const inputRaw = process.argv[2] || '{}';
  let config = {};
  try {
    config = JSON.parse(inputRaw);
  } catch (error) {
    const output = {
      ok: false,
      error: `Invalid JSON input: ${error.message}`,
      changed_files: [],
      created_files: [],
      deleted_files: [],
      out_of_scope_files: [],
    };
    process.stdout.write(JSON.stringify(output, null, 2) + '\n');
    process.exitCode = 1;
    return;
  }

  try {
    const report = trackFileChanges(config);
    process.stdout.write(JSON.stringify(report, null, 2) + '\n');
    process.exitCode = report.ok ? 0 : 1;
  } catch (error) {
    const output = {
      ok: false,
      error: error.message,
      changed_files: [],
      created_files: [],
      deleted_files: [],
      out_of_scope_files: [],
    };
    process.stdout.write(JSON.stringify(output, null, 2) + '\n');
    process.exitCode = 1;
  }
}

if (require.main === module) {
  runCli();
}

module.exports = {
  trackFileChanges,
  parseStatus,
  computeDiff,
  isWithinAllowed,
};
