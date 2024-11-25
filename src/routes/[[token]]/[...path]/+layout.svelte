<script lang="ts">
	import { assets } from '$app/paths';
	import { page } from '$app/stores';
	import ItemNav from '$lib/ItemNav.svelte';
	import TopBar from '$lib/TopBar.svelte';
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
	/**
	 * The href of the back button in the top nav bar. When null, the button
	 * will be hidden.
	 */
	let backTarget = $derived.by(() => {
		// Don't show the back button to the root directory for users without upload token.
		if (path.split('/').length > 1) {
			return `/${path.split('/').slice(0, -1).join('/')}`;
		} else if (data.hasUploadToken && path.length > 0) {
			return '/';
		} else {
			return null;
		}
	});
	/**
	 * The href of the download button in the top nav bar. When null, the button
	 * will be hidden.
	 */
	let downloadTarget = $derived(data.downloadHref);
	/**
	 * The href of the download button in the top nav bar for folders. The href
	 * is a link to an endpoint that creates the archive when called and returns
	 * the archive's download link.
	 */
	let createArchiveTarget = $derived(data.createArchiveHref);
</script>

<svelte:head>
	<title>{title}</title>
	{#if data.hasUploadToken}
		<link rel="manifest" href={`${assets}/manifest.json`} />
	{/if}
</svelte:head>

<TopBar currentItemName={title} {backTarget} {downloadTarget} {createArchiveTarget}>
	<ItemNav navLinks={data.navLinks} currentItemName={title} />
</TopBar>

{@render children()}
