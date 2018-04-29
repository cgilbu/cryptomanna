var version = 5;
var cacheName = 'cryptomanna';
var cache = cacheName + '-' + version;

var filesToCache = [
	'/',

	'/resources/images/favicon.png',
	'/resources/images/loading.gif',
	'/resources/images/splash-screen-ipad.png',
	'/resources/images/splash-screen-ipad-landscape.png',
	'/resources/images/splash-screen-ipad-retina.png',
	'/resources/images/splash-screen-ipad-retina-landscape.png',
	'/resources/images/splash-screen-iphone-6s-7-8.png',
	'/resources/images/splash-screen-iphone-6splus-7plus-8plus.png',
	'/resources/images/splash-screen-iphone-se.png',
	'/resources/images/splash-screen-iphone-x.png',
	'/resources/images/touch-icon-48px.png',
	'/resources/images/touch-icon-96px.png',
	'/resources/images/touch-icon-192px.png',
	'/resources/images/touch-icon-500px.png',
	'/resources/images/touch-icon-800px.png',

	'https://fonts.googleapis.com/css?family=Open+Sans',
	'/vendors/fontawesome/css/fontawesome-all.min.css',
	'/vendors/select2/css/select2.min.css',
	'/resources/css/app.css',

	'/manifest.json',
	'/appVersion.json',

	'/vendors/jquery-3.3.1.min.js',
	'/vendors/select2/js/select2.min.js',

	'/resources/js/api.js',
	'/resources/js/app.js',
	'/resources/js/core.js',
	'/resources/js/events.js',
	'/resources/js/helpers.js',
	'/resources/js/storage.js',
	'/resources/js/view.js'
];

self.addEventListener('install', function(event) {
	console.log('[ServiceWorker] Installing');
	event.waitUntil(caches
		.open(cache)
		.then(function(cache) {
			console.log('[ServiceWorker] Caching files');
			cache.addAll(filesToCache);
		})
	);
});

self.addEventListener('fetch', function(event) {
	event.respondWith(
		caches.match(event.request)
		.then(function(response) {
			if (response) {
				console.log('Fulfilling ' + event.request.url + ' from cache');
				return response;
			} else {
				console.log(event.request.url + ' not found in cache');
				return fetch(event.request);
			}
		})
	);
});

self.addEventListener('activate', function(event) {
	console.log('[ServiceWorker] Activating');
	event.waitUntil(
		caches.keys()
		.then(function(keyList) {
			Promise.all(keyList.map(function(key) {
				if (key !== cacheName) {
					console.log('[ServiceWorker] Removing old cache:', key);
					return caches.delete(key);
				}
			}));
		})
	);
});