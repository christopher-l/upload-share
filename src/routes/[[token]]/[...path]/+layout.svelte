<script lang="ts">
	import { page } from '$app/stores';
	import { backTarget, downloadTarget } from '$lib/stores';
	import { getUrlPath } from '$lib/utils';
	import type { RouteParams } from './$types';
	import type { PageData } from './$types';

	export let data: PageData;

	$: title = data.filePath.length ? data.filePath[data.filePath.length - 1] : 'Upload Share';
	$: path = getUrlPath($page.params as RouteParams);
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
</svelte:head>

<header>
	<nav>
		<div>
			{#if $backTarget}
				<a class="icon standard" href={$backTarget}>
					<iconify-icon icon="mdi:arrow-left" width="36" height="36" />
				</a>
			{/if}
		</div>
		<h1>{title}</h1>
		<div>
			{#if $downloadTarget}
				<a class="icon standard" href={$downloadTarget} download>
					<iconify-icon icon="mdi:download" width="36" height="36" />
				</a>
			{/if}
		</div>
	</nav>
</header>

<main class="container">
	<slot />
</main>

<style lang="scss">
	header {
		background-color: var(--dropdown-background-color);
		border-bottom: 1px solid var(--dropdown-border-color);
	}
	nav {
		align-items: center;
		min-height: 60px;
	}
	nav > div {
		padding: 2px;
		width: 60px;
	}
	h1 {
		margin: 0;
		font-size: 1.5em;
		padding: 0.25em;
		line-height: 1.2;
	}
	main {
		flex-grow: 1;
		padding: var(--block-spacing-vertical) var(--block-spacing-horizontal);
	}
</style>
