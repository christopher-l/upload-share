<script lang="ts">
	import { page } from '$app/stores';
	import { backTarget } from '$lib/stores';
	import { getUrlPath } from '$lib/utils';
	import type { RouteParams } from './$types';
	import type { PageData } from './$types';

	export let data: PageData;

	$: path = getUrlPath($page.params as RouteParams);
	// Don't show the back button to the root directory for users without upload token.
	$: if (data.hasUploadToken || path.split('/').length > 1) {
		backTarget.set(`/${path.split('/').slice(0, -1).join('/')}`);
	} else {
		backTarget.set(null);
	}
</script>

<slot />
