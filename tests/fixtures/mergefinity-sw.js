// The production build replaces this cache name with a hash of the app shell.
const CACHE = "mergefinity-98d882a90717";
const ASSETS = ["./assets/Board-1PoFtVv-.js","./assets/index-BFctPs3p.js","./assets/index-COsQ7wvc.css","./assets/phaser-B_vcVLyb.js","./brand/nayaro-ink.png","./fonts/archivo-latin.woff2","./fonts/plex-mono-latin.woff2","./icon.svg"];
self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE);
      const response = await fetch("./");
      if (!response.ok) throw new Error("App shell could not be cached");
      await cache.put("./", response);
      await cache.addAll(ASSETS);
    })(),
  );
});
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      for (const key of await caches.keys())
        if (key.startsWith("mergefinity-") && key !== CACHE)
          await caches.delete(key);
      await self.clients.claim();
    })(),
  );
});
self.addEventListener("fetch", (event) => {
  if (
    event.request.method !== "GET" ||
    new URL(event.request.url).origin !== self.location.origin
  )
    return;
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE);
      const cached = await cache.match(event.request, { ignoreVary: true });
      if (cached) return cached;
      if (event.request.mode === "navigate") {
        const shell = await cache.match("./");
        if (shell) return shell;
      }
      return fetch(event.request);
    })(),
  );
});
