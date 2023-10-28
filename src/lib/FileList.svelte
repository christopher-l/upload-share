<script lang="ts">
	import { page } from '$app/stores';
	import type { FileEntry } from './server/filesystem';
	import { isRootFileEntry } from './utils';

	export let fileList: FileEntry[];

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
</script>

<ul>
	{#each fileList as file}
		<li>
			<a href={getHref(file)}>
				<iconify-icon icon={getIcon(file.type)} width="36" height="36" />
				<span>{file.name}</span>
			</a>
			<button class="standard icon">
				<iconify-icon icon="ic:baseline-more-vert" width="36" height="36" />
			</button>
		</li>
	{/each}
</ul>

<style lang="scss">
	ul {
		padding: calc(var(--spacing) / 2);
	}
	li {
		list-style: none;
		display: flex;
		border-radius: var(--border-radius);
		&:hover,
		&:focus-within {
			background-color: var(--secondary-focus);
		}
		a {
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
</style>
