const CACHE_NAME = "pdf-store-cache-v1";
const ASSETS_TO_CACHE = [
    "/",
    "../index.html",
    "/favicon.ico",
    "/manifest.json",
    "/logo192.png",
    "/logo512.png",
    "/src/main.jsx",
    "/src/App.jsx",
    "/src/assets/styles.css",
];

// Install Service Worker & Cache Assets
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(async (cache) => {
            try {
                await cache.addAll(ASSETS_TO_CACHE);
                console.log("📦 Assets cached successfully!");
            } catch (error) {
                console.error("❌ Error caching assets:", error);
            }
        })
    );
    self.skipWaiting();
});

// Activate & Remove Old Cache
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) =>
            Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log("🗑 Removing old cache:", cache);
                        return caches.delete(cache);
                    }
                })
            )
        )
    );
    self.clients.claim();
});

self.addEventListener("fetch", (event) => {
    const url = new URL(event.request.url);
    if (url.protocol === "ws:" || url.protocol === "wss:") {
        return;
    }
    if (url.protocol === "chrome-extension:") {
        return;
    }

    // // Ignore non-GET requests (POST, PUT, DELETE)
    if (event.request.method !== "GET") {
        return;
    }

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse; // ✅ Return cached response for GET requests
            }
            return fetch(event.request)
                .then((networkResponse) => {
                    return caches.open("pdf-store-cache-v1").then((cache) => {
                        return networkResponse;
                    });
                })
                .catch(() => caches.match("/download"));
        })
    );
});
