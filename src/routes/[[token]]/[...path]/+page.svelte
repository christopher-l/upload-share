<script lang="ts">
	import FileList from '$lib/FileList.svelte';
	import { downloadTarget } from '$lib/stores';
	import type { PageData } from './$types';

	export let data: PageData;

	downloadTarget.set(null);
</script>

<FileList {...data} />
