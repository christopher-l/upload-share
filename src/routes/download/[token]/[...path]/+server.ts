import { getContent } from '$lib/server/filesystem';
import { getFilePath } from '$lib/server/utils';

export async function GET({ params }) {
	const path = await getFilePath(params);
	const result = await getContent(path);
	if (result) {
		return new Response(result.content, {
			headers: {
				'Content-Type': result.mimetype
			}
		});
	}
}
