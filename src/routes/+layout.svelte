<script lang="ts">
	import { backTarget, downloadTarget } from '$lib/stores';
	import '@picocss/pico/css/pico.min.css';
	import 'iconify-icon';
	import '../app.scss';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<header>
	<nav>
		<div>
			{#if $backTarget}
				<a class="icon standard" href={$backTarget}>
					<iconify-icon icon="mdi:arrow-left" width="36" height="36" />
				</a>
			{/if}
		</div>
		<h1>{data.filePath.length ? data.filePath.join('/') : 'HOME'}</h1>
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
		border: 1px solid var(--dropdown-border-color);
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
		padding: var(--block-spacing-vertical) 0;
	}
</style>
