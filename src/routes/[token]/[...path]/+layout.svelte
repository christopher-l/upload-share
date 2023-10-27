<script lang="ts">
	import { page } from '$app/stores';
	import { backTarget } from '$lib/stores';
	import { getUrlPath } from '$lib/utils';
	import type { RouteParams } from './$types';

	$: path = getUrlPath($page.params as RouteParams);
	$: backTarget.set(`/${path.split('/').slice(0, -1).join('/')}`);
</script>

<slot />
