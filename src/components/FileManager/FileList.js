import React, { Component, Fragment } from 'react'
import { observer, inject } from "mobx-react"
import FilesHelper from '../../helpers/FilesHelper'
import FileListItem from './FileListItem'
const UIStrings = require('../../config/UIStrings')
const FileHelper = new FilesHelper()

export default inject("fileSystemState")(observer(class FileList extends Component {

	render() {

		const { fileSystemState: FileSystemState } = this.props
		const { mailerContentFiles: files, mailerContentFilesLoaded: filesLoaded, filesCount: numberOfFiles } = FileSystemState
		return(
			<Fragment>
					{(numberOfFiles > 0) ? files.map((file) => { 
						return (
								<FileListItem file={file} />
							)
				}) : null}
			</Fragment>
		)
	}

}))