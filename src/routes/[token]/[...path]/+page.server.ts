import { getEntryType, listSubDir, type FileEntry } from '$lib/server/filesystem';
import { getFilePath } from '$lib/server/utils';
import { getUrlPath } from '$lib/utils';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad<{ fileList: FileEntry[] }> = async ({ params }) => {
	const path = await getFilePath(params);
	if (!path) {
		throw error(404);
	}
	switch (await getEntryType(path)) {
		case 'directory':
			return { fileList: await listSubDir(path) };
		case 'file':
			throw redirect(302, `/${getUrlPath(params)}/preview`);
		default:
			throw error(404);
	}
};
