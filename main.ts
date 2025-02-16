import { App, Plugin, PluginSettingTab, Setting } from "obsidian";
import { Dropbox } from "dropbox";
import onCreate from "./events/create";
import onModify from "./events/modify";
import onRename from "./events/rename";
import onDelete from "./events/delete";

interface DropboxPluginSettings {
	accessToken: string;
}

const DEFAULT_SETTINGS: DropboxPluginSettings = {
	accessToken: "",
};

export default class DropboxPlugin extends Plugin {
	settings: DropboxPluginSettings;

	async onload() {
		await this.loadSettings();

		const dropbox = new Dropbox({ accessToken: this.settings.accessToken });
		const statusBarItemEl = this.addStatusBarItem();

		this.addSettingTab(new DropboxPluginSettingTab(this.app, this));

		this.registerEvent(
			this.app.vault.on("create", onCreate(dropbox, statusBarItemEl)),
		);
		this.registerEvent(
			this.app.vault.on("modify", onModify(dropbox, statusBarItemEl)),
		);
		this.registerEvent(
			this.app.vault.on("rename", onRename(dropbox, statusBarItemEl)),
		);
		this.registerEvent(
			this.app.vault.on("delete", onDelete(dropbox, statusBarItemEl)),
		);
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class DropboxPluginSettingTab extends PluginSettingTab {
	plugin: DropboxPlugin;

	constructor(app: App, plugin: DropboxPlugin) {
		super(app, plugin);

		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName("Dropbox access token")
			.setDesc(
				"Access token for Dropbox account so changes can be synced (https://www.dropbox.com/developers/apps)",
			)
			.addText((text) =>
				text
					.setPlaceholder("Enter access token")
					.setValue(this.plugin.settings.accessToken)
					.onChange(async (value) => {
						this.plugin.settings.accessToken = value;
						await this.plugin.saveSettings();
					}),
			);
	}
}
