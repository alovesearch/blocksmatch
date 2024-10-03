self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('my-pwa-cache')
        .then((cache) => {
            return cache.addAll([
                '/',
                '/index.html',
                '/u30.css',
                '/u32-2-A0.js',
                '/ss_bg4.webp',
                '/icons/icon-192x192.png',
                '/icons/icon-512x512.png'
            ]);
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
        .then((response) => {
            return response || fetch(event.request);
        })
    );
});