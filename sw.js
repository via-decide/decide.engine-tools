/* ViaDecide Studio — Service Worker v1.0 */
const CACHE = 'viadecide-v1';

const SHELL = [
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
      }).catch(() => null);
    })
  );
});
