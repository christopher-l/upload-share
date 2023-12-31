import { getContent } from '$lib/server/filesystem';
import { getActualPath } from '$lib/server/utils.js';
import { error } from '@sveltejs/kit';

export async function GET({ params }) {
	const path = await getActualPath(params);
	if (path) {
		const result = await getContent(path);
		if (result) {
			return new Response(result.content, {
				headers: {
					'Content-Type': result.mimetype
				}
			});
		}
	}
	throw error(404);
}
