import { getContent } from '$lib/server/filesystem';
import { getFilePath } from '$lib/server/utils';
import { error } from '@sveltejs/kit';

export async function GET({ params }) {
	const path = await getFilePath(params);
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
