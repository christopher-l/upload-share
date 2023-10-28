import { env } from '$env/dynamic/private';
import { listRootDir, type FileEntry } from '$lib/server/filesystem';
import { error } from '@sveltejs/kit';
import { parse } from 'url';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad<{ fileList: FileEntry[] }> = async ({ cookies, request }) => {
	if (!env.UPLOAD_TOKEN) {
		throw error(403);
	}
	if (cookies.get('token') === env.UPLOAD_TOKEN) {
		return { fileList: await listRootDir() };
	}
	const url = parse(request.url, true);
	if (url.query.token === env.UPLOAD_TOKEN) {
		cookies.set('token', url.query.token);
		return { fileList: await listRootDir() };
	}
	throw error(403);
};
