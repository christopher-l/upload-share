<script lang="ts">
	import FileList from '$lib/FileList.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<FileList fileList={data.fileList} />
