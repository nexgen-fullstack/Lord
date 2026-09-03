/* ============================================================================
   SANGUIS CHRISTI — service worker  ·  GENERATED FILE, DO NOT EDIT
   ----------------------------------------------------------------------------
   Source: src/service-worker.js — edit that and run `npm run build`.
   __VERSION__ and the two asset lists below are injected by src/build.js.

   Caching contract
   ----------------
   · Prayer pages are served CACHE-FIRST. A devotion must open instantly and
     must open with no signal at all; freshness is handled by revalidating in
     the background and telling the page when a new version is ready.
   · Everything is same-origin. The fonts are self-hosted precisely so that
     nothing here depends on an opaque cross-origin response.
   · One version = one cache. Activating a new version drops every older one,
     so a stale prayer text can never survive a deploy.
   ========================================================================== */

'use strict';

const VERSION = "e654753f5694";
const CACHE = 'sanguis-' + VERSION;

/* Must all cache for the install to count as successful — this is the set that
   makes the six devotions readable with no network whatsoever. */
const CRITICAL = [
  "/Lord/uk/",
  "/Lord/en/",
  "/Lord/de/",
  "/Lord/it/",
  "/Lord/pt/",
  "/Lord/es/",
  "/Lord/assets/css/main.css",
  "/Lord/assets/css/fonts.css",
  "/Lord/assets/js/app.js"
];

/* Best-effort: fonts, artwork, icons. A failure here (a flaky first load on
   mobile data) leaves the app installed and fully usable, just plainer until
   the next visit tops the cache up. */
const OPTIONAL = [
  "/Lord/index.html",
  "/Lord/assets/img/Jesus.jpeg",
  "/Lord/uk/app.webmanifest",
  "/Lord/en/app.webmanifest",
  "/Lord/de/app.webmanifest",
  "/Lord/it/app.webmanifest",
  "/Lord/pt/app.webmanifest",
  "/Lord/es/app.webmanifest",
  "/Lord/site.webmanifest",
  "/Lord/assets/icons/icon-192.png",
  "/Lord/assets/icons/icon-512.png",
  "/Lord/assets/icons/icon-maskable-192.png",
  "/Lord/assets/icons/icon-maskable-512.png",
  "/Lord/assets/icons/apple-touch-icon.png",
  "/Lord/assets/fonts/cinzel-400-latin.woff2",
  "/Lord/assets/fonts/cinzel-600-latin.woff2",
  "/Lord/assets/fonts/cinzel-700-latin.woff2",
  "/Lord/assets/fonts/cormorant-garamond-400-cyrillic.woff2",
  "/Lord/assets/fonts/cormorant-garamond-400-italic-cyrillic.woff2",
  "/Lord/assets/fonts/cormorant-garamond-400-italic-latin.woff2",
  "/Lord/assets/fonts/cormorant-garamond-400-latin.woff2",
  "/Lord/assets/fonts/cormorant-garamond-600-cyrillic.woff2",
  "/Lord/assets/fonts/cormorant-garamond-600-italic-cyrillic.woff2",
  "/Lord/assets/fonts/cormorant-garamond-600-italic-latin.woff2",
  "/Lord/assets/fonts/cormorant-garamond-600-latin.woff2",
  "/Lord/assets/fonts/cormorant-garamond-700-cyrillic.woff2",
  "/Lord/assets/fonts/cormorant-garamond-700-latin.woff2",
  "/Lord/assets/fonts/montserrat-400-cyrillic.woff2",
  "/Lord/assets/fonts/montserrat-400-latin.woff2",
  "/Lord/assets/fonts/montserrat-500-cyrillic.woff2",
  "/Lord/assets/fonts/montserrat-500-latin.woff2",
  "/Lord/assets/fonts/montserrat-600-cyrillic.woff2",
  "/Lord/assets/fonts/montserrat-600-latin.woff2"
];

/* Served when an uncached page is requested with no network. */
const OFFLINE_FALLBACK = "/Lord/uk/";

/* The site's own root — '/' at a domain root, '/<repo>/' under GitHub Pages. */
const ROOT = "/Lord/";

/* ────────────────────────────── install ────────────────────────────── */

/* `reload` bypasses the HTTP cache, so a freshly deployed page can never be
   precached from a stale browser-cache entry. One retry absorbs the single
   dropped request that mobile data produces often enough to matter — with
   `addAll`, that one failure used to abort the whole install and leave the
   reader with no offline copy at all. */
async function store(cache, url) {
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(new Request(url, { cache: 'reload' }));
      if (res && res.ok) { await cache.put(url, res.clone()); return true; }
    } catch (e) { /* offline or dropped — fall through to the retry */ }
  }
  return false;
}

/* Anything already held is left alone, so a top-up costs no bandwidth. */
async function fill(cache, urls) {
  const missing = [];
  for (const url of urls) {
    if (await cache.match(url)) continue;
    if (!(await store(cache, url))) missing.push(url);
  }
  return missing;
}

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);

    const failed = await fill(cache, CRITICAL);
    if (failed.length) {
      /* The six devotions are the point of the app; without them there is
         nothing to install. Rejecting keeps the previous version in place. */
      throw new Error('precache incomplete: ' + failed.join(', '));
    }

    /* Fonts, artwork, icons: the app is fully usable without them, just
       plainer, and `activate` tops them up on a later visit. */
    await fill(cache, OPTIONAL);
  })());
});

/* ────────────────────────────── activate ───────────────────────────── */

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(
      names.filter((n) => n.startsWith('sanguis-') && n !== CACHE).map((n) => caches.delete(n))
    );

    /* Lets a repeat visit answer from the cache without a round trip. */
    if (self.registration.navigationPreload) {
      try { await self.registration.navigationPreload.enable(); } catch (e) { /* not supported */ }
    }

    await self.clients.claim();

    /* Whatever the first visit could not reach — a font dropped on a flaky
       connection — is picked up now, so the offline copy heals itself instead
       of staying permanently incomplete. */
    const cache = await caches.open(CACHE);
    await fill(cache, OPTIONAL);
  })());
});

/* ──────────────────────────────── fetch ────────────────────────────── */

const isHTML = (req) =>
  req.mode === 'navigate' ||
  (req.headers.get('accept') || '').indexOf('text/html') > -1;

/* Revalidate in the background; never let a network error surface. */
function refresh(cache, request) {
  return fetch(request)
    .then((res) => {
      if (res && res.ok && res.type === 'basic') cache.put(request, res.clone());
      return res;
    })
    .catch(() => null);
}

self.addEventListener('fetch', (event) => {
  const req = event.request;

  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;   /* nothing else is ours */

  /* Range requests (audio scrubbing) must reach the network untouched — a
     cached 200 handed back for a Range request breaks playback in Safari. */
  if (req.headers.has('range')) return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE);

    /* The bare root is a redirect in every deployment (edge middleware on
       Pages, _redirects elsewhere), so it is never cached as itself. Online,
       the host decides the language; offline, the gateway page can still do
       it, and only if that is missing do we fall back to one fixed locale. */
    if (url.pathname === ROOT || url.pathname + '/' === ROOT) {
      try {
        return await fetch(req);
      } catch (e) {
        return (await cache.match(ROOT + 'index.html')) ||
               (await cache.match(OFFLINE_FALLBACK)) ||
               Response.error();
      }
    }

    /* "/uk/index.html" and "/uk/" are the same document; the precache holds
       the directory form, so normalise before looking it up. */
    const canonical = url.pathname.replace(/\/index\.html$/, '/');
    const lookup = canonical === url.pathname
      ? req
      : new Request(url.origin + canonical, { headers: req.headers });

    const hit = await cache.match(lookup, { ignoreSearch: isHTML(req) });

    if (hit) {
      /* Cache-first, then quietly bring the copy up to date. */
      event.waitUntil(refresh(cache, req));
      return hit;
    }

    /* Not cached yet. */
    try {
      const preload = event.preloadResponse ? await event.preloadResponse : null;
      const res = preload || await fetch(req);
      if (res && res.ok && res.type === 'basic') {
        cache.put(req, res.clone());
      }
      return res;
    } catch (e) {
      if (isHTML(req)) {
        const fallback = await cache.match(OFFLINE_FALLBACK);
        if (fallback) return fallback;
      }
      return Response.error();
    }
  })());
});

/* ─────────────────────────────── messages ──────────────────────────── */

self.addEventListener('message', (event) => {
  const data = event.data || {};

  /* The page asks for this only after the reader taps "update". */
  if (data.type === 'SKIP_WAITING') self.skipWaiting();

  /* Lets the page report how much of the devotion is actually stored. Counts
     the precache list itself, not the cache's key count — runtime entries
     would otherwise inflate it past 100%. */
  if (data.type === 'CACHE_STATUS') {
    event.waitUntil((async () => {
      const cache = await caches.open(CACHE);
      const want = CRITICAL.concat(OPTIONAL);
      const present = await Promise.all(want.map((u) => cache.match(u).then((r) => !!r)));
      const payload = {
        type: 'CACHE_STATUS',
        version: VERSION,
        cached: present.filter(Boolean).length,
        total: want.length,
        pages: (await Promise.all(CRITICAL.map((u) => cache.match(u).then((r) => !!r))))
          .filter(Boolean).length,
        pagesTotal: CRITICAL.length
      };
      const port = event.ports && event.ports[0];
      if (port) port.postMessage(payload);
      else (await self.clients.matchAll()).forEach((c) => c.postMessage(payload));
    })());
  }
});
