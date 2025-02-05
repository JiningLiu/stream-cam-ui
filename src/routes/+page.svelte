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
	let homeSection = HomeSection.Camera;
	let extensionsSection = ExtensionsSection.Installed;
	let settingsSection = SettingsSection.General;
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
		<h1>Page</h1>
		<p>Page content123</p>
	</div>
</main>

<!-- too small content -->
<div id="too-small">
	<h1>2smol!</h1>
	<p>Make the window bigger</p>
</div>

<style>
	@import 'styles.css';
</style>
