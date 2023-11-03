import { hasValidUploadToken } from '$lib/server/authentication';
import {
	createFile,
	createFolder,
	getEntryType,
	remove,
	type ErrnoException
} from '$lib/server/filesystem';
import { getFileList, getFilePath } from '$lib/server/utils';
import type { FileListEntry } from '$lib/types.js';
import { getUrlPath } from '$lib/utils.js';
import { error, redirect } from '@sveltejs/kit';
import { join } from 'path';
import type { PageServerLoad, RouteParams } from './$types.js';

export const load: PageServerLoad<{
	fileList: Promise<FileListEntry[]>;
}> = async ({ parent, params }) => {
	const data = await parent();
	switch (await getEntryType(data.filePath)) {
		case 'directory':
			return {
				fileList: getFileList(data.filePath, params.token)
			};
		case 'file':
			throw redirect(302, `/${getUrlPath(params as RouteParams & { token: string })}/preview`);
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
		const filePath = await getFilePath(params);
		const newFolderPath = join(...filePath, name);
		try {
			await createFolder(newFolderPath);
		} catch (e) {
			if ((e as ErrnoException).code === 'EEXIST') {
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
		const filePath = await getFilePath(params);
		const deletePath = join(...filePath, name);
		try {
			await remove(deletePath);
		} catch (e) {
			if ((e as ErrnoException).code === 'ENOENT') {
				throw error(404);
			} else {
				throw error(500);
			}
		}
	},
	upload: async ({ cookies, request, params }) => {
		if (!hasValidUploadToken(request, cookies)) {
			throw error(401);
		}
		const directoryPath = await getFilePath(params);
		const data = await request.formData();
		const files = data.getAll('file') as File[];
		await Promise.all(
			files.map(async (file) => {
				const arrayBuffer = await file.arrayBuffer();
				const buffer = Buffer.from(arrayBuffer);
				try {
					await createFile(join(...directoryPath, file.name), buffer);
				} catch (e) {
					if ((e as ErrnoException).code === 'EEXIST') {
						throw error(409);
					}
					throw e;
				}
			})
		);
	}
};
