import { getZipArchive } from '$lib/server/filesystem';
import { getActualPath } from '$lib/server/utils.js';
import { error } from '@sveltejs/kit';

export async function GET({ params }) {
	params.path;
	const path = await getActualPath({ ...params, path: params.path.replace(/\.zip$/, '') });
	if (path) {
		const buffer = await getZipArchive(path);
		return new Response(buffer, {
			headers: {
				'Content-Type': 'application/zip'
			}
		});
	}
	throw error(404);
}
