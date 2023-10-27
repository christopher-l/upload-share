import { getPath } from '$lib/server/tokens';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad<{ filePath: string[] }> = async ({ params }) => {
	let filePath: string[] = [];
	if (params.token) {
		filePath = [await getPath(params.token)];
	}
	if (params.path) {
		filePath = [...filePath, ...params.path.split('/')];
	}

	return { filePath };
};
