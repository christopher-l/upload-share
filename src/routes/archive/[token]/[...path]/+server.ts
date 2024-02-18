import { createZipArchive } from '$lib/server/archive';
import { getActualPath } from '$lib/server/utils.js';
import { error } from '@sveltejs/kit';

export async function PUT({ params }) {
	const path = await getActualPath(params);
	if (path) {
		const archiveFileName = await createZipArchive(path);
		return new Response(`/archive/download/${archiveFileName}`, {
			headers: {
				'Content-Type': 'text/plain'
			}
		});
	}
	throw error(404);
}
