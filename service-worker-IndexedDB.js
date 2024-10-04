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
                return response.clone().text().then(text => {
                    return db.resources.put({
                        url: url,
                        response: text
                    });
                });
            }).catch(error => {
                console.error(`Failed to fetch ${url}:`, error);
            });
        })).then(() => {
            console.log('All resources have been cached.');
        }).catch(error => {
            console.error('Caching failed:', error);
        })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        db.resources.get(event.request.url)
            .then(data => {
                if (data) {
                    // Выводим размер данных
                    const size = new Blob([data.response]).size;
                    console.log(`Serving ${event.request.url} from IndexedDB with size ${size} bytes`);
                    
                    return new Response(data.response, { headers: { 'Content-Type': 'text/html' } });
                } else {
                    return fetch(event.request);
                }
            }).catch(error => {
                console.error('Fetch error:', error);
                return fetch(event.request);
            })
    );
});

self.addEventListener('activate', function(event) {
    event.waitUntil(self.clients.claim());
});

// Функция для получения и вывода информации о размере данных в IndexedDB
function logDBSize() {
    db.resources.toArray().then(resources => {
        let totalSize = 0;
        resources.forEach(resource => {
            const size = new Blob([resource.response]).size;
            console.log(`Resource: ${resource.url}, Size: ${size} bytes`);
            totalSize += size;
        });
        console.log(`Total IndexedDB size: ${totalSize} bytes`);
    }).catch(error => {
        console.error('Error logging DB size:', error);
    });
}

// Запускаем функцию для логирования размера базы данных каждый раз, когда Service Worker активируется
self.addEventListener('activate', (event) => {
    event.waitUntil(
        logDBSize().then(() => self.clients.claim())
    );
});
