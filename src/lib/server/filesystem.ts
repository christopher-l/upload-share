import { building } from '$app/environment';
import { ROOT_DIR } from '$env/static/private';
import { error } from '@sveltejs/kit';
import AdmZip from 'adm-zip';
import { fileTypeFromBuffer } from 'file-type';
import { lstat, mkdir, readFile, readdir, rm, writeFile } from 'fs/promises';
import mime from 'mime';
import { join } from 'path';
import { addToken, deleteToken, getPathForTokenEntry, getTokenEntry, listTokens } from './tokens';
import type { ErrnoException } from './types';

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
	const list = await listTokens();
	const sortedList = list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
	const stats = await Promise.all(
		sortedList.map((entry) => lstat(join(ROOT_DIR, getPathForTokenEntry(entry))))
	);
	return sortedList.map((entry, index) => {
		const isDirectory = stats[index].isDirectory();
		return { ...entry, type: isDirectory ? 'inode/directory' : mime.getType(entry.name) };
	});
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
 * @param name The name of the folder to create.
 * @param path The path to the parent folder from ROOT_DIR.
 */
export async function createFolder(name: string, path: string[]): Promise<void> {
	console.log('Creating directory', name, path);
	if (path.length === 0) {
		const entry = await addToken(name);
		await mkdir(join(ROOT_DIR, getPathForTokenEntry(entry)));
	} else {
		await mkdir(join(ROOT_DIR, ...path, name));
	}
}

/**
 * Removes a root-level token entry.
 *
 * Deletes both the entry of the tokens map and the corresponding file(s).
 */
export async function removeToken(token: string): Promise<void> {
	console.log('Deleting token', token);
	const entry = await getTokenEntry(token);
	if (!entry) {
		// TODO: Decide on a consistent error type to propagate from these functions.
		throw error(404);
	}
	await rm(join(ROOT_DIR, getPathForTokenEntry(entry)), { recursive: true });
	await deleteToken(token);
}

/**
 * Removes a file or directory on a sub level under a token entry.
 */
export async function removeSubPath(path: string): Promise<void> {
	console.log('Deleting', path);
	await rm(join(ROOT_DIR, path), { recursive: true });
}

export async function createFile(name: string, path: string[], content: Buffer): Promise<void> {
	if (path.length === 0) {
		const entry = await addToken(name);
		console.log('Writing file', getPathForTokenEntry(entry));
		await writeFile(join(ROOT_DIR, getPathForTokenEntry(entry)), content);
	} else {
		const filePath = join(ROOT_DIR, ...path, name);
		if (await exists(filePath)) {
			throw error(409);
		}
		console.log('Writing file', filePath);
		await writeFile(filePath, content);
	}
}

export async function getZipArchive(path: string[]): Promise<Buffer> {
	const zip = new AdmZip();
	await zip.addLocalFolderPromise(join(ROOT_DIR, ...path), {});
	const buffer = await zip.toBufferPromise();
	return buffer;
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
