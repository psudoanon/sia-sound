const CACHE_NAME = 'PWA_CACHE_NAME';
const urlsToCache = [
//  `https://siasky.net/${SIA_UUID}`,

 // '/',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );

//  return self.skipWaiting();
});

// Activate is when the service worker actually takes over from the previous
// version, which is a good time to clean up old caches
self.addEventListener('activate', event => {
  console.log('Finally active. Ready to serve!');
  event.waitUntil(
    // Get the keys of all the old caches
    caches
      .keys()
      // Ensure we don't resolve until all the promises do (i.e. each key has been deleted)
      .then(keys =>
        Promise.all(
          keys
            // Remove any cache that matches the current cache name
            .filter(key => key !== CACHE_NAME)
            // Map over the array of old cache names and delete them all
            .map(key => caches.delete(key))
        )
      )
  );
});

self.addEventListener('fetch', (event) => {

    event.respondWith(caches.match(event.request).then((response) => {
        
        if (response) {
            console.log('got response from cache: ');
            console.log(response);
            return response;
        }

        return fetch(event.request).then((response) => {
            
            if (!response || response.status !== 200 || event.request.url.indexOf('ngrok') !== -1) {
                console.log('not going to cache this');
                console.log(response);
                return response;
            }

            const cachedResponse = response.clone();
            
            caches.open(CACHE_NAME).then((cache) => {
                console.log('added to cache');
                console.log(event.request);
                
                cache.put(event.request, cachedResponse);
            });

            return response;
        });
    }))
});

/*
// Listen for browser fetch events. These fire any time the browser tries to load
// any outside resources
self.addEventListener('fetch', function(event) {
  // This lets us control the response
  // We pass in a promise that resolves with a response object
    console.log('fetch:');
    console.log(event);

  event.respondWith(
    // Check whether we have a matching response for this request in our cache

    caches.match(event.request).then(response => {
      // It's in the cache! Serve the response straight from there
      if (response) {
        console.log('Serving response from the cache');
        return response;
      }
      // If it's not in the cache we make a fetch request for the resource
      return (
        fetch(event.request)
          // Then we open our cache
          .then(response => caches.open(CACHE_NAME))
          // Then we put the request into the cache, so we have it offline next time
          .then(cache => {
            console.log('caching resource');
            console.log(event.request)
            console.log(response)
            // We have to clone the response as response streams can only be read once
            // This way we can put one copy in the cache and return the other to the browser
            cache.put(event.request, response.clone());
            return response;
          })
          .catch(response => {
            console.log('Fetch failed, sorry.');
          })
      );
    })
  );
});
*/
