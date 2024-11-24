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
		fileEntry.progress = progress;
		uploadingFilesStore.update((uploadingFiles) => uploadingFiles);
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
				fileEntry.progress = 1;
				fileEntry.abort = undefined;
				fileEntry.error = true;
				uploadingFilesStore.update((uploadingFiles) => uploadingFiles);
				reject(ajax.statusText);
			}
		});
		ajax.addEventListener('error', (e) => {
			fileEntry.error = true;
			uploadingFilesStore.update((uploadingFiles) => uploadingFiles);
			reject(e);
		});
		ajax.addEventListener('abort', () => resolve());
		ajax.open('POST', '?/upload');
		ajax.send(formdata);
	}).finally(unsubscribe);
}
