<script lang="ts">
	import { page } from '$app/stores';
	import FileList from '$lib/FileList.svelte';
	import { title } from '$lib/stores';
	import type { PageData } from './$types';

	export let data: PageData;

	let link = $page.params.link;
	title.set(link);
</script>

<FileList fileList={data.fileList} />
