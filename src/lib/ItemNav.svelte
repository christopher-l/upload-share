<script lang="ts">
	import type { NavLinks } from './types';

	export let navLinks: NavLinks | null;
	export let currentItemName: string;
</script>

<nav>
	{#if navLinks}
		<a href={navLinks.previous} aria-label="previous item" class="secondary" role="button">
			<iconify-icon icon="mingcute:left-fill"></iconify-icon>
		</a>
	{/if}
	<div class="center">
		<span class="title">{currentItemName}</span>
		{#if navLinks}
			<span>({navLinks.index + 1} / {navLinks.total})</span>
		{/if}
	</div>
	{#if navLinks}
		<a href={navLinks.next} aria-label="next item" class="secondary" role="button">
			<iconify-icon icon="mingcute:right-fill"></iconify-icon>
		</a>
	{/if}
</nav>

<style lang="scss">
	nav {
		display: flex;
		background-color: var(--pico-card-sectioning-background-color);
		border: var(--pico-border-width) solid var(--pico-form-element-border-color);
		border-radius: var(--pico-border-radius);
		overflow: hidden;
	}
	.center {
		min-width: 0;
		flex-direction: row;
		white-space: nowrap;
		align-self: center;
		flex-grow: 1;
		justify-content: center;
		padding: calc(var(--pico-spacing) / 2);
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
		padding: var(--pico-form-element-spacing-vertical) var(--pico-form-element-spacing-horizontal);
		border-radius: 0;
		&:not([href]) {
			opacity: 0.5;
			pointer-events: none;
		}
	}
</style>
