const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

let passed = 0;
let failed = 0;

function assert(name, condition) {
  if (condition) {
    console.log(`✓ ${name}`);
    passed += 1;
  } else {
    console.error(`✗ ${name}`);
    failed += 1;
  }
}

const root = path.resolve(__dirname, '../../Orchade');

const requiredPaths = [
  'engine/core/core_engine.py',
  'engine/core/ecs.py',
  'engine/ai/npc_ai.py',
  'engine/config.py',
  'ai/zayvora_bridge/zayvora_agent.py',
  'tools/worldgen/world_generator.py',
  'tools/asset_pipeline/asset_loader.py',
  'scripts/run_game.py',
  'docs/architecture.md',
  'docs/ecs_design.md',
  'docs/ai_system.md',
  'docs/zayvora_integration.md',
  'config/game.yaml',
  'requirements.txt',
  'setup.sh',
  'Makefile',
];

for (const rel of requiredPaths) {
  assert(`exists: ${rel}`, fs.existsSync(path.join(root, rel)));
}

const pyFiles = requiredPaths.filter((p) => p.endsWith('.py')).map((p) => path.join(root, p));
const compile = spawnSync('python3', ['-m', 'py_compile', ...pyFiles], { encoding: 'utf8' });
assert('python files compile', compile.status === 0);
if (compile.status !== 0) {
  console.error(compile.stderr || compile.stdout);
}

module.exports = { passed, failed };
