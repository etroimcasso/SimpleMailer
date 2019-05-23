import React, { Component, Fragment } from 'react'
import { observer, inject } from "mobx-react"
import FileListCardItem from './FileListCardItem'
const UIStrings = require('../../config/UIStrings')

const styles = {
	fileListItemCard: {
		width: '200px',
		height: '150px',
		maxWidth: '200px',
		maxHeight: '150px'
	}
}

export default inject("fileSystemState")(observer(class FileList extends Component {

	render() {

		const { fileSystemState: FileSystemState } = this.props
		const { fileListing: files, fileListingLoaded: filesLoaded, filesCount: numberOfFiles } = FileSystemState
		return(
			<Fragment>
				{(numberOfFiles > 0) ? files.map((file) => { 
					return (
						<div style={styles.fileListItemCard}>
							<FileListCardItem file={file} />
						</div>
					)
				}) : null}
			</Fragment>
		)
	}

}))