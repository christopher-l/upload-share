import { lstat, readdir } from 'fs/promises';
import { getType } from 'mime';
import { join } from 'path';
import { getToken } from './tokens';

export interface FileEntry {
	name: string;
	type: string | null;
	token?: string;
}

export async function listRootDir(): Promise<FileEntry[]> {
	const list = await _listFiles('.');
	await Promise.all(list.map(async file => file.token = await getToken(file.name)))
	return list;
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
