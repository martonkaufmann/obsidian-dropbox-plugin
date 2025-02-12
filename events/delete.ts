import { Dropbox } from "dropbox";
import { TAbstractFile } from 'obsidian';

export default function onDelete(dropbox: Dropbox, statusbar: HTMLElement) {
	return (file: TAbstractFile) => {
			statusbar.setText('Deleting...')

			dropbox.filesDeleteV2({
				path: `/${file.path}`
			})
				.then(() => statusbar.setText('Deleted'))
				.catch(() => statusbar.setText('Delete failed'))
			;
	}
}
