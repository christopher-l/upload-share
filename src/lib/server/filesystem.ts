import { lstat, readdir } from 'fs/promises';
import { getType } from 'mime';
import { join } from 'path';

export interface FileEntry {
	name: string;
	type: string | null;
}

export async function listFiles(path: string): Promise<FileEntry[]> {
	console.log('listFiles', path);

	const files = await readdir(path);
	const stats = await Promise.all(files.map((file) => lstat(join(path, file))));

	return files.map((name, index) => {
		const isDirectory = stats[index].isDirectory();
		return {
			name,
			type: isDirectory ? 'inode/directory' : getType(name)
		};
	});
}

export async function isDirectory(path: string): Promise<boolean> {
	const stats = await lstat(path);
	return stats.isDirectory();
}
