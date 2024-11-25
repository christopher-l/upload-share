<script lang="ts">
	import type { Snippet } from 'svelte';
	interface Props {
		currentItemName: string;
		backTarget: string | null;
		downloadTarget: string | null;
		createArchiveTarget: string | null;
		children: Snippet;
	}

	let { currentItemName, backTarget, downloadTarget, createArchiveTarget, children }: Props =
		$props();

	let waitingForArchive = $state(false);

	async function onCreateArchive() {
		console.log('onCreateArchive', createArchiveTarget);
		if (!createArchiveTarget) return;
		waitingForArchive = true;
		try {
			const response = await fetch(createArchiveTarget, { method: 'PUT' });
			const archiveDownloadLink = await response.text();
			const linkElement = document.createElement('a');
			linkElement.setAttribute('href', archiveDownloadLink);
			linkElement.setAttribute('download', currentItemName + '.zip');
			linkElement.click();
		} finally {
			waitingForArchive = false;
		}
	}
</script>

<header>
	{#if backTarget || downloadTarget || createArchiveTarget}
		<div class="left">
			<a aria-label="back" class="icon standard" href={backTarget}>
				<iconify-icon icon="mdi:arrow-left" width="36" height="36"></iconify-icon>
			</a>
		</div>
	{/if}
	<div class="center container">
		{@render children()}
	</div>
	{#if backTarget || downloadTarget || createArchiveTarget}
		<div class="right">
			{#if createArchiveTarget}
				<button
					aria-label="download all"
					class="icon standard"
					onclick={onCreateArchive}
					aria-busy={waitingForArchive}
				>
					<iconify-icon icon="mdi:folder-download" width="36" height="36"></iconify-icon>
				</button>
			{:else}
				<a aria-label="download" class="icon standard" href={downloadTarget} download>
					<iconify-icon icon="mdi:download" width="36" height="36"></iconify-icon>
				</a>
			{/if}
		</div>
	{/if}
</header>

<style lang="scss">
	header {
		position: sticky;
		top: 0;
		z-index: 1;
		backdrop-filter: blur(10px);
		// Keep height when there are no buttons.
		box-sizing: content-box;
		min-height: calc(var(--pico-spacing) * 2 + 36px);
		flex-shrink: 0;
		background-color: var(--pico-muted-border-color);
		border-bottom: 1px solid var(--pico-form-element-border-color);
		justify-content: space-between;
		align-items: center;
		box-shadow: var(--pico-box-shadow);
	}
	.left,
	.right {
		justify-content: center;
		padding: calc(var(--pico-spacing) / 2);
	}
	.center {
		min-width: 0;
		padding: calc(var(--pico-spacing) / 2) var(--pico-spacing);
	}
	a:not([href]) {
		visibility: hidden;
	}
	button {
		border: none;
	}
	button[aria-busy='true'] {
		> *,
		&::before {
			grid-row: 1;
			grid-column: 1;
			margin: auto;
		}
		iconify-icon {
			visibility: hidden;
		}
	}
</style>
