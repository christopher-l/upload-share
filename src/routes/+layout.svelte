<script lang="ts">
	import 'iconify-icon';
	import '../app.scss';
	import { title } from '$lib/stores';
</script>

<header>
	<nav>
		<div />
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
	h1 {
		margin: 0;
	}
	main {
		padding: var(--block-spacing-vertical) 0;
	}
</style>
