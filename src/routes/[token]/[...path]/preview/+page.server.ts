import type { PageServerLoad } from './$types';

export const load: PageServerLoad<{ downloadHref: string }> = async ({ params, parent }) => {
	if (params.path) {
		return { downloadHref: `/download/${params.token}/${params.path}` };
	} else {
		// We append the filename to the URL, so the browser has the correct name when downloading
		// and so it will have the correct extension when used in `src` tags. The `download`
		// endpoint needs to strip this when received. We use the additional '/' character to
		// identify this scenario.
		return { downloadHref: `/download/${params.token}//${(await parent()).filePath[0]}` };
	}
};
