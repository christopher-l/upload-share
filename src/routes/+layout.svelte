<script lang="ts">
	import { backTarget, title } from '$lib/stores';
	import 'iconify-icon';
	import '../app.scss';
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
		<h1>{$title}</h1>
		<div />
	</nav>
</header>

<main class="container">
	<slot />
</main>

<style lang="scss">
	header {
		background-color: var(--card-background-color);
		box-shadow: var(--card-box-shadow);
	}
	nav > div {
		padding: 2px;
		width: 60px;
	}
	h1 {
		margin: 0;
	}
	main {
		padding: var(--block-spacing-vertical) 0;
	}
</style>
