import { lstat, readdir } from 'fs/promises';
import { getType } from 'mime';
import { join } from 'path';

export interface FileEntry {
	name: string;
	type: string | null;
}

export async function listRootDir(): Promise<FileEntry[]> {
	return _listFiles('.');
}

export async function listSubDir(path: string): Promise<FileEntry[]> {
	return await _listFiles(path);
}

async function _listFiles(path: string): Promise<FileEntry[]> {
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
