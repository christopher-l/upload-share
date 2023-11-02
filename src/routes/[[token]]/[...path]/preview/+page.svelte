<script lang="ts">
	import { page } from '$app/stores';
	import { downloadTarget } from '$lib/stores';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import ShareUrl from '../../../../lib/ShareUrl.svelte';

	export let data: PageData;

	$: downloadTarget.set(data.downloadHref);
	$: filename = data.filePath[data.filePath.length - 1];

	let text: string;
	if (data.mimetype?.startsWith('text/')) {
		onMount(() =>
			fetch(data.downloadHref)
				.then((response) => response.text())
				.then((t) => (text = t))
		);
	}
</script>

{#if data.hasUploadToken && !$page.url.searchParams.has('select-destination')}
	<ShareUrl url={$page.url.toString().replace(/\/preview$/, '')} />
{/if}

{#if data.mimetype?.startsWith('image/')}
	<img src={data.downloadHref} alt={filename} />
{:else if data.mimetype?.startsWith('audio/')}
	<audio src={data.downloadHref} controls />
{:else if data.mimetype?.startsWith('video/')}
	<!-- svelte-ignore a11y-media-has-caption -->
	<video src={data.downloadHref} controls />
{:else if data.mimetype?.startsWith('text/')}
	{#if text}
		<pre>{text}</pre>
	{/if}
{:else if data.mimetype === 'application/pdf'}
	<object title={filename} data={data.downloadHref} type="application/pdf" />
{/if}

<style lang="scss">
	pre {
		padding: var(--spacing);
	}
	object {
		flex-grow: 1;
	}
</style>
