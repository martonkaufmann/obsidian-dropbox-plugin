import { Dropbox } from "dropbox";

export default function onModify(dropbox: Dropbox, statusbar: HTMLElement) {
	return async () => {
			statusbar.setText('Syncing...')

			const activeFile = this.app.workspace.getActiveFile()

			if (activeFile === null) {
				statusbar.setText('Failed to get active file')

				return;
			}

			const contents = await this.app.vault.read(activeFile);

			dropbox.filesUpload({
				path: `/${activeFile.path}`,
				mode: { '.tag': 'overwrite' },
				contents
			})
				.then(() => statusbar.setText('Synced'))
				.catch(() => statusbar.setText('Sync failed'))
			;
	}
}
