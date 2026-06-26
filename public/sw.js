const CACHE_NAME = "hile-kontrol-v1";
const urlsToCache = [
  "/hile-kontrol/",
  "/hile-kontrol/index.html",
  "/hile-kontrol/hile-kontrol-logo.svg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
