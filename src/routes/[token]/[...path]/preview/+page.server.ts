import mime from 'mime';
import { getDownloadHref } from '../../../../lib/server/utils';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad<{
	downloadHref: string;
	mimetype: string | null;
}> = async ({ params, parent }) => {
	const filePath = (await parent()).filePath;
	const downloadHref = getDownloadHref(params.token, filePath);
	const mimetype = mime.getType(filePath[filePath.length - 1]);
	return { downloadHref, mimetype };
};
