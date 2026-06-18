#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const SCHEMA_PATH = path.resolve(__dirname, '../schema/tool-task.schema.json');
const ALLOWED_MODES = new Set([
  'generate',
  'refactor',
  'debug',
  'validate',
  'test',
  'document',
  'package',
  'deploy_prepare',
  'security_scan',
]);

function loadSchema() {
  return JSON.parse(fs.readFileSync(SCHEMA_PATH, 'utf8'));
}

function typeOfValue(value) {
  if (Array.isArray(value)) return 'array';
  if (value === null) return 'null';
  return typeof value;
}

function pushError(errors, pathLabel, code, message) {
  errors.push({ path: pathLabel, code, message });
}

function validateTaskManifest(manifest, schema = loadSchema()) {
  const errors = [];

  if (!manifest || typeof manifest !== 'object' || Array.isArray(manifest)) {
    pushError(errors, '$', 'invalid_type', 'Manifest must be an object.');
    return { valid: false, errors, schema_id: schema.$id || null };
  }

  for (const requiredField of schema.required || []) {
    if (!(requiredField in manifest)) {
      pushError(errors, `$.${requiredField}`, 'missing_required', `Missing required field: ${requiredField}.`);
    }
  }

  const allowedTop = new Set(Object.keys(schema.properties || {}));
  Object.keys(manifest).sort().forEach((key) => {
    if (!allowedTop.has(key)) {
      pushError(errors, `$.${key}`, 'additional_property', `Unexpected field: ${key}.`);
    }
  });

  if ('task_id' in manifest && (typeof manifest.task_id !== 'string' || manifest.task_id.length < 1)) {
    pushError(errors, '$.task_id', 'invalid_type', 'task_id must be a non-empty string.');
  }

  if ('repo' in manifest && (typeof manifest.repo !== 'string' || !/^[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/.test(manifest.repo))) {
    pushError(errors, '$.repo', 'invalid_format', 'repo must be in "owner/name" format.');
  }

  if ('mode' in manifest) {
    if (typeof manifest.mode !== 'string') {
      pushError(errors, '$.mode', 'invalid_type', 'mode must be a string.');
    } else if (!ALLOWED_MODES.has(manifest.mode)) {
      pushError(errors, '$.mode', 'invalid_enum', `mode must be one of: ${Array.from(ALLOWED_MODES).join(', ')}.`);
    }
  }

  const arrayFields = ['target_files', 'expected_outputs', 'pass_criteria'];
  arrayFields.forEach((field) => {
    if (!(field in manifest)) return;
    if (!Array.isArray(manifest[field]) || manifest[field].length < 1) {
      pushError(errors, `$.${field}`, 'invalid_type', `${field} must be a non-empty array.`);
      return;
    }
    manifest[field].forEach((entry, index) => {
      if (typeof entry !== 'string' || entry.length < 1) {
        pushError(errors, `$.${field}[${index}]`, 'invalid_type', `${field}[${index}] must be a non-empty string.`);
      }
    });
  });

  if ('validation_command' in manifest && (typeof manifest.validation_command !== 'string' || manifest.validation_command.length < 1)) {
    pushError(errors, '$.validation_command', 'invalid_type', 'validation_command must be a non-empty string.');
  }

  if ('commit_policy' in manifest) {
    const cp = manifest.commit_policy;
    if (!cp || typeOfValue(cp) !== 'object') {
      pushError(errors, '$.commit_policy', 'invalid_type', 'commit_policy must be an object.');
    } else {
      const allowed = new Set(['on_validation_pass', 'on_validation_fail', 'commit_message']);
      Object.keys(cp).sort().forEach((key) => {
        if (!allowed.has(key)) {
          pushError(errors, `$.commit_policy.${key}`, 'additional_property', `Unexpected commit_policy field: ${key}.`);
        }
      });
      if (!('on_validation_pass' in cp)) {
        pushError(errors, '$.commit_policy.on_validation_pass', 'missing_required', 'Missing required field: on_validation_pass.');
      }
      if (!('on_validation_fail' in cp)) {
        pushError(errors, '$.commit_policy.on_validation_fail', 'missing_required', 'Missing required field: on_validation_fail.');
      }
      ['on_validation_pass', 'on_validation_fail'].forEach((f) => {
        if (f in cp && cp[f] !== 'commit' && cp[f] !== 'no_commit') {
          pushError(errors, `$.commit_policy.${f}`, 'invalid_enum', `${f} must be "commit" or "no_commit".`);
        }
      });
      if ('commit_message' in cp && typeof cp.commit_message !== 'string') {
        pushError(errors, '$.commit_policy.commit_message', 'invalid_type', 'commit_message must be a string.');
      }
    }
  }

  return {
    valid: errors.length === 0,
    schema_id: schema.$id || null,
    errors,
  };
}

function runCli() {
  const inputPath = process.argv[2];
  if (!inputPath) {
    const output = {
      ok: false,
      valid: false,
      errors: [{ path: '$', code: 'missing_argument', message: 'Usage: node tools/engine/validate-task-manifest.js <manifest.json>' }],
    };
    process.stdout.write(JSON.stringify(output, null, 2) + '\n');
    process.exitCode = 1;
    return;
  }

  try {
    const manifestRaw = fs.readFileSync(path.resolve(inputPath), 'utf8');
    const manifest = JSON.parse(manifestRaw);
    const result = validateTaskManifest(manifest);
    const output = {
      ok: result.valid,
      valid: result.valid,
      schema_path: SCHEMA_PATH,
      schema_id: result.schema_id,
      errors: result.errors,
    };
    process.stdout.write(JSON.stringify(output, null, 2) + '\n');
    process.exitCode = result.valid ? 0 : 1;
  } catch (error) {
    const output = {
      ok: false,
      valid: false,
      errors: [{ path: '$', code: 'runtime_error', message: error.message }],
    };
    process.stdout.write(JSON.stringify(output, null, 2) + '\n');
    process.exitCode = 1;
  }
}

if (require.main === module) {
  runCli();
}

module.exports = {
  validateTaskManifest,
  loadSchema,
  SCHEMA_PATH,
  ALLOWED_MODES,
};
