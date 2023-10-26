import type { PageServerLoad } from './$types';
import { readdir, lstat } from 'fs/promises';
import { getType } from 'mime';

interface FileEntry {
	name: string;
	type: string | null;
}

export const load: PageServerLoad<{ fileList: FileEntry[] }> = async ({ params }) => {
	const files = await readdir('.');
	const stats = await Promise.all(files.map((file) => lstat(file)));

	const fileList = files.map((name, index) => {
		const isDirectory = stats[index].isDirectory();
		return {
			name,
			type: isDirectory ? 'inode/directory' : getType(name)
		};
	});

	return { fileList };
};
