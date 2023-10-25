<main class="container">
	<ul>
		<li>
			<iconify-icon icon="material-symbols:folder" width="36" height="36" />
			<span>Folder name</span>
			<button class="icon-button">
				<iconify-icon icon="ic:baseline-more-vert" width="36" height="36" />
			</button>
		</li>
		<li>
			<iconify-icon icon="material-symbols:folder" width="36" height="36" />
			<span>Folder name 2</span>
			<button class="icon-button">
				<iconify-icon icon="ic:baseline-more-vert" width="36" height="36" />
			</button>
		</li>
	</ul>
</main>

<style lang="scss">
	main {
		padding: var(--block-spacing-vertical) 0;
	}
	li {
		list-style: none;
		display: flex;
		align-items: center;
		padding-left: var(--spacing);
		gap: var(--spacing);
		border-radius: var(--border-radius);
		cursor: pointer;
		&:hover,
		&:focus-within {
			background-color: var(--secondary-focus);
		}
		span {
			flex-grow: 1;
		}
	}
	.icon-button {
		--color: inherit;
		display: grid;
		background: none;
		border-color: transparent;
		width: unset;
		margin: unset;
		padding: calc(var(--spacing) / 2);
		&:focus,
		&:hover {
			background-color: var(--primary-focus);
		}
	}
</style>
