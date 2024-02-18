import { env } from '$env/dynamic/private';
import { DATA_DIR } from '$env/static/private';
import { error } from '@sveltejs/kit';
import { exec } from 'child_process';
import { rmSync } from 'fs';
import { lstat, mkdir, readFile, rm } from 'fs/promises';
import { join } from 'path';
import { promisify } from 'util';
import { registerCleanup } from './process';
import type { ErrnoException } from './types';
const execPromise = promisify(exec);

const tempDir = '/tmp/upload-share';

createTempDir();

/** Return whether you can call getZipArchive on path. */
export async function canGetZipArchive(path: string[]): Promise<boolean> {
	const folderSize = await getFolderSize(path);
	return folderSize <= getMaxArchiveSize();
}

/** Creates a zip archive of the given path and returns the archive's path. */
export async function createZipArchive(path: string[]): Promise<string> {
	if (!(await canGetZipArchive(path))) {
		throw error(400, 'MAX_ARCHIVE_SIZE exceeded');
	}
	const archiveFileName = `${getRandomString()}.zip`;
	console.log('Creating download archive', `${tempDir}/${archiveFileName}`);
	await execPromise(`zip -r ${tempDir}/${archiveFileName} .`, {
		cwd: join(DATA_DIR, ...path)
	});
	// Give the client 10 seconds to start the download, then delete the archive file.
	setTimeout(() => {
		console.log('Removing download archive', `${tempDir}/${archiveFileName}`);
		rm(`${tempDir}/${archiveFileName}`);
	}, 10000);
	return archiveFileName;
}

export async function getArchiveContent(archiveFileName: string): Promise<Buffer | null> {
	try {
		const content = await readFile(join(tempDir, archiveFileName));
		return content;
	} catch (e) {
		return null;
	}
}

/** Returns the total folder size in byte. */
async function getFolderSize(path: string[]): Promise<number> {
	const { stdout } = await execPromise('du . -sb | cut -f 1', {
		cwd: join(DATA_DIR, ...path)
	});
	const size = Number.parseInt(stdout);
	return size;
}

/** Creates the temporary directory. */
async function createTempDir(): Promise<void> {
	try {
		await lstat(tempDir);
		console.log('Removing temporary directory', tempDir);
		await rm(tempDir, { recursive: true });
	} catch (e) {
		if ((e as ErrnoException).code !== 'ENOENT') {
			throw e;
		}
	}
	console.log('Creating temporary directory', tempDir);
	await mkdir(tempDir);
	registerCleanup('cleanup-archive-temp-dir', () => {
		console.log('Removing temporary directory', tempDir);
		rmSync(tempDir, { recursive: true });
	});
}

/** Returns the value of MAX_ARCHIVE_SIZE in byte. */
function getMaxArchiveSize(): number {
	if (!env.MAX_ARCHIVE_SIZE) {
		return 0;
	}
	const match = /(\d+)([KMG])?/.exec(env.MAX_ARCHIVE_SIZE);
	if (!match) {
		return 0;
	}
	const value = parseInt(match[1]);
	switch (match[2]) {
		case 'K':
			return value * 1024;
		case 'M':
			return value * 1024 * 1024;
		case 'G':
			return value * 1024 * 1024 * 1024;
		default:
			return value;
	}
}

/**
 * Generates random string suitable as component for a file path or an URL path.
 */
function getRandomString(): string {
	const length = 10;
	const bytes = new Uint8Array(length);
	crypto.getRandomValues(bytes);
	const base64 = btoa(String.fromCharCode(...bytes));
	return base64.replaceAll('/', '-').replaceAll('=', '');
}
