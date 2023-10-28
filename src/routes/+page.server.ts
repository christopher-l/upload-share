import { hasValidUploadToken } from '$lib/server/authentication';
import { listRootDir, type FileEntry } from '$lib/server/filesystem';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad<{ fileList: FileEntry[] }> = async ({ cookies, request }) => {
	if (hasValidUploadToken(request, cookies)) {
		return { fileList: await listRootDir() };
	} else {
		throw error(403);
	}
};
