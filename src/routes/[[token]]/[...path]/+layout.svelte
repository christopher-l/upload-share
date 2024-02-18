<script lang="ts">
	import { assets } from '$app/paths';
	import { page } from '$app/stores';
	import ItemNav from '$lib/ItemNav.svelte';
	import TopBar from '$lib/TopBar.svelte';
	import { backTarget, downloadTarget, createArchiveTarget } from '$lib/stores';
	import { getUrlPath } from '$lib/utils';
	import type { PageData, RouteParams } from './$types';

	export let data: PageData;

	$: title = data.virtualPath.length
		? data.virtualPath[data.virtualPath.length - 1]
		: 'Upload Share';
	$: path = getUrlPath($page.params as RouteParams);
	$: downloadTarget.set(data.downloadHref);
	$: createArchiveTarget.set(data.createArchiveHref);
	// Don't show the back button to the root directory for users without upload token.
	$: if (path.split('/').length > 1) {
		backTarget.set(`/${path.split('/').slice(0, -1).join('/')}`);
	} else if (data.hasUploadToken && path.length > 0) {
		backTarget.set('/');
	} else {
		backTarget.set(null);
	}
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

<slot />
