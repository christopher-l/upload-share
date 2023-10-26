<script lang="ts">
	import { page } from '$app/stores';
	import { backTarget, title } from '$lib/stores';

	let link = $page.params.link;
	let file = $page.params.file;
	title.set(link);
	if (file) {
		backTarget.set(`/${link}`);
	} else {
		backTarget.set(`/`);
	}
</script>
