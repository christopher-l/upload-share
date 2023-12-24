<script lang="ts">
	import { enhance } from '$app/forms';
	import { navigating } from '$app/stores';
	import FileList from './FileList.svelte';
	import { selectDestination } from './stores';
	import { uploadFiles as doUploadFiles, uploadingFiles } from './uploadFiles';

	let menu: HTMLDetailsElement;
	/** The user chose to create a new folder and is currently prompted to choose a name. */
	let creatingFolder = false;
	let newFolderName = '';
	/** The user requested an action and the request is currently in flight to the server. */
	let awaitingResponse = false;

	let fileInput: HTMLInputElement;
	/** Whether the user is currently dragging a file above the page. */
	let dragging = false;

	/**
	 * The button's initial form.
	 *
	 * - menu: Opens a dropdown menu to choose between uploading files and
	 *   creating a new folder.
	 * - folder: Creates a new folder.
	 */
	let mode: 'menu' | 'folder';
	$: if ($selectDestination) {
		mode = 'folder';
	} else {
		mode = 'menu';
	}

	$: nameIsValid = !newFolderName.includes('/');

	$: if ($navigating) {
		creatingFolder = false;
		awaitingResponse = false;
		dragging = false;
	}

	/** Prompts the user to choose a name for a new folder to create. */
	function newFolder(): void {
		creatingFolder = true;
		newFolderName = new Date().toISOString().split('T')[0];
	}

	function initNewFolder(input: HTMLInputElement): void {
		input.focus;
		input.select();
	}

	function uploadFiles(files = fileInput.files): void {
		menu?.removeAttribute('open');
		doUploadFiles(files);
	}
</script>

<svelte:document />

<svelte:body
	on:drop|preventDefault={(event) => {
		dragging = false;
		uploadFiles(event.dataTransfer?.files);
	}}
	on:dragover|preventDefault
	on:dragenter|capture={(event) => {
		if (!event.relatedTarget && event.dataTransfer?.files) {
			dragging = true;
		}
	}}
	on:dragleave|capture={(event) => {
		if (!event.relatedTarget) {
			dragging = false;
		}
	}}
/>

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
{:else if $uploadingFiles}
	<FileList fileList={$uploadingFiles} />
{:else if mode === 'menu'}
	<details role="list" bind:this={menu}>
		<summary class="outline" class:dragging aria-haspopup="listbox" aria-busy={awaitingResponse}>
			+
		</summary>
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
					Upload Files
				</a>
				<form
					method="post"
					action="?/upload"
					enctype="multipart/form-data"
					style="display: none;"
					use:enhance={() => {
						awaitingResponse = true;
						return async ({ update }) => {
							await update();
							awaitingResponse = false;
						};
					}}
				>
					<input
						bind:this={fileInput}
						type="file"
						name="file"
						multiple
						on:change={() => uploadFiles()}
					/>
					<input type="submit" />
				</form>
			</li>
		</ul>
	</details>
{:else if mode === 'folder'}
	<button class="new-folder-button secondary outline" on:click={newFolder}>
		<iconify-icon icon="mdi:folder" width="36" height="36" />
		New folder
	</button>
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
		&.dragging {
			background-color: var(--form-element-valid-focus-color);
		}
	}
	details a {
		display: flex;
		gap: var(--spacing);
		align-items: center;
		cursor: pointer;
	}
	.new-folder-button {
		display: flex;
		gap: var(--spacing);
		align-items: center;
		iconify-icon {
			height: 0;
			margin-top: -36px;
		}
	}
</style>
