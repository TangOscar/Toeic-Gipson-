const CACHE = "toeic-gipson-v3"; // changer le numéro à chaque mise à jour du jeu
const FILES = [
  "./", "./index.html", "./manifest.webmanifest", "./confetti.browser.js",
  "./nunito-latin-400-normal.woff2", "./nunito-latin-700-normal.woff2",
  "./nunito-latin-900-normal.woff2", "./rye-latin-400-normal.woff2",
  "./icon-192.png", "./icon-512.png", "./icon-maskable-512.png", "./apple-touch-icon.png"
];
self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then((hit) => {
      if (hit) return hit;
      return fetch(e.request).catch(() =>
        e.request.mode === "navigate" ? caches.match("./index.html") : Response.error()
      );
    })
  );
});
