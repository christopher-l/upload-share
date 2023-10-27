import { isDirectory, listSubDir, type FileEntry } from '$lib/server/filesystem';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getPathForToken } from '$lib/server/tokens';
import { getUrlPath } from '$lib/utils';

export const load: PageServerLoad<{ fileList: FileEntry[] }> = async ({ params }) => {
	const path = await getPathFilePath(params);
	if (await isDirectory(path)) {
		return { fileList: await listSubDir(path) };
	} else {
		throw redirect(302, `/${getUrlPath(params)}/preview`);
	}
};

async function getPathFilePath(params: { token: string; path: string }): Promise<string> {
	let path = await getPathForToken(params.token);
	if (params.path) {
		path += '/' + params.path;
	}
	return path;
}
