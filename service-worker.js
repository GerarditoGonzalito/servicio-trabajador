// service-worker.js

// Nombre del caché
const CACHE_NAME = 'images-cache-v1';

// Instalar el Service Worker
self.addEventListener('install', (event) => {
  console.log('Service Worker instalado');
});

// Activar el Service Worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker activado');
  // Limpiar cachés viejos si es necesario
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Borrando caché obsoleto:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Manejar las solicitudes de red (fetch) para imágenes
self.addEventListener('fetch', (event) => {
  // Solo manejar imágenes
  if (event.request.url.includes('.jpg') || event.request.url.includes('.png') || event.request.url.includes('.gif')) {
    event.respondWith(
      caches.match(event.request) // Primero, busca en el caché
        .then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse; // Si la imagen está en caché, la sirve
          }
          
          // Si no está en caché, la descargamos de la red y la almacenamos en caché
          return fetch(event.request)
            .then((response) => {
              if (response.ok) {
                caches.open(CACHE_NAME)
                  .then((cache) => {
                    cache.put(event.request, response.clone()); // Guardar la imagen en caché
                  });
                return response;
              }
              return response;
            });
        })
    );
  }
});
