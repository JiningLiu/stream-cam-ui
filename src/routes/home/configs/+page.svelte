<script lang="ts">
	import 'material-symbols';
	import { CameraSettings } from '$lib/CameraSettings';
	import { onMount } from 'svelte';

	let protocol: string | undefined;
	let hostname: string | undefined;

	let allSettings = [] as CameraSettings[];
	let editingSettings = new CameraSettings();

	let settingsSelection: string;

	onMount(async () => {
		protocol = location.protocol;
		hostname = location.hostname;

		try {
			const allRes = await fetch(`${protocol}//${hostname}:20240/camera/settings/all`, {
				method: 'GET'
			});
			const settings = Array.from(await allRes.json()) as CameraSettings[];
			allSettings = settings;

			const currentRes = await fetch(`${protocol}//${hostname}:20240/camera/settings/current`, {
				method: 'GET'
			});
			const currentSettings = (await currentRes.json()) as CameraSettings;
			editingSettings = currentSettings;
			settingsSelection = editingSettings.id;
			changeEditingSettings();
		} catch {}
	});

	const changesMade = () => {
		const found = allSettings.find((setting) => setting.id === editingSettings.id);
		if (!found) return false;
		return JSON.stringify(editingSettings) != JSON.stringify(found);
	};

	function changeEditingSettings() {
		if (settingsSelection === 'new') {
			editingSettings = new CameraSettings();
			allSettings.push(JSON.parse(JSON.stringify(editingSettings)));
			settingsSelection = editingSettings.id;

			fetch(`${protocol}//${hostname}:20240/camera/settings/add`, {
				method: 'POST',
				body: JSON.stringify(editingSettings)
			});
			return;
		}

		if (settingsSelection === 'delete') {
			const id = editingSettings.id;
			allSettings = allSettings.filter((setting) => setting.id !== id);
			settingsSelection = 'none';
			editingSettings = new CameraSettings();

			fetch(`${protocol}//${hostname}:20240/camera/settings/delete`, {
				method: 'DELETE',
				body: id
			});
			return;
		}

		if (changesMade()) {
			if (
				!confirm('You have unsaved changes for the current configuration. Discard these changes?')
			) {
				(document.getElementById('config-select') as HTMLSelectElement).value = editingSettings.id;
				return;
			}
		}

		const selectedSettings = allSettings.find((setting) => setting.id === settingsSelection);
		if (selectedSettings) {
			editingSettings = JSON.parse(JSON.stringify(selectedSettings));
		}
	}

	function saveSettings() {
		allSettings = allSettings.map((setting) => {
			if (setting.id === editingSettings.id) {
				return JSON.parse(JSON.stringify(editingSettings));
			}
			return setting;
		});

		fetch(`${protocol}//${hostname}:20240/camera/settings/update`, {
			method: 'PUT',
			body: JSON.stringify(editingSettings)
		});
	}

	async function applySettings() {
		const statusRes = await fetch(`${protocol}//${hostname}:20240/camera/status`, {
			method: 'GET'
		});
		const statusJson: { mediamtx: boolean; audiosource: boolean } = await statusRes.json();
		const originallyOn = statusJson.mediamtx;

		await fetch(`${protocol}//${hostname}:20240/camera/off`, { method: 'POST' });
		await fetch(`${protocol}//${hostname}:20240/camera/settings/set`, {
			method: 'POST',
			body: settingsSelection
		});

		if (originallyOn) {
			await fetch(`${protocol}//${hostname}:20240/camera/on`, { method: 'POST' });
		}
	}
</script>

<main>
	<h2 id="heading">Configurations</h2>

	<div class="hstack vcenter g04">
		<select
			name="config-select"
			id="config-select"
			bind:value={settingsSelection}
			on:change={changeEditingSettings}
		>
			<option value="none" disabled selected hidden> Select a configuration... </option>

			{#each allSettings as setting}
				<option value={setting.id} selected={setting.id === editingSettings.id}>
					{setting.name}{changesMade() && setting.id === editingSettings.id ? '*' : ''}
				</option>
			{/each}

			<optgroup label="Actions">
				<option value="new">New...</option>
				<option value="delete">Delete</option>
			</optgroup>
		</select>

		{#if settingsSelection !== 'none'}
			{#if changesMade()}
				<button id="save-btn" on:click={saveSettings}>Save</button>
			{:else}
				<button id="apply-btn" on:click={applySettings}>Apply</button>
			{/if}
		{/if}
	</div>

	{#if settingsSelection !== 'none'}
		<div id="configs">
			<div class="hstack vcenter space-between w100">
				<p>Name</p>
				<input type="text" name="configName" id="configName" bind:value={editingSettings.name} />
			</div>

			<div class="hstack vcenter space-between w100">
				<p>Camera Port ID</p>
				<input
					type="number"
					min="0"
					name="camId"
					id="camId"
					bind:value={editingSettings.camId}
					on:keydown={(event) => {
						if (
							event.key === 'Backspace' ||
							event.key === 'ArrowLeft' ||
							event.key === 'ArrowRight' ||
							event.key === 'ArrowUp' ||
							event.key === 'ArrowDown' ||
							event.key === 'Tab'
						)
							return;
						if (event.key < '0' || event.key > '9') {
							event.preventDefault();
						}
					}}
				/>
			</div>

			<div class="hstack vcenter space-between w100">
				<p>Flip Horizontally</p>
				<label class="switch">
					<input type="checkbox" bind:checked={editingSettings.hFlip} />
					<span class="slider round"></span>
				</label>
			</div>

			<div class="hstack vcenter space-between w100">
				<p>Flip Vertically</p>
				<label class="switch">
					<input type="checkbox" bind:checked={editingSettings.vFlip} />
					<span class="slider round"></span>
				</label>
			</div>

			<div class="hstack vcenter space-between w100">
				<p>HDR</p>
				<label class="switch">
					<input type="checkbox" bind:checked={editingSettings.hdr} />
					<span class="slider round"></span>
				</label>
			</div>

			<div class="hstack vcenter space-between w100">
				<p>Text Overlay</p>
				<label class="switch">
					<input type="checkbox" bind:checked={editingSettings.textOverlayEnable} />
					<span class="slider round"></span>
				</label>
			</div>
		</div>
	{/if}
</main>

<style>
	:global(:root) {
		background: transparent;
	}

	main {
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 0.4rem;
		width: 100%;
		height: 100%;
		padding: 0.4rem;
	}

	#config-select {
		width: 100%;
		padding: 0.2rem;
		color: var(--primary-color);
		font-family: Inter, sans-serif;
		font-size: 1rem;
		font-weight: 600;
		font-feature-settings:
			'calt' 0,
			'case' 0;
		background: var(--bg-color-3);
		border: none;
		border-radius: 0.4rem;
		transition: background 0.2s;
	}

	#config-select:hover {
		background: var(--bg-color-4);
	}

	button {
		color: white;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		font-size: 0.9rem;
		font-weight: 600;
		height: 100%;
		padding: 0.3rem 0.5rem;
		border-radius: 0.4rem;
		border: none;
		cursor: pointer;
		transition-property: color background;
		transition: 0.2s;
	}

	#save-btn {
		background: #1177ccdd;
	}

	#save-btn:hover {
		background: #1177cc;
	}

	#apply-btn {
		background: #bb4422dd;
	}

	#apply-btn:hover {
		background: #bb4422;
	}

	#configs {
		display: flex;
		flex-direction: column;
		gap: 0.55rem;
		div {
			position: relative;
		}

		div::after {
			content: '';
			position: absolute;
			width: 95%;
			height: 0.05rem;
			right: 0;
			bottom: -0.3rem;
			background: var(--bg-color-3);
		}

		input[type='number'],
		input[type='text'] {
			padding: 0.2rem 0.4rem;
			border: none;
			border-radius: 0.2rem;
			background: var(--bg-color-3);
			color: var(--primary-color);
			font-size: 1rem;
			font-weight: 600;
		}

		input[type='number'] {
			width: 3rem;
			text-align: center;
		}
	}
</style>
