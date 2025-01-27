import { browser } from '$app/environment';
import { invalidateAll } from '$app/navigation';
import { navigating } from '$app/stores';
import { cubicOut } from 'svelte/easing';
import { tweened } from 'svelte/motion';
import { writable, type Readable } from 'svelte/store';
import type { FileListEntry } from './types';

const uploadingFilesStore = writable<FileListEntry[] | null>(null);
/** File list of files that are currently being uploaded. */
export const uploadingFiles: Readable<FileListEntry[] | null> = uploadingFilesStore;

if (browser) {
	navigating.subscribe((navigating) => {
		if (navigating) {
			uploadingFilesStore.set(null);
		}
	});
}

export async function uploadFiles(files: FileList | File[] | null | undefined): Promise<void> {
	if (files) {
		await Promise.all([...files].map(uploadFile)).then(() => {
			invalidateAll();
			uploadingFilesStore.set(null);
		});
	}
}

function uploadFile(file: File): Promise<void> {
	const ajax = new XMLHttpRequest();
	const fileEntry: FileListEntry = {
		name: file.name,
		type: file.type,
		progress: 0,
		abort: () => ajax.abort()
	};
	const progress = tweened(0, { easing: cubicOut });
	const unsubscribe = progress.subscribe((progress) => {
		uploadingFilesStore.update((uploadingFiles) =>
			updateFileEntry(uploadingFiles, { ...fileEntry, progress })
		);
	});
	function onProgress(event: ProgressEvent): void {
		progress.set(event.loaded / event.total);
	}
	const formdata = new FormData();
	formdata.append('file', file);
	uploadingFilesStore.update((uploadingFiles) => [...(uploadingFiles ?? []), fileEntry]);
	ajax.upload.addEventListener('progress', onProgress);
	return new Promise<void>((resolve, reject) => {
		ajax.addEventListener('load', () => {
			if (ajax.status === 200) {
				resolve();
			} else {
				uploadingFilesStore.update((uploadingFiles) =>
					updateFileEntry(uploadingFiles, {
						...fileEntry,
						progress: 1,
						abort: undefined,
						error: true
					})
				);
				reject(ajax.statusText);
			}
		});
		ajax.addEventListener('error', (e) => {
			uploadingFilesStore.update((uploadingFiles) =>
				updateFileEntry(uploadingFiles, { ...fileEntry, error: true })
			);
			reject(e);
		});
		ajax.addEventListener('abort', () => resolve());
		ajax.open('POST', '?/upload');
		ajax.send(formdata);
	}).finally(unsubscribe);
}

function updateFileEntry(
	list: FileListEntry[] | null,
	entry: FileListEntry
): FileListEntry[] | null {
	if (list == null) {
		return list;
	}
	const key = getFileEntryKey(entry);
	const index = list.findIndex((item) => getFileEntryKey(item) === key);
	if (index !== -1) {
		list[index] = entry;
	}
	return list;
}

function getFileEntryKey(fileEntry: FileListEntry): string {
	return fileEntry.token ?? fileEntry.name;
}
