<script lang="ts">
	import { onMount } from 'svelte';

	let protocol = 'http:';
	let hostname = 'rpi.local';

	let camIsOn = false;
	let micIsOn = false;

	onMount(() => {
		protocol = location.protocol;
		hostname = location.hostname;
	});

	function on() {
		fetch(`${protocol}//${hostname}:20240/camera/on`, { method: 'POST' })
			.then((res) => res.json())
			.then((json: { mediamtx: boolean; audiosource: boolean }) => {
				console.log(json);
				camIsOn = json.mediamtx;
				micIsOn = json.audiosource;
			});
	}

	function off() {
		fetch(`${protocol}//${hostname}:20240/camera/off`, { method: 'POST' })
			.then((res) => res.json())
			.then((json: { mediamtx: boolean; audiosource: boolean }) => {
				console.log(json);
				camIsOn = json.mediamtx;
				micIsOn = json.audiosource;
			});
	}
	function reload() {
		const camera = document.getElementById('camera') as HTMLIFrameElement;
		if (camera) {
			camera.src = `${protocol}//${hostname}:8889/cam_with_audio`;
		}
	}
</script>

<main>
	<!-- camera view -->
	<div id="cam-container">
		<iframe
			id="camera"
			title="camera"
			src="{protocol}//{hostname}:8889/cam_with_audio"
			frameborder="0"
		></iframe>
	</div>

	<!-- camera controls -->
	<div id="controls">
		<p>cam is on: {camIsOn}</p>
		<p>mic is on: {micIsOn}</p>
		<br />
		<button on:click={on}>On</button>
		<button on:click={off}>Off</button>
		<button on:click={reload}>Reload</button>
	</div>
</main>

<style>
	:global(:root) {
		background: transparent;
	}

	main {
		display: grid;
		gap: 0.6rem;
		grid-template-columns: 1fr 1fr;
		grid-template-rows: auto 1fr;
		width: calc(100% - 0.8rem);
		height: calc(100% - 0.8rem);
		padding: 0.4rem;

		@media (max-width: 48rem) {
			grid-template-rows: auto auto 1fr;
		}
	}

	#cam-container {
		grid-row: 1;
		grid-column: 1;
		position: relative;
		width: 100%;
		aspect-ratio: 16 / 9;
		border-radius: 0.2rem;

		@media (max-width: 48rem) {
			grid-column: 1 / 3;
		}

		#camera {
			width: 100%;
			height: 100%;
			border-radius: 0.2rem;
		}
	}

	#cam-container::before {
		content: 'Loading...';
		position: absolute;
		display: flex;
		justify-content: center;
		align-items: center;
		top: 0%;
		left: 0%;
		width: 100%;
		aspect-ratio: 16 / 9;
		z-index: -1;
		background: var(--bg-color-3);
		border-radius: 0.2rem;
	}

	#controls {
		grid-row: 1;
		grid-column: 2;
		position: relative;

		@media (max-width: 48rem) {
			grid-row: 2;
			grid-column: 1 / 3;
		}
	}
</style>
