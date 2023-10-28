import { hasValidUploadToken } from '$lib/server/authentication';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad<{ hasUploadToken: boolean }> = ({ request, cookies }) => {
	return { hasUploadToken: hasValidUploadToken(request, cookies) };
};
