<script lang="ts">
	import { page } from '$app/stores';
	import FileMenu from './FileMenu.svelte';
	import type { FileListEntry } from './types';
	import { isRootFileEntry } from './utils';

	export let fileList: FileListEntry[];
	export let showFileMenu = false;

	const iconMap = {
		'inode/directory': 'mdi:folder',
		'application/pdf': 'fa-solid:file-pdf',
		text: 'fa6-solid:file-lines',
		image: 'mdi:image',
		audio: 'mdi:music',
		video: 'mdi:filmstrip',
		other: 'mdi:file'
	};

	$: getHref = (entry: FileListEntry) => {
		if (entry.progress != null || entry.error) {
			return null;
		}
		if (isRootFileEntry(entry)) {
			return entry.token;
		} else {
			return $page.url.pathname + '/' + entry.name;
		}
	};

	function getIcon(type: string | null): string {
		const baseType = type?.split('/', 1)?.[0];
		return (
			iconMap[type as keyof typeof iconMap] ??
			iconMap[baseType as keyof typeof iconMap] ??
			iconMap.other
		);
	}
</script>

<ul class="file-list">
	{#each fileList as file (file.token ?? file.name)}
		<li>
			{#if file.progress != null}
				<progress value={file.progress ?? 0.5} class:error={file.error} />
			{/if}
			<a href={getHref(file)}>
				<iconify-icon icon={getIcon(file.type)} width="36" height="36" />
				<span>{file.name}</span>
			</a>
			{#if file.abort}
				<button class="standard icon" on:click={() => file.abort?.()}>
					<iconify-icon icon="mdi:close-circle" width="36" height="36" />
				</button>
			{:else if showFileMenu}
				<FileMenu {file} />
			{:else if file.downloadHref}
				<a href={file.downloadHref} download class="standard icon">
					<iconify-icon icon="mdi:download" width="36" height="36" />
				</a>
			{:else}
				<!-- Render hidden button to take up space. -->
				<button style="visibility: hidden" class="standard icon">
					<iconify-icon icon="mdi:download" width="36" height="36" />
				</button>
			{/if}
		</li>
	{/each}
</ul>

<style lang="scss">
	ul.file-list {
		padding: 0;
		margin: 0;
		li {
			position: relative;
			list-style: none;
			display: flex;
			border-radius: var(--pico-border-radius);
			&:hover,
			&:focus-within {
				background-color: var(--pico-secondary-focus);
			}
			progress {
				position: absolute;
				opacity: 0.5;
				height: 100%;
				z-index: -1;
				margin: 0;
				&.error {
					background-color: var(--pico-form-element-invalid-focus-color);
					&::-webkit-progress-value {
						background-color: var(--pico-del-color);
					}
					&::-moz-progress-bar {
						background-color: var(--pico-del-color);
					}
				}
			}
			a:first-of-type {
				flex-grow: 1;
				display: flex;
				align-items: center;
				gap: var(--pico-spacing);
				padding: 0 var(--pico-spacing);
				--pico-color: inherit;
				--pico-text-decoration: unset;
				overflow-wrap: anywhere;
				&:hover,
				&:focus {
					text-decoration: unset;
				}
			}
		}
	}
</style>
