/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

import { build, files, version } from '$service-worker';

const sw = self as unknown as ServiceWorkerGlobalScope;

// Create a unique cache name for this deployment
const CACHE = `cache-${version}`;

const ASSETS = [
	...build, // the app itself
	...files // everything in `static`
];

sw.addEventListener('install', (event) => {
	// Create a new cache and add all files to it
	async function addFilesToCache() {
		const cache = await caches.open(CACHE);
		await cache.addAll(ASSETS);
	}

	event.waitUntil(addFilesToCache());
});

sw.addEventListener('activate', (event) => {
	// Remove previous cached data from disk
	async function deleteOldCaches() {
		for (const key of await caches.keys()) {
			if (key !== CACHE) await caches.delete(key);
		}
	}

	event.waitUntil(deleteOldCaches());
});

sw.addEventListener('fetch', (event) => {
	const url = new URL(event.request.url);
	console.log(url);

	async function respondGet() {
		const url = new URL(event.request.url);
		const cache = await caches.open(CACHE);
		// `build`/`files` can always be served from the cache
		if (ASSETS.includes(url.pathname)) {
			return cache.match(url.pathname) as Promise<Response>;
		}
		return fetch(event.request);
	}

	async function respondPwaShare() {
		console.log('respondPwaShare');
		return Response.redirect('/');
	}

	if (event.request.method === 'GET') {
		event.respondWith(respondGet());
	} else if (event.request.method === 'POST') {
		const url = new URL(event.request.url);
		if (url.pathname === '/pwa-share') {
			event.respondWith(respondPwaShare());
		}
	}
});
