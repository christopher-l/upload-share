<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { navigating } from '$app/stores';
	import { cubicOut } from 'svelte/easing';
	import { tweened } from 'svelte/motion';
	import FileList from './FileList.svelte';
	import type { FileListEntry } from './types';

	let menu: HTMLDetailsElement;
	/** The user chose to create a new folder and is currently prompted to choose a name. */
	let creatingFolder = false;
	let newFolderName = '';
	/** The user requested an action and the request is currently in flight to the server. */
	let awaitingResponse = false;

	let fileInput: HTMLInputElement;
	let uploadingFiles: FileListEntry[] | null;

	$: nameIsValid = !newFolderName.includes('/');

	$: if ($navigating) {
		creatingFolder = false;
		awaitingResponse = false;
		uploadingFiles = null;
	}

	/** Prompts the user to choose a name for a new folder to create. */
	function newFolder(): void {
		creatingFolder = true;
		newFolderName = 'New Folder';
	}

	function initNewFolder(input: HTMLInputElement): void {
		input.focus;
		input.select();
	}

	function uploadFiles(): void {
		menu.removeAttribute('open');
		const files = fileInput.files;
		if (!files) {
			return;
		}
		Promise.all([...files].map(uploadFile))
			.then(() => {
				uploadingFiles = null;
				invalidateAll();
			})
			.catch((e) => {
				console.log('catch', uploadingFiles);

				console.error(e);
			});
	}

	function uploadFile(file: File): Promise<void> {
		console.log('uploadFile', file);
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
			uploadingFiles = uploadingFiles;
		});
		function onProgress(event: ProgressEvent): void {
			progress.set(event.loaded / event.total);
		}
		const formdata = new FormData();
		formdata.append('file', file);
		uploadingFiles = [...(uploadingFiles ?? []), fileEntry];
		ajax.upload.addEventListener('progress', onProgress);
		return new Promise<void>((resolve, reject) => {
			ajax.addEventListener('load', (e) => {
				if (ajax.status === 200) {
					resolve();
				} else {
					console.log('!== 200', ajax);
					fileEntry.progress = 1;
					fileEntry.abort = undefined;
					fileEntry.error = true;
					uploadingFiles = uploadingFiles;
					reject(ajax.statusText);
				}
			});
			ajax.addEventListener('error', (e) => {
				fileEntry.error = true;
				uploadingFiles = uploadingFiles;
				reject(e);
			});
			ajax.addEventListener('abort', () => resolve());
			ajax.open('POST', '?/upload');
			ajax.send(formdata);
		}).finally(unsubscribe);
	}
</script>

{#if creatingFolder}
	<form
		method="POST"
		action="?/newFolder"
		use:enhance={() => {
			awaitingResponse = true;
			return async ({ update }) => {
				await update();
				awaitingResponse = false;
				creatingFolder = false;
			};
		}}
	>
		<iconify-icon icon="mdi:folder" width="36" height="36" />
		<input
			name="name"
			bind:value={newFolderName}
			use:initNewFolder
			aria-invalid={nameIsValid ? undefined : true}
			disabled={awaitingResponse}
		/>
		{#if nameIsValid}
			<button class="secondary" disabled={!newFolderName.trim()} aria-busy={awaitingResponse}>
				Create
			</button>
		{/if}
	</form>
{:else if uploadingFiles}
	<FileList fileList={uploadingFiles} />
{:else}
	<details role="list" bind:this={menu}>
		<summary class="outline" aria-haspopup="listbox" aria-busy={awaitingResponse}>+</summary>
		<ul role="listbox">
			<li>
				<!-- svelte-ignore a11y-missing-attribute -->
				<!-- svelte-ignore a11y-no-static-element-interactions -->
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<a on:click={newFolder}>
					<iconify-icon icon="mdi:folder" width="36" height="36" />
					New Folder
				</a>
			</li>
			<li>
				<!-- svelte-ignore a11y-missing-attribute -->
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<!-- svelte-ignore a11y-no-static-element-interactions -->
				<a on:click={() => fileInput.click()}>
					<iconify-icon icon="ic:round-upload" width="36" height="36" />
					Upload File
				</a>
				<form
					method="post"
					action="?/upload"
					enctype="multipart/form-data"
					style="display: none;"
					use:enhance={() => {
						console.log('enhance');

						awaitingResponse = true;
						return async ({ update }) => {
							await update();
							awaitingResponse = false;
						};
					}}
				>
					<input bind:this={fileInput} type="file" name="file" multiple on:change={uploadFiles} />
					<input type="submit" />
				</form>
			</li>
		</ul>
	</details>
{/if}

<style lang="scss">
	form {
		position: relative;
		margin: 0;
		[icon],
		button {
			top: var(--border-width);
			position: absolute;
			height: calc(100% - var(--spacing) - var(--border-width) * 2);
		}
		[icon] {
			padding-left: var(--spacing);
			display: flex;
			align-items: center;
		}
		input {
			padding-left: calc(var(--spacing) * 2 + 36px) !important;
			padding-right: calc(var(--form-element-spacing-horizontal) * 3 + 3.5rem);
		}
		button {
			right: var(--border-width);
			width: unset;
		}
	}
	summary {
		text-align: center;
	}
	details a {
		display: flex;
		gap: var(--spacing);
		align-items: center;
		cursor: pointer;
	}
</style>
