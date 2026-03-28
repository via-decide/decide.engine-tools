/* ViaDecide Studio — Service Worker v1.0 */

const CACHE_NAME = 'viadecide-v1';

// Core shell files to cache on install
const SHELL_ASSETS = [
  '/',
  '/index.html',
  '/router.js',
  '/manifest.webmanifest',
  '/shared/shared.css',
  '/shared/utils.js',
  '/shared/tool-registry.js'
];

// Install: cache shell
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      // Cache what exists — ignore missing files silently
      return Promise.allSettled(
        SHELL_ASSETS.map(url =>
          cache.add(url).catch(() => null)
        )
      );
    }).then(() => self.skipWaiting())
  );
});

// Activate: clear old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch: network-first for HTML/API, cache-first for assets
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET and cross-origin Firebase/Google requests
  if (request.method !== 'GET') return;
  if (url.origin.includes('firebase') || url.origin.includes('googleapis')) return;
  if (url.origin.includes('gstatic') || url.origin.includes('fonts')) return;

  // HTML navigation: network-first, fallback to cached index
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() =>
        caches.match('/index.html')
      )
    );
    return;
  }

  // Static assets: cache-first
  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request).then(response => {
        if (!response || response.status !== 200) return response;
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
        return response;
      }).catch(() => null);
    })
  );
});
