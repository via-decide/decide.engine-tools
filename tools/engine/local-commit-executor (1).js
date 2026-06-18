#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { execSync, spawnSync } = require('child_process');

function run(command, options = {}) {
  return execSync(command, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    ...options,
  }).trim();
}

function resolveRepoRoot(cwd) {
  return run('git rev-parse --show-toplevel', { cwd });
}

function normalizeRepoSlug(remoteUrl) {
  return String(remoteUrl)
    .trim()
    .replace(/\.git$/, '')
    .replace(/^git@[^:]+:/, '')
    .replace(/^https?:\/\/[^/]+\//, '');
}

function isExpectedRepo(repoRoot) {
  const normalized = repoRoot.replace(/\\/g, '/');
  if (normalized.endsWith('/via-decide/decide.engine-tools')) {
    return true;
  }

  const base = path.basename(repoRoot);
  if (base !== 'decide.engine-tools') {
    return false;
  }

  try {
    const remote = run('git config --get remote.origin.url', { cwd: repoRoot });
    return normalizeRepoSlug(remote) === 'via-decide/decide.engine-tools';
  } catch {
    return false;
  }
}

function buildCommitMessage(type, scope, summary) {
  return `${type}(${scope}): ${summary}`;
}

function writeResult(outputFile, payload) {
  fs.writeFileSync(outputFile, JSON.stringify(payload, null, 2) + '\n', 'utf8');
}

function executeLocalCommit(config = {}) {
  const cwd = path.resolve(config.cwd || process.cwd());
  const outputFile = path.resolve(cwd, config.outputFile || 'local_commit_result.json');

  const result = {
    ok: false,
    repo_root: null,
    in_expected_repo: false,
    staged_files: [],
    validation_command: config.validationCommand || '',
    validation_passed: false,
    commit_attempted: false,
    committed: false,
    commit_sha: null,
    commit_message: null,
    errors: [],
  };

  try {
    const repoRoot = resolveRepoRoot(cwd);
    result.repo_root = repoRoot;
    result.in_expected_repo = isExpectedRepo(repoRoot);

    if (!result.in_expected_repo) {
      result.errors.push('Refusing to run: current directory is not inside via-decide/decide.engine-tools.');
      writeResult(outputFile, result);
      return result;
    }

    const taskFiles = Array.isArray(config.taskFiles) ? [...new Set(config.taskFiles)] : [];
    if (taskFiles.length === 0) {
      result.errors.push('No task files provided to stage.');
      writeResult(outputFile, result);
      return result;
    }

    const stageable = taskFiles.filter((file) => {
      try {
        const scopedStatus = run(`git status --porcelain -- ${JSON.stringify(file)}`, { cwd: repoRoot });
        return scopedStatus.length > 0;
      } catch {
        return false;
      }
    });
    if (stageable.length === 0) {
      result.errors.push('None of the provided task files are modified.');
      writeResult(outputFile, result);
      return result;
    }

    const addResult = spawnSync('git', ['add', '--', ...stageable], { cwd: repoRoot, encoding: 'utf8' });
    if (addResult.status !== 0) {
      throw new Error(addResult.stderr || 'Failed to stage task files.');
    }
    result.staged_files = stageable;

    const validationCommand = config.validationCommand || 'npm test';
    result.validation_command = validationCommand;
    const validation = spawnSync(validationCommand, {
      cwd: repoRoot,
      shell: true,
      encoding: 'utf8',
      stdio: 'inherit',
    });

    result.validation_passed = validation.status === 0;
    if (!result.validation_passed) {
      result.errors.push('Validation failed; commit was not created.');
      writeResult(outputFile, result);
      return result;
    }

    const type = config.type || 'chore';
    const scope = config.scope || 'engine';
    const summary = config.summary || 'local commit executor update';
    const commitMessage = buildCommitMessage(type, scope, summary);
    result.commit_message = commitMessage;

    result.commit_attempted = true;
    const commitResult = spawnSync('git', ['commit', '-m', commitMessage], {
      cwd: repoRoot,
      encoding: 'utf8',
      stdio: 'inherit',
    });
    if (commitResult.status !== 0) {
      throw new Error('git commit failed.');
    }
    result.commit_sha = run('git rev-parse HEAD', { cwd: repoRoot });
    result.committed = true;
    result.ok = true;

    writeResult(outputFile, result);
    return result;
  } catch (error) {
    result.errors.push(error.message);
    writeResult(outputFile, result);
    return result;
  }
}

if (require.main === module) {
  const envTaskFiles = process.env.TASK_FILES ? process.env.TASK_FILES.split(',').map((f) => f.trim()).filter(Boolean) : [];
  executeLocalCommit({
    cwd: process.env.TASK_CWD || process.cwd(),
    taskFiles: envTaskFiles,
    validationCommand: process.env.VALIDATION_COMMAND || 'npm test',
    type: process.env.COMMIT_TYPE || 'chore',
    scope: process.env.COMMIT_SCOPE || 'engine',
    summary: process.env.COMMIT_SUMMARY || 'local commit executor update',
    outputFile: process.env.LOCAL_COMMIT_OUTPUT || 'local_commit_result.json',
  });
}

module.exports = {
  executeLocalCommit,
  buildCommitMessage,
  isExpectedRepo,
  normalizeRepoSlug,
  resolveRepoRoot,
};
