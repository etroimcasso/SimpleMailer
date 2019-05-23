import React, { Component, Fragment } from 'react'
import { observer, inject } from "mobx-react"
import { List } from 'semantic-ui-react'
import FileListCardItem from './FileListCardItem'
const UIStrings = require('../../config/UIStrings')

export default inject("fileSystemState")(observer(class FileList extends Component {

	render() {

		const { fileSystemState: FileSystemState } = this.props
		const { fileListing: files, fileListingLoaded: filesLoaded, filesCount: numberOfFiles } = FileSystemState
		return(
			<List>
					{(numberOfFiles > 0) ? files.map((file) => { 
						return (
								<List.Item>
									<FileListCardItem file={file} />
								</List.Item>
							)
				}) : null}
			</List>
		)
	}

}))