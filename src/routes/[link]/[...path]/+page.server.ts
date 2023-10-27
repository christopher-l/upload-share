import { isDirectory, listSubDir, type FileEntry } from '$lib/server/filesystem';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getPath } from '../../../lib/utils';

export const load: PageServerLoad<{ fileList: FileEntry[] }> = async ({ params }) => {
	const path = getPath(params);
	if (await isDirectory(path)) {
		return { fileList: await listSubDir(path) };
	} else {
		throw redirect(302, `/${path}/preview`);
	}
};
