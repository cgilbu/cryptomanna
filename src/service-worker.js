var appVersion = '1.2';
var cacheObject = 'cryptomanna-' + appVersion;

self.addEventListener('install', function(event) {
	self.skipWaiting();
	event.waitUntil(
		caches.open(cacheObject).then(function(cache) {
			return cache.addAll([
				'/',

				'/resources/css/app.css',
				'/resources/js/api.js',
				'/resources/js/app.js',
				'/resources/js/core.js',
				'/resources/js/events.js',
				'/resources/js/helpers.js',
				'/resources/js/storage.js',
				'/resources/js/view.js',

				'/vendors/select2/css/select2.min.css',
				'/vendors/jquery-3.3.1.min.js',
				'/vendors/select2/js/select2.min.js'
			]);
		})
	);
});

self.addEventListener('fetch', function(event) {
	console.log(event.request.url);

	event.respondWith(
		caches.match(event.request).then(function(response) {
			return response || fetch(event.request);
		})
	);
});

self.addEventListener('activate', function(event) {
	event.waitUntil(
		caches.keys().then(function(cacheNames) {
			return Promise.all(
				cacheNames.map(function(cacheName) {
					if (cacheName != cacheObject) {
						return caches.delete(cacheName);
					}
				})
			);
		})
	);
});
