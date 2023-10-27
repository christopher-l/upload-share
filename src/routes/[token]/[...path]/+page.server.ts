import { isDirectory, listSubDir, type FileEntry } from '$lib/server/filesystem';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getPath } from '$lib/server/tokens';

export const load: PageServerLoad<{ fileList: FileEntry[] }> = async ({ params }) => {
	const path = await getFilePath(params);
	if (await isDirectory(path)) {
		return { fileList: await listSubDir(path) };
	} else {
		throw redirect(302, `/${path}/preview`);
	}
};

async function getFilePath(params: { token: string; path: string }): Promise<string> {
	let path = await getPath(params.token);
	if (params.path) {
		path += '/' + params.path;
	}
	return path;
}
