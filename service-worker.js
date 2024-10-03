self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('my-pwa-cache')
        .then((cache) => {
            return cache.addAll([
                '/blocksmatch/',
                '/blocksmatch/index.html',
                '/blocksmatch/u30.css',
                '/blocksmatch/u32-2-A0.js',
                '/blocksmatch/ss_bg4.webp',
                '/blocksmatch/MyPWAServlet.java',
                '/blocksmatch/manifest.json',
                '/blocksmatch/service-worker.js',
                '/blocksmatch/icons/icon-192x192.png',
                '/blocksmatch/icons/icon-512x512.png'
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
