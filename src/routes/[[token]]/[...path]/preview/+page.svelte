<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import ShareUrl from '../../../../lib/ShareUrl.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	$: filename = data.virtalPath[data.virtalPath.length - 1];

	let text: string;
	$: if ((browser && data.mimetype?.startsWith('text/')) || data.mimetype == null) {
		fetch(data.downloadHref!)
			.then((response) => response.text())
			.then((t) => (text = t));
	}
</script>

<main class="container">
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
	{:else if data.mimetype?.startsWith('text/') || data.mimetype == null}
		{#if text}
			<pre>{text}</pre>
		{/if}
	{:else if data.mimetype === 'application/pdf'}
		<!-- We set height to a very large value, so the element will take up all available space -->
		<object title={filename} data={data.downloadHref} type="application/pdf" height="1000000" />
	{/if}
</main>

<style lang="scss">
	main {
		padding: var(--block-spacing-vertical) var(--block-spacing-horizontal);
		min-height: 0;
	}
	img {
		min-height: 0;
		object-fit: scale-down;
	}
	audio {
		width: 100%;
	}
	video {
		min-height: 0;
	}
	pre {
		padding: var(--spacing);
		margin: 0;
	}
</style>
