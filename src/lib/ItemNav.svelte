<script lang="ts">
	import type { NavLinks } from './types';

	export let navLinks: NavLinks | null;
	export let currentItemName: string;
</script>

<nav>
	{#if navLinks}
		<a href={navLinks.previous} class="secondary" role="button">
			<iconify-icon icon="mingcute:left-fill" />
		</a>
	{/if}
	<div class="center">
		<span class="title">{currentItemName}</span>
		{#if navLinks}
			<span>({navLinks.index + 1} / {navLinks.total})</span>
		{/if}
	</div>
	{#if navLinks}
		<a href={navLinks.next} class="secondary" role="button">
			<iconify-icon icon="mingcute:right-fill" />
		</a>
	{/if}
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
		min-width: 0;
		flex-direction: row;
		white-space: nowrap;
		align-self: center;
		flex-grow: 1;
		justify-content: center;
		padding: calc(var(--spacing) / 2);
		gap: 0.3em;
	}
	.title {
		display: inline;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	a {
		display: flex;
		align-items: center;
		padding: var(--form-element-spacing-vertical) var(--form-element-spacing-horizontal);
		border-radius: 0;
	}
</style>
