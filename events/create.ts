import { Dropbox } from "dropbox";
import { TAbstractFile } from "obsidian";

export default function onCreate(dropbox: Dropbox, statusbar: HTMLElement) {
	return async (file: TAbstractFile & { extension?: string }) => {
		statusbar.setText("Creating...");

		if (file?.extension) {
			dropbox
				.filesUpload({
					path: `/${file.path}`,
				})
				.then(() => statusbar.setText("Created"))
				.catch(() => statusbar.setText("Create failed"));
		} else {
			dropbox
				.filesCreateFolderV2({
					path: `/${file.path}`,
				})
				.then(() => statusbar.setText("Created"))
				.catch(() => statusbar.setText("Create failed"));
		}
	};
}
