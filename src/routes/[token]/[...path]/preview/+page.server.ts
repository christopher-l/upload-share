import { getType } from 'mime';
import type { PageServerLoad } from './$types';
import { getDownloadHref } from '../../../../lib/server/utils';

export const load: PageServerLoad<{
	downloadHref: string;
	mimetype: string | null;
}> = async ({ params, parent }) => {
	const filePath = (await parent()).filePath;
	const downloadHref = getDownloadHref(params.token, filePath);
	const mimetype = getType(filePath[filePath.length - 1]);
	return { downloadHref, mimetype };
};
