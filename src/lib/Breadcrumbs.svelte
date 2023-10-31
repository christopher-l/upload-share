<script lang="ts">
	export let filePath: string[];

	$: getBreadcrumbsHref = (index: number) => {
		if (index === filePath.length - 2) {
			return '.';
		} else {
			return Array(filePath.length - index - 2)
				.fill('..')
				.join('/');
		}
	};
</script>

{#if filePath.length > 0}
	<nav aria-label="breadcrumb">
		<ul>
			{#each filePath as component, i}
				{#if i < filePath.length - 1}
					<li><a href={getBreadcrumbsHref(i)}>{component}</a></li>
				{:else}
					<li>{component}</li>
				{/if}
			{/each}
		</ul>
	</nav>
{/if}