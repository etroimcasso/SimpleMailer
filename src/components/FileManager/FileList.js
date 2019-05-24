import React, { Component, Fragment } from 'react'
import { observer, inject } from "mobx-react"
import FileListCardItem from './FileListCardItem'
import ItemsPlaceholderSegment from '../bits/ItemsPlaceholderSegment'
const UIStrings = require('../../config/UIStrings')

const styles = {
	fileListItemCard: {
		width: '200px',
		height: '150px',
		maxWidth: '200px',
		maxHeight: '150px'
	}
}

export default inject("fileManagerState")(observer(class FileList extends Component {

	render() {

		const { fileManagerState: FileManagerState } = this.props
		const { fileListing: files, fileListingLoaded: filesLoaded, filesCount: numberOfFiles } = FileManagerState
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