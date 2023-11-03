<script lang="ts">
	export let navLinks: { next: string | null; previous: string | null } | null;
	export let currentItemName: string;
</script>

<nav>
	{#if navLinks?.previous}
		<a href={navLinks.previous} class="secondary">
			<iconify-icon icon="mingcute:left-fill" />
		</a>
	{:else}
		<button class="secondary {navLinks ? '' : 'hidden'}" disabled >
			<iconify-icon icon="mingcute:left-fill" />
		</button>
	{/if}
	<div class="center">{currentItemName}</div>
	{#if navLinks?.next}
		<a href={navLinks.next} class="secondary">
			<iconify-icon icon="mingcute:right-fill" />
		</a>
	{:else}
		<button class="secondary {navLinks ? '' : 'hidden'}" disabled>
			<iconify-icon icon="mingcute:right-fill" />
		</button>
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
		align-self: center;
		flex-grow: 1;
		text-align: center;
		overflow-wrap: anywhere;
	}
	a,
	button {
		display: flex;
		align-items: center;
		width: unset;
		margin: 0;
		padding: var(--form-element-spacing-vertical) var(--form-element-spacing-horizontal);
		color: var(--secondary-inverse);
		background-color: var(--secondary);
		border-radius: 0;
	}
	// Keep taking up vertical space
	.hidden {
		opacity: 0;
		overflow: hidden;
		width: 0;
	}
</style>
