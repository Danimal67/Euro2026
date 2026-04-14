const CACHE_NAME = "trip-v4";
const CORE_ASSETS = [
  "/",
  "/index.html"
];

// INSTALL
self.addEventListener("install", (event) => {
  self.skipWaiting(); // activate immediately

  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(CORE_ASSETS))
  );
});

// ACTIVATE
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.map(key => key !== CACHE_NAME && caches.delete(key))
      );
      await self.clients.claim(); // 🔥 TAKE CONTROL IMMEDIATELY
    })()
  );
});

// FETCH
self.addEventListener("fetch", (event) => {

  // 🔥 Always handle navigation requests
  if (event.request.mode === "navigate") {
    event.respondWith(
      caches.match("/index.html")
    );
    return;
  }

  // Cache-first for everything else
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) return response;

      return fetch(event.request).then((networkResponse) => {
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      });
    }).catch(() => {
      return caches.match("/index.html");
    })
  );
});
