import { hasValidUploadToken } from '$lib/server/authentication';
import { getFilePath } from '$lib/server/utils';
import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad<{
	hasUploadToken: boolean;
	filePath: string[];
}> = async ({ params, request, cookies }) => {
	const hasUploadToken = hasValidUploadToken(request, cookies);
	if (!hasUploadToken && !params.token) {
		throw error(401);
	}
	const filePath = await getFilePath(params);
	return {
		hasUploadToken,
		filePath
	};
};
