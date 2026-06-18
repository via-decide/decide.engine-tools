#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const TEMPLATES = Object.freeze({
  html_tool: (name) => `<!doctype html>\n<html lang="en">\n<head>\n  <meta charset="utf-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1">\n  <title>${name}</title>\n</head>\n<body>\n  <main>\n    <h1>${name}</h1>\n  </main>\n</body>\n</html>\n`,
  node_cli: (name) => `#!/usr/bin/env node\n'use strict';\n\nconsole.log('${name}');\n`,
  python_cli: (name) => `#!/usr/bin/env python3\n\nprint('${name}')\n`,
  json_schema: () => `{"$schema":"https://json-schema.org/draft/2020-12/schema","type":"object","additionalProperties":false}\n`,
  markdown_doc: (name) => `# ${name}\n\nGenerated documentation stub.\n`,
});

function isWithinAllowed(absPath, allowedAbs) {
  return allowedAbs.some((base) => absPath === base || absPath.startsWith(base + path.sep));
}

function normalizeManifest(m) {
  const manifest = m && typeof m === 'object' && !Array.isArray(m) ? m : {};
  return {
    task_id: typeof manifest.task_id === 'string' && manifest.task_id ? manifest.task_id : 'unknown-task',
    template: typeof manifest.template === 'string' ? manifest.template : '',
    output_file: typeof manifest.output_file === 'string' ? manifest.output_file : '',
    target_name: typeof manifest.target_name === 'string' && manifest.target_name ? manifest.target_name : 'Generated Tool',
    allow_overwrite: manifest.allow_overwrite === true,
    target_paths: Array.isArray(manifest.target_paths) ? manifest.target_paths.filter((p) => typeof p === 'string' && p) : [],
  };
}

function runGeneratorExecutor(manifest, options = {}) {
  const cwd = path.resolve(options.cwd || process.cwd());
  const outputFile = path.resolve(cwd, options.outputFile || 'generator_result.json');
  const m = normalizeManifest(manifest);
  const result = {
    task_id: m.task_id,
    executor: 'generator executor',
    status: 'FAIL',
    template: m.template,
    generated_files: [],
    error: null,
  };

  if (!TEMPLATES[m.template]) {
    result.error = `Unsupported template: ${m.template || '<empty>'}`;
    fs.writeFileSync(outputFile, JSON.stringify(result, null, 2) + '\n');
    return result;
  }
  if (!m.output_file) {
    result.error = 'output_file is required.';
    fs.writeFileSync(outputFile, JSON.stringify(result, null, 2) + '\n');
    return result;
  }
  if (m.target_paths.length === 0) {
    result.error = 'target_paths is required.';
    fs.writeFileSync(outputFile, JSON.stringify(result, null, 2) + '\n');
    return result;
  }

  const targetAbs = path.resolve(cwd, m.output_file);
  const allowedAbs = m.target_paths.map((p) => path.resolve(cwd, p));

  if (!isWithinAllowed(targetAbs, allowedAbs)) {
    result.error = 'Refusing write outside allowed target paths.';
    fs.writeFileSync(outputFile, JSON.stringify(result, null, 2) + '\n');
    return result;
  }

  if (fs.existsSync(targetAbs) && !m.allow_overwrite) {
    result.error = 'Target file exists and allow_overwrite is false.';
    fs.writeFileSync(outputFile, JSON.stringify(result, null, 2) + '\n');
    return result;
  }

  fs.mkdirSync(path.dirname(targetAbs), { recursive: true });
  const content = TEMPLATES[m.template](m.target_name);
  fs.writeFileSync(targetAbs, content, 'utf8');

  result.status = 'PASS';
  result.generated_files = [m.output_file];
  fs.writeFileSync(outputFile, JSON.stringify(result, null, 2) + '\n');
  return result;
}

if (require.main === module) {
  const manifestPath = process.argv[2];
  if (!manifestPath) {
    process.stdout.write(JSON.stringify({ status: 'FAIL', error: 'Usage: node tools/executors/generator-executor.js <manifest.json>' }, null, 2) + '\n');
    process.exit(1);
  }
  const manifest = JSON.parse(fs.readFileSync(path.resolve(manifestPath), 'utf8'));
  const result = runGeneratorExecutor(manifest, { cwd: process.cwd() });
  process.stdout.write(JSON.stringify(result, null, 2) + '\n');
  process.exit(result.status === 'PASS' ? 0 : 1);
}

module.exports = { runGeneratorExecutor, normalizeManifest, TEMPLATES };
