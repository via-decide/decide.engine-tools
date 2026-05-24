#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const SECRET_PATTERNS = [
  { id: 'aws_access_key', regex: /AKIA[0-9A-Z]{16}/g },
  { id: 'github_token', regex: /ghp_[A-Za-z0-9]{36}/g },
  { id: 'openai_key', regex: /sk-[A-Za-z0-9]{20,}/g },
  { id: 'generic_password_assign', regex: /(?:password|passwd|pwd)\s*[:=]\s*['"][^'"]{6,}['"]/gi },
  { id: 'private_key_block', regex: /-----BEGIN(?: RSA)? PRIVATE KEY-----/g },
];

const DANGEROUS_SHELL_PATTERNS = [
  { id: 'curl_pipe_shell', regex: /curl\s+[^\n|;]+\|\s*(?:sh|bash)\b/gi },
  { id: 'wget_pipe_shell', regex: /wget\s+[^\n|;]+\|\s*(?:sh|bash)\b/gi },
  { id: 'rm_rf_root', regex: /rm\s+-rf\s+\/(?:\s|$)/g },
  { id: 'chmod_777', regex: /chmod\s+777\b/g },
];

const PATH_TRAVERSAL_PATTERNS = [
  { id: 'dotdot_slash', regex: /\.\.\//g },
  { id: 'dotdot_backslash', regex: /\.\.\\/g },
  { id: 'path_join_user_input', regex: /path\.join\([^\)]*(req\.(?:params|query|body)|userInput|input)/gi },
];

const INSECURE_EVAL_PATTERNS = [
  { id: 'eval_call', regex: /\beval\s*\(/g },
  { id: 'new_function', regex: /\bnew\s+Function\s*\(/g },
  { id: 'settimeout_string', regex: /setTimeout\s*\(\s*['"]/g },
  { id: 'setinterval_string', regex: /setInterval\s*\(\s*['"]/g },
];

function listFiles(root) {
  const out = [];
  function walk(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const e of entries) {
      if (e.name === '.git' || e.name === 'node_modules') continue;
      const abs = path.join(dir, e.name);
      if (e.isDirectory()) walk(abs);
      else out.push(abs);
    }
  }
  walk(root);
  return out.sort();
}

function scanContent(content, patterns, category, relPath, findings) {
  for (const p of patterns) {
    const regex = new RegExp(p.regex.source, p.regex.flags);
    let m;
    while ((m = regex.exec(content)) !== null) {
      findings.push({
        category,
        rule_id: p.id,
        file: relPath,
        index: m.index,
        match: String(m[0]).slice(0, 120),
      });
      if (m[0].length === 0) regex.lastIndex += 1;
    }
  }
}

function runSecurityScan(manifest = {}, options = {}) {
  const cwd = path.resolve(options.cwd || process.cwd());
  const outputFile = path.resolve(cwd, options.outputFile || 'security_scan_report.json');
  const targetPaths = Array.isArray(manifest.target_paths) && manifest.target_paths.length
    ? manifest.target_paths.map((p) => path.resolve(cwd, p))
    : [cwd];

  const findings = [];
  const scannedFiles = [];

  for (const file of listFiles(cwd)) {
    const inScope = targetPaths.some((base) => file === base || file.startsWith(base + path.sep));
    if (!inScope) continue;

    const rel = path.relative(cwd, file).replace(/\\/g, '/');
    scannedFiles.push(rel);

    if (rel === '.env' || rel.endsWith('/.env') || rel.endsWith('.env')) {
      findings.push({ category: 'env_commit', rule_id: 'env_file_detected', file: rel, index: 0, match: rel });
    }

    let content;
    try {
      content = fs.readFileSync(file, 'utf8');
    } catch {
      continue;
    }

    scanContent(content, SECRET_PATTERNS, 'exposed_secrets', rel, findings);
    scanContent(content, DANGEROUS_SHELL_PATTERNS, 'dangerous_shell', rel, findings);
    scanContent(content, PATH_TRAVERSAL_PATTERNS, 'path_traversal', rel, findings);
    scanContent(content, INSECURE_EVAL_PATTERNS, 'insecure_eval', rel, findings);
  }

  findings.sort((a, b) =>
    a.category.localeCompare(b.category) ||
    a.rule_id.localeCompare(b.rule_id) ||
    a.file.localeCompare(b.file) ||
    a.index - b.index
  );

  const report = {
    task_id: typeof manifest.task_id === 'string' ? manifest.task_id : 'unknown-task',
    executor: 'security executor',
    status: findings.length === 0 ? 'PASS' : 'FAIL',
    scanned_files: scannedFiles,
    findings,
  };

  fs.writeFileSync(outputFile, JSON.stringify(report, null, 2) + '\n', 'utf8');
  return report;
}

if (require.main === module) {
  const manifestPath = process.argv[2];
  if (!manifestPath) {
    process.stdout.write(JSON.stringify({ status: 'FAIL', error: 'Usage: node tools/executors/security-scan-executor.js <manifest.json>' }, null, 2) + '\n');
    process.exit(1);
  }
  const manifest = JSON.parse(fs.readFileSync(path.resolve(manifestPath), 'utf8'));
  const result = runSecurityScan(manifest, { cwd: process.cwd() });
  process.stdout.write(JSON.stringify(result, null, 2) + '\n');
  process.exit(result.status === 'PASS' ? 0 : 1);
}

module.exports = { runSecurityScan };
