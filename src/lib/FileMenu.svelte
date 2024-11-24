<script lang="ts">
	import { enhance } from '$app/forms';
	import type { FileListEntry } from './types';

	export let file: FileListEntry;

	let details: HTMLDetailsElement;
	let dialog: HTMLDialogElement;
	let deleting = false;

	function confirmDelete(): void {
		dialog.showModal();
		details.removeAttribute('open');
	}
</script>

<details class="dropdown" bind:this={details}>
	<!-- svelte-ignore a11y-no-redundant-roles -->
	<summary class="icon standard" role="button">
		<iconify-icon icon="mdi:dots-vertical" width="36" height="36"></iconify-icon>
	</summary>
	<ul dir="rtl">
		<li>
			<!-- svelte-ignore a11y-missing-attribute -->
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<a class="danger" on:click={confirmDelete}>
				<iconify-icon icon="mdi:delete" width="36" height="36"></iconify-icon>
				Delete
			</a>
		</li>
	</ul>
</details>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<dialog bind:this={dialog} on:click|self={() => dialog.close()}>
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
			<!-- svelte-ignore a11y-invalid-attribute -->
			<button class="secondary" disabled={deleting} on:click={() => dialog.close()}>Cancel</button>
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
