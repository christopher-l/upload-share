<script lang="ts">
	import { getMediaQueryStore } from '$lib/mediaQueryStore';
	import '@picocss/pico/css/pico.min.css';
	import 'iconify-icon';
	import '../app.scss';

	const prefersDarkMode = getMediaQueryStore('(prefers-color-scheme:dark)');
</script>

<svelte:head>
	{#if $prefersDarkMode}
		<meta name="theme-color" content="#1b2832" />
	{:else}
		<meta name="theme-color" content="#fbfbfc" />
	{/if}
</svelte:head>

<slot />
