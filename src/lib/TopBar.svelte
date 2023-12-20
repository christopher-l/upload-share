<script lang="ts">
	import { backTarget, downloadTarget } from '$lib/stores';
</script>

<header>
	{#if $backTarget || $downloadTarget}
		<div class="left">
			<a class="icon standard" href={$backTarget}>
				<iconify-icon icon="mdi:arrow-left" width="36" height="36" />
			</a>
		</div>
	{/if}
	<div class="center container">
		<slot />
	</div>
	{#if $backTarget || $downloadTarget}
		<div class="right">
			<a class="icon standard" href={$downloadTarget} download>
				<iconify-icon icon="mdi:download" width="36" height="36" />
			</a>
		</div>
	{/if}
</header>

<style lang="scss">
	header {
		// Keep height when there are no buttons.
		box-sizing: content-box;
		min-height: calc(var(--spacing) * 2 + 36px);
		flex-shrink: 0;
		background-color: var(--dropdown-background-color);
		border-bottom: 1px solid var(--secondary);
		justify-content: space-between;
		align-items: center;
	}
	.left,
	.right {
		justify-content: center;
		padding: calc(var(--spacing) / 2);
	}
	.center {
		min-width: 0;
		padding: calc(var(--spacing) / 2) var(--spacing);
	}
	a:not([href]) {
		visibility: hidden;
	}
</style>
