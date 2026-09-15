/* The standalone build pins every local asset to this release. */
const VERSION = '__BUILD_ID__';
const PRECACHE = /*__PRECACHE__*/ [];
const SCOPE = new URL(self.registration.scope);
const PREFIX = 'brain-garden:' + SCOPE.pathname + ':';
const CACHE = PREFIX + VERSION;
const assets = new Map(PRECACHE.map(asset => [new URL(asset.url, SCOPE).href, asset.integrity]));
const home = new URL('app-shell.json', SCOPE).href;

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    try {
      const downloads = await Promise.all([...assets].map(async ([url, integrity]) => {
        try {
          const response = await fetch(new Request(url, {cache: 'reload', integrity}));
          if (!response.ok) throw new Error('HTTP ' + response.status);
          return [url, response];
        } catch (error) {throw new Error(new URL(url).pathname + ': ' + error.message)}
      }));
      for (const [url, response] of downloads) await cache.put(url, response);
    } catch (error) {
      await caches.delete(CACHE);
      for (const client of await self.clients.matchAll({type: 'window', includeUncontrolled: true})) client.postMessage({type: 'OFFLINE_ERROR', detail: error.message});
      throw error; // An incomplete update must never replace a working release.
    }
  })());
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    for (const name of await caches.keys()) if (name.startsWith(PREFIX) && name !== CACHE) await caches.delete(name);
    await self.clients.claim();
    for (const client of await self.clients.matchAll({type: 'window'})) client.postMessage({type: 'OFFLINE_READY', version: VERSION});
  })());
});
self.addEventListener('message', event => {
  if (event.data?.type === 'SKIP_WAITING') event.waitUntil(self.skipWaiting());
  if (event.data?.type === 'GET_STATUS') event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    const present = await Promise.all([...assets.keys()].map(url => cache.match(url)));
    event.ports[0]?.postMessage({type: 'CACHE_STATUS', ready: present.length > 0 && present.every(Boolean), version: VERSION});
  })());
});
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== SCOPE.origin || !url.pathname.startsWith(SCOPE.pathname)) return;
  const navigation = request.mode === 'navigate' && (url.pathname === SCOPE.pathname || url.pathname === new URL('index.html', SCOPE).pathname);
  const key = navigation ? home : url.origin + url.pathname;
  if (!assets.has(key)) return; // Videos, sources and unknown paths use the network normally.
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const saved = await cache.match(key);
    const asPage = async response => navigation ? new Response((await response.json()).html, {headers: {'Content-Type': 'text/html; charset=utf-8'}}) : response;
    if (saved) return asPage(saved);
    // Recover an evicted asset only if it still matches this release.
    const response = await fetch(new Request(key, {integrity: assets.get(key), cache: 'reload'}));
    if (response.ok) await cache.put(key, response.clone()).catch(() => {});
    return asPage(response);
  })());
});
