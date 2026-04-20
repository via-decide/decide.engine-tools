const fs = require('fs');
const path = require('path');

const global_mock = {
  DECIDE_DYNAMIC_MODULES: {},
  localStorage: {
    _data: {},
    getItem(key) { return this._data[key] || null; },
    setItem(key, value) { this._data[key] = String(value); }
  },
  fetch: async () => ({
    ok: true,
    json: async () => ({ chunkSize: 16, mapSize: 24, biomeSet: ['plains', 'forest'] })
  }),
  GameLoader: {
    registerDynamicModule(environment) {
      global_mock.DECIDE_DYNAMIC_MODULES[environment.name] = environment;
    }
  }
};

global_mock.window = global_mock;
global.window = global_mock;
global.localStorage = global_mock.localStorage;
global.fetch = global_mock.fetch;

function loadIIFE(filePath, replacePattern) {
  const source = fs.readFileSync(filePath, 'utf8');
  const sandboxed = source.replace(replacePattern, '})(global_mock);');
  eval(sandboxed);
}

loadIIFE(path.join(__dirname, '../../world-templates/voxel-world/terrain-generator.js'), /\}\)\(window\);?\s*$/);
loadIIFE(path.join(__dirname, '../../world-templates/voxel-world/entity-system.js'), /\}\)\(window\);?\s*$/);
loadIIFE(path.join(__dirname, '../../world-templates/voxel-world/ui-template.js'), /\}\)\(window\);?\s*$/);
loadIIFE(path.join(__dirname, '../../ai/world-generator/world-parser.js'), /\}\)\(window\);?\s*$/);
loadIIFE(path.join(__dirname, '../../ai/world-generator/world-builder.js'), /\}\)\(window\);?\s*$/);
loadIIFE(path.join(__dirname, '../../ai/world-generator/world-registry.js'), /\}\)\(window\);?\s*$/);
loadIIFE(path.join(__dirname, '../../ai/world-pipeline.js'), /\}\)\(window\);?\s*$/);

let passed = 0;
let failed = 0;

function assert(label, condition) {
  if (condition) {
    console.log(`  ✓ ${label}`);
    passed += 1;
  } else {
    console.error(`  ✗ FAIL: ${label}`);
    failed += 1;
  }
}

console.log('\n── AIWorldPipeline ──');

const parsed = global_mock.WorldParser.parsePrompt('Create a Minecraft-style survival world.', {
  template: 'voxel-world',
  worldId: 'voxel-demo',
  worldName: 'Voxel Demo World',
  seed: 424242
});
assert('parsePrompt infers voxel template', parsed.template === 'voxel-world');

const worldModule = global_mock.WorldBuilder.buildWorld(parsed, {
  id: 'voxel-world',
  config: { chunkSize: 16, mapSize: 24, biomeSet: ['plains', 'forest'] }
});
assert('world builder creates runtime module', worldModule.name === 'voxel-demo');
assert('world module exposes game factory', typeof worldModule.definition.gameFactory === 'function');

const metadata = global_mock.WorldRegistry.registerWorld(worldModule);
assert('world registry stores voxel metadata', metadata.template === 'voxel-world');
assert('world registry tracks launch id', global_mock.WorldRegistry.listWorlds()[0].world_id === 'voxel-demo');

const preset = global_mock.AIWorldPipeline.resolvePreset('voxel-demo');
assert('pipeline resolves voxel-demo preset', preset.options.worldId === 'voxel-demo');

module.exports = { passed, failed };
