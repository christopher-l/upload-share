<script lang="ts">
	import { page } from '$app/stores';
	import { backTarget, title } from '$lib/stores';
	import { getPath } from '$lib/utils';
	import type { RouteParams } from './$types';

	$: path = getPath($page.params as RouteParams);
	$: backTarget.set(`/${path.split('/').slice(0, -1).join('/')}`);
</script>

<slot />
