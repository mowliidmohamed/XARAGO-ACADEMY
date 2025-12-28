const CACHE_NAME = 'xarago-v2'; // Updated version to force refresh
const ASSETS = [
  './',
  'index.html',
  'style.css',
  'script.js',
  'courses.json',
  'manifest.json',
  'assets/pattern.jpg',
  'assets/construction.jpg',
  'assets/icon-192.png',
  'assets/icon-512.png'
];

// Install the Service Worker
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Xarago Cache: Pre-caching assets');
      return cache.addAll(ASSETS);
    })
  );
});

// Activate and Clean up old caches
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
});

// Serve assets from Cache when offline
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => {
      // Return cached asset or fetch from network
      return res || fetch(e.request).catch(() => {
        // Optional: If both fail (offline & not in cache), return index.html
        if (e.request.mode === 'navigate') {
          return caches.match('index.html');
        }
      });
    })
  );
});