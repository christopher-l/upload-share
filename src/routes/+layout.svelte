<script lang="ts">
	import 'iconify-icon';
	import '../app.scss'
</script>

<header>
	<nav>
		<div />
		<h1>foo</h1>
		<div />
	</nav>
</header>

<slot />

<style>
	header {
        background-color: var(--card-background-color);
		box-shadow: var(--card-box-shadow);
	}
	h1 {
		margin: 0;
	}
</style>
