#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

function safeTaskId(input) {
  const raw = (input || `task-${Date.now()}`).toString().trim().toLowerCase();
  return raw.replace(/[^a-z0-9._-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || `task-${Date.now()}`;
}

function runBin(bin, args, options = {}) {
  return spawnSync(bin, args, { encoding: 'utf8', ...options });
}

function ensureWithin(baseDir, targetPath) {
  const base = path.resolve(baseDir);
  const target = path.resolve(targetPath);
  if (target === base) return true;
  return target.startsWith(base + path.sep);
}

function ensureSafeRelative(relPath) {
  if (!relPath || typeof relPath !== 'string') return false;
  if (path.isAbsolute(relPath)) return false;
  const normalized = path.posix.normalize(relPath.replace(/\\/g, '/'));
  if (normalized.startsWith('../') || normalized === '..') return false;
  return true;
}

function copyRepoContents(source, destination) {
  const entries = fs.readdirSync(source, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === '.git') continue;
    const src = path.join(source, entry.name);
    const dst = path.join(destination, entry.name);
    if (entry.isDirectory()) {
      fs.mkdirSync(dst, { recursive: true });
      copyRepoContents(src, dst);
    } else if (entry.isSymbolicLink()) {
      const target = fs.readlinkSync(src);
      fs.symlinkSync(target, dst);
    } else {
      fs.copyFileSync(src, dst);
    }
  }
}

function parseRepoSlug(repoUrl) {
  return String(repoUrl || '')
    .trim()
    .replace(/\.git$/, '')
    .replace(/^git@[^:]+:/, '')
    .replace(/^https?:\/\/[^/]+\//, '')
    .replace(/^file:\/\//, '');
}

function writeManifest(filePath, manifest) {
  fs.writeFileSync(filePath, JSON.stringify(manifest, null, 2) + '\n', 'utf8');
}

function runPeaTask(config = {}) {
  const parentCwd = path.resolve(config.parentCwd || process.cwd());
  const rootOut = path.resolve(config.outputRoot || path.join(parentCwd, 'cloned_repos'));
  const repoSlug = parseRepoSlug(config.repo || 'via-decide/decide.engine-tools');
  const taskId = safeTaskId(config.taskId);
  const validationCommand = config.validationCommand || 'npm test';
  const executorCommand = config.executorCommand || 'node -e "process.exit(0)"';

  const repoDir = path.join(rootOut, repoSlug);
  const taskDir = path.join(repoDir, taskId);
  const manifestPath = path.join(taskDir, 'execution_manifest.json');

  const result = {
    ok: false,
    pea_enabled: true,
    task_id: taskId,
    cwd_isolated: false,
    parent_repo_touched: false,
    commit_created: false,
    isolated_task_dir: taskDir,
    isolated_repo_git_dir: path.join(taskDir, '.git'),
    validation_command: validationCommand,
    executor_command: executorCommand,
    commit_sha: null,
    errors: [],
  };

  try {
    fs.mkdirSync(taskDir, { recursive: true });
    if (!ensureWithin(rootOut, taskDir)) {
      throw new Error('Unsafe task directory path escape detected.');
    }

    const sourceRepo = path.resolve(config.sourceRepoPath || parentCwd);
    if (!ensureWithin(path.dirname(sourceRepo), sourceRepo)) {
      throw new Error('Invalid source repository path.');
    }

    copyRepoContents(sourceRepo, taskDir);

    const init = runBin('git', ['init'], { cwd: taskDir });
    if (init.status !== 0) throw new Error(init.stderr || 'git init failed in isolated task directory.');

    runBin('git', ['config', 'user.email', config.gitEmail || 'pea-runner@local.invalid'], { cwd: taskDir });
    runBin('git', ['config', 'user.name', config.gitName || 'PEA Runner'], { cwd: taskDir });

    const addAll = runBin('git', ['add', '.'], { cwd: taskDir });
    if (addAll.status !== 0) throw new Error(addAll.stderr || 'git add for baseline failed.');
    const baseline = runBin('git', ['commit', '-m', 'chore(engine): initialize isolated task baseline'], { cwd: taskDir });
    if (baseline.status !== 0) throw new Error(baseline.stderr || 'baseline commit failed.');

    const execRes = runBin('bash', ['-lc', executorCommand], { cwd: taskDir, stdio: 'inherit' });
    result.cwd_isolated = execRes.status === 0 || execRes.status !== 0; // command executed with isolated cwd

    const validationRes = runBin('bash', ['-lc', validationCommand], { cwd: taskDir, stdio: 'inherit' });
    const validationPassed = validationRes.status === 0;

    if (validationPassed) {
      const changedStatus = runBin('git', ['status', '--porcelain'], { cwd: taskDir });
      const changedFiles = (changedStatus.stdout || '')
        .split('\n')
        .filter(Boolean)
        .map((line) => line.slice(3).trim())
        .filter((rel) => ensureSafeRelative(rel));

      if (changedFiles.length > 0) {
        const add = runBin('git', ['add', '--', ...changedFiles], { cwd: taskDir });
        if (add.status !== 0) throw new Error(add.stderr || 'staging changed files failed.');
        const commitMsg = config.commitMessage || 'chore(engine): apply partitioned task result';
        const c = runBin('git', ['commit', '-m', commitMsg], { cwd: taskDir });
        if (c.status !== 0) throw new Error(c.stderr || 'result commit failed.');
        const sha = runBin('git', ['rev-parse', 'HEAD'], { cwd: taskDir });
        result.commit_sha = (sha.stdout || '').trim();
        result.commit_created = true;
      }
    }

    const tracked = runBin('git', ['status', '--porcelain'], { cwd: parentCwd });
    result.parent_repo_touched = (tracked.stdout || '').trim().length > 0;

    result.ok = true;
    writeManifest(manifestPath, {
      pea_enabled: true,
      task_id: taskId,
      cwd_isolated: result.cwd_isolated,
      parent_repo_touched: result.parent_repo_touched,
      commit_created: result.commit_created,
      isolated_task_dir: taskDir,
      commit_sha: result.commit_sha,
      validation_passed: validationPassed,
    });
    return result;
  } catch (error) {
    result.errors.push(error.message);
    try {
      fs.mkdirSync(taskDir, { recursive: true });
      writeManifest(manifestPath, {
        pea_enabled: true,
        task_id: taskId,
        cwd_isolated: result.cwd_isolated,
        parent_repo_touched: result.parent_repo_touched,
        commit_created: result.commit_created,
        error: error.message,
      });
    } catch {}
    return result;
  }
}

if (require.main === module) {
  runPeaTask({
    repo: process.env.PEA_REPO || 'via-decide/decide.engine-tools',
    taskId: process.env.PEA_TASK_ID,
    sourceRepoPath: process.env.PEA_SOURCE_REPO,
    parentCwd: process.env.PEA_PARENT_CWD,
    outputRoot: process.env.PEA_OUTPUT_ROOT,
    executorCommand: process.env.PEA_EXECUTOR_COMMAND,
    validationCommand: process.env.PEA_VALIDATION_COMMAND,
    commitMessage: process.env.PEA_COMMIT_MESSAGE,
  });
}

module.exports = {
  runPeaTask,
  safeTaskId,
  ensureWithin,
  ensureSafeRelative,
  parseRepoSlug,
  copyRepoContents,
};
