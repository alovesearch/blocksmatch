importScripts('https://cdnjs.cloudflare.com/ajax/libs/dexie/3.0.3/dexie.min.js');

const db = new Dexie('MyPWA');
db.version(1).stores({
    resources: 'url, response'
});

self.addEventListener('install', function(event) {
    const urlsToCache = [
        '/',
        '/blocksmatch/index.html',
        '/blocksmatch/u30.css',
        '/blocksmatch/u32-2-A0.js',
        '/blocksmatch/ss_bg4.webp',
        '/blocksmatch/MyPWAServlet.java',
        '/blocksmatch/manifest.json',
        '/blocksmatch/service-worker.js',
        '/blocksmatch/icons/icon-192x192.png',
        '/blocksmatch/icons/icon-512x512.png'
    ];

    event.waitUntil(
        Promise.all(urlsToCache.map(url => {
            return fetch(url).then(response => {
                return db.resources.put({
                    url: url,
                    response: response.clone().text()
                });
            });
        }))
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        db.resources.get(event.request.url)
            .then(data => {
                if (data) {
                    return new Response(data.response, { headers: { 'Content-Type': 'text/html' } });
                }
                return fetch(event.request);
            })
    );
});

self.addEventListener('activate', function(event) {
    event.waitUntil(self.clients.claim());
});
