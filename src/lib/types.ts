import type { FileEntry } from "./server/filesystem";

export interface FileListEntry extends FileEntry {
	token?: string;
	downloadHref?: string;
	progress?: number;
	error?: boolean;
	abort?: () => void;
}

export interface NavLinks {
	next: string | null;
	previous: string | null;
	index: number;
	total: number;
}
