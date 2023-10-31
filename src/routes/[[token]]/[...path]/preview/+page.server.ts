import { getDownloadHref } from '$lib/server/utils';
import { error } from '@sveltejs/kit';
import mime from 'mime';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad<{
	downloadHref: string;
	mimetype: string | null;
}> = async ({ params, parent }) => {
	if (!params.token) {
		throw error(404);
	}
	const filePath = (await parent()).filePath;
	const downloadHref = getDownloadHref(params.token, filePath);
	const mimetype = mime.getType(filePath[filePath.length - 1]);
	return { downloadHref, mimetype };
};
