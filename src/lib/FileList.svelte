<script lang="ts">
	import type { FileEntry } from './server/filesystem';
	import { page } from '$app/stores';

	export let fileList: FileEntry[];
	$: prefix = $page.url.pathname === '/' ? '/' : $page.url.pathname + '/';

	const iconMap = {
		'inode/directory': 'mdi:folder',
		'text/markdown': 'mdi:language-markdown',
		'application/json': 'mdi:code-json',
		'application/javascript': 'mdi:language-javascript',
		image: 'mdi:image',
		video: 'mdi:filmstrip',
		other: 'mdi:file'
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
	{#each fileList as { name, type }, i}
		<li>
			<a href={prefix + name}>
				<iconify-icon icon={getIcon(type)} width="36" height="36" />
				<span>{name}</span>
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
