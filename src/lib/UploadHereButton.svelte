<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { selectDestination } from './stores';
	import { uploadFiles } from './uploadFiles';

	async function uploadHere() {
		const response = await fetch('/pwa-share-files');
		const data = await response.formData();
		const files = data.getAll('files') as File[];
		selectDestination.set(false);
		goto($page.url.pathname, { replaceState: true }); // Remove `select-destination` query parameter
		uploadFiles(files);
	}
</script>

<button class="upload-here-button" on:click={uploadHere}>
	<iconify-icon icon="ic:round-upload" width="36" height="36" />
	Upload here
</button>

<style lang="scss">
	button {
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: var(--form-element-valid-border-color);
		border-color: var(--form-element-valid-active-border-color);
	}
</style>
