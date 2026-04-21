(function (global) {
  'use strict';

  function toDaxString(bundle) {
    return JSON.stringify({
      bundle,
      exported_at: new Date().toISOString(),
      format: 'application/vnd.dax.bundle+json'
    }, null, 2);
  }

  function buildDaxArtifact(bundle, options) {
    const filename = String((options && options.filename) || 'app.dax').trim() || 'app.dax';
    return {
      filename,
      mime: 'application/vnd.dax.bundle+json',
      extension: '.dax',
      content: toDaxString(bundle)
    };
  }

  function downloadBundle(bundle, options) {
    const artifact = buildDaxArtifact(bundle, options);
    if (typeof Blob === 'undefined' || typeof document === 'undefined') {
      return artifact;
    }

    const blob = new Blob([artifact.content], { type: artifact.mime });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = artifact.filename;
    link.click();
    return artifact;
  }

  global.DaxBundleExporter = {
    toDaxString,
    buildDaxArtifact,
    downloadBundle
  };
})(window);
