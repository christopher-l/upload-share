import { hasValidUploadToken } from '$lib/server/authentication';
import { createFolder, listRootDir, type FileEntry } from '$lib/server/filesystem';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad<{ fileList: FileEntry[] }> = async ({ cookies, request }) => {
	if (hasValidUploadToken(request, cookies)) {
		return { fileList: await listRootDir() };
	} else {
		throw error(401);
	}
};

export const actions = {
	newFolder: async ({ cookies, request }) => {
		if (!hasValidUploadToken(request, cookies)) {
			throw error(401);
		}
		const data = await request.formData();
		const name = data.get('name')?.toString().trim();
		if (!name || name.includes('/')) {
			throw 400;
		}
		try {
			await createFolder(name);
		} catch (e) {
			if (e.code === 'EEXIST') {
				throw error(409);
			} else {
				throw error(500);
			}
		}
	}
};
