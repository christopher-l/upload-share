<script lang="ts">
	import { page } from '$app/stores';
	import { downloadTarget } from '$lib/stores';
	import type { PageData } from './$types';

	export let data: PageData;

	$: {
		downloadTarget.set({
			href: $page.url.pathname.split('/').slice(0, -1).join('/') + '/download',
			filename: data.filePath[data.filePath.length - 1]
		});
	}
</script>
