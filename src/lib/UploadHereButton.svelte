<script lang="ts">
	import { selectDestination } from './stores';
	import { uploadFiles } from './uploadFiles';

	async function uploadHere() {
		const response = await fetch('/pwa-share-files');
		const data = await response.formData();
		const files = data.getAll('files') as File[];
		selectDestination.set(false);
		uploadFiles(files);
	}
</script>

<button class="upload-here-button" onclick={uploadHere}>
	<iconify-icon icon="ic:round-upload" width="36" height="36"></iconify-icon>
	Upload here
</button>

<style lang="scss">
	button {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: var(--pico-spacing);
		background-color: var(--pico-form-element-valid-border-color);
		border-color: var(--pico-form-element-valid-active-border-color);
	}
</style>
