/* PrintByDD Store — Service Worker v1.0 (Monorepo Integration) */
const CACHE = 'printbydd-v1';
const OFFLINE_ASSETS = [
  '/tool/printbydd/',
  '/tool/printbydd/index.html',
  '/tool/printbydd/keychain.html',
  '/tool/printbydd/numberplate.html',
  '/tool/printbydd/gifts-that-mean-more.html',
  '/tool/printbydd/gift-psychology.html',
  '/tool/printbydd/products.html',
  '/tool/printbydd/manifest.json',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(OFFLINE_ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(res => {
        if (!res || res.status !== 200 || res.type === 'opaque') return res;
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return res;
      }).catch(() => caches.match('/tool/printbydd/index.html'));
    })
  );
});
