/* ============================================================
   SW.JS — shared service worker for index.html, admin.html, captain.html
   Reservation/table data is always live from Firestore (needs network),
   so this only caches the static app shell — enough for install
   prompts to work and for the page to open instantly (even briefly
   offline) before Firestore reconnects.
   ============================================================ */

const CACHE_NAME = "bon-amigos-shell-v1";
const SHELL_FILES = [
  "./",
  "./index.html",
  "./admin.html",
  "./captain.html",
  "./tables.js",
  "./reservations.js",
  "./icon-192.png",
  "./icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_FILES)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

/* Network-first for our own pages/scripts (so staff always see live data
   the moment they're online); cached shell is only the offline fallback. */
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if(url.origin !== self.location.origin) return; // let Firebase/CDN requests pass through untouched

  event.respondWith(
    fetch(event.request)
      .then((res) => {
        const clone = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone)).catch(() => {});
        return res;
      })
      .catch(() => caches.match(event.request))
  );
});
