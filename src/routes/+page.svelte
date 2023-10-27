<script lang="ts">
	import FileList from '$lib/FileList.svelte';
	import { backTarget } from '$lib/stores';
	import type { PageData } from './$types';

	export let data: PageData;

	backTarget.set(null);
</script>

<FileList fileList={data.fileList} />
<!-- <pre>{JSON.stringify(data.fileList, null, 2)}</pre> -->
