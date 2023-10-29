import { getPathForToken } from '$lib/server/tokens';
import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad<{ filePath: string[] }> = async ({ params }) => {
	let filePath: string[] = [];
	if (params.token) {
		const rootPath = await getPathForToken(params.token);
		if (rootPath) {
			filePath = [rootPath];
		} else {
			throw error(404);
		}
	}
	if (params.path) {
		filePath = [...filePath, ...params.path.split('/')];
	}

	return { filePath };
};
