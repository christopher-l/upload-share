import { error } from '@sveltejs/kit';
import mime from 'mime';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad<{
	mimetype: string | null;
}> = async ({ params, parent }) => {
	if (!params.token) {
		throw error(404);
	}
	const data = await parent();
	const virtualPath = data.virtualPath;
	const currentItemName = virtualPath[virtualPath.length - 1];
	const mimetype = mime.getType(currentItemName);

	return { mimetype };
};
