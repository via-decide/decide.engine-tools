/* ViaDecide Engine — Service Worker v3 */

const CACHE_NAME = 'viadecide-v3';

// Core shell files to cache on install
const SHELL_ASSETS = [
  '/',
  '/index.html',
  '/router.js',
  '/manifest.webmanifest',
  '/shared/shared.css',
  '/shared/utils.js',
  '/shared/tool-registry.js',
  '/shared/vd-auth.js',
  '/shared/ai_dispatcher.js'
];

// Origins that must never be cached (live data / auth tokens)
const BYPASS_ORIGINS = [
  'firestore.googleapis.com',
  'identitytoolkit.googleapis.com',
  'securetoken.googleapis.com',
  'firebaseinstallations.googleapis.com',
  'googleapis.com'
];

// Static file extensions that get cache-first treatment
const STATIC_EXTS = /\.(html|css|js|png|svg|jpg|jpeg|webp|woff2|woff|ttf|ico|json|webmanifest)$/i;

// Install: cache shell
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
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

// Fetch strategy
self.addEventListener('fetch', event => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Bypass: Firebase / Google APIs — always network, never cache
  if (BYPASS_ORIGINS.some(o => url.hostname.includes(o))) return;
  // Bypass: fonts, gstatic
  if (url.hostname.includes('gstatic') || url.hostname.includes('fonts.googleapis')) return;
  // Bypass: cross-origin (other than same origin)
  if (url.origin !== self.location.origin) return;

  // HTML navigation: network-first, fallback to cached index
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(response => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => caches.match(request).then(c => c || caches.match('/index.html')))
    );
    return;
  }

  // Static assets: cache-first, update in background
  if (STATIC_EXTS.test(url.pathname)) {
    event.respondWith(
      caches.match(request).then(cached => {
        const networkFetch = fetch(request).then(response => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
          }
          return response;
        }).catch(() => null);

        return cached || networkFetch;
      })
    );
    return;
  }

  // Default: network-only (API calls, dynamic data)
  // Let the browser handle it normally
});
