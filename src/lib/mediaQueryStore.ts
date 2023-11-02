import { readable, writable } from 'svelte/store';

// Adapted from https://pqina.nl/blog/svelte-media-query-store/
export function getMediaQueryStore(queryString: string) {
    // Fallback on server
    if (typeof window === 'undefined') {
        return readable(false);
    }
	const { subscribe, set } = writable<boolean>(undefined, () => {
		const query = window.matchMedia(queryString);
		const update = () => set(query.matches);
		update();
		query.addEventListener('change', update);
		return () => query.removeEventListener('change', update);
	});
	return { subscribe };
}
