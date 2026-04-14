const CACHE_NAME = "trip-v1";

// Install (basic setup)
self.addEventListener("install", (event) => {
  self.skipWaiting();
});

// Activate (cleanup old caches)
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// Fetch (auto-cache EVERYTHING)
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // If already cached → use it
      if (response) {
        return response;
      }
