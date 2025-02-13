<script lang="ts">
	import 'material-symbols';
	import { AFRange, AFSpeed, CameraSettings, Codec, Denoise, Exposure, FocusMode, Metering, SensorMode, WhiteBalance } from '$lib/CameraSettings';
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

		if (settingsSelection === 'duplicate') {
			const newSettings = JSON.parse(JSON.stringify(editingSettings));
			newSettings.id = new CameraSettings().id;
			newSettings.name += ' (Copy)';
			editingSettings = newSettings;
			allSettings.push(JSON.parse(JSON.stringify(editingSettings)));
			settingsSelection = newSettings.id;

			fetch(`${protocol}//${hostname}:20240/camera/settings/add`, {
				method: 'POST',
				body: JSON.stringify(newSettings)
			});
			return;
		}

		if (settingsSelection === 'delete') {
			const id = editingSettings.id;
			allSettings = allSettings.filter((setting) => setting.id !== id);
			const select = allSettings[0];
			settingsSelection = select?.id ?? 'none';
			editingSettings = select ? JSON.parse(JSON.stringify(select)) : new CameraSettings();

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
				{#if settingsSelection !== 'none'}
					<option value="duplicate">Duplicate</option>
					<option value="delete">Delete</option>
				{/if}
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
					inputmode="numeric"
					pattern="\d*"
					min="0"
					name="camId"
					id="camId"
					class="small"
					bind:value={editingSettings.camId}
				/>
			</div>

			<div class="hstack vcenter space-between w100">
				<p>Frame Width</p>
				<input
					type="number"
					inputmode="numeric"
					pattern="\d*"
					min="0"
					max="1920"
					name="width"
					id="width"
					bind:value={editingSettings.width}
				/>
			</div>

			<div class="hstack vcenter space-between w100">
				<p>Frame Height</p>
				<input
					type="number"
					inputmode="numeric"
					pattern="\d*"
					min="0"
					max="1080"
					name="height"
					id="height"
					bind:value={editingSettings.height}
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
				<p>Brightness</p>
				<input
					type="number"
					inputmode="numeric"
					pattern="\d*"
					min="-1"
					max="1"
					name="brightness"
					id="brightness"
					class="small"
					bind:value={editingSettings.brightness}
				/>
			</div>

			<div class="hstack vcenter space-between w100">
				<p>Contrast</p>
				<input
					type="number"
					inputmode="numeric"
					pattern="\d*"
					min="0"
					max="16"
					name="contrast"
					id="contrast"
					class="small"
					bind:value={editingSettings.contrast}
				/>
			</div>

			<div class="hstack vcenter space-between w100">
				<p>Saturation</p>
				<input
					type="number"
					inputmode="numeric"
					pattern="\d*"
					min="0"
					max="16"
					name="saturation"
					id="saturation"
					class="small"
					bind:value={editingSettings.saturation}
				/>
			</div>

			<div class="hstack vcenter space-between w100">
				<p>Sharpness</p>
				<input
					type="number"
					inputmode="numeric"
					pattern="\d*"
					min="0"
					max="16"
					name="sharpness"
					id="sharpness"
					class="small"
					bind:value={editingSettings.sharpness}
				/>
			</div>

			<div class="hstack vcenter space-between w100">
				<p>Exposure Mode</p>
				<select
					name="exposure"
					id="exposure"
					bind:value={editingSettings.exposure}
				>
					{#each Object.values(Exposure) as mode}
						<option value={mode} selected={mode === editingSettings.exposure}>{mode}</option>
					{/each}
				</select>
			</div>

			<div class="hstack vcenter space-between w100">
				<p>White Balance</p>
				<select
					name="whiteBalance"
					id="whiteBalance"
					bind:value={editingSettings.whiteBalance}
				>
					{#each Object.values(WhiteBalance) as mode}
						<option value={mode} selected={mode === editingSettings.whiteBalance}>{mode}</option>
					{/each}
				</select>
			</div>

			<div class="hstack vcenter space-between w100">
				<p>AWB Gains</p>

				<div class="hstack vcenter g04">
					<p>Blue</p>
					<input
						type="number"
						inputmode="numeric"
						pattern="\d*"
						min="-1"
						max="1"
						name="awbGainsBlue"
						id="awbGainsBlue"
						class="small"
						bind:value={editingSettings.awbGains.blue}
					/>
					<p>&nbsp;Red</p>
					<input
						type="number"
						inputmode="numeric"
						pattern="\d*"
						min="-1"
						max="1"
						name="awbGainsRed"
						id="awbGainsRed"
						class="small"
						bind:value={editingSettings.awbGains.red}
					/>
				</div>
			</div>

			<div class="hstack vcenter space-between w100">
				<p>Denoise</p>
				<select
					name="denoise"
					id="denoise"
					bind:value={editingSettings.denoise}
				>
					{#each Object.values(Denoise) as mode}
						<option value={mode} selected={mode === editingSettings.denoise}>{mode}</option>
					{/each}
				</select>
			</div>

			<div class="hstack vcenter space-between w100">
				<p>Shutter Speed</p>
				<div class="hstack vcenter">
					<input
						type="number"
						inputmode="numeric"
						pattern="\d*"
						min="0"
						max="1000000"
						name="sharpness"
						id="sharpness"
						bind:value={editingSettings.shutterSpeed}
					/>
					<p>&nbsp;µs</p>
				</div>
			</div>

			<div class="hstack vcenter space-between w100">
				<p>Metering Mode</p>
				<select
					name="metering"
					id="metering"
					bind:value={editingSettings.metering}
				>
					{#each Object.values(Metering) as mode}
						<option value={mode} selected={mode === editingSettings.metering}>{mode}</option>
					{/each}
				</select>
			</div>

			<div class="hstack vcenter space-between w100">
				<p>Gain</p>
				<input
					type="number"
					inputmode="numeric"
					pattern="\d*"
					min="-1"
					max="1"
					name="gain"
					id="gain"
					class="small"
					bind:value={editingSettings.gain}
				/>
			</div>

			<div class="hstack vcenter space-between w100">
				<p>EV Compensation</p>
				<input
					type="number"
					inputmode="numeric"
					pattern="\d*"
					min="-10"
					max="10"
					step="0.1"
					name="ev"
					id="ev"
					class="small"
					bind:value={editingSettings.ev}
				/>
			</div>

			<div class="hstack vcenter space-between w100">
				<p>HDR</p>
				<label class="switch">
					<input type="checkbox" bind:checked={editingSettings.hdr} />
					<span class="slider round"></span>
				</label>
			</div>

			<!-- insert roi -->

			<!-- insert tuning file -->

			<!-- insert sensor mode -->

			<div class="hstack vcenter space-between w100">
				<p>FPS</p>
				<input
					type="number"
					inputmode="numeric"
					pattern="\d*"
					min="1"
					max="120"
					name="fps"
					id="fps"
					class="small"
					bind:value={editingSettings.fps}
				/>
			</div>

			<div class="hstack vcenter space-between w100">
				<p>Focus Mode</p>
				<select
					name="focusMode"
					id="focusMode"
					bind:value={editingSettings.focusMode}
				>
					{#each Object.values(FocusMode) as mode}
						<option value={mode} selected={mode === editingSettings.focusMode}>{mode}</option>
					{/each}
				</select>
			</div>

			<div class="hstack vcenter space-between w100">
				<p>AF Range</p>
				<select
					name="afRange"
					id="afRange"
					bind:value={editingSettings.afRange}
				>
					{#each Object.values(AFRange) as mode}
						<option value={mode} selected={mode === editingSettings.afRange}>{mode}</option>
					{/each}
				</select>
			</div>

			<div class="hstack vcenter space-between w100">
				<p>AF Speed</p>
				<select
					name="afSpeed"
					id="afSpeed"
					bind:value={editingSettings.afSpeed}
				>
					{#each Object.values(AFSpeed) as mode}
						<option value={mode} selected={mode === editingSettings.afSpeed}>{mode}</option>
					{/each}
				</select>
			</div>

			<div class="hstack vcenter space-between w100">
				<p>MF Lens Position</p>
				<div class="hstack vcenter">
					<p>1/(</p>
					<input
						type="number"
						inputmode="numeric"
						pattern="\d*"
						min="0"
						max="20"
						name="mfLensPosition"
						id="mfLensPosition"
						class="small"
						bind:value={editingSettings.mfLensPosition}
					/>
					<p>&nbsp;m)</p>
				</div>
			</div>

			<!-- insert af window -->

			<div class="hstack vcenter space-between w100">
				<p>Flicker Correction Period</p>
				<div class="hstack vcenter">
					<input
						type="number"
						inputmode="numeric"
						pattern="\d*"
						min="0"
						max="1000000"
						name="flickerPeriod"
						id="flickerPeriod"
						bind:value={editingSettings.flickerPeriod}
					/>
					<p>&nbsp;µs</p>
				</div>
			</div>

			<div class="hstack vcenter space-between w100">
				<p>Text Overlay</p>
				<label class="switch">
					<input type="checkbox" bind:checked={editingSettings.textOverlayEnable} />
					<span class="slider round"></span>
				</label>
			</div>

			<div class="hstack vcenter space-between w100">
				<p>Overlay Text Content</p>
				<input
					type="text"
					name="textOverlay"
					id="textOverlay"
					bind:value={editingSettings.textOverlay}
				/>
			</div>

			<div class="hstack vcenter space-between w100">
				<p>Codec</p>
				<select
					name="codec"
					id="codec"
					bind:value={editingSettings.codec}
				>
					{#each Object.values(Codec) as mode}
						<option value={mode} selected={mode === editingSettings.codec}>{mode}</option>
					{/each}
				</select>
			</div>

			<div class="hstack vcenter space-between w100">
				<p>IDR Period</p>
				<div class="hstack vcenter">
					<input
						type="number"
						inputmode="numeric"
						pattern="\d*"
						min="0"
						max="1000000"
						name="flickerPeriod"
						id="flickerPeriod"
						bind:value={editingSettings.flickerPeriod}
					/>
					<p>&nbsp;µs</p>
				</div>
			</div>

			<div class="hstack vcenter space-between w100">
				<p>Bitrate</p>
				<input
					type="number"
					inputmode="numeric"
					pattern="\d*"
					min="10000"
					max="100000000"
					name="bitrate"
					id="bitrate"
					bind:value={editingSettings.bitrate}
				/>
			</div>

			<!-- insert profile -->

			<div class="hstack vcenter space-between w100">
				<p>H264 Level</p>
				<input
					type="text"
					name="h264Level"
					id="h264Level"
					class="small"
					bind:value={editingSettings.h264Level}
				/>
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
		gap: 0.4rem;
		width: 100%;
		height: 100%;
		padding: 0.8rem;
	}

	select {
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

	#config-select {
		width: 100%;
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

		div:hover {
			background: var(--bg-color-3);
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

		:last-child::after {
			opacity: 0;
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
			width: 8rem;
		}

		input[type='text'] {
			width: min(50%, 48rem);
		}

		input.small {
			width: 4rem;
		}

		select {
			width: 10rem;
		}
	}
</style>
