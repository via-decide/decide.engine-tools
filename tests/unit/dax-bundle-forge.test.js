const fs = require('fs');
const path = require('path');

const global_mock = {};
global_mock.window = global_mock;
global.window = global_mock;

global_mock.TextEncoder = TextEncoder;

function loadIIFE(filePath) {
  const source = fs.readFileSync(filePath, 'utf8');
  const sandboxed = source.replace(/\}\)\(window\);?\s*$/, '})(global_mock);');
  eval(sandboxed);
}

loadIIFE(path.join(__dirname, '../../bundle-forge/bundle-builder.js'));
loadIIFE(path.join(__dirname, '../../bundle-forge/bundle-validator.js'));
loadIIFE(path.join(__dirname, '../../bundle-forge/bundle-exporter.js'));

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

console.log('\n── DaxBundleForge ──');

const bundle = global_mock.DaxBundleBuilder.buildBundle({
  manifest: {
    name: 'Restaurant Ordering App',
    creator: 'creator_id',
    version: '1.0',
    category: 'food',
    bundle_type: 'pwa',
    runtime: 'daxini-runtime',
    price: 9
  },
  pages: [{ id: 'home' }],
  components: [{ id: 'menu-card' }],
  assets: ['assets/logo.png'],
  workflows: [{ id: 'order-flow' }]
});

assert('builder produces manifest runtime', bundle.manifest.runtime === 'daxini-runtime');
assert('builder includes bundle metadata', bundle.bundle_meta && bundle.bundle_meta.extension === '.dax');

const validation = global_mock.DaxBundleValidator.validateBundle(bundle);
assert('validator approves valid bundle', validation.ok === true);

const unsafeBundle = JSON.parse(JSON.stringify(bundle));
unsafeBundle.pages = [{ template: '<script>eval(1)</script>' }];
const unsafeValidation = global_mock.DaxBundleValidator.validateBundle(unsafeBundle);
assert('validator rejects unsafe scripts', unsafeValidation.ok === false && unsafeValidation.errors.some((e) => e.includes('Unsafe script pattern')));

const artifact = global_mock.DaxBundleExporter.buildDaxArtifact(bundle);
assert('exporter defaults to app.dax filename', artifact.filename === 'app.dax');
assert('exporter emits dax extension', artifact.extension === '.dax');
assert('exporter serializes bundle payload', artifact.content.includes('Restaurant Ordering App'));

module.exports = { passed, failed };
