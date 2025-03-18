<script lang="ts">
	import { onMount } from 'svelte';
	import 'material-symbols';

	let protocol: string | undefined;
	let hostname: string | undefined;

	let extensions: any[] = [];

	let selected: string | undefined;
	let enabled: boolean | undefined;
	let refresh: number | undefined;

	onMount(async () => {
		protocol = location.protocol;
		hostname = location.hostname;

		try {
			const allRes = await fetch(`${protocol}//${hostname}:6400/all`, {
				method: 'GET'
			});
			const allExtensions = Array.from(await allRes.json());
			extensions = allExtensions;
		} catch {}
	});

	function configureExtension(extension: string) {
		enabled = undefined;
		selected = extension;

		refresh = setInterval(async () => {
			const res = await fetch(`${protocol}//${hostname}:6400/status/${extension}`, {
				method: 'GET'
			});
			const json = await res.json();
			enabled = json['isOn'];
		}, 1000);
	}

	$: {
		if (selected == undefined) {
			clearInterval(refresh);
			refresh = undefined;
		}
	}
</script>

<main>
	{#each extensions as extension}
		<card>
			<div class="info">
				<h3>{extension.name}</h3>
				<h5>by {extension.developer}</h5>
				<p class="description">{extension.description}</p>
			</div>

			<div class="actions">
				<h5>
					<span class="material-symbols-outlined">code</span><a
						target="_blank"
						href="https://github.com/{extension.user}/{extension.repo}"
						>{extension.user}/{extension.repo}</a
					>
				</h5>
				<button on:click={() => configureExtension(`${extension.user}/${extension.repo}`)}
					><span class="material-symbols-rounded">build</span> Configure</button
				>
			</div>
		</card>
	{/each}
</main>

{#if selected}
	<config>
		<container>
			<div class="hstack vcenter space-between w100">
				<p>Enabled</p>
				{#if enabled !== undefined}
					<label class="switch">
						<input
							type="checkbox"
							bind:checked={enabled}
							on:change={() => {
								fetch(`${protocol}//${hostname}:6400/toggle/${selected}`, {
									method: 'POST'
								});
							}}
						/>
						<span class="slider round"></span>
					</label>
				{:else}
					???
				{/if}
			</div>
			<button on:click={() => { selected = undefined }}>[X]</button>
		</container>
	</config>
{/if}

<style>
	:global(:root) {
		background: transparent;
	}

	main {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(24rem, 1fr));
		gap: 0.4rem;
		width: 100%;
		height: 100%;
		padding: 0.4rem;
	}

	card {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		gap: 0.4rem;
		width: 100%;
		height: 10rem;
		padding: 0.8rem;
		background: var(--bg-color-3);
		border-radius: 0.4rem;

		.info {
			display: flex;
			flex-direction: column;
			gap: 0.2rem;
		}

		.actions {
			display: flex;
			flex-direction: row;
			align-items: flex-end;
			justify-content: space-between;
		}

		h3 {
			font-size: 1.2rem;
			font-weight: 600;
		}

		h5 {
			font-size: 0.8rem;
			font-weight: 300;
		}

		h5 span {
			font-size: 1rem;
			font-weight: 500;
		}

		h5 {
			display: flex;
			align-items: center;
			gap: 0.2rem;
		}

		p {
			font-size: 0.9rem;
			font-weight: 300;
		}

		a {
			position: relative;
			color: var(--action-color);
		}

		a::before {
			content: '';
			opacity: 0;
			width: 0;
			height: 0.05rem;
			background: var(--action-color);
			position: absolute;
			left: 0;
			bottom: -2%;
			transition: all ease-in-out 0.1s;
		}

		a::after {
			content: '↗';
			opacity: 0;
			font-size: 1rem;
			font-weight: 400;
			position: absolute;
			left: 102%;
			bottom: 50%;
			transform: translate(0, 50%);
			transition: all ease-in-out 0.1s;
		}

		a:hover::after {
			opacity: 1;
		}

		a:hover::before {
			width: 100%;
			opacity: 0.5;
		}

		.description {
			padding: 0.2rem 0;
		}

		button {
			display: flex;
			align-items: center;
			justify-content: center;
			gap: 0.2rem;
			padding: 0.25rem 0.5rem;
			background: var(--bg-color-2);
			color: var(--primary-color);
			font-size: 0.9rem;
			font-weight: 500;
			border: none;
			border-radius: 0.4rem;
			cursor: pointer;
			transition: background 0.2s;
		}

		button:hover {
			background: var(--bg-color-1);
		}
	}

	config {
		position: absolute;
		display: flex;
		justify-content: center;
		align-items: center;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: #66666666;

		container {
			width: min(80vw, 60rem);
			height: min(80vh, 40rem);
			padding: 1rem;
			background: var(--bg-color-1);
			box-shadow: 0 0 2rem #66666666;
			border-radius: 1rem;
		}
	}
</style>
