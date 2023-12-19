<script lang="ts">
	import type { NavLinks } from './types';

	export let navLinks: NavLinks | null;
	export let currentItemName: string;
</script>

<nav>
	<a href={navLinks?.previous} class="secondary {navLinks ? '' : 'hidden'}" role="button">
		<iconify-icon icon="mingcute:left-fill" />
	</a>
	<div class="center">
		<span class="title">{currentItemName}</span>
		{#if navLinks}
			<span>({navLinks.index + 1} / {navLinks.total})</span>
		{/if}
	</div>
	<a href={navLinks?.next} class="secondary {navLinks ? '' : 'hidden'}" role="button">
		<iconify-icon icon="mingcute:right-fill" />
	</a>
</nav>

<style lang="scss">
	nav {
		display: flex;
		background-color: var(--card-sectionning-background-color);
		border: var(--border-width) solid var(--secondary);
		border-radius: var(--border-radius);
		overflow: hidden;
	}
	.center {
		display: block;
		align-self: center;
		flex-grow: 1;
		text-align: center;
		padding: calc(var(--spacing) / 2);
	}
	.title {
		overflow-wrap: anywhere;
	}
	a {
		display: flex;
		align-items: center;
		padding: var(--form-element-spacing-vertical) var(--form-element-spacing-horizontal);
		border-radius: 0;
	}
	// Keep taking up vertical space
	a.hidden {
		opacity: 0;
		overflow: hidden;
		width: 0;
	}
</style>
