<script lang="ts">
	import { page } from '$app/stores';
	import type { FileListEntry } from '../routes/[token]/[...path]/+page.server';
	import NewButton from './NewButton.svelte';
	import ShareUrl from './ShareUrl.svelte';
	import type { FileEntry } from './server/filesystem';
	import { isRootFileEntry } from './utils';

	export let fileList: FileListEntry[];
	export let hasUploadToken: boolean;
	export let filePath: string[];

	const iconMap = {
		'inode/directory': 'mdi:folder',
		'application/pdf': 'fa-solid:file-pdf',
		text: 'fa6-solid:file-lines',
		image: 'mdi:image',
		audio: 'mdi:music',
		video: 'mdi:filmstrip',
		other: 'mdi:file'
	};

	$: getHref = (entry: FileEntry) => {
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

	$: getBreadcrumbsHref = (index: number) => {
		if (index === filePath.length - 2) {
			return '.';
		} else {
			return Array(filePath.length - index - 2)
				.fill('..')
				.join('/');
		}
	};
</script>

{#if hasUploadToken && filePath.length > 0}
	<ShareUrl url={$page.url.toString()} />
{/if}

{#if filePath.length > 0}
	<nav aria-label="breadcrumb">
		<ul>
			{#each filePath as component, i}
				{#if i < filePath.length - 1}
					<li><a href={getBreadcrumbsHref(i)}>{component}</a></li>
				{:else}
					<li>{component}</li>
				{/if}
			{/each}
		</ul>
	</nav>
{/if}

{#if hasUploadToken}
	<NewButton />
{/if}
<ul class="file-list">
	{#each fileList as file}
		<li>
			<a href={getHref(file)}>
				<iconify-icon icon={getIcon(file.type)} width="36" height="36" />
				<span>{file.name}</span>
			</a>
			{#if file.downloadHref}
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
		li {
			list-style: none;
			display: flex;
			border-radius: var(--border-radius);
			&:hover,
			&:focus-within {
				background-color: var(--secondary-focus);
			}
			a:first-child {
				flex-grow: 1;
				display: flex;
				align-items: center;
				gap: var(--spacing);
				padding: 0 var(--spacing);
				--color: inherit;
				&:hover,
				&:focus {
					text-decoration: unset;
				}
			}
		}
	}
</style>
