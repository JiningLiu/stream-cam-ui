<script lang="ts">
	import 'material-symbols';

	enum Page {
		Home = 'home',
		Extensions = 'extensions',
		Settings = 'settings'
	}

	enum HomeSection {
		Camera = 'camera',
		Terminal = 'terminal',
		Configurations = 'configs'
	}

	const HomeSections = [HomeSection.Camera, HomeSection.Terminal, HomeSection.Configurations];

	function homeSectionSymbol(section: HomeSection): string {
		switch (section) {
			case HomeSection.Camera:
				return 'videocam';
			case HomeSection.Terminal:
				return 'terminal';
			case HomeSection.Configurations:
				return 'tune';
		}
	}

	enum ExtensionsSection {
		Installed = 'installed',
		Search = 'search',
		Develop = 'develop'
	}

	const ExtensionsSections = [
		ExtensionsSection.Installed,
		ExtensionsSection.Search,
		ExtensionsSection.Develop
	];

	function extensionsSectionSymbol(section: ExtensionsSection): string {
		switch (section) {
			case ExtensionsSection.Installed:
				return 'download';
			case ExtensionsSection.Search:
				return 'search';
			case ExtensionsSection.Develop:
				return 'code_blocks';
		}
	}

	enum SettingsSection {
		General = 'general',
		Advanced = 'advanced',
		Data = 'data',
		Development = 'development',
		About = 'about'
	}

	const SettingsSections = [
		SettingsSection.General,
		SettingsSection.Advanced,
		SettingsSection.Data,
		SettingsSection.Development,
		SettingsSection.About
	];

	function settingsSectionSymbol(section: SettingsSection): string {
		switch (section) {
			case SettingsSection.General:
				return 'settings_applications';
			case SettingsSection.Advanced:
				return 'manufacturing';
			case SettingsSection.Data:
				return 'data_object';
			case SettingsSection.Development:
				return 'code_blocks';
			case SettingsSection.About:
				return 'info';
		}
	}

	let page = Page.Home;
	let section = HomeSection.Camera.toString();
	let homeSection = HomeSection.Camera;
	let extensionsSection = ExtensionsSection.Installed;
	let settingsSection = SettingsSection.General;

	$: {
		if (page === Page.Home) {
			section = homeSection;
		} else if (page === Page.Extensions) {
			section = extensionsSection;
		} else if (page === Page.Settings) {
			section = settingsSection;
		}
	}
</script>

<main>
	<!-- dropdown menu -->
	<div id="menu-parent">
		<input id="menu-btn" type="checkbox" name="menu" />
		<label for="menu-btn" class="nav-btn"><span class="material-symbols-rounded">menu</span></label>

		<div id="menu">
			<p>A dropdown menu</p>
		</div>
	</div>

	<!-- top bar -->
	<div id="topbar">
		<button
			id="home"
			class="nav-btn"
			class:selected={page == Page.Home}
			on:click={() => (page = Page.Home)}
		>
			<span class="material-symbols-rounded">home</span>
		</button>

		<button
			id="extensions"
			class="nav-btn"
			class:selected={page == Page.Extensions}
			on:click={() => (page = Page.Extensions)}
		>
			<span class="material-symbols-rounded">extension</span>
		</button>

		<button
			id="settings"
			class="nav-btn"
			class:selected={page == Page.Settings}
			on:click={() => (page = Page.Settings)}
		>
			<span class="material-symbols-rounded">settings</span>
		</button>
	</div>

	<!-- side bar -->
	<div id="sidebar">
		{#if page == Page.Home}
			{#each HomeSections as section}
				<button
					id={section}
					class="nav-btn"
					class:selected={homeSection == section}
					on:click={() => (homeSection = section)}
				>
					<span class="material-symbols-rounded">{homeSectionSymbol(section)}</span>
				</button>
			{/each}
		{:else if page == Page.Extensions}
			{#each ExtensionsSections as section}
				<button
					id={section}
					class="nav-btn"
					class:selected={extensionsSection == section}
					on:click={() => (extensionsSection = section)}
				>
					<span class="material-symbols-rounded">{extensionsSectionSymbol(section)}</span>
				</button>
			{/each}
		{:else if page == Page.Settings}
			{#each SettingsSections as section}
				<button
					id={section}
					class="nav-btn"
					class:selected={settingsSection == section}
					on:click={() => (settingsSection = section)}
				>
					<span class="material-symbols-rounded">{settingsSectionSymbol(section)}</span>
				</button>
			{/each}
		{/if}
	</div>

	<!-- page content -->
	<div id="content">
		<iframe title="content" src="/{page}/{section}" frameborder="0"></iframe>
	</div>
</main>

<!-- too small content -->
<div id="too-small">
	<h1>2smol!</h1>
	<p>Make the window bigger</p>
</div>

<style>
	:global(:root) {
		overflow: hidden;
	}

	main {
		display: grid;
		grid-template-columns: 3rem 1fr;
		grid-template-rows: 3rem 1fr;
		gap: 0.6rem;
		padding: 0.6rem;
		width: 100%;
		height: 100%;
	}

	#menu-parent,
	#topbar,
	#sidebar {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.2rem;
		padding: 0.4rem;
		background-color: var(--bg-color-2);
	}

	#menu-parent {
		grid-row: 1;
		grid-column: 1;
		border-radius: 0.8rem 0.4rem 0.4rem 0.4rem;

		#menu-btn {
			display: none;
		}

		label {
			color: var(--secondary-color);
		}

		#menu {
			display: none;
			position: absolute;
			top: 3.9rem;
			left: 0.6rem;
			width: 10rem;
			height: fit-content;
			padding: 0.6rem;
			background-color: var(--bg-color-3);
			border-radius: 0.4rem;
		}

		#menu-btn:checked ~ #menu {
			display: block;
		}
	}

	#topbar,
	#sidebar {
		button::before {
			content: '';
			position: absolute;
			opacity: 0;
			background: var(--primary-color);
			transition-property: opacity left width height;
			transition: 0.2s ease-in-out;
		}

		button.selected::before {
			opacity: 1;
		}
	}

	#topbar {
		flex-direction: row;
		grid-row: 1;
		grid-column: 2;
		border-radius: 0.4rem 0.8rem 0.4rem 0.4rem;

		button::before {
			left: 50%;
			bottom: -0.4rem;
			width: 0%;
			height: 0.2rem;
			border-radius: 0.2rem 0.2rem 0 0;
		}

		button.selected::before {
			left: 15%;
			width: 70%;
			height: 0.2rem;
		}
	}

	#sidebar {
		flex-direction: column;
		grid-row: 2;
		grid-column: 1;
		border-radius: 0.4rem 0.4rem 0.4rem 0.8rem;

		button::before {
			top: 50%;
			right: -0.4rem;
			width: 0.2rem;
			height: 0%;
			border-radius: 0.2rem 0 0 0.2rem;
		}

		button.selected::before {
			width: 0.2rem;
			height: 70%;
			top: 15%;
		}
	}

	#content {
		grid-row: 2;
		grid-column: 2;
		background-color: var(--bg-color-2);
		border-radius: 0.4rem 0.4rem 0.8rem 0.4rem;

		iframe {
			width: 100%;
			height: 100%;
			border-radius: 0.4rem 0.4rem 0.8rem 0.4rem;
		}
	}

	.nav-btn {
		color: var(--primary-color);
		display: flex;
		position: relative;
		align-items: center;
		justify-content: center;
		width: 2.2rem;
		height: 2.2rem;
		background: var(--bg-color-2);
		border: none;
		border-radius: 0.4rem;
		cursor: pointer;
		-webkit-user-select: none;
		user-select: none;
		transition: background 0.2s;
	}

	.nav-btn:hover {
		background: var(--bg-color-3);
	}

	#too-small {
		position: absolute;
		top: 0;
		left: 0;
		padding: 0.4rem;
		width: 100%;
		height: 100%;
		z-index: 9999;
		display: none;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		text-align: center;
		background: var(--bg-color-4);
	}

	@media (max-width: 24rem) or (max-height: 18rem) {
		main {
			display: none;
		}

		#too-small {
			display: flex;
		}
	}
</style>
