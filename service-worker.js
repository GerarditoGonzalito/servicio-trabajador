self.addEventListener('install', (event) => {
  console.log('Service Worker instalado');
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activado');
});

// Interceptar las solicitudes de red para almacenar las imágenes en caché
self.addEventListener('fetch', (event) => {
  // Solo manejamos imágenes
  if (event.request.url.includes('.jpg') || event.request.url.includes('.png') || event.request.url.includes('.gif')) {
    event.respondWith(
      caches.match(event.request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            // Si ya existe en caché, la servimos
            return cachedResponse;
          }

          // Si no está en caché, la descargamos y la almacenamos
          return fetch(event.request)
            .then((response) => {
              // Solo almacenamos respuestas exitosas
              if (response.ok) {
                return caches.open('images-cache')
                  .then((cache) => {
                    cache.put(event.request, response.clone()); // Almacena la imagen en caché
                    return response;
                  });
              }

              return response;
            });
        })
    );
  }
});