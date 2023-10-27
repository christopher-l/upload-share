import { listRootDir, type FileEntry } from '$lib/server/filesystem';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad<{ fileList: FileEntry[] }> = async ({ params }) => {
	return { fileList: await listRootDir() };
};
