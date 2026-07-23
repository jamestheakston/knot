const CACHE_NAME = 'knot-dashboard-v1';
const STATIC_CACHE = 'knot-static-v1';
const DYNAMIC_CACHE = 'knot-dynamic-v1';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/dashboard.html',
  '/index.html',
  '/login.html',
  '/manifest.json',
  'https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Work+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap',
  'https://unpkg.com/lucide@latest',
  'https://unpkg.com/@supabase/supabase-js@2',
  'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[Service Worker] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('[Service Worker] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        return self.clients.claim();
      })
  );
});

// Fetch event - network first, fallback to cache
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Skip cross-origin requests for non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip Supabase API calls - let them go to network
  if (url.hostname.includes('supabase.co')) {
    return;
  }

  // Skip EmailJS API calls
  if (url.hostname.includes('emailjs.com')) {
    return;
  }

  // Skip hCaptcha
  if (url.hostname.includes('hcaptcha.com')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Clone the response before caching
        const responseClone = response.clone();

        // Cache successful responses
        if (response.status === 200) {
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }

        return response;
      })
      .catch(() => {
        // If network fails, try cache
        return caches.match(event.request)
          .then((cachedResponse) => {
            if (cachedResponse) {
              console.log('[Service Worker] Serving from cache:', event.request.url);
              return cachedResponse;
            }

            // If not in cache, return offline fallback for HTML pages
            if (event.request.headers.get('accept').includes('text/html')) {
              return caches.match('/dashboard.html');
            }

            return new Response('Offline', { status: 503 });
          });
      })
  );
});

// Handle background sync for check-ins (if supported)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-checkins') {
    event.waitUntil(syncCheckIns());
  }
});

// Function to sync check-ins when back online
async function syncCheckIns() {
  try {
    const pendingCheckIns = await getPendingCheckIns();
    
    for (const checkIn of pendingCheckIns) {
      try {
        await fetch('/api/checkins', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(checkIn)
        });
        await removePendingCheckIn(checkIn.id);
      } catch (error) {
        console.error('[Service Worker] Failed to sync check-in:', error);
      }
    }
  } catch (error) {
    console.error('[Service Worker] Sync failed:', error);
  }
}

// IndexedDB helpers for offline storage
function getPendingCheckIns() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('KnotOfflineDB', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(['pendingCheckIns'], 'readonly');
      const store = transaction.objectStore('pendingCheckIns');
      const getRequest = store.getAll();
      
      getRequest.onerror = () => reject(getRequest.error);
      getRequest.onsuccess = () => resolve(getRequest.result);
    };
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('pendingCheckIns')) {
        db.createObjectStore('pendingCheckIns', { keyPath: 'id' });
      }
    };
  });
}

function removePendingCheckIn(id) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('KnotOfflineDB', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(['pendingCheckIns'], 'readwrite');
      const store = transaction.objectStore('pendingCheckIns');
      const deleteRequest = store.delete(id);
      
      deleteRequest.onerror = () => reject(deleteRequest.error);
      deleteRequest.onsuccess = () => resolve();
    };
  });
}
