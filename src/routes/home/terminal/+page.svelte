<script lang="ts">
	import { onMount } from 'svelte';

	let protocol: string | undefined;
	let hostname: string | undefined;

	onMount(() => {
		protocol = location.protocol;
		hostname = location.hostname;
	});
</script>

<main>
	<iframe
		src="{protocol}//{hostname}:2222/ssh/host/{hostname}"
		frameborder="0"
		title="SSH Terminal - {hostname}"
	></iframe>
</main>

<style>
	:global(:root) {
		overflow: hidden;
	}

	main {
		width: 100%;
		height: 100%;
	}

	iframe {
		width: 100%;
		height: 100%;
	}
</style>
