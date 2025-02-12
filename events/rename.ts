import { Dropbox } from "dropbox";
import { TAbstractFile } from 'obsidian';

export default function onRename(dropbox: Dropbox, statusbar: HTMLElement) {
	return (file: TAbstractFile, oldPath: string) => {
			statusbar.setText('Renaming...')

			dropbox.filesMoveV2({
				from_path: `/${oldPath}`,
				to_path: `/${file.path}`
			})
				.then(() => statusbar.setText('Renamed'))
				.catch(() => statusbar.setText('Rename failed'))
			;
	}
}
