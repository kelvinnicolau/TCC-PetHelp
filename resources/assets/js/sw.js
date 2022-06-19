var cacheName = 'PetHelp.1.0';
var dynamicCache = 'PH';

var assetsToCache = [
  '/assets/js/app.js',
  '/assets/css/main.css',
  '/assets/css/style.css',
  '/assets/css/pages/home.css',
  '/assets/css/pages/mapa.css',
];

var pagesPreCache = [
  '/',
]

self.addEventListener('install', function(e) {
  // console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      // console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(assetsToCache)
    })
  );
});
self.addEventListener('activate',  event => {
  caches.open(dynamicCache).then(function(cache) {
    // console.log('[ServiceWorker] PrÃ© caching pages');
    return cache.addAll(pagesPreCache)
  });
  caches.keys().then(function(names) {
    for (let name of names)
        if(name == cacheName || name == dynamicCache){
        }else{
          caches.delete(name);
        }
  });
  event.waitUntil(self.clients.claim());
});
self.addEventListener('fetch', event => {
  var requestURL = new URL(event.request.url);

  console.log(requestURL.pathname);
  if( requestURL.origin == location.origin ){
    if (/\/assets\/(css|img|js|vendor)/.test(requestURL.pathname)) {
      event.respondWith(
        caches.open(cacheName).then(function(cache) {
          return cache.match(event.request).then(function (response) {
            return response || fetch(event.request).then(function(response) {
              cache.put(event.request, response.clone());
              return response;
            });
          });
        })
      );
    }else if(/\/admin\/uploads\/images\//.test(requestURL.pathname)){
      event.respondWith(
        caches.open(dynamicCache).then(function(cache) {
          return cache.match(event.request).then(function (response) {
            return response || fetch(event.request).then(function(response) {
              cache.put(event.request, response.clone());
              return response;
            });
          });
        })
      );
    }else if(/\/fonts\//.test(requestURL.pathname)){
      event.respondWith(
        caches.open(cacheName).then(function(cache) {
          return cache.match(event.request).then(function (response) {
            return response || fetch(event.request).then(function(response) {
              cache.put(event.request, response.clone());
              return response;
            });
          });
        })
      );
    }else{
      event.respondWith(
        caches.open(dynamicCache).then(function(cache) {
          return fetch(event.request).then(function(response) {
            // console.log('salvando no cache', response);
            cache.put(event.request, response.clone());
            return response;
          }).catch(error => {
            // console.log('salvando no cache', error);
            return caches.match(event.request).then(function(response){
              return response || caches.match('/404')
            });
          });
        })
      );
    }
  }
  // event.respondWith(
  //   caches.match(event.request, {ignoreSearch:true}).then(response => {
  //     return response || fetch(event.request);
  //   }).catch(error => {
  //     console.log(event.request)
  //     return caches.match('/404');
  //   })
  // );
});
self.addEventListener('push', function(event) {
  if (event.data) {
    const promiseChain = self.registration.showNotification('Eai');
    event.waitUntil(promiseChain);
  }
});
