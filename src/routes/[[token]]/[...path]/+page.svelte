<script lang="ts">
	import { page } from '$app/stores';
	import FileList from '$lib/FileList.svelte';
	import NewButton from '$lib/NewButton.svelte';
	import ShareUrl from '$lib/ShareUrl.svelte';
	import { downloadTarget } from '$lib/stores';
	import Breadcrumbs from '../../../lib/Breadcrumbs.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	downloadTarget.set(null);
</script>

{#if data.hasUploadToken && data.filePath.length > 0}
	<ShareUrl url={$page.url.toString()} />
{/if}

<Breadcrumbs filePath={data.filePath} />

{#if data.hasUploadToken}
	<NewButton />
{/if}

<FileList fileList={data.fileList} showFileMenu={data.hasUploadToken} />
