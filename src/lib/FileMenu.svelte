<script lang="ts">
	import { enhance } from '$app/forms';
	import type { FileListEntry } from './types';

	interface Props {
		file: FileListEntry;
	}

	let { file }: Props = $props();

	let details: HTMLDetailsElement | undefined = $state();
	let dialog: HTMLDialogElement | undefined = $state();
	let deleting = $state(false);

	function confirmDelete(): void {
		dialog?.showModal();
		details?.removeAttribute('open');
	}
</script>

<details class="dropdown" bind:this={details}>
	<!-- svelte-ignore a11y_no_redundant_roles -->
	<summary class="icon standard" role="button">
		<iconify-icon icon="mdi:dots-vertical" width="36" height="36"></iconify-icon>
	</summary>
	<ul dir="rtl">
		<li>
			<!-- svelte-ignore a11y_missing_attribute -->
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<a class="danger" onclick={confirmDelete}>
				<iconify-icon icon="mdi:delete" width="36" height="36"></iconify-icon>
				Delete
			</a>
		</li>
	</ul>
</details>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<dialog bind:this={dialog} onclick={(event) => event.target === dialog && dialog?.close()}>
	<article>
		<header>
			<strong>Delete {file.name}</strong>
		</header>
		<p>
			{#if file.type === 'inode/directory'}
				Delete {file.name} and all its contents?
			{:else}
				Delete {file.name}?
			{/if}
		</p>
		<footer>
			<!-- svelte-ignore a11y_invalid_attribute -->
			<button class="secondary" disabled={deleting} onclick={() => dialog?.close()}>Cancel</button>
			<form
				method="POST"
				action="?/delete"
				use:enhance={() => {
					deleting = true;
				}}
			>
				<input hidden name="name" value={file.name} />
				{#if file.token}
					<input hidden name="token" value={file.token} />
				{/if}
				<button class="danger" disabled={deleting}>Delete</button>
			</form>
		</footer>
	</article>
</dialog>

<style lang="scss">
	details.dropdown {
		align-self: center;
		margin: 0;
		summary {
			&::after {
				content: unset;
			}
		}
		ul {
			left: unset;
			width: unset;
		}
		a {
			cursor: pointer;
			display: flex;
			align-items: center;
			gap: var(--pico-spacing);
			&.danger {
				color: var(--pico-del-color);
			}
		}
	}
	dialog {
		article {
			min-width: min(90vw, 600px);
		}
		footer {
			justify-content: flex-end;
			gap: var(--pico-spacing);
		}
		form {
			margin: 0;
		}
		button {
			display: inline-flex;
			width: unset;
			margin: unset;
		}
		button.danger {
			background-color: var(--pico-del-color);
			color: var(--pico-primary-inverse);
			border-color: var(--pico-form-element-invalid-active-border-color);
		}
	}
</style>
