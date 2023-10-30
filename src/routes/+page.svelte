<script lang="ts">
	import FileList from '$lib/FileList.svelte';
	import { backTarget, downloadTarget } from '$lib/stores';
	import type { PageData } from './$types';

	export let data: PageData;

	backTarget.set(null);
	downloadTarget.set(null);
</script>

<FileList {...data} hasUploadToken={true} />
