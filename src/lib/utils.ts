import type { FileEntry, RootFileEntry } from './server/filesystem';

export function getUrlPath(params: { token?: string; path?: string }): string {
	if (!params.token) {
		return '';
	} else if (!params.path) {
		return params.token;
	} else {
		return `${params.token}/${params.path}`;
	}
}

export function isRootFileEntry(entry: FileEntry): entry is RootFileEntry {
	return 'token' in entry;
}
