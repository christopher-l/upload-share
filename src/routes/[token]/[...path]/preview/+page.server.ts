import { getType } from 'mime';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad<{
	downloadHref: string;
	mimetype: string | null;
}> = async ({ params, parent }) => {
	const filePath = (await parent()).filePath;
	let downloadHref;
	if (params.path) {
		downloadHref = `/download/${params.token}/${params.path}`;
	} else {
		// We append the filename to the URL, so the browser has the correct name when downloading
		// and so it will have the correct extension when used in `src` tags. The `download`
		// endpoint needs to strip this when received. We use the additional '/' character to
		// identify this scenario.
		downloadHref = `/download/${params.token}//${filePath[0]}`;
	}
	const mimetype = getType(filePath[filePath.length - 1]);
	return { downloadHref, mimetype };
};
