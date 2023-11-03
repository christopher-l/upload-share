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
	const data = await parent();
	const filePath = data.filePath;
	const downloadHref = getDownloadHref(params.token, filePath);
	const currentItemName = filePath[filePath.length - 1];
	const mimetype = mime.getType(currentItemName);

	return { downloadHref, mimetype };
};
