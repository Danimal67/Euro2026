const CACHE_NAME = "trip-app-v7"; // <-- bump this when you update anything

self.addEventListener("install", event => {
  self.skipWaiting(); // activate immediately

  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll([
        "./",
        "./index.html"
      ]);
    })
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", event => {
  const request = event.request;

  // Only handle GET requests
  if (request.method !== "GET") return;

  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) {
        return cached; // 💥 instant load from cache
      }

      return fetch(request)
        .then(response => {
          // Clone and store EVERY successful response (especially images)
          const responseClone = response.clone();

          caches.open(CACHE_NAME).then(cache => {
            cache.put(request, responseClone);
          });

          return response;
        })
        .catch(() => {
          // If offline and not cached, fallback to main page
          return caches.match("./index.html");
        });
    })
  );
});
