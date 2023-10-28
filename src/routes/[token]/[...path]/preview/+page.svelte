<script lang="ts">
	import { page } from '$app/stores';
	import { downloadTarget } from '$lib/stores';
	import type { PageData } from './$types';

	export let data: PageData;

	$: downloadTarget.set(data.downloadHref);
</script>

<img src={data.downloadHref} />
