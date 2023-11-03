<script lang="ts">
	import { backTarget, downloadTarget } from '$lib/stores';
</script>

<header>
	<div class="left">
		<a class="icon standard" href={$backTarget}>
			<iconify-icon icon="mdi:arrow-left" width="36" height="36" />
		</a>
	</div>
	<div class="center container">
		<slot />
	</div>
	<div class="right">
		<a class="icon standard" href={$downloadTarget} download>
			<iconify-icon icon="mdi:download" width="36" height="36" />
		</a>
	</div>
</header>

<style lang="scss">
	header {
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
		padding: calc(var(--spacing) / 2) var(--spacing);
	}
	a {
		border-radius: var(--border-radius);
	}
	a:not([href]) {
		visibility: hidden;
	}
</style>
