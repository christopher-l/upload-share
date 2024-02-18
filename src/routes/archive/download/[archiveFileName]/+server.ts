import { getArchiveContent } from '$lib/server/archive';
import { error } from '@sveltejs/kit';

export async function GET({ params }) {
	const archiveFileName: string = params.archiveFileName;
	if (archiveFileName) {
		const buffer = await getArchiveContent(archiveFileName);
		if (buffer) {
			return new Response(buffer, {
				headers: {
					'Content-Type': 'application/zip'
				}
			});
		}
	}
	throw error(404);
}
