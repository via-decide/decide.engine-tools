(function (global) {
  'use strict';

  const MAX_BUNDLE_SIZE_BYTES = 5 * 1024 * 1024;
  const SCRIPT_BLOCKLIST = [
    'eval(',
    'new Function(',
    'document.write(',
    '<script src="http://',
    '<script src="https://'
  ];

  function asArray(value) {
    return Array.isArray(value) ? value : [];
  }

  function byteSize(payload) {
    const text = JSON.stringify(payload || {});
    if (typeof TextEncoder !== 'undefined') return new TextEncoder().encode(text).length;
    return unescape(encodeURIComponent(text)).length;
  }

  function validateStructure(bundle) {
    const errors = [];
    if (!bundle || typeof bundle !== 'object') errors.push('Bundle payload must be an object.');
    ['manifest', 'app', 'pages', 'components', 'assets', 'workflows'].forEach((field) => {
      if (!(field in (bundle || {}))) errors.push(`Missing required bundle field: ${field}`);
    });
    return { ok: errors.length === 0, errors };
  }

  function validateManifest(manifest) {
    const errors = [];
    const required = ['name', 'creator', 'version', 'category', 'bundle_type', 'runtime'];
    required.forEach((field) => {
      if (!String((manifest || {})[field] || '').trim()) errors.push(`Missing manifest field: ${field}`);
    });
    return { ok: errors.length === 0, errors };
  }

  function validateRuntimeCompatibility(bundle, options) {
    const expected = String((options && options.expectedRuntime) || 'daxini-runtime').trim();
    const runtime = String(bundle && bundle.manifest && bundle.manifest.runtime || '').trim();
    const errors = runtime === expected ? [] : [`Unsupported runtime: ${runtime || 'unknown'}`];
    return { ok: errors.length === 0, errors };
  }

  function scanScriptSafety(bundle) {
    const errors = [];
    const searchable = [
      ...asArray(bundle.pages),
      ...asArray(bundle.components),
      ...asArray(bundle.workflows)
    ].map((item) => JSON.stringify(item || {}));

    searchable.forEach((chunk, index) => {
      SCRIPT_BLOCKLIST.forEach((rule) => {
        if (chunk.includes(rule)) errors.push(`Unsafe script pattern found in bundle content #${index + 1}: ${rule}`);
      });
    });

    return { ok: errors.length === 0, errors };
  }

  function validateFileSize(bundle, options) {
    const maxBytes = Number((options && options.maxBundleSizeBytes) || MAX_BUNDLE_SIZE_BYTES);
    const size = byteSize(bundle);
    const errors = size <= maxBytes ? [] : [`Bundle size ${size} exceeds max ${maxBytes}`];
    return { ok: errors.length === 0, errors, size };
  }

  function validateBundle(bundle, options) {
    const checks = [
      validateStructure(bundle),
      validateManifest(bundle && bundle.manifest),
      validateRuntimeCompatibility(bundle, options),
      validateFileSize(bundle, options),
      scanScriptSafety(bundle)
    ];

    const errors = checks.flatMap((check) => check.errors || []);
    return {
      ok: errors.length === 0,
      errors,
      size: checks[3].size,
      checks
    };
  }

  global.DaxBundleValidator = {
    MAX_BUNDLE_SIZE_BYTES,
    SCRIPT_BLOCKLIST,
    byteSize,
    validateStructure,
    validateManifest,
    validateRuntimeCompatibility,
    validateFileSize,
    scanScriptSafety,
    validateBundle
  };
})(window);
