import { error } from '@sveltejs/kit';
import type { FileListEntry } from '../types';
import { listDir, type RootFileEntry } from './filesystem';
import { getPathForTokenEntry, getTokenEntry } from './tokens';
import { canGetZipArchive } from './archive';

/**
 * Returns the visible path using the token entry's name as first element.
 */
export async function getVirtualPath(params: { token?: string; path?: string }): Promise<string[]> {
	if (!params.token) {
		return [];
	}
	const tokenEntry = await getTokenEntry(params.token);
	if (!tokenEntry) {
		throw error(404);
	}
	if (!params.path) {
		return [tokenEntry.name];
	}
	return [tokenEntry.name, ...params.path.split('/')];
}

/**
 * Returns the actual file path on disk, using the token entrie's date + name as first element.
 */
export async function getActualPath(params: { token?: string; path?: string }): Promise<string[]> {
	if (!params.token) {
		return [];
	}
	const tokenEntry = await getTokenEntry(params.token);
	if (!tokenEntry) {
		throw error(404);
	}
	if (
		!params.path ||
		// We use an additional '/' character to indicate that we appended the filename for a
		// root-level file to the URL. In this case, the actual file was already indicated by the
		// token and we discard `params.path` (after checking, that it matches the filename
		// indicated by the token).
		params.path === `/${tokenEntry.name}`
	) {
		return [getPathForTokenEntry(tokenEntry)];
	}
	return [getPathForTokenEntry(tokenEntry), ...params.path.split('/')];
}

/**
 * Returns the download HREF for the given file.
 *
 * @param token The root entry's download token.
 */
export function getDownloadHref(token: string, virtualPath: string[]): string {
	const [rootPath, ...subPath] = virtualPath;
	if (subPath.length > 0) {
		return `/download/${token}/${subPath.join('/')}`;
	} else {
		// We append the filename to the URL, so the browser has the correct name when downloading
		// and so it will have the correct extension when used in `src` tags. The `download`
		// endpoint needs to strip this when received. We use the additional '/' character to
		// identify this scenario.
		return `/download/${token}//${rootPath}`;
	}
}

/**
 * Returns a link that will create an archive of the directory and return the
 * archive's download link.
 *
 * @param token The root entry's download token.
 */
export async function createArchiveHref(
	token: string,
	actualPath: string[],
	virtualPath: string[]
): Promise<string | null> {
	const [_, ...subPath] = virtualPath;
	if (!(await canGetZipArchive(actualPath))) {
		return null;
	}
	return `/archive/${token}/${subPath.join('/')}`;
}

/**
 * Returns a file listing for the root directory or a sub directory.
 */
export async function getFileList(params: {
	token?: string;
	path?: string;
}): Promise<FileListEntry[]> {
	const actualPath = await getActualPath(params);
	const virtualPath = await getVirtualPath(params);
	const list = await listDir(actualPath);
	return Promise.all(
		list.map(async (entry) => {
			const entryToken = params.token ?? (entry as RootFileEntry).token;
			let downloadHref: string | undefined;
			if (
				// Don't get download links for the root directory since checking
				// canGetZipArchive is a special case here and the root-dir listing
				// is only available to the admin anyway.
				actualPath.length > 0 &&
				// Don't get download links for directories for now.
				entry.type !== 'inode/directory'
			) {
				downloadHref = getDownloadHref(entryToken, [...virtualPath, entry.name]);
			}
			return { ...entry, downloadHref };
		})
	);
}
