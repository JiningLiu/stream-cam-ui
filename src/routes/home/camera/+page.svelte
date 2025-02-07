<script lang="ts">
	import { onMount } from 'svelte';
	import 'material-symbols';

	let protocol: string | undefined;
	let hostname: string | undefined;

	let camIsOn = false;
	let micIsOn = false;

	let viewWithMic = true;

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
			camera.src = `${protocol}//${hostname}:8889/cam${viewWithMic ? '_with_audio' : ''}`;
		}
	}

	function viewWithMicToggle() {
		viewWithMic = !viewWithMic;
	}

	function copyUrl() {
		const camera = document.getElementById('camera') as HTMLIFrameElement;
		if (camera) {
			navigator.clipboard.writeText(camera.src);
		}
	}
</script>

<main>
	<!-- camera controls -->
	<div id="controls">
		<div id="status-btns">
			<button id="on" on:click={on} class:selected={camIsOn}>
				<span class="material-symbols-rounded">toggle_on</span>&nbsp;On</button
			>

			<button id="off" on:click={off} class:selected={!camIsOn}
				><span class="material-symbols-rounded">toggle_off</span>&nbsp;Off</button
			>
		</div>

		<div id="view-btns">
			<button id="reload" on:click={reload}
				><span class="material-symbols-rounded">frame_reload</span>&nbsp;Reload</button
			>

			<button id="view-with-mic" on:click={viewWithMicToggle} class:selected={viewWithMic}>
				<span class="material-symbols-rounded">mic{viewWithMic ? '' : '_off'}</span
				>&nbsp;Mic</button
			>

			<button id="copy-url" on:click={copyUrl}
				><span class="material-symbols-rounded">link</span>&nbsp;Copy</button
			>
		</div>
	</div>

	<!-- camera view -->
	<div id="cam-container">
		{#if protocol && hostname}
			<iframe
				id="camera"
				title="camera"
				src="{protocol}//{hostname}:8889/cam{viewWithMic ? '_with_audio' : ''}"
				frameborder="0"
			></iframe>
		{/if}
	</div>
</main>

<style>
	:global(:root) {
		background: transparent;
	}

	main {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 100%;
		padding: 0.4rem;
	}

	#controls {
		display: flex;
		flex-direction: column;
		width: 100%;
		gap: 0.4rem;

		div {
			display: grid;
			gap: 0.4rem;

			button:hover,
			.selected {
				color: #fff;
			}

			button {
				color: var(--primary-color);
				display: flex;
				flex-direction: row;
				justify-content: center;
				align-items: center;
				font-size: 1rem;
				font-weight: 600;
				padding: 0.4rem 0.6rem;
				background: var(--bg-color-3);
				border-radius: 0.4rem;
				border: none;
				transition-property: color background;
				transition: 0.2s;
			}
		}

		#status-btns {
			grid-template-columns: 1fr auto;

			#on.selected {
				background: #33aa44dd;
			}

			#on:hover {
				background: #33aa44ff;
			}

			#off.selected {
				background: #bb4422dd;
			}

			#off:hover {
				background: #bb4422ff;
			}
		}

		#view-btns {
			grid-template-columns: 1fr 1fr auto;

			#reload:hover {
				background: #3355cc;
			}

			#view-with-mic.selected {
				background: #dd8822dd;
			}

			#view-with-mic:hover {
				background: #dd8822ff;
			}

			#copy-url:hover {
				background: var(--bg-color-4);
			}
		}
	}

	#cam-container {
		margin: 0;
		position: relative;
		width: 100%;
		height: 100%;
		border-radius: 0.4rem;

		#camera {
			width: 100%;
			height: 100%;
			border-radius: 0.4rem;
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
		height: 100%;
		z-index: -1;
		background: var(--bg-color-3);
		border-radius: 0.4rem;
	}
</style>
