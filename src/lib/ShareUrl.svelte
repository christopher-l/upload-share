<script lang="ts">
	import { closeModal, showModal } from './modal';
	import QrCode from './QrCode.svelte';

	interface Props {
		title: string;
		url: string;
	}

	let { title, url }: Props = $props();
	let dialog: HTMLDialogElement | undefined = $state();

	function onClick(event: MouseEvent) {
		const target = event.target as HTMLInputElement;
		target.select();
		navigator.clipboard.writeText(target.value);
	}
</script>

<div class="container">
	<input readonly value={url} onclick={onClick} />
	<button aria-label="show qr code" class="secondary show-qr" onclick={() => showModal(dialog!)}>
		<iconify-icon icon="mdi:qrcode-scan" width="24" height="24"></iconify-icon>
	</button>
</div>
<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<dialog bind:this={dialog} onclick={(event) => event.target === dialog && closeModal(dialog)}>
	<article>
		<header>
			<strong>{title}</strong>
		</header>
		<div class="qr-container">
			<QrCode value={url} size={500} />
		</div>
		<footer>
			<button class="secondary" onclick={() => closeModal(dialog!)}>Close</button>
		</footer>
	</article>
</dialog>

<style lang="scss">
	:root:not([data-theme='dark']),
	:root[data-theme='light'] {
		--icon-clipboard: url('data:image/svg+xml,%3Csvg xmlns="http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg" width="24" height="24" viewBox="0 0 24 24"%3E%3Cg fill="none" stroke="hsl(205, 20%, 32%)" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"%3E%3Crect width="8" height="4" x="8" y="2" rx="1" ry="1"%2F%3E%3Cpath d="M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2M16 4h2a2 2 0 0 1 2 2v4m1 4H11"%2F%3E%3Cpath d="m15 10l-4 4l4 4"%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E');
	}
	@media only screen and (prefers-color-scheme: dark) {
		:root:not([data-theme]) {
			--icon-clipboard: url('data:image/svg+xml,%3Csvg xmlns="http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg" width="24" height="24" viewBox="0 0 24 24"%3E%3Cg fill="none" stroke="hsl(205, 16%, 77%)" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"%3E%3Crect width="8" height="4" x="8" y="2" rx="1" ry="1"%2F%3E%3Cpath d="M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2M16 4h2a2 2 0 0 1 2 2v4m1 4H11"%2F%3E%3Cpath d="m15 10l-4 4l4 4"%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E');
		}
	}
	.container {
		display: flex;
		flex-direction: row;
		flex-shrink: 0;
		gap: var(--pico-spacing);
		margin-bottom: var(--pico-spacing);
		padding: 0;
	}
	input {
		width: unset;
		margin: 0;
		flex-grow: 1;
		background-image: var(--icon-clipboard);
		padding-right: calc(var(--pico-form-element-spacing-horizontal) + 1.5rem) !important;
		background-position: center right 0.75rem;
		background-size: 1.3rem auto;
		background-repeat: no-repeat;
		cursor: pointer;
	}
	button.show-qr {
		display: flex;
		justify-content: center;
		align-items: center;
	}
	article {
		display: flex;
		flex-direction: column;
		width: unset;
	}
	header {
		word-break: break-word;
	}
	.qr-container {
		background-color: white;
		margin: calc(-1 * var(--pico-spacing));
		padding: var(--pico-spacing);
		min-height: 0;
		:global(img) {
			min-height: 0;
			object-fit: contain;
		}
	}
	footer {
		justify-content: flex-end;
	}
</style>
