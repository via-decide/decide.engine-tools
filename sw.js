/* ViaDecide Studio — Service Worker v1.0 */
const CACHE_NAME = 'viadecide-v1';

// Cache paths are relative so the app works under /decide.engine-tools/ on GitHub Pages.
const SHELL_ASSETS = [
  './',
  './index.html',
  './router.js',
  './manifest.webmanifest',
  './shared/shared.css',
  './shared/utils.js',
  './shared/tool-registry.js',
  './shared/tool-storage.js',
  './shared/tool-bridge.js',
  './shared/engine-utils.js',
  './shared/vd-auth.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(cache => Promise.allSettled(SHELL_ASSETS.map(url => cache.add(url).catch(() => null))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches
      .keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== 'GET') return;

  const skipHosts = ['firebase', 'googleapis', 'gstatic', 'fonts.g', 'cdn.', 'cdnjs.', 'supabase', 'anthropic'];
  if (skipHosts.some(host => url.hostname.includes(host))) return;

  if (url.pathname.includes('/api/')) return;

  // Network-first for navigation requests, fallback to cached shell page.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => caches.match('./index.html'))
    );
    return;
  }

  // Cache-first for static assets with network fallback and cache fill.
  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request)
        .then(response => {
          if (!response || response.status !== 200 || response.type === 'opaque') {
            return response;
          }
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
          return response;
        })
        .catch(() => null);
    })
  );
});
