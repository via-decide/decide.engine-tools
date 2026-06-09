(function (global) {
  'use strict';

  const cache = new Map();

  function loadText(url) {
    if (cache.has(url)) return cache.get(url);

    const pending = fetch(url, { cache: 'no-cache' })
      .then((response) => {
        if (!response.ok) throw new Error(`Failed to load asset: ${url}`);
        return response.text();
      });

    cache.set(url, pending);
    return pending;
  }

  function getCached(url) {
    return cache.get(url) || null;
  }

  global.AssetLoader = {
    loadText,
    getCached,
    cache
  };
})(window);
