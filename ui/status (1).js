(function (global) {
  'use strict';

  function setLoading(container, message) {
    const node = document.querySelector(container || '[data-status]');
    if (!node) return;
    node.innerHTML = `<div class="vd-status loading"><span class="spinner"></span><span>${message || 'Loading module...'}</span></div>`;
  }

  function setProgress(container, message) {
    const node = document.querySelector(container || '[data-status]');
    if (!node) return;
    node.innerHTML = `<div class="vd-status progress"><strong>Progress:</strong> ${message || 'Running checks...'}</div>`;
  }

  function setError(container, message) {
    const node = document.querySelector(container || '[data-status]');
    if (!node) return;
    node.innerHTML = `<div class="vd-status error"><strong>Error:</strong> ${message || 'Unable to load module.'}</div>`;
  }

  global.VDStatus = { setLoading, setProgress, setError };
})(window);
