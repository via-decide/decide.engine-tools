#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { execSync, spawnSync } = require('child_process');

const DOC_TYPES = new Set(['README', 'API_DOCS', 'TASK_REPORT', 'ARCHITECTURE_NOTES']);

function changedFiles(cwd) {
  const out = execSync('git status --porcelain --untracked-files=all', { cwd, encoding: 'utf8' });
  return out.split('\n').filter(Boolean).map((line) => line.slice(3).trim()).filter((f) => !f.endsWith('/')).sort();
}

function isMarkdown(file) {
  return /\.md$/i.test(file);
}

function ensureDocType(docType) {
  return DOC_TYPES.has(docType);
}

function runCmd(command, cwd, timeoutMs) {
  const res = spawnSync('bash', ['-lc', command], {
    cwd,
    encoding: 'utf8',
    timeout: timeoutMs,
    maxBuffer: 10 * 1024 * 1024,
  });
  return res;
}

function renderDoc(docType, title, body) {
  const safeTitle = title || 'Documentation';
  const safeBody = body || 'Generated documentation content.';
  if (docType === 'README') return `# ${safeTitle}\n\n${safeBody}\n`;
  if (docType === 'API_DOCS') return `# API Documentation: ${safeTitle}\n\n${safeBody}\n`;
  if (docType === 'TASK_REPORT') return `# Task Report: ${safeTitle}\n\n${safeBody}\n`;
  return `# Architecture Notes: ${safeTitle}\n\n${safeBody}\n`;
}

function runDocumentationExecutor(manifest = {}, options = {}) {
  const cwd = path.resolve(options.cwd || process.cwd());
  const outputFile = path.resolve(cwd, options.outputFile || 'documentation_report.json');
  const timeoutMs = Number.isFinite(Number(manifest.timeout_ms)) ? Math.max(0, Math.floor(Number(manifest.timeout_ms))) : 120000;

  const report = {
    task_id: typeof manifest.task_id === 'string' ? manifest.task_id : 'unknown-task',
    executor: 'documentation executor',
    status: 'FAIL',
    generated_docs: [],
    code_files_touched: [],
    markdown_validation_status: 'NOT_RUN',
    error: null,
  };

  const docs = Array.isArray(manifest.docs) ? manifest.docs : [];
  if (docs.length === 0) {
    report.error = 'docs array is required.';
    fs.writeFileSync(outputFile, JSON.stringify(report, null, 2) + '\n');
    return report;
  }

  const before = changedFiles(cwd);

  for (const item of docs) {
    const docType = item && typeof item.doc_type === 'string' ? item.doc_type : '';
    const filePath = item && typeof item.file_path === 'string' ? item.file_path : '';
    const title = item && typeof item.title === 'string' ? item.title : 'Documentation';
    const body = item && typeof item.body === 'string' ? item.body : 'Generated documentation content.';

    if (!ensureDocType(docType)) {
      report.error = `Unsupported doc_type: ${docType || '<empty>'}`;
      fs.writeFileSync(outputFile, JSON.stringify(report, null, 2) + '\n');
      return report;
    }
    if (!filePath || !isMarkdown(filePath)) {
      report.error = `file_path must be a markdown file: ${filePath || '<empty>'}`;
      fs.writeFileSync(outputFile, JSON.stringify(report, null, 2) + '\n');
      return report;
    }

    const abs = path.resolve(cwd, filePath);
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    fs.writeFileSync(abs, renderDoc(docType, title, body), 'utf8');
    report.generated_docs.push(filePath);
  }

  const after = changedFiles(cwd);
  const allChanged = Array.from(new Set([...before, ...after])).sort();
  const reportRel = path.relative(cwd, outputFile).replace(/\\/g, '/');
  report.code_files_touched = allChanged.filter((f) => !isMarkdown(f) && f !== reportRel);
  if (report.code_files_touched.length > 0) {
    report.error = `Non-markdown files touched: ${report.code_files_touched.join(', ')}`;
    fs.writeFileSync(outputFile, JSON.stringify(report, null, 2) + '\n');
    return report;
  }

  if (typeof manifest.markdown_link_validation_command === 'string' && manifest.markdown_link_validation_command.trim()) {
    const link = runCmd(manifest.markdown_link_validation_command.trim(), cwd, timeoutMs);
    report.markdown_validation_status = link.status === 0 ? 'PASS' : 'FAIL';
    if (link.status !== 0) {
      report.error = link.stderr || 'Markdown link validation failed.';
      fs.writeFileSync(outputFile, JSON.stringify(report, null, 2) + '\n');
      return report;
    }
  } else {
    report.markdown_validation_status = 'NOT_CONFIGURED';
  }

  report.status = 'PASS';
  fs.writeFileSync(outputFile, JSON.stringify(report, null, 2) + '\n');
  return report;
}

if (require.main === module) {
  const manifestPath = process.argv[2];
  if (!manifestPath) {
    process.stdout.write(JSON.stringify({ status: 'FAIL', error: 'Usage: node tools/executors/documentation-executor.js <manifest.json>' }, null, 2) + '\n');
    process.exit(1);
  }
  const manifest = JSON.parse(fs.readFileSync(path.resolve(manifestPath), 'utf8'));
  const result = runDocumentationExecutor(manifest, { cwd: process.cwd() });
  process.stdout.write(JSON.stringify(result, null, 2) + '\n');
  process.exit(result.status === 'PASS' ? 0 : 1);
}

module.exports = { runDocumentationExecutor, renderDoc, isMarkdown, ensureDocType };
