(function (global) {
  'use strict';

  const REQUIRED_DIRS = ['pages', 'components', 'assets', 'workflows'];

  function safeArray(value) {
    return Array.isArray(value) ? value.filter(Boolean) : [];
  }

  function normalizeManifest(input) {
    const payload = input || {};
    return {
      name: String(payload.name || payload.appName || 'Untitled App').trim(),
      creator: String(payload.creator || payload.creator_id || 'unknown').trim(),
      version: String(payload.version || '1.0').trim(),
      category: String(payload.category || 'general').trim(),
      bundle_type: String(payload.bundle_type || payload.bundleType || 'pwa').trim(),
      runtime: String(payload.runtime || 'daxini-runtime').trim(),
      price: Number.isFinite(Number(payload.price)) ? Number(payload.price) : 0
    };
  }

  function buildBundle(project, options) {
    const source = project || {};
    const manifest = normalizeManifest(source.manifest || source.app || source);
    const app = {
      id: String(source.id || source.appId || '').trim() || `app-${Date.now()}`,
      title: String(source.title || manifest.name).trim(),
      description: String(source.description || '').trim(),
      entry: String(source.entry || 'pages/index.json').trim(),
      created_at: source.created_at || new Date().toISOString()
    };

    const bundle = {
      manifest,
      app,
      pages: safeArray(source.pages),
      components: safeArray(source.components),
      assets: safeArray(source.assets),
      workflows: safeArray(source.workflows),
      icon: source.icon || null,
      bundle_meta: {
        format: 'dax-bundle',
        extension: '.dax',
        generated_at: new Date().toISOString(),
        required_dirs: REQUIRED_DIRS.slice(),
        source: String((options && options.source) || 'decide.engine-tools').trim()
      }
    };

    return bundle;
  }

  global.DaxBundleBuilder = {
    REQUIRED_DIRS,
    normalizeManifest,
    buildBundle
  };
})(window);
