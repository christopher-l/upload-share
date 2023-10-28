import { isDirectory, listSubDir, type FileEntry } from '$lib/server/filesystem';
import { getPathForToken } from '$lib/server/tokens';
import { getUrlPath } from '$lib/utils';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad<{ fileList: FileEntry[] }> = async ({ params }) => {
	const path = await getPathFilePath(params);
	if (!path) {
		throw error(404);
	} else if (await isDirectory(path)) {
		return { fileList: await listSubDir(path) };
	} else {
		throw redirect(302, `/${getUrlPath(params)}/preview`);
	}
};

async function getPathFilePath(params: { token: string; path: string }): Promise<string | null> {
	let path = await getPathForToken(params.token);
	if (params.path) {
		path += '/' + params.path;
	}
	return path;
}
