/* Medical Sign service worker.
 *
 * Its job is not offline use - the server is on the same desk, and stale
 * signage is worse than no signage. It exists so Windows and Chrome will
 * install this as an app with its own window and icon, and so the shell
 * still paints if the server is restarting.
 *
 * Network first, always. The cache is only ever a fallback for the static
 * shell, and /api/ is never cached at all: a door sign showing yesterday's
 * doctor from a cache would be exactly the failure this system exists to
 * prevent.
 */

const CACHE = 'medsign-shell-v1';

// Relative, so the same worker is correct at the site root and under a
// sub-path like /Medical-Sign/ where the demo build is published.
const SHELL = [
  './',
  './app.css',
  './app.js',
  './display.html',
  './display.css',
  './display.js',
  './manifest.webmanifest',
  './brand/medsign-logo-128.png',
  './brand/medsign-logo-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE)
      // one missing file must not fail the whole install
      .then((c) => Promise.allSettled(SHELL.map((url) => c.add(url))))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // live data and the event stream always go to the server, or fail honestly
  if (url.pathname.includes('/api/')) return;

  event.respondWith(
    fetch(request)
      .then((res) => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(request, copy)).catch(() => {});
        }
        return res;
      })
      .catch(async () => {
        const hit = await caches.match(request);
        if (hit) return hit;
        // a navigation with nothing cached still needs something to show
        if (request.mode === 'navigate') {
          const shell = await caches.match('./');
          if (shell) return shell;
        }
        throw new Error('offline and not cached');
      }),
  );
});
