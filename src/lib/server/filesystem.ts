import { ROOT_DIR } from '$env/static/private';
import { lstat, readdir } from 'fs/promises';
import { getType } from 'mime';
import { join } from 'path';
import { getToken } from './tokens';

export interface FileEntry {
	name: string;
	type: string | null;
	modifiedTime: Date;
}

export interface RootFileEntry extends FileEntry {
	token: string;
}

export async function listRootDir(): Promise<RootFileEntry[]> {
	const list = await _listFiles(ROOT_DIR);
	const rootList = await Promise.all(
		list.map(async (entry) => ({ ...entry, token: await getToken(entry.name) }))
	);
	return rootList.sort((a, b) => b.modifiedTime.getTime() - a.modifiedTime.getTime());
}

export async function listSubDir(path: string): Promise<FileEntry[]> {
	return await _listFiles(join(ROOT_DIR, path));
}

async function _listFiles(path: string): Promise<FileEntry[]> {
	const files = await readdir(path);
	const stats = await Promise.all(files.map((file) => lstat(join(path, file))));

	return files.map((name, index) => {
		const isDirectory = stats[index].isDirectory();
		return {
			name,
			type: isDirectory ? 'inode/directory' : getType(name),
			modifiedTime: stats[index].mtime
		};
	});
}

export async function isDirectory(path: string): Promise<boolean> {
	const stats = await lstat(join(ROOT_DIR, path));
	return stats.isDirectory();
}
