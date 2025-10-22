/* separate caches for each "area"  */
const CACHE_NAME = "chef-pwa-v2";
const RUNTIME_CACHE = "chef-runtime-v2";
const IMAGE_CACHE = "chef-images-v2";
const API_CACHE = "chef-api-v2";

/* things to cache at immediatly at installation */
const PRECACHE_URLS = [
  "/",
  "/manifest.json",
  "/images/chef-hat-192-maskable.png",
  "/images/chef-hat-512-maskable.png",
  "/offline",
];

/* actual sw installation with precacheing */
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_URLS);
    }),
  );
  self.skipWaiting();
});

/* sw activation, removal of old caches to prevent possible conflicts with newer ones */
self.addEventListener("activate", (event) => {
  const currentCaches = [CACHE_NAME, RUNTIME_CACHE, IMAGE_CACHE, API_CACHE];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!currentCaches.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        }),
      );
    }),
  );
  self.clients.claim();
});

/* intercept requests and decied what to cache */
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  /* don't cache non-GET methods  */
  if (request.method !== "GET") {
    return;
  }

  /* don't cache external apis of any kind, exept supabase, of course */
  if (
    url.origin !== self.location.origin &&
    !url.hostname.includes("supabase.co")
  ) {
    return;
  }

  /* cache of api calls */
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(staleWhileRevalidate(request, API_CACHE));
    return;
  }

  /* cache of images */
  if (
    request.destination === "image" ||
    url.pathname.match(/\.(jpg|jpeg|png|gif|webp|svg)$/)
  ) {
    event.respondWith(cacheFirst(request, IMAGE_CACHE));
    return;
  }

  /* cache of full html pages  */
  if (request.headers.get("accept")?.includes("text/html")) {
    event.respondWith(networkFirstWithOffline(request));
    return;
  }

  /* cache of CSS and static assets (NOT chunks) */
  if (request.destination === "style") {
    event.respondWith(cacheFirst(request, RUNTIME_CACHE));
    return;
  }

  /* Network First for JS chunks - they change with each build */
  if (
    request.destination === "script" ||
    url.pathname.startsWith("/_next/static/chunks/")
  ) {
    event.respondWith(networkFirst(request, RUNTIME_CACHE));
    return;
  }

  /* Cache First for truly static Next.js assets */
  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(cacheFirst(request, RUNTIME_CACHE));
    return;
  }

  /* returns the cache by default */
  event.respondWith(networkFirst(request, RUNTIME_CACHE));
});

// Network First - prova network, poi cache
async function networkFirst(request, cacheName) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

/* cacheing that tries with network first and cache last */
async function networkFirstWithOffline(request) {
  try {
    /* tries network */
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    /* tries cache */
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    /* fallback to offline page */
    const offlinePage = await caches.match("/offline");
    if (offlinePage) {
      return offlinePage;
    }
    /* last possibility with service unavilable error*/
    return new Response("Offline - Network Unavilable", {
      status: 503,
      statusText: "Service Unavailable",
      headers: new Headers({
        "Content-Type": "text/plain",
      }),
    });
  }
}

/* cacheing that tries with cache first and network last */
async function cacheFirst(request, cacheName) {
  /* tries to get cache */
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  /* fallback to network */
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    throw error;
  }
}

/* return first cache and while it updates in background */
async function staleWhileRevalidate(request, cacheName) {
  const cachedResponse = await caches.match(request);

  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      const cache = caches.open(cacheName);
      cache.then((c) => c.put(request, networkResponse.clone()));
    }
    return networkResponse;
  });

  return cachedResponse || fetchPromise;
}

/* communication client-sw */
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }

  if (event.data && event.data.type === "CLEAR_CACHE") {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName)),
        );
      }),
    );
  }
});
