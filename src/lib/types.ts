import type { FileEntry } from "./server/filesystem";

export interface FileListEntry extends FileEntry {
	downloadHref?: string;
	progress?: number;
	error?: boolean;
	abort?: () => void;
}