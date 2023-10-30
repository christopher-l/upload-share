<script lang="ts">
	/** The user chose to create a new folder and is currently prompted to choose a name. */
	let creatingFolder = false;
	let newFolderName = '';

	/** Prompts the user to choose a name for a new folder to create. */
	function newFolder(): void {
		creatingFolder = true;
		newFolderName = 'New Folder';
	}

	function initNewFolder(input: HTMLInputElement): void {
		input.focus;
		input.select();
	}

	$: nameIsValid = !newFolderName.includes('/');
</script>

{#if creatingFolder}
	<form method="POST" action="?/newFolder">
		<iconify-icon icon="mdi:folder" width="36" height="36" />
		<input
			name="name"
			bind:value={newFolderName}
			use:initNewFolder
			aria-invalid={nameIsValid ? undefined : true}
		/>
		{#if nameIsValid}
			<button class="secondary" disabled={!newFolderName.trim()}>Create</button>
		{/if}
	</form>
{:else}
	<details role="list">
		<summary class="outline" aria-haspopup="listbox">+</summary>
		<ul role="listbox">
			<li>
				<!-- svelte-ignore a11y-missing-attribute -->
				<!-- svelte-ignore a11y-no-static-element-interactions -->
				<a on:click={newFolder} on:keydown={newFolder}>
					<iconify-icon icon="mdi:folder" width="36" height="36" />
					New Folder
				</a>
			</li>
			<li>
				<!-- svelte-ignore a11y-missing-attribute -->
				<a>
					<iconify-icon icon="ic:round-upload" width="36" height="36" />
					Upload File
				</a>
			</li>
		</ul>
	</details>
{/if}

<style lang="scss">
	form {
		position: relative;
		margin: 0;
		[icon],
		button {
			top: var(--border-width);
			position: absolute;
			height: calc(100% - var(--spacing) - var(--border-width) * 2);
		}
		[icon] {
			padding-left: var(--spacing);
			display: flex;
			align-items: center;
		}
		input {
			padding-left: calc(var(--spacing) * 2 + 36px) !important;
			padding-right: calc(var(--form-element-spacing-horizontal) * 3 + 3.5rem);
		}
		button {
			right: var(--border-width);
			width: unset;
		}
	}
	summary {
		text-align: center;
	}
	details a {
		display: flex;
		gap: var(--spacing);
		align-items: center;
		cursor: pointer;
	}
</style>
