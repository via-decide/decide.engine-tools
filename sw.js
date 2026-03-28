/* ViaDecide Studio — Service Worker v1.0 */
const CACHE = 'viadecide-v1';

const SHELL = [

const CACHE_NAME = 'viadecide-v1';

// Core shell files to cache on install
const SHELL_ASSETS = [
  '/',
  '/index.html',
  '/router.js',
  '/manifest.webmanifest',
  '/shared/shared.css',
  '/shared/utils.js',
  '/shared/tool-registry.js',
  '/shared/tool-storage.js',
  '/shared/tool-bridge.js',
  '/shared/engine-utils.js',
  '/shared/vd-auth.js',
];

// Install — cache shell assets
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c =>
      Promise.allSettled(SHELL.map(u => c.add(u).catch(() => null)))
    ).then(() => self.skipWaiting())
  );
});

// Activate — clear old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Fetch strategy
self.addEventListener('fetch', e => {
  const { request } = e;
  const url = new URL(request.url);

  // Skip non-GET
  if (request.method !== 'GET') return;

  // Skip Firebase, Google fonts, external CDNs — let them fail gracefully
  const skip = ['firebase', 'googleapis', 'gstatic', 'fonts.g', 'cdn.', 'cdnjs.', 'supabase', 'anthropic'];
  if (skip.some(s => url.hostname.includes(s))) return;

  // Skip API proxy — never cache server responses
  if (url.pathname.startsWith('/api/')) return;

  // HTML navigation — network first, fallback to cached shell
  if (request.mode === 'navigate') {
    e.respondWith(
      fetch(request).catch(() => caches.match('/index.html'))
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

  // Static assets — cache first, network fallback
  e.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request).then(res => {
        if (!res || res.status !== 200 || res.type === 'opaque') return res;
        caches.open(CACHE).then(c => c.put(request, res.clone()));
        return res;
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
