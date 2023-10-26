import { isDirectory, listFiles, type FileEntry } from '$lib/server/filesystem';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad<{ fileList: FileEntry[] }> = async ({ params }) => {
	if (await isDirectory(params.link)) {
		return { fileList: await listFiles(params.link) };
	} else {
		throw redirect(302, params.link + '/preview');
	}
};
