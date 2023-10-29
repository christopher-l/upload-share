import { ROOT_DIR } from '$env/static/private';
import { lstat, readdir, readFile, mkdir } from 'fs/promises';
import mime from 'mime';
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

const initialized = createRootDirIfNeeded();

export async function listRootDir(): Promise<RootFileEntry[]> {
	await initialized;
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
			type: isDirectory ? 'inode/directory' : mime.getType(name),
			modifiedTime: stats[index].mtime
		};
	});
}

export async function getEntryType(path: string): Promise<'file' | 'directory' | null> {
	try {
		const stats = await lstat(join(ROOT_DIR, path));
		if (stats.isDirectory()) {
			return 'directory';
		} else {
			return 'file';
		}
	} catch (e) {
		return null;
	}
}

export async function getContent(
	path: string
): Promise<{ content: Buffer; mimetype: string } | null> {
	try {
		const content = await readFile(join(ROOT_DIR, path));
		const mimetype = mime.getType(path) ?? 'application/octet-stream';
		return { content, mimetype };
	} catch (e) {
		return null;
	}
}

async function createRootDirIfNeeded(): Promise<void> {
	if (!ROOT_DIR) {
		return;
	}
	try {
		await lstat(ROOT_DIR);
		return;
	} catch (e) {
		if (e.code !== 'ENOENT') {
			throw e;
		}
	}
	await mkdir(ROOT_DIR);
	console.log('Created root directory', ROOT_DIR);
}
