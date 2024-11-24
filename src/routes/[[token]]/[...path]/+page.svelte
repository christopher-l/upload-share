<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import FileList from '$lib/FileList.svelte';
	import NewButton from '$lib/NewButton.svelte';
	import ShareUrl from '$lib/ShareUrl.svelte';
	import { selectDestination } from '$lib/stores';
	import { onMount } from 'svelte';
	import Breadcrumbs from '../../../lib/Breadcrumbs.svelte';
	import UploadHereButton from '../../../lib/UploadHereButton.svelte';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	onMount(() => {
		if ($page.url.searchParams.has('select-destination')) {
			selectDestination.set(true);
			goto($page.url.pathname, { replaceState: true }); // Remove `select-destination` query parameter
		}
	});
</script>

<main class="container">
	{#if data.hasUploadToken && $selectDestination}
		<UploadHereButton />
	{:else if data.hasUploadToken && data.virtualPath.length > 0}
		<ShareUrl url={$page.url.toString()} />
	{/if}

	<Breadcrumbs filePath={data.virtualPath} />

	{#if data.hasUploadToken}
		<NewButton />
	{/if}

	<FileList fileList={data.fileList} showFileMenu={data.hasUploadToken} />
</main>

<style lang="scss">
	main {
		padding: var(--pico-block-spacing-vertical) var(--pico-block-spacing-horizontal);
	}
</style>
