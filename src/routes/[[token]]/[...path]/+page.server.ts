import { hasValidUploadToken } from '$lib/server/authentication';
import { createFile, createFolder, removeSubPath, removeToken } from '$lib/server/filesystem';
import type { ErrnoException } from '$lib/server/types.js';
import { getActualPath, getFileList } from '$lib/server/utils';
import type { FileListEntry } from '$lib/types.js';
import { getUrlPath } from '$lib/utils.js';
import { error, redirect } from '@sveltejs/kit';
import { join } from 'path';
import type { PageServerLoad, RouteParams } from './$types.js';

export const load: PageServerLoad<{
	fileList: FileListEntry[];
}> = async ({ parent, params }) => {
	const data = await parent();
	switch (data.entryType) {
		case 'directory':
			return {
				fileList: await getFileList(params)
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
		const path = await getActualPath(params);
		try {
			await createFolder(name, path);
		} catch (e) {
			if ((e as ErrnoException).code === 'EEXIST') {
				throw error(409);
			} else {
				throw e;
			}
		}
	},
	delete: async ({ cookies, request, params }) => {
		if (!hasValidUploadToken(request, cookies)) {
			throw error(401);
		}
		const data = await request.formData();
		const token = data.get('token')?.toString().trim();
		if (token) {
			await removeToken(token);
		} else {
			const name = data.get('name')?.toString().trim();
			if (!name || name.includes('/')) {
				throw 400;
			}
			const filePath = await getActualPath(params);
			const deletePath = join(...filePath, name);
			try {
				await removeSubPath(deletePath);
			} catch (e) {
				if ((e as ErrnoException).code === 'ENOENT') {
					throw error(404);
				} else {
					throw error(500);
				}
			}
		}
	},
	upload: async ({ cookies, request, params }) => {
		if (!hasValidUploadToken(request, cookies)) {
			throw error(401);
		}
		const directoryPath = await getActualPath(params);
		const data = await request.formData();
		const files = data.getAll('file') as File[];
		await Promise.all(
			files.map(async (file) => {
				const arrayBuffer = await file.arrayBuffer();
				const buffer = Buffer.from(arrayBuffer);
				await createFile(file.name, directoryPath, buffer);
			})
		);
	}
};
