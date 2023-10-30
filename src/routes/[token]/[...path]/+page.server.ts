import { hasValidUploadToken } from '$lib/server/authentication';
import {
	createFolder,
	getEntryType,
	listSubDir,
	remove,
	type FileEntry
} from '$lib/server/filesystem';
import { getDownloadHref, getFilePath } from '$lib/server/utils';
import { getUrlPath } from '$lib/utils';
import { error, redirect } from '@sveltejs/kit';
import { join } from 'path';
import type { PageServerLoad } from './$types';

export interface FileListEntry extends FileEntry {
	downloadHref: string | null;
}

/**
 * Returns a file listing for a sub directory.
 *
 * @param path The complete file path to the subdirectory including to root directory.
 * @param token The root directory's download token.
 */
async function getFileList(path: string, token: string): Promise<FileListEntry[]> {
	const list = await listSubDir(path);
	return list.map((entry) => ({
		...entry,
		downloadHref:
			entry.type !== 'inode/directory'
				? getDownloadHref(token, [...path.split('/'), entry.name])
				: null
	}));
}

export const load: PageServerLoad<{ fileList: FileListEntry[] }> = async ({ params }) => {
	const path = await getFilePath(params);
	if (!path) {
		throw error(404);
	}
	switch (await getEntryType(path)) {
		case 'directory':
			return { fileList: await getFileList(path, params.token) };
		case 'file':
			throw redirect(302, `/${getUrlPath(params)}/preview`);
		default:
			throw error(404);
	}
};

export const actions = {
	newFolder: async ({ cookies, request, params }) => {
		if (!hasValidUploadToken(request, cookies)) {
			throw error(401);
		}
		const data = await request.formData();
		const name = data.get('name')?.toString().trim();
		if (!name || name.includes('/')) {
			throw 400;
		}
		const path = await getFilePath(params);
		if (!path) {
			throw error(404);
		}
		const newFolderPath = join(path, name);
		try {
			await createFolder(newFolderPath);
		} catch (e) {
			if (e.code === 'EEXIST') {
				throw error(409);
			} else {
				throw error(500);
			}
		}
	},
	delete: async ({ cookies, request, params }) => {
		if (!hasValidUploadToken(request, cookies)) {
			throw error(401);
		}
		const data = await request.formData();
		const name = data.get('name')?.toString().trim();
		if (!name || name.includes('/')) {
			throw 400;
		}
		const path = await getFilePath(params);
		if (!path) {
			throw error(404);
		}
		const deletePath = join(path, name);
		try {
			await remove(deletePath);
		} catch (e) {
			if (e.code === 'ENOENT') {
				throw error(404);
			} else {
				throw error(500);
			}
		}
	}
};
