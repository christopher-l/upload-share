<script lang="ts">
	import { assets } from '$app/paths';
	import { page } from '$app/stores';
	import ItemNav from '$lib/ItemNav.svelte';
	import TopBar from '$lib/TopBar.svelte';
	import { backTarget, createArchiveTarget, downloadTarget } from '$lib/stores';
	import { getUrlPath } from '$lib/utils';
	import type { Snippet } from 'svelte';
	import type { PageData, RouteParams } from './$types';

	interface Props {
		data: PageData;
		children: Snippet;
	}

	let { data, children }: Props = $props();

	let title = $derived(
		data.virtualPath.length ? data.virtualPath[data.virtualPath.length - 1] : 'Upload Share'
	);
	let path = $derived(getUrlPath($page.params as RouteParams));
	$effect(() => {
		downloadTarget.set(data.downloadHref);
	});
	$effect(() => {
		createArchiveTarget.set(data.createArchiveHref);
	});
	// Don't show the back button to the root directory for users without upload token.
	$effect(() => {
		if (path.split('/').length > 1) {
			backTarget.set(`/${path.split('/').slice(0, -1).join('/')}`);
		} else if (data.hasUploadToken && path.length > 0) {
			backTarget.set('/');
		} else {
			backTarget.set(null);
		}
	});
</script>

<svelte:head>
	<title>{title}</title>
	{#if data.hasUploadToken}
		<link rel="manifest" href={`${assets}/manifest.json`} />
	{/if}
</svelte:head>

<TopBar currentItemName={title}>
	<ItemNav navLinks={data.navLinks} currentItemName={title} />
</TopBar>

{@render children()}
