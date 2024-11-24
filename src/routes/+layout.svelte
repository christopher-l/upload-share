<script lang="ts">
	import { getMediaQueryStore } from '$lib/mediaQueryStore';
	import '@picocss/pico/css/pico.min.css';
	import 'iconify-icon';
	import type { Snippet } from 'svelte';
	import '../app.scss';

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();

	const prefersDarkMode = getMediaQueryStore('(prefers-color-scheme:dark)');
</script>

<svelte:head>
	{#if $prefersDarkMode}
		<meta name="theme-color" content="#202632" />
	{:else}
		<meta name="theme-color" content="#e7eaf0" />
	{/if}
</svelte:head>

{@render children()}
