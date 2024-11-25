<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import ShareUrl from '../../../../lib/ShareUrl.svelte';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	let filename = $derived(data.virtualPath[data.virtualPath.length - 1]);

	let text: string = $state('');
	$effect(() => {
		if ((browser && data.mimetype?.startsWith('text/')) || data.mimetype == null) {
			fetch(data.downloadHref!)
				.then((response) => response.text())
				.then((t) => (text = t));
		}
	});
</script>

<main class="container">
	{#if data.hasUploadToken && !$page.url.searchParams.has('select-destination')}
		<ShareUrl
			title={data.virtualPath[data.virtualPath.length - 1]}
			url={$page.url.toString().replace(/\/preview$/, '')}
		/>
	{/if}

	{#if data.mimetype?.startsWith('image/')}
		<img src={data.downloadHref} alt={filename} />
	{:else if data.mimetype?.startsWith('audio/')}
		<audio src={data.downloadHref} controls></audio>
	{:else if data.mimetype?.startsWith('video/')}
		<!-- svelte-ignore a11y_media_has_caption -->
		<video src={data.downloadHref} controls></video>
	{:else if data.mimetype?.startsWith('text/') || data.mimetype == null}
		{#if text}
			<pre>{text}</pre>
		{/if}
	{:else if data.mimetype === 'application/pdf'}
		<!-- We set height to a very large value, so the element will take up all available space -->
		<object title={filename} data={data.downloadHref} type="application/pdf" height="1000000"
		></object>
	{:else}
		<div class="fallback">
			<span>{filename}</span>
			<a href={data.downloadHref} role="button" download>Download</a>
		</div>
	{/if}
</main>

<style lang="scss">
	main {
		flex-grow: 1;
		padding: var(--pico-block-spacing-vertical) var(--pico-block-spacing-horizontal);
		min-height: 0;
		// Allow content to grow to full viewport height including space for the
		// browser UI that scrolls away on mobile devices. Subtract the header height.
		max-height: calc(100vh - 76px);
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
		padding: var(--pico-spacing);
		margin: 0;
	}
	.fallback {
		flex-grow: 1;
		justify-content: center;
		align-items: center;
		gap: var(--pico-spacing);
	}
</style>
