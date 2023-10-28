import type { FileEntry, RootFileEntry } from './server/filesystem';

export function getUrlPath(params: { token: string; path: string }): string {
	let path = params.token;
	if (params.path) {
		path += '/' + params.path;
	}
	return path;
}

export function isRootFileEntry(entry: FileEntry): entry is RootFileEntry {
	return 'token' in entry;
}
