import { building } from '$app/environment';
import { ROOT_DIR } from '$env/static/private';
import { fileTypeFromBuffer } from 'file-type';
import { lstat, mkdir, readFile, readdir, rm, writeFile } from 'fs/promises';
import mime from 'mime';
import { join } from 'path';
import { deleteTokenForPath, getToken } from './tokens';

export interface ErrnoException extends Error {
	errno?: number;
	code?: string;
	path?: string;
	syscall?: string;
	stack?: string;
}

export interface FileEntry {
	name: string;
	type: string | null;
}

export interface RootFileEntry extends FileEntry {
	token: string;
}

let initialized: Promise<void>;
if (!building) {
	initialized = createRootDirIfNeeded();
}

export async function listDir(path: []): Promise<RootFileEntry[]>;
export async function listDir(path: string[]): Promise<FileEntry[]>;
export async function listDir(path: string[]): Promise<FileEntry[]> {
	if (path.length > 0) {
		return listSubDir(path);
	} else {
		return listRootDir();
	}
}

async function listRootDir(): Promise<RootFileEntry[]> {
	await initialized;
	const list = await _listFiles(ROOT_DIR);
	const rootList = await Promise.all(
		list.map(async (entry) => ({ ...entry, token: await getToken(entry.name) }))
	);
	return rootList.sort((a, b) => b.modifiedTime.getTime() - a.modifiedTime.getTime());
}

async function listSubDir(path: string[]): Promise<FileEntry[]> {
	return await _listFiles(join(ROOT_DIR, ...path));
}

async function _listFiles(path: string): Promise<(FileEntry & { modifiedTime: Date })[]> {
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

export async function getEntryType(path: string[]): Promise<'file' | 'directory' | null> {
	try {
		const stats = await lstat(join(ROOT_DIR, ...path));
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
	path: string[]
): Promise<{ content: Buffer; mimetype: string } | null> {
	try {
		const content = await readFile(join(ROOT_DIR, ...path));
		const mimetype = (await fileTypeFromBuffer(content))?.mime ?? 'application/octet-stream';
		return { content, mimetype };
	} catch (e) {
		return null;
	}
}

async function createRootDirIfNeeded(): Promise<void> {
	if (!ROOT_DIR) {
		return;
	}
	if (!(await exists(''))) {
		console.log('Creating root directory', ROOT_DIR);
		await mkdir(ROOT_DIR);
	}
}

/**
 * Creates a new folder.
 *
 * @param path The complete path to the folder to create from ROOT_DIR.
 */
export async function createFolder(path: string): Promise<void> {
	console.log('Creating directory', path);
	await mkdir(join(ROOT_DIR, path));
}

export async function remove(path: string): Promise<void> {
	console.log('Deleting', path);
	await rm(join(ROOT_DIR, path), { recursive: true });
	if (!path.includes('/')) {
		await deleteTokenForPath(path);
	}
}

export async function createFile(path: string, content: Buffer): Promise<void> {
	if (await exists(path)) {
		throw { ...new Error('File exists'), code: 'EEXIST' };
	}
	console.log('Writing file', path);
	await writeFile(join(ROOT_DIR, path), content);
}

async function exists(path: string): Promise<boolean> {
	try {
		await lstat(join(ROOT_DIR, path));
		return true;
	} catch (e) {
		if ((e as ErrnoException).code !== 'ENOENT') {
			throw e;
		}
	}
	return false;
}
